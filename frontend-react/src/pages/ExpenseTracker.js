// src/pages/ExpenseTracker.js

import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import axios from '../api/axios';

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('/expenses');
      setExpenses(res.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    
<Layout>
  <div style={{ maxWidth: '600px', marginLeft: 0, marginRight: 'auto', padding: '2rem' }}>
    <h2>Expense Tracker</h2>
    <ExpenseForm onExpenseAdded={fetchExpenses} />
    <ExpenseList expenses={expenses} />
  </div>
</Layout>

  );
}

export default ExpenseTracker;
