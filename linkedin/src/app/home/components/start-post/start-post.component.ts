import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent  implements OnInit, OnDestroy {

  @Output() create: EventEmitter<any> = new EventEmitter();

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  constructor(
    public modalController: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullImagepath: string) => {
     
      this.userFullImagePath = fullImagepath;
    })
  }

  async presentModal() {
    console.log("Create POST");
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class2'
    })
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (!data) return;
    this.create.emit(data.post.body);
    console.log('role: ', role, 'data: ', data)
  }


  ngOnDestroy() {
      this.userImagePathSubscription.unsubscribe();
  }

}
