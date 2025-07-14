import { HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError, switchMap, filter, take, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

// Interface for refresh token request
interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

// Interface for refresh token response
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Global state to prevent multiple refresh requests
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> {
  const authService = inject(AuthService);
  const cookieService = authService.cookie;

  // URLs that don't need authentication
  const skipAuthUrls = ['/login', '/register', '/refresh-token'];
  const shouldSkipAuth = skipAuthUrls.some(url => req.url.includes(url));

  if (shouldSkipAuth) {
    return next(req);
  }

  // Get tokens from cookies
  const accessToken = cookieService.get('token');
  const refreshToken = cookieService.get('refreshToken');

  if (!accessToken) {
    return next(req);
  }

  // Add Authorization header
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && refreshToken) {
        return handle401Error(authReq, next, authService, accessToken, refreshToken);
      }
      return throwError(() => error);
    })
  );
}

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  accessToken: string,
  refreshToken: string
): Observable<any> {
  if (isRefreshing) {
    // If already refreshing, wait for the new token
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        const newReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(newReq);
      })
    );
  }

  isRefreshing = true;
  refreshTokenSubject.next(null);

  const refreshRequest: RefreshTokenRequest = {
    token: accessToken,
    refreshToken: refreshToken
  };

  return authService.httpClient.post<RefreshTokenResponse>(
    `${environment.apiUrl}/api/account/RefreshToken`,
    refreshRequest
  ).pipe(
    switchMap((response: RefreshTokenResponse) => {
      isRefreshing = false;
      
      // Update cookies with new tokens
      authService.cookie.set('token', response.accessToken, { path: '/' });
      authService.cookie.set('refreshToken', response.refreshToken, { path: '/' });

      
      refreshTokenSubject.next(response.accessToken);
      
      // Retry the original request with new token
      const newReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${response.accessToken}`)
      });
      
      return next(newReq);
    }),
    catchError((refreshError) => {
      isRefreshing = false;
      refreshTokenSubject.next(null);
      
      // Clear cookies and logout on refresh failure
      authService.cookie.delete('token');
      authService.cookie.delete('refreshToken');
      authService.cookie.delete('role');
      
      // Call logout method
      authService.logOut();
      
      return throwError(() => refreshError);
    })
  );
}
