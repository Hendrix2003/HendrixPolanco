import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ProductRepository } from './core/domain/repositories/product.repository';
import { ProductHttpRepository } from './core/data/repositories/product-http.repository';
import { APP_ROUTES } from './app.routes';

/**
 * Configuracion raiz de la aplicacion. Aqui se resuelve la inversion de
 * dependencias: el token ProductRepository (dominio) se asocia con su
 * implementacion concreta ProductHttpRepository (datos).
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    { provide: ProductRepository, useClass: ProductHttpRepository },
  ],
};
