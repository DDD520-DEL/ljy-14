import { CommentRepository } from '../repositories/CommentRepository.js';
import { TeamComment, CreateCommentRequest, CreateCommentResponse, TeamCommentWithTeam } from '../../shared/types.js';

const commentRepository = new CommentRepository();

export class CommentService {
  async getTeamComments(teamId: number): Promise<TeamComment[]> {
    return commentRepository.findByTeamId(teamId);
  }

  async createComment(data: CreateCommentRequest): Promise<CreateCommentResponse> {
    if (!data.nickname || data.nickname.trim().length === 0) {
      return { success: false, message: '请输入昵称' };
    }
    if (!data.content || data.content.trim().length === 0) {
      return { success: false, message: '请输入留言内容' };
    }
    if (data.content.length > 500) {
      return { success: false, message: '留言内容不能超过500字' };
    }
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      return { success: false, message: '请选择1-5星评分' };
    }

    const comment = await commentRepository.create(data);
    return { success: true, comment };
  }

  async getTeamRating(teamId: number): Promise<{ avgRating: number; totalComments: number }> {
    return commentRepository.getAverageRating(teamId);
  }

  async getUserComments(userId: number): Promise<TeamCommentWithTeam[]> {
    return commentRepository.findByUserIdWithTeam(userId);
  }
}
