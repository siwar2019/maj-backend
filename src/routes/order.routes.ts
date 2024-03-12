import { Router } from 'express';
import { Paths } from '../common/paths';
import authAdmin from '../middleware/authAdmin';
import auth from '../middleware/authCustomer';
import OrderController from '../controllers/order.controller';

const orderRoutes = Router();
orderRoutes.get(Paths.GET_ALL_ORDERS, authAdmin, OrderController.getAllOrders);
orderRoutes.put(Paths.UPDATE_ORDER_STATUS, authAdmin, OrderController.updateOrderStatus);
orderRoutes.post(Paths.CREATE_ORDER,auth , OrderController.createOrder);
orderRoutes.get(Paths.GET_RETURNED_ORDER, authAdmin, OrderController.getReturnedOrder);
export default orderRoutes;
