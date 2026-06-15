import { Request, Response } from 'express';
import { TeamService } from '../services/TeamService.js';

const teamService = new TeamService();

export class MapController {
  async getMapTeams(req: Request, res: Response): Promise<void> {
    try {
      const district = req.query.district as string | undefined;
      const hasVideo = req.query.hasVideo === 'true';
      const teams = await teamService.getMapTeams(district, hasVideo);
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: '获取地图舞队失败' });
    }
  }
}
