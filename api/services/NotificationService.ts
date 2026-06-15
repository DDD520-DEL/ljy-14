import { NotificationRepository } from '../repositories/NotificationRepository.js';
import { Notification } from '../../shared/types.js';

const notificationRepository = new NotificationRepository();

export class NotificationService {
  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return notificationRepository.findByUserId(userId);
  }

  async getUnreadCount(userId: number): Promise<number> {
    return notificationRepository.findUnreadCount(userId);
  }

  async markAsRead(id: number, userId: number): Promise<boolean> {
    return notificationRepository.markAsRead(id, userId);
  }

  async markAllAsRead(userId: number): Promise<number> {
    return notificationRepository.markAllAsRead(userId);
  }

  async notifyFollowers(teamId: number, teamName: string, teamAvatar: string, songId: number, songTitle: string, followerUserIds: number[]): Promise<Notification[]> {
    if (followerUserIds.length === 0) return [];
    return notificationRepository.createForTeamFollowers(teamId, teamName, teamAvatar, songId, songTitle, followerUserIds);
  }
}
