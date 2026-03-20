const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);
router.get('/', admin, getAllOrders);
router.patch('/:id/status', admin, updateOrderStatus);

module.exports = router;
