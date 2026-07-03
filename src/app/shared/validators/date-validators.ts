import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Convierte un valor YYYY-MM-DD a Date en horario local, sin desfase de zona. */
export function parseLocalDate(value: string): Date | null {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const parts = value.split('-').map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return null;
  }
  const [year, month, day] = parts;
  return new Date(year, month - 1, day);
}

/** Fecha de hoy normalizada a medianoche local. */
export function today(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * La fecha de liberacion debe ser igual o posterior a la fecha actual.
 */
export function releaseDateNotPastValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = parseLocalDate(control.value);
    if (!date) {
      return null; // el control 'required' se encarga del vacio
    }
    return date.getTime() >= today().getTime() ? null : { releaseDatePast: true };
  };
}

/**
 * La fecha de revision debe ser exactamente un anio posterior a la de
 * liberacion. Se implementa como validador a nivel de grupo porque depende de
 * dos controles.
 *
 * @param releaseKey nombre del control de fecha de liberacion
 * @param revisionKey nombre del control de fecha de revision
 */
export function revisionOneYearAfterReleaseValidator(
  releaseKey: string,
  revisionKey: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const releaseValue = group.get(releaseKey)?.value as string;
    const revisionValue = group.get(revisionKey)?.value as string;

    const release = parseLocalDate(releaseValue);
    const revision = parseLocalDate(revisionValue);

    if (!release || !revision) {
      return null;
    }

    const expected = new Date(
      release.getFullYear() + 1,
      release.getMonth(),
      release.getDate()
    );

    const matches = expected.getTime() === revision.getTime();

    // El error se coloca en el control de revision para poder mostrarlo junto
    // al campo correspondiente, y tambien se retorna a nivel de grupo.
    const revisionControl = group.get(revisionKey);
    if (revisionControl) {
      const currentErrors = { ...(revisionControl.errors ?? {}) };
      if (matches) {
        delete currentErrors['revisionNotOneYear'];
        revisionControl.setErrors(
          Object.keys(currentErrors).length ? currentErrors : null
        );
      } else if (revisionValue) {
        revisionControl.setErrors({ ...currentErrors, revisionNotOneYear: true });
      }
    }

    return matches ? null : { revisionNotOneYear: true };
  };
}
