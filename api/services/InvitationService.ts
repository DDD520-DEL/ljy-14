import { InvitationRepository } from '../repositories/InvitationRepository.js';
import { DanceInvitation, InvitationWithTeamNames, CreateInvitationRequest } from '../../shared/types.js';

const invitationRepository = new InvitationRepository();

export class InvitationService {
  async getAllInvitations(): Promise<DanceInvitation[]> {
    return invitationRepository.findAll();
  }

  async getInvitationById(id: number): Promise<DanceInvitation | undefined> {
    return invitationRepository.findById(id);
  }

  async getInvitationsByTeamId(teamId: number): Promise<InvitationWithTeamNames[]> {
    return invitationRepository.findByTeamId(teamId);
  }

  async getSentInvitations(teamId: number): Promise<InvitationWithTeamNames[]> {
    return invitationRepository.findSentByTeamId(teamId);
  }

  async getReceivedInvitations(teamId: number): Promise<InvitationWithTeamNames[]> {
    return invitationRepository.findReceivedByTeamId(teamId);
  }

  async getPendingInvitations(teamId: number): Promise<InvitationWithTeamNames[]> {
    return invitationRepository.findPendingByTeamId(teamId);
  }

  async getCompletedInvitations(teamId: number): Promise<InvitationWithTeamNames[]> {
    return invitationRepository.findCompletedByTeamId(teamId);
  }

  async createInvitation(request: CreateInvitationRequest): Promise<DanceInvitation> {
    if (request.fromTeamId === request.toTeamId) {
      throw new Error('不能向自己的舞队发起约舞邀请');
    }
    if (!request.danceTime || !request.location) {
      throw new Error('请填写约舞时间和地点');
    }
    return invitationRepository.create({
      fromTeamId: request.fromTeamId,
      toTeamId: request.toTeamId,
      danceTime: request.danceTime,
      location: request.location,
      remark: request.remark || ''
    });
  }

  async acceptInvitation(id: number): Promise<DanceInvitation | undefined> {
    return invitationRepository.updateStatus(id, 'accepted');
  }

  async rejectInvitation(id: number): Promise<DanceInvitation | undefined> {
    return invitationRepository.updateStatus(id, 'rejected');
  }
}
