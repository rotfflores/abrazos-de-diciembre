/**
 * Personalize the cover, event and farewell here. The calendar and countdown both
 * derive from event.date, event.time and event.timeZone.
 */
const invitation = {
  intro: 'Una noche para compartir en familia',
  title: 'La magia está en reunirnos',
  family: 'Familia Valdivia',
  message: 'Te invitamos a celebrar entre luces cálidas, abrazos y momentos que queremos guardar para siempre',
  event: {
    date: '2026-12-19',
    time: '19:00',
    timeZone: 'America/Mexico_City',
  },
  location: {
    name: 'Casa de la familia Valdivia',
    address: 'Calle Los Fresnos 214, Jardines del Valle, Querétaro, Qro.',
    reference: 'Portón de madera con corona navideña, frente al parque de los álamos',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Calle+Los+Fresnos+214+Jardines+del+Valle+Queretaro',
  },
  rsvp: {
    deadline: '12 de diciembre',
    // Leave phone empty to let guests pick the contact in WhatsApp,
    // or write it with country code and no spaces, e.g. '5214421234567'.
    phone: '',
  },
  farewell: {
    eyebrow: 'Lo más bonito es tenernos cerca',
    title: 'Hay un lugar para ti en nuestra mesa',
    message: 'Te esperamos para compartir una noche de abrazos, risas y recuerdos que nos acompañen mucho después de apagar las luces',
    signoff: 'Con cariño,',
    family: 'Familia Valdivia',
  },
};

const invitationRoot = document.querySelector('.invitation');
const openButton = document.querySelector('#open-envelope');
const entry = document.querySelector('#entrada');
const cover = document.querySelector('#portada');
const detailsSection = document.querySelector('#detalles');
const locationSection = document.querySelector('#ubicacion');
const nightSection = document.querySelector('#la-noche');
const farewellSection = document.querySelector('#despedida');
const detailsLink = document.querySelector('#discover-details');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-invitation]').forEach((element) => {
  const key = element.dataset.invitation;
  if (key === 'title') {
    const words = invitation.title.trim().split(/\s+/);
    const finalWord = words.pop() || '';
    element.replaceChildren(document.createTextNode(`${words.join(' ')} `));
    const emphasis = document.createElement('em');
    emphasis.textContent = finalWord;
    element.append(emphasis);
  } else if (key === 'initial') {
    const surname = invitation.family.trim().split(/\s+/).pop() || '';
    element.textContent = surname.charAt(0).toUpperCase();
  } else {
    element.textContent = invitation[key] || '';
  }
});
document.title = `Navidad acogedora · ${invitation.family}`;

// Warm dust drifting slowly through the whole invitation.
function scatterAmbient() {
  if (reduceMotion.matches) return;
  const layer = document.createElement('div');
  layer.className = 'ambient';
  layer.setAttribute('aria-hidden', 'true');
  const count = window.innerWidth < 600 ? 16 : 28;
  for (let i = 0; i < count; i += 1) {
    const mote = document.createElement('span');
    const isFlake = i % 5 === 0;
    if (isFlake) mote.className = 'flake';
    mote.style.setProperty('--x', `${Math.random() * 100}%`);
    mote.style.setProperty('--size', `${isFlake ? 8 + Math.random() * 6 : 3 + Math.random() * 6}px`);
    mote.style.setProperty('--blur', `${Math.random() < 0.3 ? 1.5 : 0}px`);
    mote.style.setProperty('--alpha', (0.35 + Math.random() * 0.45).toFixed(2));
    mote.style.setProperty('--sway', `${(Math.random() - 0.5) * 80}px`);
    mote.style.setProperty('--dur', `${16 + Math.random() * 14}s`);
    mote.style.setProperty('--delay', `${-Math.random() * 30}s`);
    layer.append(mote);
  }
  invitationRoot.append(layer);
}

// A small burst of golden sparks as the card leaves the envelope.
function burstSparks() {
  for (let i = 0; i < 22; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'spark';
    const angle = (Math.PI * (1.05 + Math.random() * 0.9));
    const distance = 90 + Math.random() * 170;
    spark.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    spark.style.setProperty('--dy', `${Math.sin(angle) * distance * 0.8}px`);
    spark.style.setProperty('--s', `${7 + Math.random() * 11}px`);
    spark.style.setProperty('--d', `${Math.random() * 0.25}s`);
    openButton.append(spark);
  }
}

scatterAmbient();

let opened = false;
let revealTimer;

function showCover() {
  if (invitationRoot.dataset.view === 'cover') return;
  cover.inert = false;
  cover.removeAttribute('aria-hidden');
  detailsSection.inert = false;
  detailsSection.removeAttribute('aria-hidden');
  locationSection.inert = false;
  locationSection.removeAttribute('aria-hidden');
  nightSection.inert = false;
  nightSection.removeAttribute('aria-hidden');
  farewellSection.inert = false;
  farewellSection.removeAttribute('aria-hidden');
  invitationRoot.dataset.view = 'cover';
  entry.setAttribute('aria-hidden', 'true');
  entry.inert = true;
  window.scrollTo({ top: 0, behavior: 'auto' });
  cover.focus({ preventScroll: true });
}

function openInvitation() {
  if (opened) return;
  opened = true;
  openButton.disabled = true;
  invitationRoot.dataset.view = 'opening';
  if (!reduceMotion.matches) window.setTimeout(burstSparks, 1150);
  revealTimer = window.setTimeout(showCover, reduceMotion.matches ? 0 : 2550);
}

openButton.addEventListener('click', openInvitation);

reduceMotion.addEventListener('change', () => {
  if (opened && reduceMotion.matches) {
    window.clearTimeout(revealTimer);
    showCover();
  }
});

// The indicator becomes a real link as soon as a section with id="detalles" exists.
function updateDetailsLink() {
  const details = document.getElementById('detalles');
  if (!details) return false;
  detailsLink.removeAttribute('aria-disabled');
  detailsLink.removeAttribute('tabindex');
  return true;
}

if (!updateDetailsLink()) {
  const detailsObserver = new MutationObserver(() => {
    if (updateDetailsLink()) detailsObserver.disconnect();
  });
  detailsObserver.observe(document.body, { childList: true, subtree: true });
}

// An instant in another time zone cannot be built with the visitor's local Date
// constructor. Resolve the configured wall-clock time through Intl instead.
function getZonedParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });
  return Object.fromEntries(
    formatter.formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)]),
  );
}

function eventTimeInUtc({ date, time, timeZone }) {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  let estimate = wallClockAsUtc;

  // Two passes also handle the offset on the event date when it differs from
  // today's offset; a third pass keeps the result stable near DST boundaries.
  for (let pass = 0; pass < 3; pass += 1) {
    const parts = getZonedParts(new Date(estimate), timeZone);
    const representedWallClock = Date.UTC(
      parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second,
    );
    estimate += wallClockAsUtc - representedWallClock;
  }
  return estimate;
}

function formatEventTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'a. m.' : 'p. m.'}`;
}

const eventInstant = eventTimeInUtc(invitation.event);
const eventDate = new Date(eventInstant);
const eventSettings = invitation.event;
const [eventYear, , eventDay] = eventSettings.date.split('-').map(Number);
const weekday = new Intl.DateTimeFormat('es-MX', {
  timeZone: eventSettings.timeZone, weekday: 'long',
}).format(eventDate);
const monthName = new Intl.DateTimeFormat('es-MX', {
  timeZone: eventSettings.timeZone, month: 'long',
}).format(eventDate);
const displayTime = formatEventTime(eventSettings.time);
const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

document.querySelector('#event-weekday').textContent = capitalizedWeekday;
document.querySelector('#event-day').textContent = String(eventDay);
document.querySelector('#event-month').textContent = monthName;
document.querySelector('#event-year').textContent = String(eventYear);
document.querySelector('#event-time').textContent = displayTime;
const eventTimeElement = document.querySelector('#event-datetime');
eventTimeElement.dateTime = eventDate.toISOString();
eventTimeElement.setAttribute('aria-label',
  `${capitalizedWeekday}, ${eventDay} de ${monthName} de ${eventYear} a las ${displayTime}, hora de Ciudad de México`);

const countdownGrid = document.querySelector('#countdown-grid');
const countdownStatus = document.querySelector('#countdown-status');
const countdownValues = Object.fromEntries(
  ['days', 'hours', 'minutes', 'seconds'].map((unit) => [unit, document.getElementById(unit)]),
);

function getCountdownState(now) {
  const local = getZonedParts(now, eventSettings.timeZone);
  const localDay = `${local.year}-${String(local.month).padStart(2, '0')}-${String(local.day).padStart(2, '0')}`;

  if (localDay >= eventSettings.date) {
    return { phase: localDay === eventSettings.date ? 'today' : 'past' };
  }

  return {
    phase: 'before',
    secondsRemaining: Math.max(0, Math.floor((eventInstant - now.getTime()) / 1000)),
  };
}

function updateCountdown() {
  const state = getCountdownState(new Date());
  if (state.phase !== 'before') {
    countdownGrid.hidden = true;
    countdownStatus.hidden = false;
    countdownStatus.textContent = state.phase === 'today'
      ? '¡Hoy nos reunimos!'
      : 'Gracias por compartir una noche tan especial';
    return;
  }

  countdownGrid.hidden = false;
  countdownStatus.hidden = true;
  const { secondsRemaining } = state;
  const units = {
    days: Math.floor(secondsRemaining / 86400),
    hours: Math.floor((secondsRemaining % 86400) / 3600),
    minutes: Math.floor((secondsRemaining % 3600) / 60),
    seconds: secondsRemaining % 60,
  };
  Object.entries(units).forEach(([unit, value]) => {
    const element = countdownValues[unit];
    const text = String(value).padStart(2, '0');
    if (element.textContent === text) return;
    element.textContent = text;
    // Replay a soft "tick" on the digits that changed.
    element.classList.remove('is-ticking');
    void element.offsetWidth;
    element.classList.add('is-ticking');
  });
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

if ('IntersectionObserver' in window) {
  const detailsReveal = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      detailsSection.classList.add('is-visible');
      detailsReveal.disconnect();
    }
  }, { threshold: 0.08 });
  detailsReveal.observe(detailsSection);
} else {
  detailsSection.classList.add('is-visible');
}

const locationSettings = invitation.location;
document.querySelector('#location-name').textContent = locationSettings.name;
document.querySelector('#location-address').textContent = locationSettings.address;
const locationReference = document.querySelector('#location-reference');
locationReference.textContent = locationSettings.reference.trim();
locationReference.hidden = !locationSettings.reference.trim();

function validGoogleMapsUrl(value) {
  if (!value.trim()) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const isGoogleMaps = host === 'maps.app.goo.gl'
      || host === 'maps.google.com'
      || host === 'goo.gl' && url.pathname.startsWith('/maps/')
      || (host === 'google.com' || host === 'www.google.com') && url.pathname.startsWith('/maps');
    return url.protocol === 'https:' && isGoogleMaps ? url.href : null;
  } catch {
    return null;
  }
}

const mapsLink = document.querySelector('#maps-link');
const mapsUrl = validGoogleMapsUrl(locationSettings.mapsUrl);
if (mapsUrl) {
  mapsLink.href = mapsUrl;
  mapsLink.target = '_blank';
  mapsLink.rel = 'noopener noreferrer';
  mapsLink.removeAttribute('aria-disabled');
  mapsLink.removeAttribute('tabindex');
  document.querySelector('#maps-label').textContent = 'Cómo llegar';
} else {
  mapsLink.removeAttribute('href');
  mapsLink.removeAttribute('target');
  mapsLink.removeAttribute('rel');
  mapsLink.setAttribute('aria-disabled', 'true');
  mapsLink.setAttribute('tabindex', '-1');
  document.querySelector('#maps-label').textContent = 'Ubicación por confirmar';
}

if ('IntersectionObserver' in window) {
  const locationReveal = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      locationSection.classList.add('is-visible');
      locationReveal.disconnect();
    }
  }, { threshold: 0.1 });
  locationReveal.observe(locationSection);
} else {
  locationSection.classList.add('is-visible');
}

// Gentle parallax: the table decorations drift a little slower than the papers.
const parallaxItems = [...document.querySelectorAll('[data-depth]')];
let parallaxFrame = 0;
function applyParallax() {
  parallaxFrame = 0;
  const viewport = window.innerHeight;
  parallaxItems.forEach((item) => {
    const box = item.parentElement.getBoundingClientRect();
    if (box.bottom < 0 || box.top > viewport) return;
    const progress = (box.top + box.height / 2 - viewport / 2) / viewport;
    item.style.setProperty('--parallax', `${(progress * Number(item.dataset.depth)).toFixed(1)}px`);
  });
}
if (!reduceMotion.matches && parallaxItems.length) {
  window.addEventListener('scroll', () => {
    if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(applyParallax);
  }, { passive: true });
  applyParallax();
}

// RSVP: a WhatsApp message already written for the guest.
document.querySelector('#rsvp-deadline').textContent = invitation.rsvp.deadline;
const rsvpMessage = `¡Hola! Con mucho gusto confirmo mi asistencia a la cena de Navidad de la ${invitation.family} el ${capitalizedWeekday.toLowerCase()} ${eventDay} de ${monthName}.`;
const rsvpPhone = invitation.rsvp.phone.replace(/\D/g, '');
document.querySelector('#rsvp-link').href = `https://wa.me/${rsvpPhone}?text=${encodeURIComponent(rsvpMessage)}`;

if ('IntersectionObserver' in window) {
  const nightReveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      nightReveal.unobserve(entry.target);
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.night-appear').forEach((element) => nightReveal.observe(element));
} else {
  document.querySelectorAll('.night-appear').forEach((element) => element.classList.add('is-in'));
}

document.querySelectorAll('[data-farewell]').forEach((element) => {
  element.textContent = invitation.farewell[element.dataset.farewell] || '';
});

if ('IntersectionObserver' in window) {
  const farewellReveal = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      farewellSection.classList.add('is-visible');
      farewellReveal.disconnect();
    }
  }, { threshold: 0.12 });
  farewellReveal.observe(farewellSection);
} else {
  farewellSection.classList.add('is-visible');
}
