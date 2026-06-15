import { db, saveDatabase } from '../db/database.js';
import { CheckInRecord, CheckInStatus } from '../../shared/types.js';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === formatDate(yesterday);
}

export class CheckInRepository {
  async findByUserId(userId: number): Promise<CheckInRecord[]> {
    await db.read();
    return db.data.checkIns
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findByUserIdAndMonth(userId: number, year: number, month: number): Promise<CheckInRecord[]> {
    await db.read();
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    return db.data.checkIns
      .filter(c => c.userId === userId && c.date.startsWith(monthStr))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTodayRecord(userId: number): Promise<CheckInRecord | undefined> {
    await db.read();
    const today = formatDate(new Date());
    return db.data.checkIns.find(c => c.userId === userId && c.date === today);
  }

  async getStatus(userId: number): Promise<CheckInStatus> {
    await db.read();
    const userRecords = db.data.checkIns
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const today = formatDate(new Date());
    const todayCheckedIn = userRecords.some(r => r.date === today);
    const totalDays = userRecords.length;
    const lastCheckInDate = userRecords.length > 0 ? userRecords[0].date : null;

    let consecutiveDays = 0;
    if (userRecords.length > 0) {
      if (todayCheckedIn || isYesterday(userRecords[0].date)) {
        const currentDate = new Date(todayCheckedIn ? today : userRecords[0].date);
        for (const record of userRecords) {
          if (record.date === formatDate(currentDate)) {
            consecutiveDays++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    return {
      todayCheckedIn,
      consecutiveDays,
      totalDays,
      lastCheckInDate
    };
  }

  async create(userId: number): Promise<CheckInRecord | null> {
    await db.read();
    const today = formatDate(new Date());

    const existingRecord = db.data.checkIns.find(c => c.userId === userId && c.date === today);
    if (existingRecord) {
      return null;
    }

    const userRecords = db.data.checkIns
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let consecutiveDays = 1;
    if (userRecords.length > 0 && isYesterday(userRecords[0].date)) {
      consecutiveDays = userRecords[0].consecutiveDays + 1;
    }

    const newRecord: CheckInRecord = {
      id: Math.max(0, ...db.data.checkIns.map(c => c.id)) + 1,
      userId,
      date: today,
      consecutiveDays,
      createdAt: new Date().toISOString()
    };

    db.data.checkIns.push(newRecord);
    await saveDatabase();
    return newRecord;
  }
}
