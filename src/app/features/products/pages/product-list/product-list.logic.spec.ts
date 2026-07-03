import { Product } from '../../../../core/domain/models/product.model';
import {
  clampPage,
  filterProducts,
  paginate,
  totalPages,
} from './product-list.logic';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'id',
    name: 'Nombre',
    description: 'Descripcion',
    logo: 'logo.png',
    dateRelease: '2025-01-01',
    dateRevision: '2026-01-01',
    ...overrides,
  };
}

describe('product-list.logic', () => {
  const products: Product[] = [
    makeProduct({ id: 'trj-crd', name: 'Tarjeta de Credito', description: 'Consumo' }),
    makeProduct({ id: 'cta-aho', name: 'Cuenta de Ahorro', description: 'Ahorro' }),
    makeProduct({ id: 'prestamo', name: 'Prestamo Personal', description: 'Credito' }),
  ];

  describe('filterProducts', () => {
    it('devuelve todos los productos cuando el termino esta vacio', () => {
      expect(filterProducts(products, '')).toHaveLength(3);
      expect(filterProducts(products, '   ')).toHaveLength(3);
    });

    it('filtra por nombre sin distinguir mayusculas', () => {
      const result = filterProducts(products, 'tarjeta');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('trj-crd');
    });

    it('filtra por id', () => {
      const result = filterProducts(products, 'cta');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Cuenta de Ahorro');
    });

    it('filtra por descripcion', () => {
      const result = filterProducts(products, 'ahorro');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('cta-aho');
    });

    it('coincide en cualquiera de los campos (id, nombre o descripcion)', () => {
      // "credito" aparece en el nombre de un producto y en la descripcion de otro
      const result = filterProducts(products, 'credito');

      expect(result).toHaveLength(2);
    });

    it('devuelve vacio cuando no hay coincidencias', () => {
      expect(filterProducts(products, 'hipoteca')).toHaveLength(0);
    });
  });

  describe('paginate', () => {
    const items = [1, 2, 3, 4, 5, 6, 7];

    it('devuelve la primera pagina', () => {
      expect(paginate(items, 1, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('devuelve la segunda pagina parcial', () => {
      expect(paginate(items, 2, 5)).toEqual([6, 7]);
    });

    it('devuelve vacio para una pagina fuera de rango', () => {
      expect(paginate(items, 5, 5)).toEqual([]);
    });
  });

  describe('totalPages', () => {
    it('calcula el numero de paginas', () => {
      expect(totalPages(10, 5)).toBe(2);
      expect(totalPages(11, 5)).toBe(3);
    });

    it('siempre devuelve al menos una pagina', () => {
      expect(totalPages(0, 5)).toBe(1);
    });

    it('protege contra un tamanio de pagina invalido', () => {
      expect(totalPages(10, 0)).toBe(1);
    });
  });

  describe('clampPage', () => {
    it('mantiene una pagina dentro del rango', () => {
      expect(clampPage(2, 5)).toBe(2);
    });

    it('ajusta por debajo del minimo', () => {
      expect(clampPage(0, 5)).toBe(1);
      expect(clampPage(-3, 5)).toBe(1);
    });

    it('ajusta por encima del maximo', () => {
      expect(clampPage(9, 5)).toBe(5);
    });
  });
});
