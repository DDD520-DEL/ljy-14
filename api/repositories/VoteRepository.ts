import { db, saveDatabase } from '../db/database.js';
import { VoteRecord } from '../../shared/types.js';

export class VoteRepository {
  async findByTypeAndTarget(type: 'addict' | 'costume', targetId: number): Promise<VoteRecord[]> {
    await db.read();
    return db.data.votes.filter(v => v.type === type && v.targetId === targetId);
  }

  async findByUserIp(type: 'addict' | 'costume', targetId: number, userIp: string): Promise<VoteRecord | undefined> {
    await db.read();
    return db.data.votes.find(v => v.type === type && v.targetId === targetId && v.userIp === userIp);
  }

  async create(vote: Omit<VoteRecord, 'id' | 'createdAt'>): Promise<VoteRecord> {
    await db.read();
    const newVote: VoteRecord = {
      ...vote,
      id: Math.max(0, ...db.data.votes.map(v => v.id)) + 1,
      createdAt: new Date().toISOString()
    };
    db.data.votes.push(newVote);
    await saveDatabase();
    return newVote;
  }

  async getAverageScore(type: 'addict' | 'costume', targetId: number): Promise<{ score: number; votes: number }> {
    const votes = await this.findByTypeAndTarget(type, targetId);
    if (votes.length === 0) {
      return { score: 0, votes: 0 };
    }
    const total = votes.reduce((sum, v) => sum + v.score, 0);
    return {
      score: Math.round((total / votes.length) * 100) / 100,
      votes: votes.length
    };
  }
}
