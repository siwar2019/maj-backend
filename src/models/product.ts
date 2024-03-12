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
} from 'sequelize-typescript';
import {Category} from './category';
import {productCategory} from './productCategory';
import {Promotion} from './promotion';
import {productPromotion} from './productPromotion';
import {Reviews} from './reviews';
import {Variant} from './variant';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'product',
})
export class Product extends Model {
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
  name!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price!: Number;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  availability!: boolean;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isDefected!: boolean;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ref!: string;
  @BelongsToMany(() => Category, () => productCategory)
  Category!: Category[];
  @BelongsToMany(() => Promotion, () => productPromotion)
  Promotion!: Promotion[];
  //1.* product reviews
  @HasMany(() => Reviews)
  Reviews!: Reviews[];
  //1..* product variant
  @HasMany(() => Variant)
  Variant!: Variant[];

  //paranoid attribute
  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt!: string;
}
