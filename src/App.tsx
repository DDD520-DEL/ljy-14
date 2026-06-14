import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import TeamListPage from "@/pages/TeamListPage";
import TeamDetailPage from "@/pages/TeamDetailPage";
import BattlePage from "@/pages/BattlePage";
import MapPage from "@/pages/MapPage";
import RankingPage from "@/pages/RankingPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teams" element={<TeamListPage />} />
          <Route path="/teams/:id" element={<TeamDetailPage />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Routes>
      </div>
    </Router>
  );
}
