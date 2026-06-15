import { FriendshipRepository } from '../repositories/FriendshipRepository.js';
import { TeamFriendship, TeamFriendshipWithDetails, CreateFriendshipRequest } from '../../shared/types.js';

const friendshipRepository = new FriendshipRepository();

export class FriendshipService {
  async getAllFriendships(): Promise<TeamFriendshipWithDetails[]> {
    return friendshipRepository.findAll();
  }

  async getFriendshipById(id: number): Promise<TeamFriendshipWithDetails | undefined> {
    return friendshipRepository.findById(id);
  }

  async getFriendshipsByTeamId(teamId: number): Promise<TeamFriendshipWithDetails[]> {
    return friendshipRepository.findByTeamId(teamId);
  }

  async createFriendship(request: CreateFriendshipRequest): Promise<TeamFriendship> {
    if (request.teamId1 === request.teamId2) {
      throw new Error('不能与自己建立友好关系');
    }
    const existing = await friendshipRepository.findBetweenTeams(request.teamId1, request.teamId2);
    if (existing) {
      throw new Error('这两个舞队已经是友好舞队了');
    }
    return friendshipRepository.create({
      teamId1: request.teamId1,
      teamId2: request.teamId2
    });
  }

  async deleteFriendship(id: number): Promise<boolean> {
    return friendshipRepository.delete(id);
  }
}
