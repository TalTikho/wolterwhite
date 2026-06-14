// routes/orderRoutes.js
//====================================================================================================
// Imports
//====================================================================================================
import { Router } from 'express';
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} from '../controllers/orderController.js';
import { isLoggedIn } from '../middleware/validationMiddleware.js';
// import { login } from '../controllers/authController.js';
//====================================================================================================
// Order Routes
//====================================================================================================
const router = Router();

// If missing → auth middleware returns 401 before controller runs
// router.use(login);
// /api/orders
router.post('/',   isLoggedIn, createOrder);  // POST   — create new order
router.get('/',    isLoggedIn, getOrders);    // GET    — get all orders for user

// /api/orders/:id
router.get('/:id',    isLoggedIn, getOrderById); // GET    — get specific order
router.patch('/:id',  isLoggedIn, updateOrder);  // PATCH  — update order
router.delete('/:id', isLoggedIn, deleteOrder);  // DELETE — delete order

export default router;