import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

/**
 * Modal de confirmacion segun el diseno D4. Se usa para confirmar la
 * eliminacion de un producto (F6). Presenta dos acciones: Cancelar (oculta el
 * modal) y Confirmar (procede con la operacion).
 *
 * Es un componente de presentacion: no ejecuta la eliminacion, solo emite la
 * decision del usuario.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="onOverlayClick($event)">
      <div
        class="dialog"
        role="alertdialog"
        aria-modal="true"
        [attr.aria-label]="message"
        (click)="$event.stopPropagation()"
      >
        <p class="dialog__message">{{ message }}</p>

        <div class="dialog__actions">
          <button
            type="button"
            class="btn btn--ghost"
            (click)="cancel.emit()"
            [disabled]="busy"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn--accent"
            (click)="confirm.emit()"
            [disabled]="busy"
          >
            {{ busy ? 'Eliminando...' : 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-4);
        background: rgba(15, 39, 64, 0.44);
        animation: fade 140ms ease-out;
      }

      .dialog {
        width: 100%;
        max-width: 420px;
        padding: var(--space-6);
        background: var(--color-surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        animation: rise 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }

      .dialog__message {
        margin: 0 0 var(--space-6);
        font-size: var(--text-lg);
        color: var(--color-ink);
        line-height: 1.45;
      }

      .dialog__actions {
        display: flex;
        gap: var(--space-3);
      }

      .btn {
        flex: 1;
        padding: 11px 16px;
        border-radius: var(--radius-sm);
        font-weight: 600;
        font-size: var(--text-sm);
        border: 1px solid transparent;
        transition: background var(--transition), border-color var(--transition),
          opacity var(--transition);
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn--ghost {
        background: var(--color-canvas-alt);
        color: var(--color-ink);
        border-color: var(--color-line-strong);
      }

      .btn--ghost:hover:not(:disabled) {
        background: var(--color-line);
      }

      .btn--accent {
        background: var(--color-accent);
        color: var(--color-accent-ink);
      }

      .btn--accent:hover:not(:disabled) {
        background: var(--color-accent-strong);
      }

      @keyframes fade {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes rise {
        from {
          opacity: 0;
          transform: translateY(8px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  @Input() message = '';
  @Input() busy = false;
  @Output() readonly confirm = new EventEmitter<void>();
  @Output() readonly cancel = new EventEmitter<void>();

  onOverlayClick(_event: MouseEvent): void {
    if (!this.busy) {
      this.cancel.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.busy) {
      this.cancel.emit();
    }
  }
}
