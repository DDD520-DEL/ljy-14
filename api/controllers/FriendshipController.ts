import { Request, Response } from 'express';
import { FriendshipService } from '../services/FriendshipService.js';

const friendshipService = new FriendshipService();

export class FriendshipController {
  async getAllFriendships(req: Request, res: Response): Promise<void> {
    try {
      const friendships = await friendshipService.getAllFriendships();
      res.json(friendships);
    } catch (error) {
      res.status(500).json({ error: '获取友好关系列表失败' });
    }
  }

  async getFriendshipsByTeamId(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.teamId);
      const friendships = await friendshipService.getFriendshipsByTeamId(teamId);
      res.json(friendships);
    } catch (error) {
      res.status(500).json({ error: '获取舞队友好关系失败' });
    }
  }

  async createFriendship(req: Request, res: Response): Promise<void> {
    try {
      const friendship = await friendshipService.createFriendship(req.body);
      res.status(201).json({ success: true, friendship });
    } catch (error) {
      const message = error instanceof Error ? error.message : '创建友好关系失败';
      res.status(400).json({ success: false, message });
    }
  }

  async deleteFriendship(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await friendshipService.deleteFriendship(id);
      if (!success) {
        res.status(404).json({ success: false, message: '友好关系不存在' });
        return;
      }
      res.json({ success: true, message: '已解除友好关系' });
    } catch (error) {
      res.status(500).json({ success: false, message: '解除友好关系失败' });
    }
  }
}
