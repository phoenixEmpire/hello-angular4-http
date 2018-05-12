import { Injectable } from '@angular/core';
import { MessageService } from './messages/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

// 导出类型：函数类型(function type)
/** Type of the handleError function returned by HttpErrorHandlerService.createHandleError */
export type HandleError =
    <T>(operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

@Injectable()
export class HttpErrorHandlerService {

    constructor(private messageService: MessageService) { }

    /**
    * Returns a function(闭包 ) that handles Http operation failures.
    * This error handler lets the app continue to run as if no error occurred.
    * @param serviceName = name of the data service that attempted the operation
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
    handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {
        return (error: HttpErrorResponse): Observable<T> => {
            console.error(error);
            const message = (error.error instanceof ErrorEvent) ?
                error.error.message :
                `server returned code ${error.status} with body "${error.error}"`;
            this.messageService.add(`${serviceName}: ${operation} failed: ${message}`);
            return of(result);
        };
    }

    /** Create curried handleError function(闭包实现柯里函数) that already knows the service name */
    creatHandleError =
        (serviceName = '') =>
            <T>(operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result)
}
