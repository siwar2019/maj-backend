import { Router } from 'express'
import path from 'path'
import { Paths } from '../common/paths'
import 
CustomerController
 from '../controllers/customer.controller'
import auth from '../middleware/authCustomer'
const costumerRoutes = Router()

costumerRoutes.post(Paths.REGISTER_COSTUMER,CustomerController.registerCustomer)
costumerRoutes.post(Paths.LOGIN_COSTUMER,CustomerController.login)
costumerRoutes.put(Paths.FORGOT_PASSWORD,CustomerController.forgetPassword)
costumerRoutes.post(Paths.RESET_PASSWORD,CustomerController.resetPassword)
costumerRoutes.post(Paths.UPDATE_PERSONAL_INFORMATION_COSTUMER,auth, CustomerController.updatePersonalInformationCostumer)
costumerRoutes.get(Paths.GET_CURRENT_USER, auth,CustomerController.getCurrentUser )
costumerRoutes.post(Paths.SEND_EMAIL_NEWS_LETTER,CustomerController.newLetters )
costumerRoutes.post(Paths.CHANGE_PASSWORD_COSTUMER,auth,CustomerController.changePassword )





export default costumerRoutes
