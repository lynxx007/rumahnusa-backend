import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { existsSync, mkdirSync } from 'fs';

const customStorage = diskStorage({
  destination: (req: any, file: Express.Multer.File, cb) => {
    const uploadFolder = './uploads/images';
    if (!existsSync(uploadFolder)) {
      mkdirSync(uploadFolder, { recursive: true });
    }
    
    cb(null, uploadFolder);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
  },
});

export const multerConfig: MulterOptions = {
  storage: customStorage,
};