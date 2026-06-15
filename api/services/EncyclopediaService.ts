import { EncyclopediaRepository } from '../repositories/EncyclopediaRepository.js';
import {
  EncyclopediaArticle,
  EncyclopediaCategory,
  CreateEncyclopediaRequest,
  UpdateEncyclopediaRequest,
} from '../../shared/types.js';

const encyclopediaRepository = new EncyclopediaRepository();

export class EncyclopediaService {
  async getArticles(
    page?: number,
    pageSize?: number,
    category?: EncyclopediaCategory,
    keyword?: string
  ): Promise<{ articles: EncyclopediaArticle[]; total: number }> {
    return encyclopediaRepository.findAll(page, pageSize, category, keyword);
  }

  async getArticleById(id: number): Promise<EncyclopediaArticle | undefined> {
    const article = await encyclopediaRepository.findById(id);
    if (article) {
      await encyclopediaRepository.incrementViewCount(id);
      const updated = await encyclopediaRepository.findById(id);
      return updated;
    }
    return article;
  }

  async createArticle(
    request: CreateEncyclopediaRequest
  ): Promise<EncyclopediaArticle | { error: string }> {
    if (!request.title || request.title.trim().length === 0) {
      return { error: '文章标题不能为空' };
    }
    if (!request.category) {
      return { error: '文章分类不能为空' };
    }
    if (!request.summary || request.summary.trim().length === 0) {
      return { error: '文章摘要不能为空' };
    }
    if (!request.content || request.content.trim().length === 0) {
      return { error: '文章内容不能为空' };
    }
    if (!request.coverImage) {
      return { error: '封面图片不能为空' };
    }
    if (!request.author || request.author.trim().length === 0) {
      return { error: '作者不能为空' };
    }

    const newArticle = await encyclopediaRepository.create({
      title: request.title.trim(),
      category: request.category,
      summary: request.summary.trim(),
      content: request.content.trim(),
      coverImage: request.coverImage,
      images: request.images || [],
      author: request.author.trim(),
    });

    return newArticle;
  }

  async updateArticle(
    id: number,
    request: UpdateEncyclopediaRequest
  ): Promise<EncyclopediaArticle | { error: string } | undefined> {
    const existing = await encyclopediaRepository.findById(id);
    if (!existing) {
      return undefined;
    }

    const updates: Partial<Omit<EncyclopediaArticle, 'id' | 'viewCount' | 'createdAt' | 'updatedAt'>> = {};

    if (request.title !== undefined) {
      if (request.title.trim().length === 0) {
        return { error: '文章标题不能为空' };
      }
      updates.title = request.title.trim();
    }

    if (request.category !== undefined) {
      updates.category = request.category;
    }

    if (request.summary !== undefined) {
      if (request.summary.trim().length === 0) {
        return { error: '文章摘要不能为空' };
      }
      updates.summary = request.summary.trim();
    }

    if (request.content !== undefined) {
      if (request.content.trim().length === 0) {
        return { error: '文章内容不能为空' };
      }
      updates.content = request.content.trim();
    }

    if (request.coverImage !== undefined) {
      if (request.coverImage.length === 0) {
        return { error: '封面图片不能为空' };
      }
      updates.coverImage = request.coverImage;
    }

    if (request.images !== undefined) {
      updates.images = request.images;
    }

    if (request.author !== undefined) {
      if (request.author.trim().length === 0) {
        return { error: '作者不能为空' };
      }
      updates.author = request.author.trim();
    }

    return encyclopediaRepository.update(id, updates);
  }

  async deleteArticle(id: number): Promise<boolean> {
    return encyclopediaRepository.delete(id);
  }
}
