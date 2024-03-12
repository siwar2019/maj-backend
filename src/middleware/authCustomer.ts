import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Costumer } from '../models/customer';
import * as dotenv from 'dotenv';
import { unauthorizedResponse } from '../common/functions';
import { MSG } from '../common/responseMessages';

dotenv.config();
const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader === 'undefined') throw new Error('No token');
    const token = authHeader.split(' ')[1];
    if (!token) throw new Error('No token');
    const payload = verify(
      token,
      process.env.JWT_SECRET as string
    ) as unknown as {
      id: number;
      iat: number;
      exp: number;
    };
    if (!payload) {
      return unauthorizedResponse(res, MSG.UNAUTHORIZED_USER);
    }
    const currentUser = await Costumer.findOne({
      where: { id: payload.id },
    });
    res.locals.currentUser = currentUser;
    const isCustomer = await Costumer.findOne({
      where: { email: currentUser?.email, password: currentUser?.password },
    });
    if (isCustomer) {
      next();
    }
  } catch (error) {
    return unauthorizedResponse(res, MSG.INVALID_API_KEY);
  }
};

export default auth;
