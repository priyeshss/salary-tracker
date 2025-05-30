// src\components\ExpenseList.js
import React, { useEffect, useState } from 'react';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter states
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Edit states
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ description: '', amount: '', date: '' });

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Filter expenses by date range
  const filteredExpenses = expenses.filter(exp => {
    if (!fromDate && !toDate) return true;

    const expDate = new Date(exp.date).toISOString().split('T')[0]; // YYYY-MM-DD format

    if (fromDate && expDate < fromDate) return false;
    if (toDate && expDate > toDate) return false;

    return true;
  });

  // Calculate total for filtered expenses
  useEffect(() => {
    const sum = filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    setTotal(sum);
    setCurrentPage(1); // reset to page 1 on filter change
  }, [filteredExpenses]);

  // Pagination logic on filtered expenses
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setExpenses(expenses.filter(exp => exp._id !== id));
      } else {
        alert('Failed to delete expense');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete expense');
    }
  };

  // Start editing an expense
  const startEdit = (exp) => {
    setEditId(exp._id);
    setEditData({
      description: exp.description,
      amount: exp.amount,
      date: new Date(exp.date).toISOString().split('T')[0], // yyyy-mm-dd for input[type=date]
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setEditData({ description: '', amount: '', date: '' });
  };

  // Save edited expense
  const saveEdit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        // Update state locally
        setExpenses(expenses.map(exp => {
          if (exp._id === id) {
            return { ...exp, ...editData };
          }
          return exp;
        }));
        cancelEdit();
      } else {
        alert('Failed to update expense');
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update expense');
    }
  };

  return (
    <div>
      <h3>Total Spent: ₹{total}</h3>

      {/* Date Filters */}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          From:{' '}
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </label>{' '}
        <label>
          To:{' '}
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </label>
      </div>

      {/* Expenses Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc' }}>
            <th>Description</th>
            <th>Amount (₹)</th>
            <th>Date</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentExpenses.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                No expenses found.
              </td>
            </tr>
          ) : (
            currentExpenses.map(exp => (
              <tr key={exp._id} style={{ borderBottom: '1px solid #eee', textAlign: 'center', padding: '1rem' }}>
                {editId === exp._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editData.description}
                        onChange={e => setEditData({ ...editData, description: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editData.amount}
                        onChange={e => setEditData({ ...editData, amount: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={editData.date}
                        onChange={e => setEditData({ ...editData, date: e.target.value })}
                      />
                    </td>
                    <td>
                      <button onClick={() => saveEdit(exp._id)}>Save</button>{' '}
                      <button onClick={cancelEdit}>Cancel</button>
                    </td>
                    <td>
                      {/* Disable delete during edit */}
                      <button disabled>Delete</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{exp.description}</td>
                    <td>{Number(exp.amount)}</td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => startEdit(exp)}>Edit</button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(exp._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>{' '}
        Page {currentPage} of {totalPages}{' '}
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default ExpenseList;
