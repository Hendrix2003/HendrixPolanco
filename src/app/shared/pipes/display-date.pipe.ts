import { Pipe, PipeTransform } from '@angular/core';
import { parseLocalDate } from '../validators/date-validators';

/**
 * Formatea una fecha ISO (YYYY-MM-DD) al formato local dd/MM/yyyy que muestran
 * los disenos de la tabla. Es puro: la misma entrada produce la misma salida.
 */
@Pipe({
  name: 'displayDate',
  standalone: true,
})
export class DisplayDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    const date = parseLocalDate(value);
    if (!date) {
      return value;
    }
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
