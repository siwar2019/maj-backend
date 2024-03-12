import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { orderVariant } from './orderVariant';
import { Order } from './order';
import { SubOption } from './subOption';
import { variantSubOption } from './variantSubOption';
import { Product } from './product';
@Table({
  timestamps: true,
  tableName: 'variant',
  //paranoid:soft-delete
  paranoid: true,
})
export class Variant extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.JSON,

    allowNull: false,
  })
  image!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: Number;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  referenceVariant!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sizeId!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  colorId!: string;

  //relation M..N ORDER VARIANT

  @BelongsToMany(() => Order, () => orderVariant)
  order!: Order[];
  //variant subOption  M..N
  @BelongsToMany(() => SubOption, () => variantSubOption)
  SubOption!: SubOption[];
  //1..* product variant
  @ForeignKey(() => Product)
  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  productId!: number;

  //paranoid attribute
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt!: string;

  @BelongsTo(() => Product)
  Product!: Product;
}
