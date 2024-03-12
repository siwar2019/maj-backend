import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
@ApiModel({
  description: 'option suboption',
  name: 'OptionSubOption',
})
export class OptionSubOption {
  @ApiModelProperty({
    required: true,
    example: 'Size',
  })
  name!: string;

  @ApiModelProperty({
    required: true,
    example: 'size of a  sweater',
  })
  description!: string;
  @ApiModelProperty({
    required: true,
    type: 'array',
    model: 'subOption',
    example: [
      {
        name: 'L',
        description: 'Large ',
      },
      {
        name: 'XL',
        description: 'x large',
      },
    ],
  })
  subOptionList!: string[];
}
@ApiModel({
  description: 'delete option suboption',
  name: 'DeleteOptionSubOption',
})
export class DeleteOptionSubOption {
  @ApiModelProperty({
    required: true,
    example: 1,
  })
  idOption!: number;
}
@ApiModel({
  description: 'delete suboption',
  name: 'DeleteSubOption',
})
export class DeleteSubOption {
  @ApiModelProperty({
    required: true,
    example: 1,
  })
  id!: number;
}

@ApiModel({
  description: 'option suboption',
  name: 'SubOptions',
})
export class SubOptions {
  @ApiModelProperty({
    required: true,
    example: 1,
  })
  id!: number;
  @ApiModelProperty({
    required: true,
    type: 'array',
    model: 'subOption',
    example: [
      {
        name: 'L',
        description: 'Large ',
      },
      {
        name: 'XL',
        description: 'x large',
      },
    ],
  })
  addSuboptions!: string[];
}
@ApiModel({
  description: 'update suboption',
  name: 'UpdateSubOption',
})
export class UpdateSubOption {
  @ApiModelProperty({
    required: true,
    example: 1,
  })
  id!: number;
  @ApiModelProperty({
    required: true,
    example: "red",
  })
  name!: string;
  @ApiModelProperty({
    required: true,
    example: "update color to red",
  })
  description!: string;
}
@ApiModel({
  description: 'Get Sub Option By Option',
  name: 'GetSubOptionByOption',
})
export class GetSubOptionByOption {
  @ApiModelProperty({
    required: true,
    example: 1,
  })
  id!: number;
}