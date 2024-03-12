import { Router } from 'express'
import AdminController from '../controllers/admin.controller'
import { Paths } from '../common/paths'
import authAdmin from '../middleware/authAdmin'
const adminRoutes = Router()
adminRoutes.post(Paths.LOGIN_ADMIN,AdminController.loginV2)
adminRoutes.post(Paths.REGISTER_AGENT,authAdmin, AdminController.register)
adminRoutes.put(Paths.FORGOT_PASSWORD_ADMIN, AdminController.forgetPassword)
adminRoutes.post(Paths.RESET_PASSWORD_ADMIN, AdminController.resetPassword)
adminRoutes.put(Paths.CHANGE_PASSWORD_ADMIN,authAdmin, AdminController.changePasswordV2)
adminRoutes.put(Paths.UPDATE_PERSONAL_INFORMATION,authAdmin, AdminController.updatePersonalInformation)
adminRoutes.get(Paths.GET_USER_INFORMATION,authAdmin, AdminController.getAllUserInformation)

export default adminRoutes
