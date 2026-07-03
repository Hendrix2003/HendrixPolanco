import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../core/domain/models/product.model';
import { DisplayDatePipe } from '../../../../shared/pipes/display-date.pipe';
import { ProductActionsMenuComponent } from '../product-actions-menu/product-actions-menu.component';

/**
 * Tabla de productos financieros segun el diseno D1.
 * Recibe los productos a mostrar y emite las acciones de editar o eliminar.
 */
@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [DisplayDatePipe, ProductActionsMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table" role="table" aria-label="Listado de productos financieros">
      <div class="table__head" role="row">
        <span class="col col--logo" role="columnheader">
          Logo
        </span>

        <span class="col col--name" role="columnheader">
          Nombre del producto
        </span>

        <span class="col col--desc" role="columnheader">
          Descripcion
          <span class="col__hint" title="Descripcion del producto">&#9432;</span>
        </span>

        <span class="col col--date" role="columnheader">
          Fecha de liberacion
          <span class="col__hint" title="Fecha de liberacion">&#9432;</span>
        </span>

        <span class="col col--date" role="columnheader">
          Fecha de reestructuracion
          <span class="col__hint" title="Fecha de revision">&#9432;</span>
        </span>

        <span class="col col--actions" role="columnheader">
          <span class="visually-hidden">Acciones</span>
        </span>
      </div>

      <div class="table__body">
        @for (product of products; track product.id) {
          <div class="table__row" role="row">
            <span class="col col--logo" role="cell">
              <span
                class="logo"
                [style.background-image]="logoBackground(product.logo)"
              >
                @if (!product.logo) {
                  <span class="logo__fallback">
                    {{ initial(product.name) }}
                  </span>
                }
              </span>
            </span>

            <span class="col col--name" role="cell">
              <span class="cell-strong">{{ product.name }}</span>
              <span class="cell-id">ID: {{ product.id }}</span>
            </span>

            <span class="col col--desc" role="cell">
              {{ product.description }}
            </span>

            <span class="col col--date" role="cell">
              {{ product.dateRelease | displayDate }}
            </span>

            <span class="col col--date" role="cell">
              {{ product.dateRevision | displayDate }}
            </span>

            <span class="col col--actions" role="cell">
              <app-product-actions-menu
                [productName]="product.name"
                [open]="activeMenuId === product.id"
                (toggleMenu)="toggleMenu(product.id)"
                (edit)="onEdit(product)"
                (remove)="onRemove(product)"
              />
            </span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .table {
        --table-columns:
          70px
          minmax(150px, 1.5fr)
          minmax(190px, 2fr)
          minmax(125px, 1.1fr)
          minmax(135px, 1.2fr)
          52px;

        width: 100%;
        position: relative;
        border: 1px solid var(--color-line);
        border-radius: var(--radius-md);
        overflow: visible;
        background: var(--color-surface);
      }

      .table__head,
      .table__row {
        display: grid;
        grid-template-columns: var(--table-columns);
        gap: var(--space-4);
        padding: var(--space-4);
        align-items: center;
      }

      .table__head {
        background: var(--color-canvas-alt);
        border-bottom: 1px solid var(--color-line);
        border-radius: var(--radius-md) var(--radius-md) 0 0;
      }

      .table__row {
        border-bottom: 1px solid var(--color-line);
        transition: background var(--transition);
      }

      .table__row:last-child {
        border-bottom: none;
      }

      .table__row:hover {
        background: var(--color-canvas);
      }

      .col {
        min-width: 0;
        font-size: var(--text-sm);
        color: var(--color-ink-soft);
      }

      .col--logo,
      .col--actions {
        display: flex;
        align-items: center;
      }

      .col--actions {
        justify-content: flex-end;
      }

      .table__head .col {
        font-family: var(--font-display);
        font-weight: 600;
        font-size: var(--text-xs);
        letter-spacing: 0.02em;
        text-transform: none;
        color: var(--color-slate);
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .col__hint {
        color: var(--color-mist);
        font-size: var(--text-xs);
        cursor: help;
      }

      .col--name {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .cell-strong {
        font-weight: 600;
        color: var(--color-ink);
      }

      .cell-id {
        font-size: var(--text-xs);
        color: var(--color-mist);
      }

      .col--desc {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: var(--color-canvas-alt);
        background-size: cover;
        background-position: center;
        border: 1px solid var(--color-line);
        overflow: hidden;
      }

      .logo__fallback {
        font-family: var(--font-display);
        font-weight: 600;
        font-size: var(--text-sm);
        color: var(--color-slate);
      }

      @media (max-width: 860px) {
        .table__head {
          display: none;
        }

        .table__row {
          grid-template-columns: 48px 1fr 44px;
          grid-template-areas:
            'logo name actions'
            'logo desc actions'
            'logo dates actions';
          row-gap: 2px;
        }

        .col--logo {
          grid-area: logo;
        }

        .col--name {
          grid-area: name;
        }

        .col--desc {
          grid-area: desc;
          -webkit-line-clamp: 1;
        }

        .col--date:nth-of-type(4) {
          grid-area: dates;
          font-size: var(--text-xs);
          color: var(--color-mist);
        }

        .col--date:nth-of-type(5) {
          display: none;
        }

        .col--actions {
          grid-area: actions;
        }
      }
    `,
  ],
})
export class ProductTableComponent {
  @Input() products: Product[] = [];

  @Output() readonly edit = new EventEmitter<Product>();
  @Output() readonly remove = new EventEmitter<Product>();

  /**
   * Guarda el ID del único producto cuyo menú está abierto.
   * Si es null, todos los menús están cerrados.
   */
  activeMenuId: Product['id'] | null = null;

  toggleMenu(productId: Product['id']): void {
    this.activeMenuId =
      this.activeMenuId === productId
        ? null
        : productId;
  }

  onEdit(product: Product): void {
    this.activeMenuId = null;
    this.edit.emit(product);
  }

  onRemove(product: Product): void {
    this.activeMenuId = null;
    this.remove.emit(product);
  }

  logoBackground(logo: string): string | null {
    return logo ? `url('${logo}')` : null;
  }

  initial(name: string): string {
    const trimmed = name?.trim() ?? '';
    return trimmed.length ? trimmed.charAt(0).toUpperCase() : '?';
  }
}