import {ApiModel, ApiModelProperty} from 'swagger-express-ts';

@ApiModel({
  description: 'Model description',
  name: 'customerLogin',
})
export class customerLogin {
  @ApiModelProperty({
    description: 'email',
    required: true,
    example: 'siwarbougrine2@gmail.com',
  })
  email!: string;

  @ApiModelProperty({
    description: 'name of model',
    required: true,
    example: 'azerty1*',
  })
  password!: string;

}
