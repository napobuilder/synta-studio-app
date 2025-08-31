import { marked } from 'marked';
import type { Product } from '../types';

// Define un tipo local para los items de la lista para evitar el uso de 'any'
interface MarkdownListItem {
    text: string;
}

export const parseProductsFromMarkdown = (markdown: string): Product[] => {
    const tokens = marked.lexer(markdown);
    const products: Product[] = [];
    let currentProduct: Partial<Product> | null = null;

    tokens.forEach(token => {
        if (token.type === 'heading' && token.depth === 3) {
            if (currentProduct && 'id' in currentProduct) {
                products.push(currentProduct as Product);
            }
            const typeMatch = token.text.match(/\[(.*?)\]/);
            const type = typeMatch ? typeMatch[1].toLowerCase().replace(/ /g, '-') : 'unknown';
            const title = token.text.replace(/\[.*?\]\s*/, '');
            currentProduct = { title, type, tags: [] };
        } else if (token.type === 'list' && currentProduct) {
            token.items.forEach((item: MarkdownListItem) => {
                const text = item.text.trim();
                const keyMatch = text.match(/\*\*(.*?):\*\*/);
                if (!keyMatch) return;

                const key = keyMatch[1].toLowerCase();
                const value = text.substring(keyMatch[0].length).trim();

                switch (key) {
                    case 'id':
                        currentProduct!.id = value.replace(/`/g, '');
                        break;
                    case 'descripción':
                        currentProduct!.description = value.replace(/"/g, '');
                        break;
                    case 'precio':
                        currentProduct!.price = parseInt(value, 10) || 0;
                        break;
                    case 'precio anterior':
                        currentProduct!.originalPrice = parseInt(value, 10) || undefined;
                        break;
                    case 'tags':
                        currentProduct!.tags = value.split(', ').map((tag: string) => tag.trim());
                        break;
                    case 'imagen':
                        currentProduct!.imageUrl = value.replace(/`/g, '');
                        break;
                    case 'url de compra':
                        currentProduct!.purchaseUrl = value.replace(/`/g, '');
                        break;
                }
            });
        }
    });

    if (currentProduct && 'id' in currentProduct) {
        products.push(currentProduct as Product);
    }

    return products;
};