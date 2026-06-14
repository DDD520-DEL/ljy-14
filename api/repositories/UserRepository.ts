import { db, saveDatabase } from '../db/database.js';
import { User } from '../../shared/types.js';

export class UserRepository {
  async findById(id: number): Promise<User | undefined> {
    await db.read();
    return db.data.users.find(u => u.id === id);
  }

  async findByNickname(nickname: string): Promise<User | undefined> {
    await db.read();
    return db.data.users.find(u => u.nickname === nickname);
  }

  async create(data: { nickname: string }): Promise<User> {
    await db.read();
    const newUser: User = {
      id: Math.max(0, ...db.data.users.map(u => u.id)) + 1,
      nickname: data.nickname,
      createdAt: new Date().toISOString()
    };
    db.data.users.push(newUser);
    await saveDatabase();
    return newUser;
  }

  async update(id: number, data: Partial<User>): Promise<User | undefined> {
    await db.read();
    const index = db.data.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    
    db.data.users[index] = { ...db.data.users[index], ...data };
    await saveDatabase();
    return db.data.users[index];
  }
}
