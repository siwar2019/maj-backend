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
} from 'sequelize-typescript'
import { SubOption } from './subOption'

@Table({
  timestamps: true,
  tableName: 'option',
  //paranoid:soft-delete
  paranoid: true,
})
export class Option extends Model {
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
  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string
    //paranoid attribute
    @AllowNull(true)
    @NotEmpty
    @Column({
      type: DataType.DATE,
      allowNull: true,
    })
    deletedAt!: string;

  //1..* option-subOption
  @HasMany(() => SubOption)
  SubOption!: SubOption[]
}
