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
} from 'sequelize-typescript'
import { Variant } from './variant'
import { variantSubOption } from './variantSubOption'
import { Option } from './option'

@Table({
  timestamps: true,
  tableName: 'subOption',
  //paranoid:soft-delete
  paranoid: true,
})
export class SubOption extends Model {
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
  @BelongsToMany(() => Variant, () => variantSubOption)
  Variant!: Variant[]
  //1..* option-subOption
  @ForeignKey(() => Option)
  @AllowNull(true)
  @Column
  OptionId!: number

  @BelongsTo(() => Option)
  Option!: Option
}
