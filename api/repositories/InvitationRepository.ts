import { db, saveDatabase } from '../db/database.js';
import { DanceInvitation, InvitationStatus, InvitationWithTeamNames } from '../../shared/types.js';

export class InvitationRepository {
  async findAll(): Promise<DanceInvitation[]> {
    await db.read();
    return [...db.data.invitations];
  }

  async findById(id: number): Promise<DanceInvitation | undefined> {
    await db.read();
    return db.data.invitations.find(i => i.id === id);
  }

  async findByTeamId(teamId: number): Promise<InvitationWithTeamNames[]> {
    await db.read();
    const invitations = db.data.invitations.filter(
      i => i.fromTeamId === teamId || i.toTeamId === teamId
    );
    return invitations.map(inv => this.enrichWithTeamNames(inv));
  }

  async findSentByTeamId(teamId: number): Promise<InvitationWithTeamNames[]> {
    await db.read();
    const invitations = db.data.invitations.filter(i => i.fromTeamId === teamId);
    return invitations.map(inv => this.enrichWithTeamNames(inv));
  }

  async findReceivedByTeamId(teamId: number): Promise<InvitationWithTeamNames[]> {
    await db.read();
    const invitations = db.data.invitations.filter(i => i.toTeamId === teamId);
    return invitations.map(inv => this.enrichWithTeamNames(inv));
  }

  async findPendingByTeamId(teamId: number): Promise<InvitationWithTeamNames[]> {
    await db.read();
    const invitations = db.data.invitations.filter(
      i => (i.fromTeamId === teamId || i.toTeamId === teamId) && i.status === 'pending'
    );
    return invitations.map(inv => this.enrichWithTeamNames(inv));
  }

  async findCompletedByTeamId(teamId: number): Promise<InvitationWithTeamNames[]> {
    await db.read();
    const invitations = db.data.invitations.filter(
      i => (i.fromTeamId === teamId || i.toTeamId === teamId) && i.status !== 'pending'
    );
    return invitations.map(inv => this.enrichWithTeamNames(inv));
  }

  async create(invitation: Omit<DanceInvitation, 'id' | 'createdAt' | 'status'>): Promise<DanceInvitation> {
    await db.read();
    const newInvitation: DanceInvitation = {
      ...invitation,
      id: Math.max(0, ...db.data.invitations.map(i => i.id)) + 1,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    db.data.invitations.push(newInvitation);
    await saveDatabase();
    return newInvitation;
  }

  async updateStatus(id: number, status: InvitationStatus): Promise<DanceInvitation | undefined> {
    await db.read();
    const index = db.data.invitations.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    
    db.data.invitations[index] = {
      ...db.data.invitations[index],
      status,
      respondedAt: new Date().toISOString()
    };
    await saveDatabase();
    return this.enrichWithTeamNames(db.data.invitations[index]);
  }

  private enrichWithTeamNames(invitation: DanceInvitation): InvitationWithTeamNames {
    const fromTeam = db.data.teams.find(t => t.id === invitation.fromTeamId);
    const toTeam = db.data.teams.find(t => t.id === invitation.toTeamId);
    return {
      ...invitation,
      fromTeamName: fromTeam?.name || '未知舞队',
      toTeamName: toTeam?.name || '未知舞队'
    };
  }
}
