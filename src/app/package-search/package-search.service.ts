import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorHandlerService } from '../http-error-handler.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

export interface NpmPackage {
    name: string;
    version: string;
    description: string;
}

export const searchUrl = 'https://npmsearch.com/query';

const httpOptions = {
    headers: new HttpHeaders({
        'x-refresh': 'true'
    })
};

function createHttpOptions(packageName: string, refresh = false) {
    // npm package name search api
    // e.g.,http://npmsearch.com/query?q=dom
    const params = new HttpParams({ // 查询参数
        // 从HttpParamsOptions对象的fromString或fromObject属性，创建Map<string,string>型对象，作为HttpParams对象的map属性
        fromObject: {
            q: packageName
        }
    });
    // 自定义的x-refresh头
    const headerMap = refresh ? { 'x-refresh': 'true' } : {};
    const headers = new HttpHeaders(headerMap);
    return { headers, params }; // 解构赋值创建对象
}

@Injectable()
export class PackageSearchService {
    private errorHandler;
    constructor(
        private http: HttpClient,
        private errorHandlerService: HttpErrorHandlerService
    ) {
        this.errorHandler = this.errorHandlerService.creatHandleError('npm package search service');
    }
    search(packageName: string, refresh = false): Observable<NpmPackage[]> {
        // clear if no pkg name
        if (!packageName.trim()) {
            return of([]);
        }
        const options = createHttpOptions(packageName, refresh);
        return this.http.get(searchUrl, options).pipe(
            map((data: any) => {
                return data.results.map(entry => ({
                    name: entry.name[0],
                    version: entry.version[0],
                    description: entry.description[0]
                } as NpmPackage));
            }),
            catchError(this.errorHandler('search', []))
        );
    }
}
