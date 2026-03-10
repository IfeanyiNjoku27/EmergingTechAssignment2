import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PlayerDashboard from './pages/PlayerDashboard';
import ThreeBackground from './components/ThreeBackground';
import NavBar from './components/Navbar';

function App() {
  return (
    <Router>
      <ThreeBackground /> 
      <div className="content-overlay">
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/player-dashboard" element={<PlayerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;