import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { Admin } from './admin'
import { Access } from './access'
import { Menu } from './menu'

@Table({
  timestamps: true,
  tableName: 'privilege',
})
export class Privilege extends Model {
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
  privilegeName!: string
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description!: string

  @HasMany(() => Admin)
  Admin!: Admin

  @HasMany(() => Access)
  access!: Access
   //relation M..N BETWEEN PREVILEGE MENU

   @BelongsToMany(() => Menu, () => Access)
   Menu!: Menu[]
}
