// backend\routes\expenseRoutes.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
  const { description, amount, date } = req.body;

  if (!description || !amount || !date) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const expense = new Expense({
      user: req.user._id,
      description,
      amount,
      date,
    });

    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update expense
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExpense) {
      return res.status(404).send({ message: 'Expense not found' });
    }
    res.send(updatedExpense);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// DELETE expense
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).send({ message: 'Expense not found' });
    }
    res.send({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


module.exports = router;
