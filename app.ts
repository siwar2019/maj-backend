import express, {Application} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as swagger from 'swagger-express-ts';
import {sequelize} from './src/config/sequelize';
import * as http from 'http';
import costumerRoutes from './src/routes/customer.routes';
import adminRoutes from './src/routes/admin.routes';
import * as swaggerConfig from './swagger/swagger.json';
import categoryRoutes from './src/routes/category.routes';
import {createAdmin} from './src/config/adminService';
import productRoutes from './src/routes/product.routes';
import optionRoutes from './src/routes/option.routes';
import addressRoutes from './src/routes/customerAdress.routes';
import privilegeRoutes from './src/routes/privilege.routes'
import orderRoutes from './src/routes/order.routes';
import returnsRoutes from './src/routes/returns.routes';
import { createCategoryParentV2 } from './src/config/createCategoriesService';
dotenv.config();

const app: Application = express();

// Application's port
const port = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use(swagger.express(swaggerConfig));
app.use('/api-docs/swagger', express.static('swagger'));
app.use(
  '/api-docs/swagger/assets',
  express.static('node_modules/swagger-ui-dist')
);
//routes imports
app.use(costumerRoutes);
app.use(adminRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(optionRoutes);
app.use(addressRoutes);
app.use(privilegeRoutes) ;
app.use(orderRoutes);
app.use(returnsRoutes)

const connexion = (async () => {
  await sequelize.sync();
  http
    .createServer(app)
    .listen(port, () => console.info(`Server running on port ${port}`));
  await createAdmin();
  //create default categories if not exist
  await createCategoryParentV2() ;
})();
export {connexion};

