import { checkDatabaseHealth, getConnectionStatus } from "@/lib/mongoose";

export async function GET() {
    try {
        const dbHealth = await checkDatabaseHealth();
        const connectionStatus = getConnectionStatus();

        return Response.json({
            database: dbHealth,
            connection: connectionStatus,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.log('error at health check: ', error)
        return Response.json({
            database: { healthy: false, error: 'Health check failed' },
            timestamp: new Date().toISOString(),
        }, { status: 503 });
    }
}