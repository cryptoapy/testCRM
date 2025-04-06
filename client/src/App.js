import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
      <Router>
        <Routes>
          <Route path="/" element={
            token ? <Navigate to="/profile" /> : <Navigate to="/login" />
          } />
          <Route path="/login" element={
            token ? <Navigate to="/profile" /> :
                <Login onLogin={handleLogin} />
          } />
          <Route path="/register" element={
            token ? <Navigate to="/profile" /> :
                <Register onRegister={() => window.location = '/login'} />
          } />
          <Route path="/profile" element={
            token ? <Profile token={token} /> : <Navigate to="/login" />
          } />
        </Routes>
      </Router>
  );
}

export default App;