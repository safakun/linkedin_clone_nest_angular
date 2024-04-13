import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return from(
        Preferences.get({
          key: 'token',
        })
      ).pipe(
        switchMap(( data: {value: string} ) => {
          const token = data?.value;
          if (token) {
            const cloneRequest = req.clone({
              headers: req.headers.set('Authorization', 'Bearer ' + token)
            })
            return next.handle(cloneRequest);
          }
          return next.handle(req);
        })
      )
  }

  constructor() { }
}
