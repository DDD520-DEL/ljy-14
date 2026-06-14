import { db, saveDatabase } from '../db/database.js';
import { TeamComment, CreateCommentRequest, TeamCommentWithTeam } from '../../shared/types.js';

export class CommentRepository {
  async findByTeamId(teamId: number): Promise<TeamComment[]> {
    await db.read();
    return db.data.comments
      .filter(c => c.teamId === teamId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async create(data: CreateCommentRequest): Promise<TeamComment> {
    await db.read();
    const newComment: TeamComment = {
      id: Math.max(0, ...db.data.comments.map(c => c.id)) + 1,
      teamId: data.teamId,
      userId: data.userId,
      nickname: data.nickname,
      content: data.content,
      rating: data.rating,
      createdAt: new Date().toISOString()
    };
    db.data.comments.push(newComment);
    await saveDatabase();
    return newComment;
  }

  async getAverageRating(teamId: number): Promise<{ avgRating: number; totalComments: number }> {
    await db.read();
    const teamComments = db.data.comments.filter(c => c.teamId === teamId);
    if (teamComments.length === 0) {
      return { avgRating: 0, totalComments: 0 };
    }
    const total = teamComments.reduce((sum, c) => sum + c.rating, 0);
    return {
      avgRating: total / teamComments.length,
      totalComments: teamComments.length
    };
  }

  async findByUserIdWithTeam(userId: number): Promise<TeamCommentWithTeam[]> {
    await db.read();
    const userComments = db.data.comments.filter(c => c.userId === userId);
    
    return userComments.map(comment => {
      const team = db.data.teams.find(t => t.id === comment.teamId);
      return {
        ...comment,
        teamName: team?.name,
        teamAvatar: team?.avatar
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
