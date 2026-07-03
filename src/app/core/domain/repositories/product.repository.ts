import { Observable } from 'rxjs';
import { NewProduct, Product, ProductUpdate } from '../models/product.model';

/**
 * Puerto de acceso a datos de productos. El dominio depende de esta
 * abstraccion y no de una implementacion concreta (inversion de dependencias).
 *
 * Se expone como token de inyeccion para poder sustituir la implementacion
 * (HTTP, memoria, mock de pruebas) sin tocar los casos de uso.
 */
export abstract class ProductRepository {
  abstract getAll(): Observable<Product[]>;
  abstract create(product: NewProduct): Observable<Product>;
  abstract update(id: string, changes: ProductUpdate): Observable<Product>;
  abstract delete(id: string): Observable<void>;
  abstract verifyId(id: string): Observable<boolean>;
}
