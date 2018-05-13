import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NoopInterceptor } from './noop-interceptor';
import { EnsureHttpsInterceptor } from './ensure-https-interceptor';
import { AuthInterceptor } from './auth-interceptor';
import { LoggingInterceptor } from './logging-interceptor';
import { TrimNameInterceptor } from './trim-name.interceptor';
import { CachingInterceptor } from './caching-interceptor';
import { UploadInterceptor } from './upload-interceptor';

/** Http interceptor providers in outside-in order */
/**
 * @angular/common/http/HTTP_INTERCEPTORS : 一个内置的注入令牌对象(InjectionToken）
 */
export const httpInterceptorProviders: any[] = [
    { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: EnsureHttpsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TrimNameInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UploadInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true }
];
