import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Link2, Users } from 'lucide-react';
import { useTeamStore, useFriendshipStore } from '../store/useStore';
import { TeamFriendshipWithDetails, Team } from '../../shared/types';

interface NodePosition {
  teamId: number;
  x: number;
  y: number;
}

export default function RelationGraphPage() {
  const { teams, fetchTeams } = useTeamStore();
  const { allFriendships, fetchAllFriendships, loading } = useFriendshipStore();
  const [hoveredTeamId, setHoveredTeamId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);

  useEffect(() => {
    if (teams.length === 0) fetchTeams();
    fetchAllFriendships();
  }, []);

  const calculatePositions = useCallback(() => {
    if (!containerRef.current || teams.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const padding = 60;
    const availableWidth = width - padding * 2;

    const cols = Math.ceil(Math.sqrt(teams.length));
    const rows = Math.ceil(teams.length / cols);
    const cellWidth = availableWidth / cols;
    const cellHeight = 120;

    const positions: NodePosition[] = teams.map((team, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const itemsInRow = row === rows - 1 ? teams.length - row * cols : cols;
      const rowOffset = (cols - itemsInRow) * cellWidth / 2;

      return {
        teamId: team.id,
        x: padding + rowOffset + col * cellWidth + cellWidth / 2,
        y: padding + row * cellHeight + cellHeight / 2
      };
    });

    setNodePositions(positions);
  }, [teams]);

  useEffect(() => {
    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    return () => window.removeEventListener('resize', calculatePositions);
  }, [calculatePositions]);

  const getNodePosition = (teamId: number): NodePosition | undefined => {
    return nodePositions.find(n => n.teamId === teamId);
  };

  const isTeamInFriendship = (teamId: number, friendship: TeamFriendshipWithDetails): boolean => {
    return friendship.teamId1 === teamId || friendship.teamId2 === teamId;
  };

  const getConnectedTeamIds = (teamId: number): number[] => {
    return allFriendships
      .filter(f => isTeamInFriendship(teamId, f))
      .map(f => f.teamId1 === teamId ? f.teamId2 : f.teamId1);
  };

  const svgHeight = teams.length > 0
    ? Math.ceil(Math.sqrt(teams.length)) * 120 + 120
    : 400;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-lg mb-4">
            <Link2 className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-medium">舞队关系</span>
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            友好关系图谱
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            查看舞队之间的友好关联，点击节点可跳转到对应舞队详情页
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                <span className="text-sm text-gray-600">舞队节点</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400"></div>
                <span className="text-sm text-gray-600">友好关系连线</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              共 {teams.length} 个舞队 · {allFriendships.length} 条友好关系
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
          >
            <svg
              width="100%"
              height={svgHeight}
              className="absolute top-0 left-0 pointer-events-none"
              style={{ zIndex: 1 }}
            >
              {allFriendships.map((friendship) => {
                const pos1 = getNodePosition(friendship.teamId1);
                const pos2 = getNodePosition(friendship.teamId2);
                if (!pos1 || !pos2) return null;

                const isHighlighted = hoveredTeamId !== null && (
                  isTeamInFriendship(hoveredTeamId, friendship)
                );

                return (
                  <line
                    key={friendship.id}
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    className={`transition-all duration-300 ${
                      isHighlighted
                        ? 'stroke-green-500 stroke-2'
                        : hoveredTeamId !== null
                          ? 'stroke-gray-200 stroke-1'
                          : 'stroke-green-300 stroke-1.5'
                    }`}
                    strokeDasharray={isHighlighted ? 'none' : undefined}
                    opacity={hoveredTeamId !== null && !isHighlighted ? 0.3 : 1}
                  />
                );
              })}
            </svg>

            <div
              className="relative"
              style={{ zIndex: 2, minHeight: svgHeight }}
            >
              {teams.map((team: Team) => {
                const pos = getNodePosition(team.id);
                if (!pos) return null;

                const friendCount = getConnectedTeamIds(team.id).length;
                const isConnected = hoveredTeamId === null || 
                  hoveredTeamId === team.id || 
                  getConnectedTeamIds(hoveredTeamId).includes(team.id);

                return (
                  <Link
                    key={team.id}
                    to={`/teams/${team.id}`}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      isConnected ? 'opacity-100 scale-100' : 'opacity-30 scale-90'
                    }`}
                    style={{ left: pos.x, top: pos.y }}
                    onMouseEnter={() => setHoveredTeamId(team.id)}
                    onMouseLeave={() => setHoveredTeamId(null)}
                  >
                    <div className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${
                      hoveredTeamId === team.id
                        ? 'bg-green-50 shadow-lg scale-110'
                        : 'hover:bg-green-50/50'
                    }`}>
                      <div className="relative">
                        <img
                          src={team.avatar}
                          alt={team.name}
                          className={`w-14 h-14 rounded-full border-3 object-cover transition-all duration-300 ${
                            hoveredTeamId === team.id
                              ? 'border-green-500 shadow-lg ring-2 ring-green-200'
                              : friendCount > 0
                                ? 'border-green-300 shadow-md'
                                : 'border-gray-200 shadow-sm'
                          }`}
                        />
                        {friendCount > 0 && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">{friendCount}</span>
                          </div>
                        )}
                      </div>
                      <p className={`mt-2 text-sm font-medium text-center max-w-[80px] truncate transition-colors ${
                        hoveredTeamId === team.id ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {team.name}
                      </p>
                      {friendCount > 0 && (
                        <p className="text-xs text-green-500 mt-0.5">
                          {friendCount}个友好舞队
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {allFriendships.length === 0 && !loading && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <Link2 className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">暂无友好关系</h3>
            <p className="text-gray-500 mb-6">前往舞队详情页标记友好舞队后，关系图谱将在此展示</p>
            <Link
              to="/teams"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-bold hover:shadow-lg transition-all"
            >
              <Users className="w-5 h-5" />
              <span>浏览舞队</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
