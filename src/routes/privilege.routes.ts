import { Router } from 'express';
import { Paths } from '../common/paths';
import PrivilegeController from '../controllers/privilege.controller';
import authAdmin from '../middleware/authAdmin';

const privilegeRoutes = Router();
privilegeRoutes.post(
  Paths.CREATE_NEW_MENU_ITEM,
  authAdmin,
  PrivilegeController.createNewMenuItem
);
privilegeRoutes.post(
  Paths.CREATE_NEW_PRIVULEGE,
  authAdmin,
  PrivilegeController.createNewPrivilege
);
privilegeRoutes.put(
  Paths.AFFECT_PRIVILEGE_TO_AGENT,
  authAdmin,
  PrivilegeController.affectPrivilegeToAgent
);
privilegeRoutes.get(
  Paths.GET_AGENT_ACCESS,
  authAdmin,
  PrivilegeController.getAgentAccess
);
privilegeRoutes.put(
  Paths.UPDATE_PRIVILEGE,
  authAdmin,
  PrivilegeController.updatePrivilege
);

export default privilegeRoutes;
