import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EnsureHttpsInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('EnsureHttpsInterceptor');
        // clone request and replace 'http://' with 'https://' at the same time
        const secureReq = req.clone({
            url: req.url.replace('http://', 'https://')
        });
        // send the cloned, "secure" request to the next handler.
        return next.handle(secureReq);
    }
}
