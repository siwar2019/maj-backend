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
import { Product } from './product'
import { productPromotion } from './productPromotion'

@Table({
  timestamps: true,
  tableName: 'promotion',
})
export class Promotion extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name!: string
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description!: string
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate!: string
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate!: string

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  discount!: string

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  active!: boolean
  @BelongsToMany(() => Product, () => productPromotion)
  Product!: Product[]
}
