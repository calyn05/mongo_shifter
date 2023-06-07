import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class HttpLocalInterceptor implements HttpInterceptor {
  private _requests = 0;

  constructor(
    private _snackbarComponent: SnackbarComponent,
    private _loader: LoaderService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this._requests++;
    this._loader.setLoading(true);

    return next.handle(request).pipe(
      finalize(() => {
        this._requests--;
        if (this._requests === 0) {
          this._loader.setLoading(false);
        }
      }),
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (event.body?.message) {
              this._snackbarComponent.openSnackbar(
                event.body.message,
                'Close',
                'success-snackbar'
              );
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.message) {
            this._snackbarComponent.openSnackbar(
              error.message,
              'Close',
              'error-snackbar'
            );
          }
          if (error.error.message) {
            this._snackbarComponent.openSnackbar(
              error.error.message,
              'Close',
              'error-snackbar'
            );
          }
        },
      })
    );
  }
}
