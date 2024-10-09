import { HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';

import { UsuariosService } from './service/users/usuarios.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UsuariosService);
  const token = userService.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`, // Aquí usamos backticks y corregimos "Token"
      },
    });
  }

  return next(authReq); // Retornamos el observable
};
