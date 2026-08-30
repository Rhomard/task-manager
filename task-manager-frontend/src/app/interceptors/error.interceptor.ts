import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error) => {
      let message = 'Une erreur est survenue';

      if (error.status === 0) {
        message = 'Impossible de contacter le serveur';
      } else if (error.status === 404) {
        message = error.error?.message || 'Ressource introuvable';
      } else if (error.status === 400 && error.error && typeof error.error === 'object') {
        message = Object.values(error.error).join(', ');
      } else if (error.status >= 500) {
        message = 'Erreur serveur, réessaie plus tard';
      }

      snackBar.open(message, 'Fermer', { duration: 4000 });
      return throwError(() => error);
    })
  );
};