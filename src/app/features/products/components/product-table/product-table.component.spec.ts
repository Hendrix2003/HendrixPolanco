import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTableComponent } from './product-table.component';
import { Product } from '../../../../core/domain/models/product.model';

describe('ProductTableComponent', () => {
  let fixture: ComponentFixture<ProductTableComponent>;
  let component: ProductTableComponent;

  const products: Product[] = [
    {
      id: 'trj-crd',
      name: 'Tarjeta de Credito',
      description: 'Consumo bajo modalidad credito',
      logo: 'assets-1.png',
      dateRelease: '2025-01-01',
      dateRevision: '2026-01-01',
    },
    {
      id: 'cta-aho',
      name: 'Cuenta de Ahorro',
      description: 'Cuenta de ahorro',
      logo: '',
      dateRelease: '2025-02-01',
      dateRevision: '2026-02-01',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
    component.products = products;
    fixture.detectChanges();
  });

  it('renderiza una fila por producto', () => {
    const rows = fixture.nativeElement.querySelectorAll('.table__row');
    expect(rows).toHaveLength(2);
  });

  it('muestra el nombre y las fechas formateadas', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Tarjeta de Credito');
    expect(text).toContain('01/01/2025');
  });

  it('construye la url de fondo del logo cuando existe', () => {
    expect(component.logoBackground('assets-1.png')).toBe("url('assets-1.png')");
  });

  it('devuelve null como fondo cuando no hay logo', () => {
    expect(component.logoBackground('')).toBeNull();
  });

  it('usa la inicial del nombre como respaldo del logo', () => {
    expect(component.initial('Cuenta de Ahorro')).toBe('C');
    expect(component.initial('')).toBe('?');
  });

  it('emite edit con el producto seleccionado', () => {
    const spy = jest.spyOn(component.edit, 'emit');
    component.edit.emit(products[0]);
    expect(spy).toHaveBeenCalledWith(products[0]);
  });

  it('emite remove con el producto seleccionado', () => {
    const spy = jest.spyOn(component.remove, 'emit');
    component.remove.emit(products[1]);
    expect(spy).toHaveBeenCalledWith(products[1]);
  });
});
