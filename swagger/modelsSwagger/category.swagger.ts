import {ApiModel, ApiModelProperty} from 'swagger-express-ts';

@ApiModel({
  description: ' category/subcategory',
  name: 'createCategory',
})
export class createCategory {
  @ApiModelProperty({
    description: 'category name',
    required: true,
    example: 'clothes',
  })
  name!: string;

  @ApiModelProperty({
    description: 'description category',
    required: false,
    example: 'clothes man/women',
  })
  description!: string;

  @ApiModelProperty({
    description: 'description category',
    required: true,
    example: '1',
  })
  parentId!: number;
}
// update swagger model for Category
@ApiModel({
  description: 'add category/subcategory',
  name: 'UpdateCategory',
})
export class UpdateCategory {
  @ApiModelProperty({
    required: true,
    type: 'string',
    example: '1',
  })
  id!: string;

  @ApiModelProperty({
    description: 'category name',
    required: true,
    example: 'clothes',
  })
  name!: string;

  @ApiModelProperty({
    description: 'description category',
    required: false,
    example: 'clothes man/women',
  })
  description!: string;
}
//delete category
@ApiModel({
  description: 'delete category/subcategory',
  name: 'DeleteCategory',
})
export class DeleteCategory {
  @ApiModelProperty({
    description: 'id categorie/succategory',
    required: true,
    example: '1',
  })
  id!: string;
}
