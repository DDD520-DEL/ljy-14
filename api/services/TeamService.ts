import { TeamRepository } from '../repositories/TeamRepository.js';
import { Team, TeamVideo } from '../../shared/types.js';

const teamRepository = new TeamRepository();

export class TeamService {
  async getTeams(filters?: {
    district?: string;
    style?: string;
    memberCount?: string;
    hasVideo?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<{ teams: Team[]; total: number }> {
    return teamRepository.findAll(filters);
  }

  async getTeamById(id: number): Promise<Team | undefined> {
    return teamRepository.findById(id);
  }

  async createTeam(team: Omit<Team, 'id' | 'createdAt' | 'costumeScore' | 'costumeVotes'>): Promise<Team> {
    return teamRepository.create(team);
  }

  async updateTeam(id: number, data: Partial<Team>): Promise<Team | undefined> {
    return teamRepository.update(id, data);
  }

  async getComprehensiveRanking(limit?: number): Promise<Team[]> {
    return teamRepository.getComprehensiveRanking(limit);
  }

  async getCostumeRanking(limit?: number): Promise<Team[]> {
    return teamRepository.getCostumeRanking(limit);
  }

  async getMapTeams(district?: string, hasVideo?: boolean): Promise<Team[]> {
    const { teams } = await teamRepository.findAll({ district, hasVideo });
    return teams;
  }

  async addVideo(teamId: number, video: Omit<TeamVideo, 'id' | 'createdAt'>): Promise<TeamVideo | undefined> {
    return teamRepository.addVideo(teamId, video);
  }

  async removeVideo(teamId: number, videoId: number): Promise<boolean> {
    return teamRepository.removeVideo(teamId, videoId);
  }

  async updateVideo(teamId: number, videoId: number, data: Partial<TeamVideo>): Promise<TeamVideo | undefined> {
    return teamRepository.updateVideo(teamId, videoId, data);
  }

  async getTeamsWithVideos(filters?: {
    district?: string;
    style?: string;
    memberCount?: string;
    hasVideo?: boolean;
  }): Promise<{ teams: Team[]; total: number }> {
    const result = await teamRepository.findAll(filters);
    let teams = result.teams;
    
    if (filters?.hasVideo) {
      teams = teams.filter(t => t.videos && t.videos.length > 0);
    }
    
    return { teams, total: teams.length };
  }
}
