import { VoteRepository } from '../repositories/VoteRepository.js';
import { TeamRepository } from '../repositories/TeamRepository.js';
import { SongRepository } from '../repositories/SongRepository.js';
import { VoteResponse } from '../../shared/types.js';

const voteRepository = new VoteRepository();
const teamRepository = new TeamRepository();
const songRepository = new SongRepository();

export class VoteService {
  async voteAddict(songId: number, score: number, userIp: string): Promise<VoteResponse> {
    const existingVote = await voteRepository.findByUserIp('addict', songId, userIp);
    if (existingVote) {
      return {
        success: false,
        newScore: 0,
        totalVotes: 0,
        message: '您已经为这首歌投过票了'
      };
    }

    await voteRepository.create({
      type: 'addict',
      targetId: songId,
      userIp,
      score
    });

    const { score: avgScore, votes } = await voteRepository.getAverageScore('addict', songId);
    await songRepository.updateAddictScore(songId, avgScore, votes);

    return {
      success: true,
      newScore: avgScore,
      totalVotes: votes,
      message: '投票成功！'
    };
  }

  async voteCostume(teamId: number, score: number, userIp: string): Promise<VoteResponse> {
    const existingVote = await voteRepository.findByUserIp('costume', teamId, userIp);
    if (existingVote) {
      return {
        success: false,
        newScore: 0,
        totalVotes: 0,
        message: '您已经为这个舞队的服装投过票了'
      };
    }

    await voteRepository.create({
      type: 'costume',
      targetId: teamId,
      userIp,
      score
    });

    const { score: avgScore, votes } = await voteRepository.getAverageScore('costume', teamId);
    await teamRepository.updateCostumeScore(teamId, avgScore, votes);

    return {
      success: true,
      newScore: avgScore,
      totalVotes: votes,
      message: '投票成功！'
    };
  }
}
