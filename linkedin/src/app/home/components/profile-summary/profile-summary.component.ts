import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileTypeResult } from 'file-type';
import { fromBuffer } from 'file-type/core';
import { BehaviorSubject, from, of, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Role, User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BannerColorService } from '../../services/banner-color.service';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit, OnDestroy {
  form: FormGroup;

  validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  private userSubscription: Subscription;

  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  position$ = new BehaviorSubject<string>(null);
  position = '';

  constructor(
    private authService: AuthService,
    public bannerColorService: BannerColorService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      file: new FormControl(null),
    });

    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });

    this.userSubscription = this.authService.userStream.subscribe(
      (user: User) => {
        console.log(user)
        if (user?.role) {
          this.bannerColorService.bannerColors =
            this.bannerColorService.getBannerColors(user.role);
        }

        if (user && user?.firstName && user?.lastName) {
          this.fullName = user.firstName + ' ' + user.lastName;
          this.fullName$.next(this.fullName);
        }
      }
    );

    // this.authService.userFullName
    //   .pipe(take(1))
    //   .subscribe((fullName: string) => {
    //     this.fullName = fullName;
    //     this.fullName$.next(fullName);
    //   });

    this.authService.userPosition
      .pipe(take(1))
      .subscribe((position: string) => {
        this.position = position;
        this.position$.next(position);
      });
  }

  onFileSelect(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer())
      .pipe(
        switchMap((buffer: Buffer) => {
          return from(fromBuffer(buffer)).pipe(
            switchMap((fileTypeResult: FileTypeResult) => {
              if (!fileTypeResult) {
                // TODO: error handling
                console.log({ error: 'file format not supported!' });
                return of();
              }
              const { ext, mime } = fileTypeResult;
              const isFileTypeLegit = this.validFileExtensions.includes(
                ext as any
              );
              const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
              const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
              if (!isFileLegit) {
                // TODO: error handling
                console.log({
                  error: 'file format does not match file extension!',
                });
                return of();
              }
              return this.authService.uploadUserImage(formData);
            })
          );
        })
      )
      .subscribe();

    this.form.reset();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.userImagePathSubscription.unsubscribe();
  }
}











// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { FormControl, FormGroup } from '@angular/forms';
// import { BehaviorSubject, Subscription, from, of } from 'rxjs';
// import { switchMap, take } from 'rxjs/operators';
// import { Role, User } from 'src/app/auth/models/user.model';
// import { AuthService } from 'src/app/auth/services/auth.service';
// import { FileTypeResult, fromBuffer } from 'file-type';
// import { BannerColorService } from '../../services/banner-color.service';


// type validFileExtension = 'png' | 'jpg' | 'jpeg';
// type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

// type BannerColors = {
//   colorOne: string;
//   colorTwo: string;
//   colorThree: string;
// }

// @Component({
//   selector: 'app-profile-summary',
//   templateUrl: './profile-summary.component.html',
//   styleUrls: ['./profile-summary.component.scss'],
// })
// export class ProfileSummaryComponent  implements OnInit, OnDestroy {

//   form: FormGroup;

//   validFileExtensions: validFileExtension[] = ['png' , 'jpg' , 'jpeg'];
//   validMimeTypes: validMimeType[] = ['image/png' , 'image/jpg' , 'image/jpeg'];

//   userFullImagePath: string;
//   private userImagePathSubscription: Subscription;
//   private userSubscription: Subscription;

//   fullName$ = new BehaviorSubject<string>(null);
//   fullName = '';

//   position$ = new BehaviorSubject<string>(null);
//   position = '---';

  

//   constructor(
//     private authService: AuthService,
//     public bannerColorService: BannerColorService
//   ) { }

//   ngOnInit() {

//     this.form = new FormGroup({
//       file: new FormControl(null),
//     })

//     // this.authService.userRole.pipe(take(1)).subscribe((role: Role) => {
//     //   this.bannerColorService.bannerColors = this.bannerColorService.getBannerColors(role);
//     // });

//     this.userSubscription = this.authService.userStream.subscribe(
//       (user: User) => {
//         console.log(user);
//         if (user?.role) {
//           this.bannerColorService.bannerColors =
//             this.bannerColorService.getBannerColors(user.role);
//         }

//         if (user && user?.firstName && user?.lastName) {
//           this.fullName = user.firstName + ' ' + user.lastName;
//           this.fullName$.next(this.fullName);
//           this.position = user.position;
//           this.position$.next(this.position);
//         }

//         // if (user && user?.position) {
//         //   this.position = user.position;
//         //   this.position$.next(this.position);
//         //  // console.log(user.position)
//         // }
//       }
//     );

//     // this.authService.userFullName.pipe(take(1)).subscribe((fullName: string) => {
//     //   this.fullName = fullName;
//     //   this.fullName$.next(fullName);
//     // })

//     // this.authService.userPosition.pipe(take(1)).subscribe((position: string) => {
//     //   this.position = position;
//     //   this.position$.next(position);
//     // })

//     this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullImagepath: string) => {
     
//       this.userFullImagePath = fullImagepath;
//     })
//   }

 

//   onFileSelect(event: Event): void {
//     const file: File = (event.target as HTMLInputElement).files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);

//     from(file.arrayBuffer())
//       .pipe(
//         switchMap((buffer: Buffer) => {
//           return from(fromBuffer(buffer)).pipe(
//             switchMap((fileTypeResult: FileTypeResult) => {
//               if (!fileTypeResult) {
//                 // TODO: error handling
//                 console.log({ error: 'file format not supported!' });
//                 return of();
//               }
//               const { ext, mime } = fileTypeResult;
//               const isFileTypeLegit = this.validFileExtensions.includes(
//                 ext as any
//               );
//               const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
//               const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
//               if (!isFileLegit) {
//                 // TODO: error handling
//                 console.log({
//                   error: 'file format does not match file extension!',
//                 });
//                 return of();
//               }
//               return this.authService.uploadUserImage(formData);
//             })
//           );
//         })
//       )
//       .subscribe();

//     this.form.reset();
//   }

//   ngOnDestroy() {
//       this.userImagePathSubscription.unsubscribe();
//       this.userSubscription.unsubscribe();
//   }
// }
