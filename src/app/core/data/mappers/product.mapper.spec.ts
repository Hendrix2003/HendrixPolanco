import { ProductMapper } from './product.mapper';
import { ProductDto } from './product.dto';
import { NewProduct, ProductUpdate } from '../../domain/models/product.model';

describe('ProductMapper', () => {
  const dto: ProductDto = {
    id: 'uno',
    name: 'Tarjeta de Credito',
    description: 'Tarjeta de consumo bajo la modalidad de credito',
    logo: 'assets-1.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
  };

  describe('toDomain', () => {
    it('convierte un DTO a modelo de dominio con claves en camelCase', () => {
      const product = ProductMapper.toDomain(dto);

      expect(product).toEqual({
        id: 'uno',
        name: 'Tarjeta de Credito',
        description: 'Tarjeta de consumo bajo la modalidad de credito',
        logo: 'assets-1.png',
        dateRelease: '2025-01-01',
        dateRevision: '2026-01-01',
      });
    });

    it('recorta una fecha ISO completa a formato YYYY-MM-DD', () => {
      const withFullIso: ProductDto = {
        ...dto,
        date_release: '2025-01-01T00:00:00.000Z',
      };

      const product = ProductMapper.toDomain(withFullIso);

      expect(product.dateRelease).toBe('2025-01-01');
    });

    it('mantiene una cadena vacia cuando la fecha viene vacia', () => {
      const product = ProductMapper.toDomain({ ...dto, date_revision: '' });

      expect(product.dateRevision).toBe('');
    });
  });

  describe('toDomainList', () => {
    it('convierte un arreglo de DTOs', () => {
      const result = ProductMapper.toDomainList([dto, { ...dto, id: 'dos' }]);

      expect(result).toHaveLength(2);
      expect(result[1].id).toBe('dos');
    });

    it('devuelve un arreglo vacio para una entrada vacia', () => {
      expect(ProductMapper.toDomainList([])).toEqual([]);
    });
  });

  describe('toCreateDto', () => {
    it('convierte un producto de dominio a DTO de creacion', () => {
      const newProduct: NewProduct = {
        id: 'dos',
        name: 'Nombre producto',
        description: 'Descripcion producto',
        logo: 'assets-1.png',
        dateRelease: '2025-01-01',
        dateRevision: '2026-01-01',
      };

      const result = ProductMapper.toCreateDto(newProduct);

      expect(result).toEqual({
        id: 'dos',
        name: 'Nombre producto',
        description: 'Descripcion producto',
        logo: 'assets-1.png',
        date_release: '2025-01-01',
        date_revision: '2026-01-01',
      });
    });
  });

  describe('toUpdateDto', () => {
    it('convierte cambios de dominio a DTO sin incluir el id', () => {
      const changes: ProductUpdate = {
        name: 'Nombre actualizado',
        description: 'Descripcion producto',
        logo: 'assets-1.png',
        dateRelease: '2025-01-01',
        dateRevision: '2026-01-01',
      };

      const result = ProductMapper.toUpdateDto(changes);

      expect(result).toEqual({
        name: 'Nombre actualizado',
        description: 'Descripcion producto',
        logo: 'assets-1.png',
        date_release: '2025-01-01',
        date_revision: '2026-01-01',
      });
      expect(result).not.toHaveProperty('id');
    });
  });
});
