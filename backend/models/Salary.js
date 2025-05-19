const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  salary_amount: { type: Number, required: true },
  salary_month: { type: Date, required: true }, // Store first day of month e.g. "2024-08-01"
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);


// backend\models\Salary.js
// const mongoose = require('mongoose');
// const salarySchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     amount: { type: Number, required: true },
//     month: { type: String, required: true }, // or Date, depending on usage
//     description: { type: String }
//   });

// module.exports = mongoose.model('Salary', salarySchema);
