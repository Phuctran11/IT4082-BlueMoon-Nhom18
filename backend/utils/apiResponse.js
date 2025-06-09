const express = require('express');
const router = express.Router();

const householdRoutes = require('./householdRoutes');
const residentRoutes = require('./residentRoutes');
const { authMiddleware, roleMiddleware } = require('../middleware');


router.use('/households', householdRoutes);
router.use('/residents', residentRoutes);


module.exports = router;
