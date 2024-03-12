import express from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Costumer } from "../models/customer";
import {
  errorServerResponse,
  failResponse,
  successResponse,
} from "../common/functions";

import * as bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import * as dotenv from "dotenv";
import { ApiPath, ApiOperationPost, ApiOperationPut } from "swagger-express-ts";
import { customerLogin } from "../../swagger/modelsSwagger/customerLogin.swagger";
import { customerRegister } from "../../swagger/modelsSwagger/customerRegister.swagger";
import { forgotPassword } from "../../swagger/modelsSwagger/forgotPassword.swagger";
import { resetPassword } from "../../swagger/modelsSwagger/resetPassword.swagger";

import { Paths } from "../common/paths";
import { MSG } from "../common/responseMessages";
import { generateEmail, newsLetters } from "../nodeMailer/messgeEmail";
import mail from "../nodeMailer/emailConfig";
import axios from "axios";

dotenv.config();
/* swagger API register */
@ApiPath({
  path: "",
  name: "Customer",
  security: { basicAuth: [] },
})
export class CustomerController {
  public static TARGET_NAME: string = "custumerController";

  @ApiOperationPost({
    description: "Register customer",
    summary: "register new customer",
    path: Paths.REGISTER_COSTUMER,

    parameters: {
      body: {
        description: "New customer",
        required: true,
        model: "customerRegister",
      },
    },
    responses: {
      200: {
        description: MSG.SUCCESS,
        model: JSON.stringify(customerRegister),
      },
      400: {
        description: ` ${MSG.MISSING_DATA} || ${MSG.EMAIL_EXISTS}  `,
      },
      500: { description: MSG.SERVER_ERROR },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  async registerCustomer(req: express.Request, res: express.Response) {
    /* REGISTER API */

    try {
      const { email, firstName, lastName, birthDay, password } = req.body;
      if (!email || !firstName || !lastName || !password) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      //verify if the email already exist
      const verifEmail = await Costumer.findOne({
        where: {
          email: email,
        },
      });
      if (verifEmail) {
        return failResponse(res, MSG.EMAIL_EXISTS);
      }
      //save customer
      await Costumer.create({
        email: email,
        password: bcrypt.hashSync(password, 10),
        firstName: firstName,
        lastName: lastName,
        birthDay: birthDay,
      });
      return successResponse(res, [], MSG.ACCOUNT_CREATED);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  /* swagger API login */
  @ApiOperationPost({
    description: "login customer",
    summary: "login customer",

    path: Paths.LOGIN_COSTUMER,

    parameters: {
      body: {
        description: "verify customer credentials",
        required: true,
        model: "customerLogin",
      },
    },
    responses: {
      200: {
        description: MSG.ACCOUNT_CREATED,
        model: JSON.stringify(customerLogin),
      },
      400: { description: MSG.WRONG_CREDENTIALS },
      500: { description: MSG.SERVER_ERROR },
    },
  })
  async login(req: Request, res: Response) {
    const role = "Customer";

    try {
      const { email, password, rememberMe } = req.body;

      if (!email || !password) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const loggedUser = await Costumer.findOne({
        where: { email: email },
      });
      //user with wrong credentials
      if (!loggedUser) {
        return failResponse(res, MSG.WRONG_CREDENTIALS);
      }

      const comparePassword = await bcrypt.compare(
        password,
        loggedUser.password
      );
      //password passed should be the same
      if (!comparePassword) {
        return failResponse(res, MSG.WRONG_CREDENTIALS);
      }
      //generate a token
      const expiresIn = rememberMe ? "100y" : "1440m";
      const token = jsonwebtoken.sign(
        {
          id: loggedUser.id,
        },
        process.env.JWT_SECRET as string,
        { expiresIn }
      );

      const returnedData = {
        ...loggedUser.toJSON(),
        rememberMe: rememberMe,
      };
      delete returnedData?.resetLink;
      delete returnedData?.password;
      delete returnedData?.createdAt;
      delete returnedData?.updatedAt;
      delete returnedData?.DeletedAt;
      delete returnedData?.id;

      return successResponse(res, { token, returnedData, role });
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  /* swagger api forgotPassword  */
  @ApiOperationPut({
    description: "forget password",
    path: Paths.FORGOT_PASSWORD,

    summary: "forget password",
    parameters: {
      body: {
        description: "generate an other password when forgot",
        required: true,
        model: "forgotPassword",
      },
    },
    responses: {
      200: { description: MSG.SUCCESS, model: JSON.stringify(forgotPassword) },
      400: { description: `${MSG.USER_NOT_EXIST} || ${MSG.TRY_AGAIN}` },
      500: { description: MSG.SERVER_ERROR },
    },
  })
  async forgetPassword(req: express.Request, res: express.Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      // Find user by email
      const user = await Costumer.findOne({
        where: {
          email: email,
        },
      });
      //IF USER DOES NOT EXIST
      if (!user) {
        return failResponse(res, MSG.USER_NOT_EXIST);
      }
      // IF USER EXIST
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "20m" }
      );
      //update costumer
      await Costumer.update({ resetLink: token }, { where: { email } });

      // Generate the email HTML content
      const emailHTML = await generateEmail(user.email, user.firstName, token);

      // Send the email
      await mail(user.email, "Password Reset", emailHTML);

      return successResponse(res, []);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
  /* Swagger API reset password */
  @ApiOperationPost({
    description: "reset password ",
    path: Paths.RESET_PASSWORD,
    summary: "reset password",
    parameters: {
      body: {
        description: "edit  password with a new one",
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
        description: ` ${MSG.MISSING_DATA} || ${MSG.INVALID_TOKEN} `,
      },
      500: { description: MSG.SERVER_ERROR },
    },
  })
  async resetPassword(req: Request, res: Response) {
    const { newPassword, resetLink } = req.body;
    if (!newPassword || !resetLink) {
      return failResponse(res, MSG.MISSING_DATA);
    }
    try {
      //verif resetLink if exist
      const verifResetLink = await Costumer.findOne({
        where: {
          resetLink: resetLink,
        },
      });
      if (!verifResetLink) {
        return failResponse(res, MSG.INVALID_TOKEN);
      }
      let newPassCrypted = bcrypt.hashSync(newPassword, 10);
      var emailUser = verifResetLink?.dataValues.email;
      Costumer.update(
        { resetLink: null, password: newPassCrypted },
        { where: { email: emailUser } }
      );
      return successResponse(res, []);
    } catch (error) {
      console.log(error);
      return errorServerResponse(res, error);
    }
  }
  async updatePersonalInformationCostumer(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, phone, date, gender } = req.body;
      const currentUser = res.locals.currentUser;
      if (!firstName || !lastName || !email || !phone || !date || !gender) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      await Costumer.update(
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          birthDay: date,
          gender: gender,
        },
        {
          where: {
            id: currentUser.id,
          },
        }
      );
      const findCostumer = await Costumer.findOne({
        where: { id: currentUser.id },
      });
      return successResponse(res, findCostumer, MSG.PROFILE_UPDATED);
    } catch (error) {
      console.log("infopersonel", error);
      return errorServerResponse(res, error);
    }
  }
  //API GET  CURRENT USER

  async getCurrentUser(_req: express.Request, res: express.Response) {
    try {
      const currentUser = res.locals.currentUser;
      const userInformation: Costumer | null = await Costumer.findOne({
        where: { id: currentUser.id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });
      return successResponse(res, userInformation);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }

  /// send mail box new letter ////
  async newLetters(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return failResponse(res, MSG.MISSING_DATA);
      }
      const emailHTML = await newsLetters(email);
      await mail(email, "News Letter", emailHTML);

      return successResponse(res, []);
    } catch (error) {
      console.log(error);
      return errorServerResponse(res, error);
    }
  }

  //// change password //// 
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
      await Costumer.update(
        { password: encryptedNewPassword },
        { where: { id: currentUser.id } }
      );
      return successResponse(res, MSG.PASSWORD_CHANGED);
    } catch (error) {
      return errorServerResponse(res, error);
    }
  }
}
export default new CustomerController();
