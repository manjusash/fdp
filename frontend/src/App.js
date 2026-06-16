import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('fdp_token'));
  const [adminName, setAdminName] = useState(localStorage.getItem('fdp_admin') || '');

  const handleLogin = (tok, username) => {
    localStorage.setItem('fdp_token', tok);
    localStorage.setItem('fdp_admin', username);
    setToken(tok);
    setAdminName(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('fdp_token');
    localStorage.removeItem('fdp_admin');
    setToken(null);
    setAdminName('');
  };

  return (
    <div>
      {token
        ? <Dashboard token={token} adminName={adminName} onLogout={handleLogout} />
        : <Login onLogin={handleLogin} />}
    </div>
  );
}

export default App;
