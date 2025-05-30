// src/pages/AddSalary.js
import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function AddSalary() {
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const salaryData = { amount, month, description };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/salary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(salaryData),
      });

      if (response.ok) {
        alert('Salary added successfully!');
        setAmount('');
        setMonth('');
        setDescription('');
      } else {
        alert('Failed to add salary.');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <Layout>
      <h2>Add Salary</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Month:</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 20px' }}>Add Salary</button>
      </form>
    </Layout>
  );
}
