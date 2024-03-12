import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'get all orders',
  name: 'getAllOrders',
})
export class Orders {
  @ApiModelProperty({
    required: true,
    example: 1,
  })
  id!: number;

  @ApiModelProperty({
    description: 'totalPrice',
    required: true,
    example: '10',
  })
  totalPrice!: number;
  @ApiModelProperty({
    description: 'totalPrice',
    required: true,
    example: '10',
  })
  quantity!: number;

  @ApiModelProperty({
    description: 'shipping Method ',
    required: true,
    example: 'Aramex',
  })
  shippingMethod!: string;
  @ApiModelProperty({
    description: 'order Date ',
    required: true,
    example: 'Aramex',
  })
  orderDate!: Date;

  @ApiModelProperty({
    description: 'discount  ',
    required: false,
    example: '10',
  })
  discountAppliey!: number;
  @ApiModelProperty({
    description: 'status order',
    required: false,
    example: 'pending',
  })
  status!: string;
  @ApiModelProperty({
    description: 'note',
    required: false,
    example: 'notes',
  })
  notes!: string;
  @ApiModelProperty({
    description: 'reference',
    required: true,
    example: 'reference',
  })
  ref!: string;
}


@ApiModel({
  description: 'update order status ',
  name: 'UpdateOrderStatus',
})
export class UpdateOrderStatus {
  @ApiModelProperty({
    required: true,
    example: 1,
  })
  orderId!: number;

  @ApiModelProperty({
    description: 'status',
    required: true,
    example: 'Canceled',
  })
  updatedStatus!: string;

}



