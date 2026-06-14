import { Request, Response } from 'express';
import { TeamService } from '../services/TeamService.js';
import { SongService } from '../services/SongService.js';

const teamService = new TeamService();
const songService = new SongService();

export class RankingController {
  async getComprehensiveRanking(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const teams = await teamService.getComprehensiveRanking(limit);
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: '获取综合排行榜失败' });
    }
  }

  async getAddictRanking(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const songs = await songService.getAddictRanking(limit);
      
      const result = await Promise.all(
        songs.map(async (song) => {
          const team = await teamService.getTeamById(song.teamId);
          return { ...song, teamName: team?.name };
        })
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: '获取歌单排行榜失败' });
    }
  }

  async getCostumeRanking(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const teams = await teamService.getCostumeRanking(limit);
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: '获取服装排行榜失败' });
    }
  }

  async getWeeklyAddictRanking(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const songs = await songService.getWeeklyAddictRanking(limit);
      
      const result = await Promise.all(
        songs.map(async (song) => {
          const team = await teamService.getTeamById(song.teamId);
          return { ...song, teamName: team?.name };
        })
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: '获取本周热门排行榜失败' });
    }
  }
}
