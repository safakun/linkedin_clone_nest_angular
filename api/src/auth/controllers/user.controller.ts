import { Controller, Get, Res, Post, Request, UploadedFile, UseGuards, UseInterceptors, Param, Put, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from '../helpers/image-storage';
import { Observable, map, of, switchMap } from 'rxjs';
import { join } from 'path';
import { UpdateResult } from 'typeorm';
import { User } from '../models/user.class';
import { FriendRequest, FriendRequestStatus } from '../models/friend-request.interface';

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
                        map(() => ({
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
    findUserImageName(@Request() req): Observable<{ imageName: string }> {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe(
            switchMap((imageName: string) => {
                return of({ imageName })
            })
        )
    }


    @UseGuards(JwtGuard)
    @Get(':userId')
    findUserById(@Param('userId') userStringId: string): Observable<User> {
        const userId = parseInt(userStringId);
        return this.userService.findUserById(userId);
    }


    @UseGuards(JwtGuard)
    @Post('friend-request/send/:receiverId')
    sendFriendRequest(@Param('receiverId') receiverStringId: string, @Request() req): Observable<FriendRequest | { error: string }> {
        const receiverId = parseInt(receiverStringId);
        return this.userService.sendFriendRequest(receiverId, req.user);
    }

    @UseGuards(JwtGuard)
    @Get('friend-request/status/:receiverId')
    getFriendRequestStatus(@Param('receiverId') receiverStringId: string, @Request() req): Observable<FriendRequestStatus> {
        const receiverId = parseInt(receiverStringId);
        return this.userService.getFriendRequestStatus(receiverId, req.user);
    }

    @UseGuards(JwtGuard)
    @Put('friend-request/response/:friendRequestId')
    respondToFriendRequest(
        @Param('friendRequestId') friendRequestStringId: string, 
        @Body() statusResponse: FriendRequestStatus
    ): Observable<FriendRequestStatus> {
        const friendRequestId = parseInt(friendRequestStringId);
        return this.userService.respondToFriendRequest(statusResponse.status, friendRequestId);
    }

    @UseGuards(JwtGuard)
    @Get('friend-request/me/received-requests')
    getFriendRequestsFromRecipients(
         @Request() req): Observable<FriendRequestStatus[]> {
        return this.userService.getFriendRequestsFromRecipients(req.user);
    }



}
