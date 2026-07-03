import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductHttpRepository } from './product-http.repository';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { NewProduct, ProductUpdate } from '../../domain/models/product.model';
import { AppError } from '../../domain/models/app-error';
import { environment } from '../../../../environments/environment';

describe('ProductHttpRepository', () => {
  let repository: ProductRepository;
  let httpMock: HttpTestingController;

  const base = `${environment.apiBaseUrl}/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductRepository, useClass: ProductHttpRepository },
      ],
    });

    repository = TestBed.inject(ProductRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll obtiene y mapea la lista de productos', () => {
    let received = 0;
    repository.getAll().subscribe((products) => {
      received = products.length;
      expect(products[0].dateRelease).toBe('2025-01-01');
    });

    const req = httpMock.expectOne(base);
    expect(req.request.method).toBe('GET');
    req.flush({
      data: [
        {
          id: 'uno',
          name: 'Nombre producto',
          description: 'Descripcion producto',
          logo: 'assets-1.png',
          date_release: '2025-01-01',
          date_revision: '2026-01-01',
        },
      ],
    });

    expect(received).toBe(1);
  });

  it('getAll devuelve lista vacia cuando data es nula', () => {
    let received = -1;
    repository.getAll().subscribe((products) => (received = products.length));

    httpMock.expectOne(base).flush({ data: null });

    expect(received).toBe(0);
  });

  it('create envia el DTO y mapea la respuesta', () => {
    const newProduct: NewProduct = {
      id: 'dos',
      name: 'Nombre producto',
      description: 'Descripcion producto',
      logo: 'assets-1.png',
      dateRelease: '2025-01-01',
      dateRevision: '2026-01-01',
    };

    let createdId = '';
    repository.create(newProduct).subscribe((product) => (createdId = product.id));

    const req = httpMock.expectOne(base);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.date_release).toBe('2025-01-01');
    req.flush({
      message: 'Product added successfully',
      data: {
        id: 'dos',
        name: 'Nombre producto',
        description: 'Descripcion producto',
        logo: 'assets-1.png',
        date_release: '2025-01-01',
        date_revision: '2026-01-01',
      },
    });

    expect(createdId).toBe('dos');
  });

  it('update envia un PUT y conserva el id de la peticion', () => {
    const changes: ProductUpdate = {
      name: 'Nombre actualizado',
      description: 'Descripcion producto',
      logo: 'assets-1.png',
      dateRelease: '2025-01-01',
      dateRevision: '2026-01-01',
    };

    let updated = '';
    repository.update('uno', changes).subscribe((product) => {
      updated = product.id;
      expect(product.name).toBe('Nombre actualizado');
    });

    const req = httpMock.expectOne(`${base}/uno`);
    expect(req.request.method).toBe('PUT');
    req.flush({
      message: 'Product updated successfully',
      data: {
        id: 'uno',
        name: 'Nombre actualizado',
        description: 'Descripcion producto',
        logo: 'assets-1.png',
        date_release: '2025-01-01',
        date_revision: '2026-01-01',
      },
    });

    expect(updated).toBe('uno');
  });

  it('delete emite completado sin valor', () => {
    let completed = false;
    repository.delete('uno').subscribe({ complete: () => (completed = true) });

    const req = httpMock.expectOne(`${base}/uno`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Product removed successfully' });

    expect(completed).toBe(true);
  });

  it('verifyId devuelve el booleano del servicio', () => {
    let exists: boolean | null = null;
    repository.verifyId('uno').subscribe((value) => (exists = value));

    const req = httpMock.expectOne(`${base}/verification/uno`);
    expect(req.request.method).toBe('GET');
    req.flush(true);

    expect(exists).toBe(true);
  });

  it('traduce un error HTTP a AppError', () => {
    let captured: AppError | null = null;
    repository.getAll().subscribe({
      error: (error: AppError) => (captured = error),
    });

    httpMock.expectOne(base).flush(
      { message: 'fallo' },
      { status: 500, statusText: 'Server Error' }
    );

    expect(captured).toBeInstanceOf(AppError);
    expect(captured!.status).toBe(500);
  });
});
