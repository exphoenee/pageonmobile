import { Preview } from './core/Preview';
import './styles/style.css';

/** Demo wiring (previously the bottom of the old main.js). */
const preview = new Preview({
  containerId: 'myPreview',
  direction: 'right',
  screenImage: {
    desktop: 'media/onscreen/bvcv.webp',
    notebook: 'media/onscreen/bvcv.webp',
    tablet: 'media/onscreen/bvcv-tablet.webp',
    phone: 'media/onscreen/bvcv-mobile.webp',
  },
  scrollSpeed: 300,
});

// Dark-mode demo toggle from the header button.
document
  .querySelector<HTMLButtonElement>('.changecolor')
  ?.addEventListener('click', () => document.body.classList.toggle('dark'));

// Footer copyright: "2020" until the year advances, then "2020–<year>".
const START_YEAR = 2020;
const currentYear = new Date().getFullYear();
const yearsEl = document.querySelector<HTMLElement>('[data-copyright-years]');
if (yearsEl) {
  yearsEl.textContent =
    currentYear > START_YEAR ? `${START_YEAR}–${currentYear}` : `${START_YEAR}`;
}

// Documentation dialog (native <dialog>).
const docs = document.querySelector<HTMLDialogElement>('#docs');
document
  .querySelector<HTMLButtonElement>('[data-open-docs]')
  ?.addEventListener('click', () => docs?.showModal());
docs
  ?.querySelector<HTMLButtonElement>('[data-close-docs]')
  ?.addEventListener('click', () => docs.close());
// Close when clicking the backdrop (outside the article).
docs?.addEventListener('click', (event) => {
  if (event.target === docs) docs.close();
});

// Clean up rAF loops on HMR / page teardown.
if (import.meta.hot) {
  import.meta.hot.dispose(() => preview.destroy());
}
