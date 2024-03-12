import { Op } from "sequelize";
import { MSG } from "../common/responseMessages";
import { Option } from "../models/option";
import axios from "axios";
import { ListItem } from "../interfaces/options";
import { Paths } from "../common/paths";

//export const createOptionsService = async () => {
// const optionsList = [
//   {
//     id: 1,
//     name: "color",
//     description: "color of product",
//   },
//   {
//     id: 2,
//     name: "size",
//     description: "size of product",
//   },
// ];
// export const createOptionsService = async () => {
  // const findOptions = await Option.findAll({
  //   where: {
  //     id: {
  //       [Op.in]: [1, 2],
  //     },
  //   },
  // });
  // if (findOptions.length === 0) {
  //   console.log(MSG.Options_Successfully_reated);

  //   optionsList.map(async (option) => {
  //     await Option.findOrCreate({
  //       where: { id: option.id },
  //       defaults: {
  //         id: option.id,
  //         name: option.name,
  //         description: option.description,
  //       },
  //     });
  //   });
  // } else if (findOptions.length === 1) {
  //   const missingId = optionsList.find(
  //     (option) =>
  //       !findOptions.some((existingOption) => existingOption.id === option.id)
  //   );

  //   if (missingId) {
  //     console.log(`Creating missing option with id ${missingId.id}`);

  //     await Option.create({
  //       id: missingId.id,
  //       name: missingId.name,
  //       description: missingId.description,
  //     });
  //   }
  // } else {
  //   console.log(MSG.Options_Already_Exists);
  // }
//}

//ERP 
export const createOptionsServiceV2 = async (res:any) => {
  const token=res.locals.access_token
  const list: ListItem[] = [
    {
      name: "Color",
    },
    {
      name: "Size",
    },
  ];
  const getOptionsUrl =`${process.env.ERP_URL}${Paths.GET_LIST_OPTIONS}`
  const createOptionUrl =`${process.env.ERP_URL}${Paths.CREATE_OPTION}`
  try {
    const existingOptions = await axios.get(getOptionsUrl,      {
      headers: {
       'Authorization': token.access_token,
        'Content-Type': 'application/json',
      },
    });
    const existingNames: string[] = existingOptions.data.map((option: any) => option.name);

    const uniqueItems = list.filter(item => !existingNames.includes(item.name));
    if(uniqueItems.length>0) {
    const createPromises = uniqueItems.map(async (item, index) => {
      try {
        const response = await axios.post(createOptionUrl, item,{
          headers: {
           'Authorization': token.access_token,
            'Content-Type': 'application/json',
          },
        });
        console.log('create default options:', response.data.name);
      } catch (error) {
        console.error(`Error creating default options for item ${index + 1}:`, error);
      }
    });
    // Wait for all create requests to complete
    await Promise.all(createPromises);
  }else {
    console.log({ message: MSG.DEFAULT_OPTIONS_ALREADY_EXIST });
  }
  } catch (error) {
    console.error('Error:', error);
  }

};


