import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import {Order} from './order';
import { Transactions } from './transaction';
import { Adress } from './address';
import { Returns } from './return';

@Table({
  timestamps: true,
  tableName: 'customer',
})
export class Costumer extends Model {
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
  firstName!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    
    allowNull: true,
  })
  lastName!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;
  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone!: string;
  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: false,
  })
  gender!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  birthDay!: string;
  //1..n costmer-order

  @HasMany(() => Order)
  order!: Order[];
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resetLink!: string;


  
  //1..N customer transaction
  @HasMany(() => Transactions)
  Transactions!: Transactions[] ;
      // 1..N  costumer address
      @HasMany(() => Adress)
      Adress!: Adress[]
//customer returns
      @HasMany(() => Returns)
      returns!: Returns[];
}
