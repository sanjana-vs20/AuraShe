import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoalSelectionScreen from "./screens/GoalSelectionScreen";
import PeriodScreen from "./screens/PeriodScreen";
import PregnantModeScreen from "./screens/PregnantModeScreen";
import PregnancyTrackerScreen from "./screens/PregnancyTrackerScreen";

// Your friend's screens
import NewbornScreen from "./screens/NewbornScreen";
import VaccinationsScreen from "./screens/VaccinationsScreen";
import FoodChartScreen from "./screens/FoodChartScreen";
import BabyTipsScreen from "./screens/BabyTipsScreen";
import NearbyHealthScreen from "./screens/NearbyHealthScreen";
import BreastfeedingScreen from "./screens/BreastfeedingScreen";
import GrowthTrackerScreen from "./screens/GrowthTrackerScreen";

// Your screens
import PregnancyDashboard from "./screens/PregnancyDashboard";
import MenopauseScreen from "./screens/MenopauseScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GoalSelectionScreen />} />
        <Route path="/period" element={<PeriodScreen />} />
        <Route path="/pregnant" element={<PregnantModeScreen />} />
        <Route path="/pregnancy-tracker" element={<PregnancyTrackerScreen />} />

        {/* Friend's routes */}
        <Route path="/newborn" element={<NewbornScreen />} />
        <Route path="/vaccinations" element={<VaccinationsScreen />} />
        <Route path="/food-chart" element={<FoodChartScreen />} />
        <Route path="/baby-tips" element={<BabyTipsScreen />} />
        <Route path="/nearby-health" element={<NearbyHealthScreen />} />
        <Route path="/breastfeeding" element={<BreastfeedingScreen />} />
        <Route path="/growth-tracker" element={<GrowthTrackerScreen />} />

        {/* Your routes */}
        <Route path="/pregnancy-dashboard" element={<PregnancyDashboard />} />
        <Route path="/menopause" element={<MenopauseScreen />} />
      </Routes>
    </BrowserRouter>
  );
}