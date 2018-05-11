import { Component } from '@angular/core';
import { MessageService } from './message.service';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html'
})
export class MessagesComponent {
    constructor(private messageService: MessageService) { }
}
