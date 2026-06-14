import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Team, Song, VoteRecord } from '../../shared/types.js';
import { mockTeams, mockSongs } from './mockData.js';

export interface DatabaseSchema {
  teams: Team[];
  songs: Song[];
  votes: VoteRecord[];
}

const file = './data/db.json';
const adapter = new JSONFile<DatabaseSchema>(file);

const defaultData: DatabaseSchema = {
  teams: [],
  songs: [],
  votes: []
};

export const db = new Low<DatabaseSchema>(adapter, defaultData);

export async function initDatabase(): Promise<void> {
  await db.read();
  
  if (!db.data.teams || db.data.teams.length === 0) {
    db.data.teams = mockTeams;
    db.data.songs = mockSongs;
    db.data.votes = [];
    await db.write();
    console.log('Database initialized with mock data');
  }
}

export async function saveDatabase(): Promise<void> {
  await db.write();
}
