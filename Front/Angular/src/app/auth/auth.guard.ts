import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './authService.service';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const localData = localStorage.getItem("token");

  if (localData !== null && authService.hasPermission(next.data['requiredPermission'])) {
    return true;
  } else {
    router.navigateByUrl("books");
    return false;
  }
};
