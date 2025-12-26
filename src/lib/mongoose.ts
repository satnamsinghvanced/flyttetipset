import mongoose from 'mongoose';

declare global {
    var mongoose: {
        conn: typeof mongoose | any;
        promise: Promise<typeof mongoose> | null;
        lastConnected: number | null;
        retryCount: number;
        isConnecting: boolean;
        cleanupSetup?: boolean;
    } | any;
}

// Constants
const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI ?? '';
const DB_NAME = process.env.MONGODB_DB_NAME || 'dev';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const CONNECTION_TIMEOUT = 30000;
const SOCKET_TIMEOUT = 45000;
const HEARTBEAT_FREQUENCY = 10000;

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable');
}

// Initialize cached connection
const cached = global.mongoose || {
    conn: null as typeof mongoose | null,
    promise: null as Promise<typeof mongoose> | null,
    lastConnected: null as number | null,
    retryCount: 0,
    isConnecting: false,
    cleanupSetup: false,
};

if (!global.mongoose) {
    global.mongoose = cached;
}

const connectionOptions: mongoose.ConnectOptions = {
    dbName: DB_NAME,
    bufferCommands: false,
    // maxPoolSize: 10,
    minPoolSize: 1,
    socketTimeoutMS: SOCKET_TIMEOUT,
    connectTimeoutMS: CONNECTION_TIMEOUT,
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: HEARTBEAT_FREQUENCY,
    retryWrites: true,
    retryReads: true,
    maxIdleTimeMS: 30000,
    waitQueueTimeoutMS: 5000,
};

function handleConnectionError(error: unknown, operation: string): never {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`MongoDB ${operation} failed:`, errorMessage);
    cached.promise = null;
    cached.isConnecting = false;
    throw new Error(`Database ${operation} failed: ${errorMessage}`);
}

async function retryOperation<T>(
    operation: () => Promise<T>,
    operationName: string
): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;
            console.warn(`MongoDB ${operationName} attempt ${attempt} failed:`, error);

            if (attempt === MAX_RETRIES) break;

            const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
            console.log(`Retrying ${operationName} in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError!;
}

export async function checkDatabaseHealth(): Promise<{
    healthy: boolean;
    pingTime?: number;
    error?: string;
    connectionStatus?: string;
}> {
    try {
        if (!cached.conn) {
            return {
                healthy: false,
                error: 'No active connection',
                connectionStatus: 'disconnected'
            };
        }

        const startTime = Date.now();
        await cached.conn.connection.db.admin().ping();
        const pingTime = Date.now() - startTime;
        return {
            healthy: true,
            pingTime,
            connectionStatus: cached.conn.connection.readyState === 1 ? 'connected' : 'disconnected'
        };
    } catch (error) {
        return {
            healthy: false,
            error: error instanceof Error ? error.message : 'Health check failed',
            connectionStatus: 'error'
        };
    }
}

export async function closeDatabaseConnection(): Promise<void> {
    try {
        if (cached.conn) {
            await cached.conn.connection.close();
            console.log('MongoDB connection closed gracefully');
        }
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    } finally {
        cached.conn = null;
        cached.promise = null;
        cached.lastConnected = null;
        cached.retryCount = 0;
        cached.isConnecting = false;
    }
}

function setupConnectionEventHandlers(mongooseInstance: typeof mongoose) {
    const connection = mongooseInstance.connection;

    connection.on('connected', () => {
        console.log('MongoDB connected successfully');
        cached.lastConnected = Date.now();
        cached.retryCount = 0;
    });

    connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
    });

    connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
    });

    if (!cached.cleanupSetup) {
        process.on('SIGINT', async () => {
            await closeDatabaseConnection();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await closeDatabaseConnection();
            process.exit(0);
        });
        cached.cleanupSetup = true;
    }
}

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) {
        try {
            await cached.conn.connection.db.admin().ping();
            return cached.conn;
        } catch (error) {
            console.warn('Existing connection unhealthy, reconnecting...', error);
            cached.conn = null;
        }
    }

    if (cached.isConnecting) {
        console.log('Connection in progress, waiting...');
        return await cached.promise;

    }

    cached.isConnecting = true;

    try {
        cached.promise = retryOperation(async () => {
            console.log('Connecting to MongoDB...');

            const mongooseInstance = await mongoose.connect(MONGODB_URI, connectionOptions);

            setupConnectionEventHandlers(mongooseInstance);

            cached.conn = mongooseInstance;
            cached.isConnecting = false;

            return mongooseInstance;
        }, 'connection');

        return await cached.promise;
    } catch (error) {
        cached.isConnecting = false;
        cached.promise = null;
        handleConnectionError(error, 'connection');
    }
}

export function getConnectionStatus(): {
    connected: boolean;
    state: number;
    lastConnected: number | null;
    retryCount: number;
} {
    return {
        connected: cached.conn?.connection?.readyState === 1,
        state: cached.conn?.connection?.readyState || 0,
        lastConnected: cached.lastConnected,
        retryCount: cached.retryCount,
    };
}

if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    setInterval(async () => {
        try {
            const health = await checkDatabaseHealth();
            if (!health.healthy && cached.conn) {
                console.warn('Database health check failed, attempting reconnect...');
                await closeDatabaseConnection();
            }
        } catch (error) {
            console.error('Health check interval error:', error);
        }
    }, 60000);
}