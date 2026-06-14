export interface Team {
  id: number;
  name: string;
  leader: string;
  phone: string;
  establishedAt: string;
  memberCount: number;
  district: string;
  style: string;
  description: string;
  avatar: string;
  groupPhoto: string;
  costumePhoto: string;
  parkName: string;
  parkLat: number;
  parkLng: number;
  activityTime: string;
  costumeScore: number;
  costumeVotes: number;
  createdAt: string;
}

export interface Song {
  id: number;
  teamId: number;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverUrl: string;
  addictScore: number;
  addictVotes: number;
  createdAt: string;
}

export interface VoteRecord {
  id: number;
  type: 'addict' | 'costume';
  targetId: number;
  userIp: string;
  score: number;
  createdAt: string;
}

export interface TeamWithSongs extends Team {
  songs: Song[];
}

export interface BattlePair {
  song1: Song;
  song2: Song;
  team1: Team;
  team2: Team;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface VoteResponse {
  success: boolean;
  newScore: number;
  totalVotes: number;
  message?: string;
}

export interface TeamComment {
  id: number;
  teamId: number;
  nickname: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface CreateCommentRequest {
  teamId: number;
  nickname: string;
  content: string;
  rating: number;
}

export interface CreateCommentResponse {
  success: boolean;
  comment?: TeamComment;
  message?: string;
}

export type InvitationStatus = 'pending' | 'accepted' | 'rejected';

export interface DanceInvitation {
  id: number;
  fromTeamId: number;
  toTeamId: number;
  fromTeamName?: string;
  toTeamName?: string;
  danceTime: string;
  location: string;
  remark: string;
  status: InvitationStatus;
  createdAt: string;
  respondedAt?: string;
}

export interface CreateInvitationRequest {
  fromTeamId: number;
  toTeamId: number;
  danceTime: string;
  location: string;
  remark: string;
}

export interface InvitationResponse {
  success: boolean;
  invitation?: DanceInvitation;
  message?: string;
}

export interface InvitationWithTeamNames extends DanceInvitation {
  fromTeamName: string;
  toTeamName: string;
}
