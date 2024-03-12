import { Request, Response, response } from "express";
import { MSG } from "../common/responseMessages";

import {
  errorServerResponse,
  failResponse,
  successResponse,
} from "../common/functions";

import { Paths } from "../common/paths";
import * as dotenv from "dotenv";
import { Option } from "../models/option";
import { SubOption } from "../models/subOption";
import { sequelize } from "../config/sequelize";
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
} from "swagger-express-ts";
import {
  DeleteOptionSubOption,
  DeleteSubOption,
  OptionSubOption,
  SubOptions,
  UpdateSubOption,
} from "../../swagger/modelsSwagger/optionSubOption.swagger";
import { Op } from "sequelize";
import axios from "axios";
import { ListItem } from "../interfaces/options";
import { createOptionsServiceV2 } from "../config/createOptionsService";
dotenv.config();
@ApiPath({
  path: "",
  name: "Option",
  security: { basicAuth: [] },
})
export class OptionsController {
  //swagger api create option/subOption
  public static TARGET_NAME: string = "AddOptionSubOption";
  @ApiOperationPost({
    description: "add new option and its suboptions",
    summary: "add new option and its suboptions",
    path: Paths.CREATE_OPTIONS_SUBOPTIONS,

    parameters: {
      body: {
        description: "add new option and its suboptions",
        required: true,
        model: "OptionSubOption",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(OptionSubOption) },
      400: {
        description: `${MSG.MISSING_DATA} || ${MSG.EXISTANT_OPTION} || ${MSG.SUBOPTION_MISSING} `,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //API CREATE OPTIONS/SUBOPTIONS
  async createOptionsSubOptions(req: Request, res: Response) {
    //get option/ sub-option attributes
    const { name, description, subOptionList } = req.body;

    const t = await sequelize.transaction();
    //if option attributes are missing
    try {
      if (!name || !subOptionList) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      //check if there is an option with same name as option created
      const existantOption = await Option.findOne({ where: { name: name } });
      if (existantOption) {
        return failResponse(res, MSG.EXISTANT_OPTION);
      }
      //create option
      const createOption = await Option.create(
        {
          name: name,
          description: description,
        },
        { transaction: t }
      );
      //exclude the indesired attributes
      const returnedData = createOption.toJSON();
      delete returnedData.createdAt;
      delete returnedData.updatedAt;
      //check if sub-option attributes are missing
      for (const item of subOptionList) {
        if (!item.name || !item.description) {
          return failResponse(res, MSG.SUBOPTION_MISSING);
        }
      }
      //create suboption for the created option
      const subOptionPromise = subOptionList.map((item: SubOption) => {
        SubOption.create(
          {
            name: item.name,
            description: item.description,
            OptionId: createOption?.dataValues.id,
          }
          // { transaction: t }
        );
      });
      await Promise.all(subOptionPromise);
      //commit the  changes
      await t.commit();
      return successResponse(
        res,
        { returnedData, subOptionList },
        MSG.OPTION_CEATED
      );
    } catch (error) {
      console.log("rollback", error);
      //If the execution reaches this line, an error was thrown
      // We rollback the transaction.
      await t.rollback();

      return errorServerResponse(res, error);
    }
  }
  //SWAGGER DELETE subOption
  @ApiOperationPost({
    description: "delete subOption",
    summary: "delete subOption",
    path: Paths.DELETE_SUBOPTION,

    parameters: {
      body: {
        description: "delete specific subOption",
        required: true,
        model: "DeleteSubOption",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(DeleteSubOption) },
      400: { description: `${MSG.NOT_FOUND} ||${MSG.MISSING_DATA} ` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //api delete suboption
  async deleteSubOption(req: Request, res: Response) {
    try {
      const { id } = req.body;
      if (!id) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const existingSubOption = await SubOption.findOne({ where: { id } });
      if (!existingSubOption) {
        return failResponse(res, MSG.NOT_FOUND);
      }
      await SubOption.destroy({ where: { id } });
      return successResponse(res, [existingSubOption], MSG.SUBOPTION_DELETED);
    } catch (error) {
      console.log(error);
      return errorServerResponse(res, error);
    }
  }
  async deleteSubOptionV2(req: Request, res: Response) {
    const uuid = req.body.uuid;
    const token=res.locals.access_token
    const apiDeleteSubOption = `${process.env.ERP_URL}${Paths.DELETE_SUBOPTIONS}${uuid}`;
    axios
      .delete(apiDeleteSubOption, {headers: {Authorization: token.access_token}})
      .then((response) => {
        return successResponse(res, response.data);
      })
      .catch((error) => {
        console.log("error", error);
        return failResponse(res, "error deleting");
      });
  }
  //swagger API ADD SUBOPTIONS
  @ApiOperationPost({
    description: "add  suboptions to a specific option",
    summary: "add  suboptions to a specific option",
    path: Paths.ADD_SUB_OPTIONS,

    parameters: {
      body: {
        description: "add  suboptions",
        required: true,
        model: "SubOptions",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(SubOptions) },
      400: {
        description: `${MSG.MISSING_DATA} || ${MSG.NOT_FOUND}  `,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //Api add subOptions
  async createSubOptions(req: Request, res: Response) {
    try {
      //id of option
      const { id } = req.body;
      const { addSubOptions } = req.body;
      if (!id) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const findOption = await Option.findByPk(id);
      if (!findOption) {
        return failResponse(res, MSG.NOT_FOUND);
      }

      for (const items of addSubOptions) {
        if (!items.name) return failResponse(res, MSG.MISSING_DATA);
      }
      const subOptionPromises = addSubOptions.map(
        async (items: SubOption, index: number) => {
          const createdSubOption = await SubOption.create({
            name: items.name,
            description: items.description,
            OptionId: id,
          });
          addSubOptions[index].id = createdSubOption.id;
        }
      );
      await Promise.all(subOptionPromises);
      return successResponse(res, { id, addSubOptions }, MSG.SUBOPTION_CREATED);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  async createSubOptionsV2(req: Request, res: Response) {
    const { uuid, code, name } = req.body;
    const token = res.locals.access_token;
    if (!uuid || !code || !name) {
      return failResponse(res, MSG.MISSING_DATA);
    }

    const apiCreateSubOption = `${process.env.ERP_URL}${Paths.CREATE_SUB_OPTION}`;
    const data = {
      code: code,
      name: name,
      productOptions: {
        uuid: uuid,
      },
    };

    axios
      .post(apiCreateSubOption, data, {
        headers: {
          Authorization: token.access_token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return successResponse(res, response.data, MSG.SUBOPTION_CREATED);
      })
      .catch((error) => {
        console.log("error", error);
        return failResponse(res, error);
      });
  }
  //swagger delete option suboption
  @ApiOperationPost({
    description: "delete option/subOption",
    summary: "delete option/subOption",
    path: Paths.DELETE_OPTION_SUBOPTION,

    parameters: {
      body: {
        description: "delete option and its subOption",
        required: true,
        model: "DeleteOptionSubOption",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(DeleteOptionSubOption),
      },
      400: { description: `${MSG.MISSING_DATA} || ${MSG.SUBOPTION_MISSING} ` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //api delete option
  async deleteOption(req: Request, res: Response) {
    try {
      const { idOption } = req.body;
      //if id attribute is missing
      if (!idOption) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      //find the specific option
      const existingOption = await Option.findOne({ where: { id: idOption } });
      //if not exist
      if (!existingOption) {
        return failResponse(res, MSG.NOT_FOUND);
      }
      //soft delete the options

      await Option.destroy({
        where: { id: idOption },
      });
      //soft delete the related sub options

      await SubOption.destroy({
        where: { OptionId: idOption },
      });

      return successResponse(res, [], MSG.DELETED_SUCCUSSFULLY);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  async deleteOptionV2(req: Request, res: Response) {
    const { idOption } = req.body;
    const deleteUrl =  `${process.env.ERP_URL}${Paths.REMOVE_OPTION}${idOption}`
    axios
      .delete(deleteUrl)
      .then((response: { data: any }) => {
        console.log("create default options:", response.data);
      })
      .catch((error: any) => {
        console.error(`Error creating default options for item `, error);
      });
  }

  //swagger update suboption
  @ApiOperationPut({
    description: "update subOption",
    summary: "update subOption",
    path: Paths.UPDATE_SUBOPTION,

    parameters: {
      body: {
        description: "update  subOption",
        required: true,
        model: "UpdateSubOption",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(UpdateSubOption),
      },
      400: { description: `${MSG.MISSING_DATA} || ${MSG.NOT_FOUND} ` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //API UPDATE SUBOPTION
  async updatesSubOptions(req: Request, res: Response) {
    try {
      //check existing attributes

      const { id, name, description } = req.body;
      if (!id || !name || !description) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      //retreive the desired subOption
      const subOption = await SubOption.findOne({ where: { id } });
      if (!subOption) {
        return failResponse(res, MSG.NOT_FOUND);
      }
      //update suboption fileds
      const updated = await subOption.update({
        name: name,
        description: description,
      });
      // Omit fields from returned object

      const returnedData = updated?.toJSON();
      delete returnedData?.deletedAt;
      delete returnedData?.createdAt;
      delete returnedData?.updatedAt;

      delete returnedData?.OptionId;
      return successResponse(res, returnedData, MSG.SUBOPTION_UPDATED);
    } catch (error) {
      errorServerResponse(res, error);
    }
  }
  //swagger update option
  @ApiOperationPut({
    description: "update Option",
    summary: "update Option",
    path: Paths.UPDATE_OPTION,

    parameters: {
      body: {
        description: "update  Option",
        required: true,
        model: "UpdateSubOption",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(UpdateSubOption),
      },
      400: { description: `${MSG.MISSING_DATA} || ${MSG.NOT_FOUND} ` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //API UPDATE SUBOPTION
  async updateOptions(req: Request, res: Response) {
    try {
      const { id, name, description } = req.body;
      //check existing attributes
      if (!id || !name || !description) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      //find the specific option
      const option = await Option.findOne({ where: { id } });
      if (!option) {
        return failResponse(res, MSG.NOT_FOUND);
      }
      //update option
      const updated = await option.update({
        name: name,
        description: description,
      });
      // Omit fields from returned object
      const returnedData = updated?.toJSON();
      delete returnedData?.deletedAt;
      delete returnedData?.createdAt;
      delete returnedData?.updatedAt;

      return successResponse(res, returnedData, MSG.OPTION_UPDATED);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  //swagger get all option
  @ApiOperationGet({
    description: " get all options",
    summary: " get all options",
    path: Paths.GET_ALL_OPTIONS,
    responses: {
      200: {
        description: MSG.SUCCESS,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //api get all options
  async getAllOptions(_req: Request, res: Response) {
    try {
      const allOptions: Option[] = await Option.findAll();

      const optionIds = await allOptions.map(
        (_element, index) => allOptions[index].dataValues.id
      );

      let getOption = await Option.findAll({
        where: { id: { [Op.in]: optionIds } },
        include: {
          model: SubOption,
          as: "SubOption",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
        attributes: {
          exclude: ["deletedAt", "createdAt", "updatedAt"],
        },
      });

      return successResponse(res, { getOption });
    } catch (error) {
      console.log(error);
      errorServerResponse(res, error);
    }
  }
  async getAllOptionsV2(_req: Request, res: Response) {
    try {
      const getOptionsUrl = `${process.env.ERP_URL}${Paths.GET_LIST_OPTIONS}`;
      const token = res.locals.access_token;
          //create default options if not exist
          await createOptionsServiceV2(res);
      
      axios
        .get(getOptionsUrl, {
          headers: {
            Authorization: token.access_token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("get all options:", response.data);
          const ListOptions = response.data;
          return successResponse(res, ListOptions);
        })
        .catch((error) => {
          // Handle errors
          console.error("catch Error getOptions:", error);
        });

      //return successResponse(res, getOption );
    } catch (error) {
      console.log("error getting options");
      errorServerResponse(res, error);
    }
  }
  //swagger get subOptions by option
  @ApiOperationPost({
    description: " get SubOptions by option",
    summary: " get SubOptions by option",
    path: Paths.GET_SUBOPTION_By_OPTION,
    parameters: {
      body: {
        description: "Get Sub Option By Option",
        required: true,
        model: "GetSubOptionByOption",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
      },
      400: { description: ` ${MSG.MISSING_DATA} || ${MSG.NOT_FOUND} ` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //API get all subOptions by option
  async getSubOptionByOption(req: Request, res: Response) {
    try {
      //option id
      const { id } = req.body;
      if (!id) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const optionExist = await Option.findByPk(id);
      if (!optionExist) {
        return failResponse(res, MSG.NOT_FOUND);
      }
      const getSubOptionByOption = await SubOption.findAll({
        where: { OptionId: id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      });
      return successResponse(res, getSubOptionByOption);
    } catch (error) {
      errorServerResponse(res, error);
    }
  }
  async getSubOptionByOptionV2(req: Request, res: Response) {
    try {
      //option uuid
      const id = req.body.id;
      const getSubOptionsUrl = `${process.env.ERP_URL}${Paths.GET_SUBOPTION_BY_OPTION}${id}`;

      axios
        .get(getSubOptionsUrl)
        .then((response) => {
          // Handle successful response
          console.log("suboption response data:", response.data);
          return successResponse(res, response.data);
        })

        .catch((error) => {
          return errorServerResponse(res, error);
        });
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
}
export default new OptionsController();
