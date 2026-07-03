import { FormControl, FormGroup } from '@angular/forms';
import {
  parseLocalDate,
  releaseDateNotPastValidator,
  revisionOneYearAfterReleaseValidator,
  today,
} from './date-validators';

describe('date-validators', () => {
  describe('parseLocalDate', () => {
    it('convierte una cadena YYYY-MM-DD en una fecha local', () => {
      const date = parseLocalDate('2025-03-15');

      expect(date).not.toBeNull();
      expect(date?.getFullYear()).toBe(2025);
      expect(date?.getMonth()).toBe(2);
      expect(date?.getDate()).toBe(15);
    });

    it('devuelve null ante una cadena vacia', () => {
      expect(parseLocalDate('')).toBeNull();
    });

    it('devuelve null ante un formato invalido', () => {
      expect(parseLocalDate('no-es-fecha')).toBeNull();
      expect(parseLocalDate('2025-13')).toBeNull();
    });
  });

  describe('releaseDateNotPastValidator', () => {
    const validator = releaseDateNotPastValidator();

    it('acepta la fecha de hoy', () => {
      const now = today();
      const value = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, '0')}-${`${now.getDate()}`.padStart(2, '0')}`;

      expect(validator(new FormControl(value))).toBeNull();
    });

    it('acepta una fecha futura', () => {
      const future = new Date(today().getFullYear() + 1, 0, 1);
      const value = `${future.getFullYear()}-01-01`;

      expect(validator(new FormControl(value))).toBeNull();
    });

    it('rechaza una fecha pasada', () => {
      expect(validator(new FormControl('2000-01-01'))).toEqual({
        releaseDatePast: true,
      });
    });

    it('no valida cuando el control esta vacio', () => {
      expect(validator(new FormControl(''))).toBeNull();
    });
  });

  describe('revisionOneYearAfterReleaseValidator', () => {
    const buildGroup = (release: string, revision: string): FormGroup =>
      new FormGroup({
        dateRelease: new FormControl(release),
        dateRevision: new FormControl(revision),
      });

    const validator = revisionOneYearAfterReleaseValidator(
      'dateRelease',
      'dateRevision'
    );

    it('acepta una revision exactamente un anio despues', () => {
      const group = buildGroup('2025-01-01', '2026-01-01');

      expect(validator(group)).toBeNull();
    });

    it('rechaza una revision que no es un anio despues', () => {
      const group = buildGroup('2025-01-01', '2025-06-01');

      expect(validator(group)).toEqual({ revisionNotOneYear: true });
      expect(group.get('dateRevision')?.errors).toEqual({
        revisionNotOneYear: true,
      });
    });

    it('limpia el error de revision cuando la fecha se corrige', () => {
      const group = buildGroup('2025-01-01', '2025-06-01');
      validator(group);
      expect(group.get('dateRevision')?.errors).not.toBeNull();

      group.get('dateRevision')?.setValue('2026-01-01');
      const result = validator(group);

      expect(result).toBeNull();
      expect(group.get('dateRevision')?.errors).toBeNull();
    });

    it('no valida cuando falta alguna de las fechas', () => {
      expect(validator(buildGroup('', ''))).toBeNull();
      expect(validator(buildGroup('2025-01-01', ''))).toBeNull();
    });
  });
});
