import { db, saveDatabase } from '../db/database.js';
import { Notification } from '../../shared/types.js';

export class NotificationRepository {
  async findByUserId(userId: number): Promise<Notification[]> {
    await db.read();
    return db.data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findUnreadCount(userId: number): Promise<number> {
    await db.read();
    return db.data.notifications.filter(n => n.userId === userId && !n.read).length;
  }

  async create(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> {
    await db.read();
    const newNotification: Notification = {
      ...notification,
      id: Math.max(0, ...db.data.notifications.map(n => n.id)) + 1,
      read: false,
      createdAt: new Date().toISOString()
    };
    db.data.notifications.push(newNotification);
    await saveDatabase();
    return newNotification;
  }

  async markAsRead(id: number, userId: number): Promise<boolean> {
    await db.read();
    const notification = db.data.notifications.find(n => n.id === id && n.userId === userId);
    if (!notification) return false;
    notification.read = true;
    await saveDatabase();
    return true;
  }

  async markAllAsRead(userId: number): Promise<number> {
    await db.read();
    let count = 0;
    db.data.notifications.forEach(n => {
      if (n.userId === userId && !n.read) {
        n.read = true;
        count++;
      }
    });
    if (count > 0) await saveDatabase();
    return count;
  }

  async createForTeamFollowers(teamId: number, teamName: string, teamAvatar: string, songId: number, songTitle: string, followerUserIds: number[]): Promise<Notification[]> {
    await db.read();
    const notifications: Notification[] = [];
    const maxId = Math.max(0, ...db.data.notifications.map(n => n.id));
    const now = new Date().toISOString();

    followerUserIds.forEach((userId, index) => {
      const newNotification: Notification = {
        id: maxId + index + 1,
        userId,
        teamId,
        teamName,
        teamAvatar,
        songId,
        songTitle,
        read: false,
        createdAt: now
      };
      db.data.notifications.push(newNotification);
      notifications.push(newNotification);
    });

    await saveDatabase();
    return notifications;
  }
}
