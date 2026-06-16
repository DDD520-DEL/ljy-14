import { db, saveDatabase } from '../db/database.js';
import { Feedback, FeedbackStatus, CreateFeedbackRequest } from '../../shared/types.js';

export class FeedbackRepository {
  async findAll(filters?: {
    status?: FeedbackStatus;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: Feedback[]; total: number }> {
    await db.read();
    let feedbacks = [...db.data.feedbacks];

    if (filters?.status) {
      feedbacks = feedbacks.filter(f => f.status === filters.status);
    }

    feedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = feedbacks.length;

    if (filters?.page !== undefined && filters?.pageSize !== undefined) {
      const start = (filters.page - 1) * filters.pageSize;
      return { data: feedbacks.slice(start, start + filters.pageSize), total };
    }

    return { data: feedbacks, total };
  }

  async findById(id: number): Promise<Feedback | undefined> {
    await db.read();
    return db.data.feedbacks.find(f => f.id === id);
  }

  async create(data: CreateFeedbackRequest): Promise<Feedback> {
    await db.read();
    const now = new Date().toISOString();
    const newFeedback: Feedback = {
      id: Math.max(0, ...db.data.feedbacks.map(f => f.id), 0) + 1,
      content: data.content,
      contact: data.contact,
      status: 'pending',
      userId: data.userId,
      userNickname: data.userNickname,
      createdAt: now
    };
    db.data.feedbacks.push(newFeedback);
    await saveDatabase();
    return newFeedback;
  }

  async updateStatus(id: number, status: FeedbackStatus): Promise<Feedback | undefined> {
    await db.read();
    const index = db.data.feedbacks.findIndex(f => f.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    db.data.feedbacks[index] = {
      ...db.data.feedbacks[index],
      status,
      processedAt: status === 'processed' ? now : undefined
    };
    await saveDatabase();
    return db.data.feedbacks[index];
  }

  async delete(id: number): Promise<boolean> {
    await db.read();
    const index = db.data.feedbacks.findIndex(f => f.id === id);
    if (index === -1) return false;

    db.data.feedbacks.splice(index, 1);
    await saveDatabase();
    return true;
  }
}
