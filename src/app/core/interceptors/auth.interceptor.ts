import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthFacade } from '../../libs/auth/auth.facade';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);

  // Функция для повторного запроса (чтобы не дублировать код)
  const addToken = (request: HttpRequest<unknown>, token: string): HttpRequest<unknown> =>
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

  return next(addToken(req, authFacade.accessToken!)).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // 1. Пытаемся обновить токены
        return authFacade.refreshToken().pipe(
          // 2. Если обновление успешно (пришел новый Access Token)
          switchMap((newToken) => {
            console.log('Токен обновлен! Повторяем запрос...');
            // 3. Повторяем изначальный запрос, но уже с НОВЫМ токеном
            return next(addToken(req, newToken));
          }),
          // 4. Если даже рефреш выдал ошибку (например, сессия в куках истекла)
          catchError((refreshErr) => {
            authFacade.logout(); // Выкидываем на страницу логина
            return throwError(() => refreshErr);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
