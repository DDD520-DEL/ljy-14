import { db, saveDatabase } from '../db/database.js';
import { VoteRecord, VoteRecordWithDetails } from '../../shared/types.js';

export class VoteRepository {
  async findByTypeAndTarget(type: 'addict' | 'costume', targetId: number): Promise<VoteRecord[]> {
    await db.read();
    return db.data.votes.filter(v => v.type === type && v.targetId === targetId);
  }

  async findByUserId(type: 'addict' | 'costume', targetId: number, userId: number): Promise<VoteRecord | undefined> {
    await db.read();
    return db.data.votes.find(v => v.type === type && v.targetId === targetId && v.userId === userId);
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

  async findByTypeAndTargetSince(type: 'addict' | 'costume', targetId: number, sinceDate: Date): Promise<VoteRecord[]> {
    await db.read();
    return db.data.votes.filter(v => 
      v.type === type && 
      v.targetId === targetId && 
      new Date(v.createdAt) >= sinceDate
    );
  }

  async getAverageScoreSince(type: 'addict' | 'costume', targetId: number, sinceDate: Date): Promise<{ score: number; votes: number }> {
    const votes = await this.findByTypeAndTargetSince(type, targetId, sinceDate);
    if (votes.length === 0) {
      return { score: 0, votes: 0 };
    }
    const total = votes.reduce((sum, v) => sum + v.score, 0);
    return {
      score: Math.round((total / votes.length) * 100) / 100,
      votes: votes.length
    };
  }

  async findByUserIdWithDetails(userId: number): Promise<VoteRecordWithDetails[]> {
    await db.read();
    const userVotes = db.data.votes.filter(v => v.userId === userId);
    
    return userVotes.map(vote => {
      const result: VoteRecordWithDetails = { ...vote };
      
      if (vote.type === 'addict') {
        const song = db.data.songs.find(s => s.id === vote.targetId);
        if (song) {
          result.targetName = song.title;
          result.targetPhoto = song.coverUrl;
          const team = db.data.teams.find(t => t.id === song.teamId);
          if (team) {
            result.teamName = team.name;
          }
        }
      } else if (vote.type === 'costume') {
        const team = db.data.teams.find(t => t.id === vote.targetId);
        if (team) {
          result.targetName = team.name;
          result.targetPhoto = team.costumePhoto;
          result.teamName = team.name;
        }
      }
      
      return result;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
