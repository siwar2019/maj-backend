import {ApiModel, ApiModelProperty} from 'swagger-express-ts';

@ApiModel({
  description: 'Model description',
  name: 'customerRegister',
})
export class customerRegister {
  @ApiModelProperty({
    description: 'name of model',
    required: true,
    example: 'siwar',
  })
  firstName!: string;
  @ApiModelProperty({
    description: 'name of model',
    required: true,
    example: 'bb',
  })
  lastName!: string;
  @ApiModelProperty({
    description: 'email',
    required: true,
    example: 'email@gmail.com',
  })
  email!: string;

  @ApiModelProperty({
    description: 'name of model',
    required: true,
    example: 'azerty123',
  })
  password!: string;
  @ApiModelProperty({
    description: 'name of model',
    required: true,
    example: '98111222',
  })
  phone!: string;
  @ApiModelProperty({
    description: 'name of model',
    required: true,
    example: 'tunisia',
  })
  address!: string;
  @ApiModelProperty({
    description: 'name of model',
    required: true,
    example: 'true',
  })
  gender!: string;
  @ApiModelProperty({
    description: 'name of model',
    required: true,
    example: '2023-05-17',
  })
  birthDay!: string;
}
