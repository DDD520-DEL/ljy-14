import { UserRepository } from '../repositories/UserRepository.js';
import { User, UserResponse, CreateUserRequest } from '../../shared/types.js';

const userRepository = new UserRepository();

export class UserService {
  async getUserById(id: number): Promise<User | undefined> {
    return userRepository.findById(id);
  }

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    if (!data.nickname || data.nickname.trim().length === 0) {
      return { success: false, message: '请输入昵称' };
    }
    if (data.nickname.length > 20) {
      return { success: false, message: '昵称不能超过20个字符' };
    }

    const trimmedNickname = data.nickname.trim();
    
    let user = await userRepository.findByNickname(trimmedNickname);
    if (user) {
      return { success: true, user, message: '欢迎回来！' };
    }

    user = await userRepository.create({ nickname: trimmedNickname });
    return { success: true, user, message: '用户创建成功！' };
  }
}
