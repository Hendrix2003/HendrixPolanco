import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { mapHttpError } from './http-error.mapper';
import { AppError } from '../../domain/models/app-error';

/** Fuerza la resolucion del observable de error y devuelve el AppError. */
async function catchAppError(source: ReturnType<typeof mapHttpError>): Promise<AppError> {
  try {
    await firstValueFrom(source);
    throw new Error('Se esperaba un error');
  } catch (error) {
    return error as AppError;
  }
}

describe('mapHttpError', () => {
  it('traduce un error de red (status 0) a un mensaje de conexion', async () => {
    const httpError = new HttpErrorResponse({ status: 0, error: null });

    const appError = await catchAppError(mapHttpError(httpError));

    expect(appError).toBeInstanceOf(AppError);
    expect(appError.status).toBe(0);
    expect(appError.message).toContain('No se pudo conectar');
  });

  it('usa el mensaje del backend en un 400 cuando esta disponible', async () => {
    const httpError = new HttpErrorResponse({
      status: 400,
      error: { message: 'Duplicate identifier found in the database' },
    });

    const appError = await catchAppError(mapHttpError(httpError));

    expect(appError.status).toBe(400);
    expect(appError.message).toBe('Duplicate identifier found in the database');
  });

  it('aplica un mensaje por defecto en un 400 sin cuerpo', async () => {
    const httpError = new HttpErrorResponse({ status: 400, error: null });

    const appError = await catchAppError(mapHttpError(httpError));

    expect(appError.message).toContain('no es valida');
  });

  it('traduce un 404 con mensaje generico cuando no hay cuerpo', async () => {
    const httpError = new HttpErrorResponse({ status: 404, error: {} });

    const appError = await catchAppError(mapHttpError(httpError));

    expect(appError.status).toBe(404);
    expect(appError.message).toContain('No se encontro');
  });

  it('traduce un 500 a un mensaje de servicio', async () => {
    const httpError = new HttpErrorResponse({ status: 500, error: null });

    const appError = await catchAppError(mapHttpError(httpError));

    expect(appError.message).toContain('servicio presento un error');
  });

  it('maneja un codigo no contemplado con mensaje por defecto', async () => {
    const httpError = new HttpErrorResponse({ status: 418, error: null });

    const appError = await catchAppError(mapHttpError(httpError));

    expect(appError.status).toBe(418);
    expect(appError.message).toContain('No se pudo completar');
  });

  it('envuelve un error no HTTP como error inesperado', async () => {
    const appError = await catchAppError(mapHttpError(new Error('boom')));

    expect(appError.status).toBeNull();
    expect(appError.message).toContain('error inesperado');
  });
});
