import { Request, Response } from 'express';
import { TeamService } from '../services/TeamService.js';
import { ImportService } from '../services/ImportService.js';
import multer from 'multer';

const teamService = new TeamService();
const importService = new ImportService();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export class TeamController {
  async getTeams(req: Request, res: Response): Promise<void> {
    try {
      const { district, style, memberCount, page, pageSize, hasVideo } = req.query;
      
      const filters = {
        district: district as string | undefined,
        style: style as string | undefined,
        memberCount: memberCount as string | undefined,
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        hasVideo: hasVideo === 'true'
      };

      const result = await teamService.getTeamsWithVideos(filters);
      res.json({
        teams: result.teams,
        total: result.total,
        page: filters.page || 1,
        pageSize: filters.pageSize || result.total
      });
    } catch (error) {
      res.status(500).json({ error: '获取舞队列表失败' });
    }
  }

  async getTeamById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const team = await teamService.getTeamById(id);
      
      if (!team) {
        res.status(404).json({ error: '舞队不存在' });
        return;
      }
      
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: '获取舞队详情失败' });
    }
  }

  async createTeam(req: Request, res: Response): Promise<void> {
    try {
      const team = await teamService.createTeam(req.body);
      res.status(201).json(team);
    } catch (error) {
      res.status(500).json({ error: '创建舞队失败' });
    }
  }

  async updateTeam(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const team = await teamService.updateTeam(id, req.body);
      
      if (!team) {
        res.status(404).json({ error: '舞队不存在' });
        return;
      }
      
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: '更新舞队失败' });
    }
  }

  async importTeams(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ 
          success: false, 
          totalCount: 0,
          successCount: 0,
          failCount: 0,
          duplicateCount: 0,
          errors: [{ row: 0, message: '请上传Excel文件' }]
        });
        return;
      }

      const validMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      const validExtensions = ['.xlsx', '.xls'];
      const fileExtension = req.file.originalname.slice(req.file.originalname.lastIndexOf('.')).toLowerCase();
      
      if (!validMimeTypes.includes(req.file.mimetype) && !validExtensions.includes(fileExtension)) {
        res.status(400).json({ 
          success: false, 
          totalCount: 0,
          successCount: 0,
          failCount: 0,
          duplicateCount: 0,
          errors: [{ row: 0, message: '文件格式不正确，请上传 .xlsx 或 .xls 文件' }]
        });
        return;
      }

      const result = await importService.importTeamsFromExcel(req.file.buffer);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        totalCount: 0,
        successCount: 0,
        failCount: 0,
        duplicateCount: 0,
        errors: [{ row: 0, message: `导入失败：${(error as Error).message}` }]
      });
    }
  }

  getUploadMiddleware() {
    return upload.single('file');
  }

  async addVideo(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.id);
      const { title, url, thumbnail } = req.body;
      
      if (!title || !url) {
        res.status(400).json({ error: '视频标题和链接不能为空' });
        return;
      }

      const video = await teamService.addVideo(teamId, { title, url, thumbnail });
      
      if (!video) {
        res.status(404).json({ error: '舞队不存在' });
        return;
      }
      
      res.json({ success: true, video });
    } catch (error) {
      res.status(500).json({ error: '添加视频失败' });
    }
  }

  async removeVideo(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.id);
      const videoId = parseInt(req.params.videoId);
      
      const success = await teamService.removeVideo(teamId, videoId);
      
      if (!success) {
        res.status(404).json({ error: '舞队或视频不存在' });
        return;
      }
      
      res.json({ success: true, message: '删除视频成功' });
    } catch (error) {
      res.status(500).json({ error: '删除视频失败' });
    }
  }

  async updateVideo(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.params.id);
      const videoId = parseInt(req.params.videoId);
      const { title, url, thumbnail } = req.body;
      
      const video = await teamService.updateVideo(teamId, videoId, { title, url, thumbnail });
      
      if (!video) {
        res.status(404).json({ error: '舞队或视频不存在' });
        return;
      }
      
      res.json({ success: true, video });
    } catch (error) {
      res.status(500).json({ error: '更新视频失败' });
    }
  }
}
