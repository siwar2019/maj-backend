import { Table, Model, Column, ForeignKey } from 'sequelize-typescript'
import { Product } from './product'
import { Category } from './category'
@Table({
  timestamps: true,
  tableName: 'product-category',
})
export class productCategory extends Model {
  @ForeignKey(() => Product)
  @Column
  productId!: number

  @ForeignKey(() => Category)
  @Column
  categoryId!: number
}
