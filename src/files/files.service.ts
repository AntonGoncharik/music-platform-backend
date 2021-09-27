import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqid = require('uniqid');

import { FileType } from './enums';
import { IFile } from './interfaces';
import { UPLOADS } from './constants';

@Injectable()
export class FilesService {
  async createFile(type: FileType, file: Express.Multer.File): Promise<IFile> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uniqid() + '.' + fileExtension;
      const filePath = path.resolve(__dirname, '..', UPLOADS, type);

      if (!fs.existsSync(filePath)) {
        await fsPromises.mkdir(filePath, { recursive: true });
      }

      await fsPromises.writeFile(path.resolve(filePath, fileName), file.buffer);

      return { path: `${type}/${fileName}`, name: file.originalname };
    } catch (error) {
      throw error;
    }
  }
}
