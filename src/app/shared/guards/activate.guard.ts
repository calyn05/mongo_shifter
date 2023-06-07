import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

export const activateGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    map((res) => {
      if (res.startsWith('usad_id')) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
