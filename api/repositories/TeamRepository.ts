import { db, saveDatabase } from '../db/database.js';
import { Team, TeamVideo } from '../../shared/types.js';

export class TeamRepository {
  async findAll(filters?: {
    district?: string;
    style?: string;
    memberCount?: string;
    hasVideo?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<{ teams: Team[]; total: number }> {
    await db.read();
    let teams = [...db.data.teams];

    if (filters?.district) {
      teams = teams.filter(t => t.district === filters.district);
    }
    if (filters?.style) {
      teams = teams.filter(t => t.style === filters.style);
    }
    if (filters?.memberCount) {
      const [min, max] = filters.memberCount.split('-').map(Number);
      if (max) {
        teams = teams.filter(t => t.memberCount >= min && t.memberCount <= max);
      } else {
        teams = teams.filter(t => t.memberCount >= min);
      }
    }
    if (filters?.hasVideo) {
      teams = teams.filter(t => t.videos && t.videos.length > 0);
    }

    const total = teams.length;

    if (filters?.page !== undefined && filters?.pageSize !== undefined) {
      const start = (filters.page - 1) * filters.pageSize;
      teams = teams.slice(start, start + filters.pageSize);
    }

    return { teams, total };
  }

  async findById(id: number): Promise<Team | undefined> {
    await db.read();
    return db.data.teams.find(t => t.id === id);
  }

  async findByName(name: string): Promise<Team | undefined> {
    await db.read();
    return db.data.teams.find(t => t.name === name);
  }

  async create(team: Omit<Team, 'id' | 'createdAt' | 'costumeScore' | 'costumeVotes' | 'videos'>): Promise<Team> {
    await db.read();
    const newTeam: Team = {
      ...team,
      id: Math.max(0, ...db.data.teams.map(t => t.id)) + 1,
      costumeScore: 0,
      costumeVotes: 0,
      videos: [],
      createdAt: new Date().toISOString()
    };
    db.data.teams.push(newTeam);
    await saveDatabase();
    return newTeam;
  }

  async addVideo(teamId: number, video: Omit<TeamVideo, 'id' | 'createdAt'>): Promise<TeamVideo | undefined> {
    await db.read();
    const team = db.data.teams.find(t => t.id === teamId);
    if (!team) return undefined;
    
    if (!team.videos) {
      team.videos = [];
    }
    
    const newVideo: TeamVideo = {
      ...video,
      id: Math.max(0, ...team.videos.map(v => v.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    team.videos.push(newVideo);
    await saveDatabase();
    return newVideo;
  }

  async removeVideo(teamId: number, videoId: number): Promise<boolean> {
    await db.read();
    const team = db.data.teams.find(t => t.id === teamId);
    if (!team || !team.videos) return false;
    
    const index = team.videos.findIndex(v => v.id === videoId);
    if (index === -1) return false;
    
    team.videos.splice(index, 1);
    await saveDatabase();
    return true;
  }

  async updateVideo(teamId: number, videoId: number, data: Partial<TeamVideo>): Promise<TeamVideo | undefined> {
    await db.read();
    const team = db.data.teams.find(t => t.id === teamId);
    if (!team || !team.videos) return undefined;
    
    const video = team.videos.find(v => v.id === videoId);
    if (!video) return undefined;
    
    Object.assign(video, data);
    await saveDatabase();
    return video;
  }

  async update(id: number, data: Partial<Team>): Promise<Team | undefined> {
    await db.read();
    const index = db.data.teams.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    
    db.data.teams[index] = { ...db.data.teams[index], ...data };
    await saveDatabase();
    return db.data.teams[index];
  }

  async updateCostumeScore(id: number, score: number, votes: number): Promise<void> {
    await db.read();
    const team = db.data.teams.find(t => t.id === id);
    if (team) {
      team.costumeScore = score;
      team.costumeVotes = votes;
      await saveDatabase();
    }
  }

  async getComprehensiveRanking(limit: number = 10): Promise<Team[]> {
    await db.read();
    const teams = [...db.data.teams];
    return teams
      .sort((a, b) => {
        const scoreA = (a.costumeScore * a.costumeVotes) + (a.memberCount * 0.1);
        const scoreB = (b.costumeScore * b.costumeVotes) + (b.memberCount * 0.1);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  async getCostumeRanking(limit: number = 10): Promise<Team[]> {
    await db.read();
    const teams = [...db.data.teams];
    return teams
      .sort((a, b) => b.costumeScore - a.costumeScore)
      .slice(0, limit);
  }
}
