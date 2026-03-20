const express = require('express');
const router = express.Router();
const { registerVendor, getMyVendorProfile, updateVendorProfile } = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/register', registerVendor);
router.get('/profile', getMyVendorProfile);
router.put('/profile', updateVendorProfile);

module.exports = router;
