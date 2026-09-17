import '@fontsource/playfair-display/latin-600.css';
import '@fontsource/playfair-display/latin-700.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import './style.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// <model-viewer> bundles a full three.js-based renderer (~300KB gzipped) —
// too heavy to ship on every page load on a weak connection. Load it only
// once a visitor actually scrolls near the section that needs it.
const arSection = document.querySelector('#ar');
const pagodaModel = document.querySelector<HTMLElement>('#pagoda-model');
const pagodaLoading = document.querySelector<HTMLElement>('#pagoda-loading');

if (arSection && pagodaModel) {
  const modelViewerLoader = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        modelViewerLoader.disconnect();
        pagodaLoading?.classList.add('is-visible');
        pagodaModel.addEventListener(
          'load',
          () => pagodaLoading?.classList.remove('is-visible'),
          { once: true }
        );

        import('@google/model-viewer').then(({ ModelViewerElement }) => {
          // Must be set before `src` is assigned: model-viewer starts loading
          // as soon as `src` appears, and needs the decoder location wired up
          // first to handle this meshopt-compressed glb. The URL just needs
          // to resolve — the actual decoder is already bundled via
          // model-viewer's own static import of three's meshopt module; this
          // local no-op file only exists so nothing depends on a CDN being
          // reachable.
          ModelViewerElement.meshoptDecoderLocation =
            '/vendor/meshopt-decoder-init.js';
          pagodaModel.setAttribute(
            'src',
            '/assets/models/shwedagon-pagoda.glb'
          );
        });
      }
    },
    { rootMargin: '200px' }
  );

  modelViewerLoader.observe(arSection);
}

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// A section whose trigger point has already been crossed at scrollY 0 (e.g.
// because the hero is short on a tall viewport) must render in its final
// state with no animation — scroll-triggered entrances only apply to
// sections the user actually has to scroll to reach.
function startsBelowFold(el: Element): boolean {
  return el.getBoundingClientRect().top > window.innerHeight * 0.8;
}

if (!prefersReducedMotion) {
  // Hero: headline + subheadline animate in immediately on load, no scroll needed.
  gsap.from('.hero h1, .hero .subheadline', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.1,
  });

  // Every other major section: fade in + slide up as it enters the viewport,
  // once per page load (does not replay when scrolling back up).
  const sections = document.querySelectorAll<HTMLElement>('.section:not(.hero)');

  sections.forEach((section) => {
    if (!startsBelowFold(section)) return;

    // The relics section's cards get their own staggered animation below,
    // so exclude the card grid here to avoid double-animating it.
    const relicGrid = section.querySelector('.relic-grid');
    const targets = relicGrid
      ? Array.from(section.children).filter((child) => child !== relicGrid)
      : section;

    gsap.from(targets, {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true,
      },
    });
  });

  // Four Sacred Relics cards: stagger in individually, once the section is in view.
  const relicsSection = document.querySelector<HTMLElement>('#relics');
  const relicCards = document.querySelectorAll<HTMLElement>('.relic-card');

  if (relicsSection && relicCards.length && startsBelowFold(relicsSection)) {
    gsap.from(relicCards, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '#relics',
        start: 'top 80%',
        once: true,
      },
    });
  }
}
