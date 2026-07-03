import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSearchComponent } from './product-search/product-search.component';
import { PageSizeSelectorComponent } from './page-size-selector/page-size-selector.component';
import { ProductActionsMenuComponent } from './product-actions-menu/product-actions-menu.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SkeletonLoaderComponent } from './skeleton-loader/skeleton-loader.component';
import { AppHeaderComponent } from './app-header/app-header.component';

describe('ProductSearchComponent', () => {
  let fixture: ComponentFixture<ProductSearchComponent>;
  let component: ProductSearchComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emite el termino ingresado', () => {
    const spy = jest.spyOn(component.search, 'emit');
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'tarjeta';
    input.dispatchEvent(new Event('input'));

    expect(spy).toHaveBeenCalledWith('tarjeta');
  });
});

describe('PageSizeSelectorComponent', () => {
  let fixture: ComponentFixture<PageSizeSelectorComponent>;
  let component: PageSizeSelectorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSizeSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageSizeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renderiza las opciones 5, 10 y 20', () => {
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options).toHaveLength(3);
    expect(options[0].value).toBe('5');
    expect(options[2].value).toBe('20');
  });

  it('emite el nuevo tamanio como numero', () => {
    const spy = jest.spyOn(component.sizeChange, 'emit');
    const select = fixture.nativeElement.querySelector('select');
    select.value = '20';
    select.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith(20);
  });
});

describe('ProductActionsMenuComponent', () => {
  let fixture: ComponentFixture<ProductActionsMenuComponent>;
  let component: ProductActionsMenuComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductActionsMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('abre y cierra el menu al presionar el disparador', () => {
    expect(component.open).toBe(false);
    const trigger = fixture.nativeElement.querySelector('.menu__trigger');
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(component.open).toBe(true);
    expect(fixture.nativeElement.querySelector('.menu__panel')).toBeTruthy();
  });

  it('emite edit y cierra el menu', () => {
    const spy = jest.spyOn(component.edit, 'emit');
    fixture.nativeElement
      .querySelector('.menu__trigger')
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    fixture.nativeElement.querySelectorAll('.menu__item')[0].click();

    expect(spy).toHaveBeenCalled();
    expect(component.open).toBe(false);
  });

  it('emite remove y cierra el menu', () => {
    const spy = jest.spyOn(component.remove, 'emit');
    fixture.nativeElement
      .querySelector('.menu__trigger')
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    fixture.nativeElement.querySelectorAll('.menu__item')[1].click();

    expect(spy).toHaveBeenCalled();
  });

  it('cierra el menu al hacer clic fuera', () => {
    component.open = true;
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(component.open).toBe(false);
  });

  it('cierra el menu con la tecla Escape', () => {
    component.open = true;
    component.onEscape();

    expect(component.open).toBe(false);
  });
});

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    component.message = '¿Estas seguro de eliminar el producto Tarjeta?';
    fixture.detectChanges();
  });

  it('muestra el mensaje recibido', () => {
    const text = fixture.nativeElement.querySelector('.dialog__message').textContent;
    expect(text).toContain('Tarjeta');
  });

  it('emite confirm al presionar Confirmar', () => {
    const spy = jest.spyOn(component.confirm, 'emit');
    fixture.nativeElement.querySelector('.btn--accent').click();

    expect(spy).toHaveBeenCalled();
  });

  it('emite cancel al presionar Cancelar', () => {
    const spy = jest.spyOn(component.cancel, 'emit');
    fixture.nativeElement.querySelector('.btn--ghost').click();

    expect(spy).toHaveBeenCalled();
  });

  it('no emite cancel al hacer clic en el overlay cuando esta ocupado', () => {
    const spy = jest.spyOn(component.cancel, 'emit');
    component.busy = true;
    component.onOverlayClick(new MouseEvent('click'));

    expect(spy).not.toHaveBeenCalled();
  });

  it('emite cancel con Escape cuando no esta ocupado', () => {
    const spy = jest.spyOn(component.cancel, 'emit');
    component.onEscape();

    expect(spy).toHaveBeenCalled();
  });
});

describe('SkeletonLoaderComponent', () => {
  it('genera el numero de filas indicado', async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoaderComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(SkeletonLoaderComponent);
    fixture.componentInstance.rows = 3;
    fixture.detectChanges();

    expect(fixture.componentInstance.rowsArray).toEqual([0, 1, 2]);
    expect(fixture.nativeElement.querySelectorAll('.skeleton__row')).toHaveLength(3);
  });
});

describe('AppHeaderComponent', () => {
  it('muestra la marca BANCO', async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeaderComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppHeaderComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('BANCO');
  });
});
