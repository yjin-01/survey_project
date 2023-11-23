import { join } from 'path';

// 로그 파일 저장 옵션
export const loggerFileOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: join(process.cwd(), '/logs') + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: true,
  };
};
