import { Injectable } from '@angular/core';
import { Role } from 'src/app/auth/models/user.model';

type BannerColors = {
  colorOne: string;
  colorTwo: string;
  colorThree: string;
}


@Injectable({
  providedIn: 'root'
})
export class BannerColorService {
  bannerColors: BannerColors = {
    colorOne: "#a8b4b7",
    colorTwo: "#dbe7e9",
    colorThree: "#dbe7e9",
  }

  constructor() { }

  getBannerColors(role: Role): BannerColors {
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
}
