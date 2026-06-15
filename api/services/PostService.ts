import { PostRepository } from '../repositories/PostRepository.js';
import { TeamRepository } from '../repositories/TeamRepository.js';
import { TeamPost, TeamPostWithTeam, CreatePostRequest } from '../../shared/types.js';

const postRepository = new PostRepository();
const teamRepository = new TeamRepository();

export class PostService {
  async getPosts(page?: number, pageSize?: number): Promise<{ posts: TeamPostWithTeam[]; total: number }> {
    return postRepository.findAll(page, pageSize);
  }

  async getTeamPosts(teamId: number): Promise<TeamPost[]> {
    return postRepository.findByTeamId(teamId);
  }

  async getPostById(id: number): Promise<TeamPost | undefined> {
    return postRepository.findById(id);
  }

  async createPost(request: CreatePostRequest): Promise<TeamPost | { error: string }> {
    const team = await teamRepository.findById(request.teamId);
    if (!team) {
      return { error: '舞队不存在' };
    }

    if (!request.content || request.content.trim().length === 0) {
      return { error: '动态内容不能为空' };
    }

    const newPost = await postRepository.create({
      teamId: request.teamId,
      content: request.content.trim(),
      images: request.images || [],
      parkLat: team.parkLat,
      parkLng: team.parkLng,
      parkName: team.parkName,
    });

    return newPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return postRepository.delete(id);
  }
}
