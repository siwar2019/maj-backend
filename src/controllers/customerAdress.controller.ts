import { Request, Response } from "express";
import { MSG } from "../common/responseMessages";
import {
  errorServerResponse,
  failResponse,
  successResponse,
} from "../common/functions";

import { Paths } from "../common/paths";
import { Adress } from "../models/address";
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
} from "swagger-express-ts";
import * as dotenv from "dotenv";

import {
  DeleteCustomerAdress,
  UpdateCustomerAdress,
  createAddress,
  getAllAdress,
} from "../../swagger/modelsSwagger/addressCustomer.swagger";
dotenv.config();
@ApiPath({
  path: "",
  name: "Customer address",
  security: { basicAuth: [] },
})
export class CustomerAdressController {
  public static TARGET_NAME: string = "custumerAdressController";

  // swagger create address
  @ApiOperationPost({
    description: "create address",
    path: Paths.CREATE_CUSTOMER_ADRESS,
    summary: "create address",
    parameters: {
      body: {
        description: "create address od customer",
        required: true,
        model: "createAddress",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(createAddress),
      },
      400: {
        description: ` ${MSG.MISSING_DATA}  `,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //API create address
  async createAddress(req: Request, res: Response) {
    const currentUser = res.locals.currentUser;

    try {
      //get customer
      const {
        address,
        firstName,
        lastname,
        telephone,
        additionalInformation,
        city,
        state,
        postalCode,
      } = req.body;
      if (
        !address ||
        !firstName ||
        !lastname ||
        !telephone ||
        !city ||
        !state ||
        !postalCode
      ) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const customerAdress = await Adress.create({
        address: address,
        firstName: firstName,
        lastname: lastname,
        telephone: telephone,
        city: city,
        state: state,
        postalCode: postalCode,
        additionalInformation: additionalInformation,
        customerId: currentUser.id,
      });
      //exclude the indesired attributes
      const returnedData = customerAdress.toJSON();
      delete returnedData.createdAt;
      delete returnedData.updatedAt;
      return successResponse(res, returnedData);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  /* swaggerUPDATE CUSTOMER ADDRESS  */
  @ApiOperationPost({
    description: "update customer address",
    path: Paths.UPDATE_CUSTOMER_ADRESS,

    summary: "update customer address",
    parameters: {
      body: {
        description: "update customer address",
        required: true,
        model: "UpdateCustomerAdress",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(UpdateCustomerAdress),
      },
      400: { description: `${MSG.MISSING_DATA} || ${MSG.NOT_FOUND}` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //API UPDATE CUSTOMER ADDRESS
  async updateAddress(req: Request, res: Response) {
    const currentUser = res.locals.currentUser;
    try {
      const {
        adressId,
        firstName,
        lastName,
        telephone,
        address,
        city,
        state,
        postalCode,
        additionalInformation,
      } = req.body;
      if (
        !adressId ||
        !firstName ||
        !lastName ||
        !telephone ||
        !address ||
        !city ||
        !state ||
        !postalCode
      ) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const existingAdress = await Adress.findOne({ where: { id: adressId } });
      if (!existingAdress) {
        return failResponse(res, MSG.ADRESS_NOT_FOUND);
      }
      //update address
      await Adress.update(
        {
          address: address,
          firstName: firstName,
          lastName: lastName,
          telephone: telephone,
          city: city,
          state: state,
          postalCode: postalCode,
          additionalInformation: additionalInformation,
        },
        {
          where: {
            id: adressId,
            customerId: currentUser.id,
          },
        }
      );
      return successResponse(res, req.body);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  //swagger delete customer address
  @ApiOperationPut({
    description: "delete customer address",
    summary: "delete customer address",
    path: Paths.DELETE_CUSTOMER_ADRESS,

    parameters: {
      body: {
        description: "delete adress of customer",
        required: true,
        model: "DeleteCustomerAdress",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(DeleteCustomerAdress),
      },
      400: { description: `${MSG.NOT_FOUND} ||${MSG.MISSING_DATA} ` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //Delete customer address
  async deleteAddress(req: Request, res: Response) {
    try {
      //get customer address's id
      const { id } = req.body;
      if (!id) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      //check if exist
      const adress: Adress | null = await Adress.findByPk(id);
      if (!adress) {
        return failResponse(res, MSG.NOT_FOUND);
      }
      //delete adress
      Adress.destroy({ where: { id: adress.id } })
        .then(() => {
          return successResponse(res, [], MSG.DELETED_SUCCUSSFULLY);
        })
        .catch((error) => {
          return errorServerResponse(res, error);
        });
    } catch (error) {
      errorServerResponse(res, error);
    }
  }
  /* swagger API get all customer address*/

  @ApiOperationGet({
    description: "get all address",
    summary: "get all address",
    path: Paths.GET_ALL_ADDRESS,
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(getAllAdress) },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //api get all customer address
  async getAllAdressCustomer(_req: Request, res: Response) {
    const currentUser = res.locals.currentUser;
    try {
      //get list of address and
      //omit fields from returned object

      const allAdress = await Adress.findAll({
        where: { customerId: currentUser.id },
        attributes: {
          exclude: ["deletedAt", "createdAt", "updatedAt", "id", "customerId"],
        },
      });

      return successResponse(res, allAdress);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
}
export default new CustomerAdressController();
