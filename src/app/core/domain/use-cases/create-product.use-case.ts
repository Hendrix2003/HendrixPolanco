import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewProduct, Product } from '../models/product.model';
import { ProductRepository } from '../repositories/product.repository';

/** Registra un nuevo producto financiero. */
@Injectable({ providedIn: 'root' })
export class CreateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(product: NewProduct): Observable<Product> {
    return this.repository.create(product);
  }
}
