import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.isUserLoggedIn.pipe(
      take(1),
      switchMap((isUserLoggedIn: boolean) => {
        if (isUserLoggedIn) {
          return of(isUserLoggedIn);
        }
        return this.authService.isTokenInStorage();
      }),
      tap((isUserLoggedIn: boolean) => {
        if (!isUserLoggedIn) {
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }
}

// import { Injectable } from '@angular/core';
// import { CanLoad, Router, UrlTree } from '@angular/router';
// import { Observable  } from 'rxjs';
// import { switchMap, take } from 'rxjs/operators';
// import { AuthService } from '../services/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanLoad {

//   constructor(private authService: AuthService, private router: Router) {

//   }

//   canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return this.authService.isUserLoggedIn.pipe(
//       take(1),
//       switchMap((isUserLoggedIn: boolean) => {
//         if (isUserLoggedIn) {
//           return of(isUserLoggedIn)
//         }
//       }),
//       tap((isUserLoggedIn: boolean) => {
//         if (!isUserLoggedIn) {
//           this.router.navigateByUrl('/auth');
//         }
//       })
//     )
//   }
  
// }
// function of(isUserLoggedIn: boolean): any {
//   throw new Error('Function not implemented.');
// }

// function tap(arg0: (isUserLoggedIn: boolean) => any): import("rxjs").OperatorFunction<unknown, boolean | UrlTree> {
//   throw new Error('Function not implemented.');
// }

