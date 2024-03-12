import { ApiModel, ApiModelProperty } from 'swagger-express-ts'

@ApiModel({
  description: 'create customer address',
  name: 'createAddress',
})
export class createAddress {
  @ApiModelProperty({
    description: 'adress  of a customer',
    required: true,
    example: 'ksouressef-mahdia ',
  })
  address!: string
  @ApiModelProperty({
    description: 'firstName  of a customer',
    required: true,
    example: 'siwar',
  })
  firstName!: string
  @ApiModelProperty({
    description: 'lastName  of a customer',
    required: true,
    example: 'b',
  })
  lastname!: string
  @ApiModelProperty({
    description: 'telephone number of a customer',
    required: true,
    example: 23558800,
  })
  telephone!: number
  @ApiModelProperty({
    description: 'city  of a customer',
    required: true,
    example: "ksour essef",
  })
  city!: string
  @ApiModelProperty({
    description: 'state  of a customer',
    required: true,
    example: "mahdia",
  })
  state!: string
  @ApiModelProperty({
    description: 'postalCode  of a customer',
    required: true,
    example: 5180,
  })
  postalCode!: number
  @ApiModelProperty({
    description: 'additionalInformation  of a customer',
    required: true,
    example: "notes",
  })
  additionalInformation!: string
}

@ApiModel({
    description: 'admin description',
    name: 'UpdateCustomerAdress',
  })
  export class UpdateCustomerAdress {

    @ApiModelProperty({
        description: 'adress  of a customer',
        required: true,
        example: 'ksouressef-mahdia ',
      })
      address!: string
      @ApiModelProperty({
        description: 'firstName  of a customer',
        required: true,
        example: 'siwar',
      })
      firstName!: string
      @ApiModelProperty({
        description: 'lastName  of a customer',
        required: true,
        example: 'b',
      })
      lastName!: string
      @ApiModelProperty({
        description: 'telephone number of a customer',
        required: true,
        example: 23558800,
      })
      telephone!: number
      @ApiModelProperty({
        description: 'city  of a customer',
        required: true,
        example: "ksour essef",
      })
      city!: string
      @ApiModelProperty({
        description: 'state  of a customer',
        required: true,
        example: "mahdia",
      })
      state!: string
      @ApiModelProperty({
        description: 'postalCode  of a customer',
        required: true,
        example: 5180,
      })
      postalCode!: number
      @ApiModelProperty({
        description: 'additionalInformation  of a customer',
        required: true,
        example: "notes",
      })
      additionalInformation!: string
      @ApiModelProperty({
        description: 'additionalInformation  of a customer',
        required: true,
        example: 1,
      })
      adressId!: number

  }
  @ApiModel({
    description: 'delete address',
    name: 'DeleteCustomerAdress',
  })
  export class DeleteCustomerAdress {
    @ApiModelProperty({
      description: 'id  of a adress',
      required: true,
      example: 1,
    })
    id!: number
  }
  @ApiModel({
    description: 'get all address',
    name: 'getAllAdress',
  })
  export class getAllAdress {
    @ApiModelProperty({
      description: 'id  of a adress',
      required: true,
      example: 1,
    })
    id!: number
    @ApiModelProperty({
      description: ' adress',
      required: true,
      example: 'ksour essef-mahdia',
    })
    address!: number
  
  }
