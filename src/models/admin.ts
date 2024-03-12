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
} from 'sequelize-typescript'
import { Privilege } from './privilege'
import { Transaction } from 'sequelize'
import { Transactions } from './transaction'

@Table({
  timestamps: true,
  tableName: 'admin',
})
export class Admin extends Model {
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
  firstName!: string

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName!: string

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone!: string
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dateOfBirth!: string
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: false,
  })
  gender!: string;
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resetToken!: string

  @ForeignKey(() => Privilege)
  @AllowNull(true)
  @Column
  privilegeId!: number

  @BelongsTo(() => Privilege)
  Privilege!: Privilege[]
//1..N admin..transaction
  @HasMany(() => Transactions)
  Transactions!: Transactions[]
}
