import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { BasicUsageComponent } from './basic-usage/basic-usage.component';
import { PackageSearchComponent } from './package-search/package-search.component';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { MessageService } from './messages/message.service';
import { AuthService } from './auth.service';
import { httpInterceptorProviders } from './http-interceptors/index';
import { MessagesComponent } from './messages/messages.component';
import { RequestCache, RequestCacheWithMap } from './request-cache.service';

const routes: Routes = [
  { path: 'basic-usage', component: BasicUsageComponent },
  { path: 'package-search', component: PackageSearchComponent },
  { path: 'messages', component: MessagesComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    BasicUsageComponent,
    PackageSearchComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    MessageService,
    HttpErrorHandlerService,
    AuthService,
    { provide: RequestCache, useClass: RequestCacheWithMap },
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
