export function truncateText(text: string, maxLength: number = 100): string {
    if (!text) return '';
    const plainText = text.replace(/<[^>]*>/g, '');
    const singleLine = plainText.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\t/g, ' ');
    const trimmed = singleLine.replace(/\s+/g, ' ').trim();
    if (trimmed.length <= maxLength) {
        return trimmed;
    }
    return trimmed.substring(0, maxLength) + '...';
}
