import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry } from 'rxjs/operators/retry';
import { catchError } from 'rxjs/operators/catchError';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class BasicUsageService {

  constructor(private http: HttpClient) { }

  getTitle(): Observable<HttpResponse<string>> {
    return this.http.get('https://www.baidu.com', {
      headers: new HttpHeaders({
        'Content-Type': 'text/html',
        'Authorrization': 'my-auth-token'
      }),
      observe: 'response',
      responseType: 'text'
    })
      .pipe(
        retry(3),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: HttpErrorResponse): ErrorObservable {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occured: ', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`
        Backend returned code ${error.status},
        body was : ${error.error}
      `);
    }
    // return an observable with a user-facing error message
    return ErrorObservable.create(
      `Something bad happened;please try again later.`
    );
  }
}
