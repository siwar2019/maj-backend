import multer from "multer";
import path from "path";

const variantImage= multer.diskStorage({
    destination: (req: any,file: any,callBack: (arg0: any, arg1: string) => void
    ) => {
      callBack(null, `${process.env.UPLOAD_PATH}`);
    },
    filename: ( req: any,file: { fieldname: string; originalname: string },callBack: (arg0: any, arg1: string) => void
    ) => {
      callBack(
        null,
        file.originalname
        // file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  export const uploadImg = multer({
    storage: variantImage,
  });
  export const uploadImages= (req: any, res: any, next: any) => {
    return uploadImg.array("files",100)(req, res, next);
  };
  export const uploadImagesV2 = uploadImg.fields([
    { name: 'files', maxCount: 100 },
    { name: 'images', maxCount: 100 },
  ]);
   