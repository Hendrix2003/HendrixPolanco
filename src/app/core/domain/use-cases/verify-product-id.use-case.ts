import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../repositories/product.repository';

/**
 * Verifica si un identificador ya existe en el sistema. Se emplea en la
 * validacion asincrona del formulario de creacion: el id debe ser unico.
 */
@Injectable({ providedIn: 'root' })
export class VerifyProductIdUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: string): Observable<boolean> {
    return this.repository.verifyId(id);
  }
}
