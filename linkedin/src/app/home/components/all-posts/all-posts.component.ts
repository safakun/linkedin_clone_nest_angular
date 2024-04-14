import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { PostService } from '../../services/post.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { Post } from '../../models/Post';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent  implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @Input() postBody: string;

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.getPosts(false, '');
  }

  ngOnChanges(changes: SimpleChanges) {
    const postBody = changes.postBody.currentValue;
    if (!postBody) return;
  }

  getPosts(isInitialLoad: boolean, event: any) {
    if (this.skipPosts === 20) {
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

    this.postService.getSelectedPosts(this.queryParams).subscribe((posts: Post[]) => {
      for (let post = 0; post < posts.length; post++) {
        this.allLoadedPosts.push(posts[post]);
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

}
