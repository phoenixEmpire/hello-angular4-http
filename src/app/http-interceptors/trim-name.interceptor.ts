import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TrimNameInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('TrimNameInterceptor');
        const body = req.body;
        if (!body || !body.name) {
            return next.handle(req);
        }
        const newBody = { ...body, name: body.name.trim() }; // ...是展开操作符
        const newReq = req.clone({ body: newBody });
        return next.handle(newReq);
    }
}