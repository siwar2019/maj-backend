import { Router } from 'express';
import { Paths } from '../common/paths';
import CustomerAdressController from '../controllers/customerAdress.controller';
import authAdmin from '../middleware/authAdmin';
const addressRoutes = Router();
addressRoutes.post(
  Paths.CREATE_CUSTOMER_ADRESS,authAdmin,
  CustomerAdressController.createAddress
);
addressRoutes.post(
    Paths.UPDATE_CUSTOMER_ADRESS,authAdmin,
    CustomerAdressController.updateAddress
  );
addressRoutes.put(
    Paths.DELETE_CUSTOMER_ADRESS,
    authAdmin,
    CustomerAdressController.deleteAddress
  );
  addressRoutes.get(
    Paths.GET_ALL_ADDRESS,authAdmin,
    CustomerAdressController.getAllAdressCustomer
  );
export default addressRoutes;
