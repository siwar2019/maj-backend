import { Router } from 'express';
import { Paths } from '../common/paths';
import CategoryController from '../controllers/category.controller';
import authAdmin from '../middleware/authAdmin';
import auth from '../middleware/authCustomer';
const categoryRoutes = Router();
categoryRoutes.post(
  Paths.ADD_CATEGORY_SUBCATEGORY,
  authAdmin,
  CategoryController.addCategoryV2
);
categoryRoutes.put(
  Paths.UPDATE_CATEGORY_SUBCATEGORY,
  authAdmin,

  CategoryController.updateCategoryV2
);
categoryRoutes.get(
  Paths.GET_ALL_CATEGORY,authAdmin,
  CategoryController.getAllCategoryV2
);
categoryRoutes.put(
  Paths.DELETE_CATEGORY,
  authAdmin,
  CategoryController.deleteCategoryV2
);

export default categoryRoutes;
