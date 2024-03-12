import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { EnumType } from 'typescript'
import { Order } from './order'
import { orderPackaging } from './orderPackaging'

@Table({
  timestamps: true,
  tableName: 'packaging',
})
export class Packaging extends Model {
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
  width!: Number
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  height!: Number
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.ENUM('New', 'Packing', 'Packed', 'Deliviring', 'Complete'),
  })
  status!: EnumType
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cost!: Number
  //relation N..M ORDER PACKAGING

  @BelongsToMany(() => Order, () => orderPackaging)
  order!: Order[]
}
