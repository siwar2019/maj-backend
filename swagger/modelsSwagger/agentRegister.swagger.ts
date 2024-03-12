import { ApiModel, ApiModelProperty } from 'swagger-express-ts'

@ApiModel({
  description: 'Model description',
  name: 'AgentRegister',
})
export class AgentRegister {
  @ApiModelProperty({
    description: 'firstName of Agent',
    required: true,
    example: 'firstName',
    type: 'string',
  })
  firstName!: string
  @ApiModelProperty({
    description: 'lastName of Agent',
    required: true,
    example: 'lastName',
    type: 'string',
  })
  lastName!: string
  @ApiModelProperty({
    description: 'email',
    required: true,
    example: 'email@gmail.com',
    type: 'string',
  })
  email!: string

  @ApiModelProperty({
    description: 'password of Agent',
    required: true,
    example: 'azerty123',
  })
  password!: string
  @ApiModelProperty({
    description: 'phone of Agent',
    required: true,
    example: '98111222',
    type: 'number',
  })
  phone!: number
  @ApiModelProperty({
    description: 'privilege Id of Agent',
    required: true,
    example: '1',
    type: 'number',
  })
  privilegeId!: number
}
