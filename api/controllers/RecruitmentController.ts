import { Request, Response } from 'express';
import { RecruitmentService } from '../services/RecruitmentService.js';

const recruitmentService = new RecruitmentService();

export class RecruitmentController {
  async getRecruitments(req: Request, res: Response): Promise<void> {
    try {
      const { status, teamId, page, pageSize } = req.query;

      const filters = {
        status: status as 'active' | 'closed' | undefined,
        teamId: teamId ? parseInt(teamId as string) : undefined,
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
      };

      const result = await recruitmentService.getRecruitments(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: '获取招募列表失败' });
    }
  }

  async getRecruitmentById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const recruitment = await recruitmentService.getRecruitmentById(id);

      if (!recruitment) {
        res.status(404).json({ success: false, error: '招募公告不存在' });
        return;
      }

      res.json({ success: true, recruitment });
    } catch (error) {
      res.status(500).json({ success: false, error: '获取招募详情失败' });
    }
  }

  async getTeamRecruitments(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.teamId);
      const recruitments = await recruitmentService.getTeamRecruitments(teamId);
      res.json({ success: true, recruitments });
    } catch (error) {
      res.status(500).json({ success: false, error: '获取舞队招募列表失败' });
    }
  }

  async createRecruitment(req: Request, res: Response): Promise<void> {
    try {
      const recruitment = await recruitmentService.createRecruitment(req.body);
      res.status(201).json({ success: true, recruitment });
    } catch (error) {
      const message = error instanceof Error ? error.message : '创建招募公告失败';
      res.status(400).json({ success: false, message });
    }
  }

  async updateRecruitment(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const recruitment = await recruitmentService.updateRecruitment(id, req.body);

      if (!recruitment) {
        res.status(404).json({ success: false, error: '招募公告不存在' });
        return;
      }

      res.json({ success: true, recruitment });
    } catch (error) {
      res.status(500).json({ success: false, error: '更新招募公告失败' });
    }
  }

  async deleteRecruitment(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const result = await recruitmentService.deleteRecruitment(id);

      if (!result) {
        res.status(404).json({ success: false, error: '招募公告不存在' });
        return;
      }

      res.json({ success: true, message: '删除成功' });
    } catch (error) {
      res.status(500).json({ success: false, error: '删除招募公告失败' });
    }
  }

  async closeRecruitment(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const recruitment = await recruitmentService.closeRecruitment(id);

      if (!recruitment) {
        res.status(404).json({ success: false, error: '招募公告不存在' });
        return;
      }

      res.json({ success: true, recruitment, message: '已结束招募' });
    } catch (error) {
      res.status(500).json({ success: false, error: '结束招募失败' });
    }
  }

  async getLatestRecruitments(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recruitments = await recruitmentService.getLatestRecruitments(limit);
      res.json({ success: true, recruitments });
    } catch (error) {
      res.status(500).json({ success: false, error: '获取最新招募失败' });
    }
  }
}
