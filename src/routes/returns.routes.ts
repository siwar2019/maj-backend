import { Router } from 'express';
import authAdmin from '../middleware/authAdmin';
import ReturnsController from '../controllers/returns.controller';
import { Paths } from '../common/paths';

const returnsRoutes = Router();
returnsRoutes.get(
  Paths.GET_ALL_RETURNS,
  authAdmin,
  ReturnsController.getAllReturns
);
returnsRoutes.post(
  Paths.CREATE_NEW_RETURN,
  authAdmin,
  ReturnsController.createReturn
);
export default returnsRoutes;
