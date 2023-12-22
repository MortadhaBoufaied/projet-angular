import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthconfigInterceptor } from './AuthconfigInterceptor';

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthconfigInterceptor, multi: true }
];
    

