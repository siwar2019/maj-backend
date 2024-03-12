import { Request, Response } from "express";

import { Returns } from "../models/return";
import {
  errorServerResponse,
  failResponse,
  successResponse,
} from "../common/functions";
import { Costumer } from "../models/customer";
import { Order } from "../models/order";
import { MSG } from "../common/responseMessages";

export class ReturnsController {
  async getAllReturns(_req: Request, res: Response) {
    try {
      const detailsReturns = await Returns.findAll({
        include: [
          {
            model: Costumer,
            as: "Costumer",
          },
          {
            model: Order,
            as: "Order",
          },
        ],
      });

      return successResponse(res, detailsReturns);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  async createReturn(req: Request, res: Response) {
    try {
      const { raison, costumerId, orderId } = req.body;
      if (!raison || !costumerId || !orderId) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      //check if order  exist in the list of orders
      const checkExistantOrder = await Order.findByPk(orderId);
      //check if customer  exist in the list of customers

      const checkCostumer = await Costumer.findByPk(costumerId);
      if (!checkExistantOrder) {
        return failResponse(res, MSG.ORDER_UNEXISTANT);
      }
      if (!checkCostumer) {
        return failResponse(res, MSG.CUSTOMER_NOT_FOUND);
      }
      //get listOrders
      const listOrders = await Returns.findOne({ where: { orderId: orderId } });
      // check if an order already has a return
      if (!listOrders) {
        const newReturn = await Returns.create({
          raison: raison,
          costumerId: costumerId,
          orderId: orderId,
        });
        return successResponse(res, [newReturn], MSG.RETURN_CEATED);
      }
      return failResponse(res, MSG.ORDER_EXISTANT);
    } catch (error) {
      return failResponse(res, MSG.SERVER_ERROR);
    }
  }
}
export default new ReturnsController();
