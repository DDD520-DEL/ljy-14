import { Request, Response } from 'express';
import { UserService } from '../services/UserService.js';
import { VoteService } from '../services/VoteService.js';
import { CommentService } from '../services/CommentService.js';
import { UserFavoriteRepository } from '../repositories/UserFavoriteRepository.js';

const userService = new UserService();
const voteService = new VoteService();
const commentService = new CommentService();
const userFavoriteRepository = new UserFavoriteRepository();

export class UserController {
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({ error: '用户不存在' });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: '获取用户信息失败' });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await userService.createUser(req.body);
      if (!result.success) {
        res.status(400).json(result);
        return;
      }
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: '创建用户失败' });
    }
  }

  async getUserVotes(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const votes = await voteService.getUserVotes(userId);
      res.json(votes);
    } catch (error) {
      res.status(500).json({ error: '获取用户投票记录失败' });
    }
  }

  async getUserComments(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const comments = await commentService.getUserComments(userId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: '获取用户留言记录失败' });
    }
  }

  async syncFavorites(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { teamIds } = req.body;
      if (!Array.isArray(teamIds)) {
        res.status(400).json({ error: 'teamIds必须是数组' });
        return;
      }
      await userFavoriteRepository.syncFromClient(userId, teamIds);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: '同步收藏失败' });
    }
  }

  async getFavoriteTeamIds(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const teamIds = await userFavoriteRepository.getFavoriteTeamIds(userId);
      res.json({ teamIds });
    } catch (error) {
      res.status(500).json({ error: '获取收藏列表失败' });
    }
  }

  async toggleFavorite(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { teamId } = req.body;
      if (!teamId) {
        res.status(400).json({ error: 'teamId不能为空' });
        return;
      }
      const result = await userFavoriteRepository.toggle(userId, teamId);
      res.json({ success: true, favorited: result.favorited });
    } catch (error) {
      res.status(500).json({ error: '切换收藏失败' });
    }
  }
}
