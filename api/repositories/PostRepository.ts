import { db, saveDatabase } from '../db/database.js';
import { TeamPost, TeamPostWithTeam } from '../../shared/types.js';

export class PostRepository {
  async findAll(page?: number, pageSize?: number): Promise<{ posts: TeamPostWithTeam[]; total: number }> {
    await db.read();
    const posts = [...db.data.posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = posts.length;

    let paginatedPosts = posts;
    if (page !== undefined && pageSize !== undefined) {
      const start = (page - 1) * pageSize;
      paginatedPosts = posts.slice(start, start + pageSize);
    }

    const postsWithTeam: TeamPostWithTeam[] = paginatedPosts.map((post) => {
      const team = db.data.teams.find((t) => t.id === post.teamId);
      return {
        ...post,
        teamName: team?.name,
        teamAvatar: team?.avatar,
        teamDistrict: team?.district,
      };
    });

    return { posts: postsWithTeam, total };
  }

  async findByTeamId(teamId: number): Promise<TeamPost[]> {
    await db.read();
    return db.data.posts
      .filter((p) => p.teamId === teamId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findById(id: number): Promise<TeamPost | undefined> {
    await db.read();
    return db.data.posts.find((p) => p.id === id);
  }

  async create(
    post: Omit<TeamPost, 'id' | 'createdAt' | 'parkLat' | 'parkLng' | 'parkName'> & {
      parkLat: number;
      parkLng: number;
      parkName: string;
    }
  ): Promise<TeamPost> {
    await db.read();
    const newPost: TeamPost = {
      ...post,
      id: Math.max(0, ...db.data.posts.map((p) => p.id)) + 1,
      createdAt: new Date().toISOString(),
    };
    db.data.posts.push(newPost);
    await saveDatabase();
    return newPost;
  }

  async delete(id: number): Promise<boolean> {
    await db.read();
    const index = db.data.posts.findIndex((p) => p.id === id);
    if (index === -1) return false;
    db.data.posts.splice(index, 1);
    await saveDatabase();
    return true;
  }
}
