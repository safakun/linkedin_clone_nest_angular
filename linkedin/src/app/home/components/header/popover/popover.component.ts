import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent  implements OnInit, OnDestroy {

  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';
  
  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullImagepath: string) => {
     
      this.userFullImagePath = fullImagepath;
    });

    this.authService.userFullName.pipe(take(1)).subscribe((fullName: string) => {
      this.fullName = fullName;
      this.fullName$.next(fullName);
    })
  }

  onSignOut() {
  console.log(1, "OnsignOut called");
  this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}


