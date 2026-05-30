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
import auth from '../controllers/authController.js';
//====================================================================================================
// Order Routes
//====================================================================================================
const router = Router();

// If missing → auth middleware returns 401 before controller runs
router.use(auth);
// /api/orders
router.post('/',   createOrder);  // POST   — create new order
router.get('/',    getOrders);    // GET    — get all orders for user

// /api/orders/:id
router.get('/:id',    getOrderById); // GET    — get specific order
router.patch('/:id',  updateOrder);  // PATCH  — update order
router.delete('/:id', deleteOrder);  // DELETE — delete order

export default router;