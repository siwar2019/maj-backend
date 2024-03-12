import { ApiModel, ApiModelProperty } from 'swagger-express-ts'

@ApiModel({
  description: 'Model description',
  name: 'forgotPassword',
})
export class forgotPassword {
  @ApiModelProperty({
    description: 'email',
    required: true,
    example: 'email@gmail.com',
  })
  email!: string
}
