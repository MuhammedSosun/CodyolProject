import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

function safeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_.]/g, '')
    .slice(0, 60);
}

export const ContractFileUploadInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: 'uploads/contracts',
    filename: (req, file, cb) => {
      const original = file.originalname || 'file';
      const ext = extname(original) || '';
      const base = safeFilename(original.replace(ext, ''));
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${base}-${unique}${ext}`);
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: (req, file, cb) => {
    // pdf + office + images gibi basic izin
    const allowed = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new BadRequestException('Unsupported file type'), false);
    }
    cb(null, true);
  },
});
