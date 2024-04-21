import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { take, tap } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { FriendRequest } from 'src/app/home/models/FriendRequest';
import { ConnectionProfileService } from 'src/app/home/services/connection-profile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-friend-requests-popover',
  templateUrl: './friend-requests-popover.component.html',
  styleUrls: ['./friend-requests-popover.component.scss'],
})
export class FriendRequestsPopoverComponent  implements OnInit {

  friendRequests: FriendRequest[];

  constructor(
    public connectionProfileService: ConnectionProfileService,
    private popoverController: PopoverController) { }

  ngOnInit() {

    this.connectionProfileService.friendRequests.map(
      (friendRequest: FriendRequest) => {
        const creatorId = (friendRequest as any)?.creator?.id;
        if (friendRequest && creatorId) {
          this.connectionProfileService.getConnectionYser(creatorId).pipe(
            take(1),
            tap((user: User) => {
              friendRequest['fullImagePath'] = `${environment.baseApiUrl}/feed/image/${(user?.imagePath || 'blank-profile-picture.png')}`;
            })
          ).subscribe();
        }
      }
    )
    
  }

}
