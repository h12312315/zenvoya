/* Zenvoya group-chat prototype — data.
   Single source of truth for people, cities, places, flights and cart seed.
   Loaded before zenvoya-groupchat.js. */

/* ───────── People ───────── */
const ME = { id: 'me', name: 'George', initial: 'G', color: '#000000' };
const FRIENDS = [
  { id: 'maya',  name: 'Maya Chen',      initial: 'M', color: '#00b8ff', loc: 'San Francisco, CA', status: 'Planning Japan together',      shared: '2 shared trips  ·  3 shared chats', since: 'September 2026', activity: 'Maya added Kyoto food tour to Japan in spring' },
  { id: 'alex',  name: 'Alex Rivera',    initial: 'A', color: '#6ea90f', loc: 'Austin, TX',        status: 'Ready for the next adventure', shared: '1 shared trip  ·  2 shared chats',  since: 'August 2026',    activity: 'Alex saved Park Güell to Onsite 2026' },
  { id: 'priya', name: 'Priya Shah',     initial: 'P', color: '#ff3b30', loc: 'New York, NY',      status: 'Always finding the best food', shared: '2 shared trips  ·  2 shared chats', since: 'June 2026',      activity: 'Priya reviewed Tsukiji Outer Market' },
  { id: 'james', name: 'James Wilson',   initial: 'J', color: '#007aff', loc: 'London, UK',        status: 'Weekend escape enthusiast',    shared: '1 shared trip  ·  1 shared chat',   since: 'May 2026',       activity: 'James booked a weekend in Lisbon' },
  { id: 'sofia', name: 'Sofia Martinez', initial: 'S', color: '#944c32', loc: 'Barcelona, Spain',  status: 'Collecting little moments',    shared: '1 shared trip  ·  2 shared chats',  since: 'March 2026',     activity: 'Sofia shared El Born Tapas with you' },
  { id: 'noah',  name: 'Noah Kim',       initial: 'N', color: '#34c759', loc: 'Seattle, WA',       status: 'Mountains over meetings',      shared: '1 shared trip  ·  1 shared chat',   since: 'January 2026',   activity: 'Noah added Gullfoss Waterfall to Iceland' },
];
FRIENDS.forEach(f => { f.photo = `images/figma/friend-${f.id}.jpg`; });
const personById = id => (id === 'me' ? ME : FRIENDS.find(f => f.id === id));

/* ───────── Places ─────────
   [id, name, area, emoji, photo file (images/locations/) or null, lng, lat, category, meta, hours, time to spend, description, good to know] */
const P = (id, name, area, emoji, img, lng, lat, cat, meta, hours, time, desc, good, extra) =>
  ({ id, name, area, emoji, img: img ? 'images/locations/' + img : null, ll: [lng, lat], cat, meta, hours, time, desc, good, extra: !!extra });

const CITIES = {
  tokyo: {
    id: 'tokyo', name: 'Tokyo', country: 'Japan', flag: '🇯🇵', days: 7, code: 'NRT', airport: 'Narita International Airport (NRT)',
    img: 'images/figma/trip-tokyo.jpg', airportImg: 'images/locations/narita-airport.jpg', currency: '¥',
    photos: [
      { img: 'images/figma/trip-tokyo.jpg', name: 'Tokyo Tower', desc: 'The red-and-white tower rising above the trees of Shiba Park.' },
      { img: 'images/figma/tokyo-gallery-2.jpg', name: 'Tokyo Skytree in spring', desc: 'Pink blossoms frame the Skytree on a clear morning in Sumida.' },
      { img: 'images/figma/tokyo-gallery-3.jpg', name: 'The city at blue hour', desc: 'Office towers and taillights along a wide avenue just after sunset.' },
      { img: 'images/figma/tokyo-gallery-4.jpg', name: 'Ameyoko market', desc: 'The gateway to Ameya-Yokochō, Ueno’s open-air market street.' },
      { img: 'images/figma/tokyo-gallery-5.jpg', name: 'Ginza at night', desc: 'Lit shopfronts and evening traffic on Ginza’s main street.' },
    ],
    blurb: 'Explore Tokyo’s ancient temples, neon-lit streets, and unforgettable food.',
    places: [
      P('sensoji', 'Sensō-ji Temple', 'Asakusa', '⛩️', 'senso-ji-temple.jpg', 139.7967, 35.7148, 'spot', 'Buddhist temple · Free entry', 'Daily, 6:00–17:00', '60–90 minutes', 'Tokyo’s oldest temple, reached through the lantern-hung Kaminarimon gate and a street of snack stalls.', 'Go early · Free entry · Busy on weekends'),
      P('meiji', 'Meiji Shrine', 'Harajuku', '🌳', 'meiji-shrine.jpg', 139.6993, 35.6764, 'spot', 'Shinto shrine · Free entry', 'Daily, sunrise–sunset', '45–60 minutes', 'A quiet forest shrine a few minutes from Harajuku station, with wide gravel paths under tall cedars.', 'Free entry · Shaded walk · Near Omotesandō'),
      P('shibuya', 'Shibuya Crossing', 'Shibuya', '🚦', 'shibuya-crossing.jpg', 139.7005, 35.6595, 'spot', 'Landmark · Free', 'Open 24 hours', '30 minutes', 'The famous scramble crossing, best watched from above at dusk when the screens light up.', 'Best at dusk · Free · Great for photos'),
      P('teamlab', 'teamLab Planets', 'Toyosu', '🎨', 'teamlab-planets.jpg', 139.7898, 35.6491, 'spot', 'Digital art museum · ¥3,800 per person', 'Daily, 9:00–22:00', '90 minutes', 'Walk barefoot through rooms of water, light and mirrors in this immersive art museum.', 'Book ahead · Wear shorts · Barefoot inside'),
      P('akihabara', 'Akihabara', 'Chiyoda', '🎮', 'akihabara.jpg', 139.7745, 35.7023, 'spot', 'Electronics district · Free', 'Shops, 10:00–20:00', '1–2 hours', 'Multi-storey arcades, anime shops and electronics stores packed into a few bright blocks.', 'Arcades · Retro games · Open late'),
      P('omotesando', 'Omotesandō', 'Shibuya', '🛍️', 'omotesando.jpg', 139.7123, 35.6652, 'spot', 'Shopping avenue · Free', 'Shops, 11:00–20:00', '1–2 hours', 'A tree-lined avenue of flagship stores and cafés, with small backstreets worth wandering.', 'Architecture · Cafés · Near Meiji Shrine'),
      P('tsukiji', 'Tsukiji Outer Market', 'Tsukiji', '🍣', 'tsukiji-outer-market.jpg', 139.7707, 35.6655, 'food', 'Japanese · Seafood · ¥2,000–4,000 per person', 'Daily, 5:00–14:00', '60–90 minutes', 'Rows of stalls selling fresh sushi, tamagoyaki and grilled seafood. Come hungry and come early.', 'Cash helps · Closed some Wednesdays · Best before 10:00'),
      P('goldengai', 'Shinjuku Golden Gai', 'Shinjuku', '🍺', 'shinjuku-golden-gai.jpg', 139.7046, 35.6940, 'food', 'Bars · Izakaya · ¥2,000–3,000 per person', 'Daily, 19:00–late', '1–2 hours', 'Six narrow alleys of tiny bars, each seating a handful of people. Good for a late drink and a snack.', 'Cover charges common · Tiny bars · Evenings only'),
      P('ramenx', 'Ramen X', 'Ginza', '🍜', null, 139.7650, 35.6717, 'food', 'Japanese · Ramen · ¥1,000–2,000 per person', 'Daily, 11:00–22:00', '45–60 minutes', 'A cozy ramen stop in Tokyo, with rich broth, springy noodles and comforting bowls topped with chashu and a soft-boiled egg.', 'Dine-in · Counter seating · Great for a quick lunch', true),
    ],
    recs: {
      spots: [['Tsukiji food walk', 'Tsukiji · 3 hours', 'Est. ¥9,000 / person', 'tsukiji', 'images/figma/rec-tsukiji-food-walk.jpg'], ['Tokyo skyline at sunset', 'Shibuya · 1–2 hours', 'Est. ¥3,000 / person', 'shibuya', 'images/figma/rec-tokyo-skyline-at-sunset.jpg']],
      social: [['Sushi-making class', 'Shinjuku · 2 hours', 'Est. ¥12,000 / person', 'goldengai', 'images/figma/rec-sushi-making-class.jpg'], ['Asakusa culture walk', 'Asakusa · 2 hours', 'Est. ¥6,000 / person', 'sensoji', 'images/figma/rec-asakusa-culture-walk.jpg'], ['Shinjuku evening food tour', 'Shinjuku · 3 hours', 'Est. ¥13,000 / person', 'akihabara', 'images/figma/rec-shinjuku-evening-food-tour.jpg'], ['Traditional tea ceremony', 'Ueno · 1 hour', 'Est. ¥5,000 / person', 'meiji', 'images/figma/rec-traditional-tea-ceremony.jpg']],
    },
  },
  kyoto: {
    id: 'kyoto', heroName: 'Kiyomizu-dera pagoda', heroDesc: 'The vermilion three-storey pagoda at Kiyomizu-dera, above the trees of Higashiyama.', name: 'Kyoto', country: 'Japan', flag: '🇯🇵', days: 7, code: 'KIX', airport: 'Kansai International Airport (KIX)',
    img: 'images/figma/trip-kyoto.jpg', airportImg: 'images/locations/kansai-airport.jpg', currency: '¥',
    blurb: 'Wander Kyoto’s golden temples, bamboo groves, and lantern-lit teahouse lanes.',
    places: [
      P('kinkakuji', 'Kinkaku-ji', 'Kita', '🏯', 'kinkaku-ji.jpg', 135.7292, 35.0394, 'spot', 'Zen temple · ¥500 per person', 'Daily, 9:00–17:00', '45–60 minutes', 'The Golden Pavilion, a gold-leaf temple reflected in a still pond and ringed by a strolling garden.', 'Go at opening · Cash only · No interior access'),
      P('fushimi', 'Fushimi Inari Shrine', 'Fushimi', '⛩️', 'fushimi-inari-shrine.jpg', 135.7727, 34.9671, 'spot', 'Shinto shrine · Free entry', 'Open 24 hours', '2–3 hours', 'Thousands of vermilion torii gates climbing a wooded hillside. The crowds thin out the higher you go.', 'Free entry · Lots of stairs · Quiet after dark'),
      P('arashiyama', 'Arashiyama Bamboo Grove', 'Arashiyama', '🎋', 'arashiyama-bamboo-grove.jpg', 135.6713, 35.0170, 'spot', 'Nature walk · Free', 'Open 24 hours', '60 minutes', 'A path through towering bamboo on Kyoto’s western edge, close to river views and temple gardens.', 'Best before 8:00 · Free · Pair with Tenryū-ji'),
      P('gion', 'Gion District', 'Higashiyama', '🏮', 'gion-district.jpg', 135.7751, 35.0037, 'food', 'Japanese · Kaiseki & teahouses · ¥4,000–8,000 per person', 'Evenings, 17:00–22:00', '2 hours', 'Wooden teahouses and lantern-lit lanes, with small restaurants serving seasonal Kyoto dishes.', 'Reserve dinner · No photos on private lanes · Evenings'),
    ],
  },
  paris: {
    id: 'paris', name: 'Paris', country: 'France', flag: '🇫🇷', days: 5, code: 'CDG', airport: 'Paris Charles de Gaulle Airport (CDG)',
    img: 'images/trips/paris.jpg', airportImg: 'images/locations/charles-de-gaulle-airport.jpg', currency: '€',
    blurb: 'See Paris through its museums, riverside walks, and corner cafés.',
    places: [
      P('eiffel', 'Eiffel Tower', '7th arr.', '🗼', 'eiffel-tower.jpg', 2.2945, 48.8584, 'spot', 'Landmark · €29 to the summit', 'Daily, 9:30–23:00', '2 hours', 'The iron tower over the Champ de Mars, with city views from three levels and lights on the hour after dark.', 'Book a time slot · Stairs are cheaper · Sparkles hourly'),
      P('louvre', 'Louvre Museum', '1st arr.', '🖼️', 'louvre-museum.jpg', 2.3376, 48.8606, 'spot', 'Art museum · €22 per person', 'Wed–Mon, 9:00–18:00', '3 hours', 'The world’s largest art museum, home to the Mona Lisa and miles of galleries in a former palace.', 'Closed Tuesdays · Book ahead · Enter via Carrousel'),
      P('montmartre', 'Montmartre', '18th arr.', '🎨', 'montmartre.jpg', 2.3431, 48.8867, 'spot', 'Neighborhood · Free', 'Open all day', '2 hours', 'A hilltop village of steep lanes, artists’ squares and the white domes of Sacré-Cœur.', 'Hilly · Great at sunset · Watch your pockets'),
      P('champs', 'Champs-Élysées', '8th arr.', '🛍️', 'champs-elysees.jpg', 2.3078, 48.8698, 'spot', 'Avenue · Free', 'Shops, 10:00–20:00', '1–2 hours', 'The broad avenue running from Place de la Concorde up to the Arc de Triomphe.', 'Flagship stores · Arc rooftop view · Busy evenings'),
      P('seine', 'Seine River Cruise', 'Port de la Bourdonnais', '🚢', 'seine-river-cruise.jpg', 2.2970, 48.8600, 'spot', 'Boat tour · €17 per person', 'Daily, 10:00–22:30', '60 minutes', 'An hour on the water past Notre-Dame, the Louvre and the bridges of central Paris.', 'Go at dusk · Sit on top deck · No booking needed'),
      P('marais', 'Le Marais', '4th arr.', '🥐', 'le-marais.jpg', 2.3622, 48.8579, 'food', 'French · Bakeries & bistros · €15–30 per person', 'Daily, 8:00–22:00', '2 hours', 'Medieval lanes filled with bakeries, falafel counters and small bistros around Place des Vosges.', 'Open Sundays · Falafel on Rue des Rosiers · Walkable'),
      P('stgermain', 'Saint-Germain', '6th arr.', '☕', 'saint-germain.jpg', 2.3338, 48.8539, 'food', 'French · Cafés · €10–25 per person', 'Daily, 7:30–23:00', '90 minutes', 'Left Bank café terraces, bookshops and chocolate makers a short walk from the river.', 'Terrace seating · Pricey coffee · Good people-watching'),
    ],
  },
  rome: {
    id: 'rome', name: 'Rome', country: 'Italy', flag: '🇮🇹', days: 4, code: 'FCO', airport: 'Leonardo da Vinci–Fiumicino Airport (FCO)',
    img: 'images/trips/rome.jpg', airportImg: 'images/locations/fiumicino-airport.jpg', currency: '€',
    blurb: 'Trace Rome’s ancient ruins, baroque fountains, and trattoria-lined lanes.',
    places: [
      P('colosseum', 'Colosseum', 'Celio', '🏛️', 'colosseum.jpg', 12.4922, 41.8902, 'spot', 'Ancient site · €18 per person', 'Daily, 8:30–19:00', '2 hours', 'The vast Roman amphitheatre, with the Forum and Palatine Hill on the same ticket.', 'Book ahead · Bring water · Combined ticket'),
      P('trevi', 'Trevi Fountain', 'Trevi', '⛲', 'trevi-fountain.jpg', 12.4833, 41.9009, 'spot', 'Landmark · Free', 'Open 24 hours', '30 minutes', 'Rome’s grandest fountain, carved into the back of a palace. Toss a coin to come back.', 'Go early or late · Free · Very crowded midday'),
      P('vatican', 'Vatican Museums', 'Vatican City', '🖼️', 'vatican-museums.jpg', 12.4536, 41.9065, 'spot', 'Art museum · €20 per person', 'Mon–Sat, 8:00–19:00', '3 hours', 'Centuries of papal collections ending in the Sistine Chapel.', 'Closed Sundays · Cover shoulders · Book ahead'),
      P('trastevere', 'Trastevere', 'Trastevere', '🍝', 'trastevere.jpg', 12.4700, 41.8897, 'food', 'Italian · Trattorias · €20–35 per person', 'Daily, 12:00–23:00', '2 hours', 'Ivy-covered lanes across the river, full of trattorias serving carbonara and cacio e pepe.', 'Dinner after 20:00 · Cobblestones · Lively at night'),
    ],
  },
  barcelona: {
    id: 'barcelona', name: 'Barcelona', country: 'Spain', flag: '🇪🇸', days: 5, code: 'BCN', airport: 'Barcelona–El Prat Airport (BCN)',
    img: 'images/trips/barcelona.jpg', airportImg: 'images/locations/barcelona-el-prat-airport.jpg', currency: '€',
    blurb: 'Mix Gaudí landmarks, beach afternoons, and late tapas in Barcelona.',
    places: [
      P('sagrada', 'Sagrada Família', 'Eixample', '⛪', 'sagrada-familia.jpg', 2.1744, 41.4036, 'spot', 'Basilica · €26 per person', 'Daily, 9:00–20:00', '90 minutes', 'Gaudí’s unfinished basilica, with a forest of stone columns and stained glass that floods the nave with color.', 'Book ahead · Go in the afternoon light · Towers extra'),
      P('guell', 'Park Güell', 'Gràcia', '🦎', 'park-guell.jpg', 2.1527, 41.4145, 'spot', 'Park · €10 per person', 'Daily, 9:30–19:30', '90 minutes', 'A hillside park of mosaic benches, gingerbread gatehouses and wide views over the city.', 'Timed entry · Uphill walk · Best in the morning'),
      P('barceloneta', 'Barceloneta Beach', 'Barceloneta', '🏖️', 'barceloneta-beach.jpg', 2.1925, 41.3784, 'spot', 'Beach · Free', 'Open all day', '2 hours', 'The city’s main beach, lined with a promenade, chiringuitos and seafood restaurants.', 'Free · Busy in summer · Watch your bag'),
      P('elborn', 'El Born Tapas', 'El Born', '🍤', 'el-born-tapas.jpg', 2.1823, 41.3851, 'food', 'Spanish · Tapas · €20–35 per person', 'Daily, 13:00–24:00', '2 hours', 'Standing-room tapas bars in medieval lanes, pouring vermouth and passing plates over the counter.', 'Eat late · Order at the bar · Cash handy'),
    ],
  },
  lisbon: {
    id: 'lisbon', name: 'Lisbon', country: 'Portugal', flag: '🇵🇹', days: 4, code: 'LIS', airport: 'Humberto Delgado Airport (LIS)',
    img: 'images/trips/lisbon.jpg', airportImg: 'images/locations/lisbon-airport.jpg', currency: '€',
    blurb: 'Climb Lisbon’s hills for castle views, fado nights, and a day in Sintra.',
    places: [
      P('alfama', 'Alfama & São Jorge Castle', 'Alfama', '🏰', 'alfama-castle.jpg', -9.1335, 38.7139, 'spot', 'Castle · €15 per person', 'Daily, 9:00–21:00', '2 hours', 'Lisbon’s oldest quarter, climbing in tiled alleys up to castle ramparts above the river.', 'Steep streets · Tram 28 stops nearby · Sunset views'),
      P('pena', 'Pena Palace, Sintra', 'Sintra', '🏯', 'pena-palace-sintra.jpg', -9.3906, 38.7876, 'spot', 'Palace · €20 per person', 'Daily, 9:30–18:30', 'Half day', 'A yellow-and-red hilltop palace in the forests of Sintra, 40 minutes from Lisbon by train.', 'Book a time slot · Bus 434 from station · Cooler than Lisbon'),
      P('fado', 'Fado in Alfama', 'Alfama', '🎶', 'fado-in-alfama.jpg', -9.1300, 38.7114, 'food', 'Portuguese · Dinner & live fado · €35–50 per person', 'Daily, 19:30–24:00', '2–3 hours', 'Candlelit taverns where dinner pauses for singers and the Portuguese guitar.', 'Reserve ahead · Quiet during songs · Late start'),
    ],
  },
  santorini: {
    id: 'santorini', name: 'Santorini', country: 'Greece', flag: '🇬🇷', days: 5, code: 'JTR', airport: 'Santorini International Airport (JTR)',
    img: 'images/trips/santorini.jpg', airportImg: 'images/locations/santorini-airport.jpg', currency: '€',
    blurb: 'Chase caldera sunsets, volcanic beaches, and hillside vineyards in Santorini.',
    places: [
      P('oia', 'Oia Village', 'Oia', '🌅', 'oia-village.jpg', 25.3753, 36.4618, 'spot', 'Village · Free', 'Open all day', '2–3 hours', 'Whitewashed houses and blue domes on the island’s northern tip, famous for its sunset.', 'Arrive early for sunset · Many steps · Free'),
      P('redbeach', 'Red Beach', 'Akrotiri', '🏖️', 'red-beach.jpg', 25.3945, 36.3487, 'spot', 'Beach · Free', 'Open all day', '2 hours', 'A small cove under rust-red volcanic cliffs near the Akrotiri ruins.', 'Rocky path · Bring water shoes · Go before noon'),
      P('caldera', 'Caldera Viewpoint', 'Fira', '🌋', 'caldera-viewpoint.jpg', 25.4315, 36.4166, 'spot', 'Viewpoint · Free', 'Open 24 hours', '45 minutes', 'A cliff-edge path from Fira with a clear view across the flooded volcano crater.', 'Free · Walk to Imerovigli · Windy'),
      P('vineyard', 'Santo Vineyard', 'Pyrgos', '🍷', 'vineyard.jpg', 25.4500, 36.3900, 'food', 'Greek · Wine tasting · €25–40 per person', 'Daily, 10:00–21:00', '90 minutes', 'Taste crisp Assyrtiko on a terrace above the caldera, with small plates of local cheese and tomato.', 'Book sunset tables · Tasting flights · Taxi back'),
    ],
  },
  reykjavik: {
    id: 'reykjavik', name: 'Reykjavik', country: 'Iceland', flag: '🇮🇸', days: 5, code: 'KEF', airport: 'Keflavík International Airport (KEF)',
    img: 'images/trips/reykjavik.jpg', airportImg: 'images/locations/keflavik-airport.jpg', currency: 'ISK ',
    blurb: 'Soak in geothermal lagoons, see waterfalls, and watch for the northern lights.',
    places: [
      P('bluelagoon', 'Blue Lagoon', 'Grindavík', '♨️', 'blue-lagoon.jpg', -22.4495, 63.8804, 'spot', 'Geothermal spa · From ISK 9,990', 'Daily, 8:00–22:00', '3 hours', 'Milky-blue geothermal water in a lava field, 20 minutes from the airport.', 'Book ahead · Condition your hair · Towel included'),
      P('gullfoss', 'Gullfoss Waterfall', 'Golden Circle', '💦', 'gullfoss-waterfall.jpg', -20.1199, 64.3271, 'spot', 'Waterfall · Free', 'Open 24 hours', '60 minutes', 'A two-tier waterfall dropping into a narrow canyon on the Golden Circle route.', 'Free · Waterproof jacket · Icy paths in winter'),
      P('aurora', 'Northern Lights Spot', 'Grótta', '🌌', 'northern-lights-spot.jpg', -21.9920, 64.1640, 'spot', 'Viewpoint · Free', 'After dark, Sep–Apr', '1–2 hours', 'A dark stretch of shore by the Grótta lighthouse, the easiest aurora viewpoint from town.', 'Check the forecast · Dress warm · Clear skies only'),
    ],
  },
};
Object.values(CITIES).forEach(c => c.places.forEach(p => { p.city = c.id; }));
/* Trip properties shown under the drawer title: [match, popularity, themes]. Tokyo's are from Figma. */
Object.entries({
  tokyo: [4.5, 3.8, 'Culture · Shopping · Food'],
  kyoto: [4.6, 4.2, 'Temples · Gardens · Food'],
  paris: [4.3, 4.8, 'Art · Food · Architecture'],
  rome: [4.4, 4.6, 'History · Food · Architecture'],
  barcelona: [4.2, 4.4, 'Architecture · Beach · Food'],
  lisbon: [4.1, 4.0, 'Views · Food · Culture'],
  santorini: [4.0, 4.3, 'Views · Beach · Food'],
  reykjavik: [4.4, 3.6, 'Nature · Hot springs · Northern lights'],
}).forEach(([id, [match, pop, tags]]) => Object.assign(CITIES[id], { match, pop, tags }));
const placeById = id => { for (const c of Object.values(CITIES)) { const p = c.places.find(x => x.id === id); if (p) return p; } return null; };
/* Ramen X uses the Figma gallery */
(rx => {
  rx.photos = [
    ['Chashu ramen', 'Rich broth with sliced chashu, greens and a soft-boiled egg.'],
    ['Noodle pull', 'Springy noodles lifted from a bowl of green-onion ramen.'],
    ['At the counter', 'A patterned bowl served at one of the wooden counters.'],
    ['House ramen', 'The signature bowl with pork, cucumber and two halves of egg.'],
    ['Late-night bowl', 'A wide bowl under the neon signs of the dining room.'],
  ].map(([name, desc], i) => ({ img: `images/figma/ramenx-${i + 1}.jpg`, name, desc }));
  rx.img = rx.photos[0].img;
})(placeById('ramenx'));

/* Gallery photos: every photo carries a name and a description */
const placePhotos = p => p.photos || (p.img ? [{ img: p.img, name: p.name, desc: p.desc }] : []);
const cityPhotos = c => [
  ...(c.photos || [{ img: c.img, name: c.heroName || c.name, desc: c.heroDesc || c.blurb }]),
  ...c.places.filter(p => p.img).map(p => ({ img: p.img, name: p.name, desc: p.desc })),
];

/* Search keywords → cities to suggest */
const DESTINATIONS = [
  [/japan|tokyo|kyoto/i, ['tokyo', 'kyoto'], 'Japan'],
  [/france|paris/i, ['paris'], 'Paris'],
  [/ital|rome/i, ['rome'], 'Rome'],
  [/spain|barcelona/i, ['barcelona'], 'Barcelona'],
  [/portugal|lisbon/i, ['lisbon'], 'Lisbon'],
  [/gree|santorini/i, ['santorini'], 'Santorini'],
  [/iceland|reykjav/i, ['reykjavik'], 'Iceland'],
  [/europe/i, ['paris', 'rome', 'barcelona'], 'Europe'],
  [/beach|island|sun/i, ['santorini', 'barcelona'], 'Beach'],
];

/* ───────── Itinerary ─────────
   Day 1, the last day and the Tokyo days are the Figma itinerary (text + photos).
   Other cities get their middle days generated from their places. */
const WEEKDAYS = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
let _actId = 0;
const act = (time, title, where, emoji, o = {}) => ({ id: 'a' + (++_actId), time, title, where, emoji, img: o.img || null, placeId: o.placeId || null, opt: o.opt || null });
const placeAct = (time, p, opt) => act(time, p.name, p.area, p.emoji, { img: p.img, placeId: p.id, opt });
const actSlug = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* [slot, time, title, option, linked place id] */
const FIGMA_DAYS = {
  first: [['Morning', '08:00–09:00', 'Bagels in the East Village'], ['Afternoon', '12:00–13:30', 'Chelsea Market lunch', 'Option A'], ['Afternoon', '12:00–13:30', 'West Village pizza', 'Option B'], ['Evening', '18:00–21:00', 'Airport dinner & departure']],
  last: [['Morning', '09:00–10:30', 'Arrival & breakfast'], ['Afternoon', '13:00–14:30', 'Neighborhood deli lunch', 'Option A'], ['Afternoon', '13:00–14:30', 'Chinatown dumplings', 'Option B'], ['Evening', '18:00–19:00', 'Welcome-home dinner']],
  tokyo: [
    [['Morning', '09:00–10:00', 'Arrival & coffee'], ['Afternoon', '13:00–14:30', 'Shinjuku ramen', 'Option A'], ['Afternoon', '13:00–14:30', 'Udon in Shinjuku', 'Option B'], ['Evening', '18:00–19:30', 'Omoide Yokocho dinner']],
    [['Morning', '09:00–10:30', 'Asakusa street-food walk', null, 'sensoji'], ['Afternoon', '12:30–14:00', 'Asakusa tempura', 'Option A'], ['Afternoon', '12:30–14:00', 'Ueno market bites', 'Option B'], ['Evening', '18:30–20:00', 'Okonomiyaki dinner']],
    [['Morning', '08:30–10:00', 'Tsukiji breakfast walk', null, 'tsukiji'], ['Afternoon', '13:00–15:00', 'Sushi-making class', 'Option A'], ['Afternoon', '13:00–15:00', 'Ginza tea & sweets', 'Option B'], ['Evening', '18:00–19:30', 'Ginza sushi dinner']],
    [['Morning', '09:30–10:30', 'Omotesando café breakfast', null, 'omotesando'], ['Afternoon', '13:00–14:30', 'Harajuku snack trail', 'Option A'], ['Afternoon', '13:00–14:30', 'Shibuya depachika lunch', 'Option B'], ['Evening', '19:00–20:30', 'Shibuya izakaya dinner']],
    [['Morning', '09:00–10:00', 'Kissaten breakfast'], ['Afternoon', '12:30–14:00', 'Shimokitazawa curry', 'Option A'], ['Afternoon', '12:30–14:00', 'Soba & souvenir snacks', 'Option B'], ['Evening', '18:30–20:00', 'Farewell shabu-shabu']],
  ],
};
/* Places on the map that sit near each Tokyo day's plan (used by the map's day filter) */
const FIGMA_NEAR = { tokyo: [['goldengai'], ['sensoji', 'akihabara'], ['tsukiji', 'ramenx', 'teamlab'], ['omotesando', 'meiji', 'shibuya'], ['shibuya', 'akihabara']] };
function figmaDay(rows, label, where, near) {
  const slots = ['Morning', 'Afternoon', 'Evening'].map(name => ({ name, acts: [] }));
  rows.forEach(([slot, time, title, opt, placeId]) => slots.find(s => s.name === slot).acts.push(act(time, title, where, '🍽️', { img: `images/figma/act-${actSlug(title)}.jpg`, opt, placeId })));
  return { label, city: where, slots, near: near || [] };
}

function buildItinerary(city, nDays) {
  const n = nDays || city.days;
  const spots = city.places.filter(p => p.cat === 'spot' && !p.extra);
  const food = city.places.filter(p => p.cat === 'food' && !p.extra);
  const all = city.places.filter(p => !p.extra);
  const fixed = FIGMA_DAYS[city.id];
  let si = 0, fi = 0;
  const spot = () => spots[si++ % spots.length];
  const eat = () => (food.length ? food[fi++ % food.length] : all[(si + fi++) % all.length]);
  const days = [];
  for (let d = 0; d < n; d++) {
    const label = `${WEEKDAYS[d % 7]}, Oct ${3 + d}`;
    if (d === 0) days.push(figmaDay(FIGMA_DAYS.first, label, 'New York City'));
    else if (d === n - 1) days.push(figmaDay(FIGMA_DAYS.last, label, 'New York City'));
    else if (fixed) { const k = (d - 1) % fixed.length; days.push(figmaDay(fixed[k], label, city.name, (FIGMA_NEAR[city.id] || [])[k])); }
    else {
      const a = spot(), b = spots.length > 2 ? spot() : eat();
      days.push({ label, city: city.name, slots: [
        { name: 'Morning', acts: [placeAct('09:00–10:30', spot())] },
        { name: 'Afternoon', acts: [placeAct('13:00–14:30', a, 'Option A'), placeAct('13:00–14:30', b, 'Option B')] },
        { name: 'Evening', acts: [placeAct('18:00–19:30', eat())] },
      ] });
    }
  }
  return days;
}
const dateRange = n => `Oct 3 - Oct ${3 + n - 1}`;

/* ───────── Place detail (location drawer) ───────── */
function placeDetail(p) {
  const city = CITIES[p.city];
  const seed = [...p.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rating = p.id === 'ramenx' ? 4.8 : (4.4 + (seed % 5) / 10);
  const count = p.id === 'ramenx' ? 128 : 180 + (seed * 7) % 2400;
  const food = p.cat === 'food';
  const reviews = p.id === 'ramenx'
    ? [
        { score: '4.8', title: 'Rich broth, perfectly cooked noodles', up: 'The chashu was tender and the egg was just right. A lovely stop for lunch.', down: 'A short queue at lunchtime, but service was quick.', by: 'Maya', date: 'Oct 12, 2026' },
        { score: '4.6', title: 'A cozy spot for a comforting bowl', up: 'Flavorful ramen and friendly service. The counter seats are great for solo dining.', down: 'Seating is limited, so arrive a little early.', by: 'Daniel', date: 'Sep 28, 2026' },
      ]
    : [
        { score: rating.toFixed(1), title: food ? 'Worth planning a meal around' : 'A highlight of the trip', up: food ? `Everything we tried at ${p.name} was fresh and full of flavor.` : `${p.name} was even better in person. Easy to reach and well signposted.`, down: food ? 'It fills up fast, so go a little early.' : 'It gets busy by late morning.', by: 'Maya', date: 'Oct 12, 2026' },
        { score: (rating - 0.2).toFixed(1), title: food ? 'Friendly, quick and good value' : 'Give yourself enough time', up: food ? 'Great for a relaxed stop between sights.' : `We spent ${p.time} here and didn’t feel rushed.`, down: food ? 'Seating is limited at peak hours.' : 'Not much shade or shelter while you wait.', by: 'Daniel', date: 'Sep 28, 2026' },
      ];
  const [kind, ...rest] = p.meta.split(' · ');
  return {
    rating: rating.toFixed(1), count,
    visit: [['Opening hours', p.hours], ['Location', `${p.area}, ${city.name}`], ['Time to spend', p.time]],
    reviews,
    aboutText: p.id === 'ramenx'
      ? 'A casual Japanese ramen spot in Tokyo for a relaxed meal between exploring the city. Expect warming bowls, classic toppings and a cozy, no-fuss atmosphere.'
      : `${p.desc} It sits in ${p.area}, ${city.name}, and fits easily into a day of exploring nearby.`,
    hoursRows: p.id === 'ramenx' ? [['Monday–Friday', '11:00–22:00'], ['Saturday–Sunday', '11:00–22:00']] : [['Hours', p.hours], ['Best time', food ? 'Just before the rush' : 'Early morning']],
    hoursNote: p.id === 'ramenx' ? 'Last orders 30 minutes before closing.' : 'Hours can change on public holidays.',
    detailsTitle: food ? 'Dining details' : 'Visit details',
    details: p.id === 'ramenx'
      ? [['Cuisine', 'Japanese · Ramen'], ['Price range', '¥1,000–2,000 per person'], ['Service', 'Dine-in · Walk-ins welcome'], ['Atmosphere', 'Casual · Solo-friendly']]
      : [[food ? 'Cuisine' : 'Type', kind], [food ? 'Price range' : 'Entry', rest.join(' · ') || 'Free'], ['Area', p.area], ['Good for', p.good.split(' · ')[0]]],
  };
}

/* ───────── Flights ───────── */
const FLIGHTS = [
  { labels: ['Cheapest', 'Best'], price: '$1,200', out: { dep: '2:30pm', arr: '2:30pm', stops: 2, dur: '14h 30m', via: '53m in LGA' }, back: { dep: '2:30pm', arr: '2:30pm', stops: 0, dur: '14h 30m' } },
  { labels: [], price: '$1,280', out: { dep: '9:15am', arr: '11:40am', stops: 1, dur: '13h 25m', via: '1h 10m in MAD' }, back: { dep: '1:05pm', arr: '6:20pm', stops: 0, dur: '11h 15m' } },
  { labels: [], price: '$1,345', out: { dep: '6:40pm', arr: '10:55am', stops: 0, dur: '10h 15m' }, back: { dep: '11:30am', arr: '3:10pm', stops: 0, dur: '10h 40m' } },
  { labels: [], price: '$1,410', out: { dep: '10:20pm', arr: '4:45pm', stops: 2, dur: '15h 25m', via: '48m in LHR' }, back: { dep: '8:00am', arr: '2:15pm', stops: 1, dur: '12h 15m', via: '55m in MAD' } },
];
const HOTELS = [
  { name: 'The Frederick Hotel', labels: ['Cheapest', 'Best'], score: '8.7', word: 'Excellent', reviews: '1004 Reviews', price: '$400', img: 'images/figma/hotel-1.jpg' },
  { name: 'The Frederick Hotel', labels: [], score: '8.7', word: 'Excellent', reviews: '1004 Reviews', price: '$400', img: 'images/figma/hotel-2.jpg' },
  { name: 'The Frederick Hotel', labels: [], score: '8.7', word: 'Excellent', reviews: '1004 Reviews', price: '$400', img: 'images/figma/hotel-3.jpg' },
  { name: 'The Frederick Hotel', labels: [], score: '8.7', word: 'Excellent', reviews: '1004 Reviews', price: '$400', img: 'images/figma/hotel-1.jpg' },
];

/* ───────── Cart seed ───────── */
let _cartId = 0;
const cartFlight = (group, img, sub, price, offer, tone) => ({ id: 'c' + (++_cartId), group, groupImg: img, kind: 'flight', title: 'American Airlines', sub, price, priceSub: 'round trip', offer, tone, expired: false, checked: true });
const cartHotel = (group, img, thumb, offer, tone, expired) => ({ id: 'c' + (++_cartId), group, groupImg: img, kind: 'hotel', thumb, title: 'The Frederick Hotel', sub: '3 stars · Refundable', price: '$400', priceSub: 'per night · per room', offer, tone, expired: !!expired, checked: !expired });
const CART_SEED = [
  cartFlight('Tokyo 7 day', 'images/figma/trip-tokyo.jpg', 'JFK – NRT · Round trip', '$1,200', '02:22:45', 'red'),
  cartHotel('Tokyo 7 day', 'images/figma/trip-tokyo.jpg', 'images/figma/hotel-1.jpg', '07:22:45', 'yellow'),
  cartHotel('Tokyo 7 day', 'images/figma/trip-tokyo.jpg', 'images/figma/hotel-1.jpg', null, 'gray', true),
  cartFlight('Kyoto 7 day', 'images/figma/trip-kyoto.jpg', 'JFK – KIX · Round trip', '$1,200', '02:22:45', 'red'),
  cartHotel('Kyoto 7 day', 'images/figma/trip-kyoto.jpg', 'images/figma/hotel-1.jpg', '07:22:45', 'yellow'),
];
