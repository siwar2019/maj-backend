import { Table, Model, Column, ForeignKey } from 'sequelize-typescript'
import { Product } from './product'
import { Promotion } from './promotion'
@Table({
  timestamps: true,
  tableName: 'product-promotion',
})
export class productPromotion extends Model {
  @ForeignKey(() => Product)
  @Column
  productId!: number

  @ForeignKey(() => Promotion)
  @Column
  promotionId!: number
}
