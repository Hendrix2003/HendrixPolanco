import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppError } from '../../domain/models/app-error';

/**
 * Convierte una respuesta de error HTTP en un AppError con un mensaje claro.
 * Centraliza el mapeo de codigos para que todos los repositorios reporten los
 * fallos de forma homogenea.
 */
export function mapHttpError(error: unknown): Observable<never> {
  return throwError(() => toAppError(error));
}

function toAppError(error: unknown): AppError {
  if (!(error instanceof HttpErrorResponse)) {
    return new AppError(
      'Ocurrio un error inesperado. Intenta de nuevo.',
      null,
      error
    );
  }

  // Error de red o servicio no disponible (backend apagado, sin conexion).
  if (error.status === 0) {
    return new AppError(
      'No se pudo conectar con el servicio. Verifica que el servidor este activo.',
      0,
      error
    );
  }

  const backendMessage = extractBackendMessage(error);

  switch (error.status) {
    case 400:
      return new AppError(
        backendMessage ?? 'La solicitud no es valida. Revisa los datos ingresados.',
        400,
        error
      );
    case 404:
      return new AppError(
        backendMessage ?? 'No se encontro el producto solicitado.',
        404,
        error
      );
    case 500:
      return new AppError(
        'El servicio presento un error. Intenta mas tarde.',
        500,
        error
      );
    default:
      return new AppError(
        backendMessage ?? 'No se pudo completar la operacion.',
        error.status,
        error
      );
  }
}

/** Extrae el mensaje que envia el backend cuando esta disponible. */
function extractBackendMessage(error: HttpErrorResponse): string | null {
  const body = error.error;
  if (body && typeof body === 'object' && typeof body.message === 'string') {
    return body.message;
  }
  return null;
}
