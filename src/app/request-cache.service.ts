import { HttpResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from './messages/message.service';

export interface RequestCacheEntry {
    url: string;
    res: HttpResponse<any>;
    lastRead: number;
}

// 缓存的抽象类
export abstract class RequestCache {
    abstract get(req: HttpRequest<any>): HttpResponse<any> | undefined;
    abstract put(req: HttpRequest<any>, res: HttpResponse<any>): void;
}

const maxAge = 3000; // maximum cache age (ms)

// 缓存的实现类
@Injectable()
export class RequestCacheWithMap implements RequestCache { // 类当作接口使用

    private cache = new Map<string, RequestCacheEntry>();

    constructor(private messageService: MessageService) { }

    //  读：未缓存/已过期，返回undefined
    get(req: HttpRequest<any>): HttpResponse<any> | undefined {
        const url = req.urlWithParams;
        const cached = this.cache.get(url);
        if (!cached) {
            return undefined;
        }
        const isExpired = cached.lastRead < (Date.now() - maxAge);
        const expired = isExpired ? 'expired' : '';
        this.messageService.add(
            `Found ${expired}cached response for "${url}".`
        );
        return isExpired ? undefined : cached.res;
    }

    // 　写:移除过期响应
    put(req: HttpRequest<any>, res: HttpResponse<any>): void {
        const url = req.urlWithParams;
        this.messageService.add(`Caching response from "${url}"`);

        const entry = { url, res, lastRead: Date.now() }; // 解构赋值
        this.cache.set(url, entry);

        // remove expired cache entries
        const expired = Date.now() - maxAge;
        this.cache.forEach(cacheEntry => {
            if (cacheEntry.lastRead < expired) {
                this.cache.delete(cacheEntry.url);
            }
        });

        this.messageService.add(`Reqeust cache size: ${this.cache.size}`);
    }
}

