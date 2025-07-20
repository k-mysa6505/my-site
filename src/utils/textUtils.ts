// テキストを1行に制限し、「...」を付ける関数
export function truncateText(text: string, maxLength: number = 100): string {
    if (!text) return '';
    
    // HTMLタグを除去
    const plainText = text.replace(/<[^>]*>/g, '');
    
    // 改行を除去して1行にする
    const singleLine = plainText.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\t/g, ' ');
    
    // 連続する空白を1つに
    const trimmed = singleLine.replace(/\s+/g, ' ').trim();
    
    if (trimmed.length <= maxLength) {
        return trimmed;
    }
    
    // 指定された長さで切り取り、「...」を追加
    return trimmed.substring(0, maxLength) + '...';
} 