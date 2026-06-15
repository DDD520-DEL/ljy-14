import { Request, Response } from 'express';
import { CheckInService } from '../services/CheckInService.js';

const checkInService = new CheckInService();

export class CheckInController {
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ success: false, message: '无效的用户ID' });
        return;
      }
      const status = await checkInService.getStatus(userId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ success: false, message: '获取签到状态失败' });
    }
  }

  async getRecords(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ success: false, message: '无效的用户ID' });
        return;
      }
      const records = await checkInService.getRecords(userId);
      res.json({ records });
    } catch (error) {
      res.status(500).json({ success: false, message: '获取签到记录失败' });
    }
  }

  async getMonthRecords(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const year = parseInt(req.query.year as string);
      const month = parseInt(req.query.month as string);
      
      if (isNaN(userId) || isNaN(year) || isNaN(month)) {
        res.status(400).json({ success: false, message: '参数错误' });
        return;
      }
      
      const records = await checkInService.getMonthRecords(userId, year, month);
      res.json({ records });
    } catch (error) {
      res.status(500).json({ success: false, message: '获取月度签到记录失败' });
    }
  }

  async checkIn(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ success: false, message: '无效的用户ID' });
        return;
      }
      const result = await checkInService.checkIn(userId);
      if (!result.success) {
        res.status(400).json(result);
        return;
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: '签到失败' });
    }
  }
}
