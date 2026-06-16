import { Request, Response } from 'express';
import { FeedbackService } from '../services/FeedbackService.js';
import { FeedbackStatus } from '../../shared/types.js';

const feedbackService = new FeedbackService();

export class FeedbackController {
  async getFeedbacks(req: Request, res: Response): Promise<void> {
    try {
      const { status, page, pageSize } = req.query;

      const filters = {
        status: status as FeedbackStatus | undefined,
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
      };

      const result = await feedbackService.getFeedbacks(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: '获取反馈列表失败' });
    }
  }

  async getFeedbackById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const feedback = await feedbackService.getFeedbackById(id);

      if (!feedback) {
        res.status(404).json({ success: false, error: '反馈不存在' });
        return;
      }

      res.json({ success: true, feedback });
    } catch (error) {
      res.status(500).json({ success: false, error: '获取反馈详情失败' });
    }
  }

  async createFeedback(req: Request, res: Response): Promise<void> {
    try {
      const feedback = await feedbackService.createFeedback(req.body);
      res.status(201).json({ success: true, feedback, message: '反馈提交成功，感谢您的意见！' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '提交反馈失败';
      res.status(400).json({ success: false, message });
    }
  }

  async updateFeedbackStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const feedback = await feedbackService.updateFeedbackStatus(id, status);

      if (!feedback) {
        res.status(404).json({ success: false, error: '反馈不存在' });
        return;
      }

      res.json({ success: true, feedback, message: '状态更新成功' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新状态失败';
      res.status(400).json({ success: false, message });
    }
  }

  async deleteFeedback(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const result = await feedbackService.deleteFeedback(id);

      if (!result) {
        res.status(404).json({ success: false, error: '反馈不存在' });
        return;
      }

      res.json({ success: true, message: '删除成功' });
    } catch (error) {
      res.status(500).json({ success: false, error: '删除反馈失败' });
    }
  }
}
