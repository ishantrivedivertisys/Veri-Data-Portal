import { HttpException, HttpStatus } from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuid} from 'uuid';
const path = require('path');

export const multerConfig = {
  dest: 'uploadExcel'
}

function uuidRandom(file) {
  const result = `${uuid()}${extname(file.originalname)}}`;
  return result;
}

export const multerOptions = {
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file.mimetype.includes("excel") ||
      file.mimetype.includes("spreadsheetml")
    ) {
      cb(null, true);
    } else {
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest
      if(!existsSync(uploadPath)) {
        mkdirSync(uploadPath)
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, uuidRandom(file));
    },
  })
};

export const storage = {
  storage: diskStorage({
    destination: multerConfig.dest,
    filename: (req: any, file: any, cb: any) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, "")+uuid();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    }
  })
}