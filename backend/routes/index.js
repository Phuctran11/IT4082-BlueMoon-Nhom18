const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
// const userRoutes = require('./userRoutes');
// Import các file route khác...
// const financeRoutes = require('./financeRoutes');
// const householdRoutes = require('./householdRoutes');

router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// ...

module.exports = router;