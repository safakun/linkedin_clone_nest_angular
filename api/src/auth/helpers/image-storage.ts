import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const fs = require('fs');
// import {fileTypeFromFile} from 'file-type';
// const fileTypeFromFile = require('file-type');
// import * as FileType from 'file-type';

const FileType = require('file-type');

import path = require('path');
import { Observable, from, of, switchMap } from 'rxjs';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg']; 
const validMimeTypes: validMimeType[] =  ['image/png', 'image/jpg', 'image/jpeg']; 


export const saveImageToStorage = {
    storage: diskStorage({
      destination: './images',
      filename: (req, file, cb) => {
        const fileExtension: string = path.extname(file.originalname);
        const fileName: string = uuidv4() + fileExtension;
        cb(null, fileName);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes: validMimeType[] = validMimeTypes;
      allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
    },
  };

export const isFileExtensionSafe = (fullFilePath: string | any): Observable<boolean> => {
  
  return from(FileType.fromFile(fullFilePath)).pipe(
    switchMap((fileExtensionAndMimeType: { ext: validFileExtension | any, mime: validMimeType | any }) => {
      if (!fileExtensionAndMimeType) return of(false);

      const isFileTypeLegit = validFileExtensions.includes(fileExtensionAndMimeType.ext,);
      const isMimeTypeLegit = validMimeTypes.includes(fileExtensionAndMimeType.mime,);
      const isFilelegit = isFileTypeLegit && isMimeTypeLegit;

      return of(isFilelegit);
    })
  )
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch(err) {
    console.error(err);
  }
}