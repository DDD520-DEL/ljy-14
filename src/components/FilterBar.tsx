import { useFilterStore } from '../store/useStore';

const districts = ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区', '通州区', '昌平区', '大兴区', '顺义区'];
const styles = ['民族风', '流行风', '古典风', '健身操', '爵士风'];
const memberCounts = [
  { label: '10人以下', value: '0-10' },
  { label: '10-30人', value: '10-30' },
  { label: '30-50人', value: '30-50' },
  { label: '50人以上', value: '50-999' },
];

export default function FilterBar() {
  const { district, style, memberCount, setDistrict, setStyle, setMemberCount, resetFilters } = useFilterStore();

  const hasFilters = district || style || memberCount;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-slideUp">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📍 所在区域</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all outline-none bg-gray-50"
          >
            <option value="">全部区域</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🎵 舞蹈风格</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all outline-none bg-gray-50"
          >
            <option value="">全部风格</option>
            {styles.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">👥 人数规模</label>
          <select
            value={memberCount}
            onChange={(e) => setMemberCount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all outline-none bg-gray-50"
          >
            <option value="">全部规模</option>
            {memberCounts.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <div className="self-end">
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-xl border-2 border-orange-300 text-orange-600 font-medium hover:bg-orange-50 transition-all hover:scale-105 active:scale-95"
            >
              🔄 重置筛选
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
