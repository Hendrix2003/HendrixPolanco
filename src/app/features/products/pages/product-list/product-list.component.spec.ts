import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { GetProductsUseCase } from '../../../../core/domain/use-cases/get-products.use-case';
import { DeleteProductUseCase } from '../../../../core/domain/use-cases/delete-product.use-case';
import { Product } from '../../../../core/domain/models/product.model';
import { AppError } from '../../../../core/domain/models/app-error';

function makeProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `id-${index}`,
    name: `Producto ${index}`,
    description: `Descripcion ${index}`,
    logo: 'logo.png',
    dateRelease: '2025-01-01',
    dateRevision: '2026-01-01',
  }));
}

describe('ProductListComponent', () => {
  let fixture: ComponentFixture<ProductListComponent>;
  let component: ProductListComponent;
  let getProducts: { execute: jest.Mock };
  let deleteProduct: { execute: jest.Mock };
  let router: { navigate: jest.Mock };

  async function setup(products: Product[] = makeProducts(12)): Promise<void> {
    getProducts = { execute: jest.fn().mockReturnValue(of(products)) };
    deleteProduct = { execute: jest.fn().mockReturnValue(of(void 0)) };
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: GetProductsUseCase, useValue: getProducts },
        { provide: DeleteProductUseCase, useValue: deleteProduct },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('carga los productos al iniciar (F1)', async () => {
    await setup();

    expect(getProducts.execute).toHaveBeenCalled();
    expect(component.resultCount).toBe(12);
    expect(component.loading).toBe(false);
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    getProducts = {
      execute: jest.fn().mockReturnValue(
        throwError(() => new AppError('Sin conexion', 0))
      ),
    };
    deleteProduct = { execute: jest.fn() };
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: GetProductsUseCase, useValue: getProducts },
        { provide: DeleteProductUseCase, useValue: deleteProduct },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Sin conexion');
    expect(component.resultCount).toBe(0);
  });

  it('filtra por termino de busqueda (F2)', async () => {
    await setup();
    component.onSearch('Producto 3');

    expect(component.resultCount).toBe(1);
    expect(component.currentPage).toBe(1);
  });

  it('pagina segun el tamanio de pagina (F3)', async () => {
    await setup();

    expect(component.pageSize).toBe(5);
    expect(component.pagedProducts).toHaveLength(5);
    expect(component.totalPageCount).toBe(3);

    component.onPageSizeChange(10);
    expect(component.pagedProducts).toHaveLength(10);
    expect(component.totalPageCount).toBe(2);
  });

  it('navega entre paginas respetando los limites', async () => {
    await setup();

    component.goToPage(2);
    expect(component.currentPage).toBe(2);

    component.goToPage(99);
    expect(component.currentPage).toBe(3);

    component.goToPage(-1);
    expect(component.currentPage).toBe(1);
  });

  it('genera la lista de numeros de pagina', async () => {
    await setup();
    expect(component.pageNumbers).toEqual([1, 2, 3]);
  });

  it('navega al alta de producto (F4)', async () => {
    await setup();
    component.onAdd();

    expect(router.navigate).toHaveBeenCalledWith(['/products/new']);
  });

  it('navega a la edicion de un producto (F5)', async () => {
    await setup();
    component.onEdit(makeProducts(1)[0]);

    expect(router.navigate).toHaveBeenCalledWith(['/products', 'id-0', 'edit']);
  });

  it('abre y cancela el modal de eliminacion (F6)', async () => {
    await setup();
    const target = component.pagedProducts[0];

    component.onRequestDelete(target);
    expect(component.productToDelete).toBe(target);
    expect(component.deleteMessage).toContain(target.name);

    component.onCancelDelete();
    expect(component.productToDelete).toBeNull();
  });

  it('elimina un producto tras confirmar (F6)', async () => {
    await setup();
    const target = component.pagedProducts[0];
    component.onRequestDelete(target);

    component.onConfirmDelete();

    expect(deleteProduct.execute).toHaveBeenCalledWith(target.id);
    expect(component.resultCount).toBe(11);
    expect(component.productToDelete).toBeNull();
  });

  it('muestra error si la eliminacion falla', async () => {
    await setup();
    deleteProduct.execute.mockReturnValue(
      throwError(() => new AppError('No se pudo eliminar', 500))
    );
    const target = component.pagedProducts[0];
    component.onRequestDelete(target);

    component.onConfirmDelete();

    expect(component.errorMessage).toBe('No se pudo eliminar');
    expect(component.productToDelete).toBeNull();
  });

  it('no hace nada al confirmar sin producto seleccionado', async () => {
    await setup();
    component.productToDelete = null;
    component.onConfirmDelete();

    expect(deleteProduct.execute).not.toHaveBeenCalled();
  });

  it('reporta estado vacio cuando no hay resultados', async () => {
    await setup(makeProducts(0));

    expect(component.isEmpty).toBe(true);
  });
});
