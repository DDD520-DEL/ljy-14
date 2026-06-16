import { RecruitmentRepository } from '../repositories/RecruitmentRepository.js';
import { CreateRecruitmentRequest, UpdateRecruitmentRequest, RecruitmentWithTeam, Recruitment } from '../../shared/types.js';

const recruitmentRepository = new RecruitmentRepository();

export class RecruitmentService {
  async getRecruitments(filters?: {
    status?: 'active' | 'closed';
    teamId?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: RecruitmentWithTeam[]; total: number; page: number; pageSize: number }> {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const result = await recruitmentRepository.findAll({ ...filters, page, pageSize });
    return { ...result, page, pageSize };
  }

  async getRecruitmentById(id: number): Promise<RecruitmentWithTeam | undefined> {
    return recruitmentRepository.findById(id);
  }

  async getTeamRecruitments(teamId: number): Promise<Recruitment[]> {
    return recruitmentRepository.findByTeamId(teamId);
  }

  async createRecruitment(data: CreateRecruitmentRequest): Promise<Recruitment> {
    if (!data.teamId) {
      throw new Error('舞队ID不能为空');
    }
    if (!data.title?.trim()) {
      throw new Error('招募标题不能为空');
    }
    if (!data.description?.trim()) {
      throw new Error('招募描述不能为空');
    }
    if (!data.recruitCount || data.recruitCount <= 0) {
      throw new Error('招募人数必须大于0');
    }
    if (!data.contactName?.trim()) {
      throw new Error('联系人不能为空');
    }
    if (!data.contactPhone?.trim()) {
      throw new Error('联系电话不能为空');
    }

    return recruitmentRepository.create(data);
  }

  async updateRecruitment(id: number, data: UpdateRecruitmentRequest): Promise<Recruitment | undefined> {
    return recruitmentRepository.update(id, data);
  }

  async deleteRecruitment(id: number): Promise<boolean> {
    return recruitmentRepository.delete(id);
  }

  async closeRecruitment(id: number): Promise<Recruitment | undefined> {
    return recruitmentRepository.update(id, { status: 'closed' });
  }

  async getLatestRecruitments(limit: number = 10): Promise<RecruitmentWithTeam[]> {
    return recruitmentRepository.getLatest(limit);
  }
}
