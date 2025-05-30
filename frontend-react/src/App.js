import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import ExpenseTracker from './pages/ExpenseTracker';
import AddSalary from './pages/AddSalary';
import SalaryTracker from './pages/SalaryTracker';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<ExpenseTracker />} />
        <Route path="/add-salary" element={<AddSalary />} />
        <Route path="/salary" element={<SalaryTracker />} />
      </Routes>
    </Router>
  );
}

export default App;
