import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType, HttpResponse, HttpProgressEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// 拦截上传请求,并返回模拟结果
@Injectable()
export class UploadInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('UploadInterceptor');

        if (req.url.indexOf('/upload/file') === -1) {
            return next.handle(req);
        }
        const delay = 300;
        return createUploadEvents(delay);
    }
}

/** Create simulation of upload event stream */
function createUploadEvents(delay: number) {
    // Simulate XHR behavior which would provide this information in a ProgressEvent
    const chunks = 5;
    const total = 12345678;
    const chunkSize = Math.ceil(total / chunks);

    return new Observable<HttpEvent<any>>(observer => {
        // notify the event stream that the request was sent.
        observer.next({
            type: HttpEventType.Sent
        });

        uploadLoop(0);

        function uploadLoop(loaded: number) { // 递归调用内部函数
            setTimeout(() => {
                loaded += chunkSize;

                if (loaded >= total) { // 　已完成
                    const doneResponse = new HttpResponse({
                        status: 201 // OK but no body
                    });
                    observer.next(doneResponse);
                    observer.complete();
                    return;
                }

                const progressEvent: HttpProgressEvent = {
                    type: HttpEventType.UploadProgress,
                    loaded,
                    total
                };
                observer.next(progressEvent);
                uploadLoop(loaded);
            }, delay);
        }
    });
}
