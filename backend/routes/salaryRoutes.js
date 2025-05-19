// backend/routes/salaryRoutes.js
const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const Expense = require('../models/Expense'); 
const authMiddleware = require('../middleware/authMiddleware'); // Assuming this exists
const mongoose = require('mongoose');

// Get all salaries for the logged in user
router.get('/', authMiddleware, async (req, res) => {
    try {
      const salaries = await Salary.find({ user: req.user.id }).sort({ salary_month: -1 });
      res.json(salaries);
    } catch (err) {
      console.error('Error in GET /api/salary:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

router.post('/', authMiddleware, async (req, res) => {
    try {
      const { amount, month, description } = req.body;
  
      if (!amount || !month) {
        return res.status(400).json({ error: 'Amount and month are required' });
      }
  
      const salary = new Salary({
        user: req.user.id,
        salary_amount: amount,
        salary_month: new Date(month + '-01'),
        description: description || ''
      });
  
      await salary.save();
      res.status(201).json({ message: 'Salary added successfully', salary });
    } catch (err) {
      console.error('Error in POST /api/salary:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

  
  // Delete a salary by id
  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user.id);
      const deleted = await Salary.findOneAndDelete({ _id: req.params.id, user: userId });
  
      if (!deleted) return res.status(404).json({ error: 'Salary not found' });
  
      res.json({ message: 'Salary deleted' });
    } catch (err) {
      console.error('Error in DELETE /api/salary/:id:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
  // Update a salary by id
  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const { amount, month, description } = req.body;
      const salary = await Salary.findOne({ _id: req.params.id, user: req.user.id });
      if (!salary) return res.status(404).json({ error: 'Salary not found' });
  
      salary.salary_amount = amount || salary.salary_amount;
      salary.salary_month = month ? new Date(month + '-01') : salary.salary_month;
      salary.description = description || salary.description;
  
      await salary.save();
      res.json({ message: 'Salary updated' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  router.get('/summary', authMiddleware, async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user.id); // ✅ Fix applied
  
      const salaryAgg = await Salary.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, totalSalary: { $sum: "$salary_amount" } } }
      ]);
  
      const expenseAgg = await Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
      ]);
  
      const totalSalary = salaryAgg[0]?.totalSalary || 0;
      const totalExpense = expenseAgg[0]?.totalExpense || 0;
      const balance = totalSalary - totalExpense;
  
      res.json({ totalSalary, totalExpense, balance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

module.exports = router;
