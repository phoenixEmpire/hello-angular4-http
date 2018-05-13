import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from '../messages/message.service';
import { map, tap, catchError, last } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class UploadService {
    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    // 上次单个文件
    upload(file: File) {
        if (!file) {
            return;
        }
        const req = new HttpRequest('POST', '/upload/file', file, { // File继承了Blob
            reportProgress: true
        });

        // The `HttpClient.request` API produces a raw event stream
        // which includes start (sent), progress, and response events.
        return this.http.request(req).pipe(
            map(event => this.getEventMessage(event, file)),
            tap(message => this.showProgress(message)),
            last(),
            catchError(this.handleError(file))
        );
    }

    // Return distinct message for sent, upload progress, & response events
    private getEventMessage(event: HttpEvent<any>, file: File) {
        switch (event.type) {
            case HttpEventType.Sent:
                return `Uploading file "${file.name}" of size ${file.size}`;
            case HttpEventType.UploadProgress:
                // Compute and show the % done:
                const percentDone = Math.round(100 * event.loaded / event.total);
                return `File "${file.name}" is ${percentDone}% uploaded.`;
            case HttpEventType.Response:
                return `File "${file.name}" was completely uploaded!`;
            default:
                return `File "${file.name}" surprising upload event: ${event.type}`;
        }
    }

    private showProgress(message: string) {
        this.messageService.add(message);
    }

    /**
     * Returns a function that handles Http upload failures.
     * @param file - File object for file being uploaded
     *
     * When no `UploadInterceptor` and no server,
     * you'll end up here in the error handler.
     */
    private handleError(file: File) {
        const userMessage = `${file.name} upload failed.`;
        return (error: HttpErrorResponse) => {
            console.error(error);
            const message = (error.error instanceof Error) ?
                error.error.message :
                `server returned code ${error.status} with body "${error.error}"`;
            this.messageService.add(`${userMessage} ${message}`);
            // Let app keep running but indicate failure.
            return of(userMessage);
        };
    }
}
