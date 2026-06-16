import { FeedbackRepository } from '../repositories/FeedbackRepository.js';
import { CreateFeedbackRequest, FeedbackStatus, Feedback } from '../../shared/types.js';

const feedbackRepository = new FeedbackRepository();

export class FeedbackService {
  async getFeedbacks(filters?: {
    status?: FeedbackStatus;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: Feedback[]; total: number; page: number; pageSize: number }> {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const result = await feedbackRepository.findAll({ ...filters, page, pageSize });
    return { ...result, page, pageSize };
  }

  async getFeedbackById(id: number): Promise<Feedback | undefined> {
    return feedbackRepository.findById(id);
  }

  async createFeedback(data: CreateFeedbackRequest): Promise<Feedback> {
    if (!data.content?.trim()) {
      throw new Error('反馈内容不能为空');
    }
    if (!data.contact?.trim()) {
      throw new Error('联系方式不能为空');
    }
    if (data.content.trim().length > 1000) {
      throw new Error('反馈内容不能超过1000字');
    }
    if (data.contact.trim().length > 50) {
      throw new Error('联系方式不能超过50字');
    }

    return feedbackRepository.create(data);
  }

  async updateFeedbackStatus(id: number, status: FeedbackStatus): Promise<Feedback | undefined> {
    if (!status || !['pending', 'processed'].includes(status)) {
      throw new Error('无效的状态值');
    }
    return feedbackRepository.updateStatus(id, status);
  }

  async deleteFeedback(id: number): Promise<boolean> {
    return feedbackRepository.delete(id);
  }
}
