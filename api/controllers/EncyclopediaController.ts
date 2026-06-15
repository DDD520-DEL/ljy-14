import { Request, Response } from 'express';
import { EncyclopediaService } from '../services/EncyclopediaService.js';
import { EncyclopediaCategory } from '../../shared/types.js';

const encyclopediaService = new EncyclopediaService();

export class EncyclopediaController {
  async getArticles(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize, category, keyword } = req.query;
      const pageNum = page ? parseInt(page as string) : undefined;
      const sizeNum = pageSize ? parseInt(pageSize as string) : undefined;
      const categoryVal = category as EncyclopediaCategory | undefined;
      const keywordVal = keyword as string | undefined;

      const result = await encyclopediaService.getArticles(
        pageNum,
        sizeNum,
        categoryVal,
        keywordVal
      );

      res.json({
        data: result.articles,
        total: result.total,
        page: pageNum || 1,
        pageSize: sizeNum || result.total,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: '获取文章列表失败' });
    }
  }

  async getArticleById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, error: '无效的文章ID' });
        return;
      }

      const article = await encyclopediaService.getArticleById(id);
      if (!article) {
        res.status(404).json({ success: false, message: '文章不存在' });
        return;
      }

      res.json({ success: true, article });
    } catch (error) {
      res.status(500).json({ success: false, error: '获取文章详情失败' });
    }
  }

  async createArticle(req: Request, res: Response): Promise<void> {
    try {
      const result = await encyclopediaService.createArticle(req.body);
      if ('error' in result) {
        res.status(400).json({ success: false, message: result.error });
        return;
      }
      res.status(201).json({ success: true, article: result, message: '发布成功' });
    } catch (error) {
      res.status(500).json({ success: false, error: '发布文章失败' });
    }
  }

  async updateArticle(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, error: '无效的文章ID' });
        return;
      }

      const result = await encyclopediaService.updateArticle(id, req.body);
      if (result === undefined) {
        res.status(404).json({ success: false, message: '文章不存在' });
        return;
      }
      if ('error' in result) {
        res.status(400).json({ success: false, message: result.error });
        return;
      }
      res.json({ success: true, article: result, message: '更新成功' });
    } catch (error) {
      res.status(500).json({ success: false, error: '更新文章失败' });
    }
  }

  async deleteArticle(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, error: '无效的文章ID' });
        return;
      }

      const success = await encyclopediaService.deleteArticle(id);
      if (!success) {
        res.status(404).json({ success: false, message: '文章不存在' });
        return;
      }
      res.json({ success: true, message: '删除成功' });
    } catch (error) {
      res.status(500).json({ success: false, error: '删除文章失败' });
    }
  }
}
