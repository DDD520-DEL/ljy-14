import { db, saveDatabase } from '../db/database.js';
import { UserFavorite } from '../../shared/types.js';

export class UserFavoriteRepository {
  async findByUserId(userId: number): Promise<UserFavorite[]> {
    await db.read();
    return db.data.userFavorites.filter(f => f.userId === userId);
  }

  async findFollowerUserIds(teamId: number): Promise<number[]> {
    await db.read();
    const favorites = db.data.userFavorites.filter(f => f.teamId === teamId);
    return [...new Set(favorites.map(f => f.userId))];
  }

  async toggle(userId: number, teamId: number): Promise<{ favorited: boolean }> {
    await db.read();
    const existing = db.data.userFavorites.find(f => f.userId === userId && f.teamId === teamId);
    if (existing) {
      db.data.userFavorites = db.data.userFavorites.filter(f => f.id !== existing.id);
      await saveDatabase();
      return { favorited: false };
    }
    const newFavorite: UserFavorite = {
      id: Math.max(0, ...db.data.userFavorites.map(f => f.id)) + 1,
      userId,
      teamId,
      createdAt: new Date().toISOString()
    };
    db.data.userFavorites.push(newFavorite);
    await saveDatabase();
    return { favorited: true };
  }

  async isFavorite(userId: number, teamId: number): Promise<boolean> {
    await db.read();
    return db.data.userFavorites.some(f => f.userId === userId && f.teamId === teamId);
  }

  async getFavoriteTeamIds(userId: number): Promise<number[]> {
    await db.read();
    return db.data.userFavorites.filter(f => f.userId === userId).map(f => f.teamId);
  }

  async syncFromClient(userId: number, teamIds: number[]): Promise<void> {
    await db.read();
    db.data.userFavorites = db.data.userFavorites.filter(f => f.userId !== userId);
    let maxId = Math.max(0, ...db.data.userFavorites.map(f => f.id));
    teamIds.forEach(teamId => {
      maxId++;
      db.data.userFavorites.push({
        id: maxId,
        userId,
        teamId,
        createdAt: new Date().toISOString()
      });
    });
    await saveDatabase();
  }
}
