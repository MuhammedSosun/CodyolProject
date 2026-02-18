import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const uploadPath = join(process.cwd(), 'uploads', 'contracts');

// klasör yoksa oluştur
if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath, { recursive: true });
}

export const ContractFileUploadInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const extension = extname(file.originalname);
      cb(null, `${unique}${extension}`);
    },
  }),

  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Desteklenmeyen dosya tipi'), false);
    }

    cb(null, true);
  },
});
