import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { firstValueFrom, Observable } from 'rxjs';
import { ValidationErrors } from '@angular/forms';
import { uniqueProductIdValidator } from './unique-id.validator';
import { VerifyProductIdUseCase } from '../../core/domain/use-cases/verify-product-id.use-case';

describe('uniqueProductIdValidator', () => {
  function buildUseCase(
    impl: (id: string) => Observable<boolean>
  ): VerifyProductIdUseCase {
    return { execute: jest.fn(impl) } as unknown as VerifyProductIdUseCase;
  }

  const run = (
    validator: ReturnType<typeof uniqueProductIdValidator>,
    control: FormControl
  ): Promise<ValidationErrors | null> =>
    firstValueFrom(validator(control) as Observable<ValidationErrors | null>);

  it('marca idTaken cuando el servicio indica que el id existe', async () => {
    const useCase = buildUseCase(() => of(true));
    const validator = uniqueProductIdValidator(useCase, 0);

    const result = await run(validator, new FormControl('uno'));

    expect(result).toEqual({ idTaken: true });
    expect(useCase.execute).toHaveBeenCalledWith('uno');
  });

  it('devuelve null cuando el id no existe', async () => {
    const useCase = buildUseCase(() => of(false));
    const validator = uniqueProductIdValidator(useCase, 0);

    const result = await run(validator, new FormControl('nuevo'));

    expect(result).toBeNull();
  });

  it('no consulta el servicio cuando el control esta vacio', async () => {
    const useCase = buildUseCase(() => of(true));
    const validator = uniqueProductIdValidator(useCase, 0);

    const result = await run(validator, new FormControl('   '));

    expect(result).toBeNull();
    expect(useCase.execute).not.toHaveBeenCalled();
  });

  it('no bloquea el formulario si el servicio falla', async () => {
    const useCase = buildUseCase(() => throwError(() => new Error('offline')));
    const validator = uniqueProductIdValidator(useCase, 0);

    const result = await run(validator, new FormControl('uno'));

    expect(result).toBeNull();
  });
});
