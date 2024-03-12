import multer from "multer";
import path from "path";
export const uploadFiles = multer({
  storage: multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, `${process.env.UPLOAD_PATH}`);
    },
    filename: (req, file, callBack) => {
      callBack(null, file.originalname);
    },
  }),
});

export const uploadFilesMiddleware = (req: any, res: any, next: any) => {
  return uploadFiles.array("images", 100)(req, res, next);
};
// const variantImage= multer.diskStorage({
//     destination: (
//       req: any,
//       file: any,
//       callBack: (arg0: any, arg1: string) => void
//     ) => {
//       callBack(null, `${process.env.UPLOAD_PATH}`);
//     },
//     filename: (
//       req: any,
//       file: { fieldname: string; originalname: string },
//       callBack: (arg0: any, arg1: string) => void
//     ) => {
//       callBack(
//         null,
//         file.originalname
//         // file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//       );
//     },
//   });
//   export const uploadImg = multer({
//     storage: variantImage,
//   });
//   export const uploadFiles= (req: any, res: any, next: any) => {
//     return uploadImg.array("images",100)(req, res, next);
//   };
   