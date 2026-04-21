// =============================================
// Hash-based page routing
// =============================================
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

function navigateTo(pageId) {
  // Hide all pages
  pages.forEach((p) => p.classList.remove('active'));

  // Show target page
  const target = document.querySelector(`.page[data-page="${pageId}"]`);
  if (target) {
    target.classList.add('active');
  } else {
    // Fallback to overview
    const fallback = document.querySelector('.page[data-page="overview"]');
    if (fallback) fallback.classList.add('active');
    pageId = 'colors';
  }

  // Update active nav link
  navLinks.forEach((link) => link.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-link[href="#${pageId}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Scroll main content to top
  const main = document.querySelector('.main-content');
  if (main) main.scrollTop = 0;
  window.scrollTo(0, 0);

  // Update document title
  const pageTitle = target ? target.querySelector('.section-title') : null;
  document.title = pageTitle
    ? `${pageTitle.textContent} - Design System`
    : 'Design System Style Guide';

  // Auto-init Proto 3 globe when navigating to prototype-3 (profile is default view)
  if (pageId === 'prototype-3') {
    setTimeout(() => initProto3Globe(), 300);
  }

  // Auto-init Proto 4 quiz when navigating to prototype-4
  if (pageId === 'prototype-4') {
    setTimeout(() => { if (typeof initProto4Quiz === 'function') initProto4Quiz(); }, 300);
  }

  // Auto-init Proto 5 trip recording when navigating to prototype-5
  if (pageId === 'prototype-5') {
    setTimeout(() => { if (typeof initProto5 === 'function') initProto5(); }, 300);
  }

  // Auto-init Proto 6 create trip when navigating to prototype-6
  if (pageId === 'prototype-6') {
    setTimeout(() => { if (typeof initProto6 === 'function') initProto6(); }, 300);
  }

  // Auto-init Proto 7 full app when navigating to prototype-7
  if (pageId === 'prototype-7') {
    // Move p7App back to its default container if it had been relocated
    var p7App = document.getElementById('p7App');
    var originalSlot = document.getElementById('p7OriginalSlot');
    if (p7App && originalSlot && p7App.parentElement !== originalSlot) {
      originalSlot.appendChild(p7App);
    }
    setTimeout(() => { if (typeof initProto7 === 'function') initProto7(); }, 300);
  }

  // Proto 7 Pixel — reuses p7App DOM, just swaps container + adds theme class
  if (pageId === 'prototype-7-pixel') {
    var p7App2 = document.getElementById('p7App');
    var pixelSlot = document.getElementById('p7PixelScreenSlot');
    if (p7App2 && pixelSlot && p7App2.parentElement !== pixelSlot) {
      pixelSlot.appendChild(p7App2);
    }
    setTimeout(() => { if (typeof initProto7 === 'function') initProto7(); }, 300);
  }

  // Auto-init Notified for Action when navigating to prototype-notified
  if (pageId === 'prototype-notified') {
    setTimeout(() => { if (typeof initProtoNotified === 'function') initProtoNotified(); }, 300);
  }

  // Auto-init Proto 7S social entry when navigating to prototype-7s
  if (pageId === 'prototype-7s') {
    setTimeout(() => { if (typeof initProto8 === 'function') initProto8(); }, 300);
  }

  // Auto-init Onboarding (Proto 4b) when navigating to prototype-onboarding
  if (pageId === 'prototype-onboarding') {
    setTimeout(() => { if (typeof initProto4bQuiz === 'function') initProto4bQuiz(); }, 300);
  }
}

// Intercept nav link clicks
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const hash = link.getAttribute('href');
    const pageId = hash.replace('#', '');
    window.location.hash = hash;
    navigateTo(pageId);

    // Close mobile sidebar
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('open');
    }
  });
});

// Handle browser back/forward
window.addEventListener('hashchange', () => {
  const pageId = window.location.hash.replace('#', '') || 'colors';
  navigateTo(pageId);
});

// Initial route on page load
const initialPage = window.location.hash.replace('#', '') || 'colors';
navigateTo(initialPage);

// =============================================
// Nav group toggle (collapsible sections)
// =============================================
document.querySelectorAll('.nav-group-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const group = btn.getAttribute('data-group');
    const sublist = document.getElementById(`nav-${group}`);
    if (sublist) {
      btn.classList.toggle('open');
      sublist.classList.toggle('open');
    }
  });
});

// =============================================
// Mobile menu toggle
// =============================================
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', (e) => {
  if (
    window.innerWidth <= 768 &&
    sidebar.classList.contains('open') &&
    !sidebar.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    sidebar.classList.remove('open');
  }
});

// =============================================
// Set indeterminate checkbox
// =============================================
const indeterminateCb = document.getElementById('indeterminate-cb');
if (indeterminateCb) {
  indeterminateCb.indeterminate = true;
}

// =============================================
// Modal
// =============================================
const modalOverlay = document.getElementById('demoModal');
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('modal-open');
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay) {
    modalOverlay.classList.remove('modal-open');
  }
});

// =============================================
// Prototype map state (declared early so applyTheme can reference it)
// =============================================
let protoMap = null;
let protoMapPolygons = [];

// =============================================
// Theme Switcher (Original / Dark warm / Warm tech)
// =============================================
const themeSwitcher = document.getElementById('themeSwitcher');

function applyTheme(theme) {
  // Set data-theme on html element (drives CSS overrides in theme.css)
  if (theme === 'dsm-2' || theme === 'dsm-3' || theme === 'dsm-4') {
    document.documentElement.setAttribute('data-theme', theme);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  // Update map polygon colors to match new brand
  if (protoMap && protoMapPolygons.length) {
    const newBrand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
    protoMapPolygons.forEach((poly) => {
      poly.setStyle({ color: newBrand, fillColor: newBrand });
    });
  }

  // Swap text content for elements with data-dsm1 / data-dsm2 attributes
  document.querySelectorAll('[data-dsm1][data-dsm2]').forEach((el) => {
    if (theme === 'dsm-4') {
      el.textContent = el.getAttribute('data-dsm4') || el.getAttribute('data-dsm1');
    } else if (theme === 'dsm-3') {
      el.textContent = el.getAttribute('data-dsm3') || el.getAttribute('data-dsm2');
    } else if (theme === 'dsm-2') {
      el.textContent = el.getAttribute('data-dsm2');
    } else {
      el.textContent = el.getAttribute('data-dsm1');
    }
  });

  // Swap background styles for swatch elements
  document.querySelectorAll('.theme-swatch').forEach((el) => {
    let bg;
    if (theme === 'dsm-4') {
      bg = el.getAttribute('data-dsm4-bg') || el.getAttribute('data-dsm1-bg');
    } else if (theme === 'dsm-3') {
      bg = el.getAttribute('data-dsm3-bg') || el.getAttribute('data-dsm2-bg');
    } else if (theme === 'dsm-2') {
      bg = el.getAttribute('data-dsm2-bg');
    } else {
      bg = el.getAttribute('data-dsm1-bg');
    }
    if (bg) el.style.background = bg;
  });

  // Update document title
  const prefix = theme === 'dsm-4' ? 'Mono' : theme === 'dsm-3' ? 'Warm tech' : theme === 'dsm-2' ? 'Dark warm' : 'Original';
  const pageTitle = document.querySelector('.page.active .section-title');
  document.title = pageTitle
    ? `${pageTitle.textContent} - ${prefix} Design System`
    : `${prefix} Design System Style Guide`;

  // Persist selection
  localStorage.setItem('dsm-theme', theme);

  // Reinit globe with new theme colors
  const globeCanvas = document.getElementById('proto3Globe');
  if (globeCanvas && globeCanvas.offsetParent !== null) {
    setTimeout(() => initProto3Globe(), 100);
  }
}

if (themeSwitcher) {
  // Restore saved theme
  const saved = localStorage.getItem('dsm-theme');
  if (saved) {
    themeSwitcher.value = saved;
    applyTheme(saved);
  }

  themeSwitcher.addEventListener('change', () => {
    applyTheme(themeSwitcher.value);
  });
}

// =============================================
// Prototype tab switching (Home / Map / etc.)
// =============================================
document.querySelectorAll('.proto-tab[data-tab]').forEach((tab) => {
  tab.addEventListener('click', () => {
    const viewId = tab.getAttribute('data-tab');
    const phone = tab.closest('.proto-phone');
    if (!phone) return;

    // Switch active tab
    phone.querySelectorAll('.proto-tab[data-tab]').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    // Switch active view
    phone.querySelectorAll('.proto-view').forEach((v) => v.classList.remove('active'));
    const targetView = phone.querySelector(`.proto-view[data-view="${viewId}"]`);
    if (targetView) targetView.classList.add('active');

    // Scroll proto-screen to top
    const screen = phone.querySelector('.proto-screen');
    if (screen) screen.scrollTop = 0;

    // Show/hide chat float for Proto 3 (only on map view)
    const chatFloat = phone.querySelector('#proto3ChatFloat');
    if (chatFloat) {
      chatFloat.style.display = (viewId === 'map' || viewId === 'profile') ? 'flex' : 'none';
    }

    // Initialize or refresh map when Map tab is shown
    if (viewId === 'map') {
      // Determine which prototype this phone belongs to
      const section = phone.closest('.section');
      const sectionId = section ? section.id : '';
      if (sectionId === 'prototype-3') {
        if (!proto3Map) {
          initProto3Map();
        } else {
          setTimeout(() => proto3Map.invalidateSize(), 100);
        }
      } else {
        if (!protoMap) {
          initProtoMap();
        } else {
          setTimeout(() => protoMap.invalidateSize(), 100);
        }
      }
    }

    // Init globe when Profile tab is shown in Proto 3
    if (viewId === 'profile') {
      const section = phone.closest('.section');
      if (section && section.id === 'prototype-3') {
        setTimeout(() => initProto3Globe(), 150);
      }
    }
  });
});

// =============================================
// Leaflet Map for Prototype (Map Tab)
// =============================================
function initProtoMap() {
  const mapEl = document.getElementById('protoMap');
  if (!mapEl || typeof L === 'undefined') return;

  // Initialize map centered on Mediterranean / Europe / North Africa
  protoMap = L.map(mapEl, {
    center: [42, 20],
    zoom: 3,
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: true,
  });

  // Default OpenStreetMap tiles (colorful)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(protoMap);

  // --- Helper: get brand color from CSS custom property ---
  const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#6C00F6';

  // --- Country highlight polygons (cities as boundary vertices) ---
  const countryPolygons = {
    france: {
      color: brand,
      coords: [
        [51.03, 2.38],   // Dunkirk
        [48.57, 7.75],   // Strasbourg
        [45.76, 4.84],   // Lyon
        [43.70, 7.27],   // Nice
        [43.30, 5.37],   // Marseille
        [43.61, 3.88],   // Montpellier
        [42.70, 2.90],   // Perpignan
        [43.60, 1.44],   // Toulouse
        [44.84, -0.58],  // Bordeaux
        [47.22, -1.55],  // Nantes
        [48.39, -4.49],  // Brest
        [48.65, -1.68],  // Saint-Malo
        [49.19, -0.37],  // Caen
        [49.90, 2.30],   // Amiens
        [50.63, 3.06],   // Lille
      ],
    },
    algeria: {
      color: brand,
      coords: [
        [35.70, -0.63],  // Oran
        [36.75, 3.06],   // Algiers
        [36.90, 7.77],   // Annaba
        [36.37, 6.61],   // Constantine
        [34.85, 5.72],   // Biskra
        [32.49, 3.67],   // Ghardaia
        [27.18, 2.52],   // In Salah
        [22.79, 5.53],   // Tamanrasset
        [26.51, 8.48],   // Illizi
        [31.62, -2.22],  // Béchar
        [34.88, -1.32],  // Tlemcen
      ],
    },
    egypt: {
      color: brand,
      coords: [
        [31.20, 29.92],  // Alexandria
        [31.26, 32.30],  // Port Said
        [30.04, 31.24],  // Cairo
        [30.59, 32.27],  // Ismailia
        [28.09, 30.75],  // Minya
        [25.69, 32.64],  // Luxor
        [24.09, 32.90],  // Aswan
        [25.07, 34.90],  // Marsa Alam
        [27.18, 33.83],  // Hurghada
        [29.97, 32.55],  // Suez
        [29.20, 25.52],  // Siwa
        [31.04, 25.80],  // Mersa Matruh
      ],
    },
    kazakhstan: {
      color: brand,
      coords: [
        [51.23, 51.37],  // Oral
        [53.21, 63.63],  // Kostanay
        [51.17, 71.43],  // Astana
        [50.41, 80.23],  // Semey
        [43.24, 76.95],  // Almaty
        [42.32, 69.60],  // Shymkent
        [44.85, 65.50],  // Kyzylorda
        [43.65, 51.15],  // Aktau
        [47.11, 51.92],  // Atyrau
      ],
    },
  };

  protoMapPolygons = [];
  Object.entries(countryPolygons).forEach(([name, data]) => {
    const poly = L.polygon(data.coords, {
      color: data.color,
      weight: 2,
      fillColor: data.color,
      fillOpacity: 0.15,
      dashArray: '6 4',
    }).addTo(protoMap);
    protoMapPolygons.push(poly);
  });

  // --- Custom markers ---
  function labelIcon(html, className) {
    return L.divIcon({
      html: html,
      className: 'proto-leaflet-marker ' + (className || ''),
      iconSize: null,
      iconAnchor: [0, 0],
    });
  }

  // Rome heart pin — clickable for itinerary (white pill)
  const romeMarker = L.marker([41.90, 12.50], {
    icon: labelIcon(`<span class="proto-map-label proto-map-label--heart" style="cursor:pointer;" data-rome-pin>❤️ Rome</span>`),
    interactive: true,
  }).addTo(protoMap);
  window.romeMarkerRef = romeMarker;

  romeMarker.on('click', () => openRomeItinerary());

  // Also listen for DOM clicks on the Rome label (backup for divIcon)
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-rome-pin]')) {
      openRomeItinerary();
    }
  });

  // -----------------------------------------------
  // Visited countries — two states based on zoom
  //   Zoomed out: aggregate count badge (e.g. "20")
  //   Zoomed in:  individual spot pins (e.g. "✓ Paris")
  // -----------------------------------------------
  const ZOOM_THRESHOLD = 5; // zoom >= this shows individual spots

  const visitedCountries = [
    {
      country: 'France',
      lat: 46.60, lng: 2.20,
      spots: [
        { name: 'Paris',            lat: 48.86, lng: 2.35 },
        { name: 'Lyon',             lat: 45.76, lng: 4.84 },
        { name: 'Nice',             lat: 43.70, lng: 7.27 },
        { name: 'Marseille',        lat: 43.30, lng: 5.37 },
        { name: 'Bordeaux',         lat: 44.84, lng: -0.58 },
        { name: 'Strasbourg',       lat: 48.57, lng: 7.75 },
        { name: 'Toulouse',         lat: 43.60, lng: 1.44 },
        { name: 'Nantes',           lat: 47.22, lng: -1.55 },
        { name: 'Lille',            lat: 50.63, lng: 3.06 },
        { name: 'Montpellier',      lat: 43.61, lng: 3.88 },
        { name: 'Cannes',           lat: 43.55, lng: 7.02 },
        { name: 'Avignon',          lat: 43.95, lng: 4.81 },
        { name: 'Dijon',            lat: 47.32, lng: 5.04 },
        { name: 'Brest',            lat: 48.39, lng: -4.49 },
        { name: 'Rouen',            lat: 49.44, lng: 1.10 },
        { name: 'Grenoble',         lat: 45.19, lng: 5.72 },
        { name: 'Aix-en-Provence',  lat: 43.53, lng: 5.45 },
        { name: 'Saint-Malo',       lat: 48.65, lng: -1.68 },
        { name: 'Annecy',           lat: 45.90, lng: 6.13 },
        { name: 'Colmar',           lat: 48.08, lng: 7.36 },
      ],
    },
    {
      country: 'Algeria',
      lat: 28.00, lng: 2.00,
      spots: [
        { name: 'Algiers',     lat: 36.75, lng: 3.06 },
        { name: 'Oran',        lat: 35.70, lng: -0.63 },
      ],
    },
    {
      country: 'Egypt',
      lat: 27.50, lng: 30.80,
      spots: [
        { name: 'Cairo',       lat: 30.04, lng: 31.24 },
      ],
    },
    {
      country: 'Kazakhstan',
      lat: 48.00, lng: 67.00,
      spots: [
        { name: 'Astana',      lat: 51.17, lng: 71.43 },
        { name: 'Almaty',      lat: 43.24, lng: 76.95 },
        { name: 'Shymkent',    lat: 42.32, lng: 69.60 },
        { name: 'Aktau',       lat: 43.65, lng: 51.15 },
        { name: 'Semey',       lat: 50.41, lng: 80.23 },
      ],
    },
  ];

  // Layer groups for toggling
  const aggregateLayer = L.layerGroup().addTo(protoMap);
  const spotsLayer = L.layerGroup(); // not added initially (zoomed out)

  // Build aggregate count markers (zoomed out) — clickable, zooms into spots
  visitedCountries.forEach((c) => {
    const marker = L.marker([c.lat, c.lng], {
      icon: labelIcon(
        `<span class="proto-map-badge-count proto-map-badge-country" style="cursor:pointer;">${c.country} · ${c.spots.length}</span>`
      ),
      interactive: true,
    }).addTo(aggregateLayer);

    marker.on('click', () => {
      // Fit map to the bounds of this country's spots
      const bounds = L.latLngBounds(c.spots.map((s) => [s.lat, s.lng]));
      protoMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
    });
  });

  // Build individual spot markers (zoomed in)
  visitedCountries.forEach((c) => {
    c.spots.forEach((s) => {
      L.marker([s.lat, s.lng], {
        icon: labelIcon(
          `<span class="proto-map-badge-count proto-map-badge-spot">✓ ${s.name}</span>`
        ),
      }).addTo(spotsLayer);
    });
  });

  // Toggle layers based on zoom level
  function updateVisitedLayers() {
    const zoom = protoMap.getZoom();
    if (zoom >= ZOOM_THRESHOLD) {
      if (protoMap.hasLayer(aggregateLayer)) protoMap.removeLayer(aggregateLayer);
      if (!protoMap.hasLayer(spotsLayer)) protoMap.addLayer(spotsLayer);
    } else {
      if (protoMap.hasLayer(spotsLayer)) protoMap.removeLayer(spotsLayer);
      if (!protoMap.hasLayer(aggregateLayer)) protoMap.addLayer(aggregateLayer);
    }
  }

  protoMap.on('zoomend', updateVisitedLayers);
  updateVisitedLayers(); // set initial state

  // Center on Europe/Mediterranean at a good zoom level
  protoMap.setView([42, 18], 4);
}

// =============================================
// Rome Itinerary — click Rome pin to show
// =============================================
let romeItinLayer = null; // layer group for Rome itinerary pins

function openRomeItinerary() {
  if (!protoMap) return;

  // Zoom into Rome
  protoMap.setView([41.90, 12.48], 13);

  // Show itinerary sheet
  const itinSheet = document.getElementById('itinerarySheet');
  if (itinSheet) itinSheet.classList.add('visible');

  // Hide tab group
  const filters = document.getElementById('mapTabGroup');
  if (filters) filters.style.display = 'none';

  // Add itinerary emoji pins on the map
  if (romeItinLayer) {
    protoMap.removeLayer(romeItinLayer);
  }
  romeItinLayer = L.layerGroup().addTo(protoMap);

  function emojiIcon(emoji, cls) {
    return L.divIcon({
      html: `<div class="proto-map-emoji-pin ${cls || ''}">${emoji}</div>`,
      className: 'proto-leaflet-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  }

  function checkIcon() {
    return L.divIcon({
      html: `<div class="proto-map-emoji-pin proto-map-emoji-pin--check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>`,
      className: 'proto-leaflet-marker',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  }

  // Itinerary stops (emoji pins) — real Rome locations with detail data
  const romeSpots = [
    { lat: 41.9028, lng: 12.4964, emoji: '🛍️', name: 'Via del Corso', category: 'Shopping', rating: '4.2 (58 reviews)', reviewCount: 58, score: '4.2', hours: '· Closes 9:00 PM', desc: 'One of Rome\'s main shopping streets, stretching from Piazza del Popolo to Piazza Venezia, lined with boutiques and flagship stores.' },
    { lat: 41.8902, lng: 12.4922, emoji: '🏛️', name: 'Colosseum', category: 'Sightseeing', rating: '4.8 (2.4k reviews)', reviewCount: 2400, score: '4.8', hours: '· Closes 7:00 PM', desc: 'The iconic amphitheatre of ancient Rome. Built in 80 AD, it held up to 80,000 spectators for gladiatorial contests and public spectacles.' },
    { lat: 41.8986, lng: 12.4769, emoji: '🗼', name: 'Pantheon', category: 'Sightseeing', rating: '4.7 (1.8k reviews)', reviewCount: 1800, score: '4.7', hours: '· Closes 7:30 PM', desc: 'A former Roman temple, now a church, featuring the world\'s largest unreinforced concrete dome. A masterpiece of ancient engineering.' },
    { lat: 41.9142, lng: 12.4922, emoji: '🏞️', name: 'Villa Borghese', category: 'Park', rating: '4.5 (890 reviews)', reviewCount: 890, score: '4.5', hours: '· Open 24 hours', desc: 'Rome\'s third-largest public park featuring landscaped gardens, a lake, museums, and the famous Borghese Gallery with works by Bernini and Caravaggio.' },
    { lat: 41.8795, lng: 12.4691, emoji: '👟', name: 'Trastevere', category: 'Neighborhood', rating: '4.6 (420 reviews)', reviewCount: 420, score: '4.6', hours: '· Always open', desc: 'A charming medieval neighborhood known for its narrow cobblestone streets, colorful buildings, trattorias, and vibrant nightlife.' },
    { lat: 41.9058, lng: 12.4822, emoji: '🛍️', name: 'Spanish Steps', category: 'Landmark', rating: '4.3 (1.2k reviews)', reviewCount: 1200, score: '4.3', hours: '· Open 24 hours', desc: 'A monumental stairway of 135 steps connecting Piazza di Spagna to the Trinità dei Monti church. Surrounded by luxury shopping.' },
    { lat: 41.9029, lng: 12.4534, emoji: '🏛️', name: 'Vatican Museums', category: 'Museum', rating: '4.7 (3.1k reviews)', reviewCount: 3100, score: '4.7', hours: '· Closes 6:00 PM', desc: 'Home to one of the world\'s greatest art collections, including Michelangelo\'s Sistine Chapel ceiling and Raphael\'s frescoes.' },
    { lat: 41.8925, lng: 12.4853, emoji: '🏛️', name: 'Roman Forum', category: 'Sightseeing', rating: '4.6 (1.5k reviews)', reviewCount: 1500, score: '4.6', hours: '· Closes 6:30 PM', desc: 'The center of ancient Roman public life. Walk among the ruins of temples, basilicas, and arches that once formed the heart of the empire.' },
    { lat: 41.8956, lng: 12.4722, emoji: '🛍️', name: 'Campo de\' Fiori', category: 'Market', rating: '4.1 (340 reviews)', reviewCount: 340, score: '4.1', hours: '· Closes 2:00 PM', desc: 'A lively open-air market by day selling fresh produce, flowers, and spices. By night it transforms into a popular gathering spot with bars and restaurants.' },
    { lat: 41.9109, lng: 12.4923, emoji: '🛍️', name: 'Piazza del Popolo', category: 'Landmark', rating: '4.4 (680 reviews)', reviewCount: 680, score: '4.4', hours: '· Open 24 hours', desc: 'A grand neoclassical square with twin churches, an Egyptian obelisk, and stunning views from the Pincian Hill terrace above.' },
    { lat: 41.8840, lng: 12.4900, emoji: '🏞️', name: 'Circo Massimo', category: 'Sightseeing', rating: '4.0 (290 reviews)', reviewCount: 290, score: '4.0', hours: '· Open 24 hours', desc: 'The site of ancient Rome\'s largest chariot racing stadium. Now a public park offering panoramic views of the Palatine Hill.' },
  ];

  romeSpots.forEach((s) => {
    const marker = L.marker([s.lat, s.lng], {
      icon: emojiIcon(s.emoji),
      interactive: true,
    }).addTo(romeItinLayer);
    marker.on('click', () => openSpotDetail(s));
  });

  // DOM delegation for emoji pin clicks (backup)
  document.addEventListener('click', (e) => {
    const pin = e.target.closest('.proto-map-emoji-pin:not(.proto-map-emoji-pin--store):not(.proto-map-emoji-pin--check)');
    if (pin && document.getElementById('itinerarySheet')?.classList.contains('visible')) {
      // Find the closest spot based on the emoji pin that was clicked
      // This is a fallback — the Leaflet marker.on('click') is primary
    }
  });

  // Storefront pin
  L.marker([41.8870, 12.5050], {
    icon: emojiIcon('🏪', 'proto-map-emoji-pin--store'),
  }).addTo(romeItinLayer);

  // Completed checkmark pins
  const checkSpots = [
    [41.907, 12.490],
    [41.895, 12.488],
    [41.901, 12.478],
    [41.912, 12.485],
  ];
  checkSpots.forEach(([lat, lng]) => {
    L.marker([lat, lng], { icon: checkIcon() }).addTo(romeItinLayer);
  });
}

// ---- Spot Detail View ----
function openSpotDetail(spot) {
  const sheet = document.getElementById('spotDetailSheet');
  const itinSheet = document.getElementById('itinerarySheet');
  if (!sheet) return;

  // Populate content
  document.getElementById('spotTitle').textContent = spot.name;
  document.getElementById('spotCategory').textContent = spot.category;
  document.getElementById('spotRating').textContent = spot.rating;
  document.getElementById('spotDesc').innerHTML = spot.desc + '... <strong>more</strong>';
  document.getElementById('spotReviewsTitle').textContent = `Reviews (${spot.reviewCount})`;
  document.getElementById('spotReviewScore').textContent = spot.score;
  document.getElementById('spotHours').textContent = spot.hours;

  // Color the hero bg based on category
  const heroBg = document.getElementById('spotHeroBg');
  const bgMap = {
    'Shopping': 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)',
    'Sightseeing': 'linear-gradient(135deg, #5C4033 0%, #8B6914 50%, #A0522D 100%)',
    'Museum': 'linear-gradient(135deg, #3C2415 0%, #5C4033 50%, #8B6914 100%)',
    'Park': 'linear-gradient(135deg, #2D5016 0%, #3D6B1E 50%, #5A8A2F 100%)',
    'Neighborhood': 'linear-gradient(135deg, #8B4513 0%, #CC7722 50%, #DAA520 100%)',
    'Landmark': 'linear-gradient(135deg, #4A3728 0%, #6B4226 50%, #8B6914 100%)',
    'Market': 'linear-gradient(135deg, #8B4513 0%, #CD853F 50%, #DEB887 100%)',
  };
  heroBg.style.background = bgMap[spot.category] || bgMap['Sightseeing'];

  // Gallery placeholder colors
  const mainGallery = document.getElementById('spotGalleryMain');
  mainGallery.style.background = bgMap[spot.category]?.replace('135deg', '180deg') || '#d4a574';

  // Hide itinerary sheet, show spot detail
  if (itinSheet) itinSheet.classList.remove('visible', 'expanded');
  sheet.classList.add('visible');

  // Pan map to the spot
  if (protoMap) {
    protoMap.panTo([spot.lat, spot.lng], { animate: true });
  }
}

function closeSpotDetail() {
  const sheet = document.getElementById('spotDetailSheet');
  const itinSheet = document.getElementById('itinerarySheet');
  if (sheet) sheet.classList.remove('visible', 'expanded');
  if (itinSheet) itinSheet.classList.add('visible');

  // Scroll content back to top
  const content = sheet?.querySelector('.proto-spot-content');
  if (content) content.scrollTop = 0;
}

// Spot detail handle expand/collapse
document.getElementById('spotDetailHandle')?.addEventListener('click', () => {
  const sheet = document.getElementById('spotDetailSheet');
  if (sheet) sheet.classList.toggle('expanded');
});

// Spot back button — go back to itinerary
document.getElementById('spotBackBtn')?.addEventListener('click', () => closeSpotDetail());

// Spot close button — close spot AND itinerary, go back to map
document.getElementById('spotCloseBtn')?.addEventListener('click', () => {
  const sheet = document.getElementById('spotDetailSheet');
  if (sheet) sheet.classList.remove('visible', 'expanded');
  closeRomeItinerary();
});

function closeRomeItinerary() {
  if (!protoMap) return;

  // Remove itinerary pins
  if (romeItinLayer) {
    protoMap.removeLayer(romeItinLayer);
    romeItinLayer = null;
  }

  // Hide all overlay sheets
  const itinSheet = document.getElementById('itinerarySheet');
  const spotSheet = document.getElementById('spotDetailSheet');
  if (itinSheet) itinSheet.classList.remove('visible', 'expanded');
  if (spotSheet) spotSheet.classList.remove('visible', 'expanded');

  // Show tab group
  const filters = document.getElementById('mapTabGroup');
  if (filters) filters.style.display = '';

  // Zoom back out
  protoMap.setView([42, 18], 4);
}

// Close button
const itineraryCloseBtn = document.getElementById('itineraryClose');
if (itineraryCloseBtn) {
  itineraryCloseBtn.addEventListener('click', closeRomeItinerary);
}

// Handle bar tap to expand/collapse drawer (itinerary)
const itineraryHandle = document.getElementById('itineraryHandle');
if (itineraryHandle) {
  itineraryHandle.addEventListener('click', () => {
    const sheet = document.getElementById('itinerarySheet');
    if (sheet) sheet.classList.toggle('expanded');
  });
}


// =============================================
// Add Trip — Record Flow
// =============================================
// Map Tab Group — All vs Past Trips
// =============================================
document.querySelectorAll('.proto-map-tab[data-map-tab]').forEach((tab) => {
  tab.addEventListener('click', () => {
    // Toggle active state
    document.querySelectorAll('.proto-map-tab[data-map-tab]').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    const mode = tab.getAttribute('data-map-tab');
    if (mode === 'past') {
      // Hide Rome heart pin (it's a saved spot, not a past trip)
      if (window.romeMarkerRef && protoMap && protoMap.hasLayer(window.romeMarkerRef)) {
        protoMap.removeLayer(window.romeMarkerRef);
      }
    } else {
      // Show Rome heart pin
      if (window.romeMarkerRef && protoMap && !protoMap.hasLayer(window.romeMarkerRef)) {
        window.romeMarkerRef.addTo(protoMap);
      }
    }
  });
});

// =============================================
// Add Trip — Record Flow
// =============================================
let recordMap = null;
let previousView = null; // track which view to go back to

// FAB "+" button opens the add-trip view
document.querySelector('.proto-fab')?.addEventListener('click', () => {
  const phone = document.querySelector('.proto-phone');
  if (!phone) return;

  // Remember current view
  const currentActive = phone.querySelector('.proto-view.active');
  previousView = currentActive ? currentActive.getAttribute('data-view') : 'home';

  // Switch all views off, activate add-trip
  phone.querySelectorAll('.proto-view').forEach((v) => v.classList.remove('active'));
  const addTripView = phone.querySelector('.proto-view[data-view="add-trip"]');
  if (addTripView) addTripView.classList.add('active');

  // Deactivate all tabs
  phone.querySelectorAll('.proto-tab[data-tab]').forEach((t) => t.classList.remove('active'));

  // Scroll screen to top
  const screen = phone.querySelector('.proto-screen');
  if (screen) screen.scrollTop = 0;

  // Hide tab bar for immersive feel
  const tabBar = phone.querySelector('.proto-tab-bar');
  if (tabBar) tabBar.style.display = 'none';

  // Init record map
  if (!recordMap) {
    initRecordMap();
  } else {
    setTimeout(() => recordMap.invalidateSize(), 100);
  }

  // Reset to start state
  resetRecordState();
});

function initRecordMap() {
  const container = document.getElementById('protoRecordMap');
  if (!container) return;

  recordMap = L.map(container, {
    center: [40.7128, -74.006], // NYC as simulated user location
    zoom: 15,
    zoomControl: false,
    attributionControl: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(recordMap);
}

function resetRecordState() {
  // Reset pin state
  const pin = document.getElementById('recordPin');
  if (pin) pin.classList.remove('recording');

  // Reset status
  const status = document.getElementById('recordStatus');
  if (status) {
    status.classList.remove('recording');
    status.querySelector('span').textContent = 'Ready to record your trip';
  }

  // Show start button, hide active buttons
  const startGroup = document.getElementById('recordStartGroup');
  const activeGroup = document.getElementById('recordActiveGroup');
  if (startGroup) startGroup.style.display = 'flex';
  if (activeGroup) activeGroup.style.display = 'none';
}

// Back button
document.getElementById('recordBackBtn')?.addEventListener('click', () => {
  const phone = document.querySelector('.proto-phone');
  if (!phone) return;

  // Show tab bar again
  const tabBar = phone.querySelector('.proto-tab-bar');
  if (tabBar) tabBar.style.display = '';

  // Switch back to previous view
  phone.querySelectorAll('.proto-view').forEach((v) => v.classList.remove('active'));
  const targetView = phone.querySelector(`.proto-view[data-view="${previousView || 'home'}"]`);
  if (targetView) targetView.classList.add('active');

  // Re-activate the correct tab
  phone.querySelectorAll('.proto-tab[data-tab]').forEach((t) => t.classList.remove('active'));
  const targetTab = phone.querySelector(`.proto-tab[data-tab="${previousView || 'home'}"]`);
  if (targetTab) targetTab.classList.add('active');

  // If going back to map, refresh
  if (previousView === 'map' && protoMap) {
    setTimeout(() => protoMap.invalidateSize(), 100);
  }

  resetRecordState();
});

// Start recording
document.getElementById('startRecordBtn')?.addEventListener('click', () => {
  // Red ripple
  const pin = document.getElementById('recordPin');
  if (pin) pin.classList.add('recording');

  // Red status
  const status = document.getElementById('recordStatus');
  if (status) {
    status.classList.add('recording');
    status.querySelector('span').textContent = 'Recording your trip...';
  }

  // Swap buttons
  const startGroup = document.getElementById('recordStartGroup');
  const activeGroup = document.getElementById('recordActiveGroup');
  if (startGroup) startGroup.style.display = 'none';
  if (activeGroup) activeGroup.style.display = 'flex';
});

// Pause
document.getElementById('pauseRecordBtn')?.addEventListener('click', () => {
  const pin = document.getElementById('recordPin');
  const status = document.getElementById('recordStatus');
  const pauseBtn = document.getElementById('pauseRecordBtn');

  if (pin && pin.classList.contains('recording')) {
    // Pause — stop red ripple but keep active buttons
    pin.classList.remove('recording');
    if (status) {
      status.classList.remove('recording');
      status.querySelector('span').textContent = 'Paused';
    }
    if (pauseBtn) pauseBtn.querySelector('span, svg + *')?.remove();
    if (pauseBtn) pauseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Resume';
  } else {
    // Resume
    pin?.classList.add('recording');
    if (status) {
      status.classList.add('recording');
      status.querySelector('span').textContent = 'Recording your trip...';
    }
    if (pauseBtn) pauseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> Pause';
  }
});

// End recording — go back
document.getElementById('endRecordBtn')?.addEventListener('click', () => {
  document.getElementById('recordBackBtn')?.click();
});

// =============================================
// Prototype 3 — Duplicate of Prototype 1
// =============================================
let proto3Map = null;
let proto3MapPolygons = [];
let rome3ItinLayer = null;

function initProto3Map() {
  const mapEl = document.getElementById('proto3Map');
  if (!mapEl || typeof L === 'undefined') return;

  proto3Map = L.map(mapEl, {
    center: [42, 20], zoom: 3, zoomControl: false, attributionControl: false, dragging: true, scrollWheelZoom: true,
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(proto3Map);

  const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#6C00F6';

  // Country polygons (same data)
  const countryPolygons = {
    france: { color: brand, coords: [[51.03,2.38],[48.57,7.75],[45.76,4.84],[43.70,7.27],[43.30,5.37],[43.61,3.88],[42.70,2.90],[43.60,1.44],[44.84,-0.58],[47.22,-1.55],[48.39,-4.49],[48.65,-1.68],[49.19,-0.37],[49.90,2.30],[50.63,3.06]] },
    algeria: { color: brand, coords: [[35.70,-0.63],[36.75,3.06],[36.90,7.77],[36.37,6.61],[34.85,5.72],[32.49,3.67],[27.18,2.52],[22.79,5.53],[26.51,8.48],[31.62,-2.22],[34.88,-1.32]] },
    egypt: { color: brand, coords: [[31.20,29.92],[31.26,32.30],[30.04,31.24],[30.59,32.27],[28.09,30.75],[25.69,32.64],[24.09,32.90],[25.07,34.90],[27.18,33.83],[29.97,32.55],[29.20,25.52],[31.04,25.80]] },
    kazakhstan: { color: brand, coords: [[51.23,51.37],[53.21,63.63],[51.17,71.43],[50.41,80.23],[43.24,76.95],[42.32,69.60],[44.85,65.50],[43.65,51.15],[47.11,51.92]] },
  };

  proto3MapPolygons = [];
  Object.entries(countryPolygons).forEach(([name, data]) => {
    const poly = L.polygon(data.coords, { color: data.color, weight: 2, fillColor: data.color, fillOpacity: 0.15, dashArray: '6 4' }).addTo(proto3Map);
    proto3MapPolygons.push(poly);
  });

  function labelIcon(html, className) {
    return L.divIcon({ html, className: 'proto-leaflet-marker ' + (className || ''), iconSize: null, iconAnchor: [0, 0] });
  }

  // Rome pin (card style)
  const romeCardHtml = `<div class="proto3-rome-pill" data-rome3-pin>
    <div class="proto3-rome-pill-img"></div>
    <span class="proto3-rome-pill-name">❤️ Rome</span>
    <span class="proto3-rome-pill-match">87%</span>
  </div>`;
  const romeMarker = L.marker([41.90, 12.50], {
    icon: L.divIcon({ html: romeCardHtml, className: 'proto-leaflet-marker', iconSize: [160, 36], iconAnchor: [80, 18] }),
    interactive: true,
  }).addTo(proto3Map);
  window.rome3MarkerRef = romeMarker;
  romeMarker.on('click', () => openRome3Itinerary());
  document.addEventListener('click', (e) => { if (e.target.closest('[data-rome3-pin]')) openRome3Itinerary(); });

  // Visited countries layers
  const ZOOM_THRESHOLD = 5;
  const visitedCountries = [
    { country: 'France', lat: 46.60, lng: 2.20, spots: [{name:'Paris',lat:48.86,lng:2.35},{name:'Lyon',lat:45.76,lng:4.84},{name:'Nice',lat:43.70,lng:7.27},{name:'Marseille',lat:43.30,lng:5.37},{name:'Bordeaux',lat:44.84,lng:-0.58},{name:'Strasbourg',lat:48.57,lng:7.75},{name:'Toulouse',lat:43.60,lng:1.44},{name:'Nantes',lat:47.22,lng:-1.55},{name:'Lille',lat:50.63,lng:3.06},{name:'Montpellier',lat:43.61,lng:3.88},{name:'Cannes',lat:43.55,lng:7.02},{name:'Avignon',lat:43.95,lng:4.81},{name:'Dijon',lat:47.32,lng:5.04},{name:'Brest',lat:48.39,lng:-4.49},{name:'Rouen',lat:49.44,lng:1.10},{name:'Grenoble',lat:45.19,lng:5.72},{name:'Aix-en-Provence',lat:43.53,lng:5.45},{name:'Saint-Malo',lat:48.65,lng:-1.68},{name:'Annecy',lat:45.90,lng:6.13},{name:'Colmar',lat:48.08,lng:7.36}] },
    { country: 'Algeria', lat: 28.00, lng: 2.00, spots: [{name:'Algiers',lat:36.75,lng:3.06},{name:'Oran',lat:35.70,lng:-0.63}] },
    { country: 'Egypt', lat: 27.50, lng: 30.80, spots: [{name:'Cairo',lat:30.04,lng:31.24}] },
    { country: 'Kazakhstan', lat: 48.00, lng: 67.00, spots: [{name:'Astana',lat:51.17,lng:71.43},{name:'Almaty',lat:43.24,lng:76.95},{name:'Shymkent',lat:42.32,lng:69.60},{name:'Aktau',lat:43.65,lng:51.15},{name:'Semey',lat:50.41,lng:80.23}] },
  ];

  const aggregateLayer = L.layerGroup().addTo(proto3Map);
  const spotsLayer = L.layerGroup();

  visitedCountries.forEach((c) => {
    const marker = L.marker([c.lat, c.lng], {
      icon: labelIcon(`<span class="proto-map-badge-count proto-map-badge-country" style="cursor:pointer;">${c.country} · ${c.spots.length}</span>`),
      interactive: true,
    }).addTo(aggregateLayer);
    marker.on('click', () => {
      const bounds = L.latLngBounds(c.spots.map((s) => [s.lat, s.lng]));
      proto3Map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
    });
  });

  visitedCountries.forEach((c) => {
    c.spots.forEach((s) => {
      L.marker([s.lat, s.lng], { icon: labelIcon(`<span class="proto-map-badge-count proto-map-badge-spot">✓ ${s.name}</span>`) }).addTo(spotsLayer);
    });
  });

  function updateVisitedLayers() {
    const zoom = proto3Map.getZoom();
    if (zoom >= ZOOM_THRESHOLD) {
      if (proto3Map.hasLayer(aggregateLayer)) proto3Map.removeLayer(aggregateLayer);
      if (!proto3Map.hasLayer(spotsLayer)) proto3Map.addLayer(spotsLayer);
    } else {
      if (proto3Map.hasLayer(spotsLayer)) proto3Map.removeLayer(spotsLayer);
      if (!proto3Map.hasLayer(aggregateLayer)) proto3Map.addLayer(aggregateLayer);
    }
  }
  proto3Map.on('zoomend', updateVisitedLayers);
  updateVisitedLayers();
  proto3Map.setView([42, 18], 4);
}

// Rome itinerary for Prototype 3
function openRome3Itinerary() {
  if (!proto3Map) return;
  // Hide Rome pin card when itinerary is open
  if (window.rome3MarkerRef) proto3Map.removeLayer(window.rome3MarkerRef);
  proto3Map.setView([41.90, 12.48], 13);
  const itinSheet = document.getElementById('itinerary3Sheet');
  if (itinSheet) itinSheet.classList.add('visible');

  if (rome3ItinLayer) proto3Map.removeLayer(rome3ItinLayer);
  rome3ItinLayer = L.layerGroup().addTo(proto3Map);

  function emojiIcon(emoji, cls) {
    return L.divIcon({ html: `<div class="proto-map-emoji-pin ${cls || ''}">${emoji}</div>`, className: 'proto-leaflet-marker', iconSize: [30, 30], iconAnchor: [15, 15] });
  }
  function checkIcon() {
    return L.divIcon({ html: '<div class="proto-map-emoji-pin proto-map-emoji-pin--check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>', className: 'proto-leaflet-marker', iconSize: [22, 22], iconAnchor: [11, 11] });
  }

  const romeSpots = [
    { lat:41.9028,lng:12.4964,emoji:'🛍️',name:'Via del Corso',category:'Shopping',rating:'4.2 (58 reviews)',reviewCount:58,score:'4.2',hours:'· Closes 9:00 PM',desc:'One of Rome\'s main shopping streets.' },
    { lat:41.8902,lng:12.4922,emoji:'🏛️',name:'Colosseum',category:'Sightseeing',rating:'4.8 (2.4k reviews)',reviewCount:2400,score:'4.8',hours:'· Closes 7:00 PM',desc:'The iconic amphitheatre of ancient Rome.' },
    { lat:41.8986,lng:12.4769,emoji:'🗼',name:'Pantheon',category:'Sightseeing',rating:'4.7 (1.8k reviews)',reviewCount:1800,score:'4.7',hours:'· Closes 7:30 PM',desc:'A former Roman temple with the world\'s largest unreinforced concrete dome.' },
    { lat:41.9142,lng:12.4922,emoji:'🏞️',name:'Villa Borghese',category:'Park',rating:'4.5 (890 reviews)',reviewCount:890,score:'4.5',hours:'· Open 24 hours',desc:'Rome\'s third-largest public park.' },
    { lat:41.8795,lng:12.4691,emoji:'👟',name:'Trastevere',category:'Neighborhood',rating:'4.6 (420 reviews)',reviewCount:420,score:'4.6',hours:'· Always open',desc:'A charming medieval neighborhood.' },
    { lat:41.9058,lng:12.4822,emoji:'🛍️',name:'Spanish Steps',category:'Landmark',rating:'4.3 (1.2k reviews)',reviewCount:1200,score:'4.3',hours:'· Open 24 hours',desc:'A monumental stairway of 135 steps.' },
    { lat:41.9029,lng:12.4534,emoji:'🏛️',name:'Vatican Museums',category:'Museum',rating:'4.7 (3.1k reviews)',reviewCount:3100,score:'4.7',hours:'· Closes 6:00 PM',desc:'Home to one of the world\'s greatest art collections.' },
  ];

  romeSpots.forEach((s) => {
    const marker = L.marker([s.lat, s.lng], { icon: emojiIcon(s.emoji), interactive: true }).addTo(rome3ItinLayer);
    marker.on('click', () => openSpot3Detail(s));
  });

  L.marker([41.8870, 12.5050], { icon: emojiIcon('🏪', 'proto-map-emoji-pin--store') }).addTo(rome3ItinLayer);
  [[41.907,12.490],[41.895,12.488],[41.901,12.478],[41.912,12.485]].forEach(([lat,lng]) => {
    L.marker([lat, lng], { icon: checkIcon() }).addTo(rome3ItinLayer);
  });
}

function openSpot3Detail(spot) {
  const sheet = document.getElementById('spotDetail3Sheet');
  const itinSheet = document.getElementById('itinerary3Sheet');
  if (!sheet) return;
  document.getElementById('spot3Title').textContent = spot.name;
  document.getElementById('spot3Category').textContent = spot.category;
  if (itinSheet) itinSheet.classList.remove('visible', 'expanded');
  sheet.classList.add('visible');
  if (proto3Map) proto3Map.panTo([spot.lat, spot.lng], { animate: true });
}

function closeRome3Itinerary() {
  if (!proto3Map) return;
  if (rome3ItinLayer) { proto3Map.removeLayer(rome3ItinLayer); rome3ItinLayer = null; }
  // Restore Rome pin card
  if (window.rome3MarkerRef && !proto3Map.hasLayer(window.rome3MarkerRef)) {
    window.rome3MarkerRef.addTo(proto3Map);
  }
  const itinSheet = document.getElementById('itinerary3Sheet');
  const spotSheet = document.getElementById('spotDetail3Sheet');
  if (itinSheet) itinSheet.classList.remove('visible', 'expanded');
  if (spotSheet) spotSheet.classList.remove('visible', 'expanded');
  proto3Map.setView([42, 18], 4);
}

document.getElementById('itinerary3Close')?.addEventListener('click', closeRome3Itinerary);
document.getElementById('itinerary3Handle')?.addEventListener('click', () => {
  const sheet = document.getElementById('itinerary3Sheet');
  if (sheet) sheet.classList.toggle('expanded');
});

// Proto 3 FAB
(function() {
  const proto3Section = document.getElementById('prototype-3');
  if (!proto3Section) return;
  const fab = proto3Section.querySelector('.proto-fab');
  const phone = proto3Section.querySelector('.proto-phone');
  if (!fab || !phone) return;

  let prev3View = null;
  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentActive = phone.querySelector('.proto-view.active');
    prev3View = currentActive ? currentActive.getAttribute('data-view') : 'home';
    phone.querySelectorAll('.proto-view').forEach((v) => v.classList.remove('active'));
    const addTripView = phone.querySelector('.proto-view[data-view="add-trip"]');
    if (addTripView) addTripView.classList.add('active');
    phone.querySelectorAll('.proto-tab[data-tab]').forEach((t) => t.classList.remove('active'));
    const tabBar = phone.querySelector('.proto-tab-bar');
    if (tabBar) tabBar.style.display = 'none';
    const chatFloat = document.getElementById('proto3ChatFloat');
    if (chatFloat) chatFloat.style.display = 'none';

    const recMap = phone.querySelector('[id="proto3RecordMap"]');
    if (recMap && !recMap._leaflet_id) {
      const rm = L.map(recMap, { center: [40.7128, -74.006], zoom: 15, zoomControl: false, attributionControl: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(rm);
    }
  });

  // Back button for proto 3
  const backBtn = proto3Section.querySelector('#recordBackBtn') || proto3Section.querySelector('[id$="recordBackBtn"]');
  // Use event delegation for the back button
  proto3Section.addEventListener('click', (e) => {
    const back = e.target.closest('.proto-record-back');
    if (!back) return;
    const tabBar = phone.querySelector('.proto-tab-bar');
    if (tabBar) tabBar.style.display = '';
    const chatFloat = document.getElementById('proto3ChatFloat');
    if (chatFloat) chatFloat.style.display = '';
    phone.querySelectorAll('.proto-view').forEach((v) => v.classList.remove('active'));
    const targetView = phone.querySelector(`.proto-view[data-view="${prev3View || 'home'}"]`);
    if (targetView) targetView.classList.add('active');
    phone.querySelectorAll('.proto-tab[data-tab]').forEach((t) => t.classList.remove('active'));
    const targetTab = phone.querySelector(`.proto-tab[data-tab="${prev3View || 'home'}"]`);
    if (targetTab) targetTab.classList.add('active');
    if (prev3View === 'map' && proto3Map) setTimeout(() => proto3Map.invalidateSize(), 100);
  });
})();

// Update proto3 map polygons on theme switch
const origApplyTheme = applyTheme;
applyTheme = function(theme) {
  origApplyTheme(theme);
  if (proto3Map && proto3MapPolygons.length) {
    const newBrand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
    proto3MapPolygons.forEach((poly) => poly.setStyle({ color: newBrand, fillColor: newBrand }));
  }
};

// =============================================
// Prototype 3 — Chat Float & Chat Page
// =============================================
(function() {
  const proto3 = document.getElementById('prototype-3');
  if (!proto3) return;
  const phone = proto3.querySelector('.proto-phone');
  if (!phone) return;

  const chatFloat = document.getElementById('proto3ChatFloat');
  const chatBack = document.getElementById('proto3ChatBack');

  let chatPreviousView = null;

  // Click floating input → open chat view
  if (chatFloat) {
    chatFloat.addEventListener('click', () => {
      const currentActive = phone.querySelector('.proto-view.active');
      chatPreviousView = currentActive ? currentActive.getAttribute('data-view') : 'home';

      phone.querySelectorAll('.proto-view').forEach(v => v.classList.remove('active'));
      const chatView = phone.querySelector('.proto-view[data-view="chat"]');
      if (chatView) chatView.classList.add('active');

      // Hide float + tab bar
      chatFloat.style.display = 'none';
      const tabBar = phone.querySelector('.proto3-tab-bar');
      if (tabBar) tabBar.style.display = 'none';

      // Scroll messages to bottom
      const msgs = document.getElementById('proto3ChatMessages');
      if (msgs) setTimeout(() => msgs.scrollTop = msgs.scrollHeight, 50);
    });
  }

  // Back button → return to previous view
  if (chatBack) {
    chatBack.addEventListener('click', () => {
      phone.querySelectorAll('.proto-view').forEach(v => v.classList.remove('active'));
      const targetView = phone.querySelector(`.proto-view[data-view="${chatPreviousView || 'home'}"]`);
      if (targetView) targetView.classList.add('active');

      // Show float + tab bar
      if (chatFloat) chatFloat.style.display = '';
      const tabBar = phone.querySelector('.proto3-tab-bar');
      if (tabBar) tabBar.style.display = '';

      // Re-activate correct tab
      phone.querySelectorAll('.proto-tab[data-tab]').forEach(t => t.classList.remove('active'));
      const targetTab = phone.querySelector(`.proto-tab[data-tab="${chatPreviousView || 'home'}"]`);
      if (targetTab) targetTab.classList.add('active');

      if (chatPreviousView === 'map' && proto3Map) {
        setTimeout(() => proto3Map.invalidateSize(), 100);
      }
    });
  }
})();

// =============================================
// Chat History Panel (Prototype 3)
// =============================================
(function() {
  const moreBtn = document.getElementById('proto3ChatMore');
  const historyPanel = document.getElementById('proto3ChatHistory');
  const historyBack = document.getElementById('proto3ChatHistoryBack');
  const newChatBtn = document.getElementById('proto3ChatNewBtn');
  if (!moreBtn || !historyPanel) return;

  moreBtn.addEventListener('click', () => {
    historyPanel.classList.add('visible');
  });

  historyBack?.addEventListener('click', () => {
    historyPanel.classList.remove('visible');
  });

  // Clicking a chat item goes back to the chat
  historyPanel.querySelectorAll('.proto3-chat-history-item').forEach(item => {
    item.addEventListener('click', () => {
      historyPanel.classList.remove('visible');
    });
  });

  // New chat clears messages and goes back
  newChatBtn?.addEventListener('click', () => {
    const messages = document.getElementById('proto3ChatMessages');
    if (messages) {
      messages.innerHTML = `<div class="proto3-chat-bubble proto3-chat-bubble--agent"><p>Hey! I'm your Zenvoya travel agent. Tell me where you'd like to go, your budget, and what kind of experiences you enjoy — I'll build a custom itinerary for you.</p></div>`;
    }
    historyPanel.classList.remove('visible');
  });
})();

// =============================================
// Chat Input Functionality (Prototype 3)
// =============================================
(function() {
  const input = document.getElementById('proto3ChatInput');
  const sendBtn = document.getElementById('proto3ChatSendBtn');
  const messages = document.getElementById('proto3ChatMessages');
  const voiceIndicator = document.getElementById('proto3VoiceIndicator');
  if (!input || !sendBtn || !messages) return;

  const micIcon = sendBtn.querySelector('.proto3-mic-icon');
  const sendIcon = sendBtn.querySelector('.proto3-send-icon');
  let isRecording = false;

  // Toggle mic/send icon based on input content
  input.addEventListener('input', () => {
    const hasText = input.value.trim().length > 0;
    micIcon.style.display = hasText ? 'none' : 'block';
    sendIcon.style.display = hasText ? 'block' : 'none';
  });

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // Remove typing indicator
    const typing = messages.querySelector('.proto3-chat-typing');
    if (typing) typing.remove();

    // Add user bubble
    const bubble = document.createElement('div');
    bubble.className = 'proto3-chat-bubble proto3-chat-bubble--user';
    bubble.innerHTML = `<p>${text}</p>`;
    messages.appendChild(bubble);
    input.value = '';
    micIcon.style.display = 'block';
    sendIcon.style.display = 'none';
    messages.scrollTop = messages.scrollHeight;

    // Show typing indicator then agent reply
    const typingEl = document.createElement('div');
    typingEl.className = 'proto3-chat-typing';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(typingEl);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      typingEl.remove();
      const reply = document.createElement('div');
      reply.className = 'proto3-chat-bubble proto3-chat-bubble--agent';
      reply.innerHTML = `<p>That sounds great! Let me look into the best options for you. I'll have a personalized itinerary ready in just a moment.</p>`;
      messages.appendChild(reply);
      messages.scrollTop = messages.scrollHeight;
    }, 1500);
  }

  // Send on enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
  });

  // Send or toggle voice on button click
  sendBtn.addEventListener('click', () => {
    if (input.value.trim().length > 0) {
      sendMessage();
      return;
    }

    // Toggle voice recording
    isRecording = !isRecording;
    sendBtn.classList.toggle('recording', isRecording);
    input.style.display = isRecording ? 'none' : '';
    voiceIndicator.classList.toggle('active', isRecording);

    if (isRecording) {
      // Simulate stop after 3 seconds
      setTimeout(() => {
        if (!isRecording) return;
        isRecording = false;
        sendBtn.classList.remove('recording');
        input.style.display = '';
        voiceIndicator.classList.remove('active');
        input.value = 'I want to explore Rome for a weekend';
        input.dispatchEvent(new Event('input'));
      }, 3000);
    }
  });
})();

// =============================================
// Map Avatar Bar (Prototype 3) — Friend selection
// =============================================
(function() {
  const proto3 = document.getElementById('prototype-3');
  if (!proto3) return;

  const avatarItems = proto3.querySelectorAll('.proto3-avatar-item');

  // Friend colors for outlines and pins
  const friendColors = {
    f1: '#E84393', // pink
    f2: '#00B894', // teal
    f3: '#FDCB6E', // yellow
    f4: '#0984E3', // blue
  };

  // Friend visited countries with spots (like user's visitedCountries)
  const friendData = {
    f1: [
      { country: 'France', lat: 46.60, lng: 2.20, spots: [{name:'Paris',lat:48.86,lng:2.35},{name:'Lyon',lat:45.76,lng:4.84},{name:'Nice',lat:43.70,lng:7.27}] },
      { country: 'Germany', lat: 51.16, lng: 10.45, spots: [{name:'Berlin',lat:52.52,lng:13.41},{name:'Munich',lat:48.14,lng:11.58}] },
    ],
    f2: [
      { country: 'Japan', lat: 36.20, lng: 138.25, spots: [{name:'Tokyo',lat:35.68,lng:139.65},{name:'Osaka',lat:34.69,lng:135.50},{name:'Kyoto',lat:35.01,lng:135.77}] },
      { country: 'South Korea', lat: 35.91, lng: 127.77, spots: [{name:'Seoul',lat:37.57,lng:127.0},{name:'Busan',lat:35.18,lng:129.08}] },
    ],
    f3: [
      { country: 'Australia', lat: -25.27, lng: 133.78, spots: [{name:'Sydney',lat:-33.87,lng:151.21},{name:'Melbourne',lat:-37.81,lng:144.96}] },
      { country: 'Singapore', lat: 1.35, lng: 103.82, spots: [{name:'Singapore',lat:1.35,lng:103.82}] },
      { country: 'New Zealand', lat: -40.90, lng: 174.89, spots: [{name:'Auckland',lat:-36.85,lng:174.76}] },
    ],
    f4: [
      { country: 'UAE', lat: 23.42, lng: 53.85, spots: [{name:'Dubai',lat:25.2,lng:55.27},{name:'Abu Dhabi',lat:24.45,lng:54.65}] },
      { country: 'Turkey', lat: 38.96, lng: 35.24, spots: [{name:'Istanbul',lat:41.01,lng:28.98},{name:'Cappadocia',lat:38.64,lng:34.83}] },
      { country: 'Morocco', lat: 31.79, lng: -7.09, spots: [{name:'Marrakech',lat:31.63,lng:-8.01},{name:'Fez',lat:34.03,lng:-5.00}] },
    ],
  };

  let friendLayers = {}; // { friendId: { aggregate: L.layerGroup, spots: L.layerGroup } }

  function labelIcon(html, className) {
    return L.divIcon({ html, className: 'proto-leaflet-marker ' + (className || ''), iconSize: null, iconAnchor: [0, 0] });
  }

  function addFriendLayers(friendId) {
    if (!proto3Map || friendLayers[friendId]) return;
    const color = friendColors[friendId];
    const countries = friendData[friendId] || [];

    const aggregateLayer = L.layerGroup().addTo(proto3Map);
    const spotsLayer = L.layerGroup();

    countries.forEach(c => {
      const marker = L.marker([c.lat, c.lng], {
        icon: labelIcon(`<span class="proto3-friend-badge" style="background:${color};cursor:pointer;">${c.country} · ${c.spots.length}</span>`),
        interactive: true,
      }).addTo(aggregateLayer);
      marker.on('click', () => {
        const bounds = L.latLngBounds(c.spots.map(s => [s.lat, s.lng]));
        proto3Map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
      });
    });

    countries.forEach(c => {
      c.spots.forEach(s => {
        L.marker([s.lat, s.lng], {
          icon: labelIcon(`<span class="proto3-friend-spot" style="border-color:${color};color:${color};">● ${s.name}</span>`),
        }).addTo(spotsLayer);
      });
    });

    friendLayers[friendId] = { aggregate: aggregateLayer, spots: spotsLayer };
    updateFriendLayers(friendId);
  }

  function removeFriendLayers(friendId) {
    if (!proto3Map || !friendLayers[friendId]) return;
    proto3Map.removeLayer(friendLayers[friendId].aggregate);
    if (proto3Map.hasLayer(friendLayers[friendId].spots)) proto3Map.removeLayer(friendLayers[friendId].spots);
    delete friendLayers[friendId];
  }

  function updateFriendLayers(friendId) {
    if (!proto3Map || !friendLayers[friendId]) return;
    const zoom = proto3Map.getZoom();
    const fl = friendLayers[friendId];
    if (zoom >= 5) {
      if (proto3Map.hasLayer(fl.aggregate)) proto3Map.removeLayer(fl.aggregate);
      if (!proto3Map.hasLayer(fl.spots)) proto3Map.addLayer(fl.spots);
    } else {
      if (proto3Map.hasLayer(fl.spots)) proto3Map.removeLayer(fl.spots);
      if (!proto3Map.hasLayer(fl.aggregate)) proto3Map.addLayer(fl.aggregate);
    }
  }

  // Update all friend layers on zoom
  if (proto3Map) {
    proto3Map.on('zoomend', () => {
      Object.keys(friendLayers).forEach(updateFriendLayers);
    });
  }

  avatarItems.forEach(item => {
    item.addEventListener('click', () => {
      const friendId = item.getAttribute('data-friend');
      if (friendId === 'me') return;

      const color = friendColors[friendId];

      // Toggle selection with friend-specific color
      item.classList.toggle('proto3-avatar-selected');
      const circle = item.querySelector('.proto3-avatar-circle');
      const isSelected = item.classList.contains('proto3-avatar-selected');

      if (isSelected) {
        circle.style.boxShadow = `0 0 0 2px white, 0 0 0 4px ${color}`;
        circle.style.borderColor = color;
        addFriendLayers(friendId);
      } else {
        circle.style.boxShadow = '';
        circle.style.borderColor = '';
        removeFriendLayers(friendId);
      }
    });
  });

  // Also listen for zoomend after map init
  const checkMap = setInterval(() => {
    if (proto3Map) {
      proto3Map.on('zoomend', () => {
        Object.keys(friendLayers).forEach(updateFriendLayers);
      });
      clearInterval(checkMap);
    }
  }, 500);
})();

// =============================================
// Chat Input Streaming Placeholder (Prototype 3)
// =============================================
(function() {
  const el = document.getElementById('proto3ChatPlaceholder');
  if (!el) return;
  const text = 'Want to start planning your next adventure?';
  let i = 0;
  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 50);
    } else {
      // Pause then restart
      setTimeout(() => { i = 0; el.textContent = ''; setTimeout(type, 500); }, 3000);
    }
  }
  type();
})();

// =============================================
// Profile Carousel (Prototype 3)
// =============================================
(function() {
  const track = document.getElementById('proto3CarouselTrack');
  const dots = document.querySelectorAll('#proto3CarouselDots .proto3-dot');
  if (!track || !dots.length) return;

  let current = 0;
  const total = dots.length;
  let startX = 0, deltaX = 0, dragging = false;

  function getCardWidth() {
    const card = track.querySelector('.proto3-carousel-card');
    if (!card) return track.offsetWidth;
    return card.offsetWidth + 10; // card width + gap
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));
    const shift = current * getCardWidth();
    track.style.transform = `translateX(-${shift}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  track.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    deltaX = 0;
    track.style.transition = 'none';
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    deltaX = e.clientX - startX;
    const shift = current * getCardWidth();
    track.style.transform = `translateX(${-shift + deltaX}px)`;
  });
  track.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = 'transform 0.3s ease';
    if (deltaX < -40) goTo(current + 1);
    else if (deltaX > 40) goTo(current - 1);
    else goTo(current);
  });

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
})();

// =============================================
// Profile Globe (Prototype 3) — cobe.js
// =============================================
let proto3GlobeInstance = null;

function getGlobeMarkerColor() {
  // Read the current brand color from CSS custom property
  const style = getComputedStyle(document.documentElement);
  const brand = style.getPropertyValue('--brand').trim();
  // Convert hex to [r, g, b] normalized 0-1
  if (brand.startsWith('#')) {
    const hex = brand.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return [r, g, b];
  }
  return [0.42, 0, 0.96]; // fallback violet
}

function initProto3Globe() {
  const canvas = document.getElementById('proto3Globe');
  if (!canvas || typeof createGlobe === 'undefined') return;
  if (proto3GlobeInstance) { proto3GlobeInstance.destroy(); proto3GlobeInstance = null; }

  const markerColor = getGlobeMarkerColor();

  // Home (New York)
  const home = [40.7128, -74.006];

  // 12 cities the user has visited (lat, lng, size)
  const destinations = [
    [48.8566, 2.3522],      // Paris
    [35.6762, 139.6503],    // Tokyo
    [41.9028, 12.4964],     // Rome
    [51.5074, -0.1278],     // London
    [-33.8688, 151.2093],   // Sydney
    [37.5665, 126.978],     // Seoul
    [-22.9068, -43.1729],   // Rio
    [10.8231, 106.6297],    // Ho Chi Minh
    [-33.9249, 18.4241],    // Cape Town
    [-17.8252, 31.0335],    // Harare
    [13.0827, -59.6185],    // Barbados
    [25.2048, 55.2708],     // Dubai
  ];

  const markers = [
    { location: home, size: 0.08 },  // Home — NY (larger)
    ...destinations.map(d => ({ location: d, size: 0.05 }))
  ];

  let phi = 0;
  let theta = 0.2;
  let pointerDown = false;
  let pointerX = 0;
  let pointerY = 0;
  let pointerDeltaX = 0;
  let pointerDeltaY = 0;

  // Determine globe bg based on current theme background
  const bgStyle = getComputedStyle(document.documentElement);
  const bgColor = bgStyle.getPropertyValue('--bg-secondary').trim();
  let glowColor, baseColor;
  const isDark = bgColor === '#1A1614' || bgColor === '#121212' || bgColor.startsWith('#1') || bgColor.startsWith('#0');
  if (isDark) {
    glowColor = [0.1, 0.1, 0.1];
    baseColor = [0.2, 0.2, 0.2];
  } else {
    glowColor = [1, 1, 1];
    baseColor = [0.95, 0.95, 0.95];
  }

  // Overlay canvas for arcs and home emoji
  const overlay = document.getElementById('proto3GlobeOverlay');
  const overlayCtx = overlay ? overlay.getContext('2d') : null;
  if (overlay) {
    overlay.width = 408 * 2;
    overlay.height = 408 * 2;
  }

  // Project lat/lng to 2D screen coords on the globe
  // Uses cobe's exact projection: camera on Z axis, phi=longitude rotation, theta=tilt
  // All coordinates in retina canvas space (680x680 for 340px CSS)
  // Overlay canvas is 816x816 (2x retina of 408px CSS)
  const CENTER = 408; // center of 816x816 canvas
  const R = 396;      // globe radius in canvas pixels

  function project(lat, lng, currentPhi, currentTheta) {
    const latR = (lat * Math.PI) / 180;
    const lngR = (lng * Math.PI) / 180;

    // Cobe's projection formula
    const x = Math.cos(latR) * Math.sin(lngR - currentPhi);
    const y = Math.sin(latR) * Math.cos(currentTheta) - Math.cos(latR) * Math.sin(currentTheta) * Math.cos(lngR - currentPhi);
    const z = Math.sin(latR) * Math.sin(currentTheta) + Math.cos(latR) * Math.cos(currentTheta) * Math.cos(lngR - currentPhi);

    if (z < 0) return null; // behind globe

    return {
      x: CENTER + x * R,
      y: CENTER - y * R,
      z: z
    };
  }

  // Animation progress for each arc (staggered)
  let arcTime = 0;
  const arcDuration = 180; // frames per full arc cycle
  const arcStagger = 25;   // frames between each arc start
  const brandHex = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();

  proto3GlobeInstance = createGlobe(canvas, {
    devicePixelRatio: 2,
    width: 408 * 2,
    height: 408 * 2,
    phi: 0.3,
    theta: 0.2,
    dark: isDark ? 1 : 0,
    diffuse: 1.2,
    mapSamples: 20000,
    mapBrightness: isDark ? 3 : 6,
    baseColor: baseColor,
    markerColor: markerColor,
    glowColor: glowColor,
    markers: markers,
    onRender: (state) => {
      if (!pointerDown) {
        phi += 0.003;
      }
      phi += pointerDeltaX;
      theta += pointerDeltaY;
      theta = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, theta));
      pointerDeltaX *= 0.95;
      pointerDeltaY *= 0.95;
      state.phi = phi;
      state.theta = theta;

      // Draw overlay: arcs + home emoji
      if (!overlayCtx) return;
      overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
      arcTime++;

      const homeProj = project(home[0], home[1], phi, theta);

      // Draw arcs from home to each destination
      destinations.forEach((dest, i) => {
        const destProj = project(dest[0], dest[1], phi, theta);
        if (!homeProj || !destProj) return;
        if (homeProj.z < 0 && destProj.z < 0) return;

        // Arc progress (staggered, looping)
        const offset = i * arcStagger;
        const t = ((arcTime - offset) % (arcDuration + 60)) / arcDuration;
        if (t < 0 || t > 1.3) return;
        const progress = Math.min(t, 1);

        // Compute intermediate points along a great circle (simplified as quadratic bezier)
        const midX = (homeProj.x + destProj.x) / 2;
        const midY = (homeProj.y + destProj.y) / 2;
        const dist = Math.sqrt(Math.pow(destProj.x - homeProj.x, 2) + Math.pow(destProj.y - homeProj.y, 2));
        const bulge = Math.min(dist * 0.3, 120);
        // Perpendicular offset for arc curve
        const dx = destProj.x - homeProj.x;
        const dy = destProj.y - homeProj.y;
        const nx = -dy / (dist || 1);
        const ny = dx / (dist || 1);
        const cpX = midX + nx * bulge;
        const cpY = midY + ny * bulge;

        // Draw the arc up to current progress
        overlayCtx.beginPath();
        overlayCtx.moveTo(homeProj.x, homeProj.y);

        const steps = 30;
        const drawSteps = Math.floor(steps * progress);
        for (let s = 1; s <= drawSteps; s++) {
          const st = s / steps;
          const px = (1 - st) * (1 - st) * homeProj.x + 2 * (1 - st) * st * cpX + st * st * destProj.x;
          const py = (1 - st) * (1 - st) * homeProj.y + 2 * (1 - st) * st * cpY + st * st * destProj.y;
          overlayCtx.lineTo(px, py);
        }

        // Brand color with fade
        const alpha = progress < 0.8 ? 0.7 : 0.7 * (1 - (progress - 0.8) / 0.2);
        overlayCtx.strokeStyle = brandHex;
        overlayCtx.globalAlpha = Math.max(0, alpha);
        overlayCtx.lineWidth = 2;
        overlayCtx.setLineDash([6, 4]);
        overlayCtx.stroke();
        overlayCtx.setLineDash([]);
        overlayCtx.globalAlpha = 1;

        // Draw moving dot at the head of the arc
        if (progress > 0 && progress < 1) {
          const ht = progress;
          const hx = (1 - ht) * (1 - ht) * homeProj.x + 2 * (1 - ht) * ht * cpX + ht * ht * destProj.x;
          const hy = (1 - ht) * (1 - ht) * homeProj.y + 2 * (1 - ht) * ht * cpY + ht * ht * destProj.y;
          overlayCtx.beginPath();
          overlayCtx.arc(hx, hy, 5, 0, Math.PI * 2);
          overlayCtx.fillStyle = brandHex;
          overlayCtx.fill();
        }
      });

    },
  });

  // Pointer interaction for horizontal + vertical rotation
  let pointerStartX2 = 0, pointerStartY2 = 0;
  canvas.addEventListener('pointerdown', (e) => {
    pointerDown = true;
    pointerX = e.clientX;
    pointerY = e.clientY;
    pointerStartX2 = e.clientX;
    pointerStartY2 = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (pointerDown) {
      const dx = e.clientX - pointerX;
      const dy = e.clientY - pointerY;
      pointerX = e.clientX;
      pointerY = e.clientY;
      pointerDeltaX = dx / 200;
      pointerDeltaY = dy / 200;
    }
  });
  canvas.addEventListener('pointerup', (e) => {
    pointerDown = false;
    canvas.releasePointerCapture(e.pointerId);

    // Detect click (not drag) — navigate to map
    const dist = Math.sqrt(Math.pow(e.clientX - pointerStartX2, 2) + Math.pow(e.clientY - pointerStartY2, 2));
    if (dist < 5) {
      // Determine which region is facing the viewer based on phi
      // phi is longitude in radians, convert to degrees
      // The front of the globe faces -phi direction (cobe convention)
      const lng = -(phi % (2 * Math.PI)) * (180 / Math.PI);
      const lat = theta * (180 / Math.PI);

      // Determine map center based on visible region
      let mapCenter, mapZoom;
      const normLng = ((lng % 360) + 360) % 360;
      if (normLng > 330 || normLng < 30) { mapCenter = [48, 2]; mapZoom = 5; }       // Europe/Africa
      else if (normLng >= 30 && normLng < 90) { mapCenter = [25, 60]; mapZoom = 4; }  // Middle East/India
      else if (normLng >= 90 && normLng < 150) { mapCenter = [35, 120]; mapZoom = 4; } // East Asia
      else if (normLng >= 150 && normLng < 210) { mapCenter = [-20, 150]; mapZoom = 4; } // Oceania
      else if (normLng >= 210 && normLng < 270) { mapCenter = [20, -100]; mapZoom = 4; } // Americas
      else { mapCenter = [40, -40]; mapZoom = 3; } // Atlantic

      // Switch to map tab
      const p3 = document.getElementById('prototype-3');
      const phone = p3.querySelector('.proto-phone');
      const mapTab = phone.querySelector('.proto-tab[data-tab="map"]');
      if (mapTab) mapTab.click();

      // Pan map to region
      setTimeout(() => {
        if (!proto3Map) initProto3Map();
        setTimeout(() => {
          if (proto3Map) {
            proto3Map.invalidateSize();
            proto3Map.setView(mapCenter, mapZoom, { animate: true });
          }
        }, 200);
      }, 150);
    }
  });
}

// Init globe when profile tab is shown (deferred)
// Hooked into tab switching below

// =============================================
// Icon search filter
// =============================================
const iconSearch = document.getElementById('iconSearch');
const iconGrid = document.getElementById('iconGrid');
const iconCount = document.getElementById('iconCount');

if (iconSearch && iconGrid) {
  const allIcons = iconGrid.querySelectorAll('.icon-item');
  iconSearch.addEventListener('input', () => {
    const query = iconSearch.value.toLowerCase().trim();
    let visible = 0;
    allIcons.forEach((item) => {
      const name = item.getAttribute('data-icon') || '';
      const match = !query || name.includes(query);
      item.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    iconCount.textContent = `${visible} icon${visible !== 1 ? 's' : ''}`;
  });
}

// =============================================
// PROTOTYPE 2 — Onboarding Flow
// =============================================
(function () {
  const container = document.getElementById('obSlideContainer');
  if (!container) return;

  let currentStep = 0;
  const totalSteps = 7;
  const travelerData = {
    budget: null,
    activities: [],
    weather: null,
    social: null,
    doc: null,
  };

  const progressBar = document.getElementById('obProgressBar');
  const progressFill = document.getElementById('obProgressFill');
  const backBtn = document.getElementById('obBackBtn');
  const activityContinue = document.getElementById('obActivityContinue');

  function getAllPages() {
    return container.querySelectorAll('.ob-page');
  }

  function goToStep(step, direction) {
    if (step < 0 || step > totalSteps) return;
    const pages = getAllPages();
    const currentPage = pages[currentStep];
    const nextPage = pages[step];

    // Animate out current
    if (direction > 0) {
      currentPage.classList.add('exit-left');
    } else {
      currentPage.classList.add('enter-right');
    }
    currentPage.classList.remove('active');

    // Prepare incoming page
    if (direction > 0) {
      nextPage.classList.add('enter-right');
    } else {
      nextPage.classList.add('exit-left');
    }

    // Force reflow
    void nextPage.offsetWidth;

    // Animate in
    nextPage.classList.remove('exit-left', 'enter-right');
    nextPage.classList.add('active');

    currentStep = step;

    // Update progress bar
    if (currentStep === 0 || currentStep === 7) {
      progressBar.style.display = 'none';
    } else {
      progressBar.style.display = 'flex';
      progressFill.style.width = `${(Math.min(currentStep, 6) / 6) * 100}%`;
    }

    // On final page, compute persona
    if (currentStep === 6) {
      computePersona();
    }
  }

  // Back button
  backBtn.addEventListener('click', () => {
    if (currentStep > 0) goToStep(currentStep - 1, -1);
  });

  // Page 0: Start Quest
  document.getElementById('obStartBtn').addEventListener('click', () => {
    goToStep(1, 1);
  });

  // Page 1: Budget cards — auto-advance
  container.querySelectorAll('[data-ob-budget]').forEach((card) => {
    card.addEventListener('click', () => {
      container.querySelectorAll('[data-ob-budget]').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      travelerData.budget = parseInt(card.getAttribute('data-ob-budget'));
      setTimeout(() => goToStep(2, 1), 350);
    });
  });

  // Page 2: Activity chips — multi-select (up to 3)
  container.querySelectorAll('[data-ob-activity]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-ob-activity');
      if (chip.classList.contains('selected')) {
        chip.classList.remove('selected');
        travelerData.activities = travelerData.activities.filter((a) => a !== val);
      } else if (travelerData.activities.length < 3) {
        chip.classList.add('selected');
        travelerData.activities.push(val);
      }
      activityContinue.disabled = travelerData.activities.length === 0;
    });
  });

  activityContinue.addEventListener('click', () => {
    if (travelerData.activities.length > 0) goToStep(3, 1);
  });

  // Page 3: Weather cards — auto-advance
  container.querySelectorAll('[data-ob-weather]').forEach((card) => {
    card.addEventListener('click', () => {
      container.querySelectorAll('[data-ob-weather]').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      travelerData.weather = card.getAttribute('data-ob-weather');
      setTimeout(() => goToStep(4, 1), 350);
    });
  });

  // Page 4: Social — auto-advance
  container.querySelectorAll('[data-ob-social]').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-ob-social]').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      travelerData.social = btn.getAttribute('data-ob-social');
      setTimeout(() => goToStep(5, 1), 350);
    });
  });

  // Page 5: Documentation — auto-advance
  container.querySelectorAll('[data-ob-doc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-ob-doc]').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      travelerData.doc = btn.getAttribute('data-ob-doc');
      setTimeout(() => goToStep(6, 1), 350);
    });
  });

  // Page 6: Compute Persona
  let currentPersona = '';

  function computePersona() {
    let persona = 'The Wandering Spirit';

    if (travelerData.budget === 1 && travelerData.social === 'The Hidden Path') {
      persona = 'The Nomadic Sage';
    } else if (travelerData.doc === 'The Chronicler' && travelerData.budget === 3) {
      persona = 'The Aesthete Architect';
    } else if (travelerData.activities.includes('Wanderer') && travelerData.weather === 'Frost') {
      persona = 'The Tundra Stalker';
    } else if (travelerData.activities.includes('Bard') && travelerData.social === 'The Grand Plaza') {
      persona = 'The Festival Herald';
    } else if (travelerData.activities.includes('Scholar') && travelerData.weather === 'Mist') {
      persona = 'The Fog Librarian';
    } else if (travelerData.activities.includes('Alchemist') && travelerData.weather === 'Sun') {
      persona = 'The Spice Cartographer';
    } else if (travelerData.activities.includes('Monk') && travelerData.social === 'The Hidden Path') {
      persona = 'The Silent Pilgrim';
    } else if (travelerData.activities.includes('Ranger') && travelerData.weather === 'Storm') {
      persona = 'The Tempest Rider';
    } else if (travelerData.activities.includes('Artisan') && travelerData.social === 'The Campfire') {
      persona = 'The Ember Artisan';
    } else if (travelerData.doc === 'The Cartographer' && travelerData.activities.includes('Wanderer')) {
      persona = 'The Horizon Mapper';
    } else if (travelerData.budget === 4) {
      persona = 'The Chaos Navigator';
    } else if (travelerData.budget === 3 && travelerData.weather === 'Sun') {
      persona = 'The Golden Voyager';
    } else if (travelerData.budget === 2) {
      persona = 'The Balanced Pathfinder';
    }

    currentPersona = persona;
    const budgetNames = { 1: 'The Scout', 2: 'The Merchant', 3: 'The Royalty', 4: 'The Wildcard' };

    document.getElementById('obPersonaTitle').textContent = persona;
    document.getElementById('obSheetBudget').textContent = budgetNames[travelerData.budget] || '—';
    document.getElementById('obSheetSkills').textContent = travelerData.activities.join(', ') || '—';
    document.getElementById('obSheetWeather').textContent = travelerData.weather || '—';
    document.getElementById('obSheetSocial').textContent = travelerData.social || '—';
    document.getElementById('obSheetDoc').textContent = travelerData.doc || '—';

    // Determine recommended path based on persona/weather
    let recommended = 'fire';
    const w = travelerData.weather;
    if (w === 'Sun' || w === 'Storm') recommended = 'fire';
    else if (w === 'Mist') recommended = 'water';
    else if (w === 'Frost') recommended = 'air';
    if (travelerData.activities.includes('Ranger') || travelerData.activities.includes('Wanderer')) {
      recommended = 'earth';
    }
    if (travelerData.activities.includes('Monk') || travelerData.social === 'The Hidden Path') {
      recommended = 'air';
    }

    // Show recommended badge on the right card
    ['fire', 'water', 'air', 'earth'].forEach((el) => {
      const badge = document.getElementById('obPathBadge' + el.charAt(0).toUpperCase() + el.slice(1));
      const card = container.querySelector('[data-ob-path="' + el + '"]');
      if (badge) badge.style.display = el === recommended ? 'inline-block' : 'none';
      if (card) {
        card.classList.toggle('ob-path--primary', el === recommended);
        card.classList.remove('selected');
      }
    });
  }

  // Path card selection → go to destination page
  const pathDestinations = {
    fire: {
      icon: '🔥',
      label: 'Path of Fire',
      bg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=900&fit=crop',
      destinations: {
        'The Nomadic Sage': { title: 'Volcanic Springs of Kyushu', desc: 'Ancient hot springs nestled in active volcanic terrain — where your sage wisdom meets the raw power of molten earth.', traits: ['Onsen trails', 'Fire festivals', 'Solo retreats'] },
        'The Festival Herald': { title: 'Las Fallas of Valencia', desc: 'A city consumed by fire art and celebration — towering sculptures blaze as crowds ignite in collective wonder.', traits: ['Fire sculptures', 'Street parades', 'Night spectacles'] },
        'The Tempest Rider': { title: 'Kilauea Lava Fields', desc: 'Walk where the earth still breathes fire — molten rivers carving new land beneath storm-darkened skies.', traits: ['Lava hikes', 'Helicopter tours', 'Raw terrain'] },
        default: { title: 'Cappadocia at Dawn', desc: 'Float above fairy chimneys as sunrise paints the sky in flame — a fiery dreamscape from above.', traits: ['Hot air balloons', 'Cave dwellings', 'Sunrise rituals'] }
      }
    },
    water: {
      icon: '🌊',
      label: 'Path of Water',
      bg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=900&fit=crop',
      destinations: {
        'The Fog Librarian': { title: 'Misty Fjords of Norway', desc: 'Where fog-draped cliffs meet ancient waters — the perfect library of nature, written in stone and tide.', traits: ['Fjord kayaking', 'Quiet harbors', 'Northern mist'] },
        'The Spice Cartographer': { title: 'Kerala Backwaters', desc: 'Drift through emerald waterways lined with spice gardens — mapping flavors along winding tropical canals.', traits: ['Houseboat stays', 'Spice markets', 'Canal routes'] },
        'The Balanced Pathfinder': { title: 'Plitvice Lakes', desc: 'Turquoise cascades flowing through terraced pools — balanced, layered, endlessly flowing.', traits: ['Waterfall trails', 'Boardwalk paths', 'Crystal lakes'] },
        default: { title: 'Ha Long Bay by Sail', desc: 'Limestone karsts rising from emerald waters — a floating world of hidden caves and silent horizons.', traits: ['Junk boat cruises', 'Cave swimming', 'Floating villages'] }
      }
    },
    air: {
      icon: '🌬️',
      label: 'Path of Air',
      bg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=900&fit=crop',
      destinations: {
        'The Silent Pilgrim': { title: 'Monastery Peaks of Bhutan', desc: 'Perched at the edge of sky, ancient monasteries whisper through thin mountain air — silence as a destination.', traits: ['Tiger\'s Nest', 'Mountain passes', 'Prayer flags'] },
        'The Tundra Stalker': { title: 'Patagonia Wind Corridors', desc: 'Where glacial winds sculpt the edge of the world — vast open skies and untamed southern air.', traits: ['Torres del Paine', 'Glacier treks', 'Wind camps'] },
        'The Horizon Mapper': { title: 'Swiss Alpine Ridgelines', desc: 'Chart your path along the spine of Europe — crisp air, panoramic views, and trails above the clouds.', traits: ['Ridge walks', 'Cable cars', 'Summit maps'] },
        default: { title: 'Highlands of Iceland', desc: 'Raw volcanic highlands where wind rules the land — vast emptiness under the widest skies on Earth.', traits: ['Highland drives', 'Geothermal vents', 'Arctic winds'] }
      }
    },
    earth: {
      icon: '🌿',
      label: 'Path of Earth',
      bg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=900&fit=crop',
      destinations: {
        'The Ember Artisan': { title: 'Pottery Villages of Oaxaca', desc: 'Earth shaped by hand and fire — clay traditions passed down through generations in sun-baked workshops.', traits: ['Clay workshops', 'Mezcal fields', 'Folk art'] },
        'The Chaos Navigator': { title: 'Amazon Rainforest Canopy', desc: 'Plunge into untamed green chaos — where every vine leads somewhere and nothing follows a map.', traits: ['Canopy walks', 'River expeditions', 'Wildlife chaos'] },
        'The Golden Voyager': { title: 'Tuscan Countryside', desc: 'Rolling golden hills, ancient olive groves, and vineyard-covered earth — luxury rooted in the land.', traits: ['Wine estates', 'Truffle hunts', 'Villa stays'] },
        default: { title: 'Sacred Valley of Peru', desc: 'Terraced mountains where ancient civilizations built in harmony with the earth — grounded, powerful, timeless.', traits: ['Inca ruins', 'Terraced farms', 'Mountain markets'] }
      }
    }
  };

  container.querySelectorAll('[data-ob-path]').forEach((card) => {
    card.addEventListener('click', () => {
      container.querySelectorAll('[data-ob-path]').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      const path = card.getAttribute('data-ob-path');

      // Build destination page
      const pathData = pathDestinations[path];
      const dest = pathData.destinations[currentPersona] || pathData.destinations.default;

      document.getElementById('obDestBg').style.backgroundImage = "url('" + pathData.bg + "')";
      document.getElementById('obDestIcon').textContent = pathData.icon;
      document.getElementById('obDestLabel').textContent = pathData.label + ' × ' + currentPersona;
      document.getElementById('obDestTitle').textContent = dest.title;
      document.getElementById('obDestDesc').textContent = dest.desc;
      document.getElementById('obDestTrait1').textContent = dest.traits[0];
      document.getElementById('obDestTrait2').textContent = dest.traits[1];
      document.getElementById('obDestTrait3').textContent = dest.traits[2];

      setTimeout(() => goToStep(7, 1), 400);
    });
  });

  // Enter the World — reset onboarding
  document.getElementById('obEnterBtn').addEventListener('click', () => {
    // Reset all state
    travelerData.budget = null;
    travelerData.activities = [];
    travelerData.weather = null;
    travelerData.social = null;
    travelerData.doc = null;

    // Reset all selections
    container.querySelectorAll('.selected').forEach((el) => el.classList.remove('selected'));
    activityContinue.disabled = true;

    // Reset path badges
    ['Fire', 'Water', 'Air', 'Earth'].forEach((el) => {
      const badge = document.getElementById('obPathBadge' + el);
      if (badge) badge.style.display = 'none';
    });

    // Reset all pages
    const pages = getAllPages();
    pages.forEach((p) => p.classList.remove('active', 'exit-left', 'enter-right'));
    pages[0].classList.add('active');

    currentStep = 0;
    progressBar.style.display = 'none';
    progressFill.style.width = '0%';
  });
})();

// =============================================
// PROTOTYPE 4 — Travel DNA Page-by-Page Quiz
// =============================================
let p4Initialized = false;
function initProto4Quiz() {
  if (p4Initialized) return;
  p4Initialized = true;
  _initP4Quiz('p4App', 'p4SlideContainer', 'p4ProgressBar', 'p4ProgressFill', 'p4StepLabel', 'p4BackBtn');
}

let p4bInitialized = false;
function initProto4bQuiz() {
  if (p4bInitialized) return;
  p4bInitialized = true;
  _initP4Quiz('p4bApp', 'p4bSlideContainer', 'p4bProgressBar', 'p4bProgressFill', 'p4bStepLabel', 'p4bBackBtn', true);
}

function _initP4Quiz(appId, containerId, progressBarId, progressFillId, stepLabelId, backBtnId, isOnboarding) {
  const app = document.getElementById(appId);
  if (!app) return;

  const container = document.getElementById(containerId);
  const progressBar = document.getElementById(progressBarId);
  const progressFill = document.getElementById(progressFillId);
  const stepLabel = document.getElementById(stepLabelId);
  const backBtn = document.getElementById(backBtnId);

  let currentPage = 0;
  const answers = {};
  let analysisAutoTimer = null;

  // DNA category explanations (used in onboarding result)
  const dnaExplanations = {
    cost: {
      'The Backpacker': 'You maximize experiences on minimal budget — every penny is an adventure.',
      'The Luxury Strategist': 'You invest in premium comfort because the experience is worth it.',
      'The Experience Investor': 'You spend where it creates lasting, irreplaceable memories.',
      'The Foodie Optimizer': 'You save smartly so you can splurge on culinary treasures.',
      'The Smart Spender': 'You balance value with quality — knowing when to save and splurge.',
      'The Comfort Seeker': 'You spend freely for ease and enjoyment without stress.',
      'Balanced Traveler': 'You adapt your spending naturally to each unique journey.',
    },
    activity: {
      'The Thrill Seeker': 'You chase adrenaline and peak moments that push your limits.',
      'The Taste & Tale Collector': 'You travel through flavors and stories — every meal is a destination.',
      'The Culture Deep-Diver': 'You seek understanding through art, history, and local traditions.',
      'The Scenic Drifter': 'You\'re drawn to beauty and stillness — views over itineraries.',
      'The Zen Seeker': 'You travel to decompress, recharge, and find inner peace.',
      'The Curious Wanderer': 'You\'re open to everything — each day brings its own discovery.',
    },
    social: {
      'The Lone Wolf': 'You thrive in solitude — your best travel companion is yourself.',
      'The Solo Socialite': 'You travel alone but connect deeply with everyone you meet.',
      'The Independent': 'You value freedom and self-reliance on every journey.',
      'The Squad Leader': 'You light up in groups — the more people, the more memories.',
      'The Inner Circle': 'You travel best with your closest people — quality over quantity.',
      'The Duo Traveler': 'You share every sunset and wrong turn with your person.',
      'The Adaptive Social': 'You flex between solo time and social energy effortlessly.',
    },
    weather: {
      'The Sun Worshipper': 'Sunshine is non-negotiable — you plan life around clear skies.',
      'The Heat Seeker': 'You come alive in warmth — tropical destinations call to you.',
      'The Cold Adventurer': 'You find beauty in frost and crisp air — winter is your season.',
      'The Storm Chaser': 'You see romance in rain and drama in moody skies.',
      'The All-Weather Explorer': 'Weather doesn\'t faze you — the destination matters most.',
      'The Comfort Zone': 'You prefer mild, predictable weather so you can focus on the trip.',
      'All-Weather Traveler': 'You\'re adaptable — the destination matters more than the forecast.',
    },
    crowd: {
      'The Off-Grid Explorer': 'You seek untouched places — the road less traveled is your highway.',
      'The Hidden Gem Hunter': 'You find the sweet spot between accessible and undiscovered.',
      'The Strategic Tourist': 'You visit popular spots but time it perfectly to avoid crowds.',
      'The Energy Seeker': 'You feed off crowd energy — busy streets and packed venues excite you.',
      'The Flexible Tourist': 'You adapt to any environment — crowded or quiet, you make it work.',
    },
    pace: {
      'The Free Spirit': 'You let the trip unfold organically — no plans, no pressure, pure flow.',
      'The Hyper-Optimizer': 'You maximize every hour — your itineraries are works of art.',
      'The Maximizer': 'You want to see and do everything — FOMO fuels your energy.',
      'The Slow Traveler': 'You savor destinations deeply rather than rushing through a checklist.',
      'The Balanced Navigator': 'You blend structure with spontaneity — planned yet flexible.',
      'The Balanced Pacer': 'You move at a natural rhythm, neither rushing nor dawdling.',
      'The Flexible Traveler': 'You adjust your pace to match the vibe of each destination.',
    },
  };

  // Question data: 12 questions in 4 turns of 3
  const turns = [
    {
      intro: null, // first turn has the big intro
      questions: [
        {
          id: 'q1',
          bucket: 'Weather',
          text: 'What was the weather like on your favorite trip — and did it make it better?',
          options: [
            { emoji: '☀️', text: 'Hot & sunny — I came alive', value: 'Sun Chaser' },
            { emoji: '🌧️', text: 'Rainy or overcast — moody and perfect', value: 'Storm Romantic' },
            { emoji: '❄️', text: 'Cold & crisp — invigorating', value: 'Frost Seeker' },
            { emoji: '🌤️', text: 'Mild & pleasant — just comfortable', value: 'Temperate' },
          ],
        },
        {
          id: 'q2',
          bucket: 'Social',
          text: 'Who were you traveling with?',
          options: [
            { emoji: '🧍', text: 'Solo — my favorite companion is me', value: 'Solo Explorer' },
            { emoji: '💑', text: 'A partner — it was our thing', value: 'Duo Traveler' },
            { emoji: '👫', text: 'A small group of close friends', value: 'Inner Circle' },
            { emoji: '🎉', text: 'A big crew — the more the merrier', value: 'Pack Traveler' },
          ],
        },
        {
          id: 'q3',
          bucket: 'Cost',
          text: 'How did you handle money on that trip?',
          options: [
            { emoji: '🎒', text: 'Scraped by on a tight budget — worth every penny', value: 'Budget Hacker' },
            { emoji: '⚖️', text: 'Spent smart — saved on some things, splurged on others', value: 'Strategic Spender' },
            { emoji: '💳', text: 'Didn\'t track much — just enjoyed it', value: 'Comfort Buyer' },
            { emoji: '👑', text: 'Went all-out — that\'s what trips are for', value: 'Luxury Investor' },
          ],
        },
      ],
      analysis: function (a) {
        const w = a.q1 || ''; const s = a.q2 || ''; const c = a.q3 || '';
        if (s === 'Solo Explorer') return 'You\'re drawn to self-reliance. A ' + w.toLowerCase() + ' who travels solo with a ' + c.toLowerCase() + ' approach — that signals deep intentionality. Your trips are about inner discovery.';
        if (c === 'Luxury Investor') return 'You believe travel is an investment in experience. As a ' + s.toLowerCase() + ' with ' + w.toLowerCase() + ' preferences, you don\'t cut corners on what matters.';
        return 'Interesting combo: ' + w.toLowerCase() + ' vibes, ' + s.toLowerCase() + ' energy, and ' + c.toLowerCase() + ' instincts. You know what you want and you build trips around feeling, not checklists.';
      },
    },
    {
      questions: [
        {
          id: 'q4',
          bucket: 'Crowd',
          text: 'Think about the places you visited — how crowded were they?',
          options: [
            { emoji: '🏔️', text: 'Remote and empty — off the beaten path', value: 'Ghost Town' },
            { emoji: '🌿', text: 'Quiet but accessible — a hidden gem', value: 'Hidden Gem' },
            { emoji: '🏛️', text: 'Popular spots, but I timed it right', value: 'Smart Tourist' },
            { emoji: '🎪', text: 'Packed and electric — I love the buzz', value: 'Crowd Rider' },
          ],
        },
        {
          id: 'q5',
          bucket: 'Pace',
          text: 'What was the rhythm of your days like?',
          options: [
            { emoji: '🐌', text: 'Slow and unhurried — no alarms', value: 'Slow Burner' },
            { emoji: '🎯', text: 'Balanced — some plans, some wandering', value: 'Hybrid Pace' },
            { emoji: '🏃', text: 'Packed — I wanted to see everything', value: 'Sprint Mode' },
            { emoji: '🎲', text: 'Totally spontaneous — no itinerary', value: 'Chaos Flow' },
          ],
        },
        {
          id: 'q6',
          bucket: 'Activity',
          text: 'What was the #1 thing you spent your time doing?',
          options: [
            { emoji: '🍝', text: 'Eating and drinking — the local food scene', value: 'Gastro Explorer' },
            { emoji: '🏛️', text: 'Culture — museums, history, architecture', value: 'Culture Scholar' },
            { emoji: '🏄', text: 'Adventure — hiking, diving, adrenaline', value: 'Adrenaline Seeker' },
            { emoji: '🧘', text: 'Relaxation — beaches, spas, doing nothing', value: 'Zen Wanderer' },
          ],
        },
      ],
      analysis: function (a) {
        const cr = a.q4 || ''; const p = a.q5 || ''; const ac = a.q6 || '';
        if (p === 'Chaos Flow') return 'A ' + ac.toLowerCase() + ' who lives in chaos flow at ' + cr.toLowerCase() + ' spots? You don\'t plan trips — you let them happen to you. That\'s a rare and beautiful travel instinct.';
        if (ac === 'Adrenaline Seeker') return 'The adrenaline-seeker emerges! Combined with your ' + p.toLowerCase() + ' pace and preference for ' + cr.toLowerCase() + ' spots, you\'re chasing peak experiences — literally.';
        return 'A ' + ac.toLowerCase() + ' who moves at ' + p.toLowerCase() + ' pace through ' + cr.toLowerCase() + ' places. You\'ve found your sweet spot between stimulation and comfort.';
      },
    },
    {
      questions: [
        {
          id: 'q7',
          bucket: 'Social',
          text: 'How did you interact with locals on that trip?',
          options: [
            { emoji: '👋', text: 'Deep conversations — I made real connections', value: 'Connector' },
            { emoji: '😊', text: 'Friendly but surface-level — nice encounters', value: 'Friendly Observer' },
            { emoji: '👀', text: 'I observed more than I interacted', value: 'Quiet Observer' },
            { emoji: '🗣️', text: 'I sought out local guides & experiences', value: 'Guided Explorer' },
          ],
        },
        {
          id: 'q8',
          bucket: 'Cost',
          text: 'What did you splurge on most?',
          options: [
            { emoji: '🏨', text: 'Accommodation — where I sleep matters', value: 'Nester' },
            { emoji: '🍽️', text: 'Food & drink — the best meals are non-negotiable', value: 'Epicurean' },
            { emoji: '🎟️', text: 'Experiences — tours, activities, tickets', value: 'Experience Collector' },
            { emoji: '✈️', text: 'Transport — comfort in getting there', value: 'Transit Optimizer' },
          ],
        },
        {
          id: 'q9',
          bucket: 'Pace',
          text: 'Did the trip go according to plan?',
          options: [
            { emoji: '📋', text: 'Mostly yes — I like having a plan', value: 'Planner' },
            { emoji: '🔀', text: 'The best moments were unplanned', value: 'Serendipity Lover' },
            { emoji: '🤷', text: 'There was no plan to begin with', value: 'Free Spirit' },
            { emoji: '📝', text: 'I had a loose framework that I adjusted daily', value: 'Adaptive Planner' },
          ],
        },
      ],
      analysis: function (a) {
        const soc = a.q7 || ''; const cost = a.q8 || ''; const pace = a.q9 || '';
        if (soc === 'Connector' && cost === 'Epicurean') return 'You connect through food! A ' + soc.toLowerCase() + ' who splurges on dining and takes a ' + pace.toLowerCase() + ' approach — you build memories around shared tables and real conversation.';
        if (pace === 'Free Spirit') return 'No plan, no problem. As a ' + soc.toLowerCase() + ' who invests most in ' + cost.toLowerCase() + ' experiences, you trust the journey to reveal itself. That takes confidence.';
        return 'Your interaction style as a ' + soc.toLowerCase() + ', combined with splurging on ' + cost.toLowerCase() + ' priorities and being a ' + pace.toLowerCase() + ' — it paints a traveler who knows their non-negotiables.';
      },
    },
    {
      questions: [
        {
          id: 'q10',
          bucket: 'Activity',
          text: 'What moment from that trip do you keep replaying in your mind?',
          options: [
            { emoji: '🌅', text: 'A breathtaking view or natural wonder', value: 'Vista Collector' },
            { emoji: '🤝', text: 'A human connection — a conversation, a kindness', value: 'Story Gatherer' },
            { emoji: '🎭', text: 'A cultural experience — a festival, ritual, performance', value: 'Culture Seeker' },
            { emoji: '⚡', text: 'An adrenaline rush — something that scared and thrilled me', value: 'Thrill Chaser' },
          ],
        },
        {
          id: 'q11',
          bucket: 'Weather',
          text: 'Could you handle two weeks of rain if the destination was perfect?',
          options: [
            { emoji: '☔', text: 'Absolutely — weather is just ambiance', value: 'Weather Agnostic' },
            { emoji: '🌂', text: 'I\'d manage — but I\'d prefer not to', value: 'Weather Flexible' },
            { emoji: '🚫', text: 'No way — weather is a dealbreaker for me', value: 'Weather Dependent' },
            { emoji: '🌈', text: 'Only if there were cozy indoor experiences too', value: 'Comfort Contingent' },
          ],
        },
        {
          id: 'q12',
          bucket: 'Philosophy',
          text: 'Finally — what\'s travel really about for you?',
          options: [
            { emoji: '🔍', text: 'Discovering the unknown — places, people, myself', value: 'The Explorer' },
            { emoji: '🔋', text: 'Recharging — escaping the routine', value: 'The Escapist' },
            { emoji: '📖', text: 'Collecting stories and perspectives', value: 'The Storyteller' },
            { emoji: '🌍', text: 'Understanding the world — every trip teaches me', value: 'The Student' },
          ],
        },
      ],
      analysis: null, // final turn goes straight to DNA
    },
  ];

  // DNA computation
  function computeDNA() {
    // Cost Strategy
    const costVals = [answers.q3, answers.q8].filter(Boolean);
    let cost = 'Balanced Traveler';
    if (costVals.includes('Budget Hacker')) cost = 'The Backpacker';
    else if (costVals.includes('Luxury Investor') || costVals.includes('Nester')) cost = 'The Luxury Strategist';
    else if (costVals.includes('Experience Collector')) cost = 'The Experience Investor';
    else if (costVals.includes('Strategic Spender') && costVals.includes('Epicurean')) cost = 'The Foodie Optimizer';
    else if (costVals.includes('Strategic Spender')) cost = 'The Smart Spender';
    else if (costVals.includes('Comfort Buyer')) cost = 'The Comfort Seeker';

    // Activity
    const actVals = [answers.q6, answers.q10].filter(Boolean);
    let activity = 'The Curious Wanderer';
    if (actVals.includes('Adrenaline Seeker') || actVals.includes('Thrill Chaser')) activity = 'The Thrill Seeker';
    else if (actVals.includes('Gastro Explorer') || actVals.includes('Story Gatherer')) activity = 'The Taste & Tale Collector';
    else if (actVals.includes('Culture Scholar') || actVals.includes('Culture Seeker')) activity = 'The Culture Deep-Diver';
    else if (actVals.includes('Zen Wanderer') && actVals.includes('Vista Collector')) activity = 'The Scenic Drifter';
    else if (actVals.includes('Zen Wanderer')) activity = 'The Zen Seeker';

    // Social
    const socVals = [answers.q2, answers.q7].filter(Boolean);
    let social = 'The Adaptive Social';
    if (socVals.includes('Solo Explorer') && socVals.includes('Quiet Observer')) social = 'The Lone Wolf';
    else if (socVals.includes('Solo Explorer') && socVals.includes('Connector')) social = 'The Solo Socialite';
    else if (socVals.includes('Solo Explorer')) social = 'The Independent';
    else if (socVals.includes('Pack Traveler')) social = 'The Squad Leader';
    else if (socVals.includes('Inner Circle')) social = 'The Inner Circle';
    else if (socVals.includes('Duo Traveler')) social = 'The Duo Traveler';

    // Weather
    const weaVals = [answers.q1, answers.q11].filter(Boolean);
    let weather = 'All-Weather Traveler';
    if (weaVals.includes('Sun Chaser') && weaVals.includes('Weather Dependent')) weather = 'The Sun Worshipper';
    else if (weaVals.includes('Sun Chaser')) weather = 'The Heat Seeker';
    else if (weaVals.includes('Frost Seeker')) weather = 'The Cold Adventurer';
    else if (weaVals.includes('Storm Romantic')) weather = 'The Storm Chaser';
    else if (weaVals.includes('Weather Agnostic')) weather = 'The All-Weather Explorer';
    else if (weaVals.includes('Temperate') && weaVals.includes('Weather Flexible')) weather = 'The Comfort Zone';

    // Crowd
    let crowd = 'The Flexible Tourist';
    if (answers.q4 === 'Ghost Town') crowd = 'The Off-Grid Explorer';
    else if (answers.q4 === 'Hidden Gem') crowd = 'The Hidden Gem Hunter';
    else if (answers.q4 === 'Smart Tourist') crowd = 'The Strategic Tourist';
    else if (answers.q4 === 'Crowd Rider') crowd = 'The Energy Seeker';

    // Pace
    const paceVals = [answers.q5, answers.q9].filter(Boolean);
    let pace = 'The Flexible Traveler';
    if (paceVals.includes('Chaos Flow') || paceVals.includes('Free Spirit')) pace = 'The Free Spirit';
    else if (paceVals.includes('Sprint Mode') && paceVals.includes('Planner')) pace = 'The Hyper-Optimizer';
    else if (paceVals.includes('Sprint Mode')) pace = 'The Maximizer';
    else if (paceVals.includes('Slow Burner')) pace = 'The Slow Traveler';
    else if (paceVals.includes('Hybrid Pace') && paceVals.includes('Adaptive Planner')) pace = 'The Balanced Navigator';
    else if (paceVals.includes('Hybrid Pace')) pace = 'The Balanced Pacer';

    const philosophy = answers.q12 || 'The Explorer';

    return { cost, activity, social, weather, crowd, pace, philosophy };
  }

  function generateWelcome(dna) {
    const parts = [];
    parts.push('Welcome to Zenvoya, ' + dna.philosophy + '.');
    if (dna.social === 'The Lone Wolf' || dna.social === 'The Independent') {
      parts.push('You thrive in solitude, finding meaning in places most people walk right past.');
    } else if (dna.social === 'The Solo Socialite') {
      parts.push('You travel alone but connect deeply — every stranger is a story waiting to happen.');
    } else {
      parts.push('Your travel tribe is important to you, and you know how to share experiences without losing yourself.');
    }
    if (dna.pace === 'The Free Spirit' || dna.pace === 'The Slow Traveler') {
      parts.push('Your pace tells us you value depth over coverage — quality over quantity.');
    } else {
      parts.push('You know how to balance exploration with intention.');
    }
    parts.push('We\'ll use your Travel DNA to curate destinations, itineraries, and experiences that feel like they were made for you — because now, they are.');
    return parts.join(' ');
  }


  // Flatten all 12 questions
  const allQuestions = [];
  turns.forEach((turn) => {
    turn.questions.forEach((q) => allQuestions.push(q));
  });

  // Page map: intro, q0-q2, analysis0, q3-q5, analysis1, q6-q8, analysis2, q9-q11, result
  const pageOrder = [];
  if (isOnboarding) pageOrder.push({ type: 'welcome' });
  if (!isOnboarding) pageOrder.push({ type: 'intro' });
  for (let i = 0; i < 12; i++) {
    pageOrder.push({ type: 'question', qIndex: i });
    if (i === 2) pageOrder.push({ type: 'analysis', turnIndex: 0 });
    if (i === 5) pageOrder.push({ type: 'analysis', turnIndex: 1 });
    if (i === 8) pageOrder.push({ type: 'analysis', turnIndex: 2 });
  }
  if (isOnboarding) pageOrder.push({ type: 'congrats' });
  pageOrder.push({ type: 'result' });

  function buildPages() {
    container.innerHTML = '';

    pageOrder.forEach((entry, idx) => {
      const page = document.createElement('div');
      page.className = 'p4-page';
      if (idx === 0) page.classList.add('active');
      page.dataset.pageIdx = idx;

      const inner = document.createElement('div');
      inner.className = 'p4-page-inner';

      if (entry.type === 'welcome') {
        page.classList.add('p4b-welcome-page');
        inner.classList.add('p4b-welcome');
        inner.innerHTML =
          '<h1 class="p4b-welcome-title">Welcome to Zenvoya</h1>' +
          '<p class="p4b-welcome-subtitle">Let\'s get to know you!</p>' +
          '<div class="p4b-welcome-map">' +
            '<svg class="p4b-welcome-map-svg" viewBox="0 0 280 160" fill="none">' +
              '<ellipse cx="65" cy="50" rx="30" ry="22" fill="rgba(255,255,255,0.1)"/>' +
              '<ellipse cx="80" cy="105" rx="15" ry="24" fill="rgba(255,255,255,0.1)"/>' +
              '<ellipse cx="142" cy="42" rx="14" ry="20" fill="rgba(255,255,255,0.1)"/>' +
              '<ellipse cx="148" cy="95" rx="18" ry="26" fill="rgba(255,255,255,0.1)"/>' +
              '<ellipse cx="205" cy="48" rx="34" ry="24" fill="rgba(255,255,255,0.1)"/>' +
              '<ellipse cx="230" cy="115" rx="16" ry="11" fill="rgba(255,255,255,0.1)"/>' +
              '<circle cx="55" cy="42" r="2.5" fill="rgba(255,255,255,0.5)"/>' +
              '<circle cx="78" cy="58" r="2.5" fill="rgba(255,255,255,0.5)"/>' +
              '<circle cx="70" cy="45" r="2" fill="rgba(255,255,255,0.35)"/>' +
              '<circle cx="142" cy="38" r="2.5" fill="rgba(255,255,255,0.5)"/>' +
              '<circle cx="150" cy="50" r="2" fill="rgba(255,255,255,0.35)"/>' +
              '<circle cx="195" cy="42" r="2.5" fill="rgba(255,255,255,0.5)"/>' +
              '<circle cx="215" cy="55" r="2.5" fill="rgba(255,255,255,0.5)"/>' +
              '<circle cx="225" cy="44" r="2" fill="rgba(255,255,255,0.35)"/>' +
              '<path d="M55,42 Q140,0 215,55" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="5,5" fill="none"/>' +
            '</svg>' +
            '<div class="p4b-welcome-plane">✈️</div>' +
          '</div>' +
          '<button class="p4-start-btn p4b-welcome-btn">Get Started</button>';
      } else if (entry.type === 'intro') {
        inner.classList.add('p4-intro');
        inner.innerHTML =
          '<div class="p4-intro-icon">✈️</div>' +
          '<h1 class="p4-intro-title">Discover Your Travel DNA</h1>' +
          '<p class="p4-intro-desc">12 quick questions to map your unique travel personality across 6 dimensions.</p>' +
          '<div class="p4-intro-highlight">💡 Think of your all-time favorite trip — the one that still gives you chills. Keep it in mind as you answer.</div>' +
          '<button class="p4-start-btn p4b-quiz-btn">Begin the Quiz</button>';
      } else if (entry.type === 'question') {
        const q = allQuestions[entry.qIndex];
        const qNum = entry.qIndex + 1;
        inner.innerHTML =
          '<div class="p4-q-bucket">Q' + qNum + ' · ' + q.bucket + '</div>' +
          '<div class="p4-q-text">' + q.text + '</div>' +
          '<div class="p4-q-options" data-qid="' + q.id + '">' +
          q.options.map(function(opt) {
            return '<button class="p4-q-option" data-value="' + opt.value + '">' +
              '<span class="p4-q-option-emoji">' + opt.emoji + '</span>' +
              '<span class="p4-q-option-text">' + opt.text + '</span>' +
              '</button>';
          }).join('') +
          '</div>';
      } else if (entry.type === 'analysis') {
        inner.classList.add('p4-interstitial');
        if (isOnboarding) {
          inner.classList.add('p4b-interstitial');
          inner.innerHTML =
            '<div class="p4b-crystal-wrap">' +
              '<div class="p4b-crystal-glow"></div>' +
              '<div class="p4b-crystal-glow p4b-crystal-glow-2"></div>' +
              '<div class="p4b-crystal-icon">🔮</div>' +
            '</div>' +
            '<div class="p4-interstitial-title">Micro-Analysis</div>' +
            '<div class="p4-interstitial-text" data-analysis-turn="' + entry.turnIndex + '"></div>' +
            '<div class="p4b-analysis-timer"><div class="p4b-analysis-timer-fill"></div></div>' +
            '<button class="p4-start-btn p4b-analysis-continue">Continue</button>';
        } else {
          inner.innerHTML =
            '<div class="p4-interstitial-icon">🔮</div>' +
            '<div class="p4-interstitial-title">Micro-Analysis</div>' +
            '<div class="p4-interstitial-text" data-analysis-turn="' + entry.turnIndex + '"></div>' +
            '<div class="p4-interstitial-next">Tap to continue</div>';
        }
      } else if (entry.type === 'congrats') {
        page.classList.add('p4b-congrats-page');
        inner.classList.add('p4b-congrats');
        inner.innerHTML =
          '<div class="p4b-congrats-avatar-wrap">' +
            '<svg class="p4b-congrats-ring" viewBox="0 0 120 120">' +
              '<circle class="p4b-congrats-ring-bg" cx="60" cy="60" r="54"/>' +
              '<circle class="p4b-congrats-ring-fill" cx="60" cy="60" r="54"/>' +
            '</svg>' +
            '<div class="p4b-congrats-avatar">🧑‍✈️</div>' +
            '<div class="p4b-congrats-pct">0%</div>' +
          '</div>' +
          '<h2 class="p4b-congrats-title">Congrats!</h2>' +
          '<p class="p4b-congrats-text">We\'ve collected your preferences as a traveler.</p>' +
          '<p class="p4b-congrats-subtext">We will serve all your travel requests with your preferences in mind.</p>' +
          '<button class="p4-start-btn p4b-congrats-btn">See My Results</button>';
      } else if (entry.type === 'result') {
        if (isOnboarding) {
          page.classList.add('p4b-result-page');
        }
        inner.classList.add('p4-result');
        inner.innerHTML = '<div class="p4-result-content"></div>';
      }

      page.appendChild(inner);
      container.appendChild(page);
    });

    // Bind welcome button
    var welcomeBtn = app.querySelector('.p4b-welcome-btn');
    if (welcomeBtn) welcomeBtn.addEventListener('click', function() { goToPage(currentPage + 1, 1); });

    // Bind quiz intro button
    var quizBtn = app.querySelector('.p4b-quiz-btn');
    if (quizBtn) quizBtn.addEventListener('click', function() { goToPage(currentPage + 1, 1); });

    // Bind congrats button
    var congratsBtn = app.querySelector('.p4b-congrats-btn');
    if (congratsBtn) congratsBtn.addEventListener('click', function() { goToPage(currentPage + 1, 1); });

    bindOptionClicks();
    bindInterstitialClicks();
  }

  function bindOptionClicks() {
    container.querySelectorAll('.p4-q-option').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var optionsDiv = btn.closest('.p4-q-options');
        var qid = optionsDiv.dataset.qid;
        var value = btn.dataset.value;

        optionsDiv.querySelectorAll('.p4-q-option').forEach(function(b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        answers[qid] = value;

        setTimeout(function() { goToPage(currentPage + 1, 1); }, 350);
      });
    });
  }

  function bindInterstitialClicks() {
    container.querySelectorAll('.p4-interstitial').forEach(function(inner) {
      if (isOnboarding) {
        var continueBtn = inner.querySelector('.p4b-analysis-continue');
        if (continueBtn) {
          continueBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (analysisAutoTimer) { clearTimeout(analysisAutoTimer); analysisAutoTimer = null; }
            goToPage(currentPage + 1, 1);
          });
        }
      } else {
        inner.style.cursor = 'pointer';
        inner.addEventListener('click', function() { goToPage(currentPage + 1, 1); });
      }
    });
  }

  function goToPage(target, direction) {
    if (target < 0 || target >= pageOrder.length) return;

    // Clear any auto-advance timer from analysis pages
    if (analysisAutoTimer) { clearTimeout(analysisAutoTimer); analysisAutoTimer = null; }

    var pages = container.querySelectorAll('.p4-page');
    var cur = pages[currentPage];
    var next = pages[target];

    if (direction > 0) cur.classList.add('exit-left');
    else cur.classList.add('enter-right');
    cur.classList.remove('active');

    if (direction > 0) next.classList.add('enter-right');
    else next.classList.add('exit-left');
    void next.offsetWidth;
    next.classList.remove('exit-left', 'enter-right');
    next.classList.add('active');

    currentPage = target;
    var entry = pageOrder[currentPage];

    // Progress bar visibility
    if (entry.type === 'welcome' || entry.type === 'congrats' || entry.type === 'result' || entry.type === 'intro') {
      progressBar.style.display = 'none';
    } else if (entry.type === 'analysis' && isOnboarding) {
      progressBar.style.display = 'none';
    } else if (currentPage === 0) {
      progressBar.style.display = 'none';
    } else {
      progressBar.style.display = 'flex';
      var answeredCount = Object.keys(answers).length;
      progressFill.style.width = (answeredCount / 12) * 100 + '%';
      stepLabel.textContent = answeredCount + '/12';
    }

    // Populate analysis
    if (entry.type === 'analysis') {
      var turnIdx = entry.turnIndex;
      var textEl = next.querySelector('.p4-interstitial-text');
      if (textEl && turns[turnIdx].analysis) {
        textEl.textContent = turns[turnIdx].analysis(answers);
      }

      // Onboarding: start auto-advance timer with progress bar
      if (isOnboarding) {
        var timerFill = next.querySelector('.p4b-analysis-timer-fill');
        if (timerFill) {
          timerFill.style.transition = 'none';
          timerFill.style.width = '0%';
          void timerFill.offsetWidth;
          timerFill.style.transition = 'width 5s linear';
          timerFill.style.width = '100%';
        }
        analysisAutoTimer = setTimeout(function() {
          analysisAutoTimer = null;
          goToPage(currentPage + 1, 1);
        }, 5000);
      }
    }

    // Congrats page: animate circular progress ring
    if (entry.type === 'congrats') {
      var ringFill = next.querySelector('.p4b-congrats-ring-fill');
      var pctText = next.querySelector('.p4b-congrats-pct');
      if (ringFill) {
        var circumference = 2 * Math.PI * 54; // ~339.29
        ringFill.style.strokeDasharray = circumference;
        ringFill.style.strokeDashoffset = circumference;
        ringFill.style.transition = 'none';
        void ringFill.offsetWidth;
        ringFill.style.transition = 'stroke-dashoffset 2.5s ease-out';
        ringFill.style.strokeDashoffset = '0';
      }
      if (pctText) {
        var startTime = performance.now();
        var duration = 2500;
        function animatePct(now) {
          var elapsed = now - startTime;
          var progress = Math.min(elapsed / duration, 1);
          pctText.textContent = Math.round(progress * 100) + '%';
          if (progress < 1) requestAnimationFrame(animatePct);
        }
        requestAnimationFrame(animatePct);
      }
    }

    // Populate result
    if (entry.type === 'result') {
      progressBar.style.display = 'none';
      renderResult();
    }

    // Restore selection on back
    if (entry.type === 'question') {
      var q = allQuestions[entry.qIndex];
      var savedVal = answers[q.id];
      if (savedVal) {
        next.querySelectorAll('.p4-q-option').forEach(function(b) {
          b.classList.toggle('selected', b.dataset.value === savedVal);
        });
      }
    }
  }

  function buildDnaRow(emoji, label, value, catKey) {
    var desc = (dnaExplanations[catKey] && dnaExplanations[catKey][value]) || '';
    return '<div class="p4b-dna-row">' +
      '<div class="p4b-dna-row-top">' +
        '<span class="p4b-dna-bucket">' + emoji + ' ' + label + '</span>' +
        '<span class="p4b-dna-value">' + value + '</span>' +
      '</div>' +
      (desc ? '<div class="p4b-dna-row-desc">' + desc + '</div>' : '') +
    '</div>';
  }

  function renderResult() {
    var dna = computeDNA();
    var el = app.querySelector('.p4-result-content');

    if (isOnboarding) {
      el.innerHTML =
        '<h2 class="p4b-result-title">You as a traveler</h2>' +
        '<div class="p4b-result-subtitle">🧬 Your Zenvoya Travel DNA</div>' +
        '<div class="p4b-dna-categories">' +
          buildDnaRow('💰', 'Cost Strategy', dna.cost, 'cost') +
          buildDnaRow('🎯', 'Activity', dna.activity, 'activity') +
          buildDnaRow('👥', 'Social', dna.social, 'social') +
          buildDnaRow('🌤️', 'Weather', dna.weather, 'weather') +
          buildDnaRow('🏟️', 'Crowd', dna.crowd, 'crowd') +
          buildDnaRow('⏱️', 'Pace', dna.pace, 'pace') +
        '</div>' +
        '<button class="p4-start-btn p4b-go-btn">Go into app</button>';

      app.querySelector('.p4b-go-btn').addEventListener('click', resetQuiz);
    } else {
      var welcome = generateWelcome(dna);
      el.innerHTML =
        '<div class="p4-dna-card">' +
        '<div class="p4-dna-header"><h3>🧬 Your Zenvoya Travel DNA</h3><span>Based on your travel memories</span></div>' +
        '<div class="p4-dna-rows">' +
        '<div class="p4-dna-row"><span class="p4-dna-bucket">💰 Cost Strategy</span><span class="p4-dna-value">' + dna.cost + '</span></div>' +
        '<div class="p4-dna-row"><span class="p4-dna-bucket">🎯 Activity</span><span class="p4-dna-value">' + dna.activity + '</span></div>' +
        '<div class="p4-dna-row"><span class="p4-dna-bucket">👥 Social</span><span class="p4-dna-value">' + dna.social + '</span></div>' +
        '<div class="p4-dna-row"><span class="p4-dna-bucket">🌤️ Weather</span><span class="p4-dna-value">' + dna.weather + '</span></div>' +
        '<div class="p4-dna-row"><span class="p4-dna-bucket">🏟️ Crowd</span><span class="p4-dna-value">' + dna.crowd + '</span></div>' +
        '<div class="p4-dna-row"><span class="p4-dna-bucket">⏱️ Pace</span><span class="p4-dna-value">' + dna.pace + '</span></div>' +
        '</div>' +
        '<div class="p4-dna-welcome">' + welcome + '</div>' +
        '</div>' +
        '<button class="p4-restart-btn">↻ Start Over</button>';

      app.querySelector('.p4-restart-btn').addEventListener('click', resetQuiz);
    }
  }

  backBtn.addEventListener('click', function() {
    if (currentPage <= 1) return;
    // Don't go back past intro to welcome
    if (isOnboarding && currentPage <= 2) return;
    var target = currentPage - 1;
    if (pageOrder[target].type === 'analysis') target--;
    if (pageOrder[target].type === 'congrats') target--;
    goToPage(target, -1);
  });

  function resetQuiz() {
    Object.keys(answers).forEach(function(k) { delete answers[k]; });
    currentPage = 0;
    // Reset the correct initialized flag based on which instance this is
    if (appId === 'p4App') p4Initialized = false;
    if (appId === 'p4bApp') p4bInitialized = false;
    buildPages();
    progressBar.style.display = 'none';
  }

  buildPages();
}

// Auto-init if already on prototype-4
if (window.location.hash === '#prototype-4') {
  document.addEventListener('DOMContentLoaded', function() { initProto4Quiz(); });
}

// =============================================
// PROTOTYPE 5 — Trip Recording
// =============================================
let p5Initialized = false;
function initProto5() {
  if (p5Initialized) return;
  var mapEl = document.getElementById('p5Map');
  if (!mapEl) return;
  p5Initialized = true;

  // Tokyo trail: simulated GPS points every ~30 min
  var trailData = [
    { lat: 35.6595, lng: 139.7004, time: '9:00 AM', name: 'Shibuya Station', type: 'Transit' },
    { lat: 35.6614, lng: 139.7041, time: '9:30 AM', name: 'Shibuya Crossing', type: 'Landmark' },
    { lat: 35.6654, lng: 139.6983, time: '10:00 AM', name: 'Yoyogi Park', type: 'Park' },
    { lat: 35.6716, lng: 139.6966, time: '10:30 AM', name: 'Meiji Shrine', type: 'Temple' },
    { lat: 35.6702, lng: 139.7027, time: '11:00 AM', name: 'Takeshita Street', type: 'Shopping' },
    { lat: 35.6762, lng: 139.7095, time: '11:30 AM', name: 'Cat Street', type: 'Shopping' },
    { lat: 35.6808, lng: 139.7142, time: '12:00 PM', name: 'Omotesando', type: 'Dining' },
    { lat: 35.6852, lng: 139.7103, time: '12:30 PM', name: 'Nezu Museum Area', type: 'Museum' },
  ];

  // Recommendations that appear near trail
  var recommendations = [
    { lat: 35.6635, lng: 139.7112, name: 'Ichiran Ramen', emoji: '🍜', desc: '4 min walk · Top rated ramen', badge: '97% match' },
    { lat: 35.6685, lng: 139.7053, name: 'Togo Shrine', emoji: '⛩️', desc: '2 min walk · Hidden gem', badge: 'Nearby' },
    { lat: 35.6773, lng: 139.7145, name: 'Design Festa Gallery', emoji: '🎨', desc: '5 min walk · Art space', badge: 'For you' },
    { lat: 35.6828, lng: 139.7060, name: 'Aoyama Flower Market', emoji: '🌸', desc: '3 min walk · Café & flowers', badge: 'Trending' },
  ];

  // Map init
  var map = L.map(mapEl, {
    center: [35.668, 139.703],
    zoom: 15,
    zoomControl: false,
    attributionControl: false,
  });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

  var trailLine = null;
  var trailMarkers = [];
  var recoMarkers = [];
  var currentIdx = 0;
  var simInterval = null;
  var timerInterval = null;
  var elapsedSeconds = 0;

  var hud = document.getElementById('p5Hud');
  var hudTime = document.getElementById('p5HudTime');
  var sheetPre = document.getElementById('p5SheetPre');
  var sheetRec = document.getElementById('p5SheetRecording');
  var sheetSummary = document.getElementById('p5SheetSummary');
  var spotsScroll = document.getElementById('p5SpotsScroll');
  var statSpots = document.getElementById('p5StatSpots');
  var statDist = document.getElementById('p5StatDist');
  var statTime = document.getElementById('p5StatTime');
  var toast = document.getElementById('p5Toast');
  var toastTitle = document.getElementById('p5ToastTitle');
  var toastDesc = document.getElementById('p5ToastDesc');

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function calcDistance(pts) {
    var total = 0;
    for (var i = 1; i < pts.length; i++) {
      var R = 6371;
      var dLat = (pts[i].lat - pts[i-1].lat) * Math.PI / 180;
      var dLng = (pts[i].lng - pts[i-1].lng) * Math.PI / 180;
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(pts[i-1].lat * Math.PI / 180) * Math.cos(pts[i].lat * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
      total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
    return total;
  }

  function addTrailPoint(idx) {
    var pt = trailData[idx];
    var latlng = [pt.lat, pt.lng];

    // Remove pulse from previous current marker
    trailMarkers.forEach(function(m) {
      var el = m.getElement();
      if (el) {
        var dot = el.querySelector('.p5-trail-dot-current');
        if (dot) { dot.className = 'p5-trail-dot'; }
      }
    });

    // Add marker
    var marker = L.marker(latlng, {
      icon: L.divIcon({
        html: '<div class="p5-trail-dot-current"></div>',
        className: 'proto-leaflet-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    }).addTo(map);
    trailMarkers.push(marker);

    // Time label
    L.marker([pt.lat + 0.0008, pt.lng], {
      icon: L.divIcon({
        html: '<div class="p5-time-label">' + pt.time + '</div>',
        className: 'proto-leaflet-marker',
        iconSize: null,
        iconAnchor: [20, 12],
      }),
      interactive: false,
    }).addTo(map);

    // Trail line
    var coords = trailData.slice(0, idx + 1).map(function(p) { return [p.lat, p.lng]; });
    if (trailLine) map.removeLayer(trailLine);
    trailLine = L.polyline(coords, { color: '#7C3AED', weight: 3, opacity: 0.7, dashArray: '6,4' }).addTo(map);

    // Pan map
    map.panTo(latlng, { animate: true, duration: 0.5 });

    // Update stats
    statSpots.textContent = idx + 1;
    var dist = calcDistance(trailData.slice(0, idx + 1));
    statDist.textContent = dist.toFixed(1);

    // Add spot card
    var card = document.createElement('div');
    card.className = 'p5-spot-card';
    card.innerHTML = '<div class="p5-spot-card-time">' + pt.time + '</div><div class="p5-spot-card-name">' + pt.name + '</div><div class="p5-spot-card-type">' + pt.type + '</div>';
    spotsScroll.appendChild(card);
    spotsScroll.scrollLeft = spotsScroll.scrollWidth;

    // Show recommendation after certain points
    if (idx === 1 || idx === 3 || idx === 5 || idx === 7) {
      var recoIdx = [1, 3, 5, 7].indexOf(idx);
      var reco = recommendations[recoIdx];
      if (reco) {
        showRecommendation(reco);
        addRecoMarker(reco);
      }
    }
  }

  function addRecoMarker(reco) {
    var m = L.marker([reco.lat, reco.lng], {
      icon: L.divIcon({
        html: '<div class="p5-reco-pin"><span class="p5-reco-pin-emoji">' + reco.emoji + '</span><span class="p5-reco-pin-name">' + reco.name + '</span></div>',
        className: 'proto-leaflet-marker',
        iconSize: null,
        iconAnchor: [0, 0],
      }),
    }).addTo(map);
    recoMarkers.push(m);
  }

  function showRecommendation(reco) {
    toastTitle.textContent = reco.emoji + ' ' + reco.name;
    toastDesc.textContent = reco.desc;
    toast.style.display = 'flex';
    toast.style.animation = 'none';
    void toast.offsetWidth;
    toast.style.animation = 'p5-toast-in 0.4s ease both';
    // Auto-hide after 4s
    setTimeout(function() { toast.style.display = 'none'; }, 4000);
  }

  document.getElementById('p5ToastClose').addEventListener('click', function() {
    toast.style.display = 'none';
  });

  function startRecording() {
    sheetPre.style.display = 'none';
    sheetRec.style.display = 'flex';
    sheetSummary.style.display = 'none';
    hud.style.display = 'flex';
    currentIdx = 0;
    elapsedSeconds = 0;
    spotsScroll.innerHTML = '';

    // Clear old markers
    trailMarkers.forEach(function(m) { map.removeLayer(m); });
    recoMarkers.forEach(function(m) { map.removeLayer(m); });
    trailMarkers = [];
    recoMarkers = [];
    if (trailLine) { map.removeLayer(trailLine); trailLine = null; }

    // Remove old time labels
    map.eachLayer(function(layer) {
      if (layer.options && layer.options.icon) {
        var html = layer.options.icon.options ? layer.options.icon.options.html || '' : '';
        if (typeof html === 'string' && html.indexOf('p5-time-label') !== -1) {
          map.removeLayer(layer);
        }
      }
    });

    map.setView([35.6595, 139.7004], 15);

    // Add first point immediately
    addTrailPoint(0);

    // Simulate GPS updates every 2s (representing 30min intervals)
    simInterval = setInterval(function() {
      currentIdx++;
      if (currentIdx >= trailData.length) {
        stopRecording();
        return;
      }
      addTrailPoint(currentIdx);
    }, 2500);

    // Timer
    timerInterval = setInterval(function() {
      elapsedSeconds++;
      var timeStr = formatTime(elapsedSeconds);
      hudTime.textContent = timeStr;
      statTime.textContent = timeStr;
    }, 1000);
  }

  function stopRecording() {
    clearInterval(simInterval);
    clearInterval(timerInterval);
    hud.style.display = 'none';
    toast.style.display = 'none';

    sheetRec.style.display = 'none';
    sheetSummary.style.display = 'flex';

    var pts = trailData.slice(0, currentIdx + 1);
    var dist = calcDistance(pts);
    document.getElementById('p5SummarySub').textContent = pts.length + ' spots · ' + dist.toFixed(1) + ' km · ' + formatTime(elapsedSeconds);
    document.getElementById('p5SummaryStats').innerHTML =
      '<div class="p5-stat"><span class="p5-stat-value">' + pts.length + '</span><span class="p5-stat-label">Spots</span></div>' +
      '<div class="p5-stat"><span class="p5-stat-value">' + dist.toFixed(1) + '</span><span class="p5-stat-label">km walked</span></div>' +
      '<div class="p5-stat"><span class="p5-stat-value">' + formatTime(elapsedSeconds) + '</span><span class="p5-stat-label">Duration</span></div>';
  }

  document.getElementById('p5RecordBtn').addEventListener('click', startRecording);
  document.getElementById('p5StopBtn').addEventListener('click', stopRecording);
  document.getElementById('p5RestartBtn').addEventListener('click', function() {
    sheetSummary.style.display = 'none';
    sheetPre.style.display = 'flex';
    // Clear map
    trailMarkers.forEach(function(m) { map.removeLayer(m); });
    recoMarkers.forEach(function(m) { map.removeLayer(m); });
    trailMarkers = [];
    recoMarkers = [];
    if (trailLine) { map.removeLayer(trailLine); trailLine = null; }
    map.eachLayer(function(layer) {
      if (layer.options && layer.options.icon) {
        var html = layer.options.icon.options ? layer.options.icon.options.html || '' : '';
        if (typeof html === 'string' && (html.indexOf('p5-time-label') !== -1 || html.indexOf('p5-reco-pin') !== -1)) {
          map.removeLayer(layer);
        }
      }
    });
    map.setView([35.668, 139.703], 15);
  });

  // Invalidate map size after a short delay to handle container sizing
  setTimeout(function() { map.invalidateSize(); }, 200);
}

// =============================================
// PROTOTYPE 6 — Create Trip
// =============================================
var p6Initialized = false;
function initProto6() {
  if (p6Initialized) return;
  var app = document.getElementById('p6App');
  if (!app) return;
  p6Initialized = true;

  // ---- State ----
  var state = {
    destination: '',
    destImg: '',
    month: '',
    duration: '',
    customStart: '',
    customEnd: '',
    mustDos: [],
    flightBudget: 35,
    hotelBudget: 40,
    monitorFlights: true,
    monitorHotels: true,
    activityMonitors: {},
  };

  // ---- Page flow: steps array (maps visual step to data-step) ----
  var steps = ['1', '2', '3', 'loading', '4', '5', '6'];
  var currentStepIdx = 0;

  var allPages = app.querySelectorAll('.p6-page');
  var progressFill = document.getElementById('p6ProgressFill');
  var progressLabel = document.getElementById('p6ProgressLabel');
  var backBtn = document.getElementById('p6BackBtn');

  function getVisualStep(idx) {
    var s = steps[idx];
    if (s === 'loading') return null;
    return parseInt(s);
  }

  var progressBar = document.getElementById('p6Progress');

  function updateProgress() {
    var vs = getVisualStep(currentStepIdx);
    // Hide progress bar on step 1 (destination)
    if (vs === 1) {
      progressBar.style.display = 'none';
    } else {
      progressBar.style.display = 'flex';
    }
    if (vs !== null) {
      var pct = (vs / 6) * 100;
      progressFill.style.width = pct + '%';
      progressLabel.textContent = 'Step ' + vs + ' of 6';
    }
    backBtn.style.display = currentStepIdx > 0 && steps[currentStepIdx] !== 'loading' ? 'flex' : 'none';
  }

  function goToStep(idx, dir) {
    if (idx < 0 || idx >= steps.length) return;
    var oldPage = app.querySelector('.p6-page-active');
    var newStep = steps[idx];
    var newPage = app.querySelector('.p6-page[data-step="' + newStep + '"]');
    if (!newPage) return;

    if (oldPage) {
      oldPage.classList.remove('p6-page-active');
      oldPage.classList.add(dir === 1 ? 'p6-page-exit-left' : '');
      oldPage.style.transform = dir === 1 ? 'translateX(-60px)' : 'translateX(60px)';
      oldPage.style.opacity = '0';
      oldPage.style.pointerEvents = 'none';
    }

    newPage.classList.remove('p6-page-exit-left');
    newPage.style.transform = dir === 1 ? 'translateX(60px)' : 'translateX(-60px)';
    newPage.style.opacity = '0';
    void newPage.offsetWidth; // force reflow
    newPage.classList.add('p6-page-active');
    newPage.style.transform = '';
    newPage.style.opacity = '';
    newPage.style.pointerEvents = '';

    currentStepIdx = idx;
    updateProgress();

    // Auto-advance from loading after 2.5s
    if (newStep === 'loading') {
      backBtn.style.display = 'none';
      setTimeout(function() { goToStep(currentStepIdx + 1, 1); }, 2500);
    }

    // Populate step 5 when arriving
    if (newStep === '5') populateActivityMonitors();
    // Populate step 6 when arriving
    if (newStep === '6') populateFinalPlan();
  }

  function nextStep() { goToStep(currentStepIdx + 1, 1); }
  function prevStep() {
    var target = currentStepIdx - 1;
    // Skip loading when going back
    if (target >= 0 && steps[target] === 'loading') target--;
    goToStep(target, -1);
  }

  backBtn.addEventListener('click', prevStep);

  // ---- Step 1: Destination ----
  var destCards = app.querySelectorAll('.p6-dest-card');
  var destInput = document.getElementById('p6DestInput');

  var destImages = {
    'Tokyo, Japan': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=300&fit=crop',
    'Barcelona, Spain': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=300&fit=crop',
    'Lisbon, Portugal': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=300&fit=crop',
    'Bali, Indonesia': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=300&fit=crop',
    'Paris, France': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=300&fit=crop',
    'New York, USA': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=300&fit=crop',
  };

  destCards.forEach(function(card) {
    card.addEventListener('click', function() {
      destCards.forEach(function(c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      state.destination = card.getAttribute('data-dest');
      state.destImg = destImages[state.destination] || '';
      destInput.value = state.destination;
      setTimeout(function() { nextStep(); }, 400);
    });
  });

  // ---- Step 2: Month + Duration ----
  var monthScroll = document.getElementById('p6MonthScroll');
  var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var now = new Date();
  var curMonth = now.getMonth();

  for (var i = 0; i < 12; i++) {
    var mIdx = (curMonth + i) % 12;
    var yr = now.getFullYear() + (curMonth + i >= 12 ? 1 : 0);
    var btn = document.createElement('button');
    btn.className = 'p6-pill' + (i === 0 ? ' active' : '');
    btn.textContent = monthNames[mIdx] + ' ' + yr;
    btn.setAttribute('data-month', monthNames[mIdx] + ' ' + yr);
    monthScroll.appendChild(btn);
  }
  state.month = monthScroll.querySelector('.p6-pill.active').getAttribute('data-month');

  monthScroll.addEventListener('click', function(e) {
    var pill = e.target.closest('.p6-pill');
    if (!pill) return;
    monthScroll.querySelectorAll('.p6-pill').forEach(function(p) { p.classList.remove('active'); });
    pill.classList.add('active');
    state.month = pill.getAttribute('data-month');
  });

  var durRow = document.getElementById('p6DurationRow');
  var customDates = document.getElementById('p6CustomDates');
  durRow.addEventListener('click', function(e) {
    var pill = e.target.closest('.p6-pill');
    if (!pill) return;
    durRow.querySelectorAll('.p6-pill').forEach(function(p) { p.classList.remove('active'); });
    pill.classList.add('active');
    var dur = pill.getAttribute('data-dur');
    state.duration = dur;
    if (dur === 'custom') {
      customDates.style.display = 'flex';
    } else {
      customDates.style.display = 'none';
    }
  });

  document.getElementById('p6Step2Next').addEventListener('click', function() {
    if (!state.duration) {
      // Default to 14 days if nothing selected
      state.duration = '14';
      durRow.querySelector('[data-dur="14"]').classList.add('active');
    }
    nextStep();
  });

  // ---- Step 3: Must-Dos ----
  var mustDoInput = document.getElementById('p6MustDoInput');
  var mustDoList = document.getElementById('p6MustDoList');
  var mustDoHint = document.getElementById('p6MustDoHint');
  var step3Next = document.getElementById('p6Step3Next');

  function addMustDo() {
    var text = mustDoInput.value.trim();
    if (!text) return;
    state.mustDos.push(text);
    mustDoInput.value = '';
    renderMustDos();
  }

  function renderMustDos() {
    mustDoList.innerHTML = '';
    state.mustDos.forEach(function(item, idx) {
      var div = document.createElement('div');
      div.className = 'p6-mustdo-item';
      div.innerHTML = '<span class="p6-mustdo-num">' + (idx + 1) + '</span>' +
        '<span class="p6-mustdo-text">' + item + '</span>' +
        '<button class="p6-mustdo-remove" data-idx="' + idx + '">×</button>';
      mustDoList.appendChild(div);
    });
    if (state.mustDos.length >= 3) {
      step3Next.classList.remove('p6-btn-disabled');
      mustDoHint.textContent = state.mustDos.length + ' items added';
    } else {
      step3Next.classList.add('p6-btn-disabled');
      mustDoHint.textContent = 'Add ' + (3 - state.mustDos.length) + ' more to continue';
    }
  }

  document.getElementById('p6AddMustDo').addEventListener('click', addMustDo);
  mustDoInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); addMustDo(); }
  });
  mustDoList.addEventListener('click', function(e) {
    var btn = e.target.closest('.p6-mustdo-remove');
    if (!btn) return;
    state.mustDos.splice(parseInt(btn.getAttribute('data-idx')), 1);
    renderMustDos();
  });

  step3Next.addEventListener('click', function() {
    if (state.mustDos.length >= 3) nextStep();
  });

  // ---- Step 4: Price Monitor ----
  var flightRange = document.getElementById('p6FlightRange');
  var hotelRange = document.getElementById('p6HotelRange');
  var flightPrice = document.getElementById('p6FlightPrice');
  var hotelPrice = document.getElementById('p6HotelPrice');

  function updateSliderFill(slider) {
    var pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = 'linear-gradient(to right, var(--brand) 0%, var(--brand) ' + pct + '%, #EDEBE8 ' + pct + '%, #EDEBE8 100%)';
  }

  flightRange.addEventListener('input', function() {
    var v = parseInt(flightRange.value);
    state.flightBudget = v;
    var price = 200 + Math.round(v * 12);
    flightPrice.textContent = '~$' + price;
    updateSliderFill(flightRange);
  });

  hotelRange.addEventListener('input', function() {
    var v = parseInt(hotelRange.value);
    state.hotelBudget = v;
    var price = 40 + Math.round(v * 3.6);
    hotelPrice.textContent = '~$' + price + '/night';
    updateSliderFill(hotelRange);
  });

  // Set initial fill
  updateSliderFill(flightRange);
  updateSliderFill(hotelRange);

  // ---- Provider pills (airlines & hotels) ----
  function setupProviderPills(containerId, addBtnId, placeholder) {
    var container = document.getElementById(containerId);
    var addBtn = document.getElementById(addBtnId);
    if (!container || !addBtn) return;

    // Remove pill
    container.addEventListener('click', function(e) {
      var xBtn = e.target.closest('.p6-provider-x');
      if (xBtn) {
        xBtn.closest('.p6-provider-pill').remove();
      }
    });

    // Add pill
    addBtn.addEventListener('click', function() {
      // Check if input already open
      if (container.querySelector('.p6-provider-input')) return;
      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'p6-provider-input';
      input.placeholder = placeholder;
      container.insertBefore(input, addBtn);
      input.focus();

      function commitInput() {
        var val = input.value.trim();
        if (val) {
          var pill = document.createElement('span');
          pill.className = 'p6-provider-pill';
          pill.innerHTML = val + '<button class="p6-provider-x" data-provider="' + val + '">×</button>';
          container.insertBefore(pill, input);
        }
        input.remove();
      }
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); commitInput(); }
        if (e.key === 'Escape') { input.remove(); }
      });
      input.addEventListener('blur', commitInput);
    });
  }

  setupProviderPills('p6AirlinePills', 'p6AddAirline', 'Airline...');
  setupProviderPills('p6HotelPills', 'p6AddHotel', 'Hotel...');

  document.getElementById('p6Step4Next').addEventListener('click', nextStep);

  // ---- Step 5: Activity Monitors ----
  var activityList = document.getElementById('p6ActivityList');

  // Map destination keywords to relevant recommendations
  var destRecommendations = {
    'Tokyo': [
      { emoji: '🍜', name: 'Ramen District Tour', desc: 'Reservation alert · 14 days before' },
      { emoji: '🏯', name: 'Imperial Palace Gardens', desc: 'Ticket release alert' },
      { emoji: '🎌', name: 'Festival & Events', desc: 'Special event notifications' },
    ],
    'Barcelona': [
      { emoji: '🏛️', name: 'Sagrada Familia Tickets', desc: 'Ticket release alert · sells out fast' },
      { emoji: '🍷', name: 'Wine Tasting Reservations', desc: 'Booking window opens 30 days out' },
      { emoji: '⚽', name: 'FC Barcelona Matches', desc: 'Ticket drop notifications' },
    ],
    'Lisbon': [
      { emoji: '🚋', name: 'Tram 28 Best Times', desc: 'Crowd monitoring · avoid peak hours' },
      { emoji: '🍰', name: 'Pastéis de Belém', desc: 'Wait time alerts · best at 8 AM' },
      { emoji: '🎵', name: 'Fado Shows', desc: 'Reservation window · 7 days out' },
    ],
    'default': [
      { emoji: '🎫', name: 'Attraction Tickets', desc: 'Ticket release alerts' },
      { emoji: '🍽️', name: 'Top Restaurant Reservations', desc: 'Booking window opens 30 days out' },
      { emoji: '🎭', name: 'Shows & Events', desc: 'Event notifications' },
    ],
  };

  function populateActivityMonitors() {
    activityList.innerHTML = '';
    var items = [];

    // Add must-do based monitors
    state.mustDos.forEach(function(md) {
      items.push({ emoji: '📌', name: md, desc: 'Availability & booking alerts', fromUser: true });
    });

    // Add destination-specific monitors
    var destKey = 'default';
    Object.keys(destRecommendations).forEach(function(k) {
      if (state.destination.indexOf(k) !== -1) destKey = k;
    });
    destRecommendations[destKey].forEach(function(r) { items.push(r); });

    // Always add weather monitor
    items.push({ emoji: '🌤️', name: 'Weather Forecast', desc: 'Final packing check · 3 days before' });

    items.forEach(function(item, idx) {
      var id = 'p6Act' + idx;
      state.activityMonitors[id] = true;
      var div = document.createElement('div');
      div.className = 'p6-activity-item';
      div.innerHTML = '<span class="p6-activity-emoji">' + item.emoji + '</span>' +
        '<div class="p6-activity-info"><span class="p6-activity-name">' + item.name + '</span>' +
        '<span class="p6-activity-desc">' + item.desc + '</span></div>' +
        '<div class="p6-monitor-toggle-wrap"><label class="p6-toggle"><input type="checkbox" checked data-actid="' + id + '">' +
        '<span class="p6-toggle-slider"></span></label></div>';
      activityList.appendChild(div);
    });

    activityList.addEventListener('change', function(e) {
      if (e.target.hasAttribute('data-actid')) {
        state.activityMonitors[e.target.getAttribute('data-actid')] = e.target.checked;
      }
    });
  }

  document.getElementById('p6Step5Next').addEventListener('click', nextStep);

  // ---- Step 6: Final Plan ----
  function populateFinalPlan() {
    // Summary card
    document.getElementById('p6TripDest').textContent = state.destination || 'Your Trip';
    var dateStr = state.month || '';
    if (state.duration && state.duration !== 'custom') dateStr += ' · ' + state.duration + ' days';
    else if (state.customStart && state.customEnd) dateStr += ' · ' + state.customStart + ' to ' + state.customEnd;
    document.getElementById('p6TripDates').textContent = dateStr;

    var bg = document.getElementById('p6TripBg');
    bg.style.backgroundImage = state.destImg ? 'url(' + state.destImg + ')' : 'linear-gradient(135deg, #7C3AED, #3B82F6)';

    var monCount = 0;
    if (state.monitorFlights) monCount++;
    if (state.monitorHotels) monCount++;
    Object.keys(state.activityMonitors).forEach(function(k) { if (state.activityMonitors[k]) monCount++; });
    document.getElementById('p6TripMonitors').textContent = '📡 ' + monCount + ' monitors';
    document.getElementById('p6TripActivities').textContent = '📋 ' + (state.mustDos.length + 3) + ' activities';

    // Activities list
    var finalActs = document.getElementById('p6FinalActivities');
    finalActs.innerHTML = '';

    // User must-dos
    state.mustDos.forEach(function(md, idx) {
      appendFinalActivity(finalActs, '📌', md, 'Your must-do', true, idx);
    });

    // Zenvoya recommendations (destination-based)
    var destKey = 'default';
    Object.keys(destRecommendations).forEach(function(k) {
      if (state.destination.indexOf(k) !== -1) destKey = k;
    });
    destRecommendations[destKey].forEach(function(r, idx) {
      appendFinalActivity(finalActs, r.emoji, r.name, 'Zenvoya recommendation', true, 100 + idx);
    });
  }

  function appendFinalActivity(container, emoji, name, source, monitored, idx) {
    var div = document.createElement('div');
    div.className = 'p6-final-act-item';
    var recoBadge = source === 'Zenvoya recommendation' ? '<span class="p6-reco-badge">Recommended</span>' : '';
    div.innerHTML = '<span class="p6-final-act-emoji">' + emoji + '</span>' +
      '<div class="p6-final-act-info"><span class="p6-final-act-name">' + name + recoBadge + '</span>' +
      '<span class="p6-final-act-source">' + source + '</span></div>' +
      '<div class="p6-final-act-toggle"><label class="p6-toggle"><input type="checkbox"' + (monitored ? ' checked' : '') + '>' +
      '<span class="p6-toggle-slider"></span></label></div>' +
      '<button class="p6-final-act-remove" data-fidx="' + idx + '">×</button>';
    container.appendChild(div);
  }

  document.getElementById('p6FinalActivities').addEventListener('click', function(e) {
    var removeBtn = e.target.closest('.p6-final-act-remove');
    if (removeBtn) {
      removeBtn.closest('.p6-final-act-item').remove();
    }
  });

  // More Recommendations button
  var moreRecoData = {
    'Tokyo': [
      { emoji: '🍣', name: 'Tsukiji Outer Market Tour', source: 'Zenvoya recommendation' },
      { emoji: '🎎', name: 'Asakusa & Senso-ji Temple', source: 'Zenvoya recommendation' },
      { emoji: '🌃', name: 'Shibuya Sky Observation Deck', source: 'Zenvoya recommendation' },
    ],
    'Barcelona': [
      { emoji: '🏖️', name: 'Barceloneta Beach & Chiringuitos', source: 'Zenvoya recommendation' },
      { emoji: '🎨', name: 'Picasso Museum Visit', source: 'Zenvoya recommendation' },
      { emoji: '🌳', name: 'Park Güell Sunset Walk', source: 'Zenvoya recommendation' },
    ],
    'Lisbon': [
      { emoji: '🏰', name: 'Belém Tower & Jerónimos', source: 'Zenvoya recommendation' },
      { emoji: '🍷', name: 'Port Wine Tasting in Alfama', source: 'Zenvoya recommendation' },
      { emoji: '🎵', name: 'Live Fado Night in Mouraria', source: 'Zenvoya recommendation' },
    ],
    'default': [
      { emoji: '📸', name: 'Golden Hour Photo Walk', source: 'Zenvoya recommendation' },
      { emoji: '🍽️', name: 'Local Food Market Tour', source: 'Zenvoya recommendation' },
      { emoji: '🚶', name: 'Historic Old Town Walking Tour', source: 'Zenvoya recommendation' },
    ],
  };

  var moreRecoBtn = document.getElementById('p6MoreReco');
  var moreRecoLoaded = false;

  moreRecoBtn.addEventListener('click', function() {
    if (moreRecoLoaded) return;
    moreRecoBtn.classList.add('loading');
    moreRecoBtn.innerHTML = '<span class="p6-more-reco-icon">⏳</span> Finding recommendations...';

    setTimeout(function() {
      var destKey = 'default';
      Object.keys(moreRecoData).forEach(function(k) {
        if (state.destination.indexOf(k) !== -1) destKey = k;
      });
      var items = moreRecoData[destKey];
      var finalActs = document.getElementById('p6FinalActivities');

      items.forEach(function(item, idx) {
        appendFinalActivity(finalActs, item.emoji, item.name, item.source, true, 200 + idx);
      });

      moreRecoLoaded = true;
      moreRecoBtn.innerHTML = '<span class="p6-more-reco-icon">✅</span> ' + items.length + ' recommendations added';
      moreRecoBtn.style.borderStyle = 'solid';
      moreRecoBtn.style.pointerEvents = 'none';
      moreRecoBtn.style.opacity = '0.6';

      // Update activity count on summary
      var totalActs = finalActs.querySelectorAll('.p6-final-act-item').length;
      document.getElementById('p6TripActivities').textContent = '📋 ' + totalActs + ' activities';
    }, 1500);
  });

  // Final CTAs (just visual feedback)
  document.getElementById('p6CreateBtn').addEventListener('click', function() {
    this.textContent = '✓ Itinerary Created!';
    this.style.background = '#059669';
    setTimeout(function() {
      document.getElementById('p6CreateBtn').textContent = 'Create Itinerary';
      document.getElementById('p6CreateBtn').style.background = '';
    }, 2000);
  });

  document.getElementById('p6InviteBtn').addEventListener('click', function() {
    this.textContent = '✓ Link Copied!';
    setTimeout(function() {
      document.getElementById('p6InviteBtn').textContent = '👥 Invite Others';
    }, 2000);
  });

  // ---- Activity Detail Page ----
  var detailOverlay = document.getElementById('p6DetailOverlay');
  var detailMap = null;

  // Rich activity detail data keyed by name
  var activityDetails = {
    // Barcelona
    'Sagrada Familia Tickets': {
      category: 'Landmark · Architecture',
      desc: 'Antoni Gaudí\'s masterpiece basilica has been under construction since 1882 and remains Barcelona\'s most iconic landmark. The interior light show created by stained glass windows is breathtaking.',
      reason: 'This is the #1 visited site in Barcelona and tickets sell out 2–3 weeks in advance. Monitoring ensures you get your preferred time slot before they\'re gone.',
      lat: 41.4036, lng: 2.1744, address: 'Carrer de Mallorca, 401, 08013 Barcelona',
      monitorDesc: 'Ticket release alerts · sells out fast',
      reviews: [
        { name: 'Sarah M.', initials: 'SM', stars: 5, text: 'Absolutely stunning. Book the guided tour — the details Gaudí planned are incredible.' },
        { name: 'James K.', initials: 'JK', stars: 5, text: 'Go at golden hour. The light through the windows is otherworldly.' },
      ]
    },
    'Wine Tasting Reservations': {
      category: 'Dining · Experience',
      desc: 'Barcelona\'s wine scene spans centuries of Catalan tradition. From cava cellars in the Gothic Quarter to natural wine bars in El Born, there\'s a tasting for every palate.',
      reason: 'The best wine experiences in Barcelona are small-group and book up quickly, especially during peak travel months. We\'ll alert you when booking windows open.',
      lat: 41.3833, lng: 2.1827, address: 'El Born District, Barcelona',
      monitorDesc: 'Booking window opens 30 days out',
      reviews: [
        { name: 'Elena R.', initials: 'ER', stars: 5, text: 'The sommelier at Vila Viniteca was amazing. Learned so much about Priorat wines.' },
        { name: 'Tom H.', initials: 'TH', stars: 4, text: 'Great selection of cavas. The underground cellar tour was a highlight.' },
      ]
    },
    'FC Barcelona Matches': {
      category: 'Sports · Entertainment',
      desc: 'Experience the electric atmosphere of Camp Nou, one of the world\'s largest football stadiums. Even non-football fans are moved by the passion of 99,000+ Barça supporters.',
      reason: 'Match tickets are released in waves and premium seats sell out within hours. Monitoring gives you a head start when new tickets drop.',
      lat: 41.3809, lng: 2.1228, address: 'Camp Nou, C/ d\'Aristides Maillol, Barcelona',
      monitorDesc: 'Ticket drop notifications',
      reviews: [
        { name: 'Marco P.', initials: 'MP', stars: 5, text: 'Bucket list experience. The crowd energy when they scored was unforgettable.' },
        { name: 'Lisa W.', initials: 'LW', stars: 4, text: 'Worth it even for the stadium tour if you can\'t catch a match.' },
      ]
    },
    'Barceloneta Beach & Chiringuitos': {
      category: 'Beach · Dining',
      desc: 'Barcelona\'s beloved beachfront neighborhood offers golden sand, seaside cocktail bars (chiringuitos), and some of the best seafood paella in the city.',
      reason: 'The best chiringuitos take reservations for sunset tables that book up fast in summer. We\'ll track availability for the top-rated spots.',
      lat: 41.3784, lng: 2.1925, address: 'Passeig Marítim de la Barceloneta, Barcelona',
      monitorDesc: 'Reservation alerts · sunset tables',
      reviews: [
        { name: 'Anna S.', initials: 'AS', stars: 4, text: 'Loved the vibe at Sal Café. Paella was incredible with the sea view.' },
        { name: 'David L.', initials: 'DL', stars: 5, text: 'Perfect beach day. Arrived early to snag a good spot and stayed for sunset.' },
      ]
    },
    'Picasso Museum Visit': {
      category: 'Museum · Art',
      desc: 'Housed in five medieval palaces on Carrer Montcada, the Museu Picasso showcases over 4,000 works chronicling Picasso\'s formative years in Barcelona.',
      reason: 'Free entry on the first Sunday of each month causes huge queues. Timed-entry tickets are the way to go and they release weekly.',
      lat: 41.3851, lng: 2.1808, address: 'Carrer de Montcada, 15-23, 08003 Barcelona',
      monitorDesc: 'Timed-entry ticket alerts',
      reviews: [
        { name: 'Clara B.', initials: 'CB', stars: 5, text: 'The Las Meninas series alone is worth the visit. Beautiful medieval building too.' },
        { name: 'Ravi N.', initials: 'RN', stars: 4, text: 'Get the audio guide — it adds so much context to his early works.' },
      ]
    },
    'Park Güell Sunset Walk': {
      category: 'Park · Landmark',
      desc: 'Gaudí\'s fantastical public park perched on Carmel Hill offers mosaic-covered terraces, winding pathways, and panoramic views of the entire Barcelona skyline.',
      reason: 'The monumental zone requires timed tickets and the last entry slots (sunset) are the most popular. They sell out days in advance.',
      lat: 41.4145, lng: 2.1527, address: 'Carrer d\'Olot, 08024 Barcelona',
      monitorDesc: 'Sunset time slot alerts',
      reviews: [
        { name: 'Yuki T.', initials: 'YT', stars: 5, text: 'Sunset from the main terrace is magical. Arrived 30 min before for the best view.' },
        { name: 'Nina F.', initials: 'NF', stars: 5, text: 'The mosaic lizard is iconic but explore the garden paths — much quieter and stunning.' },
      ]
    },
    // Tokyo
    'Ramen District Tour': {
      category: 'Food · Tour',
      desc: 'Tokyo\'s ramen scene is legendary. From rich tonkotsu to light shio, each neighborhood has its own style. A guided tour hits the hidden gems locals swear by.',
      reason: 'Popular ramen tours max out at 8 people and fill up weeks ahead. We track cancellations and new availability windows.',
      lat: 35.6938, lng: 139.7035, address: 'Shinjuku, Tokyo',
      monitorDesc: 'Tour availability alerts',
      reviews: [
        { name: 'Mike C.', initials: 'MC', stars: 5, text: 'Best food tour I\'ve ever done. The tsukemen spot was a revelation.' },
        { name: 'Aiko H.', initials: 'AH', stars: 5, text: 'Our guide knew the chefs personally. Got to try dishes not on the menu!' },
      ]
    },
    'Imperial Palace Gardens': {
      category: 'Park · History',
      desc: 'The expansive gardens surrounding the Imperial Palace offer a serene escape in central Tokyo, with seasonal blooms, historic watchtowers, and a moat-side walking path.',
      reason: 'The inner palace grounds require free reservations that release monthly and fill within hours. Monitoring helps you grab a spot.',
      lat: 35.6852, lng: 139.7528, address: 'Chiyoda, Tokyo',
      monitorDesc: 'Reservation release alerts',
      reviews: [
        { name: 'John D.', initials: 'JD', stars: 4, text: 'Peaceful oasis in a busy city. The east gardens are open without reservation.' },
        { name: 'Sakura M.', initials: 'SM', stars: 5, text: 'Cherry blossom season here is unforgettable. Go early morning.' },
      ]
    },
    'Tsukiji Outer Market Tour': {
      category: 'Food · Market',
      desc: 'The legendary Tsukiji Outer Market is a maze of stalls serving the freshest sushi, tamagoyaki, and street food. Early morning visits offer the best selection.',
      reason: 'The most popular guided tours with tasting included sell out regularly. We\'ll alert you when new dates are posted.',
      lat: 35.6654, lng: 139.7707, address: 'Tsukiji 4-chome, Chuo, Tokyo',
      monitorDesc: 'Tour date release alerts',
      reviews: [
        { name: 'Chris P.', initials: 'CP', stars: 5, text: 'Go before 8 AM for the full experience. The tamago sandwich is a must.' },
        { name: 'Mei L.', initials: 'ML', stars: 5, text: 'So much better than Toyosu for atmosphere. Every stall was amazing.' },
      ]
    },
    'Asakusa & Senso-ji Temple': {
      category: 'Temple · Culture',
      desc: 'Tokyo\'s oldest temple, Senso-ji, sits at the end of the colorful Nakamise shopping street in the historic Asakusa district. Best experienced at dawn or dusk.',
      reason: 'Senso-ji is free to enter but nearby cultural experiences (tea ceremonies, kimono rentals) book up. We track the best-rated ones.',
      lat: 35.7148, lng: 139.7967, address: '2-3-1 Asakusa, Taito, Tokyo',
      monitorDesc: 'Experience booking alerts',
      reviews: [
        { name: 'Alex R.', initials: 'AR', stars: 5, text: 'Visit at 5 AM — nearly empty and the incense ritual is spiritual.' },
        { name: 'Hana K.', initials: 'HK', stars: 4, text: 'Nakamise street has great souvenirs. Try the melon bread near the gate.' },
      ]
    },
    'Shibuya Sky Observation Deck': {
      category: 'Viewpoint · Modern',
      desc: 'The rooftop observation deck atop Shibuya Scramble Square offers 360° views of Tokyo, including iconic views of the famous Shibuya Crossing from 230m up.',
      reason: 'Sunset time slots sell out days ahead and are the most photogenic. We\'ll notify you when your ideal time opens up.',
      lat: 35.6584, lng: 139.7022, address: 'Shibuya Scramble Square, Shibuya, Tokyo',
      monitorDesc: 'Sunset slot availability',
      reviews: [
        { name: 'Ryan G.', initials: 'RG', stars: 5, text: 'Best view in Tokyo, hands down. The open-air rooftop section is incredible.' },
        { name: 'Sophie T.', initials: 'ST', stars: 5, text: 'Book the sunset slot — watching Tokyo light up from up here is magical.' },
      ]
    },
    // Lisbon
    'Tram 28 Best Times': {
      category: 'Transit · Experience',
      desc: 'The iconic yellow Tram 28 winds through Lisbon\'s oldest neighborhoods — Alfama, Graça, and Baixa — offering a scenic, rattling ride through narrow cobblestone streets.',
      reason: 'Peak times mean 45+ min waits and packed cars. We monitor crowd patterns and alert you to the quietest departure windows.',
      lat: 38.7139, lng: -9.1334, address: 'Praça Martim Moniz, Lisbon',
      monitorDesc: 'Crowd monitoring · avoid peak hours',
      reviews: [
        { name: 'Pedro S.', initials: 'PS', stars: 4, text: 'Ride it before 9 AM or after 7 PM. Totally different experience without crowds.' },
        { name: 'Julia M.', initials: 'JM', stars: 5, text: 'Such a charming way to see the city. Grab a window seat on the right side.' },
      ]
    },
    'Belém Tower & Jerónimos': {
      category: 'Landmark · History',
      desc: 'The UNESCO-listed Belém Tower and Jerónimos Monastery are masterpieces of Manueline architecture, celebrating Portugal\'s Age of Discovery.',
      reason: 'Combined tickets save 30% but sell out online. Jerónimos queues can exceed 2 hours in peak season. Timed tickets are essential.',
      lat: 38.6916, lng: -9.2159, address: 'Belém, Lisbon',
      monitorDesc: 'Combined ticket alerts',
      reviews: [
        { name: 'Ana C.', initials: 'AC', stars: 5, text: 'The cloisters at Jerónimos are jaw-dropping. Go first thing in the morning.' },
        { name: 'Ben W.', initials: 'BW', stars: 4, text: 'Belém Tower is smaller than expected but the location on the river is beautiful.' },
      ]
    },
  };

  // Generic fallback for user must-dos
  function getDetailForActivity(name, emoji) {
    if (activityDetails[name]) {
      return Object.assign({ name: name, emoji: emoji }, activityDetails[name]);
    }
    // Generate a plausible detail for user must-dos
    var destCity = state.destination.split(',')[0] || 'your destination';
    return {
      name: name,
      emoji: emoji || '📌',
      category: 'Your Must-Do',
      desc: 'This is one of your personally selected activities for ' + destCity + '. Zenvoya will help you plan logistics, find the best times, and secure any reservations needed.',
      reason: 'You chose this as a must-do for your trip. We\'ll track availability, booking windows, and any deals to make sure you don\'t miss out.',
      lat: 41.3874 + (Math.random() - 0.5) * 0.02,
      lng: 2.1686 + (Math.random() - 0.5) * 0.02,
      address: destCity,
      monitorDesc: 'Availability & booking alerts',
      reviews: [
        { name: 'Zenvoya', initials: 'Z', stars: 5, text: 'Highly recommended by travelers with similar interests to yours.' },
      ]
    };
  }

  function openActivityDetail(name, emoji) {
    var detail = getDetailForActivity(name, emoji);

    document.getElementById('p6DetailEmoji').textContent = detail.emoji;
    document.getElementById('p6DetailTitle').textContent = detail.name;
    document.getElementById('p6DetailCategory').textContent = detail.category;
    document.getElementById('p6DetailDesc').textContent = detail.desc;
    document.getElementById('p6DetailReasonText').textContent = detail.reason;
    document.getElementById('p6DetailAddress').textContent = detail.address;
    document.getElementById('p6DetailMonitorDesc').textContent = detail.monitorDesc;

    // Reviews
    var reviewsContainer = document.getElementById('p6DetailReviews');
    reviewsContainer.innerHTML = '';
    detail.reviews.forEach(function(r) {
      var div = document.createElement('div');
      div.className = 'p6-detail-review';
      div.innerHTML = '<div class="p6-detail-review-top">' +
        '<span class="p6-detail-review-avatar">' + r.initials + '</span>' +
        '<span class="p6-detail-review-name">' + r.name + '</span>' +
        '<span class="p6-detail-review-stars">' + '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars) + '</span>' +
        '</div><p class="p6-detail-review-text">' + r.text + '</p>';
      reviewsContainer.appendChild(div);
    });

    // Map
    var mapContainer = document.getElementById('p6DetailMap');
    mapContainer.innerHTML = '';
    if (detailMap) { detailMap.remove(); detailMap = null; }
    detailMap = L.map(mapContainer, {
      center: [detail.lat, detail.lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(detailMap);
    L.marker([detail.lat, detail.lng], {
      icon: L.divIcon({
        html: '<div style="width:12px;height:12px;background:var(--brand);border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>',
        className: 'proto-leaflet-marker',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      }),
    }).addTo(detailMap);
    setTimeout(function() { detailMap.invalidateSize(); }, 100);

    // Show overlay
    detailOverlay.classList.add('open');
  }

  function closeActivityDetail() {
    detailOverlay.classList.remove('open');
    if (detailMap) { setTimeout(function() { detailMap.remove(); detailMap = null; }, 400); }
  }

  document.getElementById('p6DetailBack').addEventListener('click', closeActivityDetail);

  // Make activity items tappable on Step 5 and Step 6
  app.addEventListener('click', function(e) {
    // Step 5 activity items
    var actItem = e.target.closest('.p6-activity-item');
    if (actItem && !e.target.closest('.p6-toggle')) {
      var nameEl = actItem.querySelector('.p6-activity-name');
      var emojiEl = actItem.querySelector('.p6-activity-emoji');
      if (nameEl) openActivityDetail(nameEl.textContent, emojiEl ? emojiEl.textContent : '📌');
      return;
    }
    // Step 6 final activity items
    var finalItem = e.target.closest('.p6-final-act-item');
    if (finalItem && !e.target.closest('.p6-toggle') && !e.target.closest('.p6-final-act-remove')) {
      var nameEl2 = finalItem.querySelector('.p6-final-act-name');
      var emojiEl2 = finalItem.querySelector('.p6-final-act-emoji');
      var name = nameEl2 ? nameEl2.textContent.replace('Recommended', '').trim() : '';
      if (name) openActivityDetail(name, emojiEl2 ? emojiEl2.textContent : '📌');
      return;
    }
  });

  // Add tap affordance cursor to activity items
  var style = document.createElement('style');
  style.textContent = '.p6-activity-item, .p6-final-act-item { cursor: pointer; } .p6-activity-item:hover, .p6-final-act-item:hover { background: #F9F8F6; }';
  document.head.appendChild(style);

  // Initial progress
  updateProgress();
}

// =============================================
// PROTOTYPE 7 — Full App
// =============================================
var p7Initialized = false;

function initProto7() {
  if (p7Initialized) return;
  var app = document.getElementById('p7App');
  if (!app) return;
  p7Initialized = true;

  // ---- View switching ----
  var views = app.querySelectorAll('.p7-view');
  var tabs = app.querySelectorAll('.p7-tab, .p7-tab-center');
  var bottomNav = document.getElementById('p7BottomNav');
  var p7MapInstance = null;
  var p7RecMapInstance = null;

  var p7PreviousView = 'home';
  var p7CurrentView = 'home';

  function switchView(viewName) {
    if (viewName !== p7CurrentView) {
      p7PreviousView = p7CurrentView;
      p7CurrentView = viewName;
    }
    views.forEach(function(v) { v.classList.remove('p7-view-active'); });
    var target = app.querySelector('.p7-view[data-p7view="' + viewName + '"]');
    if (target) target.classList.add('p7-view-active');

    // Update tabs
    app.querySelectorAll('.p7-tab').forEach(function(t) { t.classList.remove('p7-tab-active'); });
    if (viewName === 'home') {
      var youTab = app.querySelector('.p7-tab[data-p7tab="home"]');
      if (youTab) youTab.classList.add('p7-tab-active');
    } else if (viewName === 'map' || viewName === 'record') {
      var mapTab = app.querySelector('.p7-tab[data-p7tab="map"]');
      if (mapTab) mapTab.classList.add('p7-tab-active');
    } else if (viewName === 'calendar') {
      var calTab = app.querySelector('.p7-tab[data-p7tab="calendar"]');
      if (calTab) calTab.classList.add('p7-tab-active');
      setTimeout(function() { initP7Calendar(); }, 50);
    } else if (viewName === 'trips') {
      var tripsTab = app.querySelector('.p7-tab[data-p7tab="trips"]');
      if (tripsTab) tripsTab.classList.add('p7-tab-active');
      setTimeout(function() { initP7Trips(); }, 50);
    }

    // Show/hide bottom nav
    if (viewName === 'create') {
      app.classList.add('p7-in-create');
    } else {
      app.classList.remove('p7-in-create');
    }

    // Init maps on demand
    if (viewName === 'map') {
      setTimeout(function() { initP7Map(); }, 100);
    }
    if (viewName === 'record') {
      setTimeout(function() { initP7RecMap(); }, 100);
    }
  }

  // Tab click handlers (order: Home, Map, +, Calendar, Trips)
  app.querySelector('.p7-tab[data-p7tab="home"]').addEventListener('click', function() { switchView('home'); });
  app.querySelector('.p7-tab[data-p7tab="map"]').addEventListener('click', function() { switchView('map'); });
  app.querySelector('.p7-tab[data-p7tab="calendar"]').addEventListener('click', function() { switchView('calendar'); });
  app.querySelector('.p7-tab[data-p7tab="trips"]').addEventListener('click', function() { switchView('trips'); });
  document.getElementById('p7Fab').addEventListener('click', function() {
    resetCreateTrip();
    switchView('create');
  });

  // Record float button
  document.getElementById('p7RecordFloat').addEventListener('click', function() { switchView('record'); });

  // ---- P7 GLOBE (cobe.js) ----
  var p7GlobeInstance = null;
  function initP7Globe() {
    var canvas = document.getElementById('p7Globe');
    if (!canvas) return;
    if (p7GlobeInstance) return;
    p7GlobeInstance = true;

    var ctx = canvas.getContext('2d');
    var W = canvas.width;
    var H = canvas.height;

    var arcsCanvas = document.getElementById('p7GlobeArcs');
    var arcsCtx = arcsCanvas ? arcsCanvas.getContext('2d') : null;

    var home = [40.7128, -74.006]; // NYC
    var visited = [
      [48.8566, 2.3522], [41.9028, 12.4964],
      [51.5074, -0.1278], [-33.8688, 151.2093], [37.5665, 126.978],
      [-22.9068, -43.1729], [10.8231, 106.6297], [-33.9249, 18.4241],
      [25.2048, 55.2708], [38.7223, -9.1393]
    ];
    var upcoming = [
      { coords: [35.6762, 139.6503], flag: '\ud83c\uddef\ud83c\uddf5' },  // Tokyo 🇯🇵
      { coords: [41.3851, 2.1734], flag: '\ud83c\uddea\ud83c\uddf8' }     // Barcelona 🇪🇸
    ];
    var arcRoutes = [
      { from: home, to: [48.8566, 2.3522] },
      { from: home, to: [35.6762, 139.6503] },
      { from: [48.8566, 2.3522], to: [41.3851, 2.1734] },
      { from: [35.6762, 139.6503], to: [10.8231, 106.6297] },
      { from: [51.5074, -0.1278], to: [25.2048, 55.2708] },
      { from: [-33.8688, 151.2093], to: [37.5665, 126.978] },
    ];

    // Flat equirectangular projection
    var padX = 20, padY = 15;
    function project(lat, lng) {
      var x = padX + (lng + 180) / 360 * (W - padX * 2);
      var y = padY + (90 - lat) / 180 * (H - padY * 2);
      return { x: x, y: y };
    }

    // Land bitmap from Natural Earth 110m — 360x180 (1° resolution)
    var mapB64 = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADf//8AAf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB////D//////n/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/gf/x////////wAAAAAbgAAB4AAAAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAf//8A///////+AAAAB/ngAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAcH3Hv/5////////8AAAAA/gAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAcIAAQP/AH///////+AAAAAPCAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAADwDAc+f+AP///////4AAAAAAAAAAAAAB4AAAAB/8AAAAAAAAAAAAAAAAAAAAAH9wc374AAAf/////8AAAAAAAAAAAAH4AAAA////AAAB/gAAAAAAAAAAAAAAAAwAAA/QAAAH/////8AAAAAAAAAAAAOAAAAP///wAAAAAAAAAAAAAAAAAAAAP8AYe+c3AAAD/////4AAAAAAAAAAAA4AAAH////++HgAOAAAAAAAAAAAAAAAfv+4+w/4gAAB/////wAAAAAAAAAAADwAHgH///////4AfgAAAAAgAAAAAAAAPf/4O4//9AAB/////wAAAAAAAAAAADwAPb////////4m//gAAAAAAAf+AAAAAA/+A8f//4AB////8gAAAAAAA/gAAAAAfv/////////////8AAAAAB///+H//H/+PeDwf+AA3////AAAAAAA//4AAAA8fv///////////////P8gAf////////A4CPz4H8AAP///wAAAAAAD///wADH/n3/////////////////8AD////////////34Z/wA///4AAAAAAAP///+M////n/////////////////+4E/////////////gD/8Af//gAAAAAAAf//5+P////f/////////////////fw/////////////6AD8YAf/wAAf8AAAA/8f+D///////////////////////AgEf///////////zw7/AAP/gAAP4AAAB/4/+f//////////////////////8AMAf//////////+DIA/gAH/gAAAAAAAH/z/////////////////////////+AAH///////////8AwgOAAD+AAAAAAAA//H/////////////////////////6AAP///////////wAA/AAAB+AAAAAAAB/+H//////////////////////nP+AAAH//z////////wAA/wAAAOAAAAAAAB//D/////////////////////+A/4AAAA/zAD///////gAA/4wAAAAAAAAAAB//Ab///////////////////+eDgAAAAABwAA///////4AA/94AAAAAAAAAYA5+A///////////////////4AAHAAAAAADcAAD//////4AAf/8AAAAAAAAA8AC+C///////////////////wAAfgAAAAAMAAAA///////wAf/8AAAAAAAAA4AO8H///////////////////AAA/gAAAABgAAAA///////8A///AAAAAAAAA8ANwH//////////////////8AAB/AAAAAEAAAAAf///////z///4AAAAAAAHOAEDv//////////////////+AAA+AAAAAAAAAABH///////x///8AAAAAAAHHAf/////////////////////6AA8AAAAAAAAAAAD///////x///8AAAAAAAGPz//////////////////////6AAwAAAAAAAAAAAD///////9///6AAAAAAAAPj//////////////////////6AAQAAAAAAAAAAAC///////////MAAAAAAAAYf//////////////////////7AAAAAAAAAAAAAABv////////+MNAAAAAAAAD///////////////////////zAAAAAAAAAAAAAAAH////////7gfgAAAAAAAf///////////////////////yAAAAAAAAAAAAAAAL/////////gCgAAAAAAAH///////////////////////iAAAAAAAAAAAAAAAP/////////pAAAAAAAAAD/////uP/x//////////////DAAAAAAAAAAAAAAAP/////////+AAAAAAAAAB//v//Gf/B/////////////+AAAAAAAAAAAAAAAAP////////8wAAAAAAAAAB//H/+AP+P/////////////8CAAAAAAAAAAAAAAAP////////wAAAAAAAAADj/jz/8AD/H/////////////4HgAAAAAAAAAAAAAAP////////gAAAAAAAAAH/4Bw/8AA/B////////////+APAAAAAAAAAAAAAAAP////////gAAAAAAAAAH/wA8f8Ph/g////////////8AAAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/gMHfJ///x///////////v4AMAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/AMCOP///h//////////+JwAMAAAAAAAAAAAAAAAH///////4AAAAAAAAAAH/AAAHH///g//////////8BwAIAAAAAAAAAAAAAAAH///////wAAAAAAAAAAH+AAYGH///w//////////+w4A4AAAAAAAAAAAAAAAD///////wAAAAAAAAAAAgf+ACBs//////////////g4D4AAAAAAAAAAAAAAAB///////wAAAAAAAAAAAj/+AAAA//////////////AYf4AAAAAAAAAAAAAAAA///////gAAAAAAAAAAB//8AAAA//////////////Ah2AAAAAAAAAAAAAAAAAP/////+AAAAAAAAAAAD//+AAAB//////////////gDwAAAAAAAAAAAAAAAAAH/////8AAAAAAAAAAAH///4GAB//////////////gDAAAAAAAAAAAAAAAAAAG/////4AAAAAAAAAAAP///8P4h//////////////wCAAAAAAAAAAAAAAAAAACf////4AAAAAAAAAAAP////v////////////////gAAAAAAAAAAAAAAAAAAABP//hgYAAAAAAAAAAAP//////3//P///////////wAAAAAAAAAAAAAAAAAAAAv//AAYAAAAAAAAAAAf//////9//H///////////wAAAAAAAAAAAAAAAAAAAB3/+AAcAAAAAAAAAAB///////4//h///////////gAAAAAAAAAAAAAAAAAAAAR/+AANAAAAAAAAAAD///////8//wH//////////AAAAAAAAAAAAAAAAAAAAAJ/+AAEAAAAAAAAAAH///////+f/0B/////////+AAAAAAAAAAAAAAAAAAAAAI/8AAAAAAAAAAAAAH///////+f/44Af///////+QAAAAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAP////////H//+AP///////4gAAAAAAAAAAAAAAAAAAAAAP8AAuAAAAAAAAAAP////////H///AD///v///ggAAAAAAAAAAAAAAAAAAAAAH+AABgAAAAAAAAAf////////n//+AD//4P//YAAAAAAAAAAAAAAAAAAAAAAAP+A4AYAAAAAAAAAP////////j//+AAf/4H/+AAAAAAAAAAAAAAAAgAAAAAAAH/B4ABwAAAAAAAAP////////h//8AAf/gD/8YAAAAAAAAAAAAAAAAAAAAAAAD/nwAD9AAAAAAAAP////////x//4AAf/AD/8QAAAAAAAAAAAAAAAAAAAAAAAAf/wAAAAAAAAAAAP////////4//gAAf+AD/+AAwAAAAAAAAAAAAAAAAAAAAAAH/wAAAAAAAAAAAf////////4f+AAAf8AD//AAwAAAAAAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAf////////8f8AAAPwAAP/gAwAAAAAAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAf////////+fgAAAPwAAP/gAwAAAAAAAAAAAAAAAAAAAAAAAA/AAAAAAAAAAAf/////////eAAAAHwAAP/gAMAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAAAAAAAf/////////gAAAAHwAAM/gACAAAAAAAAAAAAAAAAAAAAAAAADABAAAAAAAAAP/////////gYAAADwAAEfgAJAAAAAAAAAAAAAAAAAAAAAAAADgPfKAAAAAAAH/////////34AAADwAAIOABAAAAAAAAAAAAAAAAAAAAAAAAAAyPf+AAAAAAAD//////////4AAADoAAIEACBAAAAAAAAAAAAAAAAAAAAAAAAA8///AAAAAAAB//////////wAAABIAAMAAAFAAAAAAAAAAAAAAAAAAAAAAAAAE///gAAAAAAB//////////wAAAAMAAEAAALgAAAAAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAf/////////gAAAAMAADAAMCAAAAAAAAAAAAAAAAAAAAAAAAAA////gAAAAAAP/B///////gAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAf///wAAAAAACAA///////AAAAAAAAxgA+AAAAAAAAAAAAAAAAAAAAAAAAAAAf///4AAAAAAAAAD/////+AAAAAAAAZgB4AAAAAAAAAAAAAAAAAAAAAAAAAAB////4AAAAAAAAAD/////8AAAAAAAAMwH8AAAAAAAAAAAAAAAAAAAAAAAAAAB////8AAAAAAAAAH/////4AAAAAAAAHQf8AIAAAAAAAAAAAAAAAAAAAAAAAAD////8AAAAAAAAAH/////gAAAAAAAAHgf88IAAAAAAAAAAAAAAAAAAAAAAAAD////+AAAAAAAAAH/////AAAAAAAAABwP5wBwAAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAH/////AAAAAAAAADwf8AAgAAAAAAAAAAAAAAAAAAAAAAAH/////6AAAAAAAAD////+AAAAAAAAAB8P5wATwAAAAAAAAAAAAAAAAAAAAAAD//////4AAAAAAAB////8AAAAAAAAAA8AxQif+AAAAAAAAAAAAAAAAAAAAAAH//////8AAAAAAAB////4AAAAAAAAAAcAAIAD/gAAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////4AAAAAAAAAAMAAIAI/ywAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////4AAAAAAAAAADgAAAI/8BAAAAAAAAAAAAAAAAAAAAD///////gAAAAAAAf///4AAAAAAAAAAB+AAAA/4AIAAAAAAAAAAAAAAAAAAAB///////gAAAAAAAf///4AAAAAAAAAAAAmogAOMAAAAAAAAAAAAAAAAAAAAAB///////AAAAAAAAf///8AAAAAAAAAAAABCAAAGADAAAAAAAAAAAAAAAAAAAA///////AAAAAAAAf///8AAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAf/////+AAAAAAAAP///8AAAAAAAAAAAAAAAgCAAAAAAAAAAAAAAAAAAAAAAAf/////8AAAAAAAAf///+AQAAAAAAAAAAAAB+CAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAAf///+AQAAAAAAAAAAAAD8DAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAA////+AwAAAAAAAAAAAA38DgAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAA////8BwAAAAAAAAAAAD/8DgAAAAAAAAAAAAAAAAAAAAAAB/////4AAAAAAAA////8PwAAAAAAAAAAAD//HwAABABAAAAAAAAAAAAAAAAAAf////4AAAAAAAA////wPgAAAAAAAAAAAP//3wAAAACAAAAAAAAAAAAAAAAAAP////wAAAAAAAA////APgAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgAAAAAAAAAAAf///4AAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgAAAAAAAAAAD////+AAIAAAAAAAAAAAAAAAAAAAAP////gAAAAAAAAP//+AfAAAAAAAAAAAf////+AAEAAAAAAAAAAAAAAAAAAAAP////AAAAAAAAAP///AfAAAAAAAAAAA//////AAAAAAAAAAAAAAAAAAAAAAAP///4AAAAAAAAAP//+APAAAAAAAAAAA//////gAAAAAAAAAAAAAAAAAAAAAAf///gAAAAAAAAAH//+AOAAAAAAAAAAB//////wAAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAH//4AEAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAH//4AAAAAAAAAAAAB//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAH//4AAAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAD//wAAAAAAAAAAAAAf/////8AAAAAAAAAAAAAAAAAAAAAAf//8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///4AAAAAAAAAAA//AAAAAAAAAAAAAAP/////4AAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAAAAA/+AAAAAAAAAAAAAAP/AP//wAAAAAAAAAAAAAAAAAAAAAA///gAAAAAAAAAAA/4AAAAAAAAAAAAAAf8AG//gAAAAAAAAAAAAAAAAAAAAAA//3AAAAAAAAAAAAYAAAAAAAAAAAAAAAOAAF//gAAAAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//AAABAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAgAAAAAAAAAAAAAAAAAD//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAQAAAAAAAAAAAAAAAAAB//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYAAAAcAAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAADQAAAAAAAAAAAAAAAAAD/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAHAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAOAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAH4AAAAAAB4HgAD8AAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAA//AAAD//////////wAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAf///4Af///////////AAAAAAAAAAAAAAAAAAAAAAAz4AAAAAAAAAAAAAAAPz////8B/////////////wAAAAAAAAAAAAAAAAAAAAA78AAAAAAAAAAA8/8///////wf/////////////+AAAAAAAAAAAAAAAAAAAAH9+AAAAAAAAZ////////////w////////////////4AAAAAAAAAAAAAAAAAAAB+AAAAAAAB//////////////////////////////4AAAAAAAAABmAAB8f+HB/+AAAAAAAP//////////////////////////////gAAAAAAAAP/c/oAf/////4AAAAAAAP/////////////////////////////8AAAAAAAD/////////////gAAAAAAB//////////////////////////////wAAAAAAAD////////////wAAAAAAP///////////////////////////////wAAAAAD/////////////4AAAAAAD////////////////////////////////wAAAADh/////////////AAAAB8A/////////////////////////////////+AAAAA4Af///////////gAAAH+AA///////////////////////////////+AAAAAAAAH///////////+A/A/wAA///////////////////////////////8AAAAAAAf//////////////gAAAf////////////////////////////////+AAAAAAAH///////////////h////////////////////////////////////wAAAAAAP/////////////////////////////////////////////////////gA+/gAAH/////////////////////////////////////////////////////8/////v//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////";
    var mapW = 360, mapH = 180;
    // Decode base64 bitmap to typed array
    var raw = atob(mapB64);
    var mapBytes = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) mapBytes[i] = raw.charCodeAt(i);

    // Land lookup from bitmap
    function isLand(lat, lng) {
      var col = Math.round((lng + 180) / 360 * (mapW - 1));
      var row = Math.round((90 - lat) / 180 * (mapH - 1));
      if (col < 0 || col >= mapW || row < 0 || row >= mapH) return false;
      var idx = row * mapW + col;
      var byteIdx = Math.floor(idx / 8);
      var bitIdx = 7 - (idx % 8);
      return (mapBytes[byteIdx] >> bitIdx) & 1;
    }

    // Theme detection
    var bgStyle = getComputedStyle(document.documentElement);
    var bgColor = bgStyle.getPropertyValue('--bg-secondary').trim();
    var isDark = bgColor === '#1A1614' || bgColor.startsWith('#1') || bgColor.startsWith('#0');
    var landDotColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)';

    // Draw dot matrix map
    var step = 1.5;
    var dotR = (W / 360) * step * 0.3;
    var markerR = dotR * 4;
    var homeR = markerR * 1.5;

    for (var lat = -60; lat <= 84; lat += step) {
      for (var lng = -180; lng <= 180; lng += step) {
        if (isLand(lat, lng)) {
          var p = project(lat, lng);
          ctx.beginPath();
          ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = landDotColor;
          ctx.fill();
        }
      }
    }

    // Visited destination dots — solid purple
    visited.forEach(function(d) {
      var p = project(d[0], d[1]);
      ctx.beginPath();
      ctx.arc(p.x, p.y, markerR, 0, Math.PI * 2);
      ctx.fillStyle = '#7C3AED';
      ctx.fill();
    });

    // Upcoming trip dots — white fill, black outline, flag emoji
    var upcomingR = homeR * 1.8;
    var flagSize = upcomingR * 1.5;
    upcoming.forEach(function(d) {
      var p = project(d.coords[0], d.coords[1]);
      ctx.beginPath();
      ctx.arc(p.x, p.y, upcomingR, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#000';
      ctx.stroke();
      ctx.font = flagSize + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(d.flag, p.x, p.y + 1);
    });

    // Home marker — large black circle with 🏠 emoji
    var homePinR = homeR * 2.2;
    var hp = project(home[0], home[1]);
    ctx.beginPath();
    ctx.arc(hp.x, hp.y, homePinR, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000';
    ctx.stroke();
    var pinSize = homePinR * 1.3;
    ctx.font = pinSize + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\ud83c\udfe0', hp.x, hp.y + 1);

    // Animated dotted arcs on overlay canvas
    function drawArcs() {
      if (!arcsCtx) return;
      arcsCtx.clearRect(0, 0, W, H);
      var t = Date.now();

      arcRoutes.forEach(function(route, ri) {
        var p1 = project(route.from[0], route.from[1]);
        var p2 = project(route.to[0], route.to[1]);

        var mx = (p1.x + p2.x) / 2;
        var my = (p1.y + p2.y) / 2;
        var dx = p2.x - p1.x, dy = p2.y - p1.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var bulge = dist * 0.25;
        var cpx = mx, cpy = my - bulge;

        // Dotted arc line — animated dash offset
        var dashLen = 12, gapLen = 10;
        var dashOffset = (t * 0.04 + ri * 50) % (dashLen + gapLen);
        arcsCtx.beginPath();
        arcsCtx.moveTo(p1.x, p1.y);
        arcsCtx.quadraticCurveTo(cpx, cpy, p2.x, p2.y);
        arcsCtx.setLineDash([dashLen, gapLen]);
        arcsCtx.lineDashOffset = -dashOffset;
        arcsCtx.strokeStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
        arcsCtx.lineWidth = 4;
        arcsCtx.stroke();
        arcsCtx.setLineDash([]);

        // Traveling dot with trail
        var speed = 4000 + ri * 1200;
        var progress = ((t + ri * 700) % speed) / speed;
        var dotColor = isDark ? '255,255,255' : '0,0,0';
        for (var ti = 0; ti < 6; ti++) {
          var tp = Math.max(0, progress - ti * 0.018);
          var inv = 1 - tp;
          var tx = inv * inv * p1.x + 2 * inv * tp * cpx + tp * tp * p2.x;
          var ty = inv * inv * p1.y + 2 * inv * tp * cpy + tp * tp * p2.y;
          var alpha = (1 - ti / 6) * 0.8;
          arcsCtx.beginPath();
          arcsCtx.arc(tx, ty, 6 - ti * 0.6, 0, Math.PI * 2);
          arcsCtx.fillStyle = 'rgba(' + dotColor + ', ' + alpha + ')';
          arcsCtx.fill();
        }
      });

      requestAnimationFrame(drawArcs);
    }
    drawArcs();
  }
  // Init map on load
  setTimeout(initP7Globe, 300);

  // ---- HOME VIEW: Upcoming Trips & Reminders ----
  function renderHomeTrips() {
    var el = document.getElementById('p7HomeTrips');
    if (!el) return;
    var trips = p7TripsData.upcoming || [];
    var html = '';
    trips.slice(0, 2).forEach(function(trip, idx) {
      html += '<div class="p7-home-trip-item" data-home-trip-idx="' + idx + '">';
      html += '<img class="p7-home-trip-img" src="' + trip.img + '" alt="" onerror="this.style.background=\'var(--border-opaque)\';this.style.height=\'40px\'">';
      html += '<div class="p7-home-trip-info"><span class="p7-home-trip-name">' + trip.emoji + ' ' + trip.dest + '</span>';
      html += '<span class="p7-home-trip-dates">' + trip.dates + '</span></div>';
      html += '<span class="p7-home-trip-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>';
      html += '</div>';
    });
    el.innerHTML = html;
  }

  function renderHomeReminders() {
    var el = document.getElementById('p7HomeReminders');
    if (!el) return;
    var now = new Date();
    var currentMonth = now.getMonth();
    var currentYear = now.getFullYear();
    // Get upcoming events from current month onward
    var upcoming = p7CalEvents.filter(function(e) {
      if (e.year > currentYear) return true;
      if (e.year === currentYear && e.month > currentMonth) return true;
      if (e.year === currentYear && e.month === currentMonth && e.day >= now.getDate()) return true;
      return false;
    });
    upcoming.sort(function(a, b) {
      if (a.year !== b.year) return a.year - b.year;
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    });
    var monthNames3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var colorBg = { purple: 'rgba(124,58,237,0.1)', orange: 'rgba(245,158,11,0.1)', blue: 'rgba(37,99,235,0.1)' };
    var html = '';
    upcoming.slice(0, 3).forEach(function(e, idx) {
      var bg = colorBg[e.color] || colorBg.purple;
      html += '<div class="p7-home-reminder-item" data-home-reminder-idx="' + idx + '" data-reminder-day="' + e.day + '" data-reminder-month="' + e.month + '" data-reminder-year="' + e.year + '">';
      html += '<div class="p7-home-reminder-icon" style="background:' + bg + '">' + e.emoji + '</div>';
      html += '<div class="p7-home-reminder-info"><span class="p7-home-reminder-name">' + e.name + '</span>';
      html += '<span class="p7-home-reminder-meta">' + (e.meta || '') + '</span></div>';
      html += '<span class="p7-home-reminder-time">' + monthNames3[e.month] + ' ' + e.day + '</span>';
      html += '</div>';
    });
    el.innerHTML = html;
  }

  // Home trip click → open trip detail
  document.getElementById('p7HomeTrips').addEventListener('click', function(e) {
    var item = e.target.closest('.p7-home-trip-item');
    if (!item) return;
    var idx = parseInt(item.getAttribute('data-home-trip-idx'));
    var trips = p7TripsData.upcoming || [];
    var trip = trips[idx];
    if (trip) openTripDetail(trip, 'upcoming');
  });

  // Home reminder click → go to calendar and open reminder detail
  document.getElementById('p7HomeReminders').addEventListener('click', function(e) {
    var item = e.target.closest('.p7-home-reminder-item');
    if (!item) return;
    var day = parseInt(item.getAttribute('data-reminder-day'));
    var month = parseInt(item.getAttribute('data-reminder-month'));
    var year = parseInt(item.getAttribute('data-reminder-year'));
    // Navigate to calendar view at that month
    p7CalMonth = month;
    p7CalYear = year;
    p7SelectedDay = day;
    p7CalView = 'month';
    switchView('calendar');
    renderCalendar();
    // Find and click the matching event to open detail
    setTimeout(function() {
      var evtCards = document.querySelectorAll('#p7CalEvents .p7-cal-event-card');
      if (evtCards.length > 0) evtCards[0].click();
    }, 100);
  });

  // renderHomeTrips & renderHomeReminders called after data is defined (below)

  // ---- MAP VIEW ----
  var p7MapCityMarkers = [];
  var p7MapFriendMarkers = [];
  var p7ActiveFriend = 'me';

  // City-trip mapping (which trips visited which cities)
  var p7CityTrips = {
    'Paris': [{ dest: 'Paris, France', dates: 'Dec 2025', emoji: '\uD83C\uDDEB\uD83C\uDDF7', filter: 'past', idx: 0 }],
    'Lyon': [{ dest: 'Paris, France', dates: 'Dec 2025', emoji: '\uD83C\uDDEB\uD83C\uDDF7', filter: 'past', idx: 0 }],
    'Rome': [{ dest: 'Rome, Italy', dates: 'Oct 2025', emoji: '\uD83C\uDDEE\uD83C\uDDF9', filter: 'past', idx: 2 }],
    'Barcelona': [{ dest: 'Barcelona, Spain', dates: 'May 2026', emoji: '\uD83C\uDDEA\uD83C\uDDF8', filter: 'upcoming', idx: 1 }],
    'Lisbon': [{ dest: 'Lisbon, Portugal', dates: 'Mar 2026', emoji: '\uD83C\uDDF5\uD83C\uDDF9', filter: 'recent', idx: 0 }],
    'Madrid': [{ dest: 'Barcelona, Spain', dates: 'May 2026', emoji: '\uD83C\uDDEA\uD83C\uDDF8', filter: 'upcoming', idx: 1 }],
  };

  // Friend data for map
  var p7FriendData = {
    f1: { name: 'Alex', color: '#3B82F6', cities: [
      { name: 'London', lat: 51.51, lng: -0.13 },
      { name: 'Amsterdam', lat: 52.37, lng: 4.90 },
      { name: 'Berlin', lat: 52.52, lng: 13.41 },
    ]},
    f2: { name: 'Mia', color: '#10B981', cities: [
      { name: 'Tokyo', lat: 35.68, lng: 139.69 },
      { name: 'Seoul', lat: 37.57, lng: 126.98 },
    ]},
    f3: { name: 'Jordan', color: '#F59E0B', cities: [
      { name: 'Dubai', lat: 25.20, lng: 55.27 },
      { name: 'Istanbul', lat: 41.01, lng: 28.98 },
      { name: 'Athens', lat: 37.98, lng: 23.73 },
    ]},
    f4: { name: 'Sam', color: '#EF4444', cities: [
      { name: 'Sydney', lat: -33.87, lng: 151.21 },
      { name: 'Bali', lat: -8.65, lng: 115.22 },
    ]},
  };

  function initP7Map() {
    if (p7MapInstance) { p7MapInstance.invalidateSize(); return; }
    var mapEl = document.getElementById('p7Map');
    if (!mapEl || typeof L === 'undefined') return;

    p7MapInstance = L.map(mapEl, {
      center: [40.71, -74.01], zoom: 4, zoomControl: false, attributionControl: false
    });
    // Default colored map tiles (OpenStreetMap standard)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(p7MapInstance);

    // User location dot (New York)
    L.marker([40.71, -74.01], {
      icon: L.divIcon({
        html: '<div class="p7-user-location-dot"></div>',
        className: 'proto-leaflet-marker',
        iconSize: [14, 14], iconAnchor: [7, 7]
      })
    }).addTo(p7MapInstance);

    // City pins for user (Europe + US)
    var cities = [
      { name: 'Paris', lat: 48.86, lng: 2.35 },
      { name: 'Lyon', lat: 45.76, lng: 4.84 },
      { name: 'Rome', lat: 41.90, lng: 12.50 },
      { name: 'Barcelona', lat: 41.39, lng: 2.17 },
      { name: 'Lisbon', lat: 38.72, lng: -9.14 },
      { name: 'Madrid', lat: 40.42, lng: -3.70 },
      { name: 'Los Angeles', lat: 34.05, lng: -118.24 },
      { name: 'San Francisco', lat: 37.77, lng: -122.42 },
      { name: 'Chicago', lat: 41.88, lng: -87.63 },
      { name: 'Miami', lat: 25.76, lng: -80.19 },
      { name: 'Boston', lat: 42.36, lng: -71.06 },
      { name: 'Washington DC', lat: 38.91, lng: -77.04 },
      { name: 'Nashville', lat: 36.16, lng: -86.78 },
      { name: 'Seattle', lat: 47.61, lng: -122.33 },
    ];

    p7MapCityMarkers = [];
    cities.forEach(function(c) {
      var marker = L.marker([c.lat, c.lng], {
        icon: L.divIcon({
          html: '<span class="proto-map-badge-count proto-map-badge-spot" style="cursor:pointer;">\u2713 ' + c.name + '</span>',
          className: 'proto-leaflet-marker',
          iconSize: null, iconAnchor: [0, 0]
        })
      }).addTo(p7MapInstance);

      // On click, show trip popup for this city
      var cityTrips = p7CityTrips[c.name] || [];
      if (cityTrips.length) {
        marker.on('click', function() {
          var popupHtml = '<div style="min-width:140px">';
          cityTrips.forEach(function(ct, ti) {
            popupHtml += '<div class="p7-city-trip-item" data-city-trip-filter="' + ct.filter + '" data-city-trip-idx="' + ct.idx + '">';
            popupHtml += '<span class="p7-city-trip-emoji">' + ct.emoji + '</span>';
            popupHtml += '<span>' + ct.dest + '</span>';
            popupHtml += '<span class="p7-city-trip-date">' + ct.dates + '</span>';
            popupHtml += '</div>';
          });
          popupHtml += '</div>';
          L.popup({ className: 'p7-city-popup', closeButton: true })
            .setLatLng([c.lat, c.lng])
            .setContent(popupHtml)
            .openOn(p7MapInstance);
        });
      }
      p7MapCityMarkers.push(marker);
    });

    // Upcoming trip location pins
    var upcomingTrips = [
      { name: 'Tokyo', lat: 35.68, lng: 139.69, emoji: '🇯🇵', dest: 'Tokyo, Japan', dates: 'Apr 12 – Apr 22', filter: 'upcoming', idx: 0 },
      { name: 'Barcelona', lat: 41.39, lng: 2.17, emoji: '🇪🇸', dest: 'Barcelona, Spain', dates: 'May 20 – May 27', filter: 'upcoming', idx: 1 }
    ];
    upcomingTrips.forEach(function(t) {
      var marker = L.marker([t.lat, t.lng], {
        icon: L.divIcon({
          html: '<span class="p7-upcoming-pin">'
            + '<span class="p7-upcoming-pin-top">'
            + '<span class="p7-upcoming-pin-emoji">' + t.emoji + '</span>'
            + '<span class="p7-upcoming-pin-name">' + t.name + '</span>'
            + '</span>'
            + '<span class="p7-upcoming-pin-dates">' + t.dates + '</span>'
            + '</span>',
          className: 'proto-leaflet-marker',
          iconSize: null, iconAnchor: [0, 0]
        })
      }).addTo(p7MapInstance);
      marker.on('click', function() {
        var trips = p7TripsData[t.filter] || [];
        var trip = trips[t.idx];
        if (trip) openTripDetail(trip, t.filter);
      });
    });

    // Draw animated arced dotted lines from user home (New York) to upcoming trip locations
    var homeLat = 40.71, homeLng = -74.01;
    function p7ArcPoints(from, to, segments, arcHeight) {
      var points = [];
      for (var i = 0; i <= segments; i++) {
        var t = i / segments;
        var lat = from[0] + (to[0] - from[0]) * t;
        var lng = from[1] + (to[1] - from[1]) * t;
        // Parabolic arc: peaks at t=0.5
        var arc = arcHeight * 4 * t * (1 - t);
        lat += arc;
        points.push([lat, lng]);
      }
      return points;
    }
    upcomingTrips.forEach(function(t) {
      // Calculate arc height based on distance
      var dlat = Math.abs(t.lat - homeLat);
      var dlng = Math.abs(t.lng - homeLng);
      var dist = Math.sqrt(dlat * dlat + dlng * dlng);
      var arcH = Math.max(dist * 0.2, 8);
      var arcPts = p7ArcPoints([homeLat, homeLng], [t.lat, t.lng], 60, arcH);
      L.polyline(arcPts, {
        color: '#1a1a1a',
        weight: 1.5,
        opacity: 0.6,
        dashArray: '6, 10',
        className: 'p7-route-animated'
      }).addTo(p7MapInstance);
    });

    // Map starts centered on user's home location (New York)

    // Toggle city pin labels based on zoom level
    function p7UpdatePinLabels() {
      var zoom = p7MapInstance.getZoom();
      var pins = document.querySelectorAll('#p7Map .proto-map-badge-spot');
      pins.forEach(function(pin) {
        if (zoom <= 4) {
          pin.setAttribute('data-full', pin.getAttribute('data-full') || pin.textContent);
          pin.textContent = '✓';
          pin.classList.add('p7-pin-compact');
        } else {
          var full = pin.getAttribute('data-full');
          if (full) pin.textContent = full;
          pin.classList.remove('p7-pin-compact');
        }
      });
    }
    p7MapInstance.on('zoomend', p7UpdatePinLabels);
    // Run once on init
    setTimeout(p7UpdatePinLabels, 200);

    // Handle trip clicks from city popup
    p7MapInstance.on('popupopen', function() {
      setTimeout(function() {
        document.querySelectorAll('.p7-city-trip-item').forEach(function(item) {
          item.addEventListener('click', function() {
            var filter = this.getAttribute('data-city-trip-filter');
            var idx = parseInt(this.getAttribute('data-city-trip-idx'));
            var trips = p7TripsData[filter] || [];
            var trip = trips[idx];
            if (trip) {
              p7MapInstance.closePopup();
              openTripDetail(trip, filter);
            }
          });
        });
      }, 50);
    });

    // Friend avatar clicks
    app.querySelectorAll('.p7-avatar-item').forEach(function(item) {
      item.addEventListener('click', function() {
        app.querySelectorAll('.p7-avatar-item').forEach(function(a) { a.classList.remove('p7-avatar-selected'); });
        this.classList.add('p7-avatar-selected');
        var friendId = this.getAttribute('data-friend');
        p7ActiveFriend = friendId;
        p7ShowFriendMarkers(friendId);
      });
    });
  }

  function p7ShowFriendMarkers(friendId) {
    // Clear existing friend markers
    p7MapFriendMarkers.forEach(function(m) { if (p7MapInstance) p7MapInstance.removeLayer(m); });
    p7MapFriendMarkers = [];

    if (friendId === 'me' || !p7FriendData[friendId]) return;

    var friend = p7FriendData[friendId];
    friend.cities.forEach(function(c) {
      var marker = L.marker([c.lat, c.lng], {
        icon: L.divIcon({
          html: '<span class="p7-friend-badge" style="background:' + friend.color + ';">\u2713 ' + c.name + '</span>',
          className: 'proto-leaflet-marker',
          iconSize: null, iconAnchor: [0, 0]
        })
      }).addTo(p7MapInstance);

      // Friend city click shows popup with trip info
      marker.on('click', function() {
        var popupHtml = '<div style="min-width:120px;padding:8px;text-align:center;">';
        popupHtml += '<strong style="font-size:13px;">' + friend.name + ' visited ' + c.name + '</strong>';
        popupHtml += '</div>';
        L.popup({ closeButton: true })
          .setLatLng([c.lat, c.lng])
          .setContent(popupHtml)
          .openOn(p7MapInstance);
      });
      p7MapFriendMarkers.push(marker);
    });

    // Pan to show friend's cities
    if (friend.cities.length) {
      var bounds = L.latLngBounds(friend.cities.map(function(c) { return [c.lat, c.lng]; }));
      p7MapInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }

  // ---- RECORD VIEW (P5-style) ----
  var p7RecordState = { started: false, simInterval: null, timerInterval: null, elapsed: 0, idx: 0, autoStarted: false };

  var trailData = [
    { lat: 35.6595, lng: 139.7004, time: '9:00 AM', name: 'Shibuya Station', type: 'Transit' },
    { lat: 35.6614, lng: 139.7041, time: '9:30 AM', name: 'Shibuya Crossing', type: 'Landmark' },
    { lat: 35.6654, lng: 139.6983, time: '10:00 AM', name: 'Yoyogi Park', type: 'Park' },
    { lat: 35.6716, lng: 139.6966, time: '10:30 AM', name: 'Meiji Shrine', type: 'Temple' },
    { lat: 35.6702, lng: 139.7027, time: '11:00 AM', name: 'Takeshita Street', type: 'Shopping' },
    { lat: 35.6762, lng: 139.7095, time: '11:30 AM', name: 'Cat Street', type: 'Shopping' },
    { lat: 35.6808, lng: 139.7142, time: '12:00 PM', name: 'Omotesando', type: 'Dining' },
    { lat: 35.6852, lng: 139.7103, time: '12:30 PM', name: 'Nezu Museum Area', type: 'Museum' },
  ];

  // Reco spots clustered near the user trail (Shibuya → Harajuku → Omotesando area)
  var p7Recommendations = [
    { lat: 35.6608, lng: 139.7020, name: 'Ichiran Ramen', emoji: '\uD83C\uDF5C', desc: '2 min walk \u00B7 Top rated ramen', badge: '97% match' },
    { lat: 35.6625, lng: 139.7060, name: 'Togo Shrine', emoji: '\u26E9\uFE0F', desc: '1 min walk \u00B7 Hidden gem', badge: 'Nearby' },
    { lat: 35.6660, lng: 139.6955, name: 'Yoyogi Village', emoji: '\uD83C\uDF3F', desc: '2 min walk \u00B7 Caf\u00E9 complex', badge: 'Local fav' },
    { lat: 35.6680, lng: 139.7040, name: 'Harajuku Gyoza', emoji: '\uD83E\uDD5F', desc: '1 min walk \u00B7 Best gyoza', badge: '94% match' },
    { lat: 35.6710, lng: 139.7010, name: 'Design Festa Gallery', emoji: '\uD83C\uDFA8', desc: '2 min walk \u00B7 Art space', badge: 'For you' },
    { lat: 35.6730, lng: 139.7060, name: 'Tokyu Hands', emoji: '\uD83D\uDECD\uFE0F', desc: '1 min walk \u00B7 Unique gifts', badge: 'Shopping' },
    { lat: 35.6770, lng: 139.7115, name: 'Aoyama Flower Market', emoji: '\uD83C\uDF38', desc: '2 min walk \u00B7 Caf\u00E9 & flowers', badge: 'Trending' },
    { lat: 35.6810, lng: 139.7090, name: 'Nezu Caf\u00E9', emoji: '\u2615', desc: '3 min walk \u00B7 Garden caf\u00E9', badge: 'Must see' },
  ];

  // Replacement pool for "Recommend another"
  var p7RecoReplacements = [
    { name: 'Shibuya Sky', emoji: '\uD83C\uDF03', desc: '3 min walk \u00B7 Observation deck', badge: '92% match' },
    { name: 'Nonbei Yokocho', emoji: '\uD83C\uDF76', desc: '2 min walk \u00B7 Hidden alley bars', badge: 'Local fav' },
    { name: 'Moshi Moshi Box', emoji: '\uD83C\uDF80', desc: '1 min walk \u00B7 Kawaii info center', badge: 'Nearby' },
    { name: 'Commune 2nd', emoji: '\uD83C\uDF3B', desc: '4 min walk \u00B7 Outdoor food stalls', badge: 'Trending' },
    { name: 'Ota Memorial Museum', emoji: '\uD83C\uDFAF', desc: '2 min walk \u00B7 Ukiyo-e art', badge: 'For you' },
    { name: 'Sakura-tei', emoji: '\uD83E\uDD5E', desc: '1 min walk \u00B7 Okonomiyaki', badge: '96% match' },
    { name: 'Kiddy Land', emoji: '\uD83E\uDDF8', desc: '2 min walk \u00B7 Toy paradise', badge: 'Fun' },
    { name: 'Farmer\'s Market', emoji: '\uD83E\uDD6C', desc: '3 min walk \u00B7 Weekend market', badge: 'Local' },
  ];
  var p7RecoReplIdx = 0;

  var p7TrailLine = null;
  var p7TrailMarkers = [];
  var p7RecoMarkers = [];

  function initP7RecMap() {
    if (p7RecMapInstance) {
      p7RecMapInstance.invalidateSize();
      // Auto-start recording if not already started
      if (!p7RecordState.started) {
        setTimeout(function() { p7StartRecording(); }, 500);
      }
      return;
    }
    var mapEl = document.getElementById('p7RecMap');
    if (!mapEl || typeof L === 'undefined') return;

    p7RecMapInstance = L.map(mapEl, {
      center: [35.668, 139.703], zoom: 15, zoomControl: false, attributionControl: false
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(p7RecMapInstance);

    // Auto-start recording immediately
    setTimeout(function() { p7StartRecording(); }, 500);
  }

  function p7FormatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function p7CalcDist(pts) {
    var total = 0;
    for (var i = 1; i < pts.length; i++) {
      var R = 6371;
      var dLat = (pts[i].lat - pts[i-1].lat) * Math.PI / 180;
      var dLng = (pts[i].lng - pts[i-1].lng) * Math.PI / 180;
      var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(pts[i-1].lat*Math.PI/180)*Math.cos(pts[i].lat*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
      total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
    return total;
  }

  // Smooth movement system
  var p7UserMarker = null;       // The moving user dot
  var p7TrailCoords = [];        // All coords the user has passed through
  var p7AnimFrame = null;        // requestAnimationFrame ID
  var p7CurrentSegment = 0;      // Which segment we're animating (0 = from pt0 to pt1)
  var p7SegmentProgress = 0;     // 0..1 progress within current segment
  var p7LastFrameTime = 0;
  var p7SegmentDuration = 8000;  // ms to travel each segment (slow walk)
  var p7KeySpotInterval = 2;     // Drop a key spot marker every N segments

  function p7PlaceKeySpot(idx) {
    var pt = trailData[idx];
    var marker = L.marker([pt.lat, pt.lng], {
      icon: L.divIcon({ html: '<div class="p5-trail-dot"></div>', className: 'proto-leaflet-marker', iconSize: [10,10], iconAnchor: [5,5] })
    }).addTo(p7RecMapInstance);
    p7TrailMarkers.push(marker);
  }

  function p7StartSmoothMovement() {
    if (!p7RecMapInstance || trailData.length < 2) return;
    p7CurrentSegment = 0;
    p7SegmentProgress = 0;
    p7TrailCoords = [[trailData[0].lat, trailData[0].lng]];

    // Place user dot at start
    p7UserMarker = L.marker([trailData[0].lat, trailData[0].lng], {
      icon: L.divIcon({ html: '<div class="p7-user-dot-moving"></div>', className: 'proto-leaflet-marker', iconSize: [18,18], iconAnchor: [9,9] }),
      zIndexOffset: 1000
    }).addTo(p7RecMapInstance);

    // Place first key spot
    p7PlaceKeySpot(0);

    // Start trail line
    p7TrailLine = L.polyline(p7TrailCoords, { color: '#7C3AED', weight: 3, opacity: 0.7 }).addTo(p7RecMapInstance);

    // Update stats (removed from UI — keep guards for any code that still references them)
    var _spotsEl = document.getElementById('p7StatSpots');
    var _distEl = document.getElementById('p7StatDist');
    if (_spotsEl) _spotsEl.textContent = '1';
    if (_distEl) _distEl.textContent = '0.0';

    p7LastFrameTime = performance.now();
    p7AnimFrame = requestAnimationFrame(p7AnimateMovement);
  }

  function p7AnimateMovement(now) {
    if (!p7RecMapInstance || !p7RecordState.started) return;
    var dt = now - p7LastFrameTime;
    p7LastFrameTime = now;

    p7SegmentProgress += dt / p7SegmentDuration;

    if (p7SegmentProgress >= 1) {
      // Arrived at next waypoint
      p7SegmentProgress = 0;
      p7CurrentSegment++;

      if (p7CurrentSegment >= trailData.length - 1) {
        // Reached the end
        p7StopRecording();
        return;
      }

      var arrivedIdx = p7CurrentSegment;
      // Drop key spot marker at certain waypoints
      if (arrivedIdx % p7KeySpotInterval === 0 || arrivedIdx === trailData.length - 1) {
        p7PlaceKeySpot(arrivedIdx);
      }

      // Update spot count & distance (guarded — UI elements were removed)
      var _spotsEl2 = document.getElementById('p7StatSpots');
      var _distEl2 = document.getElementById('p7StatDist');
      if (_spotsEl2) _spotsEl2.textContent = arrivedIdx + 1;
      if (_distEl2) {
        var pts = trailData.slice(0, arrivedIdx + 1);
        _distEl2.textContent = p7CalcDist(pts).toFixed(1);
      }
    }

    // Interpolate position between current and next waypoint
    var from = trailData[p7CurrentSegment];
    var to = trailData[p7CurrentSegment + 1];
    if (!to) { p7StopRecording(); return; }

    var t = p7SegmentProgress;
    // Ease in-out for natural movement
    t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    var curLat = from.lat + (to.lat - from.lat) * t;
    var curLng = from.lng + (to.lng - from.lng) * t;

    // Move user marker
    if (p7UserMarker) {
      p7UserMarker.setLatLng([curLat, curLng]);
    }

    // Extend trail line
    p7TrailCoords.push([curLat, curLng]);
    // Keep trail coords manageable (max 500 points)
    if (p7TrailCoords.length > 500) {
      p7TrailCoords = p7TrailCoords.filter(function(_, i) { return i % 2 === 0 || i === p7TrailCoords.length - 1; });
    }
    if (p7TrailLine) p7TrailLine.setLatLngs(p7TrailCoords);

    // Gently pan map to follow user
    p7RecMapInstance.panTo([curLat, curLng], { animate: false });

    p7AnimFrame = requestAnimationFrame(p7AnimateMovement);
  }

  function p7AddRecoMarker(reco, idx) {
    if (typeof idx === 'undefined') idx = p7RecoMarkers.length;
    var m = L.marker([reco.lat, reco.lng], {
      icon: L.divIcon({
        html: (function() {
          // Deterministic XP (10-50) from name
          var seed = 0;
          for (var i = 0; i < reco.name.length; i++) seed = (seed * 131 + reco.name.charCodeAt(i)) & 0xffff;
          var xp = 10 + (seed % 9) * 5;
          return '<div class="p5-reco-pin" data-reco-idx="' + idx + '">'
            + '<span class="p7-reco-regen" data-reco-regen="' + idx + '" title="Recommend another">'
            + '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>'
            + '</span>'
            + '<span class="p5-reco-pin-emoji">' + reco.emoji + '</span>'
            + '<span class="p5-reco-pin-name">' + reco.name + '</span>'
            + '<span class="p5-reco-pin-xp">+' + xp + '</span>'
            + '</div>';
        })(),
        className: 'proto-leaflet-marker', iconSize: null, iconAnchor: [0,0]
      })
    }).addTo(p7RecMapInstance);
    // Store reco data on marker
    m._recoData = reco;
    m._recoIdx = idx;
    p7RecoMarkers[idx] = m;
  }

  // Open reco spot detail from map pin click
  document.addEventListener('click', function(e) {
    // Handle regenerate icon click
    var regenBtn = e.target.closest('.p7-reco-regen');
    if (regenBtn) {
      e.stopPropagation();
      var idx = parseInt(regenBtn.getAttribute('data-reco-regen'));
      p7RegenerateReco(idx);
      return;
    }
    // Handle reco pin click → open detail
    var pin = e.target.closest('.p5-reco-pin[data-reco-idx]');
    if (!pin) return;
    // Make sure we're in the record view
    var recView = pin.closest('.p7-view[data-p7view="record"]');
    if (!recView) return;
    var idx = parseInt(pin.getAttribute('data-reco-idx'));
    var marker = p7RecoMarkers[idx];
    if (!marker || !marker._recoData) return;
    p7OpenRecoDetail(marker._recoData, idx);
  });

  function p7OpenRecoDetail(reco, idx) {
    // Route through the unified detail opener so photo hero, tabs, etc. all populate
    p7OpenDetail(reco.name, reco.emoji);
    var overlay = document.getElementById('p7DetailOverlay');
    if (!overlay) return;
    overlay.style.zIndex = '100';
  }

  // "Recommend another" button click from detail page
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.p7-reco-another-btn');
    if (!btn) return;
    var idx = parseInt(btn.getAttribute('data-reco-detail-idx'));
    // Close the detail overlay
    var overlay = document.getElementById('p7DetailOverlay');
    overlay.classList.remove('open');
    // Trigger regeneration
    p7RegenerateReco(idx);
  });

  function p7RegenerateReco(idx) {
    var oldMarker = p7RecoMarkers[idx];
    if (!oldMarker || !p7RecMapInstance) return;
    var oldReco = oldMarker._recoData;
    var oldLat = oldReco.lat;
    var oldLng = oldReco.lng;

    // Remove old marker
    p7RecMapInstance.removeLayer(oldMarker);

    // Show a loading pin at old location
    var loadingMarker = L.marker([oldLat, oldLng], {
      icon: L.divIcon({
        html: '<div class="p5-reco-pin p7-reco-loading"><span class="p7-reco-spinner"></span><span class="p5-reco-pin-name">Finding spot...</span></div>',
        className: 'proto-leaflet-marker', iconSize: null, iconAnchor: [0,0]
      })
    }).addTo(p7RecMapInstance);

    setTimeout(function() {
      p7RecMapInstance.removeLayer(loadingMarker);
      // Pick a replacement
      var repl = p7RecoReplacements[p7RecoReplIdx % p7RecoReplacements.length];
      p7RecoReplIdx++;
      // Place near old location with slight offset
      var newReco = {
        lat: oldLat + (Math.random() - 0.5) * 0.003,
        lng: oldLng + (Math.random() - 0.5) * 0.003,
        name: repl.name, emoji: repl.emoji, desc: repl.desc, badge: repl.badge
      };
      p7Recommendations[idx] = newReco;
      p7AddRecoMarker(newReco, idx);
    }, 1200);
  }

  // ---- Recording view: FAB actions (Refresh / Create route) ----
  var p7RouteLine = null;
  var p7RouteActive = false;

  function p7RefreshAllRecos() {
    if (!p7RecMapInstance) return;
    var btn = document.getElementById('p7RecRefreshBtn');
    if (btn) btn.classList.add('p7-rec-fab-busy');

    // Remove existing reco markers
    p7RecoMarkers.forEach(function(m) { if (m) p7RecMapInstance.removeLayer(m); });
    p7RecoMarkers = [];

    // Drop loading pins at each reco position
    var loadingMarkers = p7Recommendations.map(function(reco) {
      return L.marker([reco.lat, reco.lng], {
        icon: L.divIcon({
          html: '<div class="p5-reco-pin p7-reco-loading"><span class="p7-reco-spinner"></span><span class="p5-reco-pin-name">Finding spot...</span></div>',
          className: 'proto-leaflet-marker', iconSize: null, iconAnchor: [0,0]
        })
      }).addTo(p7RecMapInstance);
    });

    setTimeout(function() {
      // Swap in fresh names from replacement pool
      loadingMarkers.forEach(function(m) { p7RecMapInstance.removeLayer(m); });
      p7Recommendations.forEach(function(reco, i) {
        var repl = p7RecoReplacements[(p7RecoReplIdx + i) % p7RecoReplacements.length];
        var newReco = {
          lat: reco.lat + (Math.random() - 0.5) * 0.003,
          lng: reco.lng + (Math.random() - 0.5) * 0.003,
          name: repl.name, emoji: repl.emoji, desc: repl.desc, badge: repl.badge
        };
        p7Recommendations[i] = newReco;
        p7AddRecoMarker(newReco, i);
      });
      p7RecoReplIdx += p7Recommendations.length;
      if (btn) btn.classList.remove('p7-rec-fab-busy');
      // Redraw the route if it was active
      if (p7RouteActive) p7DrawRoute();
    }, 1100);
  }

  function p7DrawRoute() {
    if (!p7RecMapInstance) return;
    if (p7RouteLine) { p7RecMapInstance.removeLayer(p7RouteLine); p7RouteLine = null; }

    // Start from user location, then visit each reco in nearest-neighbor order
    var startLatLng = p7UserMarker ? p7UserMarker.getLatLng() : null;
    if (!startLatLng && p7Recommendations.length) {
      startLatLng = L.latLng(p7Recommendations[0].lat, p7Recommendations[0].lng);
    }
    if (!startLatLng) return;

    var remaining = p7Recommendations.slice();
    var path = [[startLatLng.lat, startLatLng.lng]];
    var current = [startLatLng.lat, startLatLng.lng];
    while (remaining.length) {
      var bestIdx = 0;
      var bestDist = Infinity;
      for (var i = 0; i < remaining.length; i++) {
        var r = remaining[i];
        var dy = r.lat - current[0];
        var dx = r.lng - current[1];
        var d = dy * dy + dx * dx;
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      }
      var pick = remaining.splice(bestIdx, 1)[0];
      current = [pick.lat, pick.lng];
      path.push(current);
    }

    p7RouteLine = L.polyline(path, {
      color: '#7C3AED',
      weight: 4,
      opacity: 0.85,
      dashArray: '6 6',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(p7RecMapInstance);
    p7RouteActive = true;
    // Fit map to show whole route
    p7RecMapInstance.fitBounds(p7RouteLine.getBounds().pad(0.2), { animate: true });
  }

  function p7ClearRoute() {
    if (p7RouteLine && p7RecMapInstance) {
      p7RecMapInstance.removeLayer(p7RouteLine);
      p7RouteLine = null;
    }
    p7RouteActive = false;
  }

  // Position FAB stack 12px above the bottom drawer
  function p7PositionRecFabStack() {
    var stack = document.querySelector('.p7-rec-fab-stack');
    var sheet = document.getElementById('p7Sheet');
    if (!stack || !sheet) return;
    var h = sheet.offsetHeight;
    if (h) stack.style.bottom = (h + 12) + 'px';
  }

  // Observe changes to the sheet so the FAB stays aligned
  (function() {
    var sheet = document.getElementById('p7Sheet');
    if (!sheet) return;
    p7PositionRecFabStack();
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(p7PositionRecFabStack);
      ro.observe(sheet);
    }
    window.addEventListener('resize', p7PositionRecFabStack);
  })();

  // Vibe-themed replacement pools. Each pool feeds refresh regeneration.
  var p7VibePools = {
    foodie: [
      { name: 'Ichiran Shinjuku', emoji: '\uD83C\uDF5C', desc: '2 min walk · Ramen cubicles', badge: 'Foodie' },
      { name: 'Uogashi Nihon-Ichi', emoji: '\uD83C\uDF63', desc: '3 min walk · Standing sushi', badge: 'Foodie' },
      { name: 'Afuri Ramen', emoji: '\uD83C\uDF5C', desc: '4 min walk · Yuzu broth', badge: 'Foodie' },
      { name: 'Tonkatsu Maisen', emoji: '\uD83E\uDD69', desc: '2 min walk · Crispy cutlet', badge: 'Foodie' },
      { name: 'Yakitori Alley', emoji: '\uD83C\uDF62', desc: '1 min walk · Grilled skewers', badge: 'Foodie' },
      { name: 'Taiyaki Hiiragi', emoji: '\uD83D\uDC20', desc: '2 min walk · Fish cakes', badge: 'Foodie' },
      { name: 'Matcha House', emoji: '\uD83C\uDF75', desc: '3 min walk · Tea & sweets', badge: 'Foodie' },
      { name: 'Harajuku Gyoza', emoji: '\uD83E\uDD5F', desc: '1 min walk · Dumplings', badge: 'Foodie' }
    ],
    culture: [
      { name: 'Meiji Jingu', emoji: '\u26E9\uFE0F', desc: '4 min walk · Forest shrine', badge: 'Culture' },
      { name: 'Ota Memorial Museum', emoji: '\uD83C\uDFAF', desc: '2 min walk · Ukiyo-e art', badge: 'Culture' },
      { name: 'Togo Shrine', emoji: '\u26E9\uFE0F', desc: '1 min walk · Hidden gem', badge: 'Culture' },
      { name: 'Nezu Museum', emoji: '\uD83C\uDFDB\uFE0F', desc: '6 min walk · Asian art', badge: 'Culture' },
      { name: 'Watari-um', emoji: '\uD83D\uDDBC\uFE0F', desc: '5 min walk · Contemporary', badge: 'Culture' },
      { name: 'Japan Folk Crafts', emoji: '\uD83C\uDFFA', desc: '8 min walk · Mingei', badge: 'Culture' },
      { name: 'Hanazono Shrine', emoji: '\u26E9\uFE0F', desc: '3 min walk · City sanctuary', badge: 'Culture' },
      { name: 'Design Festa Gallery', emoji: '\uD83C\uDFA8', desc: '2 min walk · Art space', badge: 'Culture' }
    ],
    chill: [
      { name: 'Blue Bottle Coffee', emoji: '\u2615', desc: '2 min walk · Slow pour', badge: 'Chill' },
      { name: 'Aoyama Flower Market', emoji: '\uD83C\uDF38', desc: '2 min walk · Café & flowers', badge: 'Chill' },
      { name: 'Yoyogi Park', emoji: '\uD83C\uDF33', desc: '4 min walk · Picnic lawn', badge: 'Chill' },
      { name: 'Nezu Caf\u00E9', emoji: '\u2615', desc: '3 min walk · Garden café', badge: 'Chill' },
      { name: 'Commune 2nd', emoji: '\uD83C\uDF3B', desc: '4 min walk · Outdoor plaza', badge: 'Chill' },
      { name: 'Streamer Coffee', emoji: '\u2615', desc: '1 min walk · Latte art', badge: 'Chill' },
      { name: 'Cat Street Bench', emoji: '\uD83D\uDCDA', desc: '3 min walk · People-watch', badge: 'Chill' },
      { name: 'Zakuro Tea', emoji: '\uD83C\uDF75', desc: '2 min walk · Quiet tea room', badge: 'Chill' }
    ],
    nightlife: [
      { name: 'Nonbei Yokocho', emoji: '\uD83C\uDF76', desc: '2 min walk · Alley bars', badge: 'Nightlife' },
      { name: 'Shibuya Sky', emoji: '\uD83C\uDF03', desc: '6 min walk · Rooftop views', badge: 'Nightlife' },
      { name: 'Trunk Hotel Bar', emoji: '\uD83C\uDF78', desc: '4 min walk · Design bar', badge: 'Nightlife' },
      { name: 'Bar High Five', emoji: '\uD83C\uDF79', desc: '9 min walk · Iconic cocktails', badge: 'Nightlife' },
      { name: 'Golden Gai', emoji: '\uD83C\uDFEE', desc: '8 min walk · Tiny bars', badge: 'Nightlife' },
      { name: 'Sake Place Shuzo', emoji: '\uD83C\uDF76', desc: '3 min walk · Craft sake', badge: 'Nightlife' },
      { name: 'The SG Club', emoji: '\uD83C\uDF79', desc: '7 min walk · World-class bar', badge: 'Nightlife' },
      { name: 'Rooftop Two Rooms', emoji: '\uD83C\uDF03', desc: '5 min walk · Skyline', badge: 'Nightlife' }
    ],
    shopping: [
      { name: 'Tokyu Hands', emoji: '\uD83D\uDECD\uFE0F', desc: '3 min walk · Everything store', badge: 'Shopping' },
      { name: 'Kiddy Land', emoji: '\uD83E\uDDF8', desc: '2 min walk · Toy paradise', badge: 'Shopping' },
      { name: 'Beams Japan', emoji: '\uD83D\uDC55', desc: '4 min walk · Curated fashion', badge: 'Shopping' },
      { name: 'Laforet Harajuku', emoji: '\uD83D\uDC57', desc: '1 min walk · Street style', badge: 'Shopping' },
      { name: 'Ragtag Vintage', emoji: '\uD83D\uDC5C', desc: '3 min walk · Designer resale', badge: 'Shopping' },
      { name: 'Daikanyama T-Site', emoji: '\uD83D\uDCDA', desc: '6 min walk · Books & vinyl', badge: 'Shopping' },
      { name: 'Takeshita Street', emoji: '\uD83C\uDF6D', desc: '1 min walk · Pop & kawaii', badge: 'Shopping' },
      { name: 'Dover Street Market', emoji: '\uD83D\uDC54', desc: '7 min walk · High fashion', badge: 'Shopping' }
    ],
    unsure: p7RecoReplacements.slice(), // surprise — fall back to the existing default pool
    custom: p7RecoReplacements.slice()  // rewritten on the fly when the user types
  };

  var p7CurrentVibe = null; // remembered so subsequent refreshes keep the vibe
  var p7CurrentCustomLabel = '';

  // Override the replacement pool based on the chosen vibe, then run the standard refresh.
  function p7RefreshWithVibe(vibe, customText) {
    p7CurrentVibe = vibe;
    var pool;
    if (vibe === 'custom' && customText) {
      p7CurrentCustomLabel = customText;
      // For custom vibes, shuffle a blend pulled from all pools so each refresh feels novel.
      var blend = [].concat(p7VibePools.foodie, p7VibePools.culture, p7VibePools.chill, p7VibePools.nightlife, p7VibePools.shopping);
      // Deterministic-ish shuffle keyed to the phrase so the same input yields similar results
      var seed = 0;
      for (var i = 0; i < customText.length; i++) seed = (seed * 131 + customText.charCodeAt(i)) & 0xffff;
      pool = blend.slice().sort(function(a, b) {
        var aS = (a.name.charCodeAt(0) + seed) & 0xff;
        var bS = (b.name.charCodeAt(0) + seed * 3) & 0xff;
        return aS - bS;
      }).map(function(item) {
        return { name: item.name, emoji: item.emoji, desc: item.desc, badge: customText.slice(0, 14) || item.badge };
      });
    } else if (vibe && p7VibePools[vibe]) {
      pool = p7VibePools[vibe].slice();
    } else {
      pool = p7RecoReplacements.slice();
    }
    p7RecoReplacements.length = 0;
    pool.forEach(function(p) { p7RecoReplacements.push(p); });
    p7RecoReplIdx = 0;
    p7RefreshAllRecos();
  }

  // Wire up FAB buttons
  (function() {
    var refreshBtn = document.getElementById('p7RecRefreshBtn');
    var routeBtn = document.getElementById('p7RecRouteBtn');
    var dropdown = document.getElementById('p7VibeDropdown');
    var customWrap = document.getElementById('p7VibeCustomWrap');
    var customInput = document.getElementById('p7VibeCustomInput');
    var customTrigger = document.getElementById('p7VibeCustomTrigger');
    var customGo = document.getElementById('p7VibeCustomGo');

    function closeVibe() {
      if (!dropdown) return;
      dropdown.classList.remove('p7-vibe-dropdown-open');
      // clear selection visual
      dropdown.querySelectorAll('.p7-vibe-option').forEach(function(o) {
        o.classList.remove('p7-vibe-option-selected');
      });
    }

    function openVibe() {
      if (!dropdown) return;
      dropdown.classList.add('p7-vibe-dropdown-open');
      // Clear any prior input so user starts fresh
      if (customInput) customInput.value = '';
    }

    if (refreshBtn && dropdown) {
      refreshBtn.addEventListener('click', function(e) {
        if (refreshBtn.classList.contains('p7-rec-fab-busy')) return;
        e.stopPropagation();
        if (dropdown.classList.contains('p7-vibe-dropdown-open')) {
          closeVibe();
        } else {
          openVibe();
        }
      });
    }

    if (dropdown) {
      // Tap outside closes
      document.addEventListener('click', function(e) {
        if (!dropdown.classList.contains('p7-vibe-dropdown-open')) return;
        if (dropdown.contains(e.target) || (refreshBtn && refreshBtn.contains(e.target))) return;
        closeVibe();
      });

      dropdown.querySelectorAll('.p7-vibe-option').forEach(function(opt) {
        opt.addEventListener('click', function(e) {
          e.stopPropagation();
          var vibe = this.getAttribute('data-vibe');
          dropdown.querySelectorAll('.p7-vibe-option').forEach(function(o) { o.classList.remove('p7-vibe-option-selected'); });
          this.classList.add('p7-vibe-option-selected');
          setTimeout(function() {
            closeVibe();
            p7RefreshWithVibe(vibe);
          }, 180);
        });
      });

      function submitCustom() {
        var val = (customInput.value || '').trim();
        if (!val) return;
        closeVibe();
        if (customInput) customInput.value = '';
        p7RefreshWithVibe('custom', val);
      }
      if (customGo) customGo.addEventListener('click', function(e) { e.stopPropagation(); submitCustom(); });
      if (customInput) customInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); submitCustom(); }
      });
    }

    if (routeBtn) {
      routeBtn.addEventListener('click', function() {
        if (p7RouteActive) {
          p7ClearRoute();
          routeBtn.classList.remove('p7-rec-fab-active');
        } else {
          p7DrawRoute();
          routeBtn.classList.add('p7-rec-fab-active');
        }
      });
    }
  })();

  function p7ShowToast(reco) {
    var toast = document.getElementById('p7Toast');
    document.getElementById('p7ToastTitle').textContent = reco.emoji + ' ' + reco.name;
    document.getElementById('p7ToastDesc').textContent = reco.desc;
    toast.style.display = 'flex';
    toast.style.animation = 'none';
    void toast.offsetWidth;
    toast.style.animation = 'p5-toast-in 0.4s ease both';
    setTimeout(function() { toast.style.display = 'none'; }, 4000);
  }

  document.getElementById('p7ToastClose').addEventListener('click', function() {
    document.getElementById('p7Toast').style.display = 'none';
  });

  function p7StartRecording() {
    if (!p7RecMapInstance) return;
    p7RecordState.started = true;
    document.getElementById('p7SheetPre').style.display = 'none';
    document.getElementById('p7SheetRecording').style.display = 'flex';
    document.getElementById('p7SheetSummary').style.display = 'none';
    document.getElementById('p7Hud').style.display = 'flex';

    p7RecordState.idx = 0;
    p7RecordState.elapsed = 0;
    document.getElementById('p7SpotsScroll').innerHTML = '';

    // Clear old
    if (p7AnimFrame) { cancelAnimationFrame(p7AnimFrame); p7AnimFrame = null; }
    if (p7UserMarker) { p7RecMapInstance.removeLayer(p7UserMarker); p7UserMarker = null; }
    p7TrailMarkers.forEach(function(m) { p7RecMapInstance.removeLayer(m); });
    p7RecoMarkers.forEach(function(m) { if (m) p7RecMapInstance.removeLayer(m); });
    p7TrailMarkers = [];
    p7RecoMarkers = [];
    p7TrailCoords = [];
    if (p7TrailLine) { p7RecMapInstance.removeLayer(p7TrailLine); p7TrailLine = null; }
    p7RecMapInstance.eachLayer(function(layer) {
      if (layer.options && layer.options.icon) {
        var html = layer.options.icon.options ? layer.options.icon.options.html || '' : '';
        if (typeof html === 'string' && (html.indexOf('p5-reco-pin') !== -1 || html.indexOf('p7-user-dot') !== -1 || html.indexOf('p5-trail-dot') !== -1)) {
          p7RecMapInstance.removeLayer(layer);
        }
      }
    });

    p7RecordState.timerInterval = setInterval(function() {
      p7RecordState.elapsed++;
      var t = p7FormatTime(p7RecordState.elapsed);
      var hudTime = document.getElementById('p7HudTime');
      var statTime = document.getElementById('p7StatTime');
      if (hudTime) hudTime.textContent = t;
      if (statTime) statTime.textContent = t;
    }, 1000);

    // Place 8 reco spots instantly
    p7Recommendations.forEach(function(reco, i) {
      p7AddRecoMarker(reco, i);
    });

    // Start smooth user movement
    p7StartSmoothMovement();
  }

  function p7StopRecording() {
    p7RecordState.started = false;
    if (p7AnimFrame) { cancelAnimationFrame(p7AnimFrame); p7AnimFrame = null; }
    clearInterval(p7RecordState.simInterval);
    clearInterval(p7RecordState.timerInterval);
    document.getElementById('p7Hud').style.display = 'none';
    document.getElementById('p7Toast').style.display = 'none';
    document.getElementById('p7SheetRecording').style.display = 'none';
    document.getElementById('p7SheetSummary').style.display = 'flex';

    var pts = trailData.slice(0, Math.max(p7CurrentSegment + 1, p7RecordState.idx + 1));
    var dist = p7CalcDist(pts);
    var summarySub = document.getElementById('p7SummarySub');
    if (summarySub) summarySub.textContent = pts.length + ' spots \u00B7 ' + dist.toFixed(1) + ' km \u00B7 ' + p7FormatTime(p7RecordState.elapsed);
    var summaryStats = document.getElementById('p7SummaryStats');
    if (summaryStats) {
      summaryStats.innerHTML =
        '<div class="p5-stat"><span class="p5-stat-value">' + pts.length + '</span><span class="p5-stat-label">Spots</span></div>' +
        '<div class="p5-stat"><span class="p5-stat-value">' + dist.toFixed(1) + '</span><span class="p5-stat-label">km walked</span></div>' +
        '<div class="p5-stat"><span class="p5-stat-value">' + p7FormatTime(p7RecordState.elapsed) + '</span><span class="p5-stat-label">Duration</span></div>';
    }
  }

  document.getElementById('p7RecordBtn').addEventListener('click', p7StartRecording);
  document.getElementById('p7StopBtn').addEventListener('click', p7StopRecording);

  // Save recorded journey into p7RecordedHistory when user finishes
  var p7RecordedHistory = null;
  document.getElementById('p7FinishTripBtn').addEventListener('click', function() {
    var pts = trailData.slice(0, Math.max(p7CurrentSegment + 1, p7RecordState.idx + 1));
    var dist = p7CalcDist(pts);
    // Build visited places — take every Nth waypoint up to a few fictional names
    var visited = [];
    var placeNames = [
      { emoji: '\u26E9\uFE0F', name: 'Meiji Shrine', time: '10:30 AM' },
      { emoji: '\uD83D\uDECD\uFE0F', name: 'Takeshita Street', time: '11:00 AM' },
      { emoji: '\uD83D\uDECD\uFE0F', name: 'Cat Street', time: '11:30 AM' },
      { emoji: '\uD83C\uDF5C', name: 'Ichiran Ramen', time: '12:00 PM' },
      { emoji: '\uD83C\uDFA8', name: 'Design Festa Gallery', time: '1:15 PM' },
      { emoji: '\uD83C\uDF38', name: 'Aoyama Flower Market', time: '2:00 PM' },
      { emoji: '\u2615', name: 'Nezu Caf\u00E9', time: '3:00 PM' }
    ];
    var count = Math.min(5, pts.length);
    for (var v = 0; v < count; v++) {
      var p = placeNames[v] || placeNames[v % placeNames.length];
      var wp = pts[Math.floor((v / Math.max(count - 1, 1)) * (pts.length - 1))];
      var nameSeed = 0;
      for (var si = 0; si < p.name.length; si++) nameSeed = (nameSeed * 131 + p.name.charCodeAt(si)) & 0xffff;
      var pv = 10 + (nameSeed % 9) * 5;
      visited.push({ emoji: p.emoji, name: p.name, time: p.time, lat: wp.lat, lng: wp.lng, points: pv });
    }
    var totalPts = visited.reduce(function(s, v) { return s + v.points; }, 0);
    p7RecordedHistory = {
      trail: p7TrailCoords.slice(),
      visited: visited,
      points: totalPts,
      distance: dist,
      elapsed: p7RecordState.elapsed
    };

    // Navigate to the trip detail view (first upcoming trip or create a fresh one)
    var trip = (p7TripsData && p7TripsData.upcoming && p7TripsData.upcoming[0]) || null;
    if (trip) {
      openTripDetail(trip, 'upcoming');
      // Switch to History tab after the trip detail page has loaded
      setTimeout(function() {
        var historyTab = document.querySelector('.p7-trip-tab[data-triptab="history"]');
        if (historyTab) historyTab.click();
      }, 400);
    }
  });

  document.getElementById('p7RestartBtn').addEventListener('click', function() {
    document.getElementById('p7SheetSummary').style.display = 'none';
    document.getElementById('p7SheetPre').style.display = 'flex';
    if (p7RecMapInstance) {
      if (p7AnimFrame) { cancelAnimationFrame(p7AnimFrame); p7AnimFrame = null; }
      if (p7UserMarker) { p7RecMapInstance.removeLayer(p7UserMarker); p7UserMarker = null; }
      p7TrailMarkers.forEach(function(m) { p7RecMapInstance.removeLayer(m); });
      p7RecoMarkers.forEach(function(m) { if (m) p7RecMapInstance.removeLayer(m); });
      p7TrailMarkers = [];
      p7RecoMarkers = [];
      p7TrailCoords = [];
      if (p7TrailLine) { p7RecMapInstance.removeLayer(p7TrailLine); p7TrailLine = null; }
      p7RecMapInstance.eachLayer(function(layer) {
        if (layer.options && layer.options.icon) {
          var html = layer.options.icon.options ? layer.options.icon.options.html || '' : '';
          if (typeof html === 'string' && (html.indexOf('p5-reco-pin') !== -1 || html.indexOf('p7-user-dot') !== -1 || html.indexOf('p5-trail-dot') !== -1)) {
            p7RecMapInstance.removeLayer(layer);
          }
        }
      });
      p7RecMapInstance.setView([35.668, 139.703], 15);
    }
    // Auto-start recording again
    setTimeout(function() { p7StartRecording(); }, 500);
  });

  // ---- CREATE TRIP VIEW (P6-style) ----
  var p7State = {
    destination: '', destImg: '', month: '', duration: '',
    customStart: '', customEnd: '', mustDos: [],
    flightBudget: 35, hotelBudget: 40,
    monitorFlights: true, monitorHotels: true, activityMonitors: {}
  };

  var p7Steps = ['1','2','3','loading','celebration','4','5','book','6'];
  var p7CurrentStep = 0;
  var p7PriceAlerts = []; // user-added price alerts
  var p7AllPages = app.querySelectorAll('.p7-page');
  var p7ProgressFill = document.getElementById('p7ProgressFill');
  var p7ProgressLabel = document.getElementById('p7ProgressLabel');
  var p7BackBtn = document.getElementById('p7BackBtn');
  var p7ProgressBar = document.getElementById('p7Progress');

  function p7GetVisualStep(idx) {
    var s = p7Steps[idx];
    if (s === 'loading' || s === 'celebration' || s === 'book') return null;
    return parseInt(s);
  }

  function p7UpdateProgress() {
    var vs = p7GetVisualStep(p7CurrentStep);
    var currentStepName = p7Steps[p7CurrentStep];
    // Hide progress bar on step 1, 4, 5, celebration, and book
    var hideProgress = (vs === 1 || currentStepName === '4' || currentStepName === '5' || currentStepName === 'celebration' || currentStepName === 'book');
    p7ProgressBar.style.display = hideProgress ? 'none' : 'flex';
    if (vs !== null) {
      p7ProgressFill.style.width = (vs / 5 * 100) + '%';
      p7ProgressLabel.textContent = 'Step ' + vs + ' of 5';
    }
    // Back button: visible when past step 1 and not loading/celebration/book
    if (p7CurrentStep > 0 && currentStepName !== 'loading' && currentStepName !== 'celebration' && currentStepName !== 'book') {
      p7BackBtn.style.visibility = 'visible';
    } else {
      p7BackBtn.style.visibility = 'hidden';
    }
  }

  function p7GoToStep(idx, dir) {
    if (idx < 0 || idx >= p7Steps.length) return;
    var oldPage = app.querySelector('.p7-page-active');
    var newStep = p7Steps[idx];
    var newPage = app.querySelector('.p7-page[data-p7step="' + newStep + '"]');
    if (!newPage) return;

    if (oldPage) {
      oldPage.classList.remove('p7-page-active');
      oldPage.style.transform = dir === 1 ? 'translateX(-60px)' : 'translateX(60px)';
      oldPage.style.opacity = '0';
      oldPage.style.pointerEvents = 'none';
    }

    newPage.style.transform = dir === 1 ? 'translateX(60px)' : 'translateX(-60px)';
    newPage.style.opacity = '0';
    void newPage.offsetWidth;
    newPage.classList.add('p7-page-active');
    newPage.style.transform = '';
    newPage.style.opacity = '';
    newPage.style.pointerEvents = '';

    p7CurrentStep = idx;
    p7UpdateProgress();

    // Hide topbar on step 6, celebration, and book pages
    var topbar = document.querySelector('.p7-create-topbar');
    if (newStep === '6' || newStep === 'celebration' || newStep === 'book' || newStep === '4' || newStep === '5') {
      topbar.style.display = 'none';
    } else {
      topbar.style.display = '';
    }

    if (newStep === 'loading') {
      p7BackBtn.style.visibility = 'hidden';
      setTimeout(function() { p7GoToStep(p7CurrentStep + 1, 1); }, 2500);
    }
    if (newStep === 'celebration') {
      p7SpawnConfetti();
      // Populate celebration trip card
      var destEmojis = { 'Tokyo, Japan': '🇯🇵', 'Barcelona, Spain': '🇪🇸', 'Lisbon, Portugal': '🇵🇹', 'Bali, Indonesia': '🇮🇩', 'Paris, France': '🇫🇷', 'New York, USA': '🇺🇸' };
      var celCardImg = document.getElementById('p7CelCardImg');
      var celCardDest = document.getElementById('p7CelCardDest');
      var celCardDates = document.getElementById('p7CelCardDates');
      var celCardMonitors = document.getElementById('p7CelCardMonitors');
      if (celCardImg) celCardImg.src = p7State.destImg || '';
      if (celCardDest) celCardDest.textContent = (destEmojis[p7State.destination] || '✈️') + ' ' + (p7State.destination || 'Your Trip');
      // Build date string from month + duration
      var celMonth = p7State.month || '';
      var celDur = parseInt(p7State.duration) || 14;
      var celDateStr = celMonth;
      if (celMonth) {
        var mParts = celMonth.split(' ');
        var mNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var mIdx = mNames.indexOf(mParts[0]);
        var mYear = parseInt(mParts[1]) || 2026;
        if (mIdx >= 0) {
          var startDay = 20;
          var startDate = new Date(mYear, mIdx, startDay);
          var endDate = new Date(startDate.getTime() + (celDur - 1) * 86400000);
          var endMonth = mNames[endDate.getMonth()];
          celDateStr = mParts[0] + ' ' + startDay + ' – ' + endMonth + ' ' + endDate.getDate() + ', ' + mYear;
        }
      }
      if (celCardDates) celCardDates.textContent = celDateStr;
      // Count active monitors
      var monCount = Object.keys(p7State.activityMonitors).filter(function(k) { return p7State.activityMonitors[k]; }).length;
      if (p7State.monitorFlights) monCount++;
      if (p7State.monitorHotels) monCount++;
      if (celCardMonitors) celCardMonitors.textContent = '📡 ' + monCount + ' monitors active';
    }
    if (newStep === '4') { p7UpdateFlightRoute(); p7DrawPriceChart(); }
    if (newStep === '5') p7PopulateStep5();
    if (newStep === 'book') {
      // Reset book page animations by removing and re-adding the element classes
      var bookPages = document.querySelectorAll('.p7-book-pg');
      bookPages.forEach(function(pg) {
        pg.style.animation = 'none';
        void pg.offsetWidth;
        pg.style.animation = '';
      });
      var bookText = document.getElementById('p7BookText');
      if (bookText) { bookText.style.animation = 'none'; void bookText.offsetWidth; bookText.style.animation = ''; }
      var bookBtn = document.getElementById('p7BookBtn');
      if (bookBtn) { bookBtn.style.animation = 'none'; void bookBtn.offsetWidth; bookBtn.style.animation = ''; }
    }
    if (newStep === '6') p7PopulateFinalPlan();
  }

  function p7NextStep() { p7GoToStep(p7CurrentStep + 1, 1); }
  function p7PrevStep() {
    var target = p7CurrentStep - 1;
    while (target >= 0 && (p7Steps[target] === 'loading' || p7Steps[target] === 'celebration' || p7Steps[target] === 'book')) target--;
    p7GoToStep(target, -1);
  }

  p7BackBtn.addEventListener('click', p7PrevStep);

  // Close / back home button in create flow
  document.getElementById('p7CreateHomeBtn').addEventListener('click', function() {
    switchView('home');
  });

  // Social import page navigation
  (function() {
    var socialBtn = document.getElementById('p7SocialBtn');
    if (!socialBtn) return;

    var destPage = app.querySelector('.p7-page[data-p7step="1"]');
    var socialPage = app.querySelector('.p7-page[data-p7step="social"]');

    socialBtn.addEventListener('click', function() {
      destPage.classList.remove('p7-page-active');
      socialPage.classList.add('p7-page-active');
    });

    var socialBackBtn = document.getElementById('p7SocialBackBtn');
    if (socialBackBtn) {
      socialBackBtn.addEventListener('click', function() {
        socialPage.classList.remove('p7-page-active');
        destPage.classList.add('p7-page-active');
      });
    }

    // Paste-link list: add / remove rows
    var linkList = document.getElementById('p7SocialLinkList');
    var addLinkBtn = document.getElementById('p7SocialAddLink');
    if (!linkList || !addLinkBtn) return;

    function buildRow() {
      var row = document.createElement('div');
      row.className = 'p7-social-link-row';
      row.innerHTML = ''
        + '<span class="p7-social-link-icon">'
        + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
        + '</span>'
        + '<input type="text" class="p7-social-link-input" placeholder="Paste link here" />'
        + '<button class="p7-social-link-remove" type="button" aria-label="Remove link">'
        + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6M6 6l12 12"/></svg>'
        + '</button>';
      return row;
    }

    linkList.addEventListener('click', function(e) {
      var btn = e.target.closest('.p7-social-link-remove');
      if (!btn) return;
      var rows = linkList.querySelectorAll('.p7-social-link-row');
      if (rows.length === 1) {
        // Don't remove last row — just clear its value
        var input = rows[0].querySelector('.p7-social-link-input');
        if (input) input.value = '';
        return;
      }
      btn.closest('.p7-social-link-row').remove();
    });

    addLinkBtn.addEventListener('click', function() {
      var row = buildRow();
      linkList.appendChild(row);
      var input = row.querySelector('.p7-social-link-input');
      if (input) input.focus();
    });
  })();

  // Celebration page: confetti + "Let's go!" button
  function p7SpawnConfetti() {
    var container = document.getElementById('p7Confetti');
    if (!container) return;
    container.innerHTML = '';
    var colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F1948A'];
    for (var i = 0; i < 40; i++) {
      var piece = document.createElement('span');
      piece.className = 'p7-confetti-piece';
      piece.style.left = (Math.random() * 100) + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      piece.style.animationDelay = (Math.random() * 1.5) + 's';
      piece.style.width = (6 + Math.random() * 6) + 'px';
      piece.style.height = (8 + Math.random() * 10) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
    }
  }

  document.getElementById('p7CelebrationBtn').addEventListener('click', function() {
    p7GoToStep(p7CurrentStep + 1, 1);
  });

  // Book page "Look at my plan" button
  document.getElementById('p7BookBtn').addEventListener('click', function() {
    p7GoToStep(p7CurrentStep + 1, 1);
  });

  function resetCreateTrip() {
    p7State.destination = ''; p7State.destImg = ''; p7State.month = '';
    p7State.duration = ''; p7State.mustDos = []; p7State.activityMonitors = {};
    p7CurrentStep = 0;

    // Reset pages
    p7AllPages.forEach(function(pg) {
      pg.classList.remove('p7-page-active');
      pg.style.transform = ''; pg.style.opacity = ''; pg.style.pointerEvents = '';
    });
    var firstPage = app.querySelector('.p7-page[data-p7step="1"]');
    if (firstPage) firstPage.classList.add('p7-page-active');

    // Reset dest cards
    app.querySelectorAll('#p7DestGrid .p6-dest-card').forEach(function(c) { c.classList.remove('selected'); });
    document.getElementById('p7DestInput').value = '';

    // Reset must-dos
    document.getElementById('p7MustDoList').innerHTML = '';
    document.getElementById('p7MustDoHint').textContent = '';

    // Reset price alerts
    p7PriceAlerts = [];
    var alertsContainer = document.getElementById('p7PriceAlerts');
    if (alertsContainer) alertsContainer.innerHTML = '';

    // Reset trip detail state
    p7TripSelectedDay = null;

    // Restore topbar visibility
    var topbar = document.querySelector('.p7-create-topbar');
    if (topbar) topbar.style.display = '';

    p7UpdateProgress();
  }

  // Step 1: Destination
  var p7DestCards = app.querySelectorAll('#p7DestGrid .p6-dest-card');
  var p7DestInput = document.getElementById('p7DestInput');
  var p7DestImages = {
    'Tokyo, Japan': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=300&fit=crop',
    'Barcelona, Spain': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=300&fit=crop',
    'Lisbon, Portugal': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=300&fit=crop',
    'Bali, Indonesia': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=300&fit=crop',
    'Paris, France': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=300&fit=crop',
    'New York, USA': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=300&fit=crop',
  };

  p7DestCards.forEach(function(card) {
    card.addEventListener('click', function() {
      p7DestCards.forEach(function(c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      p7State.destination = card.getAttribute('data-dest');
      p7State.destImg = p7DestImages[p7State.destination] || '';
      p7DestInput.value = p7State.destination;
      setTimeout(function() { p7NextStep(); }, 400);
    });
  });

  // Step 2: Month + Duration
  var p7MonthScroll = document.getElementById('p7MonthScroll');
  var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var now = new Date();
  var curMonth = now.getMonth();

  for (var i = 0; i < 12; i++) {
    var mIdx = (curMonth + i) % 12;
    var yr = now.getFullYear() + (curMonth + i >= 12 ? 1 : 0);
    var btn = document.createElement('button');
    btn.className = 'p6-pill' + (i === 0 ? ' active' : '');
    btn.textContent = monthNames[mIdx] + ' ' + yr;
    btn.setAttribute('data-month', monthNames[mIdx] + ' ' + yr);
    p7MonthScroll.appendChild(btn);
  }
  p7State.month = p7MonthScroll.querySelector('.p6-pill.active').getAttribute('data-month');

  p7MonthScroll.addEventListener('click', function(e) {
    var pill = e.target.closest('.p6-pill');
    if (!pill) return;
    p7MonthScroll.querySelectorAll('.p6-pill').forEach(function(p) { p.classList.remove('active'); });
    pill.classList.add('active');
    p7State.month = pill.getAttribute('data-month');
  });

  var p7DurRow = document.getElementById('p7DurationRow');
  var p7CustomDates = document.getElementById('p7CustomDates');
  p7DurRow.addEventListener('click', function(e) {
    var pill = e.target.closest('.p6-pill');
    if (!pill) return;
    p7DurRow.querySelectorAll('.p6-pill').forEach(function(p) { p.classList.remove('active'); });
    pill.classList.add('active');
    var dur = pill.getAttribute('data-dur');
    p7State.duration = dur;
    p7CustomDates.style.display = dur === 'custom' ? 'flex' : 'none';
  });

  document.getElementById('p7Step2Next').addEventListener('click', function() {
    if (!p7State.month) {
      var activePill = p7MonthScroll.querySelector('.p6-pill.active');
      if (activePill) p7State.month = activePill.getAttribute('data-month');
    }
    if (!p7State.duration) {
      p7State.duration = '14';
      p7DurRow.querySelector('[data-dur="14"]').classList.add('active');
    }
    p7NextStep();
  });

  // Step 3: Must-Dos
  var p7MustDoInput = document.getElementById('p7MustDoInput');
  var p7MustDoList = document.getElementById('p7MustDoList');
  var p7MustDoHint = document.getElementById('p7MustDoHint');
  var p7Step3Next = document.getElementById('p7Step3Next');

  function p7AddMustDo() {
    var text = p7MustDoInput.value.trim();
    if (!text) return;
    p7State.mustDos.push(text);
    p7MustDoInput.value = '';
    p7RenderMustDos();
  }

  function p7RenderMustDos() {
    p7MustDoList.innerHTML = '';
    p7State.mustDos.forEach(function(item, idx) {
      var div = document.createElement('div');
      div.className = 'p6-mustdo-item';
      div.innerHTML = '<span class="p6-mustdo-num">' + (idx + 1) + '</span><span class="p6-mustdo-text">' + item + '</span><button class="p6-mustdo-remove" data-idx="' + idx + '">\u00D7</button>';
      p7MustDoList.appendChild(div);
    });
    p7MustDoHint.textContent = p7State.mustDos.length ? p7State.mustDos.length + ' items added' : '';
  }

  document.getElementById('p7AddMustDo').addEventListener('click', p7AddMustDo);
  p7MustDoInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); p7AddMustDo(); } });
  p7MustDoList.addEventListener('click', function(e) {
    var btn = e.target.closest('.p6-mustdo-remove');
    if (!btn) return;
    p7State.mustDos.splice(parseInt(btn.getAttribute('data-idx')), 1);
    p7RenderMustDos();
  });

  p7Step3Next.addEventListener('click', function() { p7NextStep(); });

  // ---- Step 3: Recommended spots with checkboxes ----
  var p7MustDoRecs = [
    { emoji: '\uD83C\uDFEF', name: 'Visit Senso-ji Temple', desc: 'Tokyo\u2019s oldest Buddhist temple' },
    { emoji: '\uD83C\uDF63', name: 'Sushi at Tsukiji Market', desc: 'Fresh morning sushi counters' },
    { emoji: '\uD83D\uDEA5', name: 'Cross Shibuya Scramble', desc: 'World\u2019s busiest intersection' },
    { emoji: '\uD83C\uDF38', name: 'Cherry blossoms at Ueno Park', desc: 'Hanami season must-see' },
    { emoji: '\uD83D\uDDFC', name: 'Tokyo Skytree observation deck', desc: '360\u00B0 city skyline views' },
    { emoji: '\uD83C\uDFEE', name: 'Ramen crawl in Shinjuku', desc: 'Try 3+ local ramen shops' },
    { emoji: '\uD83C\uDFAE', name: 'Explore Akihabara Electric Town', desc: 'Anime, games, and arcades' },
    { emoji: '\uD83C\uDF77', name: 'Drinks in Golden Gai', desc: 'Tiny post-war alley bars' },
    { emoji: '\uD83C\uDFDB\uFE0F', name: 'Walk through Meiji Shrine', desc: 'Forest sanctuary in the city' },
    { emoji: '\uD83C\uDFA8', name: 'teamLab Planets digital art', desc: 'Immersive sensory exhibit' }
  ];
  var p7MustDoRecsChecked = {};
  var p7MustDoRecsExtraPool = [
    { emoji: '\uD83C\uDF71', name: 'Try authentic tonkatsu', desc: 'Crispy pork cutlet spots' },
    { emoji: '\uD83C\uDFA1', name: 'Day trip to DisneySea', desc: 'Only-in-Tokyo Disney park' },
    { emoji: '\uD83C\uDFDE\uFE0F', name: 'Odaiba waterfront stroll', desc: 'Futuristic artificial island' },
    { emoji: '\uD83C\uDF75', name: 'Traditional tea ceremony', desc: 'Cultural half-day experience' },
    { emoji: '\uD83D\uDE85', name: 'Ride the Shinkansen', desc: 'Bullet train day trip' }
  ];

  function p7RenderMustDoRecs() {
    var listEl = document.getElementById('p7MustDoRecsList');
    if (!listEl) return;
    var html = '';
    p7MustDoRecs.forEach(function(rec, i) {
      var checked = !!p7MustDoRecsChecked[i];
      html += '<label class="p7-mustdo-rec-item' + (checked ? ' p7-mustdo-rec-checked' : '') + '" data-idx="' + i + '">';
      html += '<input type="checkbox" class="p7-mustdo-rec-checkbox"' + (checked ? ' checked' : '') + '>';
      html += '<span class="p7-mustdo-rec-emoji">' + rec.emoji + '</span>';
      html += '<div class="p7-mustdo-rec-content">';
      html += '<span class="p7-mustdo-rec-name">' + rec.name + '</span>';
      html += '<span class="p7-mustdo-rec-desc">' + rec.desc + '</span>';
      html += '</div>';
      html += '</label>';
    });
    listEl.innerHTML = html;
  }

  (function() {
    var listEl = document.getElementById('p7MustDoRecsList');
    var moreBtn = document.getElementById('p7MustDoRecsMore');
    if (!listEl || !moreBtn) return;

    p7RenderMustDoRecs();

    listEl.addEventListener('change', function(e) {
      var checkbox = e.target.closest('.p7-mustdo-rec-checkbox');
      if (!checkbox) return;
      var item = checkbox.closest('.p7-mustdo-rec-item');
      var idx = parseInt(item.getAttribute('data-idx'));
      var rec = p7MustDoRecs[idx];
      if (!rec) return;
      if (checkbox.checked) {
        p7MustDoRecsChecked[idx] = true;
        item.classList.add('p7-mustdo-rec-checked');
        if (p7State.mustDos.indexOf(rec.name) === -1) {
          p7State.mustDos.push(rec.name);
          p7RenderMustDos();
        }
      } else {
        delete p7MustDoRecsChecked[idx];
        item.classList.remove('p7-mustdo-rec-checked');
        var pos = p7State.mustDos.indexOf(rec.name);
        if (pos !== -1) {
          p7State.mustDos.splice(pos, 1);
          p7RenderMustDos();
        }
      }
    });

    moreBtn.addEventListener('click', function() {
      var label = moreBtn.querySelector('span');
      var orig = label ? label.textContent : '';
      if (label) label.textContent = 'Loading...';
      moreBtn.disabled = true;
      setTimeout(function() {
        // Append a few more recommendations from the extra pool
        var added = 0;
        for (var i = 0; i < p7MustDoRecsExtraPool.length && added < 3; i++) {
          var pick = p7MustDoRecsExtraPool[i];
          var dup = p7MustDoRecs.some(function(r) { return r.name === pick.name; });
          if (!dup) { p7MustDoRecs.push(pick); added++; }
        }
        // Rotate pool so repeated clicks can add the remainder
        p7MustDoRecsExtraPool = p7MustDoRecsExtraPool.slice(added).concat(p7MustDoRecsExtraPool.slice(0, added));
        p7RenderMustDoRecs();
        if (label) label.textContent = orig;
        moreBtn.disabled = false;
      }, 700);
    });
  })();

  // Step 4: Flight route display
  function p7UpdateFlightRoute() {
    var dest = p7State.destination || 'Destination';
    document.getElementById('p7FlightTo').textContent = dest;
    p7RecalcPrices();
  }

  // Price calculation based on dropdowns
  var p7BasePrice = 494;
  function p7RecalcPrices() {
    var classEl = document.getElementById('p7FlightClass');
    var travelersEl = document.getElementById('p7FlightTravelers');
    var tripEl = document.getElementById('p7FlightTrip');
    var multiplier = 1;
    if (classEl.value === 'premium') multiplier *= 1.6;
    else if (classEl.value === 'business') multiplier *= 2.8;
    else if (classEl.value === 'first') multiplier *= 4.5;
    var travelers = parseInt(travelersEl.value) || 1;
    if (tripEl.value === 'oneway') multiplier *= 0.55;
    else if (tripEl.value === 'multicity') multiplier *= 1.3;
    var typical = Math.round(p7BasePrice * multiplier * travelers);
    var low = Math.round(typical * 0.58);
    var high = Math.round(typical * 2.13);
    document.getElementById('p7FlightPrice').textContent = '$' + typical.toLocaleString() + ' is typical';
    document.getElementById('p7BellPrice1').textContent = '$' + low.toLocaleString();
    document.getElementById('p7BellPrice2').textContent = '$' + high.toLocaleString();
  }

  // Dropdown change listeners
  ['p7FlightClass','p7FlightTravelers','p7FlightTrip'].forEach(function(id) {
    document.getElementById(id).addEventListener('change', p7RecalcPrices);
  });

  // Add price alert button
  document.getElementById('p7PriceAddAlert').addEventListener('click', function() {
    var pos = 50; // center position
    var price = Math.round(p7BasePrice * 1.0); // roughly mid price
    p7PriceAlerts.push({ pos: pos, price: price });
    p7RenderPriceAlerts();
  });

  function p7RenderPriceAlerts() {
    var container = document.getElementById('p7PriceAlerts');
    container.innerHTML = '';
    p7PriceAlerts.forEach(function(alert, i) {
      var dot = document.createElement('div');
      dot.className = 'p7-price-alert-dot';
      dot.style.left = alert.pos + '%';
      dot.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg><span class="p7-price-alert-price">$' + alert.price.toLocaleString() + '</span>';
      container.appendChild(dot);
    });
  }

  // Step 4: Flights — bar chart
  function p7DrawPriceChart() {
    var canvas = document.getElementById('p7PriceChart');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var now = new Date();
    var monthLabels = [];
    for (var m = 0; m < 3; m++) {
      var mi = (now.getMonth() + m) % 12;
      monthLabels.push(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][mi]);
    }

    // Generate ~12 weeks of price data (bar chart)
    var weekPrices = [];
    var base = 420;
    for (var i = 0; i < 12; i++) {
      base += (Math.random() - 0.45) * 80;
      base = Math.max(250, Math.min(750, base));
      weekPrices.push(Math.round(base));
    }
    var minP = Math.min.apply(null, weekPrices) - 50;
    var maxP = Math.max.apply(null, weekPrices) + 50;
    var range = maxP - minP || 1;

    var chartTop = 20;
    var chartBottom = h - 30;
    var chartH = chartBottom - chartTop;
    var chartLeft = 40;
    var chartRight = w - 10;
    var chartW = chartRight - chartLeft;

    // Draw horizontal price interval lines
    var intervals = 5;
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (var i = 0; i <= intervals; i++) {
      var y = chartTop + (i / intervals) * chartH;
      ctx.beginPath();
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(chartRight, y);
      ctx.stroke();
      // Price label
      var priceLabel = '$' + Math.round(maxP - (i / intervals) * range);
      ctx.fillStyle = '#999';
      ctx.font = '500 16px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(priceLabel, chartLeft - 6, y + 5);
    }
    ctx.setLineDash([]);

    // Draw bars
    var barCount = weekPrices.length;
    var barGap = 6;
    var barWidth = (chartW - barGap * (barCount + 1)) / barCount;

    for (var i = 0; i < barCount; i++) {
      var x = chartLeft + barGap + i * (barWidth + barGap);
      var barH = ((weekPrices[i] - minP) / range) * chartH;
      var y = chartBottom - barH;

      // Bar color based on price
      var ratio = (weekPrices[i] - minP) / range;
      if (ratio < 0.35) ctx.fillStyle = '#34A853';
      else if (ratio < 0.7) ctx.fillStyle = '#7C3AED';
      else ctx.fillStyle = '#EA4335';

      // Rounded top
      var r = Math.min(3, barWidth / 2);
      ctx.beginPath();
      ctx.moveTo(x, chartBottom);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barWidth - r, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
      ctx.lineTo(x + barWidth, chartBottom);
      ctx.closePath();
      ctx.fill();
    }

    // Week labels at bottom
    ctx.fillStyle = '#999';
    ctx.font = '500 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    // Show month labels at week 0, 4, 8
    for (var i = 0; i < 3; i++) {
      var weekIdx = i * 4;
      var x = chartLeft + barGap + weekIdx * (barWidth + barGap) + barWidth / 2;
      ctx.fillText(monthLabels[i], x + (barWidth + barGap) * 1.5, h - 8);
    }
  }

  document.getElementById('p7Step4Next').addEventListener('click', p7NextStep);

  // Step 5: Monitors & Reminders
  var p7MonitorList = document.getElementById('p7MonitorList');
  var p7ReminderList = document.getElementById('p7ReminderList');
  var p7DestRecommendations = {
    'Tokyo': [
      { emoji: '\uD83C\uDF5C', name: 'Ramen District Tour', desc: 'Reservation alert \u00B7 14 days before' },
      { emoji: '\uD83C\uDFEF', name: 'Imperial Palace Gardens', desc: 'Ticket release alert' },
      { emoji: '\uD83C\uDF8C', name: 'Festival & Events', desc: 'Special event notifications' },
    ],
    'Barcelona': [
      { emoji: '\uD83C\uDFDB\uFE0F', name: 'Sagrada Familia Tickets', desc: 'Ticket release alert \u00B7 sells out fast' },
      { emoji: '\uD83C\uDF77', name: 'Wine Tasting Reservations', desc: 'Booking window opens 30 days out' },
      { emoji: '\u26BD', name: 'FC Barcelona Matches', desc: 'Ticket drop notifications' },
    ],
    'Lisbon': [
      { emoji: '\uD83D\uDE8B', name: 'Tram 28 Best Times', desc: 'Crowd monitoring \u00B7 avoid peak hours' },
      { emoji: '\uD83C\uDF70', name: 'Past\u00E9is de Bel\u00E9m', desc: 'Wait time alerts \u00B7 best at 8 AM' },
      { emoji: '\uD83C\uDFB5', name: 'Fado Shows', desc: 'Reservation window \u00B7 7 days out' },
    ],
    'default': [
      { emoji: '\uD83C\uDFAB', name: 'Attraction Tickets', desc: 'Ticket release alerts' },
      { emoji: '\uD83C\uDF7D\uFE0F', name: 'Top Restaurant Reservations', desc: 'Booking window opens 30 days out' },
      { emoji: '\uD83C\uDFAD', name: 'Shows & Events', desc: 'Event notifications' },
    ],
  };

  // Extra reminders pool for Step 5 "Recommend more"
  var p7Step5ExtraReminders = [
    { emoji: '🏯', name: 'Temple District Walk', desc: 'Guided tour alert · 7 days before' },
    { emoji: '🍣', name: 'Sushi Workshop', desc: 'Class booking · limited spots' },
    { emoji: '🛁', name: 'Onsen Experience', desc: 'Reservation alert · 5 days before' },
    { emoji: '🎮', name: 'Gaming District Tour', desc: 'Group tour · 10 days before' },
    { emoji: '🌸', name: 'Park & Garden Tour', desc: 'Seasonal availability alert' },
    { emoji: '🎭', name: 'Traditional Theater', desc: 'Ticket release · 14 days out' },
  ];
  var p7Step5ExtraIdx = 0;
  var p7Step5Reminders = []; // track current reminders for removal

  function p7PopulateStep5() {
    p7MonitorList.innerHTML = '';
    p7ReminderList.innerHTML = '';
    p7State.activityMonitors = {};

    // Monitors: Weather only (no flight prices)
    var monitors = [
      { emoji: '\u2600\uFE0F', name: 'Weather Forecast', desc: 'Packing check \u00B7 3 days before trip' },
    ];
    monitors.forEach(function(item, idx) {
      var id = 'p7Mon' + idx;
      p7State.activityMonitors[id] = true;
      var div = document.createElement('div');
      div.className = 'p6-activity-item';
      div.innerHTML = '<span class="p6-activity-emoji">' + item.emoji + '</span><div class="p6-activity-info"><span class="p6-activity-name">' + item.name + '</span><span class="p6-activity-desc">' + item.desc + '</span></div><div class="p6-monitor-toggle-wrap"><label class="p6-toggle"><input type="checkbox" checked data-actid="' + id + '"><span class="p6-toggle-slider"></span></label></div>';
      p7MonitorList.appendChild(div);
    });

    // Reminders: user must-dos + destination recommendations
    p7Step5Reminders = [];
    p7State.mustDos.forEach(function(md) { p7Step5Reminders.push({ emoji: '\uD83D\uDCCC', name: md, desc: 'Availability & booking alerts', isUser: true }); });
    var destKey = 'default';
    Object.keys(p7DestRecommendations).forEach(function(k) { if (p7State.destination.indexOf(k) !== -1) destKey = k; });
    p7DestRecommendations[destKey].forEach(function(r) { p7Step5Reminders.push({ emoji: r.emoji, name: r.name, desc: r.desc, isUser: false }); });

    p7RenderStep5Reminders();
  }

  function p7RenderStep5Reminders() {
    p7ReminderList.innerHTML = '';

    p7Step5Reminders.forEach(function(item, idx) {
      var id = 'p7Rem' + idx;
      p7State.activityMonitors[id] = true;
      var div = document.createElement('div');
      div.className = 'p6-activity-item';
      var html = '<span class="p6-activity-emoji">' + item.emoji + '</span>';
      html += '<div class="p6-activity-info"><span class="p6-activity-name">' + item.name + '</span><span class="p6-activity-desc">' + item.desc + '</span>';
      html += '<span class="p7-recommended-tag">Recommended activity</span>';
      html += '</div>';
      html += '<div class="p6-monitor-toggle-wrap">';
      if (!item.isUser) html += '<button class="p7-step5-remove-btn" data-step5-rem-idx="' + idx + '" title="Remove">&times;</button>';
      html += '<label class="p6-toggle"><input type="checkbox" checked data-actid="' + id + '"><span class="p6-toggle-slider"></span></label>';
      html += '</div>';
      div.innerHTML = html;
      p7ReminderList.appendChild(div);
    });

    // "Recommend more" button
    var moreBtn = document.createElement('button');
    moreBtn.className = 'p7-recommend-more-btn';
    moreBtn.id = 'p7Step5RecommendMore';
    moreBtn.textContent = 'Recommend more';
    p7ReminderList.appendChild(moreBtn);
  }

  // Step 5 "Recommend more" handler
  document.addEventListener('click', function(e) {
    if (e.target.id === 'p7Step5RecommendMore' || e.target.closest('#p7Step5RecommendMore')) {
      var btn = document.getElementById('p7Step5RecommendMore');
      if (!btn || btn.disabled) return;
      btn.textContent = 'Loading...';
      btn.disabled = true;
      setTimeout(function() {
        for (var i = 0; i < 2; i++) {
          var extra = p7Step5ExtraReminders[p7Step5ExtraIdx % p7Step5ExtraReminders.length];
          p7Step5ExtraIdx++;
          p7Step5Reminders.push({ emoji: extra.emoji, name: extra.name, desc: extra.desc, isUser: false });
        }
        p7RenderStep5Reminders();
      }, 800);
    }
  });

  // Step 5 "Remove" reminder handler
  document.addEventListener('click', function(e) {
    var removeBtn = e.target.closest('.p7-step5-remove-btn');
    if (!removeBtn) return;
    var idx = parseInt(removeBtn.getAttribute('data-step5-rem-idx'));
    if (idx >= 0 && idx < p7Step5Reminders.length) {
      p7Step5Reminders.splice(idx, 1);
      p7RenderStep5Reminders();
    }
  });

  document.getElementById('p7Step5Next').addEventListener('click', function() {
    // Step 5 → Step 6 (trip detail page)
    p7GoToStep(p7CurrentStep + 1, 1);
  });

  // Step 6: Trip Detail Page
  var p7TripCalYear, p7TripCalMonth, p7TripStartDay, p7TripDur, p7TripEvents, p7TripSelectedDay = null;
  var p7FromTripCard = false;
  var p7TripOrigMonth, p7TripOrigYear; // the actual trip month/year

  function p7PopulateFinalPlan() {
    // If opened from trip card, state is already set — just render
    if (p7FromTripCard) {
      p7FromTripCard = false;
      renderTripDetailCalendar();
      renderTripDetailEvents();
      return;
    }

    document.getElementById('p7TripDest').textContent = p7State.destination || 'Your Trip';
    var dateStr = p7State.month || '';
    if (p7State.duration && p7State.duration !== 'custom') dateStr += ' \u00B7 ' + p7State.duration + ' days';
    document.getElementById('p7TripDates').textContent = dateStr;

    // Newly created trips are always upcoming
    var statusTag = document.getElementById('p7TripStatusTag');
    if (statusTag) {
      statusTag.innerHTML = '🏃 Upcoming';
      statusTag.className = 'p7-trip-status-tag';
    }

    var bg = document.getElementById('p7TripBg');
    bg.style.backgroundImage = p7State.destImg ? 'url(' + p7State.destImg + ')' : 'linear-gradient(135deg, #7C3AED, #3B82F6)';

    // Parse trip month
    var now = new Date();
    p7TripCalYear = now.getFullYear();
    p7TripCalMonth = now.getMonth();
    if (p7State.month) {
      var parts = p7State.month.split(' ');
      var mNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var mi = mNames.indexOf(parts[0]);
      if (mi !== -1) p7TripCalMonth = mi;
      if (parts[1]) p7TripCalYear = parseInt(parts[1]);
    }

    p7TripDur = parseInt(p7State.duration) || 14;
    p7TripStartDay = Math.max(1, 10 - Math.floor(Math.random() * 5));
    p7TripSelectedDay = null;
    p7TripOrigMonth = p7TripCalMonth;
    p7TripOrigYear = p7TripCalYear;

    // Build trip events
    p7TripEvents = {};
    var destKey = 'default';
    Object.keys(p7DestRecommendations).forEach(function(k) { if (p7State.destination.indexOf(k) !== -1) destKey = k; });
    var allReminders = [];
    p7State.mustDos.forEach(function(md) { allReminders.push({ emoji: '\uD83D\uDCCC', name: md, desc: 'Availability & booking alerts', meta: 'Your reminder', color: 'purple' }); });
    p7DestRecommendations[destKey].forEach(function(r) { allReminders.push({ emoji: r.emoji, name: r.name, desc: r.desc, meta: 'Zenvoya recommended', color: 'orange' }); });

    // Place flight-booking reminder 1 week (7 days) before trip start
    var flightDayNew = Math.max(1, p7TripStartDay - 7);
    if (!p7TripEvents[flightDayNew]) p7TripEvents[flightDayNew] = [];
    p7TripEvents[flightDayNew].push({
      emoji: '\u2708\uFE0F',
      name: 'Book flight to ' + ((p7State.destination || 'destination').split(',')[0]),
      desc: 'Final reminder to lock in your flight',
      meta: 'Travel',
      type: 'flight',
      color: 'green'
    });
    // Distribute other reminders on days between flight reminder and trip start
    var remStartNew = Math.max(1, p7TripStartDay - 6);
    var remSlotsNew = Math.max(1, p7TripStartDay - remStartNew);
    allReminders.forEach(function(r, i) {
      var day = remStartNew + Math.round((i / Math.max(allReminders.length - 1, 1)) * (remSlotsNew - 1));
      if (day >= p7TripStartDay) day = p7TripStartDay - 1;
      if (day < 1) day = 1;
      if (!p7TripEvents[day]) p7TripEvents[day] = [];
      p7TripEvents[day].push(r);
    });

    renderTripDetailCalendar();
    renderTripDetailEvents();
  }

  function renderTripDetailCalendar() {
    var calEl = document.getElementById('p7TripCal');
    var labelEl = document.getElementById('p7TripCalMonthLabel');
    if (!calEl || !labelEl) return;

    var fullMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var firstDow = new Date(p7TripCalYear, p7TripCalMonth, 1).getDay();
    var daysInMonth = new Date(p7TripCalYear, p7TripCalMonth + 1, 0).getDate();

    labelEl.textContent = fullMonthNames[p7TripCalMonth] + ' ' + p7TripCalYear;

    var html = '<div class="p7-cal-grid">';
    dayNames.forEach(function(d) { html += '<div class="p7-cal-dow">' + d + '</div>'; });
    for (var i = 0; i < firstDow; i++) html += '<div class="p7-cal-day p7-cal-day-empty"></div>';

    // Determine trip month/day boundaries for highlighting
    var tripEndDay = p7TripStartDay + p7TripDur;
    var isTripMonth = (p7TripCalMonth === p7TripOrigMonth && p7TripCalYear === p7TripOrigYear);

    // Today = April 2, 2026 (hardcoded for prototype)
    var isTodayMonth = (p7TripCalMonth === 3 && p7TripCalYear === 2026);
    var todayDay = 2;

    for (var d = 1; d <= daysInMonth; d++) {
      var inTrip = isTripMonth && d >= p7TripStartDay && d < tripEndDay;
      var isTripStart = isTripMonth && d === p7TripStartDay;
      var isTripEnd = isTripMonth && d === tripEndDay - 1;
      var evts = (isTripMonth ? (p7TripEvents[d] || []) : []);
      var isSelected = (p7TripSelectedDay === d);
      var isToday = isTodayMonth && d === todayDay;
      var cls = 'p7-cal-day';
      if (inTrip) cls += ' p7-cal-day-trip';
      if (isTripStart) cls += ' p7-cal-day-trip-start';
      if (isTripEnd) cls += ' p7-cal-day-trip-end';
      if (isSelected) cls += ' p7-cal-day-trip-selected';
      if (isToday) cls += ' p7-cal-day-today';
      html += '<div class="' + cls + '" data-tripcalday="' + d + '">' + d;
      // Only show reminder dots — trip days don't get dots (the trip itself is the highlight)
      if (evts.length && !inTrip) {
        html += '<div class="p7-cal-event-dots">';
        evts.forEach(function(ev) { html += '<span class="p7-cal-event-dot p7-cal-event-dot-' + (ev.color || 'purple') + '"></span>'; });
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    calEl.innerHTML = html;

    // Day click handlers
    calEl.querySelectorAll('.p7-cal-day[data-tripcalday]').forEach(function(dayEl) {
      dayEl.addEventListener('click', function() {
        var day = parseInt(this.getAttribute('data-tripcalday'));
        if (p7TripSelectedDay === day) {
          p7TripSelectedDay = null;
        } else {
          p7TripSelectedDay = day;
        }
        renderTripDetailCalendar();
        renderTripDetailEvents();
      });
    });
  }

  function renderTripDetailEvents() {
    var eventsEl = document.getElementById('p7TripCalEvents');
    var eventsLabel = document.getElementById('p7TripEventsLabel');
    if (!eventsEl) return;

    var fullMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var events = [];

    var isTripMonth = (p7TripCalMonth === p7TripOrigMonth && p7TripCalYear === p7TripOrigYear);

    if (p7TripSelectedDay !== null && isTripMonth) {
      // Show events for selected day (only in trip month)
      var dayEvts = p7TripEvents[p7TripSelectedDay] || [];
      dayEvts.forEach(function(e) {
        events.push({ name: e.name, meta: e.meta, emoji: e.emoji, desc: e.desc, day: p7TripSelectedDay, type: e.type, color: e.color || 'purple' });
      });
      if (eventsLabel) eventsLabel.textContent = fullMonthNames[p7TripCalMonth] + ' ' + p7TripSelectedDay + ' Reminders';
    } else if (isTripMonth) {
      // Show all trip events
      Object.keys(p7TripEvents).forEach(function(d) {
        p7TripEvents[d].forEach(function(e) {
          events.push({ name: e.name, meta: e.meta, emoji: e.emoji, desc: e.desc, day: parseInt(d), type: e.type, color: e.color || 'purple' });
        });
      });
      events.sort(function(a, b) { return a.day - b.day; });
      if (eventsLabel) eventsLabel.textContent = 'Upcoming Reminders';
    } else {
      if (eventsLabel) eventsLabel.textContent = 'No reminders this month';
    }

    if (!events.length) {
      var msg = isTripMonth ? 'No reminders on this day' : 'No reminders this month';
      eventsEl.innerHTML = '<div class="p7-trips-empty"><span class="p7-trips-empty-icon">\uD83D\uDCC5</span>' + msg + '</div>';
      return;
    }

    var html = '';
    var colorMap = { orange: { bg: 'rgba(245,158,11,0.08)', border: '#F59E0B' }, purple: { bg: 'rgba(124,58,237,0.08)', border: '#7C3AED' }, blue: { bg: 'rgba(37,99,235,0.08)', border: '#2563EB' } };
    events.forEach(function(e, idx) {
      var c = colorMap[e.color] || colorMap.purple;
      var isFlight = e.type === 'flight';
      var isRecommended = !isFlight;
      // Filter out flight price info from meta
      var metaText = (e.meta || '');
      html += '<div class="p7-cal-event-card" data-trip-event-idx="' + idx + '" data-trip-event-day="' + e.day + '" style="background:' + c.bg + ';border-left:3px solid ' + c.border + '">';
      html += '<span class="p7-cal-event-bell">\uD83D\uDD14</span>';
      html += '<div class="p7-cal-event-icon p7-cal-event-icon-' + (e.color || 'purple') + '">' + e.emoji + '</div>';
      html += '<div class="p7-cal-event-info"><span class="p7-cal-event-name">' + e.name + '</span><span class="p7-cal-event-meta">' + metaText + '</span>';
      if (isRecommended) html += '<span class="p7-recommended-tag">Recommended activity</span>';
      html += '</div>';
      html += '<div class="p7-cal-event-right">';
      if (isRecommended) html += '<button class="p7-reminder-remove-btn" data-remove-idx="' + idx + '" data-remove-day="' + e.day + '" title="Remove">&times;</button>';
      html += '<span class="p7-cal-event-book">Book from</span>';
      html += '<span class="p7-cal-event-time"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' + fullMonthNames[p7TripCalMonth].substring(0, 3) + ' ' + e.day + '</span>';
      html += '</div></div>';
    });

    eventsEl.innerHTML = html;
  }

  // Trip detail calendar navigation
  document.getElementById('p7TripCalPrev').addEventListener('click', function() {
    p7TripSelectedDay = null;
    p7TripCalMonth--;
    if (p7TripCalMonth < 0) { p7TripCalMonth = 11; p7TripCalYear--; }
    renderTripDetailCalendar();
    renderTripDetailEvents();
  });
  document.getElementById('p7TripCalNext').addEventListener('click', function() {
    p7TripSelectedDay = null;
    p7TripCalMonth++;
    if (p7TripCalMonth > 11) { p7TripCalMonth = 0; p7TripCalYear++; }
    renderTripDetailCalendar();
    renderTripDetailEvents();
  });

  // Extra recommended reminders pool
  var p7ExtraReminders = [
    { emoji: '🏯', name: 'Senso-ji Temple Visit', desc: 'Historic temple in Asakusa', meta: 'Zenvoya recommended', color: 'orange' },
    { emoji: '🎌', name: 'Tsukiji Outer Market', desc: 'Fresh sushi & street food', meta: 'Zenvoya recommended', color: 'orange' },
    { emoji: '🛁', name: 'Onsen Experience', desc: 'Traditional hot spring bath', meta: 'Zenvoya recommended', color: 'orange' },
    { emoji: '🎮', name: 'Akihabara Gaming Tour', desc: 'Retro arcades & anime shops', meta: 'Zenvoya recommended', color: 'orange' },
    { emoji: '🌸', name: 'Ueno Park Stroll', desc: 'Cherry blossoms & museums', meta: 'Zenvoya recommended', color: 'orange' },
    { emoji: '🍣', name: 'Sushi-Making Class', desc: 'Hands-on cooking experience', meta: 'Zenvoya recommended', color: 'orange' },
  ];
  var p7ExtraReminderIdx = 0;

  // "Recommend more" button handler (event delegation)
  document.addEventListener('click', function(e) {
    if (e.target.id === 'p7RecommendMoreBtn' || e.target.closest('#p7RecommendMoreBtn')) {
      var btn = document.getElementById('p7RecommendMoreBtn');
      if (!btn || btn.disabled) return;
      btn.textContent = 'Loading...';
      btn.disabled = true;
      setTimeout(function() {
        // Add 2 more recommended reminders
        var daysInMonth = new Date(p7TripCalYear, p7TripCalMonth + 1, 0).getDate();
        for (var i = 0; i < 2; i++) {
          var extra = p7ExtraReminders[p7ExtraReminderIdx % p7ExtraReminders.length];
          p7ExtraReminderIdx++;
          var day = p7TripStartDay + Math.floor(Math.random() * p7TripDur);
          if (day > daysInMonth) day = daysInMonth;
          if (!p7TripEvents[day]) p7TripEvents[day] = [];
          p7TripEvents[day].push(extra);
        }
        renderTripDetailCalendar();
        renderTripDetailEvents();
      }, 800);
    }
  });

  // "Remove" reminder button handler (event delegation)
  document.addEventListener('click', function(e) {
    var removeBtn = e.target.closest('.p7-reminder-remove-btn');
    if (!removeBtn) return;
    e.stopPropagation();
    var day = parseInt(removeBtn.getAttribute('data-remove-day'));
    var idx = parseInt(removeBtn.getAttribute('data-remove-idx'));

    // Build event list same way as renderTripDetailEvents to find the right event
    var isTripMonth = (p7TripCalMonth === p7TripOrigMonth && p7TripCalYear === p7TripOrigYear);
    if (p7TripSelectedDay !== null && isTripMonth) {
      var dayEvts = p7TripEvents[p7TripSelectedDay] || [];
      if (dayEvts[idx]) { dayEvts.splice(idx, 1); }
    } else if (isTripMonth) {
      var allEvts = [];
      Object.keys(p7TripEvents).forEach(function(d) {
        p7TripEvents[d].forEach(function(ev, ei) {
          allEvts.push({ day: parseInt(d), arrIdx: ei });
        });
      });
      allEvts.sort(function(a, b) { return a.day - b.day; });
      if (allEvts[idx]) {
        var target = allEvts[idx];
        p7TripEvents[target.day].splice(target.arrIdx, 1);
        if (p7TripEvents[target.day].length === 0) delete p7TripEvents[target.day];
      }
    }
    renderTripDetailCalendar();
    renderTripDetailEvents();
  });

  // Trip detail event card click → open reminder detail
  document.addEventListener('click', function(e) {
    var card = e.target.closest('.p7-cal-event-card[data-trip-event-day]');
    if (!card || !card.hasAttribute('data-trip-event-idx')) return;
    // Only handle clicks in the trip detail events
    if (!card.closest('.p7-trip-detail-events-section')) return;
    var day = parseInt(card.getAttribute('data-trip-event-day'));
    var dayEvts = p7TripEvents[day] || [];
    var idx = parseInt(card.getAttribute('data-trip-event-idx'));
    var evt;
    if (p7TripSelectedDay !== null) {
      var selectedEvts = p7TripEvents[p7TripSelectedDay] || [];
      evt = selectedEvts[idx];
    } else {
      // Build full list
      var allEvts = [];
      Object.keys(p7TripEvents).forEach(function(d) {
        p7TripEvents[d].forEach(function(e) {
          allEvts.push({ name: e.name, meta: e.meta, emoji: e.emoji, desc: e.desc, day: parseInt(d), type: e.type, month: p7TripCalMonth, year: p7TripCalYear, time: 'TBD', color: 'purple' });
        });
      });
      allEvts.sort(function(a, b) { return a.day - b.day; });
      evt = allEvts[idx];
    }
    if (!evt) return;
    // Build a full event object for openReminderDetail
    var fullEvt = {
      name: evt.name,
      meta: evt.meta || '',
      desc: evt.desc || '',
      reason: 'We want to make sure you don\'t miss this!',
      img: null,
      day: evt.day,
      month: p7TripCalMonth,
      year: p7TripCalYear,
      time: 'TBD',
      type: evt.type || '',
      color: 'purple'
    };
    openReminderDetail(fullEvt);
  });

  // Trip detail close button → go back to the previous view
  document.getElementById('p7TripDetailClose').addEventListener('click', function() {
    switchView(p7PreviousView || 'home');
  });

  // ---- INVITE MODAL ----
  (function() {
    var inviteBtn = document.getElementById('p7InviteBtn');
    var modal = document.getElementById('p7InviteModal');
    if (!inviteBtn || !modal) return;

    // Move modal to the app root so it overlays the entire phone frame
    var appRoot = document.getElementById('p7App');
    if (appRoot && modal.parentElement !== appRoot) appRoot.appendChild(modal);

    function openModal() { modal.classList.add('p7-invite-modal-open'); }
    function closeModal() { modal.classList.remove('p7-invite-modal-open'); }

    inviteBtn.addEventListener('click', openModal);
    document.getElementById('p7InviteModalClose').addEventListener('click', closeModal);
    document.getElementById('p7InviteModalBackdrop').addEventListener('click', closeModal);

    // Role toggle
    modal.querySelectorAll('.p7-invite-role-option').forEach(function(opt) {
      opt.addEventListener('click', function() {
        modal.querySelectorAll('.p7-invite-role-option').forEach(function(o) { o.classList.remove('p7-invite-role-active'); });
        this.classList.add('p7-invite-role-active');
      });
    });

    // Copy link
    document.getElementById('p7InviteLinkCopy').addEventListener('click', function() {
      var btn = this;
      var orig = btn.textContent;
      var url = document.getElementById('p7InviteLinkUrl').textContent;
      if (navigator.clipboard) { navigator.clipboard.writeText(url).catch(function() {}); }
      btn.textContent = 'Copied!';
      setTimeout(function() { btn.textContent = orig; }, 1500);
    });

    // Search filter
    var searchInput = document.getElementById('p7InviteSearchInput');
    var suggestions = document.querySelectorAll('#p7InviteSuggestions .p7-invite-suggestion');
    searchInput.addEventListener('input', function() {
      var q = this.value.toLowerCase();
      suggestions.forEach(function(s) {
        var name = (s.getAttribute('data-name') || '').toLowerCase();
        var handle = (s.querySelector('.p7-invite-suggestion-handle').textContent || '').toLowerCase();
        var match = !q || name.indexOf(q) > -1 || handle.indexOf(q) > -1;
        s.style.display = match ? 'flex' : 'none';
      });
    });

    // Invite friend button toggle
    modal.querySelectorAll('.p7-invite-add-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (this.classList.contains('p7-invite-added')) {
          this.classList.remove('p7-invite-added');
          this.textContent = 'Invite';
        } else {
          this.classList.add('p7-invite-added');
          this.textContent = '\u2713 Invited';
        }
      });
    });
  })();

  // ---- TRIP DATES CALENDAR PICKER ----
  (function() {
    var datesBtn = document.getElementById('p7TripDatesBtn');
    var dropdown = document.getElementById('p7TripDatesDropdown');
    // Move dropdown up to the banner so it can center within full banner width
    var banner = document.querySelector('.p7-trip-banner');
    if (banner && dropdown && dropdown.parentElement !== banner) banner.appendChild(dropdown);
    var datesText = document.getElementById('p7TripDates');
    var daysBadge = document.getElementById('p7TripDaysBadge');
    var grid = document.getElementById('p7DatePickerGrid');
    var label = document.getElementById('p7DatePickerLabel');
    var prevBtn = document.getElementById('p7DatePickerPrev');
    var nextBtn = document.getElementById('p7DatePickerNext');
    var hint = document.getElementById('p7DatePickerHint');
    var applyBtn = document.getElementById('p7DatePickerApply');
    if (!datesBtn || !dropdown) return;

    var monthFull = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // Picker state
    var viewYear = 2026, viewMonth = 3; // April 2026
    var startDate = null, endDate = null; // { y, m, d }
    var pickingEnd = false;

    function cmp(a, b) {
      if (a.y !== b.y) return a.y - b.y;
      if (a.m !== b.m) return a.m - b.m;
      return a.d - b.d;
    }
    function inRange(day, y, m) {
      if (!startDate || !endDate) return false;
      var c = { y: y, m: m, d: day };
      return cmp(c, startDate) > 0 && cmp(c, endDate) < 0;
    }
    function isStart(day, y, m) {
      return startDate && startDate.y === y && startDate.m === m && startDate.d === day;
    }
    function isEnd(day, y, m) {
      return endDate && endDate.y === y && endDate.m === m && endDate.d === day;
    }

    function render() {
      label.textContent = monthFull[viewMonth] + ' ' + viewYear;
      var firstDow = new Date(viewYear, viewMonth, 1).getDay();
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      var html = '';
      for (var i = 0; i < firstDow; i++) html += '<div class="p7-date-picker-cell p7-date-picker-cell-empty"></div>';
      for (var d = 1; d <= daysInMonth; d++) {
        var cls = 'p7-date-picker-cell';
        if (inRange(d, viewYear, viewMonth)) cls += ' p7-date-picker-cell-range';
        if (isStart(d, viewYear, viewMonth)) cls += ' p7-date-picker-cell-endpoint p7-date-picker-cell-start';
        if (isEnd(d, viewYear, viewMonth)) cls += ' p7-date-picker-cell-endpoint p7-date-picker-cell-end';
        html += '<div class="' + cls + '" data-d="' + d + '">' + d + '</div>';
      }
      grid.innerHTML = html;
    }

    function updateHint() {
      if (!startDate) {
        hint.textContent = 'Select start date';
        applyBtn.disabled = true;
      } else if (!endDate) {
        hint.textContent = 'Select end date';
        applyBtn.disabled = true;
      } else {
        var days = Math.round((new Date(endDate.y, endDate.m, endDate.d) - new Date(startDate.y, startDate.m, startDate.d)) / 86400000) + 1;
        hint.textContent = days + ' day' + (days === 1 ? '' : 's') + ' selected';
        applyBtn.disabled = false;
      }
    }

    function openPicker() {
      // Parse current dates text to seed picker state
      var txt = (datesText.textContent || '').trim();
      var parsed = parseDates(txt);
      if (parsed) {
        startDate = parsed.start;
        endDate = parsed.end;
        viewYear = parsed.start.y;
        viewMonth = parsed.start.m;
        pickingEnd = true; // both are set
      } else {
        startDate = null;
        endDate = null;
        pickingEnd = false;
      }
      render();
      updateHint();
      dropdown.classList.add('p7-dates-dropdown-open');
    }

    function closePicker() {
      dropdown.classList.remove('p7-dates-dropdown-open');
    }

    function parseDates(txt) {
      // Expected e.g. "Apr 12 — Apr 22, 2026" or "Apr 12 - Apr 22, 2026"
      var m = txt.match(/([A-Z][a-z]{2})\s+(\d+)\s*[\u2014\-\u2013]\s*([A-Z][a-z]{2})\s+(\d+),?\s*(\d{4})?/);
      if (!m) return null;
      var mo1 = monthShort.indexOf(m[1]);
      var mo2 = monthShort.indexOf(m[3]);
      var yr = m[5] ? parseInt(m[5]) : viewYear;
      if (mo1 < 0 || mo2 < 0) return null;
      return { start: { y: yr, m: mo1, d: parseInt(m[2]) }, end: { y: yr, m: mo2, d: parseInt(m[4]) } };
    }

    datesBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (dropdown.classList.contains('p7-dates-dropdown-open')) closePicker();
      else openPicker();
    });

    prevBtn.addEventListener('click', function() {
      viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      render();
    });
    nextBtn.addEventListener('click', function() {
      viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      render();
    });

    grid.addEventListener('click', function(e) {
      var cell = e.target.closest('.p7-date-picker-cell[data-d]');
      if (!cell) return;
      var day = parseInt(cell.getAttribute('data-d'));
      var picked = { y: viewYear, m: viewMonth, d: day };
      if (!startDate || pickingEnd) {
        startDate = picked;
        endDate = null;
        pickingEnd = false;
      } else {
        if (cmp(picked, startDate) < 0) {
          endDate = startDate;
          startDate = picked;
        } else {
          endDate = picked;
        }
        pickingEnd = true;
      }
      render();
      updateHint();
    });

    applyBtn.addEventListener('click', function() {
      if (!startDate || !endDate) return;
      var s = monthShort[startDate.m] + ' ' + startDate.d;
      var eStr = monthShort[endDate.m] + ' ' + endDate.d + ', ' + endDate.y;
      datesText.textContent = s + ' \u2014 ' + eStr;
      if (daysBadge) {
        var days = Math.round((new Date(endDate.y, endDate.m, endDate.d) - new Date(startDate.y, startDate.m, startDate.d)) / 86400000) + 1;
        daysBadge.textContent = days + ' day' + (days === 1 ? '' : 's');
      }
      closePicker();
    });

    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target) && !datesBtn.contains(e.target)) {
        closePicker();
      }
    });
  })();

  // Maps button — opens map view and zooms to trip destination
  var tripDestCoords = {
    'paris': [48.8566, 2.3522],
    'rome': [41.9028, 12.4964],
    'barcelona': [41.3851, 2.1734],
    'lisbon': [38.7223, -9.1393],
    'madrid': [40.4168, -3.7038],
    'london': [51.5074, -0.1278],
    'tokyo': [35.6762, 139.6503],
    'new york': [40.7128, -74.0060],
    'los angeles': [34.0522, -118.2437],
    'san francisco': [37.7749, -122.4194],
    'miami': [25.7617, -80.1918],
    'chicago': [41.8781, -87.6298],
    'boston': [42.3601, -71.0589],
    'bali': [-8.4095, 115.1889],
    'bangkok': [13.7563, 100.5018],
    'sydney': [-33.8688, 151.2093]
  };
  document.getElementById('p7MapsBtn').addEventListener('click', function() {
    var destText = (document.getElementById('p7TripDest').textContent || '').toLowerCase();
    var coords = null;
    Object.keys(tripDestCoords).forEach(function(key) {
      if (destText.indexOf(key) !== -1 && !coords) coords = tripDestCoords[key];
    });
    switchView('map');
    setTimeout(function() {
      if (typeof p7MapInstance !== 'undefined' && p7MapInstance && coords) {
        p7MapInstance.flyTo(coords, 11, { duration: 1.2 });
      }
    }, 300);
  });

  // ---- TRIP DETAIL TABS ----
  document.getElementById('p7TripTabs').addEventListener('click', function(e) {
    var tab = e.target.closest('.p7-trip-tab');
    if (!tab) return;
    var tabName = tab.getAttribute('data-triptab');
    // Switch active tab
    this.querySelectorAll('.p7-trip-tab').forEach(function(t) { t.classList.remove('p7-trip-tab-active'); });
    tab.classList.add('p7-trip-tab-active');
    // Switch content
    var page = tab.closest('.p7-page-inner') || tab.closest('.p7-page');
    if (!page) return;
    page.querySelectorAll('.p7-trip-tab-content').forEach(function(c) { c.classList.remove('p7-trip-tab-content-active'); });
    var content = page.querySelector('[data-triptabcontent="' + tabName + '"]');
    if (content) content.classList.add('p7-trip-tab-content-active');
    // Populate spots tab on switch
    if (tabName === 'spots') renderTripSpots();
    if (tabName === 'checklist') renderTripChecklist();
    if (tabName === 'history') renderTripHistory();
  });

  // ---- HISTORY TAB ----
  var p7HistoryMapInstance = null;
  function renderTripHistory() {
    var h = p7RecordedHistory;
    if (!h) {
      h = {
        trail: trailData.slice(0, 8).map(function(t) { return [t.lat, t.lng]; }),
        visited: [
          { emoji: '\u26E9\uFE0F', name: 'Meiji Shrine', time: '10:30 AM', lat: trailData[0].lat, lng: trailData[0].lng, points: 30 },
          { emoji: '\uD83D\uDECD\uFE0F', name: 'Takeshita Street', time: '11:00 AM', lat: trailData[2].lat, lng: trailData[2].lng, points: 20 },
          { emoji: '\uD83C\uDF5C', name: 'Ichiran Ramen', time: '12:00 PM', lat: trailData[4].lat, lng: trailData[4].lng, points: 45 },
          { emoji: '\uD83C\uDFA8', name: 'Design Festa Gallery', time: '1:15 PM', lat: trailData[5].lat, lng: trailData[5].lng, points: 40 },
          { emoji: '\uD83C\uDF38', name: 'Aoyama Flower Market', time: '2:00 PM', lat: trailData[7].lat, lng: trailData[7].lng, points: 50 }
        ],
        points: 185,
        distance: 2.4,
        elapsed: 3600
      };
    }

    var ptsEl = document.getElementById('p7HistoryPoints');
    var placesEl = document.getElementById('p7HistoryPlaces');
    var distEl = document.getElementById('p7HistoryDist');
    if (ptsEl) ptsEl.textContent = '+' + h.points;
    if (placesEl) placesEl.textContent = h.visited.length;
    if (distEl) distEl.textContent = h.distance.toFixed(1) + ' km';

    var listEl = document.getElementById('p7HistoryList');
    if (listEl) {
      var html = '';
      h.visited.forEach(function(v, i) {
        html += '<div class="p7-history-item">';
        html += '<span class="p7-history-item-num">' + (i + 1) + '</span>';
        html += '<span class="p7-history-item-emoji">' + v.emoji + '</span>';
        html += '<div class="p7-history-item-info">';
        html += '<span class="p7-history-item-name">' + v.name + '</span>';
        html += '<span class="p7-history-item-time">' + v.time + '</span>';
        html += '</div>';
        html += '<span class="p7-history-item-points">+' + v.points + '</span>';
        html += '</div>';
      });
      listEl.innerHTML = html;
    }

    var mapEl = document.getElementById('p7HistoryMap');
    if (!mapEl || typeof L === 'undefined') return;
    if (p7HistoryMapInstance) { p7HistoryMapInstance.remove(); p7HistoryMapInstance = null; }
    setTimeout(function() {
      if (!mapEl.offsetParent) return;
      var center = h.trail[Math.floor(h.trail.length / 2)] || [35.6716, 139.6966];
      p7HistoryMapInstance = L.map(mapEl, { center: center, zoom: 15, zoomControl: false, attributionControl: false, dragging: true, scrollWheelZoom: false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(p7HistoryMapInstance);
      if (h.trail.length) {
        L.polyline(h.trail, { color: '#7C3AED', weight: 4, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }).addTo(p7HistoryMapInstance);
      }
      h.visited.forEach(function(v, i) {
        L.marker([v.lat, v.lng], {
          icon: L.divIcon({
            html: '<div class="p7-history-pin">' + (i + 1) + '</div>',
            className: 'proto-leaflet-marker', iconSize: [22, 22], iconAnchor: [11, 11]
          })
        }).addTo(p7HistoryMapInstance);
      });
      if (h.trail.length) {
        p7HistoryMapInstance.fitBounds(L.latLngBounds(h.trail).pad(0.1));
      }
    }, 120);
  }

  // ---- SHARE JOURNEY MODAL ----
  (function() {
    var shareBtn = document.getElementById('p7HistoryShareBtn');
    var modal = document.getElementById('p7ShareModal');
    if (!shareBtn || !modal) return;
    var appRootShare = document.getElementById('p7App');
    if (appRootShare && modal.parentElement !== appRootShare) appRootShare.appendChild(modal);

    var shareMapInstance = null;
    var selectedList = document.getElementById('p7ShareSelectedList');

    function openShareModal() {
      modal.classList.add('p7-share-modal-open');
      var h = p7RecordedHistory || {
        visited: [
          { emoji: '\u26E9\uFE0F', name: 'Meiji Shrine' },
          { emoji: '\uD83D\uDECD\uFE0F', name: 'Takeshita Street' },
          { emoji: '\uD83C\uDF5C', name: 'Ichiran Ramen' },
          { emoji: '\uD83C\uDFA8', name: 'Design Festa Gallery' },
          { emoji: '\uD83C\uDF38', name: 'Aoyama Flower Market' }
        ]
      };
      if (selectedList) {
        selectedList.innerHTML = h.visited.map(function(v, i) {
          return '<label class="p7-share-selected-item">' +
            '<input type="checkbox" class="p7-share-selected-checkbox" data-idx="' + i + '">' +
            '<span class="p7-share-selected-emoji">' + v.emoji + '</span>' +
            '<span class="p7-share-selected-name">' + v.name + '</span>' +
          '</label>';
        }).join('');
      }
      setTimeout(function() {
        var mapEl = document.getElementById('p7ShareMap');
        if (!mapEl || typeof L === 'undefined') return;
        if (shareMapInstance) { shareMapInstance.remove(); shareMapInstance = null; }
        var hh = p7RecordedHistory;
        var trail = (hh && hh.trail) || trailData.slice(0, 8).map(function(t) { return [t.lat, t.lng]; });
        var center = trail[Math.floor(trail.length / 2)] || [35.6716, 139.6966];
        shareMapInstance = L.map(mapEl, { center: center, zoom: 14, zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(shareMapInstance);
        if (trail.length) {
          L.polyline(trail, { color: '#7C3AED', weight: 4, opacity: 0.85 }).addTo(shareMapInstance);
          shareMapInstance.fitBounds(L.latLngBounds(trail).pad(0.15));
        }
      }, 180);
    }

    function closeShareModal() {
      modal.classList.remove('p7-share-modal-open');
    }

    shareBtn.addEventListener('click', openShareModal);
    document.getElementById('p7ShareModalClose').addEventListener('click', closeShareModal);
    document.getElementById('p7ShareModalBackdrop').addEventListener('click', closeShareModal);

    modal.querySelectorAll('input[name="p7ShareType"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        modal.querySelectorAll('.p7-share-option').forEach(function(o) { o.classList.remove('p7-share-option-active'); });
        this.closest('.p7-share-option').classList.add('p7-share-option-active');
        if (this.value === 'selected') {
          selectedList.classList.add('p7-share-selected-visible');
        } else {
          selectedList.classList.remove('p7-share-selected-visible');
        }
      });
    });

    document.getElementById('p7ShareConfirmBtn').addEventListener('click', function() {
      var btn = this;
      var orig = btn.textContent;
      btn.textContent = '\u2713 Shared!';
      setTimeout(function() { btn.textContent = orig; closeShareModal(); }, 1200);
    });
  })();

  // ---- TRIP COST BUTTON ----
  document.getElementById('p7CostBtn').addEventListener('click', function() {
    // Placeholder: in a real app this would open a cost breakdown modal
  });

  // ---- IMPORT PLACES BUTTON ----
  document.getElementById('p7SpotsImportBtn').addEventListener('click', function() {
    var span = this.querySelector('span');
    if (!span) return;
    var orig = span.textContent;
    span.textContent = 'Importing...';
    var self = this;
    self.disabled = true;
    setTimeout(function() {
      span.textContent = orig;
      self.disabled = false;
    }, 1500);
  });

  // ---- CHECKLIST TAB ----
  var p7TripChecklist = [
    { id: 1, text: 'Book flights', done: false },
    { id: 2, text: 'Reserve hotels', done: false },
    { id: 3, text: 'Check passport expiration', done: true },
    { id: 4, text: 'Get travel insurance', done: false },
    { id: 5, text: 'Notify bank of travel dates', done: false },
    { id: 6, text: 'Download offline maps', done: false },
    { id: 7, text: 'Exchange currency', done: false },
    { id: 8, text: 'Pack charger & adapter', done: false }
  ];
  var p7ChecklistNextId = 9;

  function renderTripChecklist() {
    var listEl = document.getElementById('p7ChecklistItems');
    if (!listEl) return;
    var html = '';
    p7TripChecklist.forEach(function(item) {
      var doneCls = item.done ? ' p7-checklist-done' : '';
      html += '<div class="p7-checklist-item' + doneCls + '" data-id="' + item.id + '">';
      html += '<input type="checkbox" class="p7-checklist-checkbox"' + (item.done ? ' checked' : '') + '>';
      html += '<span class="p7-checklist-label">' + item.text.replace(/</g, '&lt;') + '</span>';
      html += '<button class="p7-checklist-remove" type="button" aria-label="Remove">';
      html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6M6 6l12 12"/></svg>';
      html += '</button>';
      html += '</div>';
    });
    listEl.innerHTML = html;
  }

  (function() {
    var listEl = document.getElementById('p7ChecklistItems');
    var form = document.getElementById('p7ChecklistAdd');
    var input = document.getElementById('p7ChecklistInput');
    if (!listEl || !form || !input) return;

    // Toggle checkbox / remove via event delegation
    listEl.addEventListener('click', function(e) {
      var removeBtn = e.target.closest('.p7-checklist-remove');
      if (removeBtn) {
        var row = removeBtn.closest('.p7-checklist-item');
        var id = parseInt(row.getAttribute('data-id'));
        p7TripChecklist = p7TripChecklist.filter(function(it) { return it.id !== id; });
        renderTripChecklist();
        return;
      }
      var checkbox = e.target.closest('.p7-checklist-checkbox');
      if (checkbox) {
        var row2 = checkbox.closest('.p7-checklist-item');
        var id2 = parseInt(row2.getAttribute('data-id'));
        var item = p7TripChecklist.find(function(it) { return it.id === id2; });
        if (item) {
          item.done = checkbox.checked;
          row2.classList.toggle('p7-checklist-done', item.done);
        }
      }
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var val = input.value.trim();
      if (!val) return;
      p7TripChecklist.push({ id: p7ChecklistNextId++, text: val, done: false });
      input.value = '';
      renderTripChecklist();
    });
  })();

  // ---- SPOTS TAB ----
  var p7ExtraPlaces = [
    { emoji: '\uD83C\uDFEF', name: 'Senso-ji Temple', meta: 'Asakusa \u00B7 Historic temple', color: 'orange' },
    { emoji: '\uD83C\uDF38', name: 'Shinjuku Gyoen Garden', meta: 'Shinjuku \u00B7 Cherry blossom park', color: 'orange' },
    { emoji: '\uD83C\uDF63', name: 'Tsukiji Outer Market', meta: 'Tsukiji \u00B7 Sushi & street food', color: 'orange' },
    { emoji: '\uD83D\uDDFC', name: 'Tokyo Skytree', meta: 'Sumida \u00B7 Observation deck', color: 'orange' },
    { emoji: '\uD83C\uDFAE', name: 'Akihabara Electric Town', meta: 'Chiyoda \u00B7 Gaming & anime', color: 'orange' },
    { emoji: '\uD83C\uDF77', name: 'Golden Gai Bars', meta: 'Shinjuku \u00B7 Tiny nostalgic bars', color: 'orange' },
    { emoji: '\uD83D\uDEA5', name: 'Shibuya Crossing', meta: 'Shibuya \u00B7 Iconic scramble', color: 'orange' },
    { emoji: '\uD83C\uDFDE\uFE0F', name: 'Odaiba Waterfront', meta: 'Minato \u00B7 Futuristic island', color: 'orange' },
    { emoji: '\uD83C\uDFDB\uFE0F', name: 'Meiji Jingu Shrine', meta: 'Shibuya \u00B7 Forest sanctuary', color: 'orange' },
    { emoji: '\uD83C\uDF71', name: 'Ramen Yokocho Alley', meta: 'Ebisu \u00B7 Ramen tasting row', color: 'orange' }
  ];

  function renderTripSpots() {
    var listEl = document.getElementById('p7SpotsList');
    if (!listEl) return;
    // Gather all spots from trip events
    var spots = [];
    Object.keys(p7TripEvents).forEach(function(day) {
      p7TripEvents[day].forEach(function(ev) {
        if (ev.type !== 'flight') {
          spots.push({ emoji: ev.emoji, name: ev.name, desc: ev.desc || '', meta: ev.meta || '', color: ev.color || 'purple', day: parseInt(day) });
        }
      });
    });
    // Append 10 extra recommended places (static, visual only)
    p7ExtraPlaces.forEach(function(p) {
      spots.push({ emoji: p.emoji, name: p.name, desc: '', meta: p.meta, color: p.color, day: null });
    });

    if (!spots.length) {
      listEl.innerHTML = '<div class="p7-trips-empty"><span class="p7-trips-empty-icon">\uD83D\uDCCD</span>No spots added yet</div>';
      return;
    }

    var html = '';
    spots.forEach(function(s, idx) {
      html += '<div class="p7-spot-item" data-spot-idx="' + idx + '">';
      html += '<div class="p7-spot-emoji">' + s.emoji + '</div>';
      var spotMeta = (s.meta === 'Zenvoya recommended') ? '' : s.meta;
      html += '<div class="p7-spot-info"><span class="p7-spot-name">' + s.name + '</span>';
      if (spotMeta) html += '<span class="p7-spot-meta">' + spotMeta + '</span>';
      html += '</div>';
      if (s.color === 'orange') html += '<span class="p7-spot-badge">Recommended</span>';
      html += '<span class="p7-spot-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></span>';
      html += '</div>';
    });
    listEl.innerHTML = html;
  }

  // Spot click → open detail
  document.addEventListener('click', function(e) {
    var item = e.target.closest('.p7-spot-item');
    if (!item) return;
    var idx = parseInt(item.getAttribute('data-spot-idx'));
    var spots = [];
    Object.keys(p7TripEvents).forEach(function(day) {
      p7TripEvents[day].forEach(function(ev) {
        if (ev.type !== 'flight') spots.push(ev);
      });
    });
    p7ExtraPlaces.forEach(function(p) { spots.push(p); });
    var spot = spots[idx];
    if (!spot) return;
    p7OpenDetail(spot.name, spot.emoji);
  });

  // "Recommend me" button
  document.getElementById('p7SpotsMoreBtn').addEventListener('click', function() {
    var btn = this;
    var label = btn.querySelector('span');
    var original = label ? label.textContent : '';
    if (label) label.textContent = 'Loading...';
    btn.disabled = true;
    setTimeout(function() {
      // Generate 3 more recommended spots
      var extraSpots = [
        { emoji: '\uD83C\uDFD6\uFE0F', name: 'Scenic Beach Walk', desc: 'Gorgeous coastline views', meta: 'Recommended', color: 'orange' },
        { emoji: '\uD83C\uDF75', name: 'Local Tea Ceremony', desc: 'Traditional cultural experience', meta: 'Recommended', color: 'orange' },
        { emoji: '\uD83C\uDFA8', name: 'Street Art District', desc: 'Instagram-worthy murals', meta: 'Recommended', color: 'orange' },
      ];
      // Add to last trip days
      var lastDay = p7TripStartDay + p7TripDur - 1;
      var daysInMonth = new Date(p7TripCalYear, p7TripCalMonth + 1, 0).getDate();
      if (lastDay > daysInMonth) lastDay = daysInMonth;
      extraSpots.forEach(function(s, i) {
        var day = lastDay - 2 + i;
        if (day > daysInMonth) day = daysInMonth;
        if (day < p7TripStartDay) day = p7TripStartDay;
        if (!p7TripEvents[day]) p7TripEvents[day] = [];
        p7TripEvents[day].push(s);
      });
      renderTripSpots();
      renderTripDetailCalendar();
      renderTripDetailEvents();
      if (label) label.textContent = original;
      btn.disabled = false;
    }, 1200);
  });

  // ---- ITINERARY TAB ----
  document.getElementById('p7GenerateItinerary').addEventListener('click', function() {
    document.getElementById('p7ItineraryEmpty').style.display = 'none';
    document.getElementById('p7ItineraryLoading').style.display = 'block';

    setTimeout(function() {
      document.getElementById('p7ItineraryLoading').style.display = 'none';
      var resultEl = document.getElementById('p7ItineraryResult');
      resultEl.style.display = 'block';

      // Build itinerary from trip events
      var itinerary = {};
      var dur = Math.min(p7TripDur, 7); // show max 7 days
      for (var d = 0; d < dur; d++) {
        var dayNum = p7TripStartDay + d;
        var daysInMonth = new Date(p7TripCalYear, p7TripCalMonth + 1, 0).getDate();
        if (dayNum > daysInMonth) break;
        itinerary[dayNum] = [];

        // Add events from that day
        var dayEvts = p7TripEvents[dayNum] || [];
        dayEvts.forEach(function(ev) {
          itinerary[dayNum].push({ emoji: ev.emoji, name: ev.name });
        });

        // Fill empty days with generic activities
        if (itinerary[dayNum].length === 0) {
          var fillers = [
            { emoji: '\uD83C\uDF05', name: 'Morning exploration' },
            { emoji: '\uD83C\uDF5C', name: 'Local cuisine lunch' },
            { emoji: '\uD83D\uDEB6', name: 'Neighborhood walk' },
          ];
          itinerary[dayNum] = [fillers[d % fillers.length]];
        }
      }

      var timeSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];
      var html = '';
      var fullMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      Object.keys(itinerary).forEach(function(dayNum, dayIdx) {
        html += '<div class="p7-itin-day">';
        html += '<div class="p7-itin-day-label">Day ' + (dayIdx + 1) + ' \u00B7 ' + fullMonthNames[p7TripCalMonth].substring(0, 3) + ' ' + dayNum + '</div>';
        itinerary[dayNum].forEach(function(item, itemIdx) {
          var time = timeSlots[itemIdx % timeSlots.length];
          html += '<div class="p7-itin-item">';
          html += '<span class="p7-itin-time">' + time + '</span>';
          html += '<span class="p7-itin-emoji">' + item.emoji + '</span>';
          html += '<span class="p7-itin-name">' + item.name + '</span>';
          html += '</div>';
        });
        html += '</div>';
      });
      resultEl.innerHTML = html;
    }, 2000);
  });

  // Activity detail overlay
  var p7DetailOverlay = document.getElementById('p7DetailOverlay');
  var p7DetailMap = null;

  function p7OpenDetail(name, emoji) {
    var detail = p7GetDetail(name, emoji);
    // Set photo hero
    var photoEl = document.getElementById('p7DetailPhoto');
    if (photoEl) photoEl.style.backgroundImage = 'url(' + detail.photo + ')';
    // Populate 3-up photo grid on the About tab
    var gridEl = document.getElementById('p7DetailPhotoGrid');
    if (gridEl && detail.photos && detail.photos.length) {
      gridEl.innerHTML = detail.photos.slice(0, 3).map(function(p) {
        return '<div class="p7-detail-photo-grid-cell" style="background-image:url(' + p + ')"></div>';
      }).join('');
    }
    document.getElementById('p7DetailTitle').textContent = detail.name;
    // Rating under title
    var ratingEl = document.getElementById('p7DetailRatingValue');
    var reviewCountEl = document.getElementById('p7DetailReviewCount');
    var starsEl = document.getElementById('p7DetailStars');
    if (ratingEl) ratingEl.textContent = detail.rating.toFixed(1);
    if (reviewCountEl) reviewCountEl.textContent = detail.reviewCount.toLocaleString() + ' reviews';
    if (starsEl) {
      var full = Math.round(detail.rating);
      starsEl.textContent = '\u2605'.repeat(full) + '\u2606'.repeat(5 - full);
    }
    // Points meter — deterministic per spot
    var pointsEl = document.getElementById('p7DetailPointsValue');
    var pointsFill = document.getElementById('p7PointsMeterFill');
    if (pointsEl && pointsFill) {
      // Same name seed used for rating
      var nameSeed2 = 0;
      for (var spi = 0; spi < (detail.name || '').length; spi++) nameSeed2 = (nameSeed2 * 131 + detail.name.charCodeAt(spi)) & 0xffff;
      var pts = 10 + (nameSeed2 % 9) * 5; // 10, 15, 20 ... 50
      pointsEl.textContent = '+' + pts;
      // Animate the arc fill — dasharray is ~82 (arc length); pts/50 of that
      var arcLen = 82;
      var ratio = Math.min(pts / 50, 1);
      pointsFill.setAttribute('stroke-dashoffset', String(arcLen * (1 - ratio)));
    }

    // Sync Reviews tab summary
    var bigRatingEl = document.querySelector('.p7-detail-rating-big');
    var bigStarsEl = document.querySelector('.p7-detail-rating-stars');
    var bigCountEl = document.querySelector('.p7-detail-rating-count');
    if (bigRatingEl) bigRatingEl.textContent = detail.rating.toFixed(1);
    if (bigStarsEl) {
      var fullBig = Math.round(detail.rating);
      bigStarsEl.textContent = '\u2605'.repeat(fullBig) + '\u2606'.repeat(5 - fullBig);
    }
    if (bigCountEl) bigCountEl.textContent = 'Based on ' + detail.reviewCount.toLocaleString() + ' reviews';
    document.getElementById('p7DetailDesc').textContent = detail.desc;
    document.getElementById('p7DetailReasonText').textContent = detail.reason;
    document.getElementById('p7DetailAddress').textContent = detail.address;

    // Reset tabs to "About"
    var tabsEl = document.getElementById('p7DetailTabs');
    if (tabsEl) {
      tabsEl.querySelectorAll('.p7-detail-tab').forEach(function(t) { t.classList.remove('p7-detail-tab-active'); });
      var firstTab = tabsEl.querySelector('[data-detailtab="about"]');
      if (firstTab) firstTab.classList.add('p7-detail-tab-active');
    }
    document.querySelectorAll('.p7-detail-tab-content').forEach(function(c) { c.classList.remove('p7-detail-tab-content-active'); });
    var aboutContent = document.querySelector('[data-detailtabcontent="about"]');
    if (aboutContent) aboutContent.classList.add('p7-detail-tab-content-active');
    // Reset scroll
    var scroll = document.querySelector('#p7DetailOverlay .p6-detail-scroll');
    if (scroll) scroll.scrollTop = 0;

    var reviewsEl = document.getElementById('p7DetailReviews');
    reviewsEl.innerHTML = '';
    detail.reviews.forEach(function(r) {
      var div = document.createElement('div');
      div.className = 'p6-detail-review';
      div.innerHTML = '<div class="p6-detail-review-top"><span class="p6-detail-review-avatar">' + r.initials + '</span><span class="p6-detail-review-name">' + r.name + '</span><span class="p6-detail-review-stars">' + '\u2605'.repeat(r.stars) + '\u2606'.repeat(5 - r.stars) + '</span></div><p class="p6-detail-review-text">' + r.text + '</p>';
      reviewsEl.appendChild(div);
    });

    var mapContainer = document.getElementById('p7DetailMap');
    mapContainer.innerHTML = '';
    if (p7DetailMap) { p7DetailMap.remove(); p7DetailMap = null; }
    p7DetailMap = L.map(mapContainer, { center: [detail.lat, detail.lng], zoom: 15, zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(p7DetailMap);
    L.marker([detail.lat, detail.lng], {
      icon: L.divIcon({ html: '<div style="width:12px;height:12px;background:var(--brand);border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>', className: 'proto-leaflet-marker', iconSize: [12,12], iconAnchor: [6,6] })
    }).addTo(p7DetailMap);
    setTimeout(function() { p7DetailMap.invalidateSize(); }, 100);

    p7DetailOverlay.classList.add('open');
  }

  function p7GetDetail(name, emoji) {
    // Reuse p6 activity details data if available globally, otherwise use defaults
    var destCity = (p7State.destination && p7State.destination.split(',')[0]) || 'your destination';
    // Photo picker — keyword-based match with sensible fallbacks
    var photos = {
      temple: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=500&fit=crop',
      shrine: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=500&fit=crop',
      sushi: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=500&fit=crop',
      market: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&h=500&fit=crop',
      ramen: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=500&fit=crop',
      shibuya: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=500&fit=crop',
      blossom: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=500&fit=crop',
      park: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=500&fit=crop',
      skytree: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&h=500&fit=crop',
      akihabara: 'https://images.unsplash.com/photo-1554797589-7241bb691973?w=800&h=500&fit=crop',
      golden: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=800&h=500&fit=crop',
      teamlab: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=500&fit=crop',
      museum: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&h=500&fit=crop',
      beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
      restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
      flight: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop',
      _default: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=800&h=500&fit=crop'
    };
    var lower = (name || '').toLowerCase();
    var photo = photos._default;
    Object.keys(photos).forEach(function(k) { if (k !== '_default' && lower.indexOf(k) !== -1) photo = photos[k]; });

    // Additional related photos for the 3-up About-tab grid
    var galleryPool = [
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=240&h=240&fit=crop',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=240&h=240&fit=crop',
      'https://images.unsplash.com/photo-1554797589-7241bb691973?w=240&h=240&fit=crop',
      'https://images.unsplash.com/photo-1528164344705-47542687000d?w=240&h=240&fit=crop',
      'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=240&h=240&fit=crop',
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=240&h=240&fit=crop',
      'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=240&h=240&fit=crop',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=240&h=240&fit=crop',
      'https://images.unsplash.com/photo-1533050487297-09b450131914?w=240&h=240&fit=crop',
      'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=240&h=240&fit=crop'
    ];
    // Pick 3 deterministic photos keyed to the name
    function pickPhotos() {
      var seed = 0;
      for (var i = 0; i < (name || '').length; i++) seed = (seed * 31 + name.charCodeAt(i)) & 0xffff;
      var picks = [];
      var used = {};
      for (var j = 0; j < 3; j++) {
        var idx = (seed + j * 17 + j * j) % galleryPool.length;
        while (used[idx]) idx = (idx + 1) % galleryPool.length;
        used[idx] = true;
        picks.push(galleryPool[idx]);
      }
      return picks;
    }

    // Deterministic rating + review count from the spot name
    var nameSeed = 0;
    for (var si = 0; si < (name || '').length; si++) nameSeed = (nameSeed * 131 + name.charCodeAt(si)) & 0xffff;
    var rating = Math.round((4.2 + (nameSeed % 70) / 100) * 10) / 10; // 4.2 – 4.9
    var reviewCount = 3500 + (nameSeed * 7 % 15000); // ~3.5k – 18.5k

    return {
      name: name, emoji: emoji || '\uD83D\uDCCC',
      photo: photo,
      photos: pickPhotos(),
      rating: rating,
      reviewCount: reviewCount,
      category: 'Activity',
      desc: 'A curated experience for ' + destCity + '. Zenvoya will help you plan logistics and timing, including entry tickets, guides, and the best time of day to visit.',
      reason: 'This aligns with your travel preferences. We will track availability and deals.',
      lat: 35.6762 + (Math.random() - 0.5) * 0.02,
      lng: 139.6503 + (Math.random() - 0.5) * 0.02,
      address: destCity,
      reviews: [
        { name: 'Sarah M.', initials: 'S', stars: 5, text: 'Absolutely magical — worth every minute. Arrive early to beat the crowds.' },
        { name: 'Daniel K.', initials: 'D', stars: 5, text: 'A highlight of our trip. The details and atmosphere are incredible.' },
        { name: 'Priya R.', initials: 'P', stars: 4, text: 'Very enjoyable but can get busy on weekends. Go on a weekday if you can.' },
        { name: 'Marco F.', initials: 'M', stars: 5, text: 'Unforgettable. Already planning to come back on our next visit.' }
      ]
    };
  }

  document.getElementById('p7DetailBack').addEventListener('click', function() {
    p7DetailOverlay.classList.remove('open');
    if (p7DetailMap) { setTimeout(function() { p7DetailMap.remove(); p7DetailMap = null; }, 400); }
  });

  // Points modal: open from spot-detail meter OR from record-view level indicator
  var pointsModal = document.getElementById('p7PointsModal');
  if (pointsModal) {
    // Move the modal to the app root so it overlays the whole phone frame
    var appRoot = document.getElementById('p7App');
    if (appRoot && pointsModal.parentElement !== appRoot) appRoot.appendChild(pointsModal);

    function openPointsModal() { pointsModal.classList.add('p7-points-modal-open'); }
    function closePointsModal() { pointsModal.classList.remove('p7-points-modal-open'); }

    var pointsMeterBtn = document.getElementById('p7DetailPointsMeter');
    if (pointsMeterBtn) pointsMeterBtn.addEventListener('click', openPointsModal);
    var levelBtn = document.getElementById('p7RecLevelIndicator');
    if (levelBtn) levelBtn.addEventListener('click', openPointsModal);
    var mapLevelBtn = document.getElementById('p7MapLevelIndicator');
    if (mapLevelBtn) mapLevelBtn.addEventListener('click', openPointsModal);
    var homeLevelCard = document.getElementById('p7HomeLevelCard');
    if (homeLevelCard) homeLevelCard.addEventListener('click', openPointsModal);
    document.getElementById('p7PointsModalClose').addEventListener('click', closePointsModal);
    document.getElementById('p7PointsModalBackdrop').addEventListener('click', closePointsModal);
  }

  // Save to trip button
  var saveBtn = document.getElementById('p7DetailSaveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      var label = this.querySelector('.p7-detail-save-label');
      if (this.classList.contains('p7-detail-saved')) {
        this.classList.remove('p7-detail-saved');
        if (label) label.textContent = 'Save to trip';
      } else {
        this.classList.add('p7-detail-saved');
        if (label) label.textContent = 'Saved';
      }
    });
  }

  // Detail tabs (About / Reviews / Tickets)
  var detailTabs = document.getElementById('p7DetailTabs');
  if (detailTabs) {
    detailTabs.addEventListener('click', function(e) {
      var tab = e.target.closest('.p7-detail-tab');
      if (!tab) return;
      var tabName = tab.getAttribute('data-detailtab');
      detailTabs.querySelectorAll('.p7-detail-tab').forEach(function(t) { t.classList.remove('p7-detail-tab-active'); });
      tab.classList.add('p7-detail-tab-active');
      document.querySelectorAll('.p7-detail-tab-content').forEach(function(c) { c.classList.remove('p7-detail-tab-content-active'); });
      var target = document.querySelector('[data-detailtabcontent="' + tabName + '"]');
      if (target) target.classList.add('p7-detail-tab-content-active');
      // Invalidate map size when switching back to About (map may have been hidden)
      if (tabName === 'about' && p7DetailMap) {
        setTimeout(function() { p7DetailMap.invalidateSize(); }, 50);
      }
    });
  }

  // Activity item taps in create view
  app.querySelector('.p7-view[data-p7view="create"]').addEventListener('click', function(e) {
    var actItem = e.target.closest('.p6-activity-item');
    if (actItem && !e.target.closest('.p6-toggle')) {
      var nameEl = actItem.querySelector('.p6-activity-name');
      var emojiEl = actItem.querySelector('.p6-activity-emoji');
      if (nameEl) p7OpenDetail(nameEl.textContent, emojiEl ? emojiEl.textContent : '\uD83D\uDCCC');
      return;
    }
    var finalItem = e.target.closest('.p6-final-act-item');
    if (finalItem && !e.target.closest('.p6-toggle') && !e.target.closest('.p6-final-act-remove')) {
      var nameEl2 = finalItem.querySelector('.p6-final-act-name');
      var emojiEl2 = finalItem.querySelector('.p6-final-act-emoji');
      var name = nameEl2 ? nameEl2.textContent.replace('Recommended', '').trim() : '';
      if (name) p7OpenDetail(name, emojiEl2 ? emojiEl2.textContent : '\uD83D\uDCCC');
      return;
    }
  });

  // ---- CALENDAR VIEW ----
  var p7CalInitialized = false;
  var p7CalYear, p7CalMonth;
  var p7CalView = 'month'; // month | week | year

  // Trip definitions with colors for calendar
  var p7CalTrips = [
    { id: 'tokyo', name: 'Tokyo, Japan', color: '#7C3AED', bgColor: 'rgba(124,58,237,0.08)', startDay: 12, endDay: 22, month: 3, year: 2026, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop', emoji: '\uD83C\uDDEF\uD83C\uDDF5' },
    { id: 'barcelona', name: 'Barcelona, Spain', color: '#2563EB', bgColor: 'rgba(37,99,235,0.08)', startDay: 20, endDay: 27, month: 4, year: 2026, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=200&fit=crop', emoji: '\uD83C\uDDEA\uD83C\uDDF8' },
  ];

  // Calendar events data — each event has a `trip` key matching a trip id (or null)
  var p7CalEvents = [
    { day: 5,  month: 3, year: 2026, name: 'Comedy Show Tickets', emoji: '\uD83C\uDFAD', color: 'purple', trip: null, time: '8:00 PM', meta: 'The Laugh Factory \u00B7 2 tickets', img: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=200&h=200&fit=crop', desc: 'Live stand-up comedy night featuring top comedians. Doors open at 7 PM.', reason: 'Booking window closes soon \u2014 tickets are 80% sold out. Book now to secure your seats.' },
    { day: 8,  month: 3, year: 2026, name: 'Restaurant Reservation', emoji: '\uD83C\uDF7D\uFE0F', color: 'orange', trip: null, time: '7:30 PM', meta: 'Osteria Francescana \u00B7 Party of 4', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop', desc: 'Three Michelin-star Italian dining experience. Smart casual dress code.', reason: 'Reservation slots for this date are almost full. Cancellation window closes in 48 hours.' },
    { day: 12, month: 3, year: 2026, name: 'Flight to Tokyo', emoji: '\u2708\uFE0F', color: 'blue', trip: 'tokyo', time: '11:45 AM', meta: 'UA 837 \u00B7 SFO \u2192 NRT', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&h=200&fit=crop', desc: 'United Airlines Flight 837 from San Francisco to Narita. Economy class, round-trip.', reason: 'Prices are lowest when booked at least 7 days before departure. Current price is near your budget \u2014 buy now before fares increase.', type: 'flight', route: 'SFO \u2192 NRT', price: 420, airline: 'United Airlines' },
    { day: 15, month: 3, year: 2026, name: 'Ramen District Tour', emoji: '\uD83C\uDF5C', color: 'purple', trip: 'tokyo', time: '12:00 PM', meta: 'Shinjuku \u00B7 Guided tour', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop', desc: 'Guided walking tour through Shinjuku\'s best ramen shops. Includes 3 tastings.', reason: 'Tour has limited spots (max 8 people). Confirm your booking to guarantee your place.' },
    { day: 18, month: 3, year: 2026, name: 'Comedy Club Tokyo', emoji: '\uD83C\uDFAD', color: 'purple', trip: 'tokyo', time: '9:00 PM', meta: 'Shibuya Comedy Loft \u00B7 2 tickets', img: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=200&h=200&fit=crop', desc: 'English-language comedy night at Shibuya Comedy Loft. Local and international acts.', reason: 'This venue sells out quickly. Early bird pricing ends 3 days before the show.' },
    { day: 22, month: 3, year: 2026, name: 'Return Flight', emoji: '\u2708\uFE0F', color: 'blue', trip: 'tokyo', time: '3:30 PM', meta: 'UA 838 \u00B7 NRT \u2192 SFO', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&h=200&fit=crop', desc: 'United Airlines Flight 838 from Narita to San Francisco. Economy class, round-trip return leg.', reason: 'Return flights often spike in price closer to travel date. Lock in your return ticket at least 7 days ahead to save up to 35%.', type: 'flight', route: 'NRT \u2192 SFO', price: 385, airline: 'United Airlines' },
    { day: 25, month: 3, year: 2026, name: 'Restaurant Reservation', emoji: '\uD83C\uDF7D\uFE0F', color: 'orange', trip: null, time: '8:00 PM', meta: 'Noma Pop-Up \u00B7 Party of 2', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop', desc: 'Exclusive Noma pop-up dinner experience. Multi-course tasting menu with wine pairing.', reason: 'Noma pop-ups are extremely limited. Confirm within 24 hours or your reservation will be released.' },
    { day: 2,  month: 4, year: 2026, name: 'Jazz Night Tickets', emoji: '\uD83C\uDFB5', color: 'purple', trip: null, time: '9:00 PM', meta: 'Blue Note \u00B7 2 tickets', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=200&h=200&fit=crop', desc: 'Live jazz performance at the legendary Blue Note. Features Grammy-nominated artists.', reason: 'Blue Note shows sell out weeks in advance. Secure your tickets now for guaranteed entry.' },
    { day: 10, month: 4, year: 2026, name: 'Restaurant Reservation', emoji: '\uD83C\uDF7D\uFE0F', color: 'orange', trip: null, time: '7:00 PM', meta: 'Le Bernardin \u00B7 Party of 2', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=200&h=200&fit=crop', desc: 'Fine dining seafood restaurant. Four-course prix fixe menu. Jacket required.', reason: 'Le Bernardin requires confirmation 48 hours before. We\'ll remind you at the right time.' },
    { day: 14, month: 4, year: 2026, name: 'Comedy Show', emoji: '\uD83C\uDFAD', color: 'purple', trip: null, time: '8:30 PM', meta: 'Stand Up NY \u00B7 4 tickets', img: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=200&h=200&fit=crop', desc: 'Stand-up comedy night with surprise headliner. Full bar and appetizer menu available.', reason: 'Group tickets (4+) get 15% discount if booked 5 days early. Price goes up closer to the date.' },
    { day: 20, month: 4, year: 2026, name: 'Flight to Barcelona', emoji: '\u2708\uFE0F', color: 'blue', trip: 'barcelona', time: '6:20 PM', meta: 'IB 2624 \u00B7 JFK \u2192 BCN', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=200&h=200&fit=crop', desc: 'Iberia Airlines Flight 2624 from JFK to Barcelona. Economy class, round-trip.', reason: 'We\'ve been tracking this route \u2014 prices dropped 12% this week. Book at least 7 days before your trip to lock in the best fare.', type: 'flight', route: 'JFK \u2192 BCN', price: 580, airline: 'Iberia' },
    { day: 27, month: 4, year: 2026, name: 'Return Flight', emoji: '\u2708\uFE0F', color: 'blue', trip: 'barcelona', time: '10:15 AM', meta: 'IB 2625 \u00B7 BCN \u2192 JFK', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=200&h=200&fit=crop', desc: 'Iberia Airlines Flight 2625 from Barcelona to JFK. Economy class, return leg.', reason: 'Return leg prices tend to rise 5 days before departure. Purchase now while fares are within your budget range.', type: 'flight', route: 'BCN \u2192 JFK', price: 545, airline: 'Iberia' },
    { day: 5,  month: 5, year: 2026, name: 'Restaurant Reservation', emoji: '\uD83C\uDF7D\uFE0F', color: 'orange', trip: null, time: '8:00 PM', meta: 'Eleven Madison Park \u00B7 Party of 4', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop', desc: 'Iconic NYC fine dining. Plant-based tasting menu. Jacket recommended.', reason: 'EMP requires reconfirmation 3 days before. Group of 4 needs dietary preferences submitted in advance.' },
    { day: 12, month: 5, year: 2026, name: 'Comedy Show', emoji: '\uD83C\uDFAD', color: 'purple', trip: null, time: '7:30 PM', meta: 'Comedy Cellar \u00B7 2 tickets', img: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=200&h=200&fit=crop', desc: 'Legendary Greenwich Village comedy club. Surprise lineup of NYC\'s best comedians.', reason: 'Comedy Cellar tickets go fast \u2014 last 4 shows sold out within hours of release.' },
  ];

  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function getEventsForDay(y, m, d) {
    return p7CalEvents.filter(function(e) { return e.year === y && e.month === m && e.day === d; });
  }

  function getEventsForMonth(y, m) {
    return p7CalEvents.filter(function(e) { return e.year === y && e.month === m; });
  }

  function getTripById(id) {
    if (!id) return null;
    for (var i = 0; i < p7CalTrips.length; i++) {
      if (p7CalTrips[i].id === id) return p7CalTrips[i];
    }
    return null;
  }

  // Get trips that span across a given month
  function getTripsForMonth(y, m) {
    return p7CalTrips.filter(function(t) { return t.year === y && t.month === m; });
  }

  var p7SelectedDay = null; // null means show all for month

  function initP7Calendar() {
    if (!p7CalInitialized) {
      var now = new Date();
      p7CalYear = now.getFullYear();
      p7CalMonth = now.getMonth(); // 0-indexed
      p7CalInitialized = true;
    }
    renderCalendar();
  }

  function renderCalendar() {
    var label = document.getElementById('p7CalMonthLabel');
    var body = document.getElementById('p7CalBody');
    if (!label || !body) return;

    if (p7CalView === 'month') {
      label.textContent = monthNames[p7CalMonth] + ' ' + p7CalYear;
      renderMonthView(body);
    } else if (p7CalView === 'week') {
      label.textContent = monthNames[p7CalMonth] + ' ' + p7CalYear;
      renderWeekView(body);
    } else {
      label.textContent = p7CalYear.toString();
      renderYearView(body);
    }
    renderEventsList();
  }

  function renderMonthView(body) {
    var tripsThisMonth = getTripsForMonth(p7CalYear, p7CalMonth);

    var html = '<div class="p7-cal-grid">';
    dayNames.forEach(function(d) { html += '<div class="p7-cal-dow">' + d + '</div>'; });

    var firstDay = new Date(p7CalYear, p7CalMonth, 1).getDay();
    var daysInMonth = new Date(p7CalYear, p7CalMonth + 1, 0).getDate();
    var now = new Date();
    var todayD = now.getDate(), todayM = now.getMonth(), todayY = now.getFullYear();

    for (var i = 0; i < firstDay; i++) html += '<div class="p7-cal-day p7-cal-day-empty"></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      var isToday = (d === todayD && p7CalMonth === todayM && p7CalYear === todayY);
      var isSelected = (p7SelectedDay === d);
      var events = getEventsForDay(p7CalYear, p7CalMonth, d);

      // Check if this day is within a trip span
      var tripForDay = null;
      for (var ti = 0; ti < tripsThisMonth.length; ti++) {
        var t = tripsThisMonth[ti];
        if (d >= t.startDay && d <= t.endDay) { tripForDay = t; break; }
      }

      var cls = 'p7-cal-day' + (isToday && !isSelected ? ' p7-cal-day-today' : '') + (isSelected ? ' p7-cal-day-selected' : '');
      var tripBarStyle = '';
      if (tripForDay) {
        cls += ' p7-cal-day-in-trip';
        var isStart = d === tripForDay.startDay;
        var isEnd = d === tripForDay.endDay;
        tripBarStyle = ' style="--trip-color:' + tripForDay.color + ';' +
          (isStart ? '--trip-bl:3px;' : '') +
          (isEnd ? '--trip-br:3px;' : '') + '"';
      }

      html += '<div class="' + cls + '" data-calday="' + d + '"' + tripBarStyle + '>' + d;
      if (events.length) {
        html += '<div class="p7-cal-event-dots">';
        events.forEach(function(e) {
          // Use trip color if event is associated with a trip
          var tripInfo = getTripById(e.trip);
          var dotStyle = tripInfo ? ' style="background:' + tripInfo.color + '"' : '';
          html += '<span class="p7-cal-event-dot p7-cal-event-dot-' + e.color + '"' + dotStyle + '></span>';
        });
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    body.innerHTML = html;

    // Day click handlers
    body.querySelectorAll('.p7-cal-day[data-calday]').forEach(function(dayEl) {
      dayEl.addEventListener('click', function() {
        var day = parseInt(this.getAttribute('data-calday'));
        if (p7SelectedDay === day) {
          p7SelectedDay = null; // deselect
        } else {
          p7SelectedDay = day;
        }
        renderMonthView(body);
        renderEventsList();
      });
    });
  }

  function renderWeekView(body) {
    var now = new Date();
    var todayD = now.getDate(), todayM = now.getMonth(), todayY = now.getFullYear();
    // Get start of current week (Sunday)
    var current = new Date(p7CalYear, p7CalMonth, 1);
    // Find the Monday of the week containing the 1st
    var startDate = new Date(p7CalYear, p7CalMonth, todayM === p7CalMonth && todayY === p7CalYear ? todayD : 1);
    var dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek); // Go to Sunday

    var html = '<div class="p7-cal-week">';
    for (var i = 0; i < 7; i++) {
      var dt = new Date(startDate);
      dt.setDate(startDate.getDate() + i);
      var isToday = (dt.getDate() === todayD && dt.getMonth() === todayM && dt.getFullYear() === todayY);
      var events = getEventsForDay(dt.getFullYear(), dt.getMonth(), dt.getDate());
      html += '<div class="p7-cal-week-row' + (isToday ? ' p7-cal-week-today' : '') + '">';
      html += '<span class="p7-cal-week-day-label">' + dayNames[dt.getDay()] + '</span>';
      html += '<span class="p7-cal-week-num">' + dt.getDate() + '</span>';
      html += '<div class="p7-cal-week-events">';
      if (events.length) {
        events.forEach(function(e) {
          html += '<div class="p7-cal-week-event p7-cal-week-event-' + e.color + '">' + e.emoji + ' ' + e.name + ' · ' + e.time + '</div>';
        });
      }
      html += '</div></div>';
    }
    html += '</div>';
    body.innerHTML = html;
  }

  function renderYearView(body) {
    var now = new Date();
    var todayD = now.getDate(), todayM = now.getMonth(), todayY = now.getFullYear();
    var html = '<div class="p7-cal-year">';
    for (var m = 0; m < 12; m++) {
      html += '<div class="p7-cal-mini-month">';
      html += '<span class="p7-cal-mini-month-label">' + monthNames[m].substring(0, 3) + '</span>';
      html += '<div class="p7-cal-mini-grid">';
      var firstDay = new Date(p7CalYear, m, 1).getDay();
      var daysInMonth = new Date(p7CalYear, m + 1, 0).getDate();
      for (var i = 0; i < firstDay; i++) html += '<div class="p7-cal-mini-day"></div>';
      for (var d = 1; d <= daysInMonth; d++) {
        var isToday = (d === todayD && m === todayM && p7CalYear === todayY);
        var hasEvent = getEventsForDay(p7CalYear, m, d).length > 0;
        var cls = 'p7-cal-mini-day' + (isToday ? ' p7-cal-mini-today' : '') + (hasEvent ? ' p7-cal-mini-has-event' : '');
        html += '<div class="' + cls + '">' + d + '</div>';
      }
      html += '</div></div>';
    }
    html += '</div>';
    body.innerHTML = html;
  }

  function renderEventsList() {
    var eventsEl = document.getElementById('p7CalEvents');
    var eventsLabel = document.getElementById('p7CalEventsLabel');
    if (!eventsEl) return;
    var events;
    if (p7CalView === 'year') {
      events = p7CalEvents.filter(function(e) { return e.year === p7CalYear; });
    } else if (p7SelectedDay !== null && p7CalView === 'month') {
      events = getEventsForDay(p7CalYear, p7CalMonth, p7SelectedDay);
      if (eventsLabel) eventsLabel.textContent = monthNames[p7CalMonth] + ' ' + p7SelectedDay + ' Reminders';
    } else {
      events = getEventsForMonth(p7CalYear, p7CalMonth);
      if (eventsLabel) eventsLabel.textContent = 'Upcoming Reminders';
    }
    events.sort(function(a, b) { return a.day - b.day; });

    if (!events.length) {
      var msg = p7SelectedDay !== null ? 'No reminders on this day' : 'No reminders this month';
      eventsEl.innerHTML = '<div class="p7-trips-empty"><span class="p7-trips-empty-icon">📅</span>' + msg + '</div>';
      return;
    }
    var html = '';
    events.forEach(function(e, idx) {
      var tripInfo = getTripById(e.trip);
      var cardBg = tripInfo ? 'background:' + tripInfo.bgColor + ';border-left:3px solid ' + tripInfo.color : '';
      html += '<div class="p7-cal-event-card" data-cal-event-idx="' + idx + '" data-cal-event-day="' + e.day + '" data-cal-event-month="' + e.month + '" style="' + cardBg + '">';
      html += '<span class="p7-cal-event-bell">\uD83D\uDD14</span>';
      html += '<div class="p7-cal-event-icon p7-cal-event-icon-' + e.color + '" style="background-image:url(\'' + (e.img || '') + '\')"></div>';
      html += '<div class="p7-cal-event-info">';
      if (tripInfo) {
        html += '<span class="p7-cal-event-trip-label" style="color:' + tripInfo.color + '">' + tripInfo.name + '</span>';
      }
      html += '<span class="p7-cal-event-name">' + e.name + '</span><span class="p7-cal-event-meta">' + e.meta + '</span></div>';
      html += '<div class="p7-cal-event-right"><span class="p7-cal-event-book">Book from</span>';
      html += '<span class="p7-cal-event-time"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' + e.time + '</span>';
      html += '</div></div>';
    });
    eventsEl.innerHTML = html;
  }

  // Calendar navigation
  document.getElementById('p7CalPrev').addEventListener('click', function() {
    p7SelectedDay = null;
    if (p7CalView === 'year') { p7CalYear--; }
    else { p7CalMonth--; if (p7CalMonth < 0) { p7CalMonth = 11; p7CalYear--; } }
    renderCalendar();
  });
  document.getElementById('p7CalNext').addEventListener('click', function() {
    p7SelectedDay = null;
    if (p7CalView === 'year') { p7CalYear++; }
    else { p7CalMonth++; if (p7CalMonth > 11) { p7CalMonth = 0; p7CalYear++; } }
    renderCalendar();
  });

  // Calendar view toggle
  document.getElementById('p7CalViewToggle').addEventListener('click', function(e) {
    var btn = e.target.closest('.p7-cal-vbtn');
    if (!btn) return;
    this.querySelectorAll('.p7-cal-vbtn').forEach(function(b) { b.classList.remove('p7-cal-vbtn-active'); });
    btn.classList.add('p7-cal-vbtn-active');
    p7CalView = btn.getAttribute('data-calview');
    p7SelectedDay = null;
    renderCalendar();
  });

  // Calendar event card click → open reminder detail
  document.getElementById('p7CalEvents').addEventListener('click', function(e) {
    var card = e.target.closest('.p7-cal-event-card');
    if (!card) return;
    var day = parseInt(card.getAttribute('data-cal-event-day'));
    var month = parseInt(card.getAttribute('data-cal-event-month'));
    var evts = getEventsForDay(p7CalYear, month, day);
    var idx = parseInt(card.getAttribute('data-cal-event-idx'));
    // Find the matching event
    var evt = evts[0]; // default to first
    // Try matching by index within filtered list
    var allFiltered;
    if (p7SelectedDay !== null && p7CalView === 'month') {
      allFiltered = getEventsForDay(p7CalYear, p7CalMonth, p7SelectedDay);
    } else if (p7CalView === 'year') {
      allFiltered = p7CalEvents.filter(function(e) { return e.year === p7CalYear; });
    } else {
      allFiltered = getEventsForMonth(p7CalYear, p7CalMonth);
    }
    allFiltered.sort(function(a, b) { return a.day - b.day; });
    if (idx < allFiltered.length) evt = allFiltered[idx];
    if (!evt) return;
    openReminderDetail(evt);
  });

  function openReminderDetail(evt) {
    var overlay = document.getElementById('p7ReminderDetail');
    document.getElementById('p7ReminderName').textContent = evt.name;
    document.getElementById('p7ReminderMeta').textContent = evt.meta + ' · ' + monthNames[evt.month] + ' ' + evt.day + ', ' + evt.year + ' at ' + evt.time;
    document.getElementById('p7ReminderDesc').textContent = evt.desc || 'Details for this event.';
    document.getElementById('p7ReminderReason').textContent = evt.reason || 'We want to make sure you don\'t miss this!';
    var imgEl = document.getElementById('p7ReminderImg');
    if (evt.img) {
      imgEl.style.backgroundImage = 'url(' + evt.img + ')';
      imgEl.style.display = 'block';
    } else {
      imgEl.style.display = 'none';
    }

    // Flight price monitor — hidden
    var flightMonitor = document.getElementById('p7ReminderFlightMonitor');
    flightMonitor.style.display = 'none';

    overlay.classList.add('open');
  }

  // Slider interaction in flight monitor
  var rfmRange = document.getElementById('p7RfmRange');
  if (rfmRange) {
    rfmRange.addEventListener('input', function() {
      var val = parseInt(this.value);
      var price = 200 + Math.round(val * 8);
      document.getElementById('p7RfmPrice').textContent = '~$' + price;
      this.style.background = 'linear-gradient(to right, var(--brand, #7C3AED) ' + val + '%, var(--border-opaque) ' + val + '%)';
    });
  }

  document.getElementById('p7ReminderBack').addEventListener('click', function() {
    document.getElementById('p7ReminderDetail').classList.remove('open');
  });

  // "Go to spot/event details" button in reminder detail
  var p7CurrentReminderEvt = null;
  var origOpenReminderDetail = openReminderDetail;
  openReminderDetail = function(evt) {
    p7CurrentReminderEvt = evt;
    origOpenReminderDetail(evt);
    // Update button text based on event type
    var gotoBtn = document.getElementById('p7ReminderGotoBtn');
    if (gotoBtn) {
      if (evt.type === 'flight') {
        gotoBtn.textContent = 'Go to event details';
      } else {
        gotoBtn.textContent = 'Go to spot details';
      }
    }
  };
  document.getElementById('p7ReminderGotoBtn').addEventListener('click', function() {
    if (!p7CurrentReminderEvt) return;
    document.getElementById('p7ReminderDetail').classList.remove('open');
    var evt = p7CurrentReminderEvt;
    // Try to find matching trip and open trip detail on spots tab
    var tripId = evt.trip || '';
    var matchedTrip = null;
    var matchedFilter = 'upcoming';
    ['upcoming', 'recent', 'past'].forEach(function(filter) {
      (p7TripsData[filter] || []).forEach(function(t) {
        if (t.tripId === tripId) { matchedTrip = t; matchedFilter = filter; }
      });
    });
    if (matchedTrip) {
      openTripDetail(matchedTrip, matchedFilter);
      // Switch to spots tab after a short delay
      setTimeout(function() {
        var spotsTab = document.querySelector('.p7-trip-tab[data-triptab="spots"]');
        if (spotsTab) spotsTab.click();
      }, 300);
    } else {
      // No matching trip - open the activity detail overlay within create view
      switchView('create');
      setTimeout(function() {
        p7OpenDetail(evt.name, evt.emoji || '');
      }, 200);
    }
  });

  // ---- TRIPS VIEW ----
  var p7TripsInitialized = false;
  var p7TripsData = {
    upcoming: [
      { dest: 'Tokyo, Japan', dates: 'Apr 12 \u2013 Apr 22, 2026', monitors: 5, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop', emoji: '\uD83C\uDDEF\uD83C\uDDF5', tripId: 'tokyo', startDay: 12, endDay: 22, month: 3, year: 2026, duration: 11 },
      { dest: 'Barcelona, Spain', dates: 'May 20 \u2013 May 27, 2026', monitors: 4, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=200&fit=crop', emoji: '\uD83C\uDDEA\uD83C\uDDF8', tripId: 'barcelona', startDay: 20, endDay: 27, month: 4, year: 2026, duration: 8 },
    ],
    recent: [
      { dest: 'Lisbon, Portugal', dates: 'Mar 1 \u2013 Mar 8, 2026', monitors: 0, img: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=200&fit=crop', emoji: '\uD83C\uDDF5\uD83C\uDDF9' },
    ],
    past: [
      { dest: 'Paris, France', dates: 'Dec 15 \u2013 Dec 22, 2025', monitors: 0, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=200&fit=crop', emoji: '\uD83C\uDDEB\uD83C\uDDF7' },
      { dest: 'Bali, Indonesia', dates: 'Aug 5 \u2013 Aug 15, 2025', monitors: 0, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=200&fit=crop', emoji: '\uD83C\uDDEE\uD83C\uDDE9' },
      { dest: 'New York, USA', dates: 'Jun 1 \u2013 Jun 5, 2025', monitors: 0, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=200&fit=crop', emoji: '\uD83C\uDDFA\uD83C\uDDF8' },
    ]
  };

  var p7CurrentTripFilter = 'upcoming';

  // Now that data is defined, render home view sections
  renderHomeTrips();
  renderHomeReminders();

  function initP7Trips() {
    if (!p7TripsInitialized) {
      p7TripsInitialized = true;
    }
    renderTrips();
  }

  function renderTrips() {
    var list = document.getElementById('p7TripsList');
    if (!list) return;
    var trips = p7TripsData[p7CurrentTripFilter] || [];

    if (!trips.length) {
      list.innerHTML = '<div class="p7-trips-empty"><span class="p7-trips-empty-icon">🧳</span>No ' + p7CurrentTripFilter + ' trips</div>';
      return;
    }

    var html = '';
    trips.forEach(function(trip, idx) {
      var badgeClass = 'p7-trip-badge-' + p7CurrentTripFilter;
      html += '<div class="p7-trip-card" data-trip-filter="' + p7CurrentTripFilter + '" data-trip-idx="' + idx + '">';
      html += '<img class="p7-trip-card-img" src="' + trip.img + '" alt="' + trip.dest + '" onerror="this.style.background=\'linear-gradient(135deg,#7C3AED22,#3B82F622)\';this.style.height=\'100px\'">';
      html += '<div class="p7-trip-card-body">';
      html += '<span class="p7-trip-card-dest">' + trip.emoji + ' ' + trip.dest + '</span>';
      html += '<span class="p7-trip-card-dates">' + trip.dates + '</span>';
      html += '<div class="p7-trip-card-footer">';
      var isCardCompleted = p7CurrentTripFilter === 'past' || p7CurrentTripFilter === 'recent';
      var badgeLabel = isCardCompleted ? '✓ Completed' : '🏃 Upcoming';
      html += '<span class="p7-trip-card-badge ' + badgeClass + '">' + badgeLabel + '</span>';
      if (trip.monitors > 0) html += '<span class="p7-trip-card-monitors">\uD83D\uDCE1 ' + trip.monitors + ' monitors active</span>';
      html += '</div></div></div>';
    });
    list.innerHTML = html;
  }

  // Trip card click → open trip detail page
  document.getElementById('p7TripsList').addEventListener('click', function(e) {
    var card = e.target.closest('.p7-trip-card');
    if (!card) return;
    var filter = card.getAttribute('data-trip-filter');
    var idx = parseInt(card.getAttribute('data-trip-idx'));
    var trips = p7TripsData[filter] || [];
    var trip = trips[idx];
    if (!trip) return;
    openTripDetail(trip, filter);
  });

  function openTripDetail(trip, status) {
    // Reset first, then set state so p7PopulateFinalPlan reads correct values
    resetCreateTrip();

    // Set p7State to match this trip
    p7State.destination = trip.dest;
    p7State.destImg = trip.img;
    p7State.month = monthNames[trip.month || 3].substring(0, 3) + ' ' + (trip.year || 2026);
    p7State.duration = String(trip.duration || 10);
    p7State.mustDos = [];
    p7State.activityMonitors = {};

    // Find events for this trip from p7CalEvents
    var tripId = trip.tripId;
    var tripEvents = {};
    var _tripStart = trip.startDay || 10;
    if (tripId) {
      // Split events into flight-reminders and regular reminders — BOTH go before the trip
      var flightReminder = null;
      var reminderEvents = [];
      p7CalEvents.forEach(function(ev) {
        if (ev.trip !== tripId) return;
        if (ev.type === 'flight') {
          // Only keep one "book flight" reminder (the outbound flight)
          if (!flightReminder || (ev.route && ev.route.indexOf('\u2192') !== -1 && ev.day < flightReminder._origDay)) {
            flightReminder = {
              emoji: '\u2708\uFE0F',
              name: 'Book flight to ' + (trip.dest || 'destination').split(',')[0],
              desc: 'Final reminder to lock in your flight',
              meta: ev.meta || '',
              type: 'flight',
              color: 'green',
              _origDay: ev.day
            };
          }
        } else {
          reminderEvents.push({ emoji: ev.emoji, name: ev.name, desc: ev.desc || '', meta: ev.meta || '', type: ev.type || '', color: ev.color || 'purple' });
        }
      });
      // Place the flight-booking reminder at least 1 week (7 days) before the trip
      if (flightReminder) {
        var flightDay = Math.max(1, _tripStart - 7);
        if (!tripEvents[flightDay]) tripEvents[flightDay] = [];
        tripEvents[flightDay].push(flightReminder);
      }
      // Redistribute other reminders across the days between flight reminder and trip start
      if (reminderEvents.length) {
        var remStart = Math.max(1, _tripStart - 6); // days after flight reminder
        var remSlots = Math.max(1, _tripStart - remStart);
        reminderEvents.forEach(function(r, i) {
          var day = remStart + Math.round((i / Math.max(reminderEvents.length - 1, 1)) * (remSlots - 1));
          if (day >= _tripStart) day = _tripStart - 1;
          if (day < 1) day = 1;
          if (!tripEvents[day]) tripEvents[day] = [];
          tripEvents[day].push(r);
        });
      }
    }

    // Set up trip detail page state
    p7TripCalYear = trip.year || 2026;
    p7TripCalMonth = trip.month || 3;
    p7TripStartDay = trip.startDay || 10;
    p7TripDur = trip.duration || 10;
    p7TripSelectedDay = null;
    p7TripOrigMonth = p7TripCalMonth;
    p7TripOrigYear = p7TripCalYear;
    p7TripEvents = tripEvents;

    // If no events from calendar data, add a flight placeholder
    if (Object.keys(p7TripEvents).length === 0) {
      p7TripEvents[p7TripStartDay] = [{ emoji: '\u2708\uFE0F', name: 'Flight to ' + trip.dest, desc: 'Check in and boarding', meta: 'Travel', type: 'flight', color: 'orange' }];
    }

    // Populate the trip detail page UI directly (before goToStep also calls p7PopulateFinalPlan)
    document.getElementById('p7TripDest').textContent = trip.dest;
    document.getElementById('p7TripDates').textContent = trip.dates || '';
    var bg = document.getElementById('p7TripBg');
    bg.style.backgroundImage = trip.img ? 'url(' + trip.img + ')' : 'linear-gradient(135deg, #7C3AED, #3B82F6)';

    // Set status tag
    var statusTag = document.getElementById('p7TripStatusTag');
    if (statusTag) {
      var tripStatus = status || 'upcoming';
      var isCompleted = tripStatus === 'past' || tripStatus === 'recent';
      statusTag.innerHTML = isCompleted ? '✓ Completed' : '🏃 Upcoming';
      statusTag.className = 'p7-trip-status-tag' + (isCompleted ? ' p7-status-completed' : '');
    }

    // Set days badge
    var daysBadge = document.getElementById('p7TripDaysBadge');
    if (daysBadge) {
      var tripDuration = trip.duration || 10;
      daysBadge.textContent = tripDuration + ' day' + (tripDuration === 1 ? '' : 's');
    }

    // Show the create flow on step 6 (trip detail)
    p7FromTripCard = true;
    var stepIdx = p7Steps.indexOf('6');
    p7GoToStep(stepIdx, 1);
    switchView('create');
  }

  // Trips filter toggle
  document.getElementById('p7TripsToggle').addEventListener('click', function(e) {
    var btn = e.target.closest('.p7-trips-tbtn');
    if (!btn) return;
    this.querySelectorAll('.p7-trips-tbtn').forEach(function(b) { b.classList.remove('p7-trips-tbtn-active'); });
    btn.classList.add('p7-trips-tbtn-active');
    p7CurrentTripFilter = btn.getAttribute('data-tripfilter');
    renderTrips();
  });

  // Initial progress
  p7UpdateProgress();
}

// ======================================================
// Prototype Notified — Notified for Action
// ======================================================
var pnInitialized = false;

function initProtoNotified() {
  if (pnInitialized) return;
  var app = document.getElementById('pnApp');
  if (!app) return;
  pnInitialized = true;

  var views = app.querySelectorAll('.pn-view');
  var notif = document.getElementById('pnNotification');

  function pnSwitchView(viewName) {
    views.forEach(function(v) { v.classList.remove('pn-view-active'); });
    var target = app.querySelector('.pn-view[data-pnview="' + viewName + '"]');
    if (target) target.classList.add('pn-view-active');
  }

  // Show notification after 2.5 seconds
  setTimeout(function() {
    notif.classList.add('pn-notif-show');
  }, 2500);

  // Click notification → flights view
  notif.addEventListener('click', function() {
    pnSwitchView('flights');
    drawPriceChart();
  });

  // Back from flights → homescreen
  document.getElementById('pnFlightsBack').addEventListener('click', function() {
    pnSwitchView('homescreen');
  });

  // Back from checkout → flights
  document.getElementById('pnCheckoutBack').addEventListener('click', function() {
    pnSwitchView('flights');
  });

  // Flight item click → checkout
  var flightItems = app.querySelectorAll('.pn-flight-item');
  var airlineUrls = {
    'Delta': 'www.delta.com/booking',
    'Iberia': 'www.iberia.com/booking',
    'United': 'www.united.com/booking',
    'TAP': 'www.flytap.com/booking',
    'American': 'www.aa.com/booking',
    'Norse': 'www.flynorse.com/booking',
    'JetBlue': 'www.jetblue.com/booking',
    'Air France': 'www.airfrance.com/booking',
    'Lufthansa': 'www.lufthansa.com/booking',
    'LEVEL': 'www.flylevel.com/booking'
  };
  flightItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var airline = item.getAttribute('data-airline');
      var logo = item.querySelector('.pn-flight-logo');
      var name = item.querySelector('.pn-flight-airline').textContent;
      var priceText = item.querySelector('.pn-flight-price').textContent;
      var price = parseFloat(priceText.replace('$', ''));

      // Update checkout page
      document.getElementById('pnCheckoutTitle').textContent = name;
      document.getElementById('pnCheckoutUrl').textContent = airlineUrls[airline] || 'www.airline.com/booking';
      document.getElementById('pnCheckoutAirline').textContent = name;
      var checkoutLogo = document.getElementById('pnCheckoutLogo');
      checkoutLogo.style.background = logo.style.background;
      checkoutLogo.textContent = logo.textContent;

      var baseFare = Math.round(price * 0.75);
      var taxes = price - baseFare;
      document.getElementById('pnBaseFare').textContent = '$' + baseFare.toFixed(2);
      document.getElementById('pnTaxes').textContent = '$' + taxes.toFixed(2);
      document.getElementById('pnTotal').textContent = '$' + price.toFixed(2);

      pnSwitchView('checkout');
    });
  });

  // Draw price chart
  function drawPriceChart() {
    var canvas = document.getElementById('pnPriceChart');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    var W = rect.width;
    var H = rect.height;

    // Price data (6 months)
    var prices = [520, 580, 510, 470, 430, 390];
    var alertLine = 450;
    var minP = 300, maxP = 650;

    function yFromPrice(p) {
      return H - 20 - ((p - minP) / (maxP - minP)) * (H - 40);
    }

    // Grid lines
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (var g = 350; g <= 600; g += 50) {
      var gy = yFromPrice(g);
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.stroke();
    }

    // Alert threshold line (dashed)
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#E53E3E';
    ctx.lineWidth = 1.5;
    var alertY = yFromPrice(alertLine);
    ctx.beginPath();
    ctx.moveTo(0, alertY);
    ctx.lineTo(W, alertY);
    ctx.stroke();
    ctx.restore();

    // Alert label
    ctx.fillStyle = '#E53E3E';
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.fillText('$450 alert', W - 55, alertY - 5);

    // Price line
    ctx.beginPath();
    ctx.strokeStyle = '#7C3AED';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    for (var i = 0; i < prices.length; i++) {
      var x = (i / (prices.length - 1)) * (W - 20) + 10;
      var y = yFromPrice(prices[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Gradient fill under line
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(124,58,237,0.15)');
    grad.addColorStop(1, 'rgba(124,58,237,0)');
    ctx.lineTo((prices.length - 1) / (prices.length - 1) * (W - 20) + 10, H);
    ctx.lineTo(10, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Dots on line
    for (var j = 0; j < prices.length; j++) {
      var dx = (j / (prices.length - 1)) * (W - 20) + 10;
      var dy = yFromPrice(prices[j]);
      ctx.beginPath();
      ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#7C3AED';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Current price callout on last point
    var lastX = ((prices.length - 1) / (prices.length - 1)) * (W - 20) + 10;
    var lastY = yFromPrice(prices[prices.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.font = '700 11px system-ui, sans-serif';
    ctx.fillText('$390', lastX - 30, lastY - 10);
  }
}

// ======================================================
// Prototype 8 — Social Entry
// ======================================================
var p8Initialized = false;

function initProto8() {
  if (p8Initialized) return;
  var app = document.getElementById('p8App');
  if (!app) return;
  p8Initialized = true;

  var p8Views = app.querySelectorAll('.p8-view');
  var p8Steps = ['celebration', '4', '5', 'book', '6'];
  var p8CurrentStep = 0;

  function p8SwitchView(viewName) {
    p8Views.forEach(function(v) { v.classList.remove('p8-view-active'); });
    var target = app.querySelector('.p8-view[data-p8view="' + viewName + '"]');
    if (target) target.classList.add('p8-view-active');
  }

  // ---- TikTok Share Button ----
  var shareBtn = document.getElementById('p8ShareBtn');
  var shareSheet = document.getElementById('p8ShareSheet');

  shareBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    shareSheet.classList.add('p8-share-open');
  });

  // Close share sheet when tapping outside
  app.querySelector('[data-p8view="tiktok"]').addEventListener('click', function(e) {
    if (shareSheet.classList.contains('p8-share-open') && !e.target.closest('.p8-share-sheet-inner') && !e.target.closest('.p8-tt-share-btn')) {
      shareSheet.classList.remove('p8-share-open');
    }
  });

  // ---- Share to Zenvoya ----
  document.getElementById('p8ShareZenvoya').addEventListener('click', function() {
    shareSheet.classList.remove('p8-share-open');
    setTimeout(function() {
      p8SwitchView('analyzing');
      p8StartAnalyzing();
    }, 300);
  });

  // ---- Analyzing Timer ----
  function p8StartAnalyzing() {
    var timerBar = document.getElementById('p8TimerBar');
    timerBar.style.width = '0%';
    var duration = 3000; // 3 seconds
    var start = Date.now();
    function tick() {
      var elapsed = Date.now() - start;
      var pct = Math.min(100, (elapsed / duration) * 100);
      timerBar.style.width = pct + '%';
      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        // Auto-transition to create flow
        setTimeout(function() {
          p8SwitchView('create');
          p8GoToStep(0, 1);
          p8SpawnConfetti();
        }, 300);
      }
    }
    requestAnimationFrame(tick);
  }

  // ---- Create Flow Step Navigation ----
  var p8AllPages = app.querySelectorAll('.p8-page');

  function p8GoToStep(idx, dir) {
    if (idx < 0 || idx >= p8Steps.length) return;
    var oldPage = app.querySelector('.p8-page-active');
    var newStep = p8Steps[idx];
    var newPage = app.querySelector('.p8-page[data-p8step="' + newStep + '"]');
    if (!newPage) return;

    if (oldPage) {
      oldPage.classList.remove('p8-page-active');
      oldPage.style.transform = dir === 1 ? 'translateX(-60px)' : 'translateX(60px)';
      oldPage.style.opacity = '0';
      oldPage.style.pointerEvents = 'none';
    }

    newPage.style.transform = dir === 1 ? 'translateX(60px)' : 'translateX(-60px)';
    newPage.style.opacity = '0';
    void newPage.offsetWidth;
    newPage.classList.add('p8-page-active');
    newPage.style.transform = '';
    newPage.style.opacity = '';
    newPage.style.pointerEvents = '';

    p8CurrentStep = idx;

    // Reset book animations when entering book step
    if (newStep === 'book') {
      var bookPages = app.querySelectorAll('.p7-book-pg');
      bookPages.forEach(function(pg) {
        pg.style.animation = 'none';
        void pg.offsetWidth;
        pg.style.animation = '';
      });
      var bookText = document.getElementById('p8BookText');
      var bookBtn = document.getElementById('p8BookBtn');
      if (bookText) { bookText.style.animation = 'none'; void bookText.offsetWidth; bookText.style.animation = ''; }
      if (bookBtn) { bookBtn.style.animation = 'none'; void bookBtn.offsetWidth; bookBtn.style.animation = ''; }
    }
  }

  function p8NextStep() {
    p8GoToStep(p8CurrentStep + 1, 1);
  }

  // ---- Confetti ----
  function p8SpawnConfetti() {
    var container = document.getElementById('p8Confetti');
    container.innerHTML = '';
    var colors = ['#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#fff'];
    for (var i = 0; i < 40; i++) {
      var c = document.createElement('span');
      c.className = 'p7-confetti-piece';
      c.style.left = Math.random() * 100 + '%';
      c.style.width = (Math.random() * 8 + 4) + 'px';
      c.style.height = (Math.random() * 12 + 6) + 'px';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDelay = (Math.random() * 2) + 's';
      c.style.animationDuration = (Math.random() * 2 + 2) + 's';
      container.appendChild(c);
    }
  }

  // ---- Button Handlers ----
  document.getElementById('p8CelebrationBtn').addEventListener('click', function() {
    p8NextStep();
  });

  document.getElementById('p8Step4Next').addEventListener('click', function() {
    p8NextStep();
  });

  document.getElementById('p8Step5Next').addEventListener('click', function() {
    p8NextStep();
  });

  document.getElementById('p8BookBtn').addEventListener('click', function() {
    p8NextStep();
  });

  // ---- Trip Detail Tabs ----
  var p8TripTabs = document.getElementById('p8TripTabs');
  if (p8TripTabs) {
    p8TripTabs.addEventListener('click', function(e) {
      var tab = e.target.closest('.p7-trip-tab');
      if (!tab) return;
      p8TripTabs.querySelectorAll('.p7-trip-tab').forEach(function(t) { t.classList.remove('p7-trip-tab-active'); });
      tab.classList.add('p7-trip-tab-active');
      var tabName = tab.getAttribute('data-p8triptab');
      app.querySelectorAll('[data-p8triptabcontent]').forEach(function(c) { c.classList.remove('p7-trip-tab-content-active'); });
      var content = app.querySelector('[data-p8triptabcontent="' + tabName + '"]');
      if (content) content.classList.add('p7-trip-tab-content-active');
    });
  }

  // ---- Trip Detail Calendar (static for Barcelona, May 2026) ----
  function p8RenderCalendar() {
    var cal = document.getElementById('p8TripCal');
    if (!cal) return;
    var year = 2026, month = 4; // May 2026
    var startDay = 20, endDay = 27;
    var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var html = '<div class="p7-cal-grid">';
    dayNames.forEach(function(d) { html += '<div class="p7-cal-dow">' + d.toUpperCase() + '</div>'; });
    for (var i = 0; i < firstDay; i++) html += '<div class="p7-cal-day p7-cal-day-empty"></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      var cls = 'p7-cal-day';
      if (d >= startDay && d <= endDay) cls += ' p7-cal-day-trip';
      html += '<div class="' + cls + '">' + d + '</div>';
    }
    html += '</div>';
    cal.innerHTML = html;
  }

  // ---- Trip Detail Events (static) ----
  function p8RenderEvents() {
    var eventsEl = document.getElementById('p8TripCalEvents');
    if (!eventsEl) return;
    var events = [
      { emoji: '✈️', name: 'Flight to Barcelona', desc: 'IB 2624 · JFK → BCN', meta: 'May 20', color: 'orange' },
      { emoji: '✈️', name: 'Return Flight', desc: 'IB 2625 · BCN → JFK', meta: 'May 27', color: 'orange' },
      { emoji: '🏛️', name: 'Sagrada Familia Tickets', desc: 'Ticket release alert', meta: 'May 22', color: 'purple', recommended: true },
      { emoji: '⚽', name: 'FC Barcelona Match', desc: 'Ticket notifications', meta: 'May 24', color: 'purple', recommended: true }
    ];
    var html = '';
    events.forEach(function(ev) {
      html += '<div class="p7-cal-event-card">';
      html += '<span class="p7-cal-event-icon">' + ev.emoji + '</span>';
      html += '<div class="p7-cal-event-info">';
      html += '<span class="p7-cal-event-name">' + ev.name + '</span>';
      html += '<span class="p7-cal-event-desc">' + ev.desc + '</span>';
      if (ev.recommended) html += '<span class="p7-recommended-tag">Recommended activity</span>';
      html += '</div>';
      html += '<div class="p7-cal-event-right"><span class="p7-cal-event-book">BOOK FROM</span><span class="p7-cal-event-date">⏰ ' + ev.meta + '</span></div>';
      html += '</div>';
    });
    eventsEl.innerHTML = html;
  }

  // ---- Spots (static) ----
  function p8RenderSpots() {
    var spotsList = document.getElementById('p8SpotsList');
    if (!spotsList) return;
    var spots = [
      { emoji: '🏛️', name: 'Sagrada Familia', desc: 'Iconic basilica by Gaudí', rating: '4.8' },
      { emoji: '🏙️', name: 'Gothic Quarter', desc: 'Medieval streets and plazas', rating: '4.7' },
      { emoji: '🍽️', name: 'La Boqueria Market', desc: 'Famous food market on La Rambla', rating: '4.6' },
      { emoji: '🏖️', name: 'Barceloneta Beach', desc: 'Popular city beach', rating: '4.5' },
      { emoji: '🎨', name: 'Park Güell', desc: 'Gaudí\'s mosaic park', rating: '4.7' }
    ];
    var html = '';
    spots.forEach(function(s) {
      html += '<div class="p7-spot-card">';
      html += '<span class="p7-spot-emoji">' + s.emoji + '</span>';
      html += '<div class="p7-spot-info"><span class="p7-spot-name">' + s.name + '</span><span class="p7-spot-desc">' + s.desc + '</span></div>';
      html += '<span class="p7-spot-rating">⭐ ' + s.rating + '</span>';
      html += '</div>';
    });
    spotsList.innerHTML = html;
  }

  // Render when entering step 6
  var origGoToStep = p8GoToStep;
  p8GoToStep = function(idx, dir) {
    origGoToStep(idx, dir);
    if (p8Steps[idx] === '6') {
      p8RenderCalendar();
      p8RenderEvents();
      p8RenderSpots();
    }
  };

  // Done button goes back to TikTok
  document.getElementById('p8DoneBtn').addEventListener('click', function() {
    p8SwitchView('tiktok');
    // Reset create flow
    p8AllPages.forEach(function(pg) {
      pg.classList.remove('p8-page-active');
      pg.style.transform = ''; pg.style.opacity = ''; pg.style.pointerEvents = '';
    });
    var firstPage = app.querySelector('.p8-page[data-p8step="celebration"]');
    if (firstPage) firstPage.classList.add('p8-page-active');
    p8CurrentStep = 0;
  });

  // Close button on trip detail
  document.getElementById('p8TripDetailClose').addEventListener('click', function() {
    p8SwitchView('tiktok');
    p8AllPages.forEach(function(pg) {
      pg.classList.remove('p8-page-active');
      pg.style.transform = ''; pg.style.opacity = ''; pg.style.pointerEvents = '';
    });
    var firstPage = app.querySelector('.p8-page[data-p8step="celebration"]');
    if (firstPage) firstPage.classList.add('p8-page-active');
    p8CurrentStep = 0;
  });
}
