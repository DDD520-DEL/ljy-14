import { CheckInRepository } from '../repositories/CheckInRepository.js';
import { CheckInResponse, CheckInRecord, CheckInStatus } from '../../shared/types.js';

const checkInRepository = new CheckInRepository();

export class CheckInService {
  async getStatus(userId: number): Promise<CheckInStatus> {
    return checkInRepository.getStatus(userId);
  }

  async getRecords(userId: number): Promise<CheckInRecord[]> {
    return checkInRepository.findByUserId(userId);
  }

  async getMonthRecords(userId: number, year: number, month: number): Promise<CheckInRecord[]> {
    return checkInRepository.findByUserIdAndMonth(userId, year, month);
  }

  async checkIn(userId: number): Promise<CheckInResponse> {
    const record = await checkInRepository.create(userId);
    if (!record) {
      return { success: false, message: '今日已签到' };
    }
    const status = await checkInRepository.getStatus(userId);
    return { success: true, message: '签到成功！', record, status };
  }
}
