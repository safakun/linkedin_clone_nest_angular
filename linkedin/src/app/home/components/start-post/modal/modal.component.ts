import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: NgForm;

  @Input() postId?: number;

  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  constructor(
    public modalController: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullImagepath: string) => {
     
      this.userFullImagePath = fullImagepath;
    });

    this.authService.userFullName.pipe(take(1)).subscribe((fullName: string) => {
      this.fullName = fullName;
      this.fullName$.next(fullName);
    })
  }

  onDismiss() {
    this.modalController.dismiss(null, 'dismiss');
  }

  onPost() {
    if (!this.form.valid) return;
    const body = this.form.value['body'];
    this.modalController.dismiss(
      {
        post: {
          body,
          // createdAt: new Date()
        },
      },
      'post'
    )
    console.log('form submitted')
  }


  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }

}
