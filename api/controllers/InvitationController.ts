import { Request, Response } from 'express';
import { InvitationService } from '../services/InvitationService.js';

const invitationService = new InvitationService();

export class InvitationController {
  async getAllInvitations(req: Request, res: Response): Promise<void> {
    try {
      const invitations = await invitationService.getAllInvitations();
      res.json(invitations);
    } catch (error) {
      res.status(500).json({ error: '获取约舞列表失败' });
    }
  }

  async getInvitationById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const invitation = await invitationService.getInvitationById(id);
      
      if (!invitation) {
        res.status(404).json({ error: '约舞邀请不存在' });
        return;
      }
      
      res.json(invitation);
    } catch (error) {
      res.status(500).json({ error: '获取约舞详情失败' });
    }
  }

  async getTeamInvitations(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.teamId);
      const type = req.query.type as string | undefined;
      
      let invitations;
      switch (type) {
        case 'sent':
          invitations = await invitationService.getSentInvitations(teamId);
          break;
        case 'received':
          invitations = await invitationService.getReceivedInvitations(teamId);
          break;
        case 'pending':
          invitations = await invitationService.getPendingInvitations(teamId);
          break;
        case 'completed':
          invitations = await invitationService.getCompletedInvitations(teamId);
          break;
        default:
          invitations = await invitationService.getInvitationsByTeamId(teamId);
      }
      
      res.json(invitations);
    } catch (error) {
      res.status(500).json({ error: '获取舞队约舞列表失败' });
    }
  }

  async createInvitation(req: Request, res: Response): Promise<void> {
    try {
      const invitation = await invitationService.createInvitation(req.body);
      res.status(201).json({
        success: true,
        invitation,
        message: '约舞邀请发送成功'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '创建约舞邀请失败'
      });
    }
  }

  async acceptInvitation(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const invitation = await invitationService.acceptInvitation(id);
      
      if (!invitation) {
        res.status(404).json({
          success: false,
          message: '约舞邀请不存在'
        });
        return;
      }
      
      res.json({
        success: true,
        invitation,
        message: '已接受约舞邀请'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '接受约舞邀请失败'
      });
    }
  }

  async rejectInvitation(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const invitation = await invitationService.rejectInvitation(id);
      
      if (!invitation) {
        res.status(404).json({
          success: false,
          message: '约舞邀请不存在'
        });
        return;
      }
      
      res.json({
        success: true,
        invitation,
        message: '已拒绝约舞邀请'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '拒绝约舞邀请失败'
      });
    }
  }
}
