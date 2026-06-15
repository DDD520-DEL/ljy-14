import { Request, Response } from 'express';
import { SongService } from '../services/SongService.js';
import { BattleService } from '../services/BattleService.js';

const songService = new SongService();
const battleService = new BattleService();

export class BattleController {
  async getBattlePair(req: Request, res: Response): Promise<void> {
    try {
      const pair = await songService.getBattlePair();
      
      if (!pair) {
        res.status(404).json({ error: '没有足够的歌曲进行PK' });
        return;
      }
      
      res.json(pair);
    } catch (error) {
      res.status(500).json({ error: '获取PK对战失败' });
    }
  }

  async recordBattleResult(req: Request, res: Response): Promise<void> {
    try {
      const { winnerSongId, loserSongId, winnerScore, loserScore } = req.body;
      
      if (!winnerSongId || !loserSongId) {
        res.status(400).json({ error: '缺少必要参数' });
        return;
      }

      const result = await battleService.recordBattleResult({
        winnerSongId,
        loserSongId,
        winnerScore: winnerScore || 0,
        loserScore: loserScore || 0
      });

      if (!result) {
        res.status(404).json({ error: '记录PK结果失败' });
        return;
      }

      res.json({ success: true, record: result });
    } catch (error) {
      res.status(500).json({ error: '记录PK结果失败' });
    }
  }

  async getSongBattleRecords(req: Request, res: Response): Promise<void> {
    try {
      const songId = parseInt(req.params.songId);
      const records = await battleService.getSongBattleRecords(songId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: '获取歌曲PK记录失败' });
    }
  }

  async getTeamBattleRecords(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.teamId);
      const records = await battleService.getTeamBattleRecords(teamId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: '获取舞队PK记录失败' });
    }
  }

  async getSongStats(req: Request, res: Response): Promise<void> {
    try {
      const songId = parseInt(req.params.songId);
      const stats = await battleService.getSongStats(songId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: '获取歌曲PK统计失败' });
    }
  }

  async getTeamStats(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.teamId);
      const stats = await battleService.getTeamStats(teamId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: '获取舞队PK统计失败' });
    }
  }
}
