import { Request, Response } from 'express';
import { SongService } from '../services/SongService.js';

const songService = new SongService();

export class SongController {
  async getSongsByTeamId(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.teamId);
      const songs = await songService.getSongsByTeamId(teamId);
      res.json(songs);
    } catch (error) {
      res.status(500).json({ error: '获取歌单失败' });
    }
  }

  async addSong(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.teamId);
      const song = await songService.addSong(teamId, req.body);
      res.status(201).json(song);
    } catch (error) {
      res.status(500).json({ error: '添加歌曲失败' });
    }
  }

  async deleteSong(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await songService.deleteSong(id);
      
      if (!success) {
        res.status(404).json({ error: '歌曲不存在' });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: '删除歌曲失败' });
    }
  }
}
