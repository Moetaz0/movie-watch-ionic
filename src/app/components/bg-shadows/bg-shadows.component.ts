import { Component } from '@angular/core';

@Component({
  selector: 'app-bg-shadows',
  
  host: {
    class: 'pointer-events-none absolute inset-0 overflow-hidden',
    'aria-hidden': 'true',
  },
  template: `
    <!-- Clapperboard -->
    <svg viewBox="0 0 100 100" fill="currentColor"
      class="absolute -left-8 top-[8%] w-44 rotate-[-12deg] text-[var(--fg)] opacity-[0.07] motion-safe:animate-float motion-reduce:animate-none">
      <rect x="8" y="42" width="84" height="50" />
      <g transform="rotate(-10 8 38)">
        <polygon points="8,24 26,24 18,38 8,38" />
        <polygon points="31,24 49,24 41,38 31,38" />
        <polygon points="54,24 72,24 64,38 54,38" />
        <polygon points="77,24 95,24 87,38 77,38" />
      </g>
    </svg>

    <!-- Film reel -->
    <svg viewBox="0 0 100 100" fill="currentColor"
      class="absolute -right-12 top-[26%] w-56 rotate-[8deg] text-[var(--fg)] opacity-[0.07] motion-safe:animate-float motion-reduce:animate-none [animation-delay:-3s]">
      <mask id="reel-holes">
        <rect width="100" height="100" fill="white" />
        <circle cx="50" cy="50" r="6" fill="black" />
        <circle cx="50" cy="22" r="9" fill="black" />
        <circle cx="74.2" cy="36" r="9" fill="black" />
        <circle cx="74.2" cy="64" r="9" fill="black" />
        <circle cx="50" cy="78" r="9" fill="black" />
        <circle cx="25.8" cy="64" r="9" fill="black" />
        <circle cx="25.8" cy="36" r="9" fill="black" />
      </mask>
      <circle cx="50" cy="50" r="46" mask="url(#reel-holes)" />
    </svg>

    <!-- Play triangle (accent) -->
    <svg viewBox="0 0 100 100" fill="currentColor"
      class="absolute left-[18%] top-[44%] w-28 rotate-[6deg] text-[var(--accent)] opacity-[0.12] motion-safe:animate-float motion-reduce:animate-none [animation-delay:-6s]">
      <polygon points="18,8 92,50 18,92" />
    </svg>

    <!-- Film strip -->
    <svg viewBox="0 0 100 100" fill="currentColor"
      class="absolute -left-10 top-[62%] w-64 rotate-[-18deg] text-[var(--fg)] opacity-[0.07] motion-safe:animate-float motion-reduce:animate-none [animation-delay:-2s]">
      <mask id="strip-holes">
        <rect width="100" height="100" fill="white" />
        <rect x="6" y="33" width="8" height="6" fill="black" />
        <rect x="22" y="33" width="8" height="6" fill="black" />
        <rect x="38" y="33" width="8" height="6" fill="black" />
        <rect x="54" y="33" width="8" height="6" fill="black" />
        <rect x="70" y="33" width="8" height="6" fill="black" />
        <rect x="86" y="33" width="8" height="6" fill="black" />
        <rect x="6" y="61" width="8" height="6" fill="black" />
        <rect x="22" y="61" width="8" height="6" fill="black" />
        <rect x="38" y="61" width="8" height="6" fill="black" />
        <rect x="54" y="61" width="8" height="6" fill="black" />
        <rect x="70" y="61" width="8" height="6" fill="black" />
        <rect x="86" y="61" width="8" height="6" fill="black" />
        <rect x="8" y="43" width="20" height="14" fill="black" />
        <rect x="32" y="43" width="20" height="14" fill="black" />
        <rect x="56" y="43" width="20" height="14" fill="black" />
        <rect x="80" y="43" width="14" height="14" fill="black" />
      </mask>
      <rect x="0" y="28" width="100" height="44" mask="url(#strip-holes)" />
    </svg>

    <!-- Movie camera -->
    <svg viewBox="0 0 100 100" fill="currentColor"
      class="absolute -right-6 top-[78%] w-48 rotate-[10deg] text-[var(--fg)] opacity-[0.07] motion-safe:animate-float motion-reduce:animate-none [animation-delay:-5s]">
      <circle cx="30" cy="26" r="17" />
      <circle cx="56" cy="30" r="13" />
      <rect x="10" y="42" width="58" height="40" />
      <polygon points="68,50 96,36 96,88 68,74" />
    </svg>

    <!-- Ticket -->
    <svg viewBox="0 0 100 100" fill="currentColor"
      class="absolute left-[34%] top-[92%] w-40 rotate-[-8deg] text-[var(--fg)] opacity-[0.07] motion-safe:animate-float motion-reduce:animate-none [animation-delay:-1s]">
      <mask id="ticket-notch">
        <rect width="100" height="100" fill="white" />
        <circle cx="0" cy="50" r="10" fill="black" />
        <circle cx="100" cy="50" r="10" fill="black" />
        <rect x="68" y="20" width="3" height="60" fill="black" />
      </mask>
      <rect x="0" y="22" width="100" height="56" mask="url(#ticket-notch)" />
    </svg>
  `,
})
export class BgShadowsComponent {}