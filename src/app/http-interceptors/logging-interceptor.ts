import { tap, finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from '../messages/message.service';
import { Observable } from 'rxjs/Observable';

// 日志拦截器：向MessageService里添加消息
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
    constructor(private messageService: MessageService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('HttpInterceptor');
        const started: number = Date.now();
        let ok: string;
        return next.handle(req)
            .pipe(
                tap(
                    (event: HttpEvent<any>) => ok = event instanceof HttpResponse ? 'succeeded' : '',
                    (error: HttpErrorResponse) => ok = 'failed'
                ),
                finalize(() => {
                    const elapsed = Date.now() - started;
                    const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
                    this.messageService.add(msg);
                })
            );
    }
}
