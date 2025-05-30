// src/components/Layout.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Ensure this is set up properly
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    API.get('/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>MyApp</h2>
        <nav>
          <ul>
            <li onClick={() => navigate('/dashboard')}>Dashboard</li>
            <li onClick={() => navigate('/add-salary')}>Add Salary</li>
            <li onClick={() => navigate('/salary')}>Salary Tracker</li>
            <li onClick={() => navigate('/expenses')}>Expense Tracker</li>
          </ul>
        </nav>
      </aside>

      <div className="main-content">
        <header className="navbar">
          <div className="user-info">
            {user ? (
              <>
                <span>{user.name}</span> | <span>{user.email}</span>
              </>
            ) : (
              <span>Loading user...</span>
            )}
          </div>
          <button onClick={handleLogout}>Logout</button>
        </header>

        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
