import { Request, Response } from 'express';
import { StatsService } from '../services/StatsService.js';

const statsService = new StatsService();

export class StatsController {
  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await statsService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('获取统计数据失败:', error);
      res.status(500).json({ error: '获取统计数据失败' });
    }
  }
}
