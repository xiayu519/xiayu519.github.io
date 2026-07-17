import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export function getPostSlug(post: BlogPost): string {
	return post.data.slug ?? post.id.replace(/\.(md|mdx)$/i, '');
}

export function getPostUrl(post: BlogPost): string {
	return `/blog/${getPostSlug(post)}/`;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getReadingMinutes(body: string | undefined): number {
	if (!body) return 1;
	const chineseCharacters = (body.match(/[\u3400-\u9fff]/g) ?? []).length;
	const latinWords = (body.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9_]+/g) ?? []).length;
	return Math.max(1, Math.ceil(chineseCharacters / 400 + latinWords / 220));
}

export function countTaxonomy(posts: BlogPost[], field: 'tags' | 'category'): Map<string, number> {
	const counts = new Map<string, number>();
	for (const post of posts) {
		const values = field === 'tags' ? post.data.tags : [post.data.category];
		for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
	}
	return new Map([...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN')));
}

// 把分类/标签名转成稳健的 URL 片段：小写、空格转连字符、去掉标点、保留中文。
export function slugify(input: string): string {
	return input
		.trim()
		.toLowerCase()
		.replace(/[\s_]+/g, '-')
		.replace(/[^\w㐀-鿿-]/g, '')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '');
}
