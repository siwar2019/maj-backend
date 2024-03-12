import { Request, Response } from "express";
import * as dotenv from "dotenv";
import {
  errorServerResponse,
  failResponse,
  successResponse,
} from "../common/functions";
import { MSG } from "../common/responseMessages";
import { Menu } from "../models/menu";
import { Privilege } from "../models/privilege";
import { Paths } from "../common/paths";
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
} from "swagger-express-ts";
import {
  AffectPrivilege,
  CreateNewItemMenu,
  UpdatePrivilege,
  createPrivileges,
} from "../../swagger/modelsSwagger/privilege.swagger";
import { Admin } from "../models/admin";
import { Access } from "../models/access";
import { sequelize } from "../config/sequelize";
dotenv.config();
@ApiPath({
  path: "",
  name: "Privilege",
  security: { apiKeyHeader: [] },
})
export class PrivilegeController {
  @ApiOperationPost({
    description: "create privilege",
    path: Paths.CREATE_NEW_PRIVULEGE,
    summary: "create new privilege",
    parameters: {
      body: {
        description: "create new privilege",
        required: true,
        model: "createPrivileges",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(createPrivileges),
      },
      400: {
        description: MSG.MISSING_DATA,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: { apiKeyHeader: [] },
  })
  async createNewPrivilege(req: Request, res: Response) {
    try {
      const { privilegeName, description } = req.body;
      if (!privilegeName || !description) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const listPrivilege = await Privilege.create({
        privilegeName: privilegeName,
        description: description,
      });
      //exclude the indesired attributes
      const returnedData = listPrivilege.toJSON();
      delete returnedData.createdAt;
      delete returnedData.updatedAt;
      return successResponse(res, returnedData);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  //SWAGGER AFFECT PRIVILEGE TO AGENT
  @ApiOperationPut({
    description: "AFFECT PRIVILEGE TO AGENT",
    path: Paths.AFFECT_PRIVILEGE_TO_AGENT,
    summary: "AFFECT PRIVILEGE TO AGENT",
    parameters: {
      body: {
        description: "AFFECT PRIVILEGE TO AGENT",
        required: true,
        model: "AffectPrivilege",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(AffectPrivilege),
      },
      400: { description: ` ${MSG.MISSING_DATA} || ${MSG.NOT_FOUND} ` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: { apiKeyHeader: [] },
  })
  //affect privilege to agent
  async affectPrivilegeToAgent(req: Request, res: Response) {
    try {
      const { privilegeId, agentId } = req.body;
      if (!privilegeId || !agentId) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const privilegeExist = await Privilege.findOne({
        where: { id: privilegeId },
      });
      const agentExist = await Admin.findOne({
        where: { id: agentId },
      });
      if (!privilegeExist || !agentExist) {
        return failResponse(res, MSG.NOT_FOUND);
      }
      //update admin 's privilege
      await Admin.update(
        { privilegeId: privilegeId },
        { where: { id: agentId } }
      );
      return successResponse(res, []);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  @ApiOperationPost({
    description: "create new menu  item ",
    path: Paths.CREATE_NEW_MENU_ITEM,
    summary: "create new menu  item",
    parameters: {
      body: {
        description: "create new menu  item",
        required: true,
        model: "CreateNewItemMenu",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(CreateNewItemMenu),
      },
      400: {
        description: MSG.MISSING_DATA,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })

  //api create new menu item
  async createNewMenuItem(req: Request, res: Response) {
    const t = await sequelize.transaction();

    try {
      //get Menu item attributes
      const { name, description, parentId, privilegeId } = req.body;
      const { createAccess, readAccess, updateAccess, deleteAccess } = req.body;
      if (
        !name ||
        !description ||
        !parentId ||
        !privilegeId ||
        !createAccess ||
        !readAccess ||
        !updateAccess ||
        !deleteAccess
      ) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      //if menu item has no parentId or it is new
      try {
        if (parentId == 0) {
          const newItem = await Menu.create(
            {
              name: name,
              description: description,
              parentId: parentId,
            },
            { transaction: t }
          );
          //exclude the indesired attributes
          const newItemData = newItem.toJSON();
          delete newItemData.createdAt;
          delete newItemData.updatedAt;
          //create table association access
          const access = await Access.create(
            {
              menuId: newItem.id,
              privilegeId: privilegeId,
              create: createAccess,
              read: readAccess,
              modify: updateAccess,
              delete: deleteAccess,
            },
            { transaction: t }
          );
          await t.commit();
          //exclude the indesired attributes
          const returnedData = access.toJSON();
          delete returnedData.createdAt;
          delete returnedData.updatedAt;
          return successResponse(res, { newItemData, returnedData });
        }
      } catch (error) {
        console.log(error);
        await t.rollback();
      }
      //check if the parentId entered exist
      const parentIdExist = await Menu.findOne({ where: { id: parentId } });
      if (!parentIdExist) {
        return failResponse(res, MSG.NOT_FOUND);
      }
      //create new menu item
      try {
        const newItem = await Menu.create(
          {
            name: name,
            description: description,
            parentId: parentIdExist.id,
          },
          { transaction: t }
        );
        //create table association access
        const access = await Access.create(
          {
            menuId: newItem.id,
            privilegeId: privilegeId,
            create: createAccess,
            read: readAccess,
            modify: updateAccess,
            delete: deleteAccess,
          },
          { transaction: t }
        );
        await t.commit();
        return successResponse(res, { newItem, access });
      } catch (error) {
        console.log(error), await t.rollback();
      }
    } catch (error) {
      errorServerResponse(res, error);
    }
  }
  //SWAGGER GET AGENT ACCESS
  @ApiOperationGet({
    description: "get AGENT ACCESS",
    summary: "get AGENT ACCESS",
    path: Paths.GET_ALL_ADDRESS,
    responses: {
      200: { description: MSG.SUCCESS },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //API GET AGENT ACCESS
  async getAgentAccess(req: Request, res: Response) {
    try {
      //get agent id
      const agentId = req.query.agentId;
      if (!agentId) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      //check if agent exist
      const agentExist = await Admin.findOne({ where: { id: agentId } });
      if (!agentExist) {
        return failResponse(res, MSG.AGENT_NOT_FOUND);
      }
      //get agent access
      // const agentAccess = await Access.findAll({where :{privilegeId:agentId}});
      const agentAccess = await Access.findAll({
        where: { privilegeId: agentId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      return successResponse(res, agentAccess);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  //swagger update privilege
  @ApiOperationPut({
    description: "update privilege",
    path: Paths.UPDATE_PRIVILEGE,

    summary: "update privilege",
    parameters: {
      body: {
        description: "update privilege",
        required: true,
        model: "UpdatePrivilege",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(UpdatePrivilege),
      },
      400: { description: `${MSG.MISSING_DATA} || ${MSG.NOT_FOUND}` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //API update privilege
  async updatePrivilege(req: Request, res: Response) {
    try {
      //get access privileges
      const {
        privilegeId,
        menuId,
        createAccess,
        deleteAccess,
        updateAccess,
        readAccess,
      } = req.body;

      if (
        !privilegeId ||
        !menuId ||
        !createAccess ||
        !deleteAccess ||
        !updateAccess ||
        !readAccess
      ) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      //check if privilege id  exist
      const privilegeExist = await Access.findOne({
        where: { privilegeId: privilegeId },
      });
      //check if menu id  exist

      const menuExist = await Access.findOne({ where: { menuId: menuId } });
      if (!privilegeExist || !menuExist) {
        return failResponse(res, MSG.NOT_FOUND);
      }
      //update access
      await Access.update(
        {
          create: createAccess,
          read: readAccess,
          modify: updateAccess,
          delete: deleteAccess,
        },
        { where: { privilegeId: privilegeId } && { menuId: menuId } }
      );
      return successResponse(res, [], MSG.SUCCESS);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
}
export default new PrivilegeController();
