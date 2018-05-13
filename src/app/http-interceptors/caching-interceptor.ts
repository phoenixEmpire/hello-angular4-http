import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { RequestCache } from '../request-cache.service';
import { Observable } from 'rxjs/Observable';
import { searchUrl } from '../package-search/package-search.service';
import { of } from 'rxjs/observable/of';
import { tap, startWith } from 'rxjs/operators';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    constructor(private cache: RequestCache) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('CachingInterceptor');
        if (!isCacheable(req)) {
            return next.handle(req);
        }

        const cachedRes = this.cache.get(req);
        if (req.headers.get('x-refresh')) { // 强制刷新
            const results$ = sendRequest(req, next, this.cache);
            return cachedRes ? results$.pipe(startWith(cachedRes)) : results$;
        } else { // 缓存优先
            return cachedRes ? of(cachedRes) : sendRequest(req, next, this.cache);
        }

    }

}

// 搜索 npm package 的 GET 请求才是可以缓存的
function isCacheable(req: HttpRequest<any>): boolean {
    return req.method === 'GET' && req.url.indexOf(searchUrl) > -1;
}


// 发送请求并缓存
function sendRequest(req: HttpRequest<any>, next: HttpHandler, cache: RequestCache): Observable<HttpEvent<any>> {
    const noHeaderReq = req.clone({
        headers: new HttpHeaders()
    });

    return next.handle(noHeaderReq).pipe(
        tap(event => {
            // There may be other events besides the response.
            if (event instanceof HttpResponse) {
                cache.put(req, event);
            }
        })
    );
}
