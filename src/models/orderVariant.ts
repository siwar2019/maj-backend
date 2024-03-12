import { Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Order } from './order'
import { Variant } from './variant'

@Table({
  timestamps: true,
  tableName: 'order-Variant',
})
export class orderVariant extends Model {
  @ForeignKey(() => Order)
  @Column
  orderId!: number

  @ForeignKey(() => Variant)
  @Column
  variantId!: number
}
