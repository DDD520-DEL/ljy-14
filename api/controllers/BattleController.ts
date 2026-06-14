import { Request, Response } from 'express';
import { SongService } from '../services/SongService.js';

const songService = new SongService();

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
}
