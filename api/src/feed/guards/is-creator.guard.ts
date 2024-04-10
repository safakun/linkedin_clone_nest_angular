import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, switchMap, map } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { FeedService } from '../services/feed.service';
import { User } from 'src/auth/models/user.interface';
import { FeedPost } from '../models/post.interface';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(private authService: AuthService, private feedService: FeedService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();
    const { user, params }: { user: User, params: {id: number} } = request;

    console.log(request.params.id)

    if (!user || !params) return false;

    if (user.role === 'admin') return true; // allow admins to get make requests 

    const userId = user.id;
    const feedId = Number(request.params.id);

    // Determine if the logged in user is the same user that created feed post
    return this.authService.findUserById(userId).pipe(
      switchMap((user: User) => this.feedService.findPostById(feedId).pipe(
        map((feedPost: FeedPost) => {
          console.log(feedPost)
          let isAuthor = user.id === feedPost.author.id;
          return isAuthor;
        })
      ))
    )
  }
}
