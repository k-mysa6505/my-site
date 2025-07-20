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