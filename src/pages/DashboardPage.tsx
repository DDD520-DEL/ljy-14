import { useEffect, useState } from 'react';
import { Users, Music, Heart, BarChart3, PieChart, TrendingUp, RefreshCw, Loader2 } from 'lucide-react';
import { statsApi, DashboardStats, DistrictStats, DailyVoteStats } from '../services/api';

const PIE_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#14b8a6',
];

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  delay?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    let step = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        step++;
        current = Math.min(stepValue * step, value);
        setDisplayValue(Math.floor(current));
        if (step >= steps) {
          setDisplayValue(value);
          clearInterval(interval);
        }
      }, duration / steps);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex items-center space-x-1 text-green-500 text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>活跃</span>
        </div>
      </div>
      <div
        className="text-4xl font-bold text-gray-800 mb-1"
        style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
      >
        {displayValue.toLocaleString()}
      </div>
      <div className="text-gray-500 font-medium">{label}</div>
    </div>
  );
}

function PieChartComponent({ data }: { data: DistrictStats[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const size = 280;
  const radius = 110;
  const centerX = size / 2;
  const centerY = size / 2;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  let currentAngle = -90;
  const slices = data.map((item, index) => {
    const angle = (item.count / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathD =
      data.length === 1
        ? `M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 1 1 ${centerX - 0.001} ${centerY - radius} Z`
        : `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return {
      ...item,
      pathD,
      color: PIE_COLORS[index % PIE_COLORS.length],
      index,
    };
  });

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {slices.map((slice) => (
            <path
              key={slice.index}
              d={slice.pathD}
              fill={slice.color}
              stroke="white"
              strokeWidth="3"
              className="cursor-pointer transition-all duration-200"
              style={{
                transform: hoveredIndex === slice.index ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: `${centerX}px ${centerY}px`,
                filter: hoveredIndex === slice.index ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' : 'none',
              }}
              onMouseEnter={() => setHoveredIndex(slice.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
          <circle cx={centerX} cy={centerY} r="55" fill="white" />
          <text
            x={centerX}
            y={centerY - 8}
            textAnchor="middle"
            className="fill-gray-400 text-xs font-medium"
          >
            总计
          </text>
          <text
            x={centerX}
            y={centerY + 18}
            textAnchor="middle"
            className="fill-gray-800 text-2xl font-bold"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            {total}
          </text>
        </svg>
        {hoveredIndex !== null && (
          <div
            className="absolute top-0 left-0 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg pointer-events-none animate-fadeIn"
            style={{
              transform: `translate(${centerX - 60}px, ${-40}px)`,
              minWidth: '120px',
            }}
          >
            <div className="font-bold">{slices[hoveredIndex].district}</div>
            <div className="text-gray-300 text-xs mt-1">
              {slices[hoveredIndex].count} 个 · {slices[hoveredIndex].percentage}%
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {slices.map((slice) => (
          <div
            key={slice.index}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
              hoveredIndex === slice.index ? 'bg-gray-100 scale-105' : 'hover:bg-gray-50'
            }`}
            onMouseEnter={() => setHoveredIndex(slice.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="w-4 h-4 rounded-full shadow"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-gray-700 font-medium min-w-[80px]">{slice.district}</span>
            <span className="text-gray-500 text-sm">{slice.count} 个</span>
            <span
              className="ml-auto text-sm font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${slice.color}20`,
                color: slice.color,
              }}
            >
              {slice.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChartComponent({ data }: { data: DailyVoteStats[] }) {
  const width = 600;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const yMax = Math.ceil(maxCount * 1.2 / 10) * 10;

  const xStep = chartWidth / (data.length - 1 || 1);
  const points = data.map((d, i) => {
    const x = padding.left + i * xStep;
    const y = padding.top + chartHeight - (d.count / yMax) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${padding.top + chartHeight}` +
    ` L ${points[0].x} ${padding.top + chartHeight} Z`;

  const yTicks = 5;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="min-w-[500px]">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const y = padding.top + (chartHeight / yTicks) * i;
          const value = Math.round(yMax - (yMax / yTicks) * i);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-gray-400 text-xs"
              >
                {value}
              </text>
            </g>
          );
        })}

        <path d={areaD} fill="url(#areaGradient)" />

        <path
          d={pathD}
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <g
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="cursor-pointer"
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 8 : 5}
              fill="white"
              stroke="#f97316"
              strokeWidth="3"
              className="transition-all duration-200"
            />
            {hoveredIndex === i && (
              <>
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={p.x}
                  y2={padding.top + chartHeight}
                  stroke="#f97316"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                <rect
                  x={p.x - 35}
                  y={p.y - 55}
                  width="70"
                  height="45"
                  rx="8"
                  fill="#1f2937"
                />
                <text
                  x={p.x}
                  y={p.y - 38}
                  textAnchor="middle"
                  className="fill-white text-xs font-medium"
                >
                  {p.date}
                </text>
                <text
                  x={p.x}
                  y={p.y - 20}
                  textAnchor="middle"
                  className="fill-orange-400 text-lg font-bold"
                  style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
                >
                  {p.count} 票
                </text>
              </>
            )}
          </g>
        ))}

        {points.map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.x}
            y={height - 12}
            textAnchor="middle"
            className="fill-gray-500 text-sm font-medium"
          >
            {p.date}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const data = await statsApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    fetchStats(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <span className="ml-3 text-gray-600 text-lg">加载统计数据中...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10 animate-fadeInDown">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-lg mb-4">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              <span className="text-orange-600 font-medium">数据中心</span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-800"
              style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
            >
              📊 数据统计仪表盘
            </h1>
            <p className="text-gray-500 mt-2">实时监控平台运营数据，洞察广场舞社区动态</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-5 py-2.5 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            <RefreshCw className={`w-5 h-5 text-orange-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-gray-700 font-medium">{refreshing ? '刷新中...' : '刷新数据'}</span>
          </button>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard
                icon={Users}
                label="舞队总数"
                value={stats.totalTeams}
                color="from-blue-500 to-cyan-500"
                delay={0}
              />
              <StatCard
                icon={Music}
                label="歌曲总数"
                value={stats.totalSongs}
                color="from-yellow-500 to-orange-500"
                delay={100}
              />
              <StatCard
                icon={Heart}
                label="今日新增投票"
                value={stats.todayVotes}
                color="from-red-500 to-pink-500"
                delay={200}
              />
              <StatCard
                icon={PieChart}
                label="覆盖区域数"
                value={stats.districtStats.length}
                color="from-green-500 to-emerald-500"
                delay={300}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div
                className="bg-white rounded-2xl p-8 shadow-lg animate-fadeInUp"
                style={{ animationDelay: '400ms' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2
                      className="text-2xl font-bold text-gray-800"
                      style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
                    >
                      🏘️ 各区域舞队占比
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">不同行政区域的舞队数量分布</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <PieChart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <PieChartComponent data={stats.districtStats} />
              </div>

              <div
                className="bg-white rounded-2xl p-8 shadow-lg animate-fadeInUp"
                style={{ animationDelay: '500ms' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2
                      className="text-2xl font-bold text-gray-800"
                      style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
                    >
                      📈 最近7天投票趋势
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">每日投票数量变化趋势</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <LineChartComponent data={stats.last7DaysVotes} />
              </div>
            </div>

            <div
              className="mt-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 shadow-2xl animate-fadeInUp"
              style={{ animationDelay: '600ms' }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                <div>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
                  >
                    💡 运营小贴士
                  </h3>
                  <p className="text-white/90 leading-relaxed max-w-2xl">
                    根据数据分析，周末投票量通常比工作日高出 30%
                    以上。建议在周末组织更多PK活动和舞队展演，以进一步提高用户活跃度和社区影响力！
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-bold mb-1" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                    +30%
                  </div>
                  <div className="text-white/80 text-sm">周末投票增幅</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
