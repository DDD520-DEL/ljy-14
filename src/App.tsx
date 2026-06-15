import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import NicknameModal from "@/components/NicknameModal";
import HomePage from "@/pages/HomePage";
import TeamListPage from "@/pages/TeamListPage";
import TeamDetailPage from "@/pages/TeamDetailPage";
import BattlePage from "@/pages/BattlePage";
import MapPage from "@/pages/MapPage";
import RankingPage from "@/pages/RankingPage";
import FavoritesPage from "@/pages/FavoritesPage";
import ProfilePage from "@/pages/ProfilePage";
import RelationGraphPage from "@/pages/RelationGraphPage";
import EncyclopediaPage from "@/pages/EncyclopediaPage";
import EncyclopediaDetailPage from "@/pages/EncyclopediaDetailPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teams" element={<TeamListPage />} />
          <Route path="/teams/:id" element={<TeamDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/relation-graph" element={<RelationGraphPage />} />
          <Route path="/encyclopedia" element={<EncyclopediaPage />} />
          <Route path="/encyclopedia/:id" element={<EncyclopediaDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <NicknameModal />
      </div>
    </Router>
  );
}
