import { Injectable } from '@angular/core';

/** Mock client-side authentication/authorization service */
@Injectable()
export class AuthService {
    getAuthorizationToken(): string {
        return 'some-auth-token';
    }
}
