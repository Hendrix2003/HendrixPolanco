/**
 * Modelo de dominio de un producto financiero.
 *
 * Las fechas se modelan como cadenas en formato ISO (YYYY-MM-DD) porque asi
 * las entrega y las espera el servicio, y asi se enlazan de forma directa con
 * los inputs de tipo date del formulario. La conversion desde/hacia el
 * transporte se resuelve en la capa de datos (mapper).
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  dateRelease: string;
  dateRevision: string;
}

/**
 * Datos necesarios para crear un producto. El identificador lo define el
 * usuario, por lo que forma parte del payload de creacion.
 */
export type NewProduct = Product;

/**
 * Datos que admite una actualizacion. El identificador viaja por la URL y no
 * puede modificarse, de modo que se excluye del cuerpo.
 */
export type ProductUpdate = Omit<Product, 'id'>;
