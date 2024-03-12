import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Update Product',
  name: 'UpdateProduct',
})
export class UpdateProduct {
  @ApiModelProperty({
    required: true,
    type: 'number',
    example: 1,
  })
  id!: number;
  @ApiModelProperty({
    required: true,
    type: 'string',
    example: 'name',
  })
  name!: string;
  @ApiModelProperty({
    required: true,
    type: 'string',
    example: 'name',
  })
  description!: string;
  @ApiModelProperty({
    required: true,
    type: 'string',
    example: 'name',
  })
  ref!: string;
  @ApiModelProperty({
    required: true,
    type: 'number',
    example: 1,
  })
  price!: Number;
  @ApiModelProperty({
    required: true,
    type: 'boolean',
    example: true,
  })
  availability!: boolean;
  @ApiModelProperty({
    required: true,
    type: 'boolean',
    example: true,
  })
  isDefected!: boolean;
  @ApiModelProperty({
    required: true,
    type: 'number',
    example: 1,
  })
  quantity!: Number;
}
@ApiModel({
  description: 'Delete Product',
  name: 'DeleteProduct',
})
export class DeleteProduct {
  @ApiModelProperty({
    required: true,
    type: 'number',
    example: 1,
  })
  id!: number;
}
@ApiModel({
  description: 'getProductWithVariant',
  name: 'GetProductWithVariant',
})
export class GetProductWithVariant {
  @ApiModelProperty({
    required: false,
    type: 'number',
    example: 1,
  })
  id!: number;

}
@ApiModel({
  description: 'Get Variant By Product',
  name: 'GetVariantByProduct',
})
export class GetVariantByProduct {
  @ApiModelProperty({
    required: true,
    type: 'number',
    example: 1,
  })
  id!: number;
}
@ApiModel({
  description: 'Get list Products',
  name: 'GetAllProducts',
})
export class GetAllProducts {
  @ApiModelProperty({
    required: true,
    type: 'number',
    example: 1,
  })
  id!: number;
  @ApiModelProperty({
    required: true,
    type: 'number',
    example: 1,
  })
  name!: number;
  @ApiModelProperty({
    required: true,
    type: 'number',
    example: 1,
  })
  price!: number;
  @ApiModelProperty({
    required: true,
    type: 'boolean',
    example: 1,
  })
  availability!: boolean;
  @ApiModelProperty({
    required: true,
    type: 'boolean',
    example: 1,
  })
  isDefected!: boolean;
  @ApiModelProperty({
    required: true,
    type: 'number',
    example: 1,
  })
  quantity!: number;
  @ApiModelProperty({
    required: true,
    type: 'category[]',
    example: [ {
      id:1,
      name:"dd"
    }
  ],
  })
  Category!: [];

}
