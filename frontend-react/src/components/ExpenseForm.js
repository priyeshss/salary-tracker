// src/components/ExpenseForm.js
import React, { useState } from 'react';
import axios from '../api/axios';

function ExpenseForm({ onExpenseAdded }) {

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
  });

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await axios.post('/expenses', formData);
      setFormData({ description: '', amount: '', date: '' });
      onExpenseAdded(); // ✅ refresh the list
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
