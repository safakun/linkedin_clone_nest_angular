import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent  implements OnInit {

  @Output() create: EventEmitter<any> = new EventEmitter();

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

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

}
