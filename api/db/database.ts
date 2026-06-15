import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Team, Song, VoteRecord, TeamComment, DanceInvitation, User, TeamPost, BattleRecord } from '../../shared/types.js';
import { mockTeams, mockSongs, mockComments, mockPosts } from './mockData.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory:', dataDir);
}

export interface DatabaseSchema {
  teams: Team[];
  songs: Song[];
  votes: VoteRecord[];
  comments: TeamComment[];
  invitations: DanceInvitation[];
  users: User[];
  posts: TeamPost[];
  battleRecords: BattleRecord[];
}

const file = path.join(dataDir, 'db.json');
const adapter = new JSONFile<DatabaseSchema>(file);

const defaultData: DatabaseSchema = {
  teams: [],
  songs: [],
  votes: [],
  comments: [],
  invitations: [],
  users: [],
  posts: [],
  battleRecords: []
};

export const db = new Low<DatabaseSchema>(adapter, defaultData);

function generateMockVotes(songs: Song[], userCount: number): VoteRecord[] {
  const votes: VoteRecord[] = [];
  let voteId = 1;
  const now = new Date();

  songs.forEach((song) => {
    const totalVotes = Math.floor(Math.random() * 20) + 10;
    for (let i = 0; i < totalVotes; i++) {
      const daysAgo = Math.floor(Math.random() * 14);
      const voteDate = new Date(now);
      voteDate.setDate(voteDate.getDate() - daysAgo);
      voteDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      votes.push({
        id: voteId++,
        type: 'addict',
        targetId: song.id,
        userId: Math.floor(Math.random() * userCount) + 1,
        userIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        score: Math.floor(Math.random() * 2) + 4,
        createdAt: voteDate.toISOString()
      });
    }
  });

  mockTeams.forEach((team) => {
    const totalVotes = Math.floor(Math.random() * 15) + 8;
    for (let i = 0; i < totalVotes; i++) {
      const daysAgo = Math.floor(Math.random() * 14);
      const voteDate = new Date(now);
      voteDate.setDate(voteDate.getDate() - daysAgo);
      voteDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      votes.push({
        id: voteId++,
        type: 'costume',
        targetId: team.id,
        userId: Math.floor(Math.random() * userCount) + 1,
        userIp: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        score: Math.floor(Math.random() * 2) + 4,
        createdAt: voteDate.toISOString()
      });
    }
  });

  return votes;
}

function generateMockUsers(): User[] {
  const nicknames = ['广场舞达人', '舞林高手', '快乐舞者', '夕阳红', '翩翩少年', '舞动人生', '快乐大妈', '健身达人', '舞蹈爱好者', '舞王争霸'];
  const users: User[] = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const createDate = new Date(now);
    createDate.setDate(createDate.getDate() - daysAgo);

    users.push({
      id: i + 1,
      nickname: nicknames[i],
      createdAt: createDate.toISOString()
    });
  }

  return users;
}

export async function initDatabase(): Promise<void> {
  await db.read();
  
  if (!db.data.invitations) {
    db.data.invitations = [];
  }
  
  if (!db.data.users) {
    db.data.users = [];
  }
  
  if (!db.data.posts) {
    db.data.posts = [];
  }
  
  if (!db.data.battleRecords) {
    db.data.battleRecords = [];
  }
  
  if (!db.data.teams || db.data.teams.length === 0) {
    const mockUsers = generateMockUsers();
    db.data.users = mockUsers;
    db.data.teams = mockTeams;
    db.data.songs = mockSongs;
    db.data.votes = generateMockVotes(mockSongs, mockUsers.length);
    db.data.comments = mockComments;
    db.data.posts = mockPosts;
    db.data.battleRecords = [];
    await db.write();
    console.log('Database initialized with mock data');
  } else {
    let needsUpdate = false;
    db.data.songs.forEach(song => {
      if (song.battleCount === undefined) {
        song.battleCount = 0;
        needsUpdate = true;
      }
      if (song.battleWins === undefined) {
        song.battleWins = 0;
        needsUpdate = true;
      }
    });
    if (needsUpdate) {
      await db.write();
      console.log('Database migrated: added battle fields to songs');
    }
  }
}

export async function saveDatabase(): Promise<void> {
  await db.write();
}
