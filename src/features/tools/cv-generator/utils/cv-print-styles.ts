/**
 * Print-only CSS injected into the export iframe.
 *
 * The iframe renders the *exact* preview DOM (`.cv-preview-page`) together with
 * the full `cv-generator.css`, so this stylesheet only has to:
 *  1. turn the on-screen scaled box into a true paged A4 document, and
 *  2. give the browser fragmentation hints so items aren't cut mid-block.
 *
 * Page margins are applied via `@page` (so they repeat on every page) while the
 * page element's own padding is zeroed — otherwise the margins would double up.
 */
export const buildPrintCss = (margins: {
  top: string
  right: string
  bottom: string
  left: string
}): string => `
  @page {
    size: A4;
    margin: ${margins.top} ${margins.right} ${margins.bottom} ${margins.left};
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: #ffffff;
  }

  .cv-preview-page {
    transform: none !important;
    width: auto !important;
    min-height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  /* Keep blocks from breaking across pages */
  .cv-head,
  .cv-item,
  .cv-minimal-item,
  .cv-clean-list li,
  .cv-bullets li {
    break-inside: avoid;
  }

  /* A section title should never be the last thing on a page */
  .cv-section h2 {
    break-after: avoid;
  }

  /* Strip the editor's active-step highlight from the printed output */
  .cv-preview-section--active::after {
    display: none !important;
  }
`
