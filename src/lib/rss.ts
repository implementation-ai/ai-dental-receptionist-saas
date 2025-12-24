import { format } from 'date-fns';

export interface Article {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    image: string;
    link: string;
}

export async function getFeed(url: string): Promise<Article[]> {
    try {
        const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
        const xmlText = await response.text();

        const items = xmlText.split('<item>');
        // Remove the first part (channel metadata)
        items.shift();

        return items.slice(0, 6).map((item, index) => {
            const title = extractTag(item, 'title') || 'Sin título';
            const link = extractTag(item, 'link') || '#';
            const pubDate = extractTag(item, 'pubDate');
            const description = extractTag(item, 'description') || '';

            // Clean up description (remove HTML tags)
            const cleanDescription = description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';

            // Simple category extraction or default
            const category = extractTag(item, 'category') || 'Noticias';

            return {
                id: `rss-${index}`,
                title: title.replace('<![CDATA[', '').replace(']]>', ''),
                excerpt: cleanDescription.replace('<![CDATA[', '').replace(']]>', ''),
                category: category.replace('<![CDATA[', '').replace(']]>', ''),
                date: pubDate ? format(new Date(pubDate), 'd MMM, yyyy') : 'Reciente',
                image: '📰', // Default icon for RSS items
                link: link
            };
        });
    } catch (error) {
        console.error("Error fetching RSS feed:", error);
        return [];
    }
}

function extractTag(xml: string, tag: string): string | null {
    const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 's');
    const match = xml.match(regex);
    return match ? match[1].trim() : null;
}
