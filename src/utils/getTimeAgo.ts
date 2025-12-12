export function getTimeAgo(timeString: string): Date {
    const multipliers: Record<string, number> = {
        'd': 24 * 60 * 60 * 1000, // days
        'h': 60 * 60 * 1000,      // hours
        'm': 60 * 1000,           // minutes
        's': 1000                 // seconds
    };

    let totalMs = 0;
    const regex = /(\d+)([dhms])/g;
    let match;

    while ((match = regex.exec(timeString)) !== null) {
        const value = parseInt(match[1]);
        const unit = match[2];
        totalMs += value * (multipliers[unit] || 0);
    }

    if (totalMs === 0) {
        // Try to parse as plain seconds
        const seconds = parseInt(timeString);
        if (!isNaN(seconds)) {
            totalMs = seconds * 1000;
        } else {
            throw new Error(`Invalid time string: ${timeString}`);
        }
    }

    return new Date(Date.now() - totalMs);
}