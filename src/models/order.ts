import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { EnumType } from 'typescript'
import { Packaging } from './packaging'
import { orderPackaging } from './orderPackaging'
import { Variant } from './variant'
import { orderVariant } from './orderVariant'
import { Costumer } from './customer'
import { Returns } from './return'

@Table({
  timestamps: true,
  tableName: 'order',
})
export class Order extends Model {
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  totalPrice!: Number

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: Number
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.ENUM('ARAMEX', 'GLOVO','EXPRESS'),
  })
  shippingMethod!: EnumType
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  orderDate!: string
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  discountAppliey!: Number
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.ENUM('Pending', 'Confirmed', 'Canceled'),
  })
  status!: EnumType
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  notes!: string
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ref!: string
  //relation N..M ORDER PACKAGING

  @BelongsToMany(() => Packaging, () => orderPackaging)
  packaging!: Packaging[]
  //relation M..N ORDER VARIANT
  @BelongsToMany(() => Variant, () => orderVariant)
  variant!: Variant[]
  //1..n costmer-order

  @ForeignKey(() => Costumer)
  @AllowNull(false)
  @Column
  costumerId!: number
  @BelongsTo(() => Costumer)
  Costumer!: Costumer
}
