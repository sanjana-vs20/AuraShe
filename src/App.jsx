import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoalSelectionScreen from "./screens/GoalSelectionScreen";
import PeriodScreen from "./screens/PeriodScreen";
import PregnantModeScreen from "./screens/PregnantModeScreen";
import PregnancyTrackerScreen from "./screens/PregnancyTrackerScreen";
import MenopauseScreen from "./screens/MenopauseScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GoalSelectionScreen />} />
        <Route path="/period" element={<PeriodScreen />} />
        <Route path="/pregnant" element={<PregnantModeScreen />} />
        <Route path="/pregnancy-tracker" element={<PregnancyTrackerScreen />} />
        <Route path="/menopause" element={<MenopauseScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
