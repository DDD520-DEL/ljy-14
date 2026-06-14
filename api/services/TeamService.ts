import { TeamRepository } from '../repositories/TeamRepository.js';
import { Team } from '../../shared/types.js';

const teamRepository = new TeamRepository();

export class TeamService {
  async getTeams(filters?: {
    district?: string;
    style?: string;
    memberCount?: string;
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

  async getMapTeams(district?: string): Promise<Team[]> {
    const { teams } = await teamRepository.findAll({ district });
    return teams;
  }
}
