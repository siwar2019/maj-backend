import { Table, Model, Column, ForeignKey } from 'sequelize-typescript'

import { Order } from './order'
import { Packaging } from './packaging'
@Table({
  timestamps: true,
  tableName: 'order-Packaging',
})
export class orderPackaging extends Model {
  @ForeignKey(() => Order)
  @Column
  orderId!: number

  @ForeignKey(() => Packaging)
  @Column
  packagingId!: number
}
