import { Body, Controller, Delete, Get, Res, Param, Post, Put, Query, UseGuards, Request } from '@nestjs/common';
import { FeedService } from '../services/feed.service';
import { FeedPost } from '../models/post.interface';
import { Observable, of } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IsCreatorGuard } from '../guards/is-creator.guard';


@Controller('feed')
export class FeedController {
    constructor(
        private feedService: FeedService
    ) {}

    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(JwtGuard, RolesGuard)
    @Post()
    create(@Body() feedPost: FeedPost, @Request() req): Observable<FeedPost> {
        return this.feedService.createPost(req.user, feedPost);
    }

    // @Get()
    // findAll(): Observable<FeedPost[]> {
    //     return this.feedService.findAllPosts();
    // }

    @Get()
    findSelected(@Query('take') take: number = 1, @Query('skip') skip: number = 1): Observable<FeedPost[]> {
        take = take > 20 ? 20 : take;
        return this.feedService.findPosts(take, skip);
    }

    @UseGuards(JwtGuard, IsCreatorGuard)
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() feedPost: FeedPost
    ): Observable<UpdateResult> {
        return this.feedService.updatePost(id, feedPost);
    }

    @UseGuards(JwtGuard, IsCreatorGuard)
    @Delete(':id')
    delete(@Param('id') id: number): Observable<DeleteResult> {
        return this.feedService.deletePost(id);
    }

    @Get('image/:fileName')
    findImageByName(@Param('fileName') fileName: string, @Res() res) {
        if (!fileName || ['null', '[null]'].includes(fileName)) return;
        
        return of(res.sendFile(fileName, { root: './images' }));

    }

}
