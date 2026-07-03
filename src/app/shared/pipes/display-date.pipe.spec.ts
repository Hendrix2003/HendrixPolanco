import { DisplayDatePipe } from './display-date.pipe';

describe('DisplayDatePipe', () => {
  let pipe: DisplayDatePipe;

  beforeEach(() => {
    pipe = new DisplayDatePipe();
  });

  it('formatea una fecha ISO al formato dd/MM/yyyy', () => {
    expect(pipe.transform('2025-01-05')).toBe('05/01/2025');
  });

  it('rellena con ceros dias y meses de un digito', () => {
    expect(pipe.transform('2025-03-09')).toBe('09/03/2025');
  });

  it('devuelve cadena vacia ante null o undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('devuelve el valor original si no es una fecha valida', () => {
    expect(pipe.transform('texto')).toBe('texto');
  });
});
