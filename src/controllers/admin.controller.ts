import { Request, Response } from "express";
import { Admin } from "../models/admin";
import {
  errorServerResponse,
  failResponse,
} from "../common/functions";
import { MSG } from "../common/responseMessages";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Privilege } from "../models/privilege";
import { ApiPath, ApiOperationPost, ApiOperationPut } from "swagger-express-ts";
import { AdminLogin } from "../../swagger/modelsSwagger/adminLogin.swagger";
import { AgentRegister } from "../../swagger/modelsSwagger/agentRegister.swagger";
import { successResponse } from "../common/functions";
import { Paths } from "../common/paths";
import { forgotPassword } from "../../swagger/modelsSwagger/forgotPassword.swagger";
import { resetPassword } from "../../swagger/modelsSwagger/resetPassword.swagger";
import { ServerResponse } from "http";
import axios from "axios";
import { generateEmail } from "../nodeMailer/messgeEmail";
import mail from "../nodeMailer/emailConfig";
import { createOptionsServiceV2 } from "../config/createOptionsService";
import { createCategoryParentV2 } from "../config/createCategoriesService";

@ApiPath({
  path: "",
  name: "Admin",
  security: { basicAuth: [] },
})
export class AdminController {
  public static TARGET_NAME: string = "AdminController";
  /* swagger API Login */
  @ApiOperationPost({
    description: "login admin",
    summary: "login admin",
    path: Paths.LOGIN_ADMIN,
    parameters: {
      body: {
        description: "admin",
        required: true,
        model: "AdminLogin",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(AdminLogin) },
      400: { description: `${MSG.WRONG_CREDENTIALS} || ${MSG.NOT_FOUND}` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  /* API Login */
  async loginV2(req: Request, res: Response) {
    //connect as erp user in order to get access_token
    const userName = process.env.ADMIN_EMAIL
    const pass = process.env.ADMIN_PASSWORD
    const { email, password } = req.body;
    if (!email || !password) {
      return failResponse(res, MSG.MISSING_DATA)
    }
    const credentials = {
      username: email,
      password: password,
      rememberMe: false
    };
    const role = "Admin";
    const apiUrl =`${process.env.ERP_URL}${Paths.WIND_AUTH}`
  if(userName===email) {
      axios.post(apiUrl, credentials)
        .then(async response => {
          // Handle successful response
          console.log('Response data:', response.data);
          //create default options if not exist
          await createOptionsServiceV2(res);
          //create default categories if not exist
          return successResponse(res, { access_token: response.data.access_token, user: response.data, role });

        })
        .catch(error => {
          // Handle errors
          console.error('Error sending data:', error);
          return failResponse(res, MSG.WRONG_CREDENTIALS);

        });
    } else {
      return failResponse(res, MSG.WRONG_CREDENTIALS);

    }
  }

  async login(req: Request, res: Response) {
    try {
      const role = "Admin";
      const { email, password, rememberMe } = req.body;
      // Check if the user exists
      const user = await Admin.findOne({
        where: { email: email.toLowerCase() },
        include: {
          model: Privilege,
          as: "Privilege",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      });
      if (!user) {
        return failResponse(res, MSG.VERIFY_CREDENTIALS);
      }

      // Check if the password is correct
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return failResponse(res, MSG.WRONG_CREDENTIALS);
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1440m",
      });

      // Omit fields from the user object
      const userData = user?.toJSON();
      delete userData?.password;
      delete userData?.resetToken;
      delete userData?.privilegeId;
      delete userData?.createdAt;
      delete userData?.updatedAt;

      return successResponse(res, { token: token, user: userData, role });
    } catch (error) {
      console.error(error);
      return errorServerResponse(res, error);
    }
  }
  /* swagger API Register */
  @ApiOperationPost({
    description: "Register agent",
    summary: "Register agent",
    path: Paths.REGISTER_AGENT,
    parameters: {
      body: {
        description: "agent",
        required: true,
        model: "AgentRegister",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(AgentRegister) },
      400: {
        description: `${MSG.MISSING_DATA} || ${MSG.WRONG_PRIVILEGE} || ${MSG.EMAIL_EXISTS} `,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  /* API Register */
  async register(req: Request, res: Response) {
    try {
      // Get user input
      const { firstName, lastName, email, password, phone, privilegeId } =
        req.body;
      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !phone ||
        !privilegeId
      ) {
        return failResponse(res, MSG.MISSING_DATA);
      }

      // Check if user already exist
      const oldUser = await Admin.findOne({ where: { email } });

      if (oldUser) {
        return failResponse(res, MSG.EMAIL_EXISTS);
      }
      const privilege = await Privilege.findByPk(privilegeId);

      // Check if privilege exisit
      if (!privilege) {
        return failResponse(res, MSG.WRONG_PRIVILEGE);
      }

      // Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);
      // Create user in database
      const user = await Admin.create({
        firstName,
        lastName,
        phone,
        email: email.toLowerCase(),
        password: encryptedPassword,
        privilegeId: privilege.id,
      });
      // Omit the password field from the user object
      const userData = user?.toJSON();
      delete userData?.password;
      delete userData?.resetToken;

      return successResponse(res, userData);
    } catch (error) {
      console.log(error);
      return errorServerResponse(res, error);
    }
  }

  /* swagger API forget password */
  @ApiOperationPut({
    description: "forget password",
    summary: "forget password",
    path: Paths.FORGOT_PASSWORD_ADMIN,
    parameters: {
      body: {
        description: "agent",
        required: true,
        model: "forgotPassword",
      },
    },
    responses: {
      200: {
        description: MSG.RESET_SUCCESSFUL,
        model: JSON.stringify(forgotPassword),
      },
      400: { description: `${MSG.USER_NOT_EXIST} || ${MSG.MISSING_DATA}` },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  /* API forget password */
  async forgetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      // Find user by email
      const user = await Admin.findOne({ where: { email } });
      if (!user) {
        return failResponse(res, MSG.USER_NOT_EXIST);
      }

      // Generate password reset token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "20m",
        }
      );

      // Update user with reset token
      await Admin.update({ resetToken: token }, { where: { email } });

      // Generate the email HTML content
      const emailHTML = await generateEmail(user.email, user.firstName, token);

      // Send the email
      await mail(user.email, "Password Reset", emailHTML);

      return successResponse(res, []);
    } catch (error) {
      console.log(error);
      return errorServerResponse(res, error);
    }
  }

  /* swagger API Reset Password */
  @ApiOperationPost({
    description: "Reset Password",
    summary: "Reset Password",
    path: Paths.RESET_PASSWORD_ADMIN,
    parameters: {
      body: {
        description: "agent",
        required: true,
        model: "resetPassword",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(resetPassword),
      },
      400: {
        description: `${MSG.INVALID_TOKEN} || ${MSG.MISSING_DATA}`,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  /* API Reset Password */
  async resetPassword(req: Request, res: Response) {
    try {
      const { newPassword, resetLink } = req.body;

      if (!newPassword) {
        return failResponse(res, MSG.MISSING_DATA);
      }

      // Find user by reset token
      const user = await Admin.findOne({
        where: {
          resetToken: resetLink,
        },
      });

      if (!user) {
        return failResponse(res, MSG.INVALID_TOKEN);
      }

      // Encrypt user password
      const encryptedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password and clear reset token
      await user.update({ resetToken: null, password: encryptedPassword });

      return successResponse(res, {});
    } catch (error) {
      console.log(error);
      return errorServerResponse(res, error);
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const currentUser = res.locals.currentUser;
      const { password, newPassword } = req.body;
      if (!password || !newPassword) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const checkPassword = await bcrypt.compare(
       password,
       currentUser.password
       );
      if (!checkPassword) {
        return failResponse(res, MSG.REAL_PASSWORD);
      }
      //check if  password and new password are differant
      if (password === newPassword) {
        return failResponse(res, MSG.DIFFERANT_PASSWORD);
      }

      // Encrypt new  password
      const salt = bcrypt.genSaltSync(10);
      const encryptedNewPassword = bcrypt.hashSync(newPassword, salt);
      await Admin.update(
        { password: encryptedNewPassword },
        { where: { id: currentUser.id } }
      );
      return successResponse(res, MSG.PASSWORD_CHANGED);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  async changePasswordV2(req: Request, res: Response) {
    try {
      const currentUser = res.locals.currentUser;
      const { password, newPassword,uuid } = req.body;
      if (!password || !newPassword) {
        return failResponse(res, MSG.MISSING_DATA);
      }

      const checkPassword = await bcrypt.compare(
       password,
       res.locals.password.password
      );
      if (!checkPassword) {
        return failResponse(res, MSG.REAL_PASSWORD);
      }
      //check if  password and new password are differant
      if (password === newPassword) {
        return failResponse(res, MSG.DIFFERANT_PASSWORD);
      }

      // Encrypt new  password
      const salt = bcrypt.genSaltSync(10);
      const encryptedNewPassword = bcrypt.hashSync(newPassword, salt);
      //change password in ERP's database

      const updatePasswordUrl =`${process.env.ERP_URL}${Paths.CHANGE_PASSWORD}${uuid}`
      const credentials ={
        confirmedPassword: newPassword,
        newPassword: newPassword,
        oldPassword: password
      }
      const token = res.locals.access_token;
    axios.put(updatePasswordUrl,credentials, 
         {   headers: {
        Authorization: token.access_token,
       
      }},)
       .then(response =>
        {
      //change password in local database
      Admin.update(
        { password: encryptedNewPassword },
        { where: { id: currentUser.id } }
      );

        return successResponse(res, MSG.PASSWORD_CHANGED);

       }).catch(error => {
      return failResponse(res,MSG.WRONG_CREDENTIALS)
      }) 
  }
  catch (error) {
    return errorServerResponse(res, error);
  }
} 
  async updatePersonalInformation(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, phone, dateOfBirth, gender } = req.body;
      const currentUser = res.locals.currentUser;
      if (!firstName || !lastName || !email || !phone || !dateOfBirth || !gender) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      await Admin.update(
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          dateOfBirth: dateOfBirth,
          gender: gender,
        },
        {
          where: {
            id: currentUser.id,
          },
        }
      );
      const findAdmin = await Admin.findOne({ where: { id: currentUser.id } });
      return successResponse(res, [findAdmin], MSG.PROFILE_UPDATED);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  async getAllUserInformation(_req: Request, res: Response) {
    try {
      const currentUser = res.locals.currentUser;
      const userInformation = await Admin.findByPk(currentUser.id);
      return successResponse(res, userInformation);
    } catch (error) {
      errorServerResponse(res, error);
    }
  }
}

export default new AdminController();
