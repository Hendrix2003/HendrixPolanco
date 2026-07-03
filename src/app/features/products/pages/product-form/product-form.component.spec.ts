import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { GetProductsUseCase } from '../../../../core/domain/use-cases/get-products.use-case';
import { CreateProductUseCase } from '../../../../core/domain/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../../../core/domain/use-cases/update-product.use-case';
import { VerifyProductIdUseCase } from '../../../../core/domain/use-cases/verify-product-id.use-case';
import { Product } from '../../../../core/domain/models/product.model';
import { AppError } from '../../../../core/domain/models/app-error';

const existingProduct: Product = {
  id: 'uno',
  name: 'Tarjeta de Credito',
  description: 'Consumo bajo modalidad credito',
  logo: 'assets-1.png',
  dateRelease: '2025-01-01',
  dateRevision: '2026-01-01',
};

interface Mocks {
  getProducts: { execute: jest.Mock };
  createProduct: { execute: jest.Mock };
  updateProduct: { execute: jest.Mock };
  verifyId: { execute: jest.Mock };
  router: { navigate: jest.Mock };
}

function buildMocks(): Mocks {
  return {
    getProducts: { execute: jest.fn().mockReturnValue(of([existingProduct])) },
    createProduct: { execute: jest.fn().mockReturnValue(of(existingProduct)) },
    updateProduct: { execute: jest.fn().mockReturnValue(of(existingProduct)) },
    verifyId: { execute: jest.fn().mockReturnValue(of(false)) },
    router: { navigate: jest.fn() },
  };
}

function configure(mocks: Mocks, paramId: string | null): void {
  TestBed.configureTestingModule({
    imports: [ProductFormComponent],
    providers: [
      { provide: GetProductsUseCase, useValue: mocks.getProducts },
      { provide: CreateProductUseCase, useValue: mocks.createProduct },
      { provide: UpdateProductUseCase, useValue: mocks.updateProduct },
      { provide: VerifyProductIdUseCase, useValue: mocks.verifyId },
      { provide: Router, useValue: mocks.router },
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: { get: () => paramId } } },
      },
    ],
  });
}

function create(): ComponentFixture<ProductFormComponent> {
  const fixture = TestBed.createComponent(ProductFormComponent);
  fixture.detectChanges();
  return fixture;
}

function fillValidForm(component: ProductFormComponent): void {
  component.form.get('id')?.setValue('nuevo');
  component.form.get('name')?.setValue('Producto valido');
  component.form.get('description')?.setValue('Descripcion suficientemente larga');
  component.form.get('logo')?.setValue('assets-1.png');
  component.form.get('dateRelease')?.setValue('2999-01-01');
}

describe('ProductFormComponent (creacion)', () => {
  let mocks: Mocks;

  beforeEach(() => {
    mocks = buildMocks();
    configure(mocks, null);
  });

  it('inicia en modo creacion con el formulario vacio e invalido', () => {
    const component = create().componentInstance;

    expect(component.isEditMode).toBe(false);
    expect(component.form.invalid).toBe(true);
    expect(component.title).toBe('Formulario de Registro');
  });

  it('marca error de requerido en los campos vacios', () => {
    const component = create().componentInstance;
    component.form.get('name')?.markAsTouched();

    expect(component.shouldShowError('name')).toBe(true);
    expect(component.errorFor('name')).toBe('Este campo es requerido.');
  });

  it('valida longitud minima del id', () => {
    const component = create().componentInstance;
    const id = component.form.get('id');
    id?.setValue('ab');
    id?.markAsTouched();

    expect(component.errorFor('id')).toContain('al menos 3 caracteres');
  });

  it('calcula la fecha de revision un anio despues de la liberacion', () => {
    const component = create().componentInstance;
    component.form.get('dateRelease')?.setValue('2025-05-10');

    expect(component.form.get('dateRevision')?.value).toBe('2026-05-10');
  });

  it('rechaza una fecha de liberacion en el pasado', () => {
    const component = create().componentInstance;
    const release = component.form.get('dateRelease');
    release?.setValue('2000-01-01');
    release?.markAsTouched();

    expect(component.shouldShowError('dateRelease')).toBe(true);
    expect(component.errorFor('dateRelease')).toContain('igual o mayor');
  });

  it('no envia cuando el formulario es invalido', () => {
    const component = create().componentInstance;
    component.onSubmit();

    expect(mocks.createProduct.execute).not.toHaveBeenCalled();
  });

  it('crea el producto y navega al listado', fakeAsync(() => {
    const component = create().componentInstance;
    fillValidForm(component);
    tick(500);
    component.form.updateValueAndValidity();

    component.onSubmit();
    tick();

    expect(mocks.createProduct.execute).toHaveBeenCalledTimes(1);
    expect(mocks.router.navigate).toHaveBeenCalledWith(['/products']);
  }));

  it('muestra el error del backend si la creacion falla', fakeAsync(() => {
    const component = create().componentInstance;
    mocks.createProduct.execute.mockReturnValue(
      throwError(() => new AppError('Duplicate identifier found in the database', 400))
    );
    fillValidForm(component);
    tick(500);
    component.form.updateValueAndValidity();

    component.onSubmit();
    tick();

    expect(component.errorMessage).toContain('Duplicate identifier');
  }));

  it('reinicia el formulario en modo creacion', () => {
    const component = create().componentInstance;
    fillValidForm(component);

    component.onReset();

    expect(component.form.get('name')?.value).toBeFalsy();
    expect(component.errorMessage).toBeNull();
  });

  it('cancela y navega al listado', () => {
    const component = create().componentInstance;
    component.onCancel();

    expect(mocks.router.navigate).toHaveBeenCalledWith(['/products']);
  });
});

describe('ProductFormComponent (edicion)', () => {
  let mocks: Mocks;

  it('carga los datos del producto y deshabilita el id', () => {
    mocks = buildMocks();
    configure(mocks, 'uno');
    const component = create().componentInstance;

    expect(component.isEditMode).toBe(true);
    expect(component.title).toBe('Formulario de Edicion');
    expect(component.form.get('id')?.value).toBe('uno');
    expect(component.form.get('id')?.disabled).toBe(true);
    expect(component.form.get('name')?.value).toBe('Tarjeta de Credito');
  });

  it('actualiza el producto y navega al listado', fakeAsync(() => {
    mocks = buildMocks();
    configure(mocks, 'uno');
    const component = create().componentInstance;
    tick();

    component.form.get('name')?.setValue('Nombre actualizado');
    component.onSubmit();
    tick();

    expect(mocks.updateProduct.execute).toHaveBeenCalledWith(
      'uno',
      expect.objectContaining({ name: 'Nombre actualizado' })
    );
    expect(mocks.router.navigate).toHaveBeenCalledWith(['/products']);
  }));

  it('muestra un error cuando el producto a editar no existe', () => {
    mocks = buildMocks();
    mocks.getProducts.execute.mockReturnValue(of([]));
    configure(mocks, 'inexistente');
    const component = create().componentInstance;

    expect(component.errorMessage).toContain('No se encontro');
  });

  it('reinicia recargando los datos originales en modo edicion', () => {
    mocks = buildMocks();
    configure(mocks, 'uno');
    const component = create().componentInstance;
    component.form.get('name')?.setValue('otro');

    component.onReset();

    expect(mocks.getProducts.execute).toHaveBeenCalledTimes(2);
  });
});
