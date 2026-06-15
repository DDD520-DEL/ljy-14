import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, ChevronRight, Flame, Loader2 } from 'lucide-react';
import { useTeamStore, useFilterStore, useRankingStore } from '../store/useStore';
import { Team, TeamVideo } from '../../shared/types';
import VideoCard from './VideoCard';
import VideoPlayer from './VideoPlayer';

interface VideoWithTeam extends TeamVideo {
  team: Team;
}

interface HotVideosSectionProps {
  limit?: number;
}

export default function HotVideosSection({ limit = 6 }: HotVideosSectionProps) {
  const { district, style, memberCount, hasVideo } = useFilterStore();
  const { comprehensiveRanking, fetchComprehensiveRanking, loading: rankingLoading } = useRankingStore();
  const { teams, fetchTeams, loading: teamsLoading } = useTeamStore();
  const [playingVideo, setPlayingVideo] = useState<TeamVideo | null>(null);
  const [hotVideos, setHotVideos] = useState<VideoWithTeam[]>([]);

  useEffect(() => {
    fetchComprehensiveRanking();
    fetchTeams({ district, style, memberCount, hasVideo: true });
  }, [district, style, memberCount]);

  useEffect(() => {
    const videos: VideoWithTeam[] = [];
    
    const allTeams = comprehensiveRanking.length > 0 ? comprehensiveRanking : teams;
    
    allTeams.forEach(team => {
      if (team.videos && team.videos.length > 0) {
        team.videos.forEach(video => {
          videos.push({ ...video, team });
        });
      }
    });
    
    const filteredVideos = videos.filter(video => {
      if (district && video.team.district !== district) return false;
      if (style && video.team.style !== style) return false;
      if (memberCount) {
        const [min, max] = memberCount.split('-').map(Number);
        if (max) {
          if (video.team.memberCount < min || video.team.memberCount > max) return false;
        } else {
          if (video.team.memberCount < min) return false;
        }
      }
      return true;
    });
    
    setHotVideos(filteredVideos.slice(0, limit));
  }, [comprehensiveRanking, teams, district, style, memberCount, limit]);

  const loading = rankingLoading.comprehensive || teamsLoading;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
            <Flame className="w-8 h-8 text-orange-500" />
            <span>🔥 热门视频</span>
          </h2>
          <p className="text-gray-500 mt-1">按舞队综合排名精选的精彩表演</p>
        </div>
        <Link
          to="/teams"
          className="flex items-center space-x-1 text-orange-600 font-medium hover:text-orange-700 transition-colors"
        >
          <span>查看全部视频</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
      ) : hotVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotVideos.map((video, index) => (
            <VideoCard
              key={`${video.team.id}-${video.id}`}
              video={video}
              team={video.team}
              onPlay={setPlayingVideo}
              delay={index * 100}
              showTeamInfo={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl">
          <Video className="w-20 h-20 mx-auto mb-4 text-orange-300" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">暂无符合条件的视频</h3>
          <p className="text-gray-500 mb-6">
            {district || style || memberCount 
              ? '当前筛选条件下暂无视频，试试调整筛选条件' 
              : '还没有舞队上传表演视频'}
          </p>
          {(district || style || memberCount) && (
            <Link
              to="/teams"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:shadow-lg transition-all"
            >
              <ChevronRight className="w-5 h-5" />
              <span>浏览所有舞队</span>
            </Link>
          )}
        </div>
      )}

      {playingVideo && (
        <VideoPlayer
          video={playingVideo}
          onClose={() => setPlayingVideo(null)}
        />
      )}
    </div>
  );
}
