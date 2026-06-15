import { db, saveDatabase } from '../db/database.js';
import { EncyclopediaArticle, EncyclopediaCategory } from '../../shared/types.js';

export class EncyclopediaRepository {
  async findAll(
    page?: number,
    pageSize?: number,
    category?: EncyclopediaCategory,
    keyword?: string
  ): Promise<{ articles: EncyclopediaArticle[]; total: number }> {
    await db.read();
    
    let articles = [...db.data.encyclopediaArticles]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (category) {
      articles = articles.filter(a => a.category === category);
    }

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(lowerKeyword) ||
        a.summary.toLowerCase().includes(lowerKeyword)
      );
    }

    const total = articles.length;

    let paginatedArticles = articles;
    if (page !== undefined && pageSize !== undefined) {
      const start = (page - 1) * pageSize;
      paginatedArticles = articles.slice(start, start + pageSize);
    }

    return { articles: paginatedArticles, total };
  }

  async findById(id: number): Promise<EncyclopediaArticle | undefined> {
    await db.read();
    return db.data.encyclopediaArticles.find(a => a.id === id);
  }

  async incrementViewCount(id: number): Promise<void> {
    await db.read();
    const article = db.data.encyclopediaArticles.find(a => a.id === id);
    if (article) {
      article.viewCount += 1;
      await saveDatabase();
    }
  }

  async create(
    article: Omit<EncyclopediaArticle, 'id' | 'viewCount' | 'createdAt' | 'updatedAt'>
  ): Promise<EncyclopediaArticle> {
    await db.read();
    const now = new Date().toISOString();
    const newArticle: EncyclopediaArticle = {
      ...article,
      id: Math.max(0, ...db.data.encyclopediaArticles.map(a => a.id)) + 1,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    db.data.encyclopediaArticles.push(newArticle);
    await saveDatabase();
    return newArticle;
  }

  async update(
    id: number,
    updates: Partial<Omit<EncyclopediaArticle, 'id' | 'viewCount' | 'createdAt' | 'updatedAt'>>
  ): Promise<EncyclopediaArticle | undefined> {
    await db.read();
    const index = db.data.encyclopediaArticles.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    const updatedArticle: EncyclopediaArticle = {
      ...db.data.encyclopediaArticles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    db.data.encyclopediaArticles[index] = updatedArticle;
    await saveDatabase();
    return updatedArticle;
  }

  async delete(id: number): Promise<boolean> {
    await db.read();
    const index = db.data.encyclopediaArticles.findIndex(a => a.id === id);
    if (index === -1) return false;
    db.data.encyclopediaArticles.splice(index, 1);
    await saveDatabase();
    return true;
  }
}
