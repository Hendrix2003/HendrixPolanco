import { Product } from '../../../../core/domain/models/product.model';

/**
 * Funciones puras de filtrado y paginado del listado. Se mantienen fuera del
 * componente para poder probarlas de forma aislada y reutilizarlas.
 */

/** Filtra productos por coincidencia de texto en id, nombre o descripcion. */
export function filterProducts(products: Product[], term: string): Product[] {
  const query = term.trim().toLowerCase();
  if (!query) {
    return products;
  }
  return products.filter((product) => {
    const haystack = `${product.id} ${product.name} ${product.description}`.toLowerCase();
    return haystack.includes(query);
  });
}

/** Devuelve la porcion de productos correspondiente a la pagina indicada. */
export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/** Numero total de paginas para una cantidad de items y un tamanio de pagina. */
export function totalPages(totalItems: number, pageSize: number): number {
  if (pageSize <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

/** Restringe un numero de pagina al rango valido [1, totalPages]. */
export function clampPage(page: number, totalPageCount: number): number {
  if (page < 1) {
    return 1;
  }
  if (page > totalPageCount) {
    return totalPageCount;
  }
  return page;
}
