import { Routes } from '@angular/router';

/**
 * Rutas de la aplicacion. Las vistas se cargan de forma diferida (lazy) para
 * reducir el bundle inicial y mejorar el tiempo de arranque.
 */
export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/pages/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
    title: 'Productos financieros',
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./features/products/pages/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
    title: 'Registrar producto',
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./features/products/pages/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
    title: 'Editar producto',
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
