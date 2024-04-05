import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { basename } from 'path';

export const multerOptionsFactory = (): MulterOptions => {
  return {
    storage: diskStorage({
      filename(req, file, cb) {
        const originalname = basename(file.originalname);
        const safeFilename = encodeURIComponent(originalname);
        cb(null, safeFilename);
      },
    }),
  };
};
