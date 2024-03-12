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
import { Costumer } from './customer'
import { Order } from './order'
  
  @Table({
    timestamps: true,
    tableName: 'returns',
  })
  export class Returns extends Model {
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
    raison!: string
  
 //customer return
    @ForeignKey(() => Costumer)
    @AllowNull(false)
    @Column
    costumerId!: number
  
    @BelongsTo(() => Costumer)
    Costumer!: Costumer
    //order returns
    @ForeignKey(() => Order)
    @AllowNull(false)
    @Column
    orderId!: number
  
    @BelongsTo(() => Order)
    Order!: Order
  }
  