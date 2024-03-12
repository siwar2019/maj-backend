import {
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
} from "swagger-express-ts";
import { Paths } from "../common/paths";
import { MSG } from "../common/responseMessages";
import {
  errorServerResponse,
  failResponse,
  successResponse,
} from "../common/functions";
import { Request, Response } from "express";
import {
  ProductVariant,
  DeleteVariant,
  UpdateVariant,
} from "../../swagger/modelsSwagger/productVariant.swagger";
import { Product } from "../models/product";
import { Variant } from "../models/variant";
import { variantSubOption } from "../models/variantSubOption";
import * as VariantSwagger from "../../swagger/modelsSwagger/productVariant.swagger";
import { SubOption } from "../models/subOption";
import { sequelize } from "../config/sequelize";
import { Transaction } from "sequelize";
import {
  DeleteProduct,
  GetAllProducts,
  GetProductWithVariant,
  GetVariantByProduct,
  UpdateProduct,
} from "../../swagger/modelsSwagger/product.swagger";
import { Category } from "../models/category";
import { productCategory } from "../models/productCategory";
import { ProductCategory } from "../../swagger/modelsSwagger/productCategory.swagger";
import { error } from "console";
import { IVarianCreation, IVariant, IvariantList } from "../interfaces/variant";
import { ProductVariantInterface } from "../interfaces/productVariant";
import axios from "axios";
@ApiPath({
  path: "",
  name: "Product",
  security: { basicAuth: [] },
})
export class ProductController {
  public static TARGET_NAME: string = "AddCategoryController";
  @ApiOperationPost({
    description: "add new product with its variants",
    summary: "add new product with its variants",
    path: Paths.CREATE_PRODUCT_VARIANTS,

    parameters: {
      body: {
        description: "add new product with its variants",
        required: true,
        model: "ProductVariant",
      },
      formData: {
        file: {
          type: "file",
          description: "image file to upload",
          name: "file",
        },
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(ProductVariant) },
      400: {
        description: `${MSG.SUBOPTION_MISSING} || ${MSG.MISSING_VARIANT}`,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })

  
  async addProductVariants(req: Request, res: Response) {
    try {
      const {
        name,
        price,
        availability,
        isDefected,
        description,
        ref,
        variants,
      } = req.body;
      //category
      const { idCategories } = req.body;
      //get image
      const files = req.files as Express.Multer.File[];

      let variant: any;
      //if data has been intered from form-data convert string to json
      if (typeof variants !== "object") {
        variant = JSON.parse(variants);
      }
      //Check if ProductVariant attributes exist
      if (
        !name ||
        !price.toString() ||
        !availability ||
        !isDefected ||
        !variants ||
        !variants.length ||
        !description ||
        !ref ||
        !idCategories ||
        !files ||
        files.length === 0
      ) {
        console.log(error);

        return failResponse(res, MSG.MISSING_DATA);
      }
      const listCategories = JSON.parse(req.body.idCategories);
      for (const variantItem of variant) {
        // Check attributes of each variant
        if (
          !variantItem.sizeId ||
          !variantItem.colorId ||
          !variantItem.image ||
          !variantItem.referenceVariant ||
          !variantItem.quantity
        ) {
          return failResponse(res, MSG.MISSING_VARIANT);
        }
      }
      const colorIds = variant.map((item: IVariant) => item.colorId);
      const sizeIds = variant.map((item: IVariant) => item.sizeId);

      // Retrieve all subOptions
      const foundColor = await SubOption.findAll({
        where: {
          id: colorIds,
        },
      });
      const foundSize = await SubOption.findAll({
        where: {
          id: sizeIds,
        },
      });
      if (
        foundColor.length !== colorIds.length &&
        foundSize.length !== sizeIds.length
      ) {
        // Extract the IDs from the found colorIds
        const foundIdsColor = foundColor.map((suboption) => suboption.id);
        // Find the missing IDs for color
        const missingIdsColor: number[] = colorIds.filter(
          (id: string) => !foundIdsColor.includes(parseInt(id))
        );
        // Extract the IDs from the found sizeIds
        const foundIdsSize = foundSize.map((size) => size.id);
        // Find the missing IDs for size
        const missingIdsSize: number[] = sizeIds.filter(
          (id: string) => !foundIdsSize.includes(parseInt(id))
        );
        if (missingIdsColor.length == 0) {
          return failResponse(
            res,
            ` ${MSG.SIZE_IDS_MISSING} ${missingIdsSize} `
          );
        } else if (missingIdsSize.length == 0) {
          return failResponse(
            res,
            `${MSG.COLOR_IDS_MISSING} ${missingIdsColor}`
          );
        }
        return failResponse(
          res,
          `${MSG.COLOR_IDS_MISSING} ${missingIdsColor} , ${MSG.SIZE_IDS_MISSING} ${missingIdsSize} `
        );
      }

      //get variant image length
      let imageLength = 0;

      //to test if the number of files entered the same as variant files
      for (const v of variant) {
        imageLength = imageLength + v.image.length;
      }
      try {
        let fileUploaded = false;
        for (const element of variant) {
          if (files.length === imageLength) {
            //check if files entered are the same as images entered in variants
            const file = files.find((file) => element.image == file.filename);
            if (file) {
              // if files entered are the same as images entered in variants
              fileUploaded = true;
            }
          }
        }
        if (fileUploaded) {
          const product = await Product.create({
            name: name,
            price: price,
            availability: availability,
            isDefected: isDefected,
            description: description,
            ref: ref,
          });
          //product-category
          listCategories.forEach(async (idCategory: number) => {
            await productCategory.create({
              productId: product.id,
              categoryId: idCategory,
            });
          });
          variant.map(async (variantItem: IVarianCreation) => {
            const variant = await Variant.create({
              productId: product.id,
              quantity: variantItem.quantity,
              image: variantItem.image,
              referenceVariant: variantItem.referenceVariant,
              sizeId: variantItem.sizeId,
              colorId: variantItem.colorId,
            });
            await variantSubOption.create({
              variantId: variant.id,
              subOptionId: variantItem.sizeId,
            });

            await variantSubOption.create({
              variantId: variant.id,
              subOptionId: variantItem.colorId,
            });
          });

          return successResponse(res, MSG.PRODUCT_CREATED);
        }
        return failResponse(res, MSG.TRY_AGAIN);
      } catch (error) {
        console.log(error);

        return errorServerResponse(res, error);
      }
    } catch (error) {
      console.log(error);

      return errorServerResponse(res, error);
    }
  }
  //create product ERP 
  async addProductV2(req:Request , res:Response) {
    try {
      const token=res.locals.access_token
      const {patneruuid,name,refExterne,description,tenantId,retailerSellingPrice}=req.body
      if(!patneruuid || !name || !refExterne || !description || !tenantId || !retailerSellingPrice) {
        return failResponse(res,MSG.MISSING_DATA)
      }

      const files = req.files as any ;
     // const files = req.files as Record<string, Express.Multer.File[]>; 
           console.log('%cproduct.controller.ts line:2588 filess', 'color: #007acc;', files);

      const { files: fileNames, images: imageNames } = req.query;

      const subject  = {name:name,refExterne:refExterne,unit:"Piece",marque:"MAJ",serialNumber:0,barCode:"0",description:description,taxStatus:"HT",tenantId:tenantId,
      productPrice:{purchasePrice:0,retailerSellingPrice:retailerSellingPrice,advisedSalePrice:1,priceCurrency:1},
      category:{},image:"",fileSheet:""}
      // Convert the subject object to a JSON string
      const subjectString = JSON.stringify(subject);
      const formData = new FormData();
      const file1 =files.files ;  
          const file2 =files.images ;

      console.log('%cproduct.controller.ts line:270 frfrfr', 'color: #007acc;', file1,"hhhh file2",file2);
      // const file2 =files.images[0] ;
      // const fileBlob = new Blob([file1.buffer], { type: file1.mimetype });
      // const fileBlob2 = new Blob([file2.buffer], { type: file2.mimetype });
      formData.append('files', file1);
      formData.append('images',file2);
      // formData.append('files',files.files[0].buffer,{filename: files.files[0].originalname as string}  );
      // formData.append('images',  files.images[0].buffer, {filename: files.images[0].originalname}   );

 



     // Append 'files'
      // const fileBuffer = files['files'][0].buffer;
      // const fileBlob = new Blob([fileBuffer], { type: files['files'][0].mimetype });
      // formData.append('files',  files['files'][0].originalname);



      // const fileBuffer = files['files'][0].buffer;


      // const fileBlob = new Blob([fileBuffer], { type: files['files'][0].mimetype });
      // formData.append('files',  files['files'][0].originalname);

      
 
      // Append 'images'
      //siwar
      // const imageBuffer = files['images'][0].buffer;
      // const imageBlob = new Blob([imageBuffer], { type: files['images'][0].mimetype });
      // formData.append('images', imageBlob, files['images'][0].originalname);

      // files['images'].forEach((image, index) => {
      //   const imageBuffer = image.buffer;
      //   const imageBlob = new Blob([imageBuffer], { type: image.mimetype });
      //   formData.append(`images_${index + 1}`, imageBlob, image.originalname);
      // });
      formData.append('patneruuid', patneruuid);
      formData.append('subject', subjectString); 
      console.log('%cproduct.controller.ts line:319 req', 'color: #007acc;', req);
      const createProductUrl =`${process.env.ERP_URL}${Paths.ADD_PRODUCT}`
      axios.post(createProductUrl,formData, {headers: {
        Authorization: token.access_token,
        'Content-Type': 'multipart/form-data',
      }})
      .then(response => {
      console.log('%cproduct.controller.ts line:276 data', 'color: #007acc;', formData.values);
      return successResponse(res,MSG.SUCCESS)
      })
    } catch (error) {
      console.log('%cproduct.controller.ts line:272 error', 'color: #007acc;', error);
      return errorServerResponse(res,MSG.SERVER_ERROR)
    }
  }


  @ApiOperationPut({
    description: "add new variant to product",
    summary: "add new variant to product",
    path: Paths.ADD_PRODUCT_VARIANTS,

    parameters: {
      body: {
        description: "add new variant to product",
        required: true,
        model: "Variant",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(VariantSwagger) },
      400: {
        description: `${MSG.MISSING_DATA} || ${MSG.PRODUCT_NOT_FOUND}`,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  async addNewVaraiant(req: Request, res: Response) {
    try {
      const { id, variants } = req.body;

      //get image
      const files = req.files as Express.Multer.File[];
      // Check if product exist
      const product = await Product.findByPk(id);
      if (!product) {
        return failResponse(res, MSG.PRODUCT_NOT_FOUND);
      }
      if (files.length === 0) {
        return failResponse(res, MSG.MISSING_IMAGES);
      }
      let variant: any;
      //if data has been intered from form-data convert string to json
      if (typeof variants !== "object") {
        variant = JSON.parse(variants);
      }
      if (!id || !files || files.length === 0) {
        console.log(error);

        return failResponse(res, MSG.MISSING_DATA);
      }
      for (const variantItem of variant) {
        // Check attributes of each variant
        if (
          !variantItem.sizeId ||
          !variantItem.colorId ||
          !variantItem.image ||
          !variantItem.referenceVariant ||
          !variantItem.quantity
        ) {
          return failResponse(res, MSG.MISSING_VARIANT);
        }
      }
      const colorIds = variant.map((item: IVariant) => item.colorId);
      const sizeIds = variant.map((item: IVariant) => item.sizeId);

      // Retrieve all subOptions
      const foundColor = await SubOption.findAll({
        where: {
          id: colorIds,
        },
      });
      const foundSize = await SubOption.findAll({
        where: {
          id: sizeIds,
        },
      });
      if (
        foundColor.length !== colorIds.length &&
        foundSize.length !== sizeIds.length
      ) {
        // Extract the IDs from the found colorIds
        const foundIdsColor = foundColor.map((suboption) => suboption.id);
        // Find the missing IDs for color
        const missingIdsColor: number[] = colorIds.filter(
          (id: string) => !foundIdsColor.includes(parseInt(id))
        );
        // Extract the IDs from the found sizeIds
        const foundIdsSize = foundSize.map((size) => size.id);
        // Find the missing IDs for size
        const missingIdsSize: number[] = sizeIds.filter(
          (id: string) => !foundIdsSize.includes(parseInt(id))
        );
        if (missingIdsColor.length == 0) {
          return failResponse(
            res,
            ` ${MSG.SIZE_IDS_MISSING} ${missingIdsSize} `
          );
        } else if (missingIdsSize.length == 0) {
          return failResponse(
            res,
            `${MSG.COLOR_IDS_MISSING} ${missingIdsColor}`
          );
        }
        return failResponse(
          res,
          `${MSG.COLOR_IDS_MISSING} ${missingIdsColor} , ${MSG.SIZE_IDS_MISSING} ${missingIdsSize} `
        );
      }

      //get variant image length
      let imageLength = 0;

      //to test if the number of files entered the same as variant files
      for (const v of variant) {
        imageLength = imageLength + v.image.length;
      }
      try {
        let fileUploaded = false;
        for (const element of variant) {
          if (files.length === imageLength) {
            //check if files entered are the same as images entered in variants
            const file = files.find((file) => element.image == file.filename);
            if (file) {
              // if files entered are the same as images entered in variants
              fileUploaded = true;
            }
          }
        }
        if (fileUploaded) {
          variant.map(async (variantItem: IVarianCreation) => {
            const variant = await Variant.create({
              productId: product.id,
              quantity: variantItem.quantity,
              image: variantItem.image,
              referenceVariant: variantItem.referenceVariant,
              sizeId: variantItem.sizeId,
              colorId: variantItem.colorId,
            });
            await variantSubOption.create({
              variantId: variant.id,
              subOptionId: variantItem.sizeId,
            });

            await variantSubOption.create({
              variantId: variant.id,
              subOptionId: variantItem.colorId,
            });
          });

          return successResponse(res, MSG.SUCCESS);
        }
        return failResponse(res, MSG.TRY_AGAIN);
      } catch (error) {
        console.log(error);

        return errorServerResponse(res, error);
      }
    } catch (error) {
      console.log(error);

      return errorServerResponse(res, error);
    }
  }
  //SWAGGER DELETE Variant from Product
  @ApiOperationPut({
    description: "delete Variant from Product",
    summary: "delete Variant from Product",
    path: Paths.DELETE_PRODUCT_VARIANT,

    parameters: {
      body: {
        description: "delete specific Variants from Product",
        required: true,
        model: "DeleteVariant",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(DeleteVariant) },
      400: {
        description: `${MSG.PRODUCT_NOT_FOUND} || ${MSG.VARIANTS_NOT_FOUND} || ${MSG.MISSING_DATA}`,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //API DELETE Variant from Product
  async deleteVariant(req: Request, res: Response) {
    try {
      // variantId is an array of variant IDs
      const { id, variants } = req.body;
      // Check if variantId  exist
      if (!Array.isArray(variants) || !variants.length) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      // Check if the product exist
      const product = await Product.findByPk(id);
      if (!product) {
        return failResponse(res, MSG.PRODUCT_NOT_FOUND);
      }

      // Retrieve the variants by primary keys
      const foundVariants = await Variant.findAll({
        where: {
          id: variants,
          productId: product.id,
        },
      });

      if (foundVariants.length !== variants.length) {
        // Extract the IDs from the found variants
        const foundIdsColor = foundVariants.map((variant) => variant.id);

        // Find the missing IDs
        const missingIdsColor: number[] = variants.filter(
          (id: number) => !foundIdsColor.includes(id)
        );
        return failResponse(
          res,
          `${MSG.VARIANTS_NOT_FOUND} : ${missingIdsColor}`
        );
      }

      // Update the retrieved variants
      const updatedVariants = await Promise.all(
        foundVariants.map(async (variant) => {
          // softDelete the variantSubOption
          await variantSubOption.destroy({
            where: { variantId: variant.id },
          });
          // softDelete the variant
          await variant.destroy();

          return variant;
        })
      );

      const udpatedVariants = await Promise.all(updatedVariants);
      return successResponse(res, udpatedVariants, MSG.NEW_VARIANT);
    } catch (error) {
      console.log(error);
      return errorServerResponse(res, error);
    }
  }
  @ApiOperationPut({
    description: "update product's variants",
    summary: "update product's variants",
    path: Paths.UPDATE_PRODUCT_VARIANTS,

    parameters: {
      body: {
        description: "update product's variants",
        required: true,
        model: "UpdateVariant",
      },
      formData: {
        file: {
          type: "file",
          description: "image file to upload",
          required: true,
        },
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(UpdateVariant) },
      400: {
        description: `${MSG.VARIANTS_NOT_FOUND} || ${MSG.MISSING_DATA}|| ${MSG.PRODUCT_NOT_FOUND}`,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  async updateProductVariants(req: Request, res: Response) {
    try {
      // Flag to track if the response has been sent (in order to avoid multiple responses)
      let responseSent = false;

      const { id, variants } = req.body;
      const files = req.files as Express.Multer.File[];

      // Check if ProductVariant attributes exist
      if (!variants) {
        return failResponse(res, MSG.MISSING_DATA);
      }

      // Check if Product exists
      const product = await Product.findByPk(id);
      if (!product) {
        return failResponse(res, MSG.PRODUCT_NOT_FOUND);
      }

      // Convert string to JSON
      const variantList = JSON.parse(variants);

      for (const variantItem of variantList) {
        // Check attributes of each variant
        if (!variantItem.id || !variantItem.name || !variantItem.description) {
          return failResponse(res, MSG.MISSING_VARIANT);
        }
      }

      // Extract the IDs of given variants
      const givenIds = variantList.map((variant: IvariantList) => variant.id);

      // Retrieve the variants by primary keys
      const foundVariants = await Variant.findAll({
        where: {
          id: givenIds,
          productId: id,
        },
      });

      if (foundVariants.length !== givenIds.length) {
        // Extract the IDs from the found variants
        const foundIdsColor = foundVariants.map((variant) => variant.id);

        // Find the missing IDs
        const missingIdsColor = givenIds.filter(
          (id: number) => !foundIdsColor.includes(id)
        );
        return failResponse(
          res,
          `${MSG.VARIANTS_NOT_FOUND}: ${missingIdsColor}`
        );
      }
      // Update the retrieved variants
      for (const element of variantList) {
        // Find the image where the filename matches the variant's image
        const file = files.find((file) => element.image === file.filename);
        if (files.length !== 0) {
          if (file) {
            //update variant & image with selected files
            foundVariants.map(async (variant) => {
              const variantData = variantList.find(
                (v: Variant) => v.id == variant.id && v.image == element.image
              );
              await variant.update(variantData);
            });
            // Set the flag to indicate that the response has been sent
            responseSent = true;
          }
        } else {
          responseSent = true;
          //update variant without image

          for (const variantItem of variantList) {
            await Variant.update(
              {
                id: variantItem.id,
                name: variantItem.name,
                description: variantItem.description,
              },
              { where: { id: variantItem.id } }
            );
          }
        }
      }
      const updatedVariantsData = await Variant.findAll({
        where: {
          productId: id,
        },
        attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
      });

      if (responseSent) {
        return successResponse(res, updatedVariantsData, MSG.UPDATE_VARIANT);
      }
      return failResponse(res, MSG.IMAGE_NOT_FOUND);
    } catch (error) {
      console.log(error);
      return errorServerResponse(res, error);
    }
  }
  @ApiOperationPut({
    description: "Update  product",
    summary: "Update  product",
    path: Paths.UPDATE_PRODUCT,

    parameters: {
      body: {
        description: "Update  product",
        required: true,
        model: "UpdateProduct",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(UpdateProduct) },
      400: {
        description: `${MSG.MISSING_DATA} || ${MSG.PRODUCT_NOT_FOUND}`,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  async updateProduct(req: Request, res: Response) {
    try {
      const {
        id,
        name,
        price,
        availability,
        isDefected,
        quantity,
        description,
        ref,
      } = req.body;
      // Check attributes of product
      if (
        !id ||
        !name ||
        !price?.toString() ||
        !availability ||
        !isDefected ||
        !description ||
        !ref ||
        !quantity?.toString()
      ) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      // Check if product exist
      const product = await Product.findByPk(id);
      if (!product) {
        return failResponse(res, MSG.PRODUCT_NOT_FOUND);
      }
      //  Update product
      const updatedProduct = await product.update({
        name,
        price,
        availability,
        isDefected,
        quantity,
        description,
        ref,
      });
      const returnedData = updatedProduct.toJSON();
      delete returnedData.createdAt;
      delete returnedData.updatedAt;
      delete returnedData.deletedAt;
      return successResponse(res, returnedData, MSG.UPDATE_PRODUCT);
    } catch (error) {
      console.log(error);
      return errorServerResponse(res, error);
    }
  }

  @ApiOperationPost({
    description: "Delete product",
    summary: "Delete product",
    path: Paths.DELETE_PRODUCT,

    parameters: {
      body: {
        description: "Delete product",
        required: true,
        model: "DeleteProduct",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(DeleteProduct) },
      400: {
        description: `${MSG.MISSING_DATA} || ${MSG.PRODUCT_NOT_FOUND}`,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  async deleteProduct(req: Request, res: Response) {
    const t: Transaction = await sequelize.transaction();

    try {
      const { id } = req.body;
      // Check attributes of product
      if (!id) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      // Check if product exist
      const product = await Product.findByPk(id);
      if (!product) {
        return failResponse(res, MSG.PRODUCT_NOT_FOUND);
      }
      // Retrieve the variants by primary keys
      const foundVariants = await Variant.findAll({
        where: {
          productId: id,
        },
      });

      // softDelete
      await Promise.all(
        foundVariants.map(async (variant) => {
          // softDelete the variantSubOption
          await variantSubOption.destroy({
            where: { variantId: variant.id },
            transaction: t,
          });
          // softDelete the variant
          await variant.destroy({ transaction: t });
        })
      );

      await product.destroy({ transaction: t });

      await t.commit();

      return successResponse(res, product, MSG.DELETE_PRODUCT);
    } catch (error) {
      console.log(error);
      await t.rollback();
      return errorServerResponse(res, error);
    }
  }

  @ApiOperationGet({
    description: "Get product with variants",
    summary: "Get product with variants",
    path: Paths.GET_PRODUCT_WITH_VARIANTS,
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(GetProductWithVariant),
      },
      400: {
        description: `${MSG.MISSING_DATA} || ${MSG.PRODUCT_NOT_FOUND}`,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
    parameters: {
      query: {
        id: {
          description: "ID product",
          required: true,
          type: "number",
        },
      },
    },
  })
  async getProductWithVariants(req: Request, res: Response) {
    try {
      //convert id to number after passing it from parameter
      const id = parseInt(req.query.id as string);
      // Check attributes of product
      if (!id) {
        return failResponse(res, MSG.MISSING_DATA);
      }

      // Check if product exist
      const product = await Product.findByPk(id, {
        include: {
          model: Variant,
          as: "Variant",
          //specify the attributes of join model
          attributes: [
            "id",
            "image",
            "productId",
            "referenceVariant",
            "colorId",
            "sizeId",
          ],
        },
      });
      //get color id from product
      const colorId = product?.Variant.map((color) => color.colorId);
      //get size id from product
      const sizeId = product?.Variant.map((size) => size.sizeId);
      if (!product) {
        return failResponse(res, MSG.PRODUCT_NOT_FOUND);
      }
      if (!product.Variant) {
        return successResponse(res, []);
      }
      //get subOptions of the specific variant geted
      const subOptionPromises = product.Variant.map(async (variantId) => {
        //get the id of the subOption
        const subOptionId = await variantSubOption.findOne({
          where: { variantId: variantId.id },
          attributes: ["subOptionId"],
        });
        //get the value of suboption
        if (!subOptionId) {
          return failResponse(res, MSG.HAVE_NO_SUBOPTION);
        }
        const subOptionValue = await SubOption.findOne({
          where: { id: subOptionId.subOptionId },
          attributes: ["id", "name", "description"],
        });

        return subOptionValue;
      });
      //get all colors
      const color = await SubOption.findAll({
        where: { id: colorId },
        attributes: ["id", "description"],
      });
      //get all size
      const size = await SubOption.findAll({
        where: { id: sizeId },
        attributes: ["id", "description"],
      });
      const subOptions = await Promise.all(subOptionPromises);
      const allProducts = product.toJSON();
      delete allProducts.createdAt;
      delete allProducts.updatedAt;
      delete allProducts.deletedAt;
      allProducts.subOptions = color;
      allProducts.sizes = size;
      return successResponse(res, allProducts);
    } catch (error) {
      console.log(error);
      return errorServerResponse(res, error);
    }
  }
  //swagger get all variant by product
  @ApiOperationGet({
    description: "get all variant by product",
    summary: "get all varianByProduct",
    path: Paths.GET_ALL_VARIANT_BY_PRODUCT,
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(GetVariantByProduct),
      },
      400: {
        description: `${MSG.MISSING_DATA} || ${MSG.PRODUCT_NOT_FOUND}`,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    parameters: {
      query: {
        id: {
          description: "ID product",
          required: true,
          type: "number",
        },
      },
    },
    security: {
      apiKeyHeader: [],
    },
  })

  //API GET ALL VARIANT BY PRODUCT
  async getAllVariantByProduct(req: Request, res: Response) {
    try {
      //get product's id from parameter
      const id = parseInt(req.query.id as string);
      if (!id) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      //CHECK IF PRODUCT ID EXIST
      const findIdProduct = await Product.findByPk(id);
      //IF NOT EXIST
      if (!findIdProduct) {
        return failResponse(res, MSG.PRODUCT_NOT_FOUND);
      }
      //ELSE
      const getAllVariant = await Variant.findAll({
        where: {
          productId: id,
        },
        attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
      });
      return successResponse(res, getAllVariant);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  //swagger  get all product by categories
  @ApiOperationPost({
    description: " get all product by categories",
    summary: " get all product by categories",
    path: Paths.GET_ALL_PRODUCT_BY_CATEGORIE,

    parameters: {
      query: {
        id: {
          description: "ID ",
          required: true,
          type: "number",
        },
      },
    },

    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(GetVariantByProduct),
      },
      400: {
        description: `${MSG.MISSING_DATA} || ${MSG.CATEGORY_NOT_FOUND}`,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //api get all product by categories
  async GetAllProductByCategory(req: Request, res: Response) {
    try {
      //get category's id
      const id = parseInt(req.query.id as string);
      if (!id) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const categoryExist = await Category.findByPk(id);
      if (!categoryExist) {
        return failResponse(res, MSG.CATEGORY_NOT_FOUND);
      }
      //get all product ids  by category
      const productids = await productCategory.findAll({
        where: {
          categoryId: id,
        },
      });

      let prodVariant: ProductVariantInterface[] = [];

      const promiseAll = Promise.all(
        productids.map(async (index) => {
          //get list of products by ids/category
          let product = await Product.findAll({
            where: {
              id: index.productId,
            },
            attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
          });
          //find list of variants
          for (const productItem of product) {
            let variants: any = await Variant.findAll({
              where: { productId: productItem.id },
              attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
            });
            //return an object containng list of products and variants
            if (variants) {
              const productUpdatedList: ProductVariantInterface = {
                productItems: productItem.dataValues,
                variant: variants,
              };

              prodVariant.push(productUpdatedList);
            }
          }
        })
      );

      promiseAll.then(() => {
        //prodVariantwill contain the desired array of ProductVariantInterface objects
        return successResponse(res, { prodVariant });
      });
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  //swager get all product
  @ApiOperationGet({
    description: "get all products",
    summary: "get all products",
    path: Paths.GET_ALL_PRODUCT,
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(GetAllProducts),
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //ERP
  async GetAllProductsV2(_req: Request, res: Response) {
    const getProductUrl =`${process.env.ERP_URL}${Paths.GET_LIST_PRODUCT}`
    const token=res.locals.access_token
    axios.get(getProductUrl,{headers: {Authorization: token.access_token}}) .then(response => {
      const listProducts=response.data
       return successResponse(res, listProducts);

    })
    .catch(error => {
      console.log('error', error);
       errorServerResponse(res, error);
    })
  }



    async GetAllProductByCategories(_req: Request, res: Response) {

    try {
      const listProducts = await Product.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        include: {
          model: Category,
          as: "Category",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      });
      return successResponse(res, listProducts);
    } catch (error) {
      errorServerResponse(res, error);
    }
  }
  //swagger update  table association product-categories
  @ApiOperationPut({
    description: "Update  product-categories",
    summary: "Update  product-categories",
    path: Paths.UPDATE_PRODUCT_Categries,

    parameters: {
      body: {
        description: "product-categories",
        required: true,
        model: "ProductCategory",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(ProductCategory) },
      400: {
        description: `${MSG.MISSING_DATA} || ${MSG.PRODUCT_NOT_FOUND} || ${MSG.MISSING_OPTION}`,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  //API update  table association product-categories
  async UpdateProductCategories(req: Request, res: Response) {
    const t: Transaction = await sequelize.transaction();

    try {
      const { productId, categoryId, newProductId, newCategoryId } = req.body;
      if (!productId || !categoryId) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      if (!newProductId || !newCategoryId) {
        return failResponse(res, MSG.MISSING_OPTION);
      }
      //CHECK IF attributes  EXIST DANS TABLE PRODUCT-CATEGORY
      const findExistance = await productCategory.findOne({
        where: { productId: productId } && { categoryId: categoryId },
      });
      if (!findExistance) {
        return failResponse(res, MSG.NOT_FOUND);
      }
      await productCategory.destroy({
        where: { productId: productId } && { categoryId: categoryId },
        transaction: t,
      });
      await productCategory.create(
        {
          productId: newProductId || productId,
          categoryId: newCategoryId || categoryId,
        },
        { transaction: t }
      );
      await t.commit();
      return successResponse(res, MSG.UPDATED_SUCCUSSFULLY);
    } catch (error) {
      console.log(error);
      await t.rollback();
      return errorServerResponse(res, error);
    }
  }

  ///// get products image/////

  async GetAllProductByCategorieV2(req: Request, res: Response) {
    try {
      const categoryId = req.query.categoryId;
      const getProductUrl = `${process.env.ERP_URL}${Paths.GET_PRODUCT_BY_CATEGORY}${categoryId}`;
      const response = await axios.get(getProductUrl);
      const product = response.data;

      if (product.image) {
        const fileName = product.image;
        const getImageUrl = `${process.env.ERP_URL}${Paths.GET_PRODUCT_IMAGE}?fileName=${fileName}`;
        const imageResponse = await axios.get(getImageUrl);
        product.imageData = imageResponse.data;
      }
      return successResponse(res, product);
    } catch (error) {
      console.log('error', error);
      return errorServerResponse(res, error);
    }
  }

   ///// get products details/////

   async GetProductDetailsById(req: Request, res: Response) {
    try {
      const productId = req.query.productId;
      const getProductUrl = `${process.env.ERP_URL}${Paths.GET_PRODUCT_BY_ID}${productId}`;
      const response = await axios.get(getProductUrl);
      const productDatails = response.data;
      return successResponse(res, productDatails);
    } catch (error) {
      console.log('error', error);
      return errorServerResponse(res, error);
    }
  }
  
}
export default new ProductController();
