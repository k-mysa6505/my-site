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