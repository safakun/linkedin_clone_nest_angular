import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { PostService } from '../../services/post.service';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Post } from '../../models/Post';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ModalComponent } from '../start-post/modal/modal.component';
import { User } from 'src/app/auth/models/user.model';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent  implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @Input() postBody: string;

  private userSubscription: Subscription;

  // userFullImagePath: string;
  // private userImagePathSubscription: Subscription;

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  userId$ = new BehaviorSubject<number>(null);

  constructor(
    private postService: PostService, 
    private authService: AuthService,
    public modalController: ModalController
  ) { }

  ngOnInit() {

    this.userSubscription = this.authService.userStream.subscribe((user: User) => {
      this.allLoadedPosts.forEach((post: Post, index: number) => {
        if (user?.imagePath && post.author.id === user.id) {
          this.allLoadedPosts[index]['fullImagePath'] = this,this.authService.getFullImagePath(user.imagePath);
        }
      })
    })


    // this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullImagepath: string) => {
     
    //   this.userFullImagePath = fullImagepath;
    // })

    this.getPosts(false, '');

    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId$.next(userId);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    const postBody = changes.postBody.currentValue;
    if (!postBody) return;
    this.postService.createPost(postBody).subscribe((post: Post) => {
      this.authService.userFullImagePath.pipe(take(1))
      .subscribe((fullImagePath: string) => {
        post['fullImagePath'] = fullImagePath;
      });
      this.allLoadedPosts.unshift(post);
    })
  }

  getPosts(isInitialLoad: boolean, event: any) {
    if (this.skipPosts === 20) {
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

    this.postService.getSelectedPosts(this.queryParams).subscribe((posts: Post[]) => {

     

      for (let postIndex = 0; postIndex < posts.length; postIndex++) {
        const doesAuthorHasImage = !!posts[postIndex].author.imagePath;
        let fullImagePath = this.authService.getDefaultFullImagePath();
        if (doesAuthorHasImage) {
          fullImagePath = this.authService.getFullImagePath(posts[postIndex].author.imagePath);
        }
        posts[postIndex]['fullImagePath'] = fullImagePath;
        this.allLoadedPosts.push(posts[postIndex]);
      }
      if (isInitialLoad) event.target.complete();
      this.skipPosts = this.skipPosts + 5;
    }, (error) => {
      console.log(error);
    })
  }

  loadData(event: any) {
    this.getPosts(true, event);
  }

  async presentUpdateModal(postId: number) {
    console.log("IDIT POST", postId);
    
      const modal = await this.modalController.create({
        component: ModalComponent,
        cssClass: 'my-custom-class2',
        componentProps: {
          postId,
        }
      })
      await modal.present();
      const { data, role } = await modal.onDidDismiss();
      if (!data) return;

      const newPostBody = data.post.body;
      this.postService.updatePost(postId, newPostBody).subscribe(() => {
        const postIndex = this.allLoadedPosts.findIndex((post: Post) => post.id === postId);
        this.allLoadedPosts[postIndex].body = newPostBody;
      })
      // console.log('role: ', role, 'data: ', data)
 
  }

  deletePost(postId: number) {
   // console.log("DELETE", postId);
   this.postService.deletePost(postId).subscribe(() => {
      this.allLoadedPosts = this.allLoadedPosts.filter(
        (post: Post) => post.id !== postId
      )
   })
  }

  ngOnDestroy(): void {
   // this.userImagePathSubscription.unsubscribe();

    this.userSubscription.unsubscribe();
  }
}
