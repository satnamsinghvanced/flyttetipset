export function capitalizeTitle(slug: string): string {
    if (!slug || typeof slug !== 'string') {
        return '';
    }

    return slug
        .replace(/_/g, '-')
        .split('-')
        .filter(Boolean)
        ?.map(word => word[0]?.toUpperCase() + word.slice(1))
        .join(' ');
}
