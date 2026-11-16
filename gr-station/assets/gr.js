/* GR Station — the shared mock cloud.
   The deck promises "one database, four views": every page on this prototype
   reads and writes this one ledger, kept in localStorage and mirrored across
   open tabs, so the screens never disagree. No server, no real data. */
(function (global) {
  'use strict';

  var KEY = 'grstation.cloud.v1';
  var TICK_MS = 2500;
  var DEMO_SMS_CODE = '4817';

  var VENUES = [
    { id: 'va', name: 'Venue A', city: 'Yangon',     vendorCode: 'VA-2043', uptime: 99 },
    { id: 'vb', name: 'Venue B', city: 'Yangon',     vendorCode: 'VB-7715', uptime: 97 },
    { id: 'vc', name: 'Venue C', city: 'Mandalay',   vendorCode: 'VC-3388', uptime: 94 },
    { id: 'vd', name: 'Venue D', city: 'Naypyitaw',  vendorCode: 'VD-9021', uptime: 99 }
  ];

  var LADDER = [
    { step: 300,    prize: 'Sticker pack and a soft drink',   tone: '#ECDBA4', ink: '#1A100E', height: 132 },
    { step: 1000,   prize: 'Food voucher for the table',      tone: '#E6C97F', ink: '#1A100E', height: 158 },
    { step: 2500,   prize: 'Grand Royal merchandise',         tone: '#D6A658', ink: '#1A100E', height: 184 },
    { step: 5000,   prize: 'Match-night table for the group', tone: '#8A5A1B', ink: '#F4ECDC', height: 210 },
    { step: 10000,  prize: 'Season prize: a football experience', tone: '#1A100E', ink: '#D6A658', height: 236 }
  ];

  var EVENTS = [
    { id: 'quiz',   name: 'Brand and general quiz' },
    { id: 'series', name: 'Series question' },
    { id: 'epl',    name: 'EPL quiz and prediction' }
  ];

  var SEED_NAMES = [
    'Ko Aung', 'Table 9', 'Ma Hnin', 'Table 2', 'Zaw Lin', 'Table 4', 'Su Su',
    'Ko Myat', 'Table 7', 'Ma Thida', 'Nay Oo', 'Table 11', 'Ko Phyo', 'Ma Ei'
  ];

  var FEED_LINES = [
    '{name} called the match: +80',
    '{name} finished a round at {venue}',
    'New player at {venue}',
    '{name} topped the {venue} board',
    '{name} answered the series question',
    '{name} took the EPL prediction: +60',
    'Round starting at {venue}'
  ];

  // ---------- helpers ----------
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function nowISO() { return new Date().toISOString(); }

  function fmt(n) { return Number(n || 0).toLocaleString('en-US'); }

  function timeAgo(iso) {
    var s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
    if (s < 10) return 'just now';
    if (s < 60) return s + 's ago';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    return Math.floor(s / 3600) + 'h ago';
  }

  function venueById(id) {
    for (var i = 0; i < VENUES.length; i++) if (VENUES[i].id === id) return VENUES[i];
    return VENUES[0];
  }

  /* localStorage can throw (private mode, blocked site data) — never let that
     take the page down; fall back to an in-memory ledger for the session. */
  var memory = null;
  function readStore() {
    try {
      var raw = global.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return memory; }
  }
  function writeStore(state) {
    memory = state;
    try { global.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* memory only */ }
  }

  // ---------- seed ----------
  function seed() {
    var state = {
      v: 1,
      startedAt: nowISO(),
      lastTick: Date.now(),
      players: {},
      vouchers: {},
      feed: [],
      counters: { playingNow: 128, playsToday: 1940, signups: 312, points: 86000, claims: 41 },
      hourly: [40, 55, 70, 92, 110, 130, 150, 138, 120, 96, 70, 48],
      stationsOnline: 19,
      stationsTotal: 20
    };

    SEED_NAMES.forEach(function (name, i) {
      var id = 'bot-' + i;
      state.players[id] = {
        id: id, nick: name, phone: null, bot: true,
        venueId: VENUES[i % VENUES.length].id,
        points: rand(420, 2900),
        history: [], claimedSteps: []
      };
    });

    for (var f = 0; f < 4; f++) state.feed.push(makeFeedItem(state));
    return state;
  }

  function makeFeedItem(state) {
    var ids = Object.keys(state.players);
    var p = state.players[pick(ids)];
    var venue = venueById(p ? p.venueId : 'va');
    var line = pick(FEED_LINES)
      .replace('{name}', p ? p.nick : 'A player')
      .replace('{venue}', venue.name);
    return { ts: nowISO(), text: line };
  }

  // ---------- state access ----------
  var state = readStore();
  if (!state || state.v !== 1) { state = seed(); writeStore(state); }

  var listeners = [];
  var channel = null;
  try { channel = new global.BroadcastChannel('grstation'); } catch (e) { channel = null; }

  function emit() {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](state); } catch (e) { /* one bad listener must not stop the rest */ }
    }
  }

  function commit(broadcast) {
    writeStore(state);
    emit();
    if (broadcast !== false && channel) {
      try { channel.postMessage('changed'); } catch (e) { /* ignore */ }
    }
  }

  function refresh() {
    var next = readStore();
    if (next && next.v === 1) { state = next; emit(); }
  }

  if (channel) channel.onmessage = refresh;
  global.addEventListener('storage', function (e) { if (e.key === KEY) refresh(); });

  // ---------- simulation ----------
  function tick() {
    var ids = Object.keys(state.players).filter(function (id) { return state.players[id].bot; });
    // a couple of bots score
    for (var i = 0; i < 2; i++) {
      var p = state.players[pick(ids)];
      if (!p) continue;
      p.points += rand(20, 90);
    }
    state.counters.playsToday += rand(1, 5);
    state.counters.points += rand(60, 260);
    state.counters.playingNow = Math.max(60, Math.min(220, state.counters.playingNow + rand(-6, 7)));
    if (Math.random() < 0.25) state.counters.signups += 1;

    state.hourly.shift();
    state.hourly.push(Math.max(20, Math.min(160, state.hourly[state.hourly.length - 1] + rand(-18, 20))));

    state.feed.unshift(makeFeedItem(state));
    state.feed = state.feed.slice(0, 12);
    state.lastTick = Date.now();
    commit();
  }

  var timer = null;
  function startSim() {
    if (timer) return;
    timer = global.setInterval(function () {
      if (!global.document || !global.document.hidden) tick();
    }, TICK_MS);
  }

  // ---------- players ----------
  function normalisePhone(raw) {
    var digits = String(raw || '').replace(/\D/g, '');
    if (digits.indexOf('95') === 0) digits = digits.slice(2);
    digits = digits.replace(/^0+/, '');
    return digits;
  }

  function isValidPhone(raw) {
    var d = normalisePhone(raw);
    return d.length >= 7 && d.length <= 11 && d.charAt(0) === '9';
  }

  function maskPhone(raw) {
    var d = normalisePhone(raw);
    if (d.length < 4) return '+95 9 •••• ••••';
    return '+95 ' + d.slice(0, 1) + ' •••• ' + d.slice(-4);
  }

  function playerIdForPhone(phone) { return 'p-' + normalisePhone(phone); }

  function signIn(phone, venueId, nick) {
    var id = playerIdForPhone(phone);
    var existing = state.players[id];
    if (!existing) {
      state.players[id] = {
        id: id, nick: nick || ('Table ' + rand(1, 12)), phone: normalisePhone(phone), bot: false,
        venueId: venueId || VENUES[0].id, points: 0, history: [], claimedSteps: []
      };
      state.counters.signups += 1;
      state.feed.unshift({ ts: nowISO(), text: 'New player at ' + venueById(venueId).name });
      award(id, 'quiz', 40, 'Welcome round');
    } else {
      if (nick) existing.nick = nick;
      if (venueId) existing.venueId = venueId;
      commit();
    }
    return state.players[id];
  }

  function getPlayer(id) { return id ? state.players[id] || null : null; }

  function award(playerId, eventId, points, detail) {
    var p = state.players[playerId];
    if (!p) return null;
    p.points += points;
    p.history.unshift({
      ts: nowISO(), eventId: eventId, points: points,
      detail: detail || (EVENTS.filter(function (e) { return e.id === eventId; })[0] || {}).name || 'Round'
    });
    p.history = p.history.slice(0, 40);
    state.counters.points += points;
    state.counters.playsToday += 1;
    commit();
    return p;
  }

  // ---------- ladder + vouchers ----------
  function reachedSteps(points) {
    return LADDER.filter(function (r) { return points >= r.step; });
  }

  function nextStep(points) {
    for (var i = 0; i < LADDER.length; i++) if (points < LADDER[i].step) return LADDER[i];
    return null;
  }

  function makeCode() {
    var code;
    do { code = 'GR-' + rand(1000, 9999); } while (state.vouchers[code]);
    return code;
  }

  /* One claim per step per player, exactly as the deck's claim flow describes. */
  function claim(playerId, step) {
    var p = state.players[playerId];
    if (!p) return { ok: false, error: 'No account found.' };
    if (p.points < step) return { ok: false, error: 'Not enough points for this step yet.' };
    if (p.claimedSteps.indexOf(step) !== -1) return { ok: false, error: 'This step has already been claimed this season.' };

    var rung = LADDER.filter(function (r) { return r.step === step; })[0];
    var code = makeCode();
    state.vouchers[code] = {
      code: code, playerId: playerId, playerNick: p.nick, step: step,
      reward: rung ? rung.prize : 'Prize', status: 'ready',
      issuedAt: nowISO(), claimedAt: null, venueId: p.venueId, handedBy: null
    };
    p.claimedSteps.push(step);
    commit();
    return { ok: true, voucher: state.vouchers[code] };
  }

  function getVoucher(code) {
    return state.vouchers[String(code || '').trim().toUpperCase()] || null;
  }

  function vouchersFor(playerId) {
    return Object.keys(state.vouchers)
      .map(function (c) { return state.vouchers[c]; })
      .filter(function (v) { return v.playerId === playerId; })
      .sort(function (a, b) { return new Date(b.issuedAt) - new Date(a.issuedAt); });
  }

  /* The vendor hands the prize over; the cloud marks it claimed. */
  function redeem(code, vendorVenueId) {
    var v = getVoucher(code);
    if (!v) return { ok: false, error: 'No voucher with that code.' };
    if (v.status === 'claimed') return { ok: false, error: 'Already handed over ' + timeAgo(v.claimedAt) + '.' };
    v.status = 'claimed';
    v.claimedAt = nowISO();
    v.handedBy = vendorVenueId || null;
    state.counters.claims += 1;
    state.feed.unshift({ ts: nowISO(), text: v.playerNick + ' claimed a prize at ' + venueById(v.handedBy || v.venueId).name });
    commit();
    return { ok: true, voucher: v };
  }

  function claimsToday(venueId) {
    return Object.keys(state.vouchers)
      .map(function (c) { return state.vouchers[c]; })
      .filter(function (v) {
        if (v.status !== 'claimed') return false;
        if (venueId && v.handedBy !== venueId) return false;
        return new Date(v.claimedAt).toDateString() === new Date().toDateString();
      })
      .sort(function (a, b) { return new Date(b.claimedAt) - new Date(a.claimedAt); });
  }

  // ---------- leaderboard ----------
  function leaderboard(opts) {
    opts = opts || {};
    var rows = Object.keys(state.players).map(function (id) {
      var p = state.players[id];
      var v = venueById(p.venueId);
      return { id: id, nick: p.nick, venue: v.name, city: v.city, venueId: p.venueId, points: p.points, bot: p.bot };
    });
    if (opts.venueId) rows = rows.filter(function (r) { return r.venueId === opts.venueId; });
    if (opts.city) rows = rows.filter(function (r) { return r.city === opts.city; });
    rows.sort(function (a, b) { return b.points - a.points; });
    return opts.limit ? rows.slice(0, opts.limit) : rows;
  }

  function cities() {
    var seen = [];
    VENUES.forEach(function (v) { if (seen.indexOf(v.city) === -1) seen.push(v.city); });
    return seen;
  }

  // ---------- session (per browser, per role) ----------
  function session(key, value) {
    var k = 'grstation.session.' + key;
    try {
      if (value === undefined) return global.localStorage.getItem(k);
      if (value === null) { global.localStorage.removeItem(k); return null; }
      global.localStorage.setItem(k, value);
      return value;
    } catch (e) { return null; }
  }

  // ---------- tiny DOM helpers ----------
  function el(sel, root) { return (root || global.document).querySelector(sel); }
  function els(sel, root) { return Array.prototype.slice.call((root || global.document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function csv(rows) {
    return rows.map(function (r) {
      return r.map(function (cell) {
        var s = String(cell == null ? '' : cell);
        return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(',');
    }).join('\n');
  }

  function download(filename, text) {
    var blob = new global.Blob([text], { type: 'text/csv;charset=utf-8' });
    var url = global.URL.createObjectURL(blob);
    var a = global.document.createElement('a');
    a.href = url; a.download = filename;
    global.document.body.appendChild(a); a.click();
    global.document.body.removeChild(a);
    global.setTimeout(function () { global.URL.revokeObjectURL(url); }, 0);
  }

  function onChange(fn) { listeners.push(fn); return fn; }

  global.GR = {
    VENUES: VENUES, LADDER: LADDER, EVENTS: EVENTS, DEMO_SMS_CODE: DEMO_SMS_CODE,
    get state() { return state; },
    startSim: startSim, onChange: onChange, commit: commit, refresh: refresh,
    reset: function () { state = seed(); commit(); },
    signIn: signIn, getPlayer: getPlayer, award: award,
    isValidPhone: isValidPhone, normalisePhone: normalisePhone, maskPhone: maskPhone, playerIdForPhone: playerIdForPhone,
    reachedSteps: reachedSteps, nextStep: nextStep,
    claim: claim, getVoucher: getVoucher, vouchersFor: vouchersFor, redeem: redeem, claimsToday: claimsToday,
    leaderboard: leaderboard, cities: cities, venueById: venueById,
    session: session, fmt: fmt, timeAgo: timeAgo, el: el, els: els, esc: esc, csv: csv, download: download,
    clone: clone
  };
})(typeof window !== 'undefined' ? window : globalThis);
