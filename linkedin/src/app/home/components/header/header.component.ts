import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { Subscription, take, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FriendRequestsPopoverComponent } from './friend-requests-popover/friend-requests-popover.component';
import { FriendRequest } from '../../models/FriendRequest';
import { ConnectionProfileService } from '../../services/connection-profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit, OnDestroy {

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  friendRequests: FriendRequest[];
  private friendRequestsSubscription: Subscription;

  constructor(
    public popoverController: PopoverController,
    private authService: AuthService,
    public connectionProfileService: ConnectionProfileService
  ) { }

  ngOnInit() {

    this.authService
    .getUserImageName()
    .pipe(
      take(1),
      tap(({ imageName }) => {
        const defaultImagePath = 'blank-profile-picture.png';
        this.authService
          .updateUserImagePath(imageName || defaultImagePath)
          .subscribe();
      })
    )
    .subscribe();

    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullImagepath: string) => {
     
      this.userFullImagePath = fullImagepath;
    });

    this.friendRequestsSubscription = this.connectionProfileService
    .getFriendRequests()
    .subscribe((friendRequests: FriendRequest[]) => {
      this.connectionProfileService.friendRequests = friendRequests.filter(
        (friendRequest: FriendRequest) => friendRequest.status === 'pending'
      );
    });

  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      showBackdrop: false
    });
    await popover.present();

    const {role} = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role)
  }


  async presentFriendRequestPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FriendRequestsPopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      showBackdrop: false
    });
    await popover.present();

    const {role} = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role)
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
    this.friendRequestsSubscription.unsubscribe();
  }

}
