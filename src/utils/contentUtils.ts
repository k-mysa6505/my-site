export async function getContentList(type: 'blog' | 'works') {
    let allFiles;
    if (type === 'blog') {
        allFiles = import.meta.glob('/src/content/blog/*.md', { eager: true });
    } else {
        allFiles = import.meta.glob('/src/content/works/*.md', { eager: true });
    }
    return Object.entries(allFiles).map(([filepath, module]) => {
        const moduleAny = module as any;
        const slug = filepath.split("/").pop()?.replace(".md", "") || "";
        const thumbnail = moduleAny.frontmatter?.thumbnail
            ? `/images/${type}/${moduleAny.frontmatter.thumbnail}`
            : null;
        let excerpt = moduleAny.frontmatter?.excerpt;
        if (!excerpt) {
            const rawContent = typeof moduleAny.rawContent === 'string' ? moduleAny.rawContent : "";
            const lines = rawContent.split('\n').map((line: string) => line.trim());
            excerpt = lines.find((line: string) => line && !line.startsWith('![') && !line.startsWith('#')) || "";
        }
        return {
            slug,
            title: moduleAny.frontmatter?.title || "タイトルなし",
            date: moduleAny.frontmatter?.date || "1900-01-01",
            thumbnail,
            excerpt,
            url: `/${type}/${slug}`,
            frontmatter: moduleAny.frontmatter || {},
        };
    });
}

// ページネーション計算用の共通関数
export function calculatePagination(
    allItems: any[],
    itemsPerPage: number,
    currentPage: number
) {
    const totalItems = allItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = allItems.slice(startIndex, endIndex);

    return {
        currentItems,
        totalPages,
        currentPage,
        totalItems,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
    };
}

// 現在のページを取得する共通関数
export function getCurrentPage(searchParams: URLSearchParams): number {
    const pageParam = searchParams.get('page');
    
    if (pageParam) {
        const page = parseInt(pageParam);
        return isNaN(page) || page < 1 ? 1 : page;
    }
    return 1;
}

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