/**
 * Contratos de transporte (DTO) tal como los define el servicio backend.
 * Se mantienen separados del modelo de dominio para que un cambio en la API
 * no se propague al resto de la aplicacion: el mapper absorbe la diferencia.
 */

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

/** Respuesta de GET /bp/products. */
export interface ProductListResponseDto {
  data: ProductDto[];
}

/** Respuesta de POST y PUT /bp/products. */
export interface ProductMutationResponseDto {
  message: string;
  data: ProductDto;
}

/** Respuesta de DELETE /bp/products/:id. */
export interface ProductDeleteResponseDto {
  message: string;
}
