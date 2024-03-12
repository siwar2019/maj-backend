import { Router } from 'express';
import { Paths } from '../common/paths';
import OptionsController from '../controllers/options.controller';
import authAdmin from '../middleware/authAdmin';
const optionRoutes = Router();
optionRoutes.post(
  Paths.CREATE_OPTIONS_SUBOPTIONS,
  authAdmin,
  OptionsController.createOptionsSubOptions
);
optionRoutes.post(
  Paths.DELETE_OPTION_SUBOPTION,
  authAdmin,
  OptionsController.deleteOptionV2
);
optionRoutes.post(
  Paths.DELETE_SUBOPTION,
  authAdmin,
  OptionsController.deleteSubOptionV2
);
optionRoutes.post(
  Paths.ADD_SUB_OPTIONS,
  authAdmin,
  OptionsController.createSubOptionsV2
);
optionRoutes.put(
  Paths.UPDATE_SUBOPTION,
  authAdmin,
  OptionsController.updatesSubOptions
);
optionRoutes.put(Paths.UPDATE_OPTION, authAdmin, OptionsController.updateOptions);
optionRoutes.get(Paths.GET_ALL_OPTIONS, authAdmin, OptionsController.getAllOptionsV2);
optionRoutes.post(
  Paths.GET_SUBOPTION_By_OPTION,
  authAdmin,
  OptionsController.getSubOptionByOptionV2
);

export default optionRoutes;
