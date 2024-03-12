import * as dotenv from 'dotenv'
dotenv.config()

export default {
  HOST: process.env.API_DB_HOST,
  USER: process.env.API_DB_USER || 'root',
  PASSWORD: process.env.API_DB_PWD,
  DB: process.env.API_DB_DB,
  PORT: process.env.API_DB_PORT as any,
  dialect: 'mysql',
  connectionLimit: 100,
  pool: {
    max: 10000000,
    min: 0,
    idle: 20000,
    acquire: 1000000,
  },
}
