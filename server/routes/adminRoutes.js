const express = require('express');
const router = express.Router();
const { getAnalytics, getAllUsers, updateUserRole, getVendors, updateVendorStatus } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);
router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserRole);
router.get('/vendors', getVendors);
router.put('/vendors/:id', updateVendorStatus);

module.exports = router;
