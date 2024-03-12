import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import {Product} from './product';
import {productCategory} from './productCategory';

@Table({
  timestamps: true,
  tableName: 'category',
})
  export class Category extends Model {
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
  
  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description!: string;
  
  //a self-referencing foreign key parentId 
  @ForeignKey(() => Category) // Add onDelete option here
  @Column
  parentId!: number ;
  
  @BelongsTo(() => Category, { onDelete: 'CASCADE' })
  parent!: Category;
  
  @HasMany(() => Category, 'parentId')
  children!: Category[];
 
  
  //1..* product-category
  @BelongsToMany(() => Product, () => productCategory)
  product!: Product[];
}
