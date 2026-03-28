import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import GoalSelectionScreen from "./screens/GoalSelectionScreen";
import PeriodScreen from "./screens/PeriodScreen";
import PregnantModeScreen from "./screens/PregnantModeScreen";
import FertilityTrackerScreen from "./screens/FertilityTrackerScreen";
import PregnancyTrackerScreen from "./screens/PregnancyTrackerScreen";
import PregnancyDashboard from "./screens/PregnancyDashboard";
import NewbornScreen from "./screens/NewbornScreen";
import VaccinationsScreen from "./screens/VaccinationsScreen";
import FoodChartScreen from "./screens/FoodChartScreen";
import BabyTipsScreen from "./screens/BabyTipsScreen";
import NearbyHealthScreen from "./screens/NearbyHealthScreen";
import BreastfeedingScreen from "./screens/BreastfeedingScreen";
import GrowthTrackerScreen from "./screens/GrowthTrackerScreen";
import EmergencySignsScreen from "./screens/EmergencySignsScreen";
import SymptomCheckerScreen from "./screens/SymptomCheckerScreen";
import SettingsScreen from "./screens/SettingsScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* Main */}
        <Route path="/goal" element={<GoalSelectionScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />

        {/* Period & Fertility */}
        <Route path="/period" element={<PeriodScreen />} />
        <Route path="/pregnant" element={<PregnantModeScreen />} />
        <Route path="/fertility" element={<FertilityTrackerScreen />} />

        {/* Pregnancy */}
        <Route path="/pregnancy-tracker" element={<PregnancyTrackerScreen />} />
        <Route path="/pregnancy-dashboard" element={<PregnancyDashboard />} />

        {/* Newborn */}
        <Route path="/newborn" element={<NewbornScreen />} />
        <Route path="/vaccinations" element={<VaccinationsScreen />} />
        <Route path="/food-chart" element={<FoodChartScreen />} />
        <Route path="/baby-tips" element={<BabyTipsScreen />} />
        <Route path="/nearby-health" element={<NearbyHealthScreen />} />
        <Route path="/breastfeeding" element={<BreastfeedingScreen />} />
        <Route path="/growth-tracker" element={<GrowthTrackerScreen />} />
        <Route path="/emergency-signs" element={<EmergencySignsScreen />} />
        <Route path="/symptom-checker" element={<SymptomCheckerScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
