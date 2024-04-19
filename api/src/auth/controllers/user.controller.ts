import { Controller, Get, Res, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from '../helpers/image-storage';
import { Observable, map, of, switchMap } from 'rxjs';
import { join } from 'path';
import { UpdateResult } from 'typeorm';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req): Observable<{ modifiedFileName: string } | { error: string }> {
        const fileName = file?.filename;

        if (!fileName) return of({error: "File must be a png, jpg/jpeg"});

        const imagesFoderPath = join(process.cwd(), 'images');
        const fullImagePath = join(imagesFoderPath + '/' + file.filename);

        return isFileExtensionSafe(fullImagePath).pipe(
            switchMap((isFileLegit: boolean) => {
                if (isFileLegit) {
                    const userId = req.user.id;
                    return this.userService.updateUserImageById(userId, fileName).pipe(
                        switchMap(() => of({
                            modifiedFileName: file.filename,
                        }))
                    );
                }
                removeFile(fullImagePath);
            })
        );

        return of({ error: "File content does not match extension" })
    }


    @UseGuards(JwtGuard)
    @Get('image')
    findImage(@Request() req, @Res() res): Observable<Object> {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe(
            switchMap((imageName: string) => {
                return of(res.sendFile(imageName, { root: './images' }))
            })
        )
    }

    @UseGuards(JwtGuard)
    @Get('image-name')
    findUserImageName(@Request() req, @Res() res): Observable<{ imageName: string }> {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe(
            switchMap((imageName: string) => {
                return of({ imageName })
            })
        )
    }


}
