import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Estado de precarga (skeleton) para la tabla mientras se resuelve la peticion
 * de datos. Mejora la percepcion de rendimiento frente a un spinner vacio.
 */
@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton" aria-hidden="true">
      @for (row of rowsArray; track row) {
        <div class="skeleton__row">
          <span class="skeleton__cell skeleton__cell--logo"></span>
          <span class="skeleton__cell skeleton__cell--md"></span>
          <span class="skeleton__cell skeleton__cell--lg"></span>
          <span class="skeleton__cell skeleton__cell--sm"></span>
          <span class="skeleton__cell skeleton__cell--sm"></span>
          <span class="skeleton__cell skeleton__cell--xs"></span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .skeleton {
        display: flex;
        flex-direction: column;
      }

      .skeleton__row {
        display: grid;
        grid-template-columns: 60px 1.4fr 2fr 1fr 1fr 44px;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-4);
        border-bottom: 1px solid var(--color-line);
      }

      .skeleton__cell {
        height: 12px;
        border-radius: var(--radius-pill);
        background: linear-gradient(
          90deg,
          var(--color-canvas-alt) 25%,
          var(--color-line) 37%,
          var(--color-canvas-alt) 63%
        );
        background-size: 400% 100%;
        animation: shimmer 1.4s ease infinite;
      }

      .skeleton__cell--logo {
        width: 34px;
        height: 34px;
        border-radius: 50%;
      }

      .skeleton__cell--xs {
        width: 20px;
      }
      .skeleton__cell--sm {
        width: 70%;
      }
      .skeleton__cell--md {
        width: 80%;
      }
      .skeleton__cell--lg {
        width: 90%;
      }

      @keyframes shimmer {
        0% {
          background-position: 100% 0;
        }
        100% {
          background-position: 0 0;
        }
      }
    `,
  ],
})
export class SkeletonLoaderComponent {
  @Input() rows = 5;

  get rowsArray(): number[] {
    return Array.from({ length: this.rows }, (_, index) => index);
  }
}
