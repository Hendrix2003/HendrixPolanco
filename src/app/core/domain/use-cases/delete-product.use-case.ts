import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../repositories/product.repository';

/** Elimina un producto financiero por su identificador. */
@Injectable({ providedIn: 'root' })
export class DeleteProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: string): Observable<void> {
    return this.repository.delete(id);
  }
}
