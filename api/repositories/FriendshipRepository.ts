import { db, saveDatabase } from '../db/database.js';
import { TeamFriendship, TeamFriendshipWithDetails } from '../../shared/types.js';

export class FriendshipRepository {
  async findAll(): Promise<TeamFriendshipWithDetails[]> {
    await db.read();
    return db.data.friendships.map(f => this.enrichWithTeamDetails(f));
  }

  async findById(id: number): Promise<TeamFriendshipWithDetails | undefined> {
    await db.read();
    const friendship = db.data.friendships.find(f => f.id === id);
    return friendship ? this.enrichWithTeamDetails(friendship) : undefined;
  }

  async findByTeamId(teamId: number): Promise<TeamFriendshipWithDetails[]> {
    await db.read();
    const friendships = db.data.friendships.filter(
      f => f.teamId1 === teamId || f.teamId2 === teamId
    );
    return friendships.map(f => this.enrichWithTeamDetails(f));
  }

  async findBetweenTeams(teamId1: number, teamId2: number): Promise<TeamFriendship | undefined> {
    await db.read();
    return db.data.friendships.find(
      f => (f.teamId1 === teamId1 && f.teamId2 === teamId2) ||
           (f.teamId1 === teamId2 && f.teamId2 === teamId1)
    );
  }

  async create(friendship: Omit<TeamFriendship, 'id' | 'createdAt'>): Promise<TeamFriendship> {
    await db.read();
    const exists = db.data.friendships.find(
      f => (f.teamId1 === friendship.teamId1 && f.teamId2 === friendship.teamId2) ||
           (f.teamId1 === friendship.teamId2 && f.teamId2 === friendship.teamId1)
    );
    if (exists) {
      throw new Error('这两个舞队已经是友好舞队了');
    }
    const newFriendship: TeamFriendship = {
      ...friendship,
      id: Math.max(0, ...db.data.friendships.map(f => f.id)) + 1,
      createdAt: new Date().toISOString()
    };
    db.data.friendships.push(newFriendship);
    await saveDatabase();
    return newFriendship;
  }

  async delete(id: number): Promise<boolean> {
    await db.read();
    const index = db.data.friendships.findIndex(f => f.id === id);
    if (index === -1) return false;
    db.data.friendships.splice(index, 1);
    await saveDatabase();
    return true;
  }

  private enrichWithTeamDetails(friendship: TeamFriendship): TeamFriendshipWithDetails {
    const team1 = db.data.teams.find(t => t.id === friendship.teamId1);
    const team2 = db.data.teams.find(t => t.id === friendship.teamId2);
    return {
      ...friendship,
      team1Name: team1?.name || '未知舞队',
      team1Avatar: team1?.avatar || '',
      team2Name: team2?.name || '未知舞队',
      team2Avatar: team2?.avatar || ''
    };
  }
}
