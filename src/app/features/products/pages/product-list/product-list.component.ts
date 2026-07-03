import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Product } from '../../../../core/domain/models/product.model';
import { AppError } from '../../../../core/domain/models/app-error';
import { GetProductsUseCase } from '../../../../core/domain/use-cases/get-products.use-case';
import { DeleteProductUseCase } from '../../../../core/domain/use-cases/delete-product.use-case';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { ProductSearchComponent } from '../../components/product-search/product-search.component';
import { PageSizeSelectorComponent } from '../../components/page-size-selector/page-size-selector.component';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';
import {
  clampPage,
  filterProducts,
  paginate,
  totalPages,
} from './product-list.logic';

/**
 * Vista principal de productos financieros. Orquesta:
 *  F1 listado, F2 busqueda, F3 cantidad de registros + paginacion,
 *  F5 navegacion a edicion y F6 eliminacion con modal de confirmacion.
 *
 * El estado de UI (termino de busqueda, pagina, tamanio de pagina) se mantiene
 * local; el acceso a datos se delega en los casos de uso del dominio.
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    AppHeaderComponent,
    ProductSearchComponent,
    PageSizeSelectorComponent,
    ProductTableComponent,
    ConfirmDialogComponent,
    SkeletonLoaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  private readonly getProducts = inject(GetProductsUseCase);
  private readonly deleteProduct = inject(DeleteProductUseCase);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly pageSizeOptions = [5, 10, 20] as const;

  private allProducts: Product[] = [];

  searchTerm = '';
  pageSize = 5;
  currentPage = 1;

  loading = false;
  errorMessage: string | null = null;

  /** Producto pendiente de confirmacion de borrado; null si el modal esta cerrado. */
  productToDelete: Product | null = null;
  deleting = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = null;

    this.getProducts
      .execute()
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (products) => {
          this.allProducts = products;
          this.currentPage = 1;
          this.cdr.markForCheck();
        },
        error: (error: AppError) => {
          this.errorMessage = error.message;
          this.allProducts = [];
          this.cdr.markForCheck();
        },
      });
  }

  // --- F2: busqueda -------------------------------------------------------
  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
  }

  // --- F3: cantidad de registros -----------------------------------------
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    this.currentPage = clampPage(page, this.totalPageCount);
  }

  // --- F4: navegacion a alta ---------------------------------------------
  onAdd(): void {
    this.router.navigate(['/products/new']);
  }

  // --- F5: navegacion a edicion ------------------------------------------
  onEdit(product: Product): void {
    this.router.navigate(['/products', product.id, 'edit']);
  }

  // --- F6: eliminacion ----------------------------------------------------
  onRequestDelete(product: Product): void {
    this.productToDelete = product;
  }

  onCancelDelete(): void {
    if (!this.deleting) {
      this.productToDelete = null;
    }
  }

  onConfirmDelete(): void {
    if (!this.productToDelete) {
      return;
    }
    const target = this.productToDelete;
    this.deleting = true;

    this.deleteProduct
      .execute(target.id)
      .pipe(finalize(() => {
        this.deleting = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.allProducts = this.allProducts.filter((p) => p.id !== target.id);
          this.productToDelete = null;
          this.currentPage = clampPage(this.currentPage, this.totalPageCount);
          this.cdr.markForCheck();
        },
        error: (error: AppError) => {
          this.errorMessage = error.message;
          this.productToDelete = null;
          this.cdr.markForCheck();
        },
      });
  }

  // --- Derivados de estado (getters puros) --------------------------------
  get filteredProducts(): Product[] {
    return filterProducts(this.allProducts, this.searchTerm);
  }

  get pagedProducts(): Product[] {
    return paginate(this.filteredProducts, this.currentPage, this.pageSize);
  }

  get totalPageCount(): number {
    return totalPages(this.filteredProducts.length, this.pageSize);
  }

  get resultCount(): number {
    return this.filteredProducts.length;
  }

  get isEmpty(): boolean {
    return !this.loading && !this.errorMessage && this.resultCount === 0;
  }

  get deleteMessage(): string {
    return this.productToDelete
      ? `¿Estas seguro de eliminar el producto ${this.productToDelete.name}?`
      : '';
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPageCount }, (_, index) => index + 1);
  }
}
