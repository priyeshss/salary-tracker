// src/pages/SalaryTracker.js
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function SalaryTracker() {
  const [salaries, setSalaries] = useState([]);
  const [totalSummary, setTotalSummary] = useState({ totalSalary: 0, totalExpense: 0, balance: 0 });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ amount: '', month: '', description: '' });

  const token = localStorage.getItem('token');

  const fetchSalaries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/salary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSalaries(data);
    } catch (err) {
      alert('Error fetching salaries');
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/salary/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTotalSummary(data);
    } catch (err) {
      alert('Error fetching summary');
    }
  };

  useEffect(() => {
    fetchSalaries();
    fetchSummary();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/salary/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('Deleted successfully');
        fetchSalaries();
        fetchSummary();
      }
    } catch {
      alert('Failed to delete');
    }
  };

  const handleEdit = (salary) => {
    setEditId(salary._id);
    setEditData({
      amount: salary.salary_amount,
      month: new Date(salary.salary_month).toISOString().slice(0, 7),
      description: salary.description || '',
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData({ amount: '', month: '', description: '' });
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/salary/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        alert('Updated successfully');
        setEditId(null);
        fetchSalaries();
        fetchSummary();
      } else {
        alert('Update failed');
      }
    } catch {
      alert('Update failed');
    }
  };

  return (
    <Layout>
      <div>
        <h2>Salary Records</h2>
        <table border="1" cellPadding="5" style={{ width: '100%', marginBottom: '30px' }}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary) => (
              <tr key={salary._id}>
                {editId === salary._id ? (
                  <>
                    <td>
                      <input
                        type="month"
                        value={editData.month}
                        onChange={(e) => setEditData({ ...editData, month: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSave(salary._id)}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      {new Date(salary.salary_month).toLocaleDateString('default', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </td>
                    <td>{salary.salary_amount}</td>
                    <td>{salary.description}</td>
                    <td>
                      <button onClick={() => handleEdit(salary)}>Edit</button>
                      <button onClick={() => handleDelete(salary._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <h3>Total Summary</h3>
          <p><strong>Total Salary:</strong> {totalSummary.totalSalary}</p>
          <p><strong>Total Expense:</strong> {totalSummary.totalExpense}</p>
          <p><strong>Balance (Salary - Expense):</strong> {totalSummary.balance}</p>
        </div>
      </div>
    </Layout>
  );
}
