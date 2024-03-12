import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { Product } from './product'

@Table({
  timestamps: true,
  tableName: 'reviews',
})
export class Reviews extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  comment!: string
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  stars!: Number
  //1* product reviews
  @ForeignKey(() => Product)
  @AllowNull(true)
  @Column
  ProductId!: number

  @BelongsTo(() => Product)
  Product!: Product
}
