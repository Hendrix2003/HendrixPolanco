import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';


@Component({
  selector: 'app-product-actions-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="menu">
      <button
        type="button"
        class="menu__trigger"
        [attr.aria-label]="'Acciones para ' + productName"
        [attr.aria-expanded]="open"
        aria-haspopup="menu"
        (click)="onToggle($event)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="5" r="1.6" fill="currentColor" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          <circle cx="12" cy="19" r="1.6" fill="currentColor" />
        </svg>
      </button>

      @if (open) {
        <div class="menu__panel" role="menu">
          <button
            type="button"
            class="menu__item"
            role="menuitem"
            (click)="onEdit()"
          >
            Editar
          </button>

          <button
            type="button"
            class="menu__item menu__item--danger"
            role="menuitem"
            (click)="onDelete()"
          >
            Eliminar
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .menu {
        position: relative;
        display: inline-flex;
      }

      .menu__trigger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: 1px solid transparent;
        border-radius: var(--radius-sm);
        background: transparent;
        color: var(--color-slate);
        transition: background var(--transition), border-color var(--transition);
      }

      .menu__trigger:hover {
        background: var(--color-canvas-alt);
        border-color: var(--color-line);
      }

      .menu__panel {
        position: absolute;
        top: calc(100% + 6px);
        right: 0;
        z-index: 1000;
        min-width: 148px;
        padding: 6px;
        background: var(--color-surface);
        border: 1px solid var(--color-line);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .menu__item {
        text-align: left;
        padding: 9px 12px;
        border: none;
        border-radius: var(--radius-sm);
        background: transparent;
        color: var(--color-ink);
        font-size: var(--text-sm);
        transition: background var(--transition), color var(--transition);
      }

      .menu__item:hover {
        background: var(--color-canvas-alt);
      }

      .menu__item--danger:hover {
        background: var(--color-danger-soft);
        color: var(--color-danger);
      }
    `,
  ],
})
export class ProductActionsMenuComponent {
  @Input() productName = '';

  /*
   * La tabla indica cual menu debe permanecer abierto.
   */
  @Input() open = false;

  /*
   * Notifica a la tabla que se abrio o cerro este menu.
   */
  @Output() readonly toggleMenu = new EventEmitter<void>();

  @Output() readonly edit = new EventEmitter<void>();
  @Output() readonly remove = new EventEmitter<void>();

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  onToggle(event: MouseEvent): void {
    event.stopPropagation();

    this.open = !this.open;
    this.toggleMenu.emit();
  }

  onEdit(): void {
    this.close();
    this.edit.emit();
  }

  onDelete(): void {
    this.close();
    this.remove.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.close();
    }
  }

  private close(): void {
    this.open = false;
    this.toggleMenu.emit();
  }
}