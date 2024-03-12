import { ApiModel, ApiModelProperty } from 'swagger-express-ts'

@ApiModel({
  description: 'admin description',
  name: 'AdminLogin',
})
export class AdminLogin {
  @ApiModelProperty({
    description: 'email of Admin',
    required: true,
    example: 'siwarbougrine2@gmail.com',
  })
  email!: string

  @ApiModelProperty({
    description: 'password of Admin',
    required: true,
    example:'majadmin'
  })
  password!: string
}
