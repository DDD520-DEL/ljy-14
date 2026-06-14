import { Request, Response } from 'express';
import { VoteService } from '../services/VoteService.js';

const voteService = new VoteService();

export class VoteController {
  async voteAddict(req: Request, res: Response): Promise<void> {
    try {
      const { songId, score } = req.body;
      const userIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
      
      if (!songId || !score) {
        res.status(400).json({ error: '缺少必要参数' });
        return;
      }

      const result = await voteService.voteAddict(
        parseInt(songId),
        parseInt(score),
        userIp
      );

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: '投票失败' });
    }
  }

  async voteCostume(req: Request, res: Response): Promise<void> {
    try {
      const { teamId, score } = req.body;
      const userIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
      
      if (!teamId || !score) {
        res.status(400).json({ error: '缺少必要参数' });
        return;
      }

      const result = await voteService.voteCostume(
        parseInt(teamId),
        parseInt(score),
        userIp
      );

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: '投票失败' });
    }
  }
}
