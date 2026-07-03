import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

/**
 * Selector de cantidad de registros a mostrar (F3). Ofrece los valores
 * 5, 10 y 20 exigidos por el enunciado.
 */
@Component({
  selector: 'app-page-size-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="size">
      <span class="visually-hidden">Cantidad de registros por pagina</span>
      <select
        class="size__select"
        [value]="value"
        (change)="onChange($event)"
        aria-label="Cantidad de registros por pagina"
      >
        @for (option of options; track option) {
          <option [value]="option">{{ option }}</option>
        }
      </select>
    </label>
  `,
  styles: [
    `
      .size__select {
        appearance: none;
        -webkit-appearance: none;
        padding: 8px 34px 8px 12px;
        border: 1px solid var(--color-line-strong);
        border-radius: var(--radius-sm);
        background-color: var(--color-surface);
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235b7185' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
        background-repeat: no-repeat;
        background-position: right 10px center;
        color: var(--color-ink);
        cursor: pointer;
        transition: border-color var(--transition), box-shadow var(--transition);
      }

      .size__select:focus-visible {
        border-color: var(--color-navy);
        box-shadow: var(--ring);
      }
    `,
  ],
})
export class PageSizeSelectorComponent {
  @Input() value = 5;
  @Input() options: readonly number[] = [5, 10, 20];
  @Output() readonly sizeChange = new EventEmitter<number>();

  onChange(event: Event): void {
    const size = Number((event.target as HTMLSelectElement).value);
    this.sizeChange.emit(size);
  }
}
