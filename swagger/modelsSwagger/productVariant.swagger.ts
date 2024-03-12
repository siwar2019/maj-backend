import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Product Variant',
  name: 'ProductVariant',
})
export class ProductVariant {
  @ApiModelProperty({
    required: true,
  })
  name!: string;
  @ApiModelProperty({
    required: true,
  })
  description!: string;
  @ApiModelProperty({
    required: true,
  })
  ref!: string;
  @ApiModelProperty({
    required: true,
  })
  idCategory!: number;

  @ApiModelProperty({
    required: true,
    example: '10',
  })
  price!: number;
  // @ApiModelProperty({
  //   type: 'string',
  //   description: 'product img',
  // example:'x1.jpg',
  // })
  // file!: Express.Multer.File;

  @ApiModelProperty({
    required: true,
  })
  availability!: boolean;

  @ApiModelProperty({
    required: true,
  })
  isDefected!: boolean;

  @ApiModelProperty({
    required: true,
    example: '1',
  })
  quantity!: number;

  @ApiModelProperty({
    required: true,
    type: 'Variant[]',
    model: 'Variant',
    example: [
      {
        name: 'name1',
        description: 'description1',
        subOptiobId: 1,
        files:'x1.jpg'
      },
      {
        name: 'name2',
        description: 'description2',
        subOptiobId: 2,
        files:'x1.jpg'

      },
    ],
  })
  variants!: string[];
}

@ApiModel({
  description: 'array of variant ids',
  name: 'DeleteVariant',
})
export class DeleteVariant {
  @ApiModelProperty({
    required: true,
    type: 'number',
    example: 1,
  })
  id!: number[];
  @ApiModelProperty({
    required: true,
    type: 'array',
    example: [1, 2, 3, 4],
  })
  variants!: number[];
}

@ApiModel({
  description: 'array of variant ids',
  name: 'UpdateVariant',
})
export class UpdateVariant {
  @ApiModelProperty({
    required: true,
    type: 'number',
    example: 1,
  })
  id!: number;
  @ApiModelProperty({
    type: 'file',
    required: true,
    description: 'The image to upload',
  })
  public files!: Express.Multer.File;
  @ApiModelProperty({
    required: true,
    type: 'array',
    model: 'Variant',
    example: [
      {
        id: 1,
        name: 'name1',
        description: 'description1',
  
          },
      {
        id: 2,
        name: 'name2',
        description: 'description2',
        files : {
          type:'Express.Multer.File'
        }
    
      },
    ],
  })
  variants!: string[];

}

export class Variant {
  @ApiModelProperty({
    required: true,
    type: 'number',
    example: 1,
  })
  id!: number[];
  @ApiModelProperty({
    required: true,
    type: 'array',
    model: 'Variant',
    example: [
      {
        name: 'name1',
        description: 'description1',
        subOptionId: 1,
      },
      {
        name: 'name2',
        description: 'description2',
        subOptionId: 2,
      },
    ],
  })
  variant!: string[];
}
