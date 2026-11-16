/* Minimal QR encoder — byte mode, EC level L, versions 1-5 (single RS block).
   Enough for voucher codes and claim URLs (up to 106 bytes). */
(function (global) {
  'use strict';

  // version -> [totalCodewords, dataCodewords, ecCodewords]
  var CAP = { 1: [26, 19, 7], 2: [44, 34, 10], 3: [70, 55, 15], 4: [100, 80, 20], 5: [134, 108, 26] };
  // version -> alignment pattern centre (single pattern for v2-4; none for v1)
  var ALIGN = { 1: null, 2: 18, 3: 22, 4: 26, 5: 30 };

  // ---- GF(256) ----
  var EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = x; LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
  })();

  function gmul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

  function rsGenerator(degree) {
    var poly = [1];
    for (var d = 0; d < degree; d++) {
      var next = new Array(poly.length + 1).fill(0);
      for (var i = 0; i < poly.length; i++) {
        next[i] ^= gmul(poly[i], EXP[d]);
        next[i + 1] ^= poly[i];
      }
      poly = next;
    }
    return poly.reverse();   // highest-degree coefficient first
  }

  function rsEncode(data, ecLen) {
    var gen = rsGenerator(ecLen);
    var rem = new Array(ecLen).fill(0);
    for (var i = 0; i < data.length; i++) {
      var factor = data[i] ^ rem[0];
      rem.shift(); rem.push(0);
      for (var j = 0; j < gen.length - 1; j++) rem[j] ^= gmul(gen[j + 1], factor);
    }
    return rem;
  }

  // ---- bit stream ----
  function utf8Bytes(str) {
    var out = [], s = encodeURIComponent(str);
    for (var i = 0; i < s.length; i++) {
      if (s[i] === '%') { out.push(parseInt(s.substr(i + 1, 2), 16)); i += 2; }
      else out.push(s.charCodeAt(i));
    }
    return out;
  }

  function buildData(bytes, version) {
    var dataCw = CAP[version][1];
    var bits = [];
    function push(value, len) {
      for (var i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1);
    }
    push(4, 4);                 // byte mode
    push(bytes.length, 8);      // char count (versions 1-9 use 8 bits in byte mode)
    for (var i = 0; i < bytes.length; i++) push(bytes[i], 8);

    var capacityBits = dataCw * 8;
    push(0, Math.min(4, capacityBits - bits.length));   // terminator
    while (bits.length % 8 !== 0) bits.push(0);         // pad to byte boundary

    var cw = [];
    for (var b = 0; b < bits.length; b += 8) {
      var v = 0;
      for (var k = 0; k < 8; k++) v = (v << 1) | bits[b + k];
      cw.push(v);
    }
    var padBytes = [0xec, 0x11], p = 0;
    while (cw.length < dataCw) cw.push(padBytes[p++ % 2]);
    return cw;
  }

  function chooseVersion(byteLen) {
    for (var v = 1; v <= 5; v++) {
      // 4 mode bits + 8 count bits + payload must fit the data codewords
      if (4 + 8 + byteLen * 8 <= CAP[v][1] * 8) return v;
    }
    return null;
  }

  // ---- matrix ----
  function makeMatrix(size) {
    var m = [], reserved = [];
    for (var r = 0; r < size; r++) {
      m.push(new Array(size).fill(0));
      reserved.push(new Array(size).fill(false));
    }
    return { m: m, reserved: reserved, size: size };
  }

  function placeFinder(g, row, col) {
    for (var r = -1; r <= 7; r++) {
      for (var c = -1; c <= 7; c++) {
        var rr = row + r, cc = col + c;
        if (rr < 0 || rr >= g.size || cc < 0 || cc >= g.size) continue;
        var dark = (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
                   (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
                   (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        g.m[rr][cc] = dark ? 1 : 0;
        g.reserved[rr][cc] = true;
      }
    }
  }

  function placeAlignment(g, centre) {
    for (var r = -2; r <= 2; r++) {
      for (var c = -2; c <= 2; c++) {
        var rr = centre + r, cc = centre + c;
        var dark = Math.max(Math.abs(r), Math.abs(c)) !== 1;
        g.m[rr][cc] = dark ? 1 : 0;
        g.reserved[rr][cc] = true;
      }
    }
  }

  function placeTiming(g) {
    for (var i = 8; i < g.size - 8; i++) {
      var dark = i % 2 === 0 ? 1 : 0;
      g.m[6][i] = dark; g.reserved[6][i] = true;
      g.m[i][6] = dark; g.reserved[i][6] = true;
    }
  }

  function reserveFormat(g) {
    for (var i = 0; i < 9; i++) {
      if (!g.reserved[8][i]) { g.reserved[8][i] = true; g.m[8][i] = 0; }
      if (!g.reserved[i][8]) { g.reserved[i][8] = true; g.m[i][8] = 0; }
    }
    for (var j = 0; j < 8; j++) {
      g.reserved[8][g.size - 1 - j] = true; g.m[8][g.size - 1 - j] = 0;
      g.reserved[g.size - 1 - j][8] = true; g.m[g.size - 1 - j][8] = 0;
    }
    // dark module
    g.m[g.size - 8][8] = 1;
    g.reserved[g.size - 8][8] = true;
  }

  function placeData(g, codewords) {
    var bits = [];
    for (var i = 0; i < codewords.length; i++) {
      for (var b = 7; b >= 0; b--) bits.push((codewords[i] >>> b) & 1);
    }
    var idx = 0, up = true;
    for (var col = g.size - 1; col > 0; col -= 2) {
      if (col === 6) col--;                       // skip the vertical timing column
      for (var n = 0; n < g.size; n++) {
        var row = up ? g.size - 1 - n : n;
        for (var k = 0; k < 2; k++) {
          var c = col - k;
          if (g.reserved[row][c]) continue;
          g.m[row][c] = idx < bits.length ? bits[idx++] : 0;
        }
      }
      up = !up;
    }
  }

  var MASKS = [
    function (r, c) { return (r + c) % 2 === 0; },
    function (r) { return r % 2 === 0; },
    function (r, c) { return c % 3 === 0; },
    function (r, c) { return (r + c) % 3 === 0; },
    function (r, c) { return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0; },
    function (r, c) { return (r * c) % 2 + (r * c) % 3 === 0; },
    function (r, c) { return ((r * c) % 2 + (r * c) % 3) % 2 === 0; },
    function (r, c) { return ((r + c) % 2 + (r * c) % 3) % 2 === 0; }
  ];

  function applyMask(g, maskIndex) {
    var out = g.m.map(function (row) { return row.slice(); });
    for (var r = 0; r < g.size; r++) {
      for (var c = 0; c < g.size; c++) {
        if (!g.reserved[r][c] && MASKS[maskIndex](r, c)) out[r][c] ^= 1;
      }
    }
    return out;
  }

  function bchFormat(data5) {
    var d = data5 << 10;
    for (var i = 4; i >= 0; i--) {
      if (d & (1 << (i + 10))) d ^= 0x537 << i;   // 0b10100110111
    }
    return (((data5 << 10) | d) ^ 0x5412) & 0x7fff;
  }

  function placeFormat(matrix, size, maskIndex) {
    var bits = bchFormat((0x01 << 3) | maskIndex);  // 01 = EC level L
    function bit(i) { return (bits >>> i) & 1; }    // bit 14 is the most significant

    // copy 1, around the top-left finder
    for (var i = 0; i <= 5; i++) matrix[8][i] = bit(14 - i);
    matrix[8][7] = bit(8);
    matrix[8][8] = bit(7);
    matrix[7][8] = bit(6);
    for (var j = 0; j <= 5; j++) matrix[5 - j][8] = bit(5 - j);

    // copy 2, split between the bottom-left and top-right finders
    for (var k = 0; k <= 6; k++) matrix[size - 1 - k][8] = bit(14 - k);
    for (var n = 0; n <= 7; n++) matrix[8][size - 8 + n] = bit(7 - n);

    matrix[size - 8][8] = 1;   // the dark module stays dark
  }

  function penalty(m, size) {
    var score = 0, r, c, i;
    // rule 1: runs of 5+
    function runs(get) {
      for (r = 0; r < size; r++) {
        var run = 1;
        for (c = 1; c < size; c++) {
          if (get(r, c) === get(r, c - 1)) { run++; }
          else { if (run >= 5) score += 3 + (run - 5); run = 1; }
        }
        if (run >= 5) score += 3 + (run - 5);
      }
    }
    runs(function (a, b) { return m[a][b]; });
    runs(function (a, b) { return m[b][a]; });
    // rule 2: 2x2 blocks
    for (r = 0; r < size - 1; r++) {
      for (c = 0; c < size - 1; c++) {
        var v = m[r][c];
        if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3;
      }
    }
    // rule 3: finder-like patterns
    var pat1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
    var pat2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
    function match(line, pat) {
      for (var k = 0; k < 11; k++) if (line[k] !== pat[k]) return false;
      return true;
    }
    for (r = 0; r < size; r++) {
      for (c = 0; c <= size - 11; c++) {
        var row = [], col = [];
        for (i = 0; i < 11; i++) { row.push(m[r][c + i]); col.push(m[c + i][r]); }
        if (match(row, pat1) || match(row, pat2)) score += 40;
        if (match(col, pat1) || match(col, pat2)) score += 40;
      }
    }
    // rule 4: dark/light balance
    var dark = 0;
    for (r = 0; r < size; r++) for (c = 0; c < size; c++) dark += m[r][c];
    var pct = (dark * 100) / (size * size);
    score += Math.floor(Math.abs(pct - 50) / 5) * 10;
    return score;
  }

  /* Returns a size x size array of 0/1, or null if the text will not fit. */
  function encode(text) {
    var bytes = utf8Bytes(String(text));
    var version = chooseVersion(bytes.length);
    if (!version) return null;

    var data = buildData(bytes, version);
    var ec = rsEncode(data, CAP[version][2]);
    var codewords = data.concat(ec);

    var size = 17 + version * 4;
    var g = makeMatrix(size);
    placeFinder(g, 0, 0);
    placeFinder(g, 0, size - 7);
    placeFinder(g, size - 7, 0);
    if (ALIGN[version] !== null) placeAlignment(g, ALIGN[version]);
    placeTiming(g);
    reserveFormat(g);
    placeData(g, codewords);

    var best = null, bestScore = Infinity;
    for (var mask = 0; mask < 8; mask++) {
      var candidate = applyMask(g, mask);
      placeFormat(candidate, size, mask);
      var s = penalty(candidate, size);
      if (s < bestScore) { bestScore = s; best = candidate; }
    }
    return best;
  }

  /* Draws the code into an <svg> element. */
  function render(el, text, opts) {
    opts = opts || {};
    var dark = opts.dark || '#1A100E';
    var light = opts.light || '#FFFFFF';
    var quiet = opts.quiet == null ? 4 : opts.quiet;
    var matrix = encode(text);
    if (!matrix) { el.innerHTML = ''; return false; }

    var size = matrix.length, dim = size + quiet * 2, path = '';
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        if (matrix[r][c]) path += 'M' + (c + quiet) + ' ' + (r + quiet) + 'h1v1h-1z';
      }
    }
    el.setAttribute('viewBox', '0 0 ' + dim + ' ' + dim);
    el.setAttribute('shape-rendering', 'crispEdges');
    el.innerHTML =
      '<rect width="' + dim + '" height="' + dim + '" fill="' + light + '"/>' +
      '<path d="' + path + '" fill="' + dark + '"/>';
    return true;
  }

  global.GRQR = { encode: encode, render: render };
})(typeof window !== 'undefined' ? window : globalThis);
