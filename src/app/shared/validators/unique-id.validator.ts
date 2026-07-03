import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { VerifyProductIdUseCase } from '../../core/domain/use-cases/verify-product-id.use-case';

/**
 * Validador asincrono que confirma, contra el servicio, que el identificador
 * no exista previamente. Aplica un pequenio debounce para no consultar en cada
 * pulsacion de tecla.
 *
 * Si el servicio no responde, se opta por no bloquear el formulario: la
 * unicidad la reforzara el backend al crear (respuesta 400). Asi se evita
 * dejar al usuario atascado por un fallo de red.
 */
export function uniqueProductIdValidator(
  verifyId: VerifyProductIdUseCase,
  debounceMs = 400
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = (control.value ?? '').toString().trim();
    if (!value) {
      return of(null);
    }

    return timer(debounceMs).pipe(
      switchMap(() => verifyId.execute(value)),
      map((exists) => (exists ? { idTaken: true } : null)),
      catchError(() => of(null)),
      take(1)
    );
  };
}
