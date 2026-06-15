import { TeamRepository } from '../repositories/TeamRepository.js';
import { SongRepository } from '../repositories/SongRepository.js';
import { Team, Song, ImportResult, TeamImportRow } from '../../shared/types.js';
import { read, utils } from 'xlsx';
import { Buffer } from 'node:buffer';

const teamRepository = new TeamRepository();
const songRepository = new SongRepository();

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop';
const DEFAULT_GROUP_PHOTO = 'https://images.unsplash.com/photo-1529543544282-ea647b92a51e?w=800&h=400&fit=crop';
const DEFAULT_COSTUME_PHOTO = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop';
const DEFAULT_SONG_COVER = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop';

const REQUIRED_TEAM_FIELDS = ['name', 'leader', 'phone', 'establishedAt', 'memberCount', 'district', 'style'] as const;
const REQUIRED_SONG_FIELDS = ['title'] as const;

function safeParseDate(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'number') {
    const date = new Date(Math.round((value - 25569) * 86400 * 1000));
    return date.toISOString();
  }
  return new Date().toISOString();
}

function safeParseNumber(value: unknown, defaultValue = 0): number {
  if (value === null || value === undefined || value === '') return defaultValue;
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? defaultValue : num;
}

function safeString(value: unknown, defaultValue = ''): string {
  if (value === null || value === undefined) return defaultValue;
  const str = String(value).trim();
  return str === '' ? defaultValue : str;
}

function validateTeamRow(row: Record<string, unknown>, rowNum: number): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const field of REQUIRED_TEAM_FIELDS) {
    const fieldLabel = getFieldLabel(field);
    const value = row[field];
    if (value === undefined || value === null || String(value).trim() === '') {
      errors.push(`缺少必填字段：${fieldLabel}`);
    }
  }

  if (row.name && safeString(row.name).length > 100) {
    errors.push('舞队名称长度不能超过100个字符');
  }

  if (row.phone) {
    const phoneStr = safeString(row.phone);
    if (!/^1[3-9]\d{9}$/.test(phoneStr) && !/^\d{3,4}-?\d{7,8}$/.test(phoneStr)) {
      errors.push('联系电话格式不正确');
    }
  }

  if (row.memberCount) {
    const count = safeParseNumber(row.memberCount, -1);
    if (count <= 0 || count > 10000) {
      errors.push('队员人数必须在1-10000之间');
    }
  }

  if (row.parkLat !== undefined && row.parkLat !== null && String(row.parkLat).trim() !== '') {
    const lat = safeParseNumber(row.parkLat, NaN);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('公园纬度格式不正确（-90 到 90）');
    }
  }

  if (row.parkLng !== undefined && row.parkLng !== null && String(row.parkLng).trim() !== '') {
    const lng = safeParseNumber(row.parkLng, NaN);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push('公园经度格式不正确（-180 到 180）');
    }
  }

  return { valid: errors.length === 0, errors };
}

function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    name: '舞队名称',
    leader: '队长姓名',
    phone: '联系电话',
    establishedAt: '成立日期',
    memberCount: '队员人数',
    district: '所在区域',
    style: '舞蹈风格',
    description: '舞队简介',
    parkName: '活动公园名称',
    parkLat: '公园纬度',
    parkLng: '公园经度',
    activityTime: '活动时间',
    avatar: '头像URL',
    groupPhoto: '集体照URL',
    costumePhoto: '服装照URL',
    title: '歌曲名称',
    artist: '歌手',
    genre: '曲风',
    duration: '时长',
    coverUrl: '封面URL'
  };
  return labels[field] || field;
}

function rowToTeamRow(row: Record<string, unknown>): TeamImportRow {
  return {
    name: safeString(row.name),
    leader: safeString(row.leader),
    phone: safeString(row.phone),
    establishedAt: safeParseDate(row.establishedAt),
    memberCount: safeParseNumber(row.memberCount, 10),
    district: safeString(row.district),
    style: safeString(row.style),
    description: safeString(row.description),
    parkName: safeString(row.parkName),
    parkLat: row.parkLat !== undefined && row.parkLat !== null && String(row.parkLat).trim() !== '' 
      ? safeParseNumber(row.parkLat, 39.9042) 
      : 39.9042,
    parkLng: row.parkLng !== undefined && row.parkLng !== null && String(row.parkLng).trim() !== '' 
      ? safeParseNumber(row.parkLng, 116.4074) 
      : 116.4074,
    activityTime: safeString(row.activityTime, '每周一、三、五 19:00-21:00'),
    avatar: safeString(row.avatar, DEFAULT_AVATAR),
    groupPhoto: safeString(row.groupPhoto, DEFAULT_GROUP_PHOTO),
    costumePhoto: safeString(row.costumePhoto, DEFAULT_COSTUME_PHOTO),
  };
}

function extractSongsFromRow(row: Record<string, unknown>): Array<{ title: string; artist?: string; genre?: string; duration?: string; coverUrl?: string }> {
  const songs: Array<{ title: string; artist?: string; genre?: string; duration?: string; coverUrl?: string }> = [];
  
  for (let i = 1; i <= 10; i++) {
    const titleKey = i === 1 ? 'songTitle' : `songTitle${i}`;
    const altTitleKey = i === 1 ? '歌曲名称' : `歌曲名称${i}`;
    const title = safeString(row[titleKey] ?? row[altTitleKey]);
    
    if (!title) continue;

    const artistKey = i === 1 ? 'songArtist' : `songArtist${i}`;
    const altArtistKey = i === 1 ? '歌手' : `歌手${i}`;
    const genreKey = i === 1 ? 'songGenre' : `songGenre${i}`;
    const altGenreKey = i === 1 ? '曲风' : `曲风${i}`;
    const durationKey = i === 1 ? 'songDuration' : `songDuration${i}`;
    const altDurationKey = i === 1 ? '时长' : `时长${i}`;
    const coverKey = i === 1 ? 'songCover' : `songCover${i}`;
    const altCoverKey = i === 1 ? '封面' : `封面${i}`;

    songs.push({
      title,
      artist: safeString(row[artistKey] ?? row[altArtistKey]) || undefined,
      genre: safeString(row[genreKey] ?? row[altGenreKey]) || undefined,
      duration: safeString(row[durationKey] ?? row[altDurationKey]) || undefined,
      coverUrl: safeString(row[coverKey] ?? row[altCoverKey], DEFAULT_SONG_COVER)
    });
  }

  return songs;
}

export class ImportService {
  async parseExcel(buffer: Buffer): Promise<Record<string, unknown>[]> {
    const workbook = read(buffer, { type: 'buffer' });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    return utils.sheet_to_json(worksheet, { defval: '' });
  }

  async importTeamsFromExcel(buffer: Buffer): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      totalCount: 0,
      successCount: 0,
      failCount: 0,
      duplicateCount: 0,
      errors: []
    };

    try {
      const rows = await this.parseExcel(buffer);
      result.totalCount = rows.length;

      const createdTeamIds = new Map<string, number>();

      for (let i = 0; i < rows.length; i++) {
        const rowIndex = i + 2;
        const rawRow = rows[i];
        
        const validation = validateTeamRow(rawRow, rowIndex);
        if (!validation.valid) {
          result.failCount++;
          result.errors.push({
            row: rowIndex,
            name: safeString(rawRow.name) || '（未知）',
            message: validation.errors.join('；')
          });
          continue;
        }

        const teamRow = rowToTeamRow(rawRow);

        if (createdTeamIds.has(teamRow.name)) {
          result.duplicateCount++;
          result.failCount++;
          result.errors.push({
            row: rowIndex,
            name: teamRow.name,
            message: '同一文件内舞队名称重复'
          });
          continue;
        }

        const existingTeam = await teamRepository.findByName(teamRow.name);
        if (existingTeam) {
          result.duplicateCount++;
          result.failCount++;
          result.errors.push({
            row: rowIndex,
            name: teamRow.name,
            message: '舞队名称已存在'
          });
          continue;
        }

        try {
          const newTeam: Omit<Team, 'id' | 'createdAt' | 'costumeScore' | 'costumeVotes' | 'videos'> = {
            name: teamRow.name,
            leader: teamRow.leader,
            phone: teamRow.phone,
            establishedAt: teamRow.establishedAt,
            memberCount: teamRow.memberCount,
            district: teamRow.district,
            style: teamRow.style,
            description: teamRow.description ?? '',
            avatar: teamRow.avatar,
            groupPhoto: teamRow.groupPhoto,
            costumePhoto: teamRow.costumePhoto,
            parkName: teamRow.parkName ?? '市民广场',
            parkLat: teamRow.parkLat,
            parkLng: teamRow.parkLng,
            activityTime: teamRow.activityTime,
          };

          const createdTeam = await teamRepository.create(newTeam);
          createdTeamIds.set(teamRow.name, createdTeam.id);

          const songs = extractSongsFromRow(rawRow);
          for (const song of songs) {
            try {
              const newSong: Omit<Song, 'id' | 'createdAt' | 'addictScore' | 'addictVotes'> = {
                teamId: createdTeam.id,
                title: song.title,
                artist: song.artist ?? '未知歌手',
                genre: song.genre ?? '流行',
                duration: song.duration ?? '3:30',
                coverUrl: song.coverUrl ?? DEFAULT_SONG_COVER,
                battleCount: 0,
                battleWins: 0
              };
              await songRepository.create(newSong);
            } catch (songError) {
              result.errors.push({
                row: rowIndex,
                name: teamRow.name,
                message: `歌曲"${song.title}"导入失败：${(songError as Error).message}`
              });
            }
          }

          result.successCount++;
        } catch (error) {
          result.failCount++;
          result.errors.push({
            row: rowIndex,
            name: teamRow.name,
            message: `系统错误：${(error as Error).message}`
          });
        }
      }

      result.success = result.errors.length === 0;
      return result;
    } catch (error) {
      return {
        success: false,
        totalCount: 0,
        successCount: 0,
        failCount: 0,
        duplicateCount: 0,
        errors: [{
          row: 0,
          message: `文件解析失败：${(error as Error).message}。请确保文件格式为 .xlsx 或 .xls`
        }]
      };
    }
  }
}
