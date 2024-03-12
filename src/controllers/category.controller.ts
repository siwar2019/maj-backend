import express, { response } from "express";
import { Request, Response } from "express";
import { MSG } from "../common/responseMessages";
import {
  errorServerResponse,
  failResponse,
  successResponse,
} from "../common/functions";

import { Category } from "../models/category";
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
} from "swagger-express-ts";
import { Paths } from "../common/paths";
import {
  createCategory,
  DeleteCategory,
  UpdateCategory,
} from "../../swagger/modelsSwagger/category.swagger";
import { Op } from "sequelize";
import axios from "axios";
/* swagger API add new category/subcategory*/

@ApiPath({
  path: "",
  name: "Category",
  security: { basicAuth: [] },
})
//@injectable()
export class CategoryController {
  public static TARGET_NAME: string = "AddCategoryController";

  @ApiOperationPost({
    description: "add new category",
    summary: "add category",
    path: Paths.ADD_CATEGORY_SUBCATEGORY,

    parameters: {
      body: {
        description: "add new category",
        required: true,
        model: "createCategory",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(createCategory) },
      400: { description: MSG.MISSING_DATA },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  async addCategory(req: Request, res: Response) {
    try {
      const { name, description, parentId } = req.body;
      //check if category attributes exist
      if (!name || !parentId) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      //check if category id exist
      const categoryExist = await Category.findOne({
        where: {
          id: parentId,
        },
      });

      if (!categoryExist) {
        return failResponse(res, MSG.CATEGORY_NOT_FOUND);
      }
      const existingCategory = await Category.findOne({
        where: {
          name: name,
          parentId: {
            [Op.eq]: parentId,
          },
        },
      });

      if (!existingCategory) {
        // create table category
        const createCategory = await Category.create({
          name: name,
          description: description,
          parentId: parentId,
        });

        //exclude the indesired attributes
        const returnedData = createCategory.toJSON();
        delete returnedData.createdAt;
        delete returnedData.updatedAt;
        return successResponse(res, returnedData, MSG.CATEGORY_CREATED);
      }
      return failResponse(res, MSG.CATEGORY_EXISTS);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  async addCategoryV2(req: Request, res: Response) {
    const {  categoryId,description,name,id,uuid} =req.body ;
    const token=res.locals.access_token

    const apiCreateCategory=`${process.env.ERP_URL}${Paths.CREATE_CATEGORY}`
    const data={
      categoryId: categoryId ,
      description:description ,
      children: [
        null
      ],
      name:name
    }
    axios.post(apiCreateCategory,data, {headers: {Authorization: token.access_token}}) 
    .then(response => {
      return successResponse(res,response.data,MSG.CATEGORY_CREATED)

    })
    .catch(error => {
      console.log('error creating category', error);

      return failResponse(res,error)

    })
  }
  
  @ApiOperationPut({
    description: "update category",
    summary: "update category",
    path: Paths.UPDATE_CATEGORY_SUBCATEGORY,
    parameters: {
      body: {
        description: "update  category",
        required: true,
        model: "UpdateCategory",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(UpdateCategory),
      },
      400: { description: `${MSG.CATEGORY_NOT_FOUND} || ${MSG.MISSING_DATA}` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  async updateCategory(req: express.Request, res: express.Response) {
    try {
      const { name, description, id } = req.body;
      // Check if category attributes existfailResponse
      if (!name) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      // Check if the category exist
      const category = await Category.findByPk(id);
      if (!category) {
        return failResponse(res, MSG.NOT_FOUND);
      }
      const defaultCategories = ["1", "2", "3"];

      if (defaultCategories.includes(id)) {
        return failResponse(res, MSG.UNAUTHORIZED_UPDATE);
      }
      const existingCategory = await Category.findOne({
        where: {
          name: name,
          parentId: category.dataValues.parentId,
          id: {
            [Op.ne]: id,
          },
        },
      });
      if (!existingCategory) {
        // Update table category
        const updatedCategory = await category.update({
          name: name,
          description: description,
        });
        //exclude the indesired attributes
        const returnedData = updatedCategory.toJSON();
        delete returnedData.createdAt;
        delete returnedData.updatedAt;
        return successResponse(res, returnedData, MSG.UPDATED_SUCCESSUFULLY);
      }
      return failResponse(res, MSG.CATEGORY_EXISTS);
    } catch (error) {
      console.log(error);
    }
  }
  async updateCategoryV2(req: express.Request, res: express.Response) {
    const apiUpdateCategory=`${process.env.ERP_URL}${Paths.UPDATE_CATEGORY}`
    const categoryData=req.body
    const token=res.locals.access_token
    axios.put(apiUpdateCategory,categoryData,{headers: {Authorization: token.access_token}}).then(response => {
      return successResponse(res,response.data)
    })
    .catch(error => {
      console.log('error', error)
      return failResponse(res,error)
    })
  }
  /* swagger API GET  ALL CATEGORY */

  @ApiOperationGet({
    description: "get all categories",
    summary: "get all categories",
    path: Paths.GET_ALL_CATEGORY,
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(createCategory) },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })

  //API GET ALL CATEGORIES
  // async getAllCategory(_req: express.Request, res: express.Response) {
  //   try {
  //     const alllCategory: Category[] = await Category.findAll({
  //       attributes: {
  //         exclude: ["createdAt", "updatedAt"],
  //       },
  //     });
  //     return successResponse(res, alllCategory);
  //   } catch (error) {
  //     return errorServerResponse(res, error);
  //   }
  // }
  async getAllCategoryV2(_req: express.Request, res: express.Response) {
    const token=res.locals.access_token
    const getCategoryUrl = `${process.env.ERP_URL}${Paths.GET_ALL_CATEGORIES}`;

    axios
      .get(getCategoryUrl,{headers: {Authorization: token.access_token}})
      .then((response) => {
        return successResponse(res, response.data);
      })
      .catch((error) => {
        return failResponse(res, error);
      });
  }
  //SWAGGER DELETE CATEGORY
  @ApiOperationPut({
    description: "delete category",
    summary: "delete category",
    path: Paths.DELETE_CATEGORY,

    parameters: {
      body: {
        description: "delete specific category",
        required: true,
        model: "DeleteCategory",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(DeleteCategory) },
      400: { description: `${MSG.NOT_FOUND} ||${MSG.MISSING_DATA} ` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //API DELETE CATEGORY
  async deleteCategory(req: Request, res: Response) {
    const id = req.body.id;
    const defaultCategories = [1, 2, 3];
    try {
      if (!id) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const deletedCategory: Category | null = await Category.findByPk(id);
      if (!deletedCategory) {
        return failResponse(res, MSG.CATEGORY_NOT_FOUND);
      }
      if (!defaultCategories.includes(deletedCategory.id)) {
        Category.destroy({
          where: {
            id: deletedCategory.id,
          },
        });
        return successResponse(res, [], MSG.DELETED_SUCCUSSFULLY);
      }
      return failResponse(res, MSG.UNAUTHORIZED_DELETE);
    } catch (error) {
      console.log(error);
      return errorServerResponse(res, error);
    }
  }
  async deleteCategoryV2(req: Request, res: Response) {
    const token=res.locals.access_token
    const uuid = req.body.uuid;
    const deleteCategoryUrl = `${process.env.ERP_URL}${Paths.DELETE_CATEGORIES}${uuid}`;
    axios.delete(deleteCategoryUrl,{headers: {Authorization: token.access_token}}).then((response) => {
        return successResponse(res, response.data);
      })
      .catch((error) => {
        return errorServerResponse(res, error);
      })
  }



  async getAllParentCategory(_req: express.Request, res: express.Response) {
    const getCategoryUrl = `${process.env.ERP_URL}${Paths.GET_ALL_CATEGORIES}`;
  
    try {
      const response = await axios.get(getCategoryUrl);
      const allCategories = response.data;
  
      // Filter categories where categoryId is null
      const parentCategories = allCategories.filter((category: { categoryId: null; }) => category.categoryId === null);
  
      // Filter parent categories by specific names
      const filteredParentCategories = parentCategories.filter((category: { name: string; }) =>
        ['men', 'women', 'kids'].includes(category.name.toLowerCase())
      );
  
      return successResponse(res, filteredParentCategories);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  
  
}
export default new CategoryController();
