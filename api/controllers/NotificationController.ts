import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService.js';

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ error: '无效的用户ID' });
        return;
      }
      const notifications = await notificationService.getNotificationsByUserId(userId);
      res.json({ notifications });
    } catch (error) {
      res.status(500).json({ error: '获取通知列表失败' });
    }
  }

  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ error: '无效的用户ID' });
        return;
      }
      const count = await notificationService.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: '获取未读数量失败' });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { userId } = req.body;
      if (isNaN(id) || !userId) {
        res.status(400).json({ error: '参数无效' });
        return;
      }
      const success = await notificationService.markAsRead(id, userId);
      if (!success) {
        res.status(404).json({ error: '通知不存在' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: '标记已读失败' });
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ error: '无效的用户ID' });
        return;
      }
      const count = await notificationService.markAllAsRead(userId);
      res.json({ success: true, count });
    } catch (error) {
      res.status(500).json({ error: '标记全部已读失败' });
    }
  }
}
