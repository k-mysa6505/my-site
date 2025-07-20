const defaultDateStr = "1900-01-01";
const noneTitleStr = "タイトルなし";

export async function getContentList(type: 'blog' | 'works') {
    let allFiles;
    if (type === 'blog') {  //  if文を消せないのがくやしい
        allFiles = import.meta.glob(`/public/content/blog/*/index.md`, {eager: true});
    } else {
        allFiles = import.meta.glob(`/public/content/works/*/index.md`, {eager: true});
    }

    return Object.entries(allFiles).map(([filepath, module]) => {
        const moduleAny = module as any;

        const title = moduleAny.frontmatter?.title || noneTitleStr;
        const date  = moduleAny.frontmatter?.date || defaultDateStr;
        const dateNoSlash = date.replace(/\//g, "");
        const thumbnail = moduleAny.frontmatter?.thumbnail
            ? `/content/${type}/${dateNoSlash}/${moduleAny.frontmatter.thumbnail}`
            : null;
        let excerpt = moduleAny.frontmatter?.excerpt;
        if (!excerpt) {
            const rawContent = typeof moduleAny.rawContent === 'string' ? moduleAny.rawContent : "";
            const lines = rawContent.split('\n').map((line: string) => line.trim());
            excerpt = lines.find((line: string) => line && !line.startsWith('![') && !line.startsWith('#')) || "";
        }
        const url = `/${type}/${dateNoSlash}`;
        const frontmatter = moduleAny.frontmatter || {};

        return {slug:dateNoSlash, title, date, thumbnail, excerpt, url, frontmatter };
    });
}