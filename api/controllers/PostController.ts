import { Request, Response } from 'express';
import { PostService } from '../services/PostService.js';
import { TeamPostWithTeam } from '../../shared/types.js';

const postService = new PostService();

export class PostController {
  async getPosts(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize } = req.query;
      const pageNum = page ? parseInt(page as string) : undefined;
      const sizeNum = pageSize ? parseInt(pageSize as string) : undefined;

      const result = await postService.getPosts(pageNum, sizeNum);
      res.json({
        posts: result.posts,
        total: result.total,
        page: pageNum || 1,
        pageSize: sizeNum || result.total,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: '获取动态列表失败' });
    }
  }

  async getTeamPosts(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.teamId);
      const posts = await postService.getTeamPosts(teamId);
      res.json({ posts });
    } catch (error) {
      res.status(500).json({ success: false, error: '获取舞队动态失败' });
    }
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const result = await postService.createPost(req.body);
      if ('error' in result) {
        res.status(400).json({ success: false, message: result.error });
        return;
      }
      res.status(201).json({ success: true, post: result, message: '发布成功' });
    } catch (error) {
      res.status(500).json({ success: false, error: '发布动态失败' });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await postService.deletePost(id);
      if (!success) {
        res.status(404).json({ success: false, message: '动态不存在' });
        return;
      }
      res.json({ success: true, message: '删除成功' });
    } catch (error) {
      res.status(500).json({ success: false, error: '删除动态失败' });
    }
  }
}
