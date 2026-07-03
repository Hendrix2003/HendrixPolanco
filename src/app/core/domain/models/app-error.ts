/**
 * Error de dominio con un mensaje apto para mostrarse al usuario final.
 *
 * La capa de datos traduce cualquier fallo de transporte (HTTP, red, formato)
 * a esta forma, de modo que la capa de presentacion siempre recibe un mensaje
 * en lenguaje claro y no detalles tecnicos crudos.
 */
export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number | null = null,
    override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}
