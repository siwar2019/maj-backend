import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Privilege } from './privilege';
import { Menu } from './menu';

@Table({
  timestamps: true,
  tableName: 'access',
})
export class Access extends Model {
  @ForeignKey(() => Privilege)
  @Column
  privilegeId!: number;

  @ForeignKey(() => Menu)
  @Column
  menuId!: number;

  @AllowNull(false)
  @Default(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  create!: boolean;

  @AllowNull(false)
  @Default(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  read!: boolean;

  @AllowNull(false)
  @Default(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  modify!: boolean;

  @AllowNull(false)
  @Default(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  delete!: boolean;

  @BelongsTo(() => Privilege)
  privilege!: Privilege;
}
