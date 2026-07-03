import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductUpdate } from '../models/product.model';
import { ProductRepository } from '../repositories/product.repository';

/** Actualiza los datos de un producto existente identificado por su id. */
@Injectable({ providedIn: 'root' })
export class UpdateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: string, changes: ProductUpdate): Observable<Product> {
    return this.repository.update(id, changes);
  }
}
