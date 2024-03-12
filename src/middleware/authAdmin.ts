import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
const jwt = require('jsonwebtoken');
import { Admin } from '../models/admin';
import * as dotenv from 'dotenv';
import { unauthorizedResponse } from '../common/functions';
import { MSG } from '../common/responseMessages';

dotenv.config();
const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //authHeader holds the JWT token
    const authHeader = req.headers.authorization;
    //check if authHeader is not present or is equal to  "undefined
    if (!authHeader || authHeader === 'undefined') throw new Error('No token');
    //retrieves the second element of the array
    const token = authHeader.split(' ')[1];
    // If the token is not present, it throws an error with the message "No token"
    if (!token) throw new Error('No token');
    //decode and verify the token then assign result to payload variable
    //decode token without secret key
    const payload=jwt.decode(token)
    // if token verification failed or the payload is missing
    if (!payload) {
      return unauthorizedResponse(res, MSG.UNAUTHORIZED_USER);
    }
    //define res.locals
   const admin= await Admin.findOne() ;
   res.locals.currentUser = { id: admin?.dataValues.id };
   res.locals.currentPassword={password:admin?.dataValues.password}
   res.locals.access_token={access_token:authHeader}
   res.locals.password= {password:admin?.dataValues.password}
    next();
  } catch (error) {
    return unauthorizedResponse(res, MSG.INVALID_API_KEY);
  }
};

export default authAdmin;
