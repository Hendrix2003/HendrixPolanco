import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

/**
 * Campo de busqueda de productos (F2). Componente controlado: recibe el valor
 * actual y emite cada cambio para que el contenedor filtre el listado.
 */
@Component({
  selector: 'app-product-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="search">
      <svg class="search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8" />
        <path d="m20 20-3.2-3.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
      <input
        type="search"
        class="search__input"
        [attr.aria-label]="'Buscar productos'"
        placeholder="Buscar..."
        [value]="value"
        (input)="onInput($event)"
      />
    </div>
  `,
  styles: [
    `
      .search {
        position: relative;
        display: flex;
        align-items: center;
        max-width: 320px;
      }

      .search__icon {
        position: absolute;
        left: 12px;
        color: var(--color-mist);
        pointer-events: none;
      }

      .search__input {
        width: 100%;
        padding: 10px 14px 10px 38px;
        border: 1px solid var(--color-line-strong);
        border-radius: var(--radius-sm);
        background: var(--color-surface);
        color: var(--color-ink);
        transition: border-color var(--transition), box-shadow var(--transition);
      }

      .search__input::placeholder {
        color: var(--color-mist);
      }

      .search__input:focus-visible {
        border-color: var(--color-navy);
        box-shadow: var(--ring);
      }
    `,
  ],
})
export class ProductSearchComponent {
  @Input() value = '';
  @Output() readonly search = new EventEmitter<string>();

  onInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.search.emit(term);
  }
}
