import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { EnumType } from 'typescript'

@Table({
  timestamps: true,
  tableName: 'income',
})
export class Income extends Model {
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
  name!: string
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status!: string
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: string

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount!: Number

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.ENUM('cash', 'Credit card', 'Bank transfer'),
  })
  payementMethod!: EnumType
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  receipRef!: string
}
