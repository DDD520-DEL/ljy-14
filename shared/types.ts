export interface TeamVideo {
  id: number;
  title: string;
  url: string;
  thumbnail?: string;
  createdAt: string;
}

export interface TeamPhoto {
  id: number;
  url: string;
  title?: string;
  description?: string;
  uploadedBy?: string;
  createdAt: string;
}

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
  videos: TeamVideo[];
  photos: TeamPhoto[];
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
  battleCount: number;
  battleWins: number;
  createdAt: string;
}

export interface User {
  id: number;
  nickname: string;
  avatar?: string;
  createdAt: string;
}

export interface VoteRecord {
  id: number;
  type: 'addict' | 'costume';
  targetId: number;
  userId: number;
  userIp: string;
  score: number;
  createdAt: string;
}

export interface VoteRecordWithDetails extends VoteRecord {
  targetName?: string;
  targetPhoto?: string;
  teamName?: string;
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

export interface BattleRecord {
  id: number;
  song1Id: number;
  song2Id: number;
  song1Title: string;
  song2Title: string;
  team1Id: number;
  team2Id: number;
  team1Name: string;
  team2Name: string;
  winnerSongId: number;
  song1Score: number;
  song2Score: number;
  createdAt: string;
}

export interface BattleRecordWithDetails extends BattleRecord {
  song1?: Song;
  song2?: Song;
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
  userId?: number;
  nickname: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface TeamCommentWithTeam extends TeamComment {
  teamName?: string;
  teamAvatar?: string;
}

export interface CreateCommentRequest {
  teamId: number;
  userId?: number;
  nickname: string;
  content: string;
  rating: number;
}

export interface CreateUserRequest {
  nickname: string;
  deviceId?: string;
}

export interface UserResponse {
  success: boolean;
  user?: User;
  message?: string;
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

export interface TeamPost {
  id: number;
  teamId: number;
  content: string;
  images: string[];
  parkLat: number;
  parkLng: number;
  parkName: string;
  createdAt: string;
}

export interface TeamPostWithTeam extends TeamPost {
  teamName?: string;
  teamAvatar?: string;
  teamDistrict?: string;
}

export interface CreatePostRequest {
  teamId: number;
  content: string;
  images?: string[];
}

export interface PostResponse {
  success: boolean;
  post?: TeamPost;
  message?: string;
}

export interface ImportResult {
  success: boolean;
  totalCount: number;
  successCount: number;
  failCount: number;
  duplicateCount: number;
  errors: Array<{
    row: number;
    name?: string;
    message: string;
  }>;
}

export interface TeamFriendship {
  id: number;
  teamId1: number;
  teamId2: number;
  createdAt: string;
}

export interface TeamFriendshipWithDetails extends TeamFriendship {
  team1Name: string;
  team1Avatar: string;
  team2Name: string;
  team2Avatar: string;
}

export interface CreateFriendshipRequest {
  teamId1: number;
  teamId2: number;
}

export interface FriendshipResponse {
  success: boolean;
  friendship?: TeamFriendship;
  message?: string;
}

export interface UserFavorite {
  id: number;
  userId: number;
  teamId: number;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  teamId: number;
  teamName: string;
  teamAvatar: string;
  songId: number;
  songTitle: string;
  read: boolean;
  createdAt: string;
}

export interface TeamImportRow {
  name: string;
  leader: string;
  phone: string;
  establishedAt: string;
  memberCount: number;
  district: string;
  style: string;
  description?: string;
  parkName?: string;
  parkLat?: number;
  parkLng?: number;
  activityTime?: string;
  avatar?: string;
  groupPhoto?: string;
  costumePhoto?: string;
  songs?: Array<{
    title: string;
    artist?: string;
    genre?: string;
    duration?: string;
    coverUrl?: string;
  }>;
}

export interface CheckInRecord {
  id: number;
  userId: number;
  date: string;
  consecutiveDays: number;
  createdAt: string;
}

export interface CheckInStatus {
  todayCheckedIn: boolean;
  consecutiveDays: number;
  totalDays: number;
  lastCheckInDate: string | null;
}

export interface CheckInResponse {
  success: boolean;
  message?: string;
  record?: CheckInRecord;
  status?: CheckInStatus;
}

export interface PlaylistSong {
  songId: number;
  addedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: PlaylistSong[];
  createdAt: string;
  updatedAt: string;
}

export type EncyclopediaCategory = 'dance_skill' | 'fitness_tip' | 'safety_tip';

export interface EncyclopediaArticle {
  id: number;
  title: string;
  category: EncyclopediaCategory;
  summary: string;
  content: string;
  coverImage: string;
  images: string[];
  author: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEncyclopediaRequest {
  title: string;
  category: EncyclopediaCategory;
  summary: string;
  content: string;
  coverImage: string;
  images?: string[];
  author: string;
}

export interface UpdateEncyclopediaRequest {
  title?: string;
  category?: EncyclopediaCategory;
  summary?: string;
  content?: string;
  coverImage?: string;
  images?: string[];
  author?: string;
}

export interface EncyclopediaResponse {
  success: boolean;
  article?: EncyclopediaArticle;
  message?: string;
}

export interface EncyclopediaListResponse {
  data: EncyclopediaArticle[];
  total: number;
  page: number;
  pageSize: number;
}

export type ActivityType = 'rehearsal' | 'performance' | 'competition' | 'other';

export interface TeamActivity {
  id: number;
  teamId: number;
  teamName?: string;
  teamAvatar?: string;
  teamDistrict?: string;
  title: string;
  type: ActivityType;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  parkLat?: number;
  parkLng?: number;
  coverImage?: string;
  participants?: number;
  createdAt: string;
}

export interface ActivityWithTeam extends TeamActivity {
  teamName: string;
  teamAvatar: string;
  teamDistrict: string;
}

export interface Recruitment {
  id: number;
  teamId: number;
  teamName?: string;
  teamAvatar?: string;
  teamDistrict?: string;
  title: string;
  description: string;
  recruitCount: number;
  minAge?: number;
  maxAge?: number;
  gender?: 'male' | 'female' | 'any';
  contactName: string;
  contactPhone: string;
  contactWechat?: string;
  requirements?: string;
  benefits?: string;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface RecruitmentWithTeam extends Recruitment {
  teamName: string;
  teamAvatar: string;
  teamDistrict: string;
}

export interface CreateRecruitmentRequest {
  teamId: number;
  title: string;
  description: string;
  recruitCount: number;
  minAge?: number;
  maxAge?: number;
  gender?: 'male' | 'female' | 'any';
  contactName: string;
  contactPhone: string;
  contactWechat?: string;
  requirements?: string;
  benefits?: string;
}

export interface UpdateRecruitmentRequest {
  title?: string;
  description?: string;
  recruitCount?: number;
  minAge?: number;
  maxAge?: number;
  gender?: 'male' | 'female' | 'any';
  contactName?: string;
  contactPhone?: string;
  contactWechat?: string;
  requirements?: string;
  benefits?: string;
  status?: 'active' | 'closed';
}

export interface RecruitmentResponse {
  success: boolean;
  recruitment?: Recruitment;
  message?: string;
}

export interface RecruitmentListResponse {
  data: RecruitmentWithTeam[];
  total: number;
  page: number;
  pageSize: number;
}
