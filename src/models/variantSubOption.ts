import {
  Table,
  Model,
  Column,
  ForeignKey,
  AllowNull,
  NotEmpty,
  DataType,
} from 'sequelize-typescript';

import {Variant} from './variant';
import {SubOption} from './subOption';
@Table({
  timestamps: true,
  tableName: 'variant-subOption',
  //paranoid:soft-delete
  paranoid: true,
})
export class variantSubOption extends Model {
  @ForeignKey(() => Variant)
  @Column
  variantId!: number;

  @ForeignKey(() => SubOption)
  @Column
  subOptionId!: number;

  //paranoid attribute
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt!: string;
}
