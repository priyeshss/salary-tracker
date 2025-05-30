// src\components\Expenses.js
import React, { useEffect, useState } from 'react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token'); // Store token after login

    const fetchExpenses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/expenses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch expenses');
        }

        const data = await res.json();
        setExpenses(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div>
      <h2>Your Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <ul>
          {expenses.map(expense => (
            <li key={expense._id}>
              {expense.date.substring(0, 10)} — {expense.description}: ₹{expense.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Expenses;
