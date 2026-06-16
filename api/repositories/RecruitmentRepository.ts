import { db, saveDatabase } from '../db/database.js';
import { Recruitment, RecruitmentWithTeam, CreateRecruitmentRequest, UpdateRecruitmentRequest } from '../../shared/types.js';

export class RecruitmentRepository {
  async findAll(filters?: {
    status?: 'active' | 'closed';
    teamId?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: RecruitmentWithTeam[]; total: number }> {
    await db.read();
    let recruitments = [...db.data.recruitments];

    if (filters?.status) {
      recruitments = recruitments.filter(r => r.status === filters.status);
    }
    if (filters?.teamId) {
      recruitments = recruitments.filter(r => r.teamId === filters.teamId);
    }

    recruitments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = recruitments.length;

    const recruitmentsWithTeam: RecruitmentWithTeam[] = recruitments.map(r => {
      const team = db.data.teams.find(t => t.id === r.teamId);
      return {
        ...r,
        teamName: team?.name || '未知舞队',
        teamAvatar: team?.avatar || '',
        teamDistrict: team?.district || ''
      };
    });

    if (filters?.page !== undefined && filters?.pageSize !== undefined) {
      const start = (filters.page - 1) * filters.pageSize;
      return { data: recruitmentsWithTeam.slice(start, start + filters.pageSize), total };
    }

    return { data: recruitmentsWithTeam, total };
  }

  async findById(id: number): Promise<RecruitmentWithTeam | undefined> {
    await db.read();
    const recruitment = db.data.recruitments.find(r => r.id === id);
    if (!recruitment) return undefined;

    const team = db.data.teams.find(t => t.id === recruitment.teamId);
    return {
      ...recruitment,
      teamName: team?.name || '未知舞队',
      teamAvatar: team?.avatar || '',
      teamDistrict: team?.district || ''
    };
  }

  async findByTeamId(teamId: number): Promise<Recruitment[]> {
    await db.read();
    return db.data.recruitments
      .filter(r => r.teamId === teamId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async create(data: CreateRecruitmentRequest): Promise<Recruitment> {
    await db.read();
    const now = new Date().toISOString();
    const newRecruitment: Recruitment = {
      id: Math.max(0, ...db.data.recruitments.map(r => r.id), 0) + 1,
      ...data,
      status: 'active',
      createdAt: now,
      updatedAt: now
    };
    db.data.recruitments.push(newRecruitment);
    await saveDatabase();
    return newRecruitment;
  }

  async update(id: number, data: UpdateRecruitmentRequest): Promise<Recruitment | undefined> {
    await db.read();
    const index = db.data.recruitments.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    db.data.recruitments[index] = {
      ...db.data.recruitments[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    await saveDatabase();
    return db.data.recruitments[index];
  }

  async delete(id: number): Promise<boolean> {
    await db.read();
    const index = db.data.recruitments.findIndex(r => r.id === id);
    if (index === -1) return false;

    db.data.recruitments.splice(index, 1);
    await saveDatabase();
    return true;
  }

  async getLatest(limit: number = 10): Promise<RecruitmentWithTeam[]> {
    const { data } = await this.findAll({ status: 'active', page: 1, pageSize: limit });
    return data;
  }
}
