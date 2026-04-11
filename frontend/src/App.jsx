import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importing Core Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MissionSelection from './pages/MissionSelection';
import DSAMissions from './pages/DSAMissions';
import AlgoArena from './pages/games/AlgoArena.jsx';
import FullStackMissions from './pages/FullStackMissions.jsx';

// Importing Game Components
import DebugLevels from './pages/games/DebugLevels';
import DebugArena from './pages/games/DebugArena';
import PredictGame from './pages/games/PredictGame.jsx';
import GraphVilla from './pages/games/GraphVilla.jsx';
import BattleScreen from './pages/games/BattleScreen.jsx';
import DebugFullstack from './pages/games/debugFullstack.jsx';
import AlgoVerse from './pages/games/AlgoVerse.jsx';

// ✅ ADD THIS IMPORT ONLY
import CodeArena from './pages/games/CodeArena.jsx';
import GitQuest from './pages/games/GitQuest.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Core Navigation Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/missions" element={<MissionSelection />} />
        <Route path="/dsa-missions" element={<DSAMissions />} />
        <Route path="/full-stack" element={<FullStackMissions />} />

        
        {/* Game Routes */}
        <Route path="/games/debug" element={<DebugLevels />} /> 
        <Route path="/games/debug/arena" element={<DebugArena />} /> 
        <Route path="/games/predict" element={<PredictGame />} />
        <Route path="/games/algo-arena" element={<AlgoArena />} />
        <Route path="/games/graph" element={<GraphVilla/>} />
        <Route path="/games/battle" element={<AlgoVerse/>} />

        {/*full stack game routed*/}
        <Route path="/games/debug-dungeon" element={<DebugFullstack/>} />

        {/* ✅ ADD THIS ROUTE ONLY */}
        <Route path="/games/code-arena" element={<CodeArena />} />
        <Route path="/games/git-quest" element={<GitQuest />} />


        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;