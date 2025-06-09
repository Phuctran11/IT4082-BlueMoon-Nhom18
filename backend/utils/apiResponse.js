const express = require('express');
const router = express.Router();

const householdRoutes = require('./householdRoutes');


router.use('/households', householdRoutes);



module.exports = router;
