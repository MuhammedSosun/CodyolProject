import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Form-data field adı: "file"
export const ContractFileUploadInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads/contracts',
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${extname(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
});
