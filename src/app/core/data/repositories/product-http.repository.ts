import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { NewProduct, Product, ProductUpdate } from '../../domain/models/product.model';
import { ProductRepository } from '../../domain/repositories/product.repository';
import {
  ProductDeleteResponseDto,
  ProductListResponseDto,
  ProductMutationResponseDto,
} from '../mappers/product.dto';
import { ProductMapper } from '../mappers/product.mapper';
import { mapHttpError } from '../../infrastructure/http/http-error.mapper';

/**
 * Implementacion del ProductRepository sobre el servicio HTTP local.
 *
 * Responsabilidades:
 *  - construir las peticiones contra los endpoints del backend;
 *  - traducir DTO <-> dominio mediante el mapper;
 *  - homogeneizar los errores con mapHttpError.
 */
@Injectable()
export class ProductHttpRepository extends ProductRepository {
  private readonly endpoint = `${environment.apiBaseUrl}/products`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  override getAll(): Observable<Product[]> {
    return this.http.get<ProductListResponseDto>(this.endpoint).pipe(
      map((response) => ProductMapper.toDomainList(response.data ?? [])),
      catchError(mapHttpError)
    );
  }

  override create(product: NewProduct): Observable<Product> {
    const body = ProductMapper.toCreateDto(product);
    return this.http
      .post<ProductMutationResponseDto>(this.endpoint, body)
      .pipe(
        map((response) => ProductMapper.toDomain(response.data)),
        catchError(mapHttpError)
      );
  }

  override update(id: string, changes: ProductUpdate): Observable<Product> {
    const body = ProductMapper.toUpdateDto(changes);
    return this.http
      .put<ProductMutationResponseDto>(`${this.endpoint}/${encodeURIComponent(id)}`, body)
      .pipe(
        // El PUT devuelve el cuerpo enviado (sin id); se reconstruye el modelo
        // completo con el id conocido de la peticion.
        map((response) => ({ ...ProductMapper.toDomain(response.data), id })),
        catchError(mapHttpError)
      );
  }

  override delete(id: string): Observable<void> {
    return this.http
      .delete<ProductDeleteResponseDto>(`${this.endpoint}/${encodeURIComponent(id)}`)
      .pipe(
        map(() => void 0),
        catchError(mapHttpError)
      );
  }

  override verifyId(id: string): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.endpoint}/verification/${encodeURIComponent(id)}`)
      .pipe(catchError(mapHttpError));
  }
}
