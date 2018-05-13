import { Component } from '@angular/core';
import { UploadService } from './upload.service';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    providers: [UploadService]
})
export class UploadComponent {
    message: string;
    constructor(private uploadService: UploadService) { }
    onPicked(input: HTMLInputElement) {
        const file = input.files[0];
        if (file) {
            this.uploadService.upload(file).subscribe(
                msg => {
                    input.value = null; // 清空文本框
                    this.message = msg;
                }
            );
        }
    }
}
