(() => {
  'use strict';

  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-links');
  if (!toggle || !menu) return;

  const mobile = window.matchMedia('(max-width: 760px)');
  const links = Array.from(menu.querySelectorAll('a[href]'));
  let isOpen = false;
  let previousOverflow = '';

  const setOpen = (requestedOpen, returnFocus = false) => {
    const nextOpen = requestedOpen && mobile.matches;
    if (nextOpen && !isOpen) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else if (!nextOpen && isOpen) {
      document.body.style.overflow = previousOverflow;
    }
    isOpen = nextOpen;
    menu.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    if (isOpen) links[0]?.focus();
    else if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(!isOpen, isOpen));

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (!isOpen) return;
      setOpen(false);
      // Follow native anchors while moving keyboard focus into the chosen section.
      if (!link.hash || link.origin !== location.origin || link.pathname !== location.pathname) return;
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!target) return;
      const hadTabindex = target.hasAttribute('tabindex');
      if (!hadTabindex) {
        target.setAttribute('tabindex', '-1');
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
      target.focus({ preventScroll: true });
    });
  });

  document.addEventListener('keydown', event => {
    if (!isOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false, true);
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = Array.from(document.querySelectorAll('#nav-toggle, #nav-links a[href]'));
    const index = controls.indexOf(document.activeElement);
    if (index === -1 || (event.shiftKey && index === 0) || (!event.shiftKey && index === controls.length - 1)) {
      event.preventDefault();
      controls[event.shiftKey ? controls.length - 1 : 0].focus();
    }
  });

  document.addEventListener('click', event => {
    if (isOpen && !menu.contains(event.target) && !toggle.contains(event.target)) setOpen(false, true);
  });

  mobile.addEventListener('change', () => {
    const activeElement = document.activeElement;
    setOpen(false);
    if (!mobile.matches && activeElement === toggle) links[0]?.focus();
    else if (mobile.matches && menu.contains(activeElement)) toggle.focus();
  });

  // Apply the collapsed mobile state only after the behavior is installed.
  toggle.setAttribute('aria-controls', menu.id);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  document.documentElement.classList.add('nav-enhanced');
})();

(() => {
  const carousel = document.querySelector('#companies');
  if (!carousel) return;
  const track = carousel.querySelector('.logo-track');
  const pause = carousel.querySelector('[data-logo-pause]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !reduced.matches;
  let hovered = false;
  let focused = false;
  let visible = false;
  const update = () => { pause.textContent = playing ? 'Pause' : 'Play'; pause.setAttribute('aria-label', playing ? 'Pause logo carousel' : 'Play logo carousel'); };
  const move = direction => {
    const step = track.firstElementChild.getBoundingClientRect().width + 16;
    const max = track.scrollWidth - track.clientWidth;
    let left = track.scrollLeft + direction * step;
    if (direction > 0 && track.scrollLeft >= max - 2) left = 0;
    if (direction < 0 && track.scrollLeft <= 2) left = max;
    track.scrollTo({ left, behavior: reduced.matches ? 'instant' : 'smooth' });
  };
  const stop = () => { playing = false; update(); };
  pause.addEventListener('click', () => { playing = !playing; update(); });
  carousel.querySelector('[data-logo-prev]').addEventListener('click', () => { stop(); move(-1); });
  carousel.querySelector('[data-logo-next]').addEventListener('click', () => { stop(); move(1); });
  carousel.addEventListener('mouseenter', () => { hovered = true; });
  carousel.addEventListener('mouseleave', () => { hovered = false; });
  carousel.addEventListener('focusin', () => { focused = true; });
  carousel.addEventListener('focusout', event => { focused = carousel.contains(event.relatedTarget); });
  track.addEventListener('pointerdown', stop);
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); stop(); move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  reduced.addEventListener('change', () => { if (reduced.matches) stop(); });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(carousel);
  setInterval(() => { if (playing && !hovered && !focused && visible && !document.hidden) move(1); }, 3500);
  carousel.querySelector('.logo-controls').hidden = false;
  update();
})();

// Keep decorative motion controllable and stop it when the panel is off screen.
(() => {
  document.querySelectorAll('.voice-console, .delivery-console').forEach(panel => {
  const animationName = panel.classList.contains('delivery-console') ? 'delivery' : 'voice';
  const button = panel?.querySelector('.voice-motion');
  if (!panel || !button) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  let visible = false;
  const update = () => {
    panel.classList.toggle('is-paused', paused || !visible || document.hidden || reducedMotion.matches);
    button.hidden = reducedMotion.matches;
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', `${paused ? 'Resume' : 'Pause'} ${animationName} animation`);
    button.innerHTML = paused ? 'Play <span aria-hidden="true">▷</span>' : 'Pause <span aria-hidden="true">Ⅱ</span>';
  };
  button.addEventListener('click', () => { paused = !paused; update(); });
  reducedMotion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }).observe(panel);
  } else visible = true;
  update();
  });
})();
