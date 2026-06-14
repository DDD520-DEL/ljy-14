import { Request, Response } from 'express';
import { CommentService } from '../services/CommentService.js';
import { CreateCommentRequest } from '../../shared/types.js';

const commentService = new CommentService();

export class CommentController {
  async getTeamComments(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.teamId);
      const comments = await commentService.getTeamComments(teamId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: '获取评论列表失败' });
    }
  }

  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.teamId);
      const data: CreateCommentRequest = {
        teamId,
        nickname: req.body.nickname,
        content: req.body.content,
        rating: req.body.rating
      };
      const result = await commentService.createComment(data);
      if (!result.success) {
        res.status(400).json(result);
        return;
      }
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: '发布留言失败' });
    }
  }

  async getTeamRating(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.teamId);
      const rating = await commentService.getTeamRating(teamId);
      res.json(rating);
    } catch (error) {
      res.status(500).json({ error: '获取评分失败' });
    }
  }
}
