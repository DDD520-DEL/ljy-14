import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Users, Music, Clock, Filter } from 'lucide-react';
import { useMapStore, useFilterStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapPage() {
  const { teams, loading, error, fetchTeams } = useMapStore();
  const { district, setDistrict } = useFilterStore();
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const districts = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区', '通州区'];

  useEffect(() => {
    fetchTeams(district || undefined);
  }, [district]);

  const center: [number, number] = [39.9042, 116.4074];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-lg mb-4">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="text-blue-600 font-medium">舞队地图</span>
          </div>
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            公园舞队分布图
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            看看你家附近都有哪些广场舞团队，随时加入一起舞动！
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <div className="flex items-center space-x-2 text-gray-600">
            <Filter className="w-5 h-5" />
            <span className="font-medium">按区域筛选：</span>
          </div>
          <button
            onClick={() => setDistrict('')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              !district 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-blue-50'
            }`}
          >
            全部
          </button>
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setDistrict(d)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                district === d 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="h-[600px] relative">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : error ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <p className="text-red-500">{error}</p>
                  </div>
                ) : (
                  <MapContainer
                    center={center}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {teams.map((team) => (
                      <Marker
                        key={team.id}
                        position={[team.parkLat, team.parkLng]}
                        icon={customIcon}
                        eventHandlers={{
                          click: () => setSelectedTeam(team.id),
                        }}
                      >
                        <Popup>
                          <div className="min-w-[200px] p-2">
                            <div className="flex items-center space-x-3 mb-3">
                              <img
                                src={team.avatar}
                                alt={team.name}
                                className="w-12 h-12 rounded-full border-2 border-blue-400"
                              />
                              <div>
                                <h4 className="font-bold text-gray-800" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                                  {team.name}
                                </h4>
                                <p className="text-sm text-blue-600">{team.district}</p>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 mb-3">
                              <p className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span>{team.parkName}</span>
                              </p>
                              <p className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-orange-500" />
                                <span>{team.memberCount} 人</span>
                              </p>
                              <p className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-green-500" />
                                <span>{team.activityTime}</span>
                              </p>
                            </div>
                            <Link
                              to={`/teams/${team.id}`}
                              className="block w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center rounded-lg font-medium hover:shadow-lg transition-all"
                            >
                              查看详情
                            </Link>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                <Music className="w-6 h-6 text-blue-500" />
                <span>舞队列表</span>
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedTeam === team.id
                        ? 'bg-blue-50 border-2 border-blue-400 shadow-md'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={team.avatar}
                        alt={team.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 truncate">{team.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{team.parkName}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-orange-500 font-bold">{team.memberCount}人</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                💡 小贴士
              </h3>
              <p className="text-blue-100 text-sm">
                点击地图上的红色标记可以查看舞队详情。想去跳广场舞的话，可以在固定活动时间直接去公园找他们哦！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
