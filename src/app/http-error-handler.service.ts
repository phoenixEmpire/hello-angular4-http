import { Injectable } from '@angular/core';
import { MessageService } from './messages/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

/** Type of the handleError function returned by HttpErrorHandlerService.createHandleError */
export type HandleError =
    <T>(operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

@Injectable()
export class HttpErrorHandlerService {
    constructor(private messageService: MessageService) { }
}
