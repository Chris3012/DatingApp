import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          let errors = error.error.errors;
          switch (error.status) {
            case 400:
              if (errors) {
                const modelStateErrors = [];
                for (const key in errors) {
                  if (errors[key]) {
                    modelStateErrors.push(errors[key]);
                  }
                }
                throw modelStateErrors.flat();
              } else {
                console.error(error.error);
              }
              break;
            case 401:
              console.error('Unauthorized', error.status.toString());
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              console.error('Something unexpected went wrong');
              break;
          }
        }
        throw error;
      })
    );
  }
}
