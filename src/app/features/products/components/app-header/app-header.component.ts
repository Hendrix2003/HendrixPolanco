import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Cabecera de marca presente en todos los disenos (D1-D4). Es puramente
 * presentacional y no mantiene estado.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="brand">
      <div class="brand__mark" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="13" rx="2" stroke="currentColor" stroke-width="1.7" />
          <circle cx="12" cy="12.5" r="2.4" stroke="currentColor" stroke-width="1.7" />
          <path d="M5.5 9.5h1M17.5 15.5h1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        </svg>
      </div>
      <span class="brand__name">BANCO</span>
    </header>
  `,
  styles: [
    `
      .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        padding: var(--space-4) 0;
        border-bottom: 1px solid var(--color-line);
        margin-bottom: var(--space-6);
      }

      .brand__mark {
        display: inline-flex;
        color: var(--color-navy);
      }

      .brand__name {
        font-family: var(--font-display);
        font-weight: 700;
        letter-spacing: 0.14em;
        font-size: var(--text-lg);
        color: var(--color-navy);
      }
    `,
  ],
})
export class AppHeaderComponent {}
