import { Router } from 'express';
import { Paths } from '../common/paths';
import productController from '../controllers/product.controller';
import { uploadImages, uploadImagesV2 } from '../middleware/multer';
import authAdmin from '../middleware/authAdmin';
import {  uploadFilesMiddleware } from '../middleware/uploadFile';
const productRoutes = Router();
productRoutes.post(
  Paths.CREATE_PRODUCT_VARIANTS,
  authAdmin,
  uploadImages,
  productController.addProductVariants
);
//create product v2 ERP
productRoutes.post(
  Paths.CREATE_PRODUCT,
  authAdmin,
  //uploadImages,
  //uploadFilesMiddleware
  uploadImagesV2,
  
  productController.addProductV2
);
productRoutes.put(
  Paths.ADD_PRODUCT_VARIANTS,
  authAdmin,
  uploadImages,
  productController.addNewVaraiant
);
productRoutes.put(
  Paths.DELETE_PRODUCT_VARIANT,
  authAdmin,
  productController.deleteVariant
);
productRoutes.put(
  Paths.UPDATE_PRODUCT_VARIANTS,
  authAdmin,
  uploadImages,
  productController.updateProductVariants
);

productRoutes.put(
  Paths.UPDATE_PRODUCT,
  authAdmin,
  productController.updateProduct
);
productRoutes.post(
  Paths.DELETE_PRODUCT,
  authAdmin,
  productController.deleteProduct
);
productRoutes.get(
  Paths.GET_PRODUCT_WITH_VARIANTS,
  authAdmin,
  productController.getProductWithVariants
);
productRoutes.get(
  Paths.GET_ALL_VARIANT_BY_PRODUCT,
  authAdmin,
  productController.getAllVariantByProduct
);
productRoutes.post(
  Paths.GET_ALL_PRODUCT_BY_CATEGORIE,
  authAdmin,
  productController.GetAllProductByCategory
);
productRoutes.put(
  Paths.UPDATE_PRODUCT_Categries,
  authAdmin,
  productController.UpdateProductCategories
);
productRoutes.get(
  Paths.GET_ALL_PRODUCT,
  authAdmin,
  productController.GetAllProductsV2
);

productRoutes.get(Paths.GET_ALL_PRODUCTS, productController.GetAllProductByCategorieV2)
productRoutes.get(Paths.GET_PRODUCT_DEATAILS_BY_ID, productController.GetProductDetailsById)


export default productRoutes;
