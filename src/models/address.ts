import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Costumer } from './customer';

@Table({
  timestamps: true,
  tableName: 'adress',
    //paranoid:soft-delete
    paranoid: true,
})

export class Adress extends Model {
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
  address!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastname!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  telephone!: number;
  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  additionalInformation!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  state!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  postalCode !: number;
  //1..n costumer-address
  @ForeignKey(() => Costumer)
  @AllowNull(true)
  @Column
  customerId!: number;
}
