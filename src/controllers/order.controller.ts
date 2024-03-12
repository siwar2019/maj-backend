import { Paths } from "../common/paths";
import { Request, Response } from "express";
import { Order } from "../models/order";
import {
  errorServerResponse,
  failResponse,
  getRandomInt,
  successResponse,
} from "../common/functions";
import { ApiOperationGet, ApiOperationPut, ApiPath } from "swagger-express-ts";
import { MSG } from "../common/responseMessages";
import {
  Orders,
  UpdateOrderStatus,
} from "../../swagger/modelsSwagger/orders.swagger";
import { Costumer } from "../models/customer";
import { orderVariant } from "../models/orderVariant";
import { Variant } from "../models/variant";
import { SubOption } from "../models/subOption";
import { Returns } from "../models/return";
@ApiPath({
  path: "",
  name: "Orders",
  security: { basicAuth: [] },
})
export class OrderController {
  /* swagger API GET  ALL CATEGORY */

  @ApiOperationGet({
    description: "get all orders",
    summary: "get all orders",
    path: Paths.GET_ALL_ORDERS,
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(Orders) },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  async getAllOrders(_req: Request, res: Response) {
    try {
      const listOrders = await Order.findAll({
        include: [
          {
            model: Costumer,
            as: "Costumer",
            attributes: ["firstName", "lastName"],
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      await Order.findAll({
        include: [
          {
            model: Costumer,
            as: "Costumer",
            attributes: ["firstName", "lastName"],
          },
        ],
      });
      return successResponse(res, listOrders);
    } catch (error) { }
  }

  /* swagger API update order status */
  @ApiOperationPut({
    description: "update order status",
    summary: "update order status",
    path: Paths.UPDATE_ORDER_STATUS,
    parameters: {
      body: {
        description: "update order status",
        required: true,
        model: "UpdateOrderStatus",
      },
    },
    responses: {
      200: {
        description: MSG.RESET_SUCCESSFUL,
        model: JSON.stringify(UpdateOrderStatus),
      },
      400: { description: `${MSG.USER_NOT_EXIST} || ${MSG.MISSING_DATA}` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { updatedStatus, orderId } = req.body;
      if (!updatedStatus) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      // Check if order  exist

      const orderExist = await Order.findOne({ where: { id: orderId } });
      if (!orderExist) {
        return failResponse(res, MSG.ORDER_NOT_FOUND);
      }
      //update order status
      const updateStatus = await orderExist.update(
        { status: updatedStatus },
        { where: { id: orderId } }
      );
      //exclude the indesired attributes
      const returnedData = updateStatus.toJSON();
      delete returnedData.createdAt;
      delete returnedData.updatedAt;
      return successResponse(res, { returnedData }, MSG.ORDER_STATUS_UPDATED);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  async createOrder(req: Request, res: Response) {
    try {
      const {
        totalPrice,
        quantity,
        shippingMethod,
        orderDate,
        discountAppliey,
        notes,
        costumerId,
      } = req.body;
      if (
        !totalPrice ||
        !quantity ||
        !shippingMethod ||
        !orderDate ||
        !discountAppliey ||
        !costumerId
      ) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const { variantId } = req.body;
      if (!variantId) {
        return failResponse(res, MSG.MISSING_VARIANT);
      }
      const checkVariantExist = await Variant.findByPk(variantId);
      if (!checkVariantExist) {
        return failResponse(res, MSG.VARIANTS_NOT_FOUND);
      }
      const createOrder = await Order.create({
        totalPrice: totalPrice,
        quantity: quantity,
        shippingMethod: shippingMethod,
        orderDate: orderDate,
        discountAppliey: discountAppliey,
        status: "Pending",
        notes: notes,
        ref: "maj_Order_" + getRandomInt(1, 1000),
        costumerId: costumerId,
      });
      const variantOrder = await orderVariant.create({
        orderId: createOrder.id,
        variantId: variantId,
      });
      //get sizeId and colorId from variant
      const variantData = await Variant.findAll({ where: { id: variantId } });

      const colorId = variantData.map((el) => el.dataValues.colorId);
      const sizeId = variantData.map((el) => el.dataValues.sizeId);

      const getColor = await SubOption.findAll({
        where: {
          id: colorId,
        },
        attributes: ["name"],
      });
      const getSize = await SubOption.findAll({
        where: {
          id: sizeId,
        },
        attributes: ["name"],
      });
      const orderResult = createOrder.toJSON();
      orderResult.variantOrder = variantOrder;
      orderResult.color = getColor;
      orderResult.size = getSize;
      return successResponse(res, [orderResult]);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  async getReturnedOrder(req: Request, res: Response) {
    try {
      const orderId = parseInt(req.query.orderId as string);
      if (!orderId) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const findOrder = await Order.findOne({ where: { id: orderId } });
      if (!findOrder) {
        return failResponse(res, MSG.ORDER_UNEXISTANT);
      }
      const returnedOrderId = await Returns.findOne({
        where: { orderId: orderId },
      });
      const orderDetails = await Order.findOne({
        where: { id: returnedOrderId?.dataValues.orderId },
      });
      //get orderVariant from variant
      const getVariantDetails = await orderVariant.findOne({
        where: { orderId: returnedOrderId?.dataValues.orderId },
      });
      if (!getVariantDetails) {
        return failResponse(res, MSG.MISSING_VARIANT);
      }
      const variantId = getVariantDetails?.dataValues.variantId;
      //get sizeId and colorId from variant
      const variantData = await Variant.findAll({ where: { id: variantId } });

      const colorId = variantData.map((el) => el.dataValues.colorId);
      const sizeId = variantData.map((el) => el.dataValues.sizeId);
      const imageVariant = variantData.map((el) => el.dataValues.image);
      const getColor = await SubOption.findAll({
        where: {
          id: colorId,
        },
        attributes: ["name"],
      });
      const getSize = await SubOption.findAll({
        where: {
          id: sizeId,
        },
        attributes: ["name"],
      });
      const result = [
        {
          orderDetails: orderDetails,
          color: getColor,
          size: getSize,
          imageVariant: imageVariant,
        },
      ];
      return successResponse(res, result);
    } catch (error) {
      console.log(
        "%corder.controller.ts line:245 error",
        "color: #007acc;",
        error
      );
      return errorServerResponse(res, error);
    }
  }
}
export default new OrderController();
