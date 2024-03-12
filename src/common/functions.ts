import { Response } from 'express';
import { MSG } from './responseMessages';
import nodemailer from 'nodemailer';

export const errorServerResponse = (res: Response, error: any) => {
  return res.status(500).send({
    success: false,
    message: MSG.SERVER_ERROR,
    data: [],
    error: error,
  });
};
export const successResponse = (
  res: Response,
  data: any,
  message = MSG.SUCCESS
) => {
  return res.status(200).send({
    success: true,
    data: data,
    message: message,
  });
};

export const failResponse = (res: Response, message: string) => {
  return res.status(400).send({
    success: false,
    data: [],
    message: message,
  });
};
export const unauthorizedResponse = (res: Response, message: string) => {
  return res.status(401).send({
    success: false,
    data: [],
    message: message,
  });
};
//random referance 
export const getRandomInt=(min: number, max: number) :number=>   {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}