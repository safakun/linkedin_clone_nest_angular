import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BannerColorService } from '../../services/banner-color.service';
import { BehaviorSubject, Observable, Subscription, map, switchMap, take } from 'rxjs';
import { Role, User } from 'src/app/auth/models/user.model';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { ConnectionProfileService } from '../../services/connection-profile.service';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent  implements OnInit, OnDestroy {

 

  constructor(
    public bannerColorService: BannerColorService,
    private route: ActivatedRoute,
    private connectionProfileService: ConnectionProfileService
  ) { }

  ngOnInit() {
    this.getUser().subscribe((x) => console.log(x))
   // this.getUserIdFromUrl().subscribe((x) => console.log(33, x));
  }

  getUser(): Observable<User> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.getConnectionYser(userId)
      })
    )
  }

   private getUserIdFromUrl(): Observable<number> {
    return this.route.url.pipe(
      map((urlSegment: UrlSegment[]) => {
        return Number(urlSegment[0].path);
      })
    )
   }

  
   ngOnDestroy(): void {
       
   }
  
  }

 

