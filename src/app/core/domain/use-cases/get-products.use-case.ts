import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductRepository } from '../repositories/product.repository';

/** Obtiene el listado completo de productos financieros. */
@Injectable({ providedIn: 'root' })
export class GetProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(): Observable<Product[]> {
    return this.repository.getAll();
  }
}
