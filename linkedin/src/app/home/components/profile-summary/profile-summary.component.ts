import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Role } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';


type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

type BannerColors = {
  colorOne: string;
  colorTwo: string;
  colorThree: string;
}

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent  implements OnInit {

  form: FormGroup;

  validFileExtensions: validFileExtension[] = ['png' , 'jpg' , 'jpeg'];
  validMimeTypes: validMimeType[] = ['image/png' , 'image/jpg' , 'image/jpeg'];

  bannerColors: BannerColors = {
    colorOne: "#a8b4b7",
    colorTwo: "#dbe7e9",
    colorThree: "#dbe7e9",
  }

  constructor(private authService: AuthService) { }

  ngOnInit() {

    this.form = new FormGroup({
      file: new FormControl(null),
    })

    this.authService.userRole.pipe(take(1)).subscribe((role: Role) => {
      this.bannerColors = this.getBannerColors(role);
    })
  }

  private getBannerColors(role: Role): BannerColors {
    switch(role) {
      case 'admin':
        return {
          colorOne: "#a8b4b7",
          colorTwo: "#dbe7e9",
          colorThree: "#dbe7e9",
        };

        case 'user':
        return {
          colorOne: "#a8b4b7",
          colorTwo: "#dbe7e9",
          colorThree: "#dbe7e9",
        };

        default:
          return this.bannerColors;
    }
  }

  onFileSelect(event: Event): void {
    // console.log('Selected');
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
  }

}
