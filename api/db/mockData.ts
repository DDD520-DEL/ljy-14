import { Team, Song, TeamComment, TeamPost, TeamVideo, TeamPhoto, EncyclopediaArticle, TeamActivity } from '../../shared/types.js';

const generateVideos = (teamId: number, count: number = 2): TeamVideo[] => {
  const videoTitles = [
    '最新表演《最炫民族风》',
    '红扇舞经典演绎',
    '春节联欢会表演',
    '社区文化节演出',
    '重阳节特别节目',
    '教学视频：基础动作',
    '队形变换展示',
    '广场实拍完整版'
  ];
  const videoUrls = [
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://www.bilibili.com/video/BV1xx411c7mD',
    'https://www.kuaishou.com/short-video/3x6k6z7y8a9b0c1',
    'https://www.douyin.com/video/7234567890123456789'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: teamId * 10 + i + 1,
    title: videoTitles[(teamId + i) % videoTitles.length],
    url: videoUrls[(teamId + i) % videoUrls.length],
    thumbnail: `https://picsum.photos/seed/video${teamId}-${i}/480/270`,
    createdAt: new Date(2024, 4 + i, 15 + i * 3).toISOString()
  }));
};

const generatePhotos = (teamId: number, count: number = 6): TeamPhoto[] => {
  const photoTitles = [
    '活动合影',
    '表演现场',
    '排练花絮',
    '节日特辑',
    '社区演出',
    '晨练时光',
    '比赛精彩瞬间',
    '服装展示'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: teamId * 100 + i + 1,
    url: `https://picsum.photos/seed/team${teamId}-photo${i}/800/600`,
    title: photoTitles[(teamId + i) % photoTitles.length],
    description: '',
    uploadedBy: '管理员',
    createdAt: new Date(2024, 3 + i, 10 + i * 5).toISOString()
  }));
};

export const mockTeams: Team[] = [
  {
    id: 1,
    name: '朝阳红扇舞蹈队',
    leader: '王桂兰',
    phone: '13800138001',
    establishedAt: '2018-03-15',
    memberCount: 45,
    district: '朝阳区',
    style: '民族风',
    description: '成立于2018年，以红扇舞为特色，多次参加区里文艺演出并获奖。队员们热爱舞蹈，积极向上，是社区里一道亮丽的风景线。',
    avatar: 'https://picsum.photos/seed/team1-avatar/200/200',
    groupPhoto: 'https://picsum.photos/seed/team1-group/800/450',
    costumePhoto: 'https://picsum.photos/seed/team1-costume/600/400',
    parkName: '朝阳公园',
    parkLat: 39.9339,
    parkLng: 116.4728,
    activityTime: '每天 06:30-08:00, 19:00-20:30',
    costumeScore: 4.5,
    costumeVotes: 128,
    videos: generateVideos(1, 3),
    photos: generatePhotos(1, 8),
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: '海淀炫舞团',
    leader: '李秀英',
    phone: '13800138002',
    establishedAt: '2019-06-20',
    memberCount: 32,
    district: '海淀区',
    style: '流行风',
    description: '紧跟潮流的舞蹈团队，擅长编排流行广场舞，深受年轻队员喜爱。每周都会学习新的舞蹈动作，保持新鲜感。',
    avatar: 'https://picsum.photos/seed/team2-avatar/200/200',
    groupPhoto: 'https://picsum.photos/seed/team2-group/800/450',
    costumePhoto: 'https://picsum.photos/seed/team2-costume/600/400',
    parkName: '颐和园北广场',
    parkLat: 39.9999,
    parkLng: 116.2755,
    activityTime: '周一至周五 18:30-20:00, 周末 09:00-11:00',
    costumeScore: 4.7,
    costumeVotes: 156,
    videos: generateVideos(2, 2),
    photos: generatePhotos(2, 6),
    createdAt: '2024-02-10T08:20:00Z'
  },
  {
    id: 3,
    name: '东城茉莉花开舞队',
    leader: '张美华',
    phone: '13800138003',
    establishedAt: '2017-04-10',
    memberCount: 28,
    district: '东城区',
    style: '古典风',
    description: '以古典舞和民族舞为主，舞姿优美，韵味十足。茉莉花是我们的队花，象征着纯洁与美好。',
    avatar: 'https://picsum.photos/seed/team3-avatar/200/200',
    groupPhoto: 'https://picsum.photos/seed/team3-group/800/450',
    costumePhoto: 'https://picsum.photos/seed/team3-costume/600/400',
    parkName: '地坛公园',
    parkLat: 39.9467,
    parkLng: 116.4153,
    activityTime: '每天 07:00-08:30, 19:30-21:00',
    costumeScore: 4.8,
    costumeVotes: 203,
    videos: generateVideos(3, 4),
    photos: generatePhotos(3, 7),
    createdAt: '2024-01-20T14:45:00Z'
  },
  {
    id: 4,
    name: '西城活力健身队',
    leader: '刘淑珍',
    phone: '13800138004',
    establishedAt: '2020-01-08',
    memberCount: 55,
    district: '西城区',
    style: '健身操',
    description: '以健身操和动感舞蹈为主，注重锻炼身体，充满活力。适合各个年龄段的居民参与，健康快乐是我们的宗旨。',
    avatar: 'https://picsum.photos/seed/team4-avatar/200/200',
    groupPhoto: 'https://picsum.photos/seed/team4-group/800/450',
    costumePhoto: 'https://picsum.photos/seed/team4-costume/600/400',
    parkName: '月坛公园',
    parkLat: 39.9156,
    parkLng: 116.3553,
    activityTime: '每天 06:00-07:30, 18:00-19:30',
    costumeScore: 4.2,
    costumeVotes: 98,
    videos: generateVideos(4, 2),
    photos: generatePhotos(4, 5),
    createdAt: '2024-03-05T09:15:00Z'
  },
  {
    id: 5,
    name: '丰台爵士辣妈队',
    leader: '陈晓燕',
    phone: '13800138005',
    establishedAt: '2021-05-12',
    memberCount: 22,
    district: '丰台区',
    style: '爵士风',
    description: '一群热爱爵士舞的辣妈组成的队伍，性感又不失优雅，用舞蹈展现自信与魅力。年轻的心态让我们永远年轻！',
    avatar: 'https://picsum.photos/seed/team5-avatar/200/200',
    groupPhoto: 'https://picsum.photos/seed/team5-group/800/450',
    costumePhoto: 'https://picsum.photos/seed/team5-costume/600/400',
    parkName: '丰台花园',
    parkLat: 39.8586,
    parkLng: 116.2869,
    activityTime: '周二、四、六 19:00-21:00',
    costumeScore: 4.6,
    costumeVotes: 167,
    videos: generateVideos(5, 3),
    photos: generatePhotos(5, 9),
    createdAt: '2024-02-28T16:30:00Z'
  },
  {
    id: 6,
    name: '石景山夕阳红舞队',
    leader: '赵金凤',
    phone: '13800138006',
    establishedAt: '2016-09-01',
    memberCount: 38,
    district: '石景山区',
    style: '民族风',
    description: '夕阳无限好，黄昏更妖娆。我们是一群热爱生活的退休老人，用舞蹈展现夕阳的美丽和风采。',
    avatar: 'https://picsum.photos/seed/team6-avatar/200/200',
    groupPhoto: 'https://picsum.photos/seed/team6-group/800/450',
    costumePhoto: 'https://picsum.photos/seed/team6-costume/600/400',
    parkName: '八角游乐园南广场',
    parkLat: 39.9078,
    parkLng: 116.2228,
    activityTime: '每天 06:30-08:00, 19:00-20:30',
    costumeScore: 4.4,
    costumeVotes: 112,
    videos: generateVideos(6, 2),
    photos: generatePhotos(6, 5),
    createdAt: '2024-01-08T11:20:00Z'
  },
  {
    id: 7,
    name: '通州轻舞飞扬队',
    leader: '周雅琴',
    phone: '13800138007',
    establishedAt: '2020-08-15',
    memberCount: 18,
    district: '通州区',
    style: '流行风',
    description: '年轻活泼的队伍，擅长编排网红流行舞曲，追求时尚与创新。让每一支舞蹈都充满青春活力！',
    avatar: 'https://picsum.photos/seed/team7-avatar/200/200',
    groupPhoto: 'https://picsum.photos/seed/team7-group/800/450',
    costumePhoto: 'https://picsum.photos/seed/team7-costume/600/400',
    parkName: '运河文化广场',
    parkLat: 39.9167,
    parkLng: 116.6556,
    activityTime: '周三、五、日 18:30-20:30',
    costumeScore: 4.3,
    costumeVotes: 89,
    videos: generateVideos(7, 3),
    photos: generatePhotos(7, 6),
    createdAt: '2024-03-12T13:40:00Z'
  },
  {
    id: 8,
    name: '昌平蒙古风情舞队',
    leader: '乌云其其格',
    phone: '13800138008',
    establishedAt: '2019-11-20',
    memberCount: 15,
    district: '昌平区',
    style: '民族风',
    description: '独具特色的蒙古族舞蹈队，展现草原儿女的豪迈与热情。盅碗舞、筷子舞是我们的拿手好戏！',
    avatar: 'https://picsum.photos/seed/team8-avatar/200/200',
    groupPhoto: 'https://picsum.photos/seed/team8-group/800/450',
    costumePhoto: 'https://picsum.photos/seed/team8-costume/600/400',
    parkName: '昌平公园',
    parkLat: 40.2228,
    parkLng: 116.2328,
    activityTime: '周一、三、五 07:00-08:30, 周六 15:00-17:00',
    costumeScore: 4.9,
    costumeVotes: 245,
    videos: generateVideos(8, 4),
    photos: generatePhotos(8, 10),
    createdAt: '2024-02-15T10:00:00Z'
  },
  {
    id: 9,
    name: '大兴秧歌队',
    leader: '钱玉梅',
    phone: '13800138009',
    establishedAt: '2015-02-18',
    memberCount: 42,
    district: '大兴区',
    style: '民族风',
    description: '历史悠久的秧歌队，传承传统文化，扭出喜庆与欢乐。春节庙会少不了我们的身影！',
    avatar: 'https://picsum.photos/seed/team9-avatar/200/200',
    groupPhoto: 'https://picsum.photos/seed/team9-group/800/450',
    costumePhoto: 'https://picsum.photos/seed/team9-costume/600/400',
    parkName: '兴旺公园',
    parkLat: 39.7289,
    parkLng: 116.3386,
    activityTime: '每天 06:00-07:30, 18:30-20:00',
    costumeScore: 4.5,
    costumeVotes: 134,
    videos: generateVideos(9, 2),
    photos: generatePhotos(9, 7),
    createdAt: '2024-01-25T09:30:00Z'
  },
  {
    id: 10,
    name: '顺义拉丁风情队',
    leader: '孙丽娜',
    phone: '13800138010',
    establishedAt: '2022-03-08',
    memberCount: 12,
    district: '顺义区',
    style: '爵士风',
    description: '融合拉丁舞和广场舞的特色，热情奔放，魅力四射。让广场舞也能跳出国际范！',
    avatar: 'https://picsum.photos/seed/team10-avatar/200/200',
    groupPhoto: 'https://picsum.photos/seed/team10-group/800/450',
    costumePhoto: 'https://picsum.photos/seed/team10-costume/600/400',
    parkName: '顺义公园',
    parkLat: 40.1289,
    parkLng: 116.6556,
    activityTime: '周二、四、六 19:00-21:00',
    costumeScore: 4.7,
    costumeVotes: 178,
    videos: generateVideos(10, 3),
    photos: generatePhotos(10, 6),
    createdAt: '2024-03-01T14:15:00Z'
  }
];

export const mockSongs: Song[] = [
  { id: 1, teamId: 1, title: '最炫民族风', artist: '凤凰传奇', genre: '流行', duration: '4:15', coverUrl: 'https://picsum.photos/seed/song1/300/300', addictScore: 4.8, addictVotes: 256, battleCount: 0, battleWins: 0, createdAt: '2024-01-15T10:30:00Z' },
  { id: 2, teamId: 1, title: '小苹果', artist: '筷子兄弟', genre: '流行', duration: '3:30', coverUrl: 'https://picsum.photos/seed/song2/300/300', addictScore: 4.6, addictVotes: 198, battleCount: 0, battleWins: 0, createdAt: '2024-01-15T10:30:00Z' },
  { id: 3, teamId: 1, title: '套马杆', artist: '乌兰托娅', genre: '民族', duration: '4:02', coverUrl: 'https://picsum.photos/seed/song3/300/300', addictScore: 4.5, addictVotes: 176, battleCount: 0, battleWins: 0, createdAt: '2024-01-15T10:30:00Z' },
  { id: 4, teamId: 1, title: '荷塘月色', artist: '凤凰传奇', genre: '流行', duration: '4:05', coverUrl: 'https://picsum.photos/seed/song4/300/300', addictScore: 4.3, addictVotes: 145, battleCount: 0, battleWins: 0, createdAt: '2024-01-15T10:30:00Z' },
  
  { id: 5, teamId: 2, title: '酒醉的蝴蝶', artist: '崔伟立', genre: '流行', duration: '3:28', coverUrl: 'https://picsum.photos/seed/song5/300/300', addictScore: 4.7, addictVotes: 234, battleCount: 0, battleWins: 0, createdAt: '2024-02-10T08:20:00Z' },
  { id: 6, teamId: 2, title: '野花香', artist: '莫斯满', genre: '流行', duration: '3:45', coverUrl: 'https://picsum.photos/seed/song6/300/300', addictScore: 4.4, addictVotes: 167, battleCount: 0, battleWins: 0, createdAt: '2024-02-10T08:20:00Z' },
  { id: 7, teamId: 2, title: '天边的情哥哥', artist: '郭玲', genre: '流行', duration: '3:52', coverUrl: 'https://picsum.photos/seed/song7/300/300', addictScore: 4.2, addictVotes: 123, battleCount: 0, battleWins: 0, createdAt: '2024-02-10T08:20:00Z' },
  
  { id: 8, teamId: 3, title: '茉莉花', artist: '中国民歌', genre: '古典', duration: '4:20', coverUrl: 'https://picsum.photos/seed/song8/300/300', addictScore: 4.9, addictVotes: 289, battleCount: 0, battleWins: 0, createdAt: '2024-01-20T14:45:00Z' },
  { id: 9, teamId: 3, title: '春江花月夜', artist: '纯音乐', genre: '古典', duration: '5:10', coverUrl: 'https://picsum.photos/seed/song9/300/300', addictScore: 4.7, addictVotes: 201, battleCount: 0, battleWins: 0, createdAt: '2024-01-20T14:45:00Z' },
  { id: 10, teamId: 3, title: '梁祝', artist: '纯音乐', genre: '古典', duration: '4:35', coverUrl: 'https://picsum.photos/seed/song10/300/300', addictScore: 4.6, addictVotes: 189, battleCount: 0, battleWins: 0, createdAt: '2024-01-20T14:45:00Z' },
  
  { id: 11, teamId: 4, title: '卡路里', artist: '火箭少女101', genre: '健身操', duration: '3:58', coverUrl: 'https://picsum.photos/seed/song11/300/300', addictScore: 4.5, addictVotes: 178, battleCount: 0, battleWins: 0, createdAt: '2024-03-05T09:15:00Z' },
  { id: 12, teamId: 4, title: '站在草原望北京', artist: '乌兰图雅', genre: '健身操', duration: '4:12', coverUrl: 'https://picsum.photos/seed/song12/300/300', addictScore: 4.3, addictVotes: 145, battleCount: 0, battleWins: 0, createdAt: '2024-03-05T09:15:00Z' },
  { id: 13, teamId: 4, title: '美美哒', artist: '门丽', genre: '健身操', duration: '3:42', coverUrl: 'https://picsum.photos/seed/song13/300/300', addictScore: 4.1, addictVotes: 112, battleCount: 0, battleWins: 0, createdAt: '2024-03-05T09:15:00Z' },
  { id: 14, teamId: 4, title: '动起来', artist: '郭富城', genre: '健身操', duration: '3:38', coverUrl: 'https://picsum.photos/seed/song14/300/300', addictScore: 4.0, addictVotes: 98, battleCount: 0, battleWins: 0, createdAt: '2024-03-05T09:15:00Z' },
  { id: 15, teamId: 4, title: '快乐崇拜', artist: '潘玮柏/张韶涵', genre: '健身操', duration: '4:05', coverUrl: 'https://picsum.photos/seed/song15/300/300', addictScore: 4.2, addictVotes: 134, battleCount: 0, battleWins: 0, createdAt: '2024-03-05T09:15:00Z' },
  
  { id: 16, teamId: 5, title: '无价之姐', artist: '李宇春', genre: '爵士', duration: '3:02', coverUrl: 'https://picsum.photos/seed/song16/300/300', addictScore: 4.8, addictVotes: 267, battleCount: 0, battleWins: 0, createdAt: '2024-02-28T16:30:00Z' },
  { id: 17, teamId: 5, title: '潇洒走一回', artist: '叶倩文', genre: '爵士', duration: '3:58', coverUrl: 'https://picsum.photos/seed/song17/300/300', addictScore: 4.5, addictVotes: 189, battleCount: 0, battleWins: 0, createdAt: '2024-02-28T16:30:00Z' },
  { id: 18, teamId: 5, title: '给我一个吻', artist: '张露', genre: '爵士', duration: '2:55', coverUrl: 'https://picsum.photos/seed/song18/300/300', addictScore: 4.3, addictVotes: 145, battleCount: 0, battleWins: 0, createdAt: '2024-02-28T16:30:00Z' },
  { id: 19, teamId: 5, title: '我要你的爱', artist: '葛兰', genre: '爵士', duration: '3:12', coverUrl: 'https://picsum.photos/seed/song19/300/300', addictScore: 4.4, addictVotes: 156, battleCount: 0, battleWins: 0, createdAt: '2024-02-28T16:30:00Z' },
  
  { id: 20, teamId: 6, title: '敖包相会', artist: '中国民歌', genre: '民族', duration: '4:25', coverUrl: 'https://picsum.photos/seed/song20/300/300', addictScore: 4.6, addictVotes: 178, battleCount: 0, battleWins: 0, createdAt: '2024-01-08T11:20:00Z' },
  { id: 21, teamId: 6, title: '康定情歌', artist: '中国民歌', genre: '民族', duration: '3:45', coverUrl: 'https://picsum.photos/seed/song21/300/300', addictScore: 4.4, addictVotes: 156, battleCount: 0, battleWins: 0, createdAt: '2024-01-08T11:20:00Z' },
  { id: 22, teamId: 6, title: '在希望的田野上', artist: '彭丽媛', genre: '民族', duration: '3:55', coverUrl: 'https://picsum.photos/seed/song22/300/300', addictScore: 4.5, addictVotes: 167, battleCount: 0, battleWins: 0, createdAt: '2024-01-08T11:20:00Z' },
  
  { id: 23, teamId: 7, title: '科目三', artist: '网络流行', genre: '流行', duration: '2:58', coverUrl: 'https://picsum.photos/seed/song23/300/300', addictScore: 4.9, addictVotes: 312, battleCount: 0, battleWins: 0, createdAt: '2024-03-12T13:40:00Z' },
  { id: 24, teamId: 7, title: '爱你', artist: '王心凌', genre: '流行', duration: '3:25', coverUrl: 'https://picsum.photos/seed/song24/300/300', addictScore: 4.7, addictVotes: 234, battleCount: 0, battleWins: 0, createdAt: '2024-03-12T13:40:00Z' },
  { id: 25, teamId: 7, title: '大花轿', artist: '火风', genre: '流行', duration: '3:58', coverUrl: 'https://picsum.photos/seed/song25/300/300', addictScore: 4.5, addictVotes: 178, battleCount: 0, battleWins: 0, createdAt: '2024-03-12T13:40:00Z' },
  
  { id: 26, teamId: 8, title: '鸿雁', artist: '呼斯楞', genre: '民族', duration: '4:15', coverUrl: 'https://picsum.photos/seed/song26/300/300', addictScore: 4.8, addictVotes: 245, battleCount: 0, battleWins: 0, createdAt: '2024-02-15T10:00:00Z' },
  { id: 27, teamId: 8, title: '天堂', artist: '腾格尔', genre: '民族', duration: '4:32', coverUrl: 'https://picsum.photos/seed/song27/300/300', addictScore: 4.7, addictVotes: 223, battleCount: 0, battleWins: 0, createdAt: '2024-02-15T10:00:00Z' },
  { id: 28, teamId: 8, title: '蒙古人', artist: '腾格尔', genre: '民族', duration: '4:18', coverUrl: 'https://picsum.photos/seed/song28/300/300', addictScore: 4.6, addictVotes: 198, battleCount: 0, battleWins: 0, createdAt: '2024-02-15T10:00:00Z' },
  { id: 29, teamId: 8, title: '卓玛', artist: '亚东', genre: '民族', duration: '4:45', coverUrl: 'https://picsum.photos/seed/song29/300/300', addictScore: 4.5, addictVotes: 176, battleCount: 0, battleWins: 0, createdAt: '2024-02-15T10:00:00Z' },
  
  { id: 30, teamId: 9, title: '开门红', artist: '火风/汤灿', genre: '民族', duration: '3:45', coverUrl: 'https://picsum.photos/seed/song30/300/300', addictScore: 4.7, addictVotes: 212, battleCount: 0, battleWins: 0, createdAt: '2024-01-25T09:30:00Z' },
  { id: 31, teamId: 9, title: '好日子', artist: '宋祖英', genre: '民族', duration: '3:22', coverUrl: 'https://picsum.photos/seed/song31/300/300', addictScore: 4.6, addictVotes: 198, battleCount: 0, battleWins: 0, createdAt: '2024-01-25T09:30:00Z' },
  { id: 32, teamId: 9, title: '好运来', artist: '祖海', genre: '民族', duration: '3:35', coverUrl: 'https://picsum.photos/seed/song32/300/300', addictScore: 4.5, addictVotes: 176, battleCount: 0, battleWins: 0, createdAt: '2024-01-25T09:30:00Z' },
  { id: 33, teamId: 9, title: '喜乐年华', artist: '陈红', genre: '民族', duration: '3:42', coverUrl: 'https://picsum.photos/seed/song33/300/300', addictScore: 4.4, addictVotes: 154, battleCount: 0, battleWins: 0, createdAt: '2024-01-25T09:30:00Z' },
  { id: 34, teamId: 9, title: '恭喜发财', artist: '刘德华', genre: '民族', duration: '3:20', coverUrl: 'https://picsum.photos/seed/song34/300/300', addictScore: 4.3, addictVotes: 145, battleCount: 0, battleWins: 0, createdAt: '2024-01-25T09:30:00Z' },
  
  { id: 35, teamId: 10, title: 'Despacito', artist: 'Luis Fonsi', genre: '拉丁', duration: '3:48', coverUrl: 'https://picsum.photos/seed/song35/300/300', addictScore: 4.8, addictVotes: 256, battleCount: 0, battleWins: 0, createdAt: '2024-03-01T14:15:00Z' },
  { id: 36, teamId: 10, title: 'Smooth', artist: 'Santana', genre: '拉丁', duration: '4:02', coverUrl: 'https://picsum.photos/seed/song36/300/300', addictScore: 4.6, addictVotes: 201, battleCount: 0, battleWins: 0, createdAt: '2024-03-01T14:15:00Z' },
  { id: 37, teamId: 10, title: 'Havana', artist: 'Camila Cabello', genre: '拉丁', duration: '3:38', coverUrl: 'https://picsum.photos/seed/song37/300/300', addictScore: 4.5, addictVotes: 189, battleCount: 0, battleWins: 0, createdAt: '2024-03-01T14:15:00Z' },
  { id: 38, teamId: 10, title: 'Shape of You', artist: 'Ed Sheeran', genre: '拉丁', duration: '3:55', coverUrl: 'https://picsum.photos/seed/song38/300/300', addictScore: 4.4, addictVotes: 167, battleCount: 0, battleWins: 0, createdAt: '2024-03-01T14:15:00Z' }
];

export const mockComments: TeamComment[] = [
  { id: 1, teamId: 1, nickname: '广场舞爱好者', content: '红扇舞跳得太精彩了！队形变化很有创意，队员们配合默契。', rating: 5, createdAt: '2024-05-10T08:30:00Z' },
  { id: 2, teamId: 1, nickname: '社区王阿姨', content: '每天早上都看她们跳舞，服装特别漂亮，精神头十足！', rating: 4, createdAt: '2024-05-12T10:15:00Z' },
  { id: 3, teamId: 1, nickname: '舞蹈小白', content: '想学她们的扇子舞，有没有教学视频呀？', rating: 5, createdAt: '2024-05-15T14:20:00Z' },
  { id: 4, teamId: 2, nickname: '潮流达人', content: '炫舞团的编舞太潮了，每次都有新惊喜！', rating: 5, createdAt: '2024-05-08T19:45:00Z' },
  { id: 5, teamId: 2, nickname: '广场舞新人', content: '年轻队员很多，气氛特别好，想加入！', rating: 4, createdAt: '2024-05-11T16:30:00Z' },
  { id: 6, teamId: 3, nickname: '古典舞迷', content: '茉莉花那支舞太美了，看得我热泪盈眶，真正的艺术！', rating: 5, createdAt: '2024-05-05T09:00:00Z' },
  { id: 7, teamId: 3, nickname: '文化传承者', content: '能坚持跳古典舞不容易，为你们点赞！', rating: 5, createdAt: '2024-05-09T11:30:00Z' },
  { id: 8, teamId: 4, nickname: '健身达人', content: '健身操动作标准，跟跳了一个月瘦了5斤，感谢！', rating: 5, createdAt: '2024-05-07T07:20:00Z' },
  { id: 9, teamId: 4, nickname: '退休老张', content: '动作强度适中，适合我们中老年人，音乐也很带劲！', rating: 4, createdAt: '2024-05-13T06:45:00Z' },
  { id: 10, teamId: 5, nickname: '爵士粉丝', content: '辣妈们太飒了！爵士舞跳出了专业水准，气场全开！', rating: 5, createdAt: '2024-05-06T20:10:00Z' },
  { id: 11, teamId: 5, nickname: '围观群众', content: '每次跳无价之姐都围满了人，太火了！', rating: 4, createdAt: '2024-05-14T21:00:00Z' },
  { id: 12, teamId: 6, nickname: '夕阳红粉丝', content: '叔叔阿姨们精气神太棒了，跳舞让你们更年轻！', rating: 5, createdAt: '2024-05-04T08:00:00Z' },
  { id: 13, teamId: 8, nickname: '草原儿女', content: '蒙古舞跳得太正宗了，仿佛看到了大草原！', rating: 5, createdAt: '2024-05-03T15:30:00Z' },
  { id: 14, teamId: 8, nickname: '民族舞爱好者', content: '盅碗舞太惊艳了，服装也特别有民族特色！', rating: 5, createdAt: '2024-05-16T10:45:00Z' },
  { id: 15, teamId: 9, nickname: '老北京', content: '秧歌扭得地道，年味十足！过年表演特别热闹！', rating: 5, createdAt: '2024-05-02T12:00:00Z' },
];

export const mockPosts: TeamPost[] = [
  {
    id: 1,
    teamId: 1,
    content: '今天朝阳公园晨练圆满结束！我们学习了新的红扇舞动作，队员们都特别认真。下周六我们还要去参加区里的文艺汇演，大家一起加油！💃',
    images: [
      'https://picsum.photos/seed/post1-1/600/400',
      'https://picsum.photos/seed/post1-2/600/400',
      'https://picsum.photos/seed/post1-3/600/400'
    ],
    parkLat: 39.9339,
    parkLng: 116.4728,
    parkName: '朝阳公园',
    createdAt: '2024-06-14T08:30:00Z'
  },
  {
    id: 2,
    teamId: 2,
    content: '新舞《科目三》排练中！年轻的队员们学得特别快，动作整齐划一。下周就要拍正式视频了，期待成品！🔥',
    images: [
      'https://picsum.photos/seed/post2-1/600/400',
      'https://picsum.photos/seed/post2-2/600/400'
    ],
    parkLat: 39.9999,
    parkLng: 116.2755,
    parkName: '颐和园北广场',
    createdAt: '2024-06-14T19:45:00Z'
  },
  {
    id: 3,
    teamId: 3,
    content: '《春江花月夜》古典舞排练花絮来了~我们的队员身着汉服翩翩起舞，仿佛穿越回了古代。欢迎大家来地坛公园欣赏我们的表演！',
    images: [
      'https://picsum.photos/seed/post3-1/600/400'
    ],
    parkLat: 39.9467,
    parkLng: 116.4153,
    parkName: '地坛公园',
    createdAt: '2024-06-13T20:15:00Z'
  },
  {
    id: 4,
    teamId: 8,
    content: '今天的蒙古舞专场太精彩了！盅碗舞、筷子舞轮番上演，队员们用舞蹈展现了草原儿女的豪情。感谢所有到场的观众朋友们！🏇',
    images: [
      'https://picsum.photos/seed/post4-1/600/400',
      'https://picsum.photos/seed/post4-2/600/400',
      'https://picsum.photos/seed/post4-3/600/400',
      'https://picsum.photos/seed/post4-4/600/400'
    ],
    parkLat: 40.2228,
    parkLng: 116.2328,
    parkName: '昌平公园',
    createdAt: '2024-06-13T16:30:00Z'
  },
  {
    id: 5,
    teamId: 5,
    content: '爵士辣妈队最新排练视频来了！《无价之姐》+《Despacito》串烧，热辣十足！周二、四、六晚19点，丰台花园等你一起来！',
    images: [
      'https://picsum.photos/seed/post5-1/600/400',
      'https://picsum.photos/seed/post5-2/600/400'
    ],
    parkLat: 39.8586,
    parkLng: 116.2869,
    parkName: '丰台花园',
    createdAt: '2024-06-12T21:00:00Z'
  },
  {
    id: 6,
    teamId: 4,
    content: '今日打卡！健身操《卡路里》完整跳完，全队暴汗！跟着我们跳，这个夏天一起瘦下来！每天早晚6点，月坛公园不见不散~',
    images: [
      'https://picsum.photos/seed/post6-1/600/400'
    ],
    parkLat: 39.9156,
    parkLng: 116.3553,
    parkName: '月坛公园',
    createdAt: '2024-06-12T07:30:00Z'
  },
  {
    id: 7,
    teamId: 7,
    content: '通州区运河文化广场周末活动圆满成功！我们表演了最火的网红舞曲《科目三》《爱你》，引来无数观众围观。感谢大家的支持！❤️',
    images: [
      'https://picsum.photos/seed/post7-1/600/400',
      'https://picsum.photos/seed/post7-2/600/400',
      'https://picsum.photos/seed/post7-3/600/400'
    ],
    parkLat: 39.9167,
    parkLng: 116.6556,
    parkName: '运河文化广场',
    createdAt: '2024-06-11T18:20:00Z'
  },
  {
    id: 8,
    teamId: 6,
    content: '夕阳无限好，黄昏更妖娆。我们石景山夕阳红舞队的老伙计们今天精神头十足！跳舞让我们更年轻，更快乐！欢迎退休的朋友们加入我们~',
    images: [
      'https://picsum.photos/seed/post8-1/600/400',
      'https://picsum.photos/seed/post8-2/600/400'
    ],
    parkLat: 39.9078,
    parkLng: 116.2228,
    parkName: '八角游乐园南广场',
    createdAt: '2024-06-11T08:00:00Z'
  }
];

export const mockEncyclopediaArticles: EncyclopediaArticle[] = [
  {
    id: 1,
    title: '广场舞基础舞步教学：四步循环法',
    category: 'dance_skill',
    summary: '学习广场舞最基础的四步循环舞步，适合初学者快速入门，掌握节奏和步伐的协调性。',
    content: `## 什么是四步循环法？

四步循环法是广场舞中最基础、最常用的舞步之一。它简单易学，节奏感强，是入门广场舞的必修课。

### 动作要领

1. **准备姿势**：双脚并拢，双手自然下垂，身体放松
2. **第一步**：左脚向左侧迈出一小步，重心移到左脚
3. **第二步**：右脚跟上，与左脚并拢
4. **第三步**：右脚向右侧迈出一小步，重心移到右脚
5. **第四步**：左脚跟上，与右脚并拢

### 节奏要点

- 每一步大约占1拍
- 整个四步动作形成一个循环
- 配合音乐节拍："左-并-右-并"
- 注意膝盖的弹性，避免僵硬

### 练习建议

1. 先不跟音乐，默数节拍练习
2. 从慢速开始，逐步加快
3. 配合手臂摆动，增加协调性
4. 每天练习10-15分钟，形成肌肉记忆

### 常见错误

❌ 步伐太大，导致重心不稳
❌ 节奏混乱，抢拍或慢拍
❌ 身体僵硬，膝盖没有弹性
❌ 眼睛看脚，没有抬头挺胸

掌握好四步循环法，你就可以开始学习更多复杂的广场舞动作了！加油！💃`,
    coverImage: 'https://picsum.photos/seed/ency1/800/450',
    images: [
      'https://picsum.photos/seed/ency1-1/600/400',
      'https://picsum.photos/seed/ency1-2/600/400'
    ],
    author: '广场舞教练小王',
    viewCount: 1256,
    createdAt: '2024-05-01T10:30:00Z',
    updatedAt: '2024-05-01T10:30:00Z'
  },
  {
    id: 2,
    title: '中老年人跳舞前的热身运动指南',
    category: 'fitness_tip',
    summary: '详细介绍适合中老年人的热身运动，包括颈部、肩部、腰部、膝盖等关键部位的拉伸动作。',
    content: `## 热身运动的重要性

对于中老年人来说，跳舞前进行充分的热身运动至关重要。它可以：
- 提高肌肉温度，增加柔韧性
- 减少运动损伤风险
- 提升关节活动度
- 让心肺系统逐步适应运动强度

### 完整热身流程（约10-15分钟）

#### 1. 颈部运动（2分钟）

**动作1：前后点头**
- 站立，双手叉腰
- 缓慢低头，感受后颈拉伸
- 缓慢抬头，感受前颈拉伸
- 重复8-10次

**动作2：左右转头**
- 头部缓慢向左转，保持2秒
- 缓慢向右转，保持2秒
- 重复8-10次

#### 2. 肩部运动（2分钟）

**动作1：耸肩运动**
- 双肩同时向上耸，尽量靠近耳朵
- 保持2秒，然后放松
- 重复15次

**动作2：肩部环绕**
- 双肩向前环绕10圈
- 双肩向后环绕10圈
- 动作要缓慢、匀速

#### 3. 腰部运动（2分钟）

**动作1：左右侧屈**
- 双脚分开与肩同宽
- 左手向上伸直，身体向右侧弯曲
- 保持3秒，换边
- 每侧重复5次

**动作2：腰部扭转**
- 双手平举，身体向左扭转
- 保持2秒，向右扭转
- 每侧重复5次

#### 4. 膝关节运动（2分钟）

**动作1：膝关节环绕**
- 双脚并拢，双手扶膝
- 膝盖微屈，顺时针环绕10圈
- 逆时针环绕10圈

**动作2：蹲起练习**
- 双脚分开，双手前平举
- 缓慢下蹲（膝盖不超过脚尖）
- 缓慢站起，重复5-8次

#### 5. 手腕脚踝（2分钟）

- 手腕顺时针、逆时针各转动10圈
- 脚踝顺时针、逆时针各转动10圈

### 注意事项

⚠️ 每个动作都要缓慢进行
⚠️ 不要过度拉伸，感到轻微酸胀即可
⚠️ 如果某个部位有旧伤，要特别小心
⚠️ 热身过程中保持均匀呼吸
⚠️ 冬天热身时间要适当延长

做好热身，快乐跳舞，健康生活！🏃‍♂️`,
    coverImage: 'https://picsum.photos/seed/ency2/800/450',
    images: [
      'https://picsum.photos/seed/ency2-1/600/400',
      'https://picsum.photos/seed/ency2-2/600/400',
      'https://picsum.photos/seed/ency2-3/600/400'
    ],
    author: '健身教练李老师',
    viewCount: 2341,
    createdAt: '2024-05-05T09:15:00Z',
    updatedAt: '2024-05-10T14:20:00Z'
  },
  {
    id: 3,
    title: '广场舞活动安全须知与应急处理',
    category: 'safety_tip',
    summary: '了解广场舞活动中的安全注意事项，以及遇到突发情况时的正确处理方法。',
    content: `## 广场舞安全第一

广场舞是一项很好的健身娱乐活动，但也需要注意安全。以下是必须了解的安全知识。

### 一、场地安全

#### 选择合适的场地
✅ 平整、防滑的水泥地或塑胶地面
✅ 光线充足，视野开阔
✅ 远离交通要道和停车场
✅ 有足够的活动空间（每人至少2平方米）

❌ 避免在湿滑的地面跳舞
❌ 避免在高低不平的地方跳舞
❌ 避免在马路边或停车场入口跳舞
❌ 避免在电线密集的地方跳舞

### 二、着装与装备

#### 正确的着装
- 穿透气、吸汗的运动服
- 穿合脚、有弹性的运动鞋（绝对不要穿皮鞋、拖鞋）
- 不佩戴尖锐饰品（项链、耳环、戒指等）
- 口袋里不要放钥匙、手机等硬物
- 长发女士最好把头发扎起来

### 三、运动安全

#### 跳舞过程中的注意事项
1. **量力而行**：不要勉强做高难度动作
2. **循序渐进**：从简单动作开始，逐步增加难度
3. **适时休息**：每跳30-40分钟休息5-10分钟
4. **补充水分**：随身携带水杯，少量多次饮水
5. **注意身体信号**：
   - 出现胸闷、胸痛立即停止
   - 出现头晕、眼花立即停止
   - 关节疼痛不要硬撑
   - 呼吸过于急促时放慢节奏

### 四、常见伤害应急处理

#### 1. 扭伤处理（RICE原则）

**R - Rest（休息）**：立即停止活动，不要走动

**I - Ice（冰敷）**：用冰袋或冷毛巾敷在伤处，每次15-20分钟，间隔2-3小时

**C - Compression（加压）**：用弹性绷带适当加压包扎

**E - Elevation（抬高）**：把受伤部位抬高，高于心脏位置

⚠️ 注意：扭伤后不要马上揉！不要热敷！不要擦红花油！

#### 2. 抽筋处理

- 立即停止运动
- 慢慢拉伸抽筋的肌肉
- 小腿抽筋：伸直膝盖，勾脚尖，轻轻按摩
- 大腿抽筋：弯腰，用手拉住脚踝，保持拉伸
- 适当补充温水和盐分

#### 3. 跌倒处理

❓ 跌倒后怎么办？
1. 先不要着急起身
2. 检查自己有没有受伤
3. 如果感觉疼痛剧烈，不要乱动，呼叫他人帮忙
4. 如果可以活动，慢慢坐起，在他人帮助下慢慢站起
5. 跌倒后即使没有明显痛感，也要注意观察24小时

#### 4. 中暑处理

**症状**：头晕、恶心、心慌、出冷汗、体温升高

**处理方法**：
1. 立即转移到阴凉通风处
2. 解开衣领，适当降温
3. 小口喝淡盐水或运动饮料
4. 用湿毛巾擦额头、腋下、腹股沟
5. 严重者立即拨打120

### 五、特殊人群注意事项

#### 高血压患者
- 血压不稳定时不要跳舞
- 避免做低头、弯腰过猛的动作
- 随身携带降压药

#### 心脏病患者
- 经医生评估后才能跳舞
- 选择节奏缓慢的舞曲
- 随身携带急救药物

#### 糖尿病患者
- 不要空腹跳舞
- 随身携带糖果，防止低血糖
- 运动后注意监测血糖

#### 骨关节病患者
- 选择冲击力小的动作
- 避免长时间站立
- 必要时佩戴护膝、护腰

### 六、安全小贴士

💡 每次活动前清点人数
💡 随身携带手机和紧急联系人信息
💡 团队中最好有人会基本急救知识
💡 准备急救包（创可贴、云南白药、速效救心丸等）
💡 恶劣天气（高温、暴雨、大风）不要外出跳舞

安全第一，快乐第二。希望大家都能平平安安跳舞，健健康康生活！❤️`,
    coverImage: 'https://picsum.photos/seed/ency3/800/450',
    images: [
      'https://picsum.photos/seed/ency3-1/600/400',
      'https://picsum.photos/seed/ency3-2/600/400'
    ],
    author: '社区医生张大夫',
    viewCount: 3567,
    createdAt: '2024-05-08T16:45:00Z',
    updatedAt: '2024-05-15T10:30:00Z'
  },
  {
    id: 4,
    title: '如何选择适合自己的广场舞风格',
    category: 'dance_skill',
    summary: '了解广场舞的主要风格流派，根据年龄、身体状况和兴趣爱好选择最适合的舞蹈类型。',
    content: `## 广场舞的主要风格

广场舞发展至今，已经形成了多种风格流派。了解这些风格，可以帮助你找到最适合自己的类型。

### 一、民族风广场舞

**特点**：
- 融合各民族舞蹈元素
- 动作优美，富有韵味
- 服装华丽，视觉效果好
- 音乐多为民歌或民族乐曲

**适合人群**：
- 喜欢传统文化的中老年人
- 追求艺术性和观赏性的舞者
- 有一定舞蹈基础的人

**代表舞曲**：《最炫民族风》《套马杆》《荷塘月色》

### 二、流行风广场舞

**特点**：
- 紧跟流行音乐潮流
- 动作时尚，节奏感强
- 编舞新颖，变化多样
- 深受年轻人喜爱

**适合人群**：
- 喜欢新鲜事物的舞者
- 相对年轻的广场舞爱好者
- 追求时尚和潮流的人

**代表舞曲**：《科目三》《酒醉的蝴蝶》《爱你》

### 三、健身操广场舞

**特点**：
- 动作简单，重复性强
- 运动量大，健身效果明显
- 音乐节奏明快，有感染力
- 容易上手，适合集体跳

**适合人群**：
- 以减肥健身为主要目的的人
- 初学者入门首选
- 喜欢高强度运动的人

**代表舞曲**：《卡路里》《美美哒》《动起来》

### 四、古典风广场舞

**特点**：
- 融合古典舞身韵
- 动作柔美，注重气息
- 意境深远，文化底蕴深厚
- 音乐多为古典乐曲

**适合人群**：
- 喜欢古典文化的人
- 追求舞蹈艺术性的人
- 有一定舞蹈修养的人

**代表舞曲**：《茉莉花》《春江花月夜》《梁祝》

### 五、爵士风广场舞

**特点**：
- 融合爵士舞元素
- 动作性感，富有表现力
- 节奏感强，富有活力
- 适合展示个人魅力

**适合人群**：
- 喜欢展现自我的舞者
- 相对年轻的广场舞爱好者
- 追求个性化表演的人

**代表舞曲**：《无价之姐》《潇洒走一回》《Despacito》

### 如何选择适合自己的风格？

#### 1. 根据年龄选择

| 年龄段 | 推荐风格 | 原因 |
|--------|----------|------|
| 50岁以下 | 流行风、爵士风 | 接受度高，喜欢新鲜事物 |
| 50-65岁 | 民族风、健身操 | 经典耐听，健身效果好 |
| 65岁以上 | 健身操、古典风 | 动作舒缓，安全性高 |

#### 2. 根据身体状况选择

💪 **身体好、运动能力强**：可以尝试各种风格，甚至高难度动作

🏃 **一般健康状况**：建议从健身操或简单的民族风开始

🤕 **有关节问题**：选择动作舒缓、冲击力小的古典风或简单的民族风

❤️ **有慢性病**：在医生建议下选择，以健身操的简单动作为主

#### 3. 根据兴趣爱好选择

🎵 如果你喜欢听民歌 → 民族风

🎶 如果你喜欢追流行 → 流行风

🏋️ 如果你就是想减肥 → 健身操

🎨 如果你喜欢传统文化 → 古典风

💃 如果你喜欢展现自己 → 爵士风

### 风格选择小贴士

💡 **新手入门**：建议从健身操开始，培养节奏感和协调性

💡 **多尝试**：不要只跳一种风格，可以在团队中学习多种风格

💡 **循序渐进**：先学简单动作，再挑战高难度

💡 **以快乐为前提**：选择让自己开心的风格最重要

💡 **团队氛围也很重要**：好的团队氛围能让你坚持更久

### 常见问题解答

**Q: 我完全没有舞蹈基础，可以学广场舞吗？**
A: 当然可以！广场舞的门槛很低，健身操风格尤其适合初学者。

**Q: 我学东西慢，会不会跟不上？**
A: 没关系，广场舞团队一般都很包容。可以站在后排慢慢学，回家也可以看视频复习。

**Q: 多久能学会一支舞？**
A: 简单的健身操3-5天就能学会，复杂的民族风可能需要1-2周。

希望大家都能找到最适合自己的广场舞风格，跳出健康，跳出快乐！💃🕺`,
    coverImage: 'https://picsum.photos/seed/ency4/800/450',
    images: [
      'https://picsum.photos/seed/ency4-1/600/400',
      'https://picsum.photos/seed/ency4-2/600/400',
      'https://picsum.photos/seed/ency4-3/600/400'
    ],
    author: '广场舞教练小王',
    viewCount: 1892,
    createdAt: '2024-05-12T11:20:00Z',
    updatedAt: '2024-05-12T11:20:00Z'
  },
  {
    id: 5,
    title: '广场舞运动后的科学恢复方法',
    category: 'fitness_tip',
    summary: '学习跳完广场舞后如何科学地恢复身体，包括拉伸放松、营养补充、睡眠恢复等方面。',
    content: `## 运动恢复的重要性

很多人只重视跳舞的过程，却忽视了运动后的恢复。科学的恢复可以：
- 减少肌肉酸痛
- 预防运动损伤
- 提高运动效果
- 保持长期运动的热情

### 一、运动后的即时恢复（跳舞结束后30分钟内）

#### 1. 整理运动（5-10分钟）

不要突然停止运动，应该做一些舒缓的整理活动：

**慢走**：在场地周围慢走2-3分钟，让心率逐渐降下来

**深呼吸**：配合慢走，做深呼吸
- 吸气4秒
- 屏息2秒
- 呼气6秒
- 重复5-8次

#### 2. 静态拉伸（10-15分钟）

重点拉伸运动中用到的主要肌肉群，每个动作保持20-30秒。

**拉伸大腿前侧（股四头肌）**
- 单脚站立，一手扶墙保持平衡
- 另一只手抓住同侧脚踝，拉向臀部
- 感受大腿前侧的拉伸
- 保持20-30秒，换边

**拉伸大腿后侧（腘绳肌）**
- 坐在地上，一条腿伸直，另一条腿弯曲
- 身体向前倾，双手尽量触碰脚尖
- 感受大腿后侧的拉伸
- 保持20-30秒，换边

**拉伸小腿**
- 面对墙站立，双手扶墙
- 一条腿在前，一条腿在后
- 后腿脚跟贴地，身体向前倾
- 感受小腿的拉伸
- 保持20-30秒，换边

**拉伸臀部**
- 坐在地上，一条腿弯曲放在身前
- 另一条腿弯曲放在对侧
- 身体向前倾，感受臀部的拉伸
- 保持20-30秒，换边

**拉伸腰部**
- 双脚分开与肩同宽
- 双手向上伸直，然后慢慢向一侧弯曲
- 感受腰部侧面的拉伸
- 保持20秒，换边

**拉伸肩部**
- 一只手臂横过胸前，另一只手臂抱住它
- 轻轻向身体方向拉
- 感受肩部的拉伸
- 保持20秒，换边

### 二、营养补充

#### 1. 及时补水

💧 **补水原则**：少量多次，不要猛灌
- 运动后先喝几口温水，过几分钟再喝
- 每15-20分钟补充100-200ml
- 1小时内补充500-1000ml

☕ **注意**：不要喝冰水，不要喝浓茶、咖啡

#### 2. 补充电解质

如果运动量大、出汗多，可以适当补充电解质：
- 喝运动饮料（注意选择低糖的）
- 或者喝淡盐水（1L水加1g盐）
- 或者吃一根香蕉（补充钾元素）

#### 3. 饮食安排

⏰ **最佳进食时间**：运动后30-60分钟

**推荐食物**：
- 优质蛋白质：鸡蛋、牛奶、豆制品、瘦肉
- 复合碳水：全麦面包、糙米饭、红薯
- 蔬菜水果：补充维生素和矿物质

❌ **避免**：
- 大量吃高脂肪、高糖食物
- 马上喝冷饮
- 暴饮暴食

### 三、身体护理

#### 1. 温水洗澡

🚿 **注意事项**：
- 不要马上洗澡，休息20-30分钟后再洗
- 用温水（37-40℃），不要用冷水或过热的水
- 洗澡时间控制在10-15分钟
- 可以轻轻按摩酸痛的部位

#### 2. 泡脚

🦶 **泡脚的好处**：
- 促进血液循环
- 缓解脚部疲劳
- 帮助放松身心

**泡脚方法**：
- 水温40-45℃
- 时间20-30分钟
- 水面要没过脚踝
- 可以加入少许盐或艾草

#### 3. 按摩

如果有条件，可以做一些简单的自我按摩：
- 用拳头轻轻敲打大腿和小腿
- 用手掌按揉酸痛的肌肉
- 用手指按压脚底的穴位

### 四、睡眠恢复

😴 **睡眠是最好的恢复方式**

**保证睡眠质量的建议**：
- 每天保证7-8小时的睡眠
- 尽量在晚上11点前入睡
- 睡前可以喝一杯温牛奶
- 睡前不要看手机
- 保持卧室安静、黑暗、凉爽

### 五、不同人群的恢复重点

#### 年轻人（50岁以下）
- 重点：肌肉恢复
- 建议：适当增加蛋白质摄入，保证充足睡眠

#### 中年人（50-65岁）
- 重点：关节保护和能量恢复
- 建议：注意保暖，适当补充氨糖，饮食要均衡

#### 老年人（65岁以上）
- 重点：心血管恢复和安全
- 建议：整理运动时间延长，监测心率，充分休息

### 六、运动恢复的误区

❌ **误区1：运动后马上坐下或躺下**
→ 正确：应该先做整理活动，让心率逐渐下降

❌ **误区2：肌肉酸痛就不能再运动**
→ 正确：轻微的酸痛是正常的，可以做低强度活动促进恢复

❌ **误区3：运动后大量进食补充能量**
→ 正确：运动后能量消耗确实增加，但也要适量，不能暴饮暴食

❌ **误区4：只有高强度运动才需要恢复**
→ 正确：任何运动都需要恢复，只是恢复的方式和时间不同

❌ **误区5：喝酒可以缓解疲劳**
→ 正确：喝酒会加重脱水，影响恢复，运动后绝对不能喝酒

### 七、判断恢复是否充分的标志

✅ 第二天起床精力充沛
✅ 没有明显的肌肉酸痛
✅ 心率恢复到平时水平
✅ 食欲正常
✅ 心情愉快，想继续跳舞

如果第二天仍然感到非常疲劳、肌肉酸痛严重、心率偏快，说明恢复不充分，应该适当减少运动量。

科学运动，科学恢复，才能让广场舞真正成为健康的好伙伴！💪`,
    coverImage: 'https://picsum.photos/seed/ency5/800/450',
    images: [
      'https://picsum.photos/seed/ency5-1/600/400',
      'https://picsum.photos/seed/ency5-2/600/400'
    ],
    author: '健身教练李老师',
    viewCount: 1654,
    createdAt: '2024-05-18T14:30:00Z',
    updatedAt: '2024-05-20T09:15:00Z'
  },
  {
    id: 6,
    title: '夏季广场舞防中暑全攻略',
    category: 'safety_tip',
    summary: '夏季高温天气下跳广场舞如何预防中暑，包括时间选择、着装建议、补水方法等。',
    content: `## 夏季跳广场舞要注意防暑

夏季气温高，跳广场舞容易中暑。了解防暑知识，才能在夏天也能安全快乐地跳舞。

### 一、中暑的危害

中暑不是小事，严重的中暑（热射病）可能危及生命！

**中暑的发展过程**：
1. 先兆中暑：头晕、乏力、出汗增多
2. 轻度中暑：体温升高、面色潮红、心率加快
3. 重度中暑（热射病）：体温超过40℃、意识障碍、可能危及生命

### 二、合理安排时间

☀️ **最佳跳舞时间**：

| 季节 | 推荐时间 | 原因 |
|------|----------|------|
| 夏季 | 早上6:00-7:30 | 气温较低，空气较好 |
| 夏季 | 晚上19:30-21:00 | 太阳落山，气温下降 |

❌ **避免这些时间段**：
- 上午10:00-下午16:00（气温最高的时段）
- 中午11:00-14:00（绝对不要外出跳舞！）

💡 **小贴士**：如果天气预报说气温超过35℃，建议改为室内活动或休息一天。

### 三、选择合适的场地

🌳 **理想的夏季跳舞场地**：
- 有树荫遮蔽的公园广场
- 通风良好的架空层
- 靠近水边的地方（河边、湖边）
- 室内体育馆或活动室

❌ **避免这些场地**：
- 阳光直射的水泥地（地表温度可能超过50℃！）
- 密闭不通风的地方
- 靠近空调外机的地方

### 四、正确的夏季着装

👕 **上衣选择**：
- 浅色（白色、浅粉、浅蓝），反射阳光
- 透气、吸汗的纯棉或速干面料
- 宽松款式，便于通风散热
- 不要穿深色、紧身的衣服

👖 **下装选择**：
- 运动短裤或七分裤
- 同样要浅色、透气

👟 **鞋子选择**：
- 透气的网面运动鞋
- 不要穿不透气的皮鞋或胶鞋

🧢 **防晒装备**：
- 宽檐遮阳帽（遮挡脸部和颈部）
- 太阳镜（保护眼睛）
- 防晒霜（SPF30+，PA++以上，出门前30分钟涂抹）

❌ **不要佩戴**：
- 厚重的首饰
- 不透气的帽子
- 深色的围巾

### 五、科学补水

💧 **夏季补水全攻略**

#### 1. 跳舞前补水
- 出门前30分钟喝200-300ml水
- 不要空腹跳舞，也不要吃饱后马上跳

#### 2. 跳舞中补水
- 每15-20分钟喝100-200ml水
- 不要等到口渴了才喝
- 小口慢饮，不要猛灌

#### 3. 跳舞后补水
- 继续少量多次补水
- 1小时内补充500-1000ml
- 出汗多的话可以喝运动饮料或淡盐水

🥤 **推荐饮品**：
✅ 温水（最安全）
✅ 淡盐水（1L水+1g盐）
✅ 低糖运动饮料
✅ 绿豆汤（常温的，不要冰的）

❌ **绝对不要喝**：
❌ 冰水（会刺激肠胃，导致腹痛）
❌ 冰啤酒（会加重脱水，还可能引发痛风）
❌ 浓茶、咖啡（利尿，加重脱水）
❌ 碳酸饮料（含糖量太高）

### 六、防暑小技巧

💡 **这些小技巧可以帮你降温**

1. **提前降温**：出门前用温水洗脸、擦脖子
2. **携带小风扇**：休息时可以吹一吹
3. **备足纸巾**：随时擦汗，保持皮肤干爽
4. **带一条干毛巾**：出汗后及时擦干，避免吹风着凉
5. **随身携带防暑药物**：
   - 藿香正气水/胶囊
   - 清凉油/风油精
   - 人丹

### 七、识别中暑症状

⚠️ **如果出现以下症状，立即停止跳舞！**

**轻度中暑症状**：
- 头晕、头痛
- 心慌、胸闷
- 恶心、想吐
- 出冷汗、四肢无力
- 体温略有升高

**重度中暑症状（危险！）**：
- 体温超过40℃
- 面色潮红或苍白
- 皮肤干燥无汗
- 意识模糊、反应迟钝
- 四肢抽搐

### 八、中暑应急处理

🚨 **有人中暑了怎么办？**

#### 轻度中暑处理：
1. 立即转移到阴凉通风处
2. 坐下或躺下休息
3. 解开衣领，用湿毛巾擦脸和脖子
4. 小口喝淡盐水或运动饮料
5. 可以服用藿香正气水等防暑药
6. 密切观察，如果症状加重立即送医院

#### 重度中暑处理（热射病）：
⚠️ 这是危急情况，必须立即处理！
1. 立即拨打120急救电话
2. 迅速将患者转移到阴凉处
3. 快速降温：
   - 用湿毛巾冷敷额头、颈部、腋下、腹股沟
   - 有条件的话用风扇吹
   - 可以用酒精擦拭皮肤（如果没有酒精，用凉水也行）
4. 如果患者清醒，小口喂水
5. 如果患者昏迷，将头偏向一侧，防止呕吐物窒息
6. 不要给昏迷患者喂药或喂水

### 九、特殊人群夏季注意事项

#### 高血压患者
- 夏天血压容易波动，要经常监测
- 早上起床先测血压，偏高就不要出门
- 随身携带降压药

#### 糖尿病患者
- 夏天食欲可能下降，要注意监测血糖
- 不要空腹跳舞，防止低血糖
- 随身携带糖果

#### 心脏病患者
- 高温会增加心脏负担，减少运动量
- 随身携带急救药物
- 最好有家人陪同

#### 孕妇
- 不建议在夏天跳广场舞
- 可以选择室内空调环境下的孕妇瑜伽

#### 肥胖人群
- 体重越大，中暑风险越高
- 适当减少运动时间和强度
- 更加注意补水

### 十、夏季防暑饮食建议

🥗 **多吃这些食物**：
- 西瓜、哈密瓜（水分充足）
- 黄瓜、西红柿（清热解暑）
- 绿豆汤、酸梅汤（消暑饮品）
- 苦瓜、冬瓜（清热降火）
- 适量喝些菊花茶、金银花茶

❌ **少吃这些食物**：
- 辛辣刺激的食物
- 油腻的食物
- 过多的冷饮
- 大量的热性水果（荔枝、龙眼等）

### 防暑总结

✅ 避开高温时段
✅ 选择阴凉场地
✅ 穿浅色透气衣服
✅ 戴遮阳帽
✅ 小口勤喝水
✅ 随身携带防暑药
✅ 感觉不适立即停止

夏季跳舞，安全第一。希望大家都能度过一个健康快乐的夏天！🌞`,
    coverImage: 'https://picsum.photos/seed/ency6/800/450',
    images: [
      'https://picsum.photos/seed/ency6-1/600/400',
      'https://picsum.photos/seed/ency6-2/600/400',
      'https://picsum.photos/seed/ency6-3/600/400'
    ],
    author: '社区医生张大夫',
    viewCount: 2789,
    createdAt: '2024-05-25T10:00:00Z',
    updatedAt: '2024-06-01T15:30:00Z'
  }
];

export const mockActivities: TeamActivity[] = [
  {
    id: 1,
    teamId: 1,
    title: '红扇舞新动作排练',
    type: 'rehearsal',
    description: '学习最新编排的红扇舞动作，重点练习队形变换和扇子开合技巧。',
    date: '2026-06-17',
    startTime: '06:30',
    endTime: '08:00',
    location: '朝阳公园中心广场',
    parkLat: 39.9339,
    parkLng: 116.4728,
    coverImage: 'https://picsum.photos/seed/act1/600/400',
    participants: 40,
    createdAt: '2026-06-10T10:30:00Z'
  },
  {
    id: 2,
    teamId: 1,
    title: '朝阳区文艺汇演',
    type: 'performance',
    description: '参加朝阳区第15届社区文化艺术节文艺汇演，表演经典红扇舞。',
    date: '2026-06-20',
    startTime: '14:00',
    endTime: '17:00',
    location: '朝阳剧场',
    coverImage: 'https://picsum.photos/seed/act2/600/400',
    participants: 45,
    createdAt: '2026-06-05T14:20:00Z'
  },
  {
    id: 3,
    teamId: 2,
    title: '《科目三》完整排练',
    type: 'rehearsal',
    description: '网红舞曲《科目三》完整版排练，统一服装，准备拍摄视频。',
    date: '2026-06-16',
    startTime: '19:00',
    endTime: '21:00',
    location: '颐和园北广场',
    parkLat: 39.9999,
    parkLng: 116.2755,
    coverImage: 'https://picsum.photos/seed/act3/600/400',
    participants: 28,
    createdAt: '2026-06-12T09:15:00Z'
  },
  {
    id: 4,
    teamId: 3,
    title: '古典舞《春江花月夜》演出',
    type: 'performance',
    description: '在地坛公园文化节上表演古典舞《春江花月夜》，身着汉服，展现东方之美。',
    date: '2026-06-18',
    startTime: '19:30',
    endTime: '21:00',
    location: '地坛公园方泽坛',
    parkLat: 39.9467,
    parkLng: 116.4153,
    coverImage: 'https://picsum.photos/seed/act4/600/400',
    participants: 25,
    createdAt: '2026-06-08T16:40:00Z'
  },
  {
    id: 5,
    teamId: 4,
    title: '健身操公开课',
    type: 'other',
    description: '面向社区居民的免费健身操公开课，欢迎所有喜欢运动的朋友参加！',
    date: '2026-06-21',
    startTime: '09:00',
    endTime: '11:00',
    location: '月坛公园东门广场',
    parkLat: 39.9156,
    parkLng: 116.3553,
    coverImage: 'https://picsum.photos/seed/act5/600/400',
    participants: 80,
    createdAt: '2026-06-11T11:00:00Z'
  },
  {
    id: 6,
    teamId: 5,
    title: '爵士舞串烧排练',
    type: 'rehearsal',
    description: '《无价之姐》+《Despacito》爵士舞串烧排练，准备参加丰台区比赛。',
    date: '2026-06-19',
    startTime: '19:00',
    endTime: '21:00',
    location: '丰台花园中心舞台',
    parkLat: 39.8586,
    parkLng: 116.2869,
    coverImage: 'https://picsum.photos/seed/act6/600/400',
    participants: 20,
    createdAt: '2026-06-09T20:30:00Z'
  },
  {
    id: 7,
    teamId: 5,
    title: '丰台区广场舞大赛',
    type: 'competition',
    description: '参加2026年丰台区"舞动青春"广场舞大赛，展示爵士舞串烧节目。',
    date: '2026-06-25',
    startTime: '13:30',
    endTime: '18:00',
    location: '丰台区文化中心大剧院',
    coverImage: 'https://picsum.photos/seed/act7/600/400',
    participants: 22,
    createdAt: '2026-06-01T15:20:00Z'
  },
  {
    id: 8,
    teamId: 6,
    title: '晨练民族舞',
    type: 'rehearsal',
    description: '日常晨练，复习《敖包相会》《康定情歌》等经典民族舞。',
    date: '2026-06-17',
    startTime: '06:30',
    endTime: '08:00',
    location: '八角游乐园南广场',
    parkLat: 39.9078,
    parkLng: 116.2228,
    coverImage: 'https://picsum.photos/seed/act8/600/400',
    participants: 35,
    createdAt: '2026-06-13T08:00:00Z'
  },
  {
    id: 9,
    teamId: 7,
    title: '运河文化广场周末演出',
    type: 'performance',
    description: '通州区周末文化活动，表演《科目三》《爱你》等流行广场舞。',
    date: '2026-06-22',
    startTime: '18:30',
    endTime: '20:30',
    location: '运河文化广场',
    parkLat: 39.9167,
    parkLng: 116.6556,
    coverImage: 'https://picsum.photos/seed/act9/600/400',
    participants: 16,
    createdAt: '2026-06-14T13:10:00Z'
  },
  {
    id: 10,
    teamId: 8,
    title: '蒙古舞专场演出',
    type: 'performance',
    description: '昌平公园蒙古舞专场，表演盅碗舞、筷子舞、鸿雁等经典节目。',
    date: '2026-06-28',
    startTime: '15:00',
    endTime: '17:30',
    location: '昌平公园湖心亭',
    parkLat: 40.2228,
    parkLng: 116.2328,
    coverImage: 'https://picsum.photos/seed/act10/600/400',
    participants: 15,
    createdAt: '2026-06-07T10:45:00Z'
  },
  {
    id: 11,
    teamId: 9,
    title: '秧歌队日常排练',
    type: 'rehearsal',
    description: '传统秧歌排练，练习十字步、扭腰动作和队形变换。',
    date: '2026-06-18',
    startTime: '06:00',
    endTime: '07:30',
    location: '兴旺公园北门',
    parkLat: 39.7289,
    parkLng: 116.3386,
    coverImage: 'https://picsum.photos/seed/act11/600/400',
    participants: 38,
    createdAt: '2026-06-10T07:20:00Z'
  },
  {
    id: 12,
    teamId: 9,
    title: '大兴区非遗文化展演',
    type: 'performance',
    description: '参加大兴区非物质文化遗产展演活动，表演传统秧歌。',
    date: '2026-06-27',
    startTime: '09:00',
    endTime: '12:00',
    location: '大兴区文化馆广场',
    coverImage: 'https://picsum.photos/seed/act12/600/400',
    participants: 42,
    createdAt: '2026-06-03T09:50:00Z'
  },
  {
    id: 13,
    teamId: 10,
    title: '拉丁舞公开课',
    type: 'other',
    description: '拉丁舞基础动作公开课，教授恰恰、伦巴基本步，欢迎初学者参加。',
    date: '2026-06-20',
    startTime: '19:00',
    endTime: '21:00',
    location: '顺义公园西侧广场',
    parkLat: 40.1289,
    parkLng: 116.6556,
    coverImage: 'https://picsum.photos/seed/act13/600/400',
    participants: 30,
    createdAt: '2026-06-12T14:30:00Z'
  },
  {
    id: 14,
    teamId: 2,
    title: '海淀区广场舞友谊赛',
    type: 'competition',
    description: '海淀区各舞队友谊交流赛，交流学习，增进感情。',
    date: '2026-06-29',
    startTime: '14:00',
    endTime: '18:30',
    location: '海淀区文化活动中心',
    coverImage: 'https://picsum.photos/seed/act14/600/400',
    participants: 32,
    createdAt: '2026-06-06T11:15:00Z'
  },
  {
    id: 15,
    teamId: 4,
    title: '月末健身操考核',
    type: 'other',
    description: '月末健身操动作考核，检验队员本月学习成果。',
    date: '2026-06-30',
    startTime: '18:00',
    endTime: '19:30',
    location: '月坛公园',
    parkLat: 39.9156,
    parkLng: 116.3553,
    coverImage: 'https://picsum.photos/seed/act15/600/400',
    participants: 50,
    createdAt: '2026-06-15T10:00:00Z'
  },
  {
    id: 16,
    teamId: 1,
    title: '日常晨练',
    type: 'rehearsal',
    description: '每日晨练活动，复习红扇舞动作，保持身体状态。',
    date: '2026-06-23',
    startTime: '06:30',
    endTime: '08:00',
    location: '朝阳公园',
    parkLat: 39.9339,
    parkLng: 116.4728,
    participants: 42,
    createdAt: '2026-06-15T08:00:00Z'
  },
  {
    id: 17,
    teamId: 3,
    title: '古典舞身韵训练',
    type: 'rehearsal',
    description: '古典舞身韵基础训练，重点练习提沉、冲靠、含腆等基本元素。',
    date: '2026-06-24',
    startTime: '19:30',
    endTime: '21:00',
    location: '地坛公园',
    parkLat: 39.9467,
    parkLng: 116.4153,
    participants: 24,
    createdAt: '2026-06-14T18:00:00Z'
  },
  {
    id: 18,
    teamId: 8,
    title: '蒙古族传统舞蹈教学',
    type: 'other',
    description: '面向舞蹈爱好者的蒙古族传统舞蹈公益教学活动。',
    date: '2026-06-26',
    startTime: '15:00',
    endTime: '17:00',
    location: '昌平公园',
    parkLat: 40.2228,
    parkLng: 116.2328,
    participants: 45,
    createdAt: '2026-06-13T16:00:00Z'
  }
];
