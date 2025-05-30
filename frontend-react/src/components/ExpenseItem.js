import React from 'react';

function ExpenseItem({ expense }) {
  const formattedDate = new Date(expense.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <li style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
      <strong>{expense.description}</strong> — ₹{expense.amount} on {formattedDate}
    </li>
  );
}

export default ExpenseItem;
