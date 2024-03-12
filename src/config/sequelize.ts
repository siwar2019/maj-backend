import { Sequelize } from 'sequelize-typescript'
import dbConfig from './db.config'
import { Dialect } from 'sequelize/types'
import { Costumer } from '../models/customer'
import { Order } from '../models/order'
import { Packaging } from '../models/packaging'
import { Admin } from '../models/admin'
import { Privilege } from '../models/privilege'
import { Variant } from '../models/variant'
import { Reviews } from '../models/reviews'
import { SubOption } from '../models/subOption'
import { Option } from '../models/option'
import { Promotion } from '../models/promotion'
import { Income } from '../models/income'
import { Category } from '../models/category'
import { orderPackaging } from '../models/orderPackaging'
import { orderVariant } from '../models/orderVariant'
import { productCategory } from '../models/productCategory'
import { Product } from '../models/product'
import { productPromotion } from '../models/productPromotion'
import { variantSubOption } from '../models/variantSubOption'
import { Access } from '../models/access'
import { Menu } from '../models/menu'
import { Transactions } from '../models/transaction'
import { Adress } from '../models/address'
import { Returns } from '../models/return'

export const sequelize = new Sequelize(
  dbConfig.DB as string,
  dbConfig.USER as string,
  dbConfig.PASSWORD,
  {
    dialect: dbConfig.dialect as Dialect,
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
    models: [
      Costumer,
      Order,
      Packaging,
      Admin,
      Privilege,
      Variant,
      Reviews,
      SubOption,
      Option,
      Promotion,
      Income,
      Category,
      orderPackaging,
      Product,
      orderVariant,
      productCategory,
      productPromotion,
      variantSubOption,
      Access,
      Menu,
      Transactions,
      Adress,
      Returns
    ],
    logging: false,
  }
)
