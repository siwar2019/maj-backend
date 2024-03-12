import { ApiModel, ApiModelProperty } from "swagger-express-ts";

@ApiModel({
description: 'Product Variant',
name: 'ProductCategory',
})
//update table product-category
export class ProductCategory {
    @ApiModelProperty({
      required: true,
      description:"the old productId",
      example: 17
    })
    productId!: number;
    @ApiModelProperty({
        required: true,
        description:"the old categoryId",
        example: 1
      })
      categoryId!: number;
      @ApiModelProperty({
        required: true,
        description:"the new categoryId",
        example: 2
      })
      newCategoryId!: number;
      @ApiModelProperty({
        required: true,
        description:"the new newProductId",
        example: 3
      })
      newProductId!: number;
  }