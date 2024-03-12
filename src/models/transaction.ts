import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { EnumType } from 'typescript';
import { Admin } from './admin';
import { Costumer } from './customer';

@Table({
  timestamps: true,
  tableName: 'transactions',
})
export class Transactions extends Model {
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
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount!: Number;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.ENUM('cash', 'Credit card', 'Bank transfer'),
  })
  payementMethod!: EnumType;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  receipRef!: string;
  //1..n user-transaction
    //1..n customer-transaction

  @ForeignKey(() => Costumer)
  @AllowNull(true)
  @Column
  CustomerId!: number
    //1..n admin-transaction
  @ForeignKey(() => Admin)
  @AllowNull(true)
  @Column
  AdminId!: number
}
