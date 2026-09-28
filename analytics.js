// Small static-site adapter for the existing Vercel Web Analytics script.
(() => {
  'use strict';
  // Local previews and design variants must not create production events.
  if (location.hostname !== 'ricardoborenstein.vercel.app' || location.pathname !== '/') return;
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  const allowedEvents = new Set(['Contact CTA Click', 'Work CTA Click', 'Email Click', 'LinkedIn Click', 'GitHub Click', 'Project Link Click']);
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-analytics-event]');
    if (!link || event.defaultPrevented) return;
    const name = link.dataset.analyticsEvent;
    if (!allowedEvents.has(name)) return;
    try {
      // Only fixed labels are sent, never email URLs, subjects, or message bodies.
      window.va('event', { name, data: { placement: link.dataset.analyticsPlacement } });
    } catch (_) {
      // Tracking must never interfere with navigation or opening the mail client.
    }
  });
})();
