import { NewProduct, Product, ProductUpdate } from '../../domain/models/product.model';
import { ProductDto } from './product.dto';

/**
 * Traduce entre el contrato del backend (snake_case) y el modelo de dominio
 * (camelCase). Aisla al dominio de la forma concreta del transporte.
 */
export class ProductMapper {
  /** Normaliza una fecha entrante a formato YYYY-MM-DD. */
  private static toIsoDate(value: string): string {
    if (!value) {
      return '';
    }
    // El backend puede devolver una fecha completa ISO; se conserva solo la
    // parte de fecha para alinearla con los inputs de tipo date.
    return value.length > 10 ? value.slice(0, 10) : value;
  }

  static toDomain(dto: ProductDto): Product {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      logo: dto.logo,
      dateRelease: this.toIsoDate(dto.date_release),
      dateRevision: this.toIsoDate(dto.date_revision),
    };
  }

  static toDomainList(dtos: ProductDto[]): Product[] {
    return dtos.map((dto) => this.toDomain(dto));
  }

  static toCreateDto(product: NewProduct): ProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.dateRelease,
      date_revision: product.dateRevision,
    };
  }

  static toUpdateDto(changes: ProductUpdate): Omit<ProductDto, 'id'> {
    return {
      name: changes.name,
      description: changes.description,
      logo: changes.logo,
      date_release: changes.dateRelease,
      date_revision: changes.dateRevision,
    };
  }
}
