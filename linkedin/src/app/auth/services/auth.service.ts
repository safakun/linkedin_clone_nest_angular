import { Injectable } from '@angular/core';
import { NewUser } from '../models/newUser.model';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import {switchMap, take, tap, map, catchError} from 'rxjs/operators';
import { Role, User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Preferences } from '@capacitor/preferences';
import { UserResponse } from '../models/userResponse.model';

import { jwtDecode } from 'jwt-decode';
import { ErrorHandlerService } from '../../../app/core/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private user$ = new BehaviorSubject<User | null>(null);

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  get userStream(): Observable<User> {
    return this.user$.asObservable();
  }

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    )
  }

  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | any) => {
        return of(user.role);
      })
    )
  }

  get userId(): Observable<number> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | any) => {
        return of(user.id);
      })
    )
  }

  get userFullName(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const fullName = user.firstName + ' ' + user.lastName;
        return of(fullName);
      })
    );
  }

  get userFullImagePath(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const doesAuthorHasImage = !!user?.imagePath;
        let fullImagePath = this.getDefaultFullImagePath();

        if (doesAuthorHasImage) {
          fullImagePath = this.getFullImagePath(user.imagePath);
        }
        return of(fullImagePath)
      })
    
    )
  }

  constructor(
    private http: HttpClient, 
    private router: Router,
    private errorHandlerService: ErrorHandlerService
  ) { }

  getDefaultFullImagePath(): string {
    return environment.baseApiUrl + '/feed/image/blank-profile-picture.png';
  }

  getFullImagePath(imageName: string): string {
    return environment.baseApiUrl + '/feed/image/' + imageName;
  }

  getUserImage() {
    return this.http.get(`${environment.baseApiUrl}/user/image`).pipe(take(1));
  }

  getUserImageName(): Observable<{ imageName: string }> {
    return this.http.get<{ imageName: string }>(`${environment.baseApiUrl}/user/image-name`).pipe(take(1));
  }

  updateUserImagePath(imagePath: string): Observable<User> {
    return this.user$.pipe(
      take(1),
      map((user: User) => {
        user.imagePath = imagePath;
        this.user$.next(user);
        return user;
      })
    )
  }

  uploadUserImage(formData: FormData): Observable<{ modifiedFileName: string }> {
    return this.http.post<{ modifiedFileName: string }>(
      `${environment.baseApiUrl}/user/upload`, formData
    ).pipe(
      tap(({ modifiedFileName }) => {
        let user = this.user$.value;
        user.imagePath = modifiedFileName;
        this.user$.next(user);
      })
    );
  }

  register(newUser: NewUser): Observable<User> {
    return this.http.post<User>(
      `${environment.baseApiUrl}/auth/register`, newUser, this.httpOptions
    ).pipe(take(1));
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.baseApiUrl}/auth/login`, { email, password }, this.httpOptions
    ).pipe(
      take(1),
      tap((response: {token: string}) => {
         // If not token from user
         if (!response.token) {
          throw new Error("Login failed. Wrong credentials")
        }
        Preferences.set({
          key: 'token',
          value: response.token,
        });

       

        const decodedToken: UserResponse = jwtDecode(response.token);
        this.user$.next(decodedToken.user);
      }),
    
      catchError(
        this.errorHandlerService.handleError<string | any>('token', '')
      ),
      );
  }

  isTokenInStorage(): Observable<boolean> {
    return from(
      Preferences.get({
        key: 'token',
      })
    ).pipe(
      map((data: { value: string }) => {
        if (!data || !data.value) return null;

        const decodedToken: UserResponse = jwtDecode(data.value);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired =
          new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

        if (isExpired) return null;
        if (decodedToken.user) {
          this.user$.next(decodedToken.user);
          return true;
        }
      })
    );
  }


  logout(): void {
    this.user$.next(null);
    Preferences.remove({ key: 'token' });
    this.router.navigateByUrl('/auth');
  }


}

function jwt_decode(token: string): UserResponse {
  throw new Error('Function not implemented.');
}

