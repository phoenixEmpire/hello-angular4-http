import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../auth.service';

// 设置外发请求的默认请求头
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        console.log('AuthInterceptor');

        const authToken: string = this.authService.getAuthorizationToken();

        // The verbose way
        const authReqA = req.clone({
            headers: req.headers.set('Authorization', authToken)
        });
        // return next.handle(authReqA);

        // Clone the request and set the new header in one step
        const authReqB = req.clone({
            setHeaders: {
                Authorization: authToken
            }
        });
        return next.handle(authReqB);

    }
}
