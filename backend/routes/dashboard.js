// dashboard.js
const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('Dashboard route');
});

module.exports = router;
