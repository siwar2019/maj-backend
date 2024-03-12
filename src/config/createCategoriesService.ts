import axios from 'axios';
import { Op } from 'sequelize';
import { Paths } from '../common/paths';
import { MSG } from '../common/responseMessages';
import {  ListCategory } from '../interfaces/category';
import { Category } from '../models/category';

// export const createCategoriesService = async () => {
//   try {
//     const arrayCategory: CategoryInterface[] = [
//       { id: 1, name: 'Man', description: 'homme', parentId: null },
//       { id: 2, name: 'Woman', description: 'femmes', parentId: null },
//       { id: 3, name: 'Kids', description: 'enfants', parentId: null },
//     ];

//     //create default categories if not exist
//     const exists = arrayCategory.map((categoryId) => {
//       return categoryId.id;
//     });
//     const findCategory = await Category.findAll({
//       where: {
//         id: {
//           [Op.in]: exists,
//         },
//       },
//     });
//     let createdCategory;
//     //checks if a category with the specified id already exists and creates it if it doesn't exist.
//     if (!findCategory || exists.length > findCategory.length) {
//       createdCategory = arrayCategory.map(
//         async (category: CategoryInterface) => {
//           await Category.findOrCreate({
//             where: { id: category.id },
//             defaults: {
//               name: category.name,
//               description: category.description,
//               parentId: null,
//             },
//           });
//         }
//       );
//       console.log({ message: MSG.CATEGORY_CREATED_SUCCUSFULLY });
//     } else {
//       console.log({ message: MSG.DEFAULT_CATEGORY_ALREADY_EXIST });
//     }
//     return;
//   } catch (error) {
//     return console.log({ message: MSG.SERVER_ERROR }, error);
//   }
// };



////// cretate category parent ///// 
export const createCategoryParentV2 = async () => {
  const list: ListCategory[] = [
    { name: 'Man', description: 'Man'},
    {  name: 'Women', description: 'Women'},
    {  name: 'Kids', description: 'Kids'},
  ];
  const getCtagoryUrl =`${process.env.ERP_URL}${Paths.GET_ALL_CATEGORIES}`
  const createCategoryUrl =`${process.env.ERP_URL}${Paths.CREATE_CATEGORY}`
  try {
    const existingCategory = await axios.get(getCtagoryUrl);
    const existingNames: string[] = existingCategory.data.map((option: any) => option.name);

    const uniqueItems = list.filter(item => !existingNames.includes(item.name));
    if(uniqueItems.length>0) {
    const createPromises = uniqueItems.map(async (item, index) => {
      try {
        const response = await axios.post(createCategoryUrl, item);
        console.log('create default category:', response.data.name);
      } catch (error) {
        console.error(`Error creating default category ${index + 1}:`, error);
      }
    });
    // Wait for all create requests to complete
    await Promise.all(createPromises);
  }else {
    console.log({ message: MSG.DEFAULT_CATEGORY_ALREADY_EXIST });
  }
  } catch (error) {
    console.error('Error:', error);
  }

}; 


