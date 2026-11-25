// ---------- images ----------
const IMGMAP = typeof IMGS !== 'undefined' ? IMGS : {};
function img(...keys) { for (const k of keys) if (k && IMGMAP[k]) return IMGMAP[k]; return null; }
const MEDIA = {
  'LPF-2026-0148': { poster: 'poster-senja', stills: ['senja-01'], byFlag: { f0: 'senja-02', f1: 'senja-03', f2: 'senja-04', f3: 'senja-02', f4: 'senja-05', f5: 'senja-06', f6: 'senja-07', f7: 'senja-08', f8: 'senja-09' } },
  'LPF-2026-0149': { poster: 'poster-kampung', stills: ['kampung-01'], byCat: { seram: 'kampung-02' } },
  'LPF-2026-0151': { poster: 'poster-kodmerah', stills: ['kodmerah-01'], byCat: { ganas: 'kodmerah-02', bahaya: 'kodmerah-02' } },
  'LPF-2026-0152': { poster: 'poster-bayang', stills: ['bayang-01'], byCat: { seram: 'bayang-02', agama: 'bayang-02', ganas: 'bayang-02' } },
  'LPF-2026-0141': { poster: 'poster-gelora', stills: ['gelora-01', 'gelora-02'], byCat: { ganas: 'gelora-02', bahaya: 'gelora-02' } },
  'LPF-2026-0131': { poster: 'poster-cinta' }, 'LPF-2026-0127': { poster: 'poster-lari' }, 'LPF-2026-0125': { poster: 'poster-hikayat' },
  'LPF-2026-0119': { poster: 'poster-pasarmalam' }, 'LPF-2026-0117': { poster: 'poster-rimba' }, 'LPF-2026-0112': { poster: 'poster-jalanpulang' },
  'LPF-2026-0108': { poster: 'poster-detektif' }, 'LPF-2026-0101': { poster: 'poster-kota' }, 'LPF-2026-0096': { poster: 'poster-layang' }, 'LPF-2026-0090': { poster: 'poster-gelombang' },
};
function media(f) {
  if (MEDIA[f.id]) return MEDIA[f.id];
  if (f.genre === 'Seram') return { poster: null, stills: ['bayang-01'], byCat: { seram: 'bayang-02' } };
  if (f.genre === 'Keluarga / Animasi') return { poster: null, stills: ['kampung-01'], byCat: { seram: 'kampung-02' } };
  if (f.genre === 'Aksi') return { poster: null, stills: ['kodmerah-01', 'gelora-01'], byCat: { ganas: 'kodmerah-02', bahaya: 'gelora-02' } };
  return { poster: null, stills: [] };
}
function hue(t) { return hashStr(t) % 360; }
function posterFb(t) { const h = hue(t); return `background:radial-gradient(120% 80% at 70% 10%,hsl(${(h + 30) % 360} 55% 42% / .9),transparent 60%),linear-gradient(170deg,hsl(${h} 45% 26%),hsl(${(h + 40) % 360} 40% 9%))`; }
function poster(f, cls = '', withTitle = false, rbSize = 0) {
  const u = img(media(f).poster);
  return `<div class="ph-img ${cls}">${u ? `<img src="${u}" alt="Poster ${esc(f.title)}" loading="lazy">` : `<div class="pfb" style="${posterFb(f.title)}"></div>`}${withTitle ? `<span class="ttl">${esc(f.title)}</span>` : ''}${rbSize && f.decision ? badge(f.decision.rating, rbSize) : ''}</div>`;
}
function stillThumb(f) {
  const u = img((media(f).stills || [])[0]) || img(media(f).poster);
  return `<div class="ph-img thumb">${u ? `<img src="${u}" alt="" loading="lazy">` : `<div class="pfb" style="${posterFb(f.title)}"></div>`}</div>`;
}

const TAPIS_MARK = (s = 30) => `<span class="tmark" style="width:${s}px;height:${s}px"><svg width="${Math.round(s*.62)}" height="${Math.round(s*.62)}" viewBox="0 0 108 108" aria-hidden="true"><path d="M19.44 88.56Q19.44 96.48 28.8 91.44L79.92 61.2Q90 54 79.92 46.8L28.8 16.56Q19.44 11.52 19.44 20.88z" fill="#fff"></path></svg></span>`;
const BRAND = (s = 30, sub = 'Ruang Kerja Semakan &amp; Klasifikasi Filem') => `${TAPIS_MARK(s)}<span><b class="tword">TAPIS</b><small>${sub}</small></span>`;

// ---------- icons ----------
const sv = (p, w = 18) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I = {
  play: `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"></path></svg>`,
  pause: `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1" fill="currentColor"></rect><rect x="13.5" y="5" width="4" height="14" rx="1" fill="currentColor"></rect></svg>`,
  prev: sv('<path d="M15 18l-6-6 6-6"></path>', 16), next: sv('<path d="M9 18l6-6-6-6"></path>', 16),
  check: sv('<path d="M20 6L9 17l-5-5"></path>', 16), x: sv('<path d="M18 6L6 18M6 6l12 12"></path>', 16),
  search: sv('<circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.5-4.5"></path>', 17),
  home: sv('<path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path>'),
  upload: sv('<path d="M12 16V4M7 9l5-5 5 5"></path><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"></path>'),
  screen: sv('<rect x="2" y="4" width="20" height="13" rx="2"></rect><path d="M8 21h8M12 17v4"></path><path d="M10 8.5v5l4-2.5z"></path>'),
  chart: sv('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path>'),
  globe: sv('<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path>'),
  shield: sv('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"></path><path d="M9 12l2 2 4-4"></path>'),
  lock: sv('<rect x="4" y="10" width="16" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path>'),
  doc: sv('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"></path><path d="M14 3v5h5M9 13h6M9 17h6"></path>', 16),
  ai: sv('<path d="M12 3v3M12 18v3M3 12h3M18 12h3"></path><rect x="7" y="7" width="10" height="10" rx="2"></rect><path d="M10 10h4v4h-4z"></path>'),
  user: sv('<circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"></path>'),
  cert: sv('<circle cx="12" cy="9" r="6"></circle><path d="M9 14.5L8 22l4-2 4 2-1-7.5"></path>'),
  data: sv('<ellipse cx="12" cy="5" rx="8" ry="3"></ellipse><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"></path>'),
  clock: sv('<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>'),
  money: sv('<rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="3"></circle>'),
  layers: sv('<path d="M12 3l9 5-9 5-9-5z"></path><path d="M3 13l9 5 9-5"></path>'),
  bolt: sv('<path d="M13 2L4 14h7l-1 8 9-12h-7z"></path>', 14),
  help: sv('<circle cx="12" cy="12" r="9"></circle><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4"></path><path d="M12 17h.01"></path>', 16),
  brain: sv('<path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z"></path><path d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3 3 3 0 0 1-3-3"></path>'),
  msg: sv('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>', 17),
  landmark: sv('<path d="M3 21h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 3l8 5H4z"></path>', 13),
  down: sv('<path d="M6 9l6 6 6-6"></path>', 16),
  code: sv('<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"></path>'),
  swap: sv('<path d="M7 4L3 8l4 4"></path><path d="M3 8h14"></path><path d="M17 20l4-4-4-4"></path><path d="M21 16H7"></path>', 15),
  arrow: sv('<path d="M5 12h14M13 6l6 6-6 6"></path>', 16),
};

// ---------- small renderers ----------
function badge(r, size = 56, small = false) {
  return `<span class="rb ${RCLS[r]}${small ? ' sm' : ''}" style="--s:${size}px" role="img" aria-label="Klasifikasi ${r}"><span class="k">KLASIFIKASI</span><span class="n">${r}</span></span>`;
}
function stChip(s) { return `<span class="chip st-${s.split(' ')[0]}"><span class="dot"></span>${s}</span>`; }
function sevChip(s) { return `<span class="chip sev-${s}">${s}</span>`; }
function catDot(k) { const c = CAT[k]; return `<span style="display:inline-flex;align-items:center;gap:7px;font-weight:600;white-space:nowrap"><i style="width:8px;height:8px;border-radius:2px;background:${c.c}"></i>${c.n}</span>`; }
function qr(seedStr, px = 120) {
  const n = 25, r = rng(hashStr(seedStr)); const cell = px / n; let out = '';
  const finder = (x, y) => (x >= 0 && x < 7 && y >= 0 && y < 7) ? ((x === 0 || x === 6 || y === 0 || y === 6) || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) : null;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    let on = finder(x, y); if (on === null) on = finder(x - (n - 7), y); if (on === null) on = finder(x, y - (n - 7));
    const inF = (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
    if (on === null) on = inF ? false : r() > 0.52;
    if (on) out += `<rect x="${(x * cell).toFixed(2)}" y="${(y * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" fill="#0f1720"></rect>`;
  }
  return `<svg width="${px}" height="${px}" viewBox="0 0 ${px} ${px}" role="img" aria-label="Kod QR pengesahan (contoh)"><rect width="${px}" height="${px}" fill="#ffffff"></rect>${out}</svg>`;
}
const HARI = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
function today() { const d = new Date(); return `${HARI[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; }


// ---------- shell ----------
const NAV = [['utama', 'Utama', 'home'], ['pengedar', 'Portal Pengedar', 'upload'], ['pegawai', 'Stesen Kerja Pegawai', 'screen'], ['pengurusan', 'Papan Pemuka', 'chart'], ['awam', 'Semakan Awam', 'globe']];
const ROLES = {
  pengedar: { name: 'Portal Pengedar', eyebrow: 'Penerbit, pengedar & platform OTT', user: 'Studio Cahaya Timur Sdn Bhd', sub: 'Pengedar berdaftar', av: 'SC', icon: 'upload', home: 'pengedar', mods: ['utama', 'pengedar', 'awam'], photo: 'cinema-seats', crest: 'tapis', uid: 'SCT-PGD-0192', how: 'Serah filem, bayar fi, jejak status dan muat turun sijil digital.' },
  pegawai: { name: 'Stesen Kerja Pegawai', eyebrow: 'Lembaga Penapisan Filem', user: OFFICER, sub: 'Pegawai Penapis, LPF', av: 'AR', icon: 'screen', home: 'pegawai', mods: ['utama', 'pegawai', 'awam'], photo: 'cinema-projector', crest: 'lpf', uid: 'LPF-PP-0417', how: 'Semak filem berbantu AI dan buat keputusan klasifikasi.' },
  pengurusan: { name: 'Papan Pemuka Pengurusan', eyebrow: 'LPF & Kementerian Dalam Negeri', user: 'En. Hafiz Kamal', sub: 'Pengarah Bahagian', av: 'HK', icon: 'chart', home: 'pengurusan', mods: ['utama', 'pengurusan', 'pegawai', 'pengedar', 'awam'], photo: 'data-centre', crest: 'lpf', uid: 'LPF-PG-0021', how: 'Pantau prestasi, ketepatan AI, kutipan fi dan audit OTT.' },
  awam: { name: 'Semakan Klasifikasi Awam', eyebrow: 'Orang awam · tanpa log masuk', user: 'Pelawat', sub: 'Orang awam', av: 'OA', icon: 'globe', home: 'awam', mods: ['utama', 'awam'], photo: 'kl-dusk', crest: 'globe', uid: '', how: 'Semak klasifikasi dan nasihat pengguna sebelum menonton.' },
};
function role() { return ROLES[S.role] || null; }
function clockNow() { const d = new Date(); return [d.getHours(), d.getMinutes(), d.getSeconds()].map(x => String(x).padStart(2, '0')).join(':'); }
function logoPill() { return `<a class="logo-pill" href="#utama">${TAPIS_MARK(36)}<span><b>TAPIS</b><small>Ruang Kerja Semakan &amp; Klasifikasi Filem</small></span><span class="lsep"></span><img src="${LOGO_DARK}" alt="Logo Lembaga Penapisan Filem"></a>`; }
function crestHTML(R) { return R.crest === 'lpf' ? `<img src="${LOGO_DARK}" alt="">` : R.crest === 'tapis' ? TAPIS_MARK(24) : I.globe; }
function g(n) { return ui.guide && ui.route === 'pegawai' ? `<span class="gnum" title="Langkah ${n} dalam panduan">${n}</span>` : ''; }

function HEAD() {
  const q = queue(); const R = role();
  switch (ui.route) {
    case 'utama': return { photo: img('hero-studio', 'cinema-projector'), kick: 'Cadangan penyelesaian bersepadu untuk LPF', title: 'Klasifikasi filem yang <em>lebih pantas</em>, konsisten dan telus.', desc: 'Satu platform nasional: portal pengedar, peti simpanan selamat, Otak AI KDN untuk pra-saringan 8 kategori, stesen kerja pegawai, papan pemuka dan rekod awam.', actions: `<a class="btn btn-w" href="#${R.home}">Buka ${R.name} ${I.arrow}</a><a class="btn btn-gl" href="#otak">Lihat Otak AI KDN</a>`, stats: [[q.length, 'filem dalam baris gilir'], ['8', 'kategori pra-saringan AI'], ['3.1 hari', 'purata keputusan*'], ['88%', 'AI selari pegawai*']] };
    case 'pengedar': { const mine = S.films.filter(f => f.dist === DIST); const need = mine.filter(f => ['Draf', 'Menunggu Bayaran', 'Pindaan Diminta'].includes(f.status) || (f.status === 'Ditolak' && !f.appeal)).length; return { photo: img('cinema-seats', 'cinema-projector'), kick: `Portal Pengedar · ${DIST} · SSM 201901023456 (contoh)`, title: DTAB_T[ui.dtab] || 'Portal Pengedar', desc: 'Serah, bayar dan jejak status dalam talian. Balas permintaan pindaan, failkan rayuan dan muat turun sijil digital.', actions: dtabsHTML(), stats: [[mine.filter(f => isActive(f)).length, 'serahan aktif'], [need, 'perlu tindakan anda']] }; }
    case 'pegawai': { const mt = myTasks(); return { photo: img('cinema-projector'), kick: `Stesen Kerja Pegawai · ${OFFICER} · Bahagian Penapisan`, title: { tugasan: 'Papan kerja saya', gilir: 'Baris gilir kes', semak: 'Semakan filem berbantu AI', arkib: 'Arkib keputusan' }[ui.otab], desc: { tugasan: 'Tugasan, tarikh akhir SLA, sesi panel dan rayuan dalam satu paparan.', gilir: 'Semua kes aktif dari serahan hingga rayuan. Ambil kes belum ditugaskan atau buka tugasan anda.', semak: 'AI menanda setiap adegan mengikut 8 kategori dan mencadangkan klasifikasi. Pegawai menyemak bukti dan membuat keputusan muktamad.', arkib: 'Semua keputusan: lulus, lulus dengan potongan dan tidak diluluskan, dengan sijil dan jejak kes.' }[ui.otab], actions: `${otabsHTML()}${ui.otab === 'semak' ? `<button class="btn btn-gl btn-sm" data-act="guide">${I.help}${ui.guide ? 'Sembunyikan panduan' : 'Panduan'}</button>` : ''}`, stats: [[mt.length, 'tugasan saya'], [mt.filter(f => f.status === 'Menunggu Semakan' && daysLeft(f) < 0).length, 'lewat SLA']] }; }
    case 'pengurusan': return { photo: img('data-centre'), kick: `Papan Pemuka Pengurusan · ${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`, title: 'Prestasi penapisan &amp; klasifikasi', desc: 'Dikemas kini serta-merta daripada portal dan stesen kerja. Angka asas adalah rekaan untuk demo.', stats: [[q.length + 33, 'dalam baris gilir'], ['3.1 hari', 'purata keputusan']] };
    case 'awam': return { photo: img('kl-dusk', 'cinema-projector'), kick: 'Semakan klasifikasi awam', title: 'Semak klasifikasi sebelum menonton.', desc: 'Klasifikasi dan nasihat pengguna bagi filem di pawagam, televisyen dan platform penstriman, terus daripada rekod LPF.',
      extra: `<label class="psearch">${I.search}<span class="sr">Cari tajuk filem</span><input id="pubq" data-pub="q" placeholder="Cari tajuk filem atau siri…" value="${esc(ui.pub.q)}" autocomplete="off"></label>
      <div class="filters"><button class="fbtn" data-act="pubr" data-r="" aria-pressed="${!ui.pub.r}">Semua</button>${RATINGS.map(r => `<button class="fbtn" data-act="pubr" data-r="${r}" aria-pressed="${ui.pub.r === r}"><span style="width:10px;height:10px;border-radius:50%;background:${RCOL[r]}"></span>${r}</button>`).join('')}
      <label for="pubp" class="sr">Platform</label><select class="fsel" id="pubp" data-pub="p"><option value="">Semua platform</option>${['Pawagam', 'Penstriman', 'Televisyen'].map(p => `<option ${ui.pub.p === p ? 'selected' : ''}>${p}</option>`).join('')}</select></div>` };
  }
  return {};
}
function shell(content) {
  const R = role(); const H = HEAD(); const qn = myTasks().length;
  const nav = NAV.filter(n => R.mods.includes(n[0]));
  return `<header class="band"><div class="band-photo">${H.photo ? `<img src="${H.photo}" alt="">` : ''}</div><div class="band-scrim"></div>
    <div class="wrap band-in">
      <nav class="topnav" aria-label="Utama">${logoPill()}
        <div class="navpills">${nav.map(([k, n, ic]) => `<a href="#${k}" ${ui.route === k ? 'aria-current="page"' : ''}>${I[ic]}${n}${k === 'pegawai' && qn ? `<span class="cnt">${qn}</span>` : ''}</a>`).join('')}</div>
        <div class="nav-r"><span class="meta">${today()}, <span data-clock>${clockNow()}</span> MYT<br>Data contoh</span>
          <button class="uchip" data-act="logout" title="Tukar peranan / log keluar"><span class="av">${R.av}</span><span><b>${esc(R.user)}</b><small>${R.sub} · Tukar peranan</small></span></button></div>
      </nav>
      <div class="band-hero"><div class="bh-l"><span class="kick"><i></i>${H.kick || ''}</span><h1>${H.title || ''}</h1>${H.desc ? `<p>${H.desc}</p>` : ''}${H.actions ? `<div class="bh-actions">${H.actions}</div>` : ''}${H.extra || ''}</div>
        ${H.stats ? `<div class="bh-stats">${H.stats.map(s => `<div class="gstat"><b class="tnum">${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>` : ''}</div>
    </div></header>
  <main class="wrap content">${content}</main>
  <footer class="wrap foot"><span>TAPIS untuk Lembaga Penapisan Filem · Data dihoskan di Malaysia · PDPA 2010 · Prototaip konsep, semua data adalah rekaan</span><span style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-sm" data-act="logout">Tukar peranan</button><button class="btn btn-sm btn-ghost" data-act="askreset">Set semula data demo</button></span></footer>`;
}

// ---------- login (master page) ----------
function roleOpt(k) {
  const R = ROLES[k]; const sel = (ui.loginRole || 'pegawai') === k; const ph = img(R.photo);
  return `<button type="button" class="ropt" role="radio" aria-checked="${sel}" data-act="pickrole" data-r="${k}">
    <span class="th">${ph ? `<img src="${ph}" alt="">` : ''}<span class="crest">${crestHTML(R)}</span></span>
    <span class="grow"><small>${R.eyebrow}</small><b>${R.name}</b><small style="margin-top:2px">${R.how}</small></span>
    <span class="radio">${sel ? I.check : ''}</span></button>`;
}
function viewMasuk() {
  const k = ui.loginRole || 'pegawai'; const R = ROLES[k]; const step = ui.loginStep || 1; const hs = img('cinema-projector');
  const strip = Array.from({ length: 28 }, (_, i) => `<span style="${posterFb('s' + (i % 14))}"></span>`).join('');
  let panel;
  if (k === 'awam') panel = `<div class="lg-ph"><span class="ic">${I.globe}</span><span><small>${R.eyebrow}</small><b>${R.name}</b></span></div>
    <p class="lg-note">Orang awam tidak perlu log masuk. Cari mana-mana filem untuk melihat klasifikasi rasmi, nasihat pengguna dan mengesahkan sijil melalui kod QR.</p>
    <button class="btn btn-pri btn-lg" data-act="login" style="width:100%">Teruskan ke Semakan Awam ${I.arrow}</button>`;
  else if (step === 1) panel = `<div class="lg-ph"><span class="ic">${crestHTML(R)}</span><span><small>${R.eyebrow}</small><b>${R.name}</b></span><span class="steppill">Langkah 1 daripada 2</span></div>
    <div class="sample">Akaun contoh: <b>${esc(R.user)}</b>, ${R.sub.toLowerCase()}</div>
    <div class="field"><label for="uid">ID pengguna</label><input class="inp mono" id="uid" value="${R.uid}" readonly></div>
    <button class="btn btn-pri btn-lg" data-act="lstep" style="width:100%">${I.msg}Hantar kod pengesahan</button>
    <button class="btn btn-lg" data-act="lstep" style="width:100%"><span class="mydid">MyD</span>Log masuk dengan MyDigital ID</button>
    <p class="lg-note">Pegawai dan pengedar log masuk dengan identiti digital nasional. Tiada kata laluan disimpan dalam TAPIS.</p>
    <p class="lg-proto">Prototaip: akaun contoh telah diisi dan mana-mana kod 6 digit diterima.</p>`;
  else panel = `<div class="lg-ph"><span class="ic">${crestHTML(R)}</span><span><small>${R.eyebrow}</small><b>${R.name}</b></span><span class="steppill">Langkah 2 daripada 2</span></div>
    <div class="sample">Kod dihantar ke telefon berdaftar bagi <b>${esc(R.user)}</b> (•••• 3391)</div>
    <div class="field"><label for="otp">Kod pengesahan 6 digit</label><input class="inp otp" id="otp" value="482913" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></div>
    ${ui.loggingIn ? `<button class="btn btn-pri btn-lg" disabled style="width:100%"><span class="spin"></span>Mengesahkan…</button>` : `<button class="btn btn-pri btn-lg" data-act="login" style="width:100%">${I.check}Sahkan dan masuk</button>`}
    <button class="btn btn-ghost" data-act="lback">← Tukar akaun atau kaedah</button>
    <p class="lg-proto">Prototaip: mana-mana kod 6 digit diterima. Tiada data dihantar.</p>`;
  return `<header class="band lg-band"><div class="band-photo">${hs ? `<img src="${hs}" alt="">` : ''}</div><div class="band-scrim"></div>
    <div class="float-badges" aria-hidden="true"><span style="position:absolute;left:10px;top:40px">${badge('U', 64)}</span><span style="position:absolute;left:110px;top:0;animation-delay:-1s">${badge('P12', 58)}</span><span style="position:absolute;left:200px;top:70px">${badge('13', 60)}</span><span style="position:absolute;left:290px;top:10px">${badge('16', 62)}</span><span style="position:absolute;left:150px;top:130px">${badge('18', 58)}</span></div>
    <div class="filmstrip" aria-hidden="true"><div class="fs">${strip}${strip}</div></div>
    <div class="wrap band-in"><nav class="topnav">${logoPill()}<div class="nav-r"><span class="meta">${today()}, <span data-clock>${clockNow()}</span> MYT<br>Data contoh</span><a class="btn btn-gl btn-sm" href="#proses">Cara ia berfungsi</a></div></nav>
      <div class="band-hero"><div class="bh-l"><span class="kick"><i></i>Platform Klasifikasi Filem Nasional</span><h1>Log masuk</h1><p>Pilih portal anda. Setiap satu hanya memaparkan apa yang diperlukan oleh peranan itu.</p></div></div></div></header>
  <main class="wrap">
    <div class="lg-main">
      <section aria-label="Portal">
        <div class="glass-card lg-list" role="radiogroup" aria-label="Portal">${roleOpt('pengedar')}
          <div class="lg-gov"><span class="lg-gov-l">${I.landmark}KERAJAAN</span>${roleOpt('pegawai')}${roleOpt('pengurusan')}</div>${roleOpt('awam')}</div>
        <div class="lg-links"><button class="glass-card lg-link" data-act="pickrole" data-r="pengedar"><span style="flex:1"><b>Daftar syarikat pengedar</b><small>Untuk penerbit, pengedar dan platform OTT</small></span>${I.next}</button>
          <button class="glass-card lg-link" data-act="quickpublic"><span style="flex:1"><b>Semak klasifikasi tanpa log masuk</b><small>Untuk ibu bapa dan orang awam</small></span>${I.next}</button></div>
      </section>
      <aside class="glass-card lg-panel">${panel}</aside>
    </div>
    <div id="proses">${secProcess()}</div>
    ${secMech()}
    <div id="otak">${secBrain()}</div>
    ${secArch()}
  </main>
  <footer class="wrap foot"><span>TAPIS untuk Lembaga Penapisan Filem · Data dihoskan di Malaysia · PDPA 2010</span><span>Prototaip konsep · nama, filem dan angka adalah rekaan</span></footer>`;
}

// ---------- shared explainer sections ----------
function secProcess() {
  const steps = [
    ['upload', 'Pengedar muat naik', 'Isi maklumat filem, muat naik DCP/MXF/MP4 dan bayar fi melalui FPX.', `<div class="mini mini-up"><i></i></div>`],
    ['lock', 'Peti simpanan selamat', 'Fail disahkan (SHA-256), disulitkan dan diberi tera air forensik.', `<div class="mini mini-lock"></div>`],
    ['brain', 'Otak AI KDN', 'Bingkai, audio dan sari kata dianalisis; setiap adegan diberi skor 8 kategori.', `<div class="mini mini-ai">${CATS.map((c, i) => `<span style="background:${c.c};animation-delay:${i * .12}s"></span>`).join('')}</div>`],
    ['user', 'Pegawai LPF memutuskan', 'Pegawai menyemak penanda, mengesahkan bukti dan memilih klasifikasi.', `<div class="mini mini-ok"><span class="tick">${I.check}</span>Disahkan pegawai</div>`],
    ['cert', 'Sijil digital', 'Sijil berkod QR dan nasihat pengguna dijana serta-merta.', `<div class="mini mini-cert">${badge('16', 26, true)}</div>`],
    ['globe', 'Rekod awam & audit', 'Klasifikasi diterbitkan untuk orang awam, API dan audit OTT.', `<div class="mini mini-pub">${I.search}<span>Senja di Pel</span><span class="caret"></span></div>`],
  ];
  return `<div class="sec-h"><div><span class="eyebrow">Cara ia berfungsi</span><h2>Dari muat naik hingga sijil, dalam satu aliran</h2><p>Contoh: Studio Cahaya Timur menyerahkan «Senja di Pelabuhan». Setiap langkah di bawah berlaku dalam TAPIS dan direkod dalam jejak audit.</p></div></div>
  <div class="proc"><div class="track" aria-hidden="true"><i></i><i></i><i></i></div>
    ${steps.map(([ic, t, d, mini], i) => `<div class="pstep" style="--i:${i}"><span class="pic">${I[ic]}<span class="num">${i + 1}</span></span><b>${t}</b><p>${d}</p>${mini}</div>`).join('')}</div>`;
}
function secBrain() {
  const ins = [['Bingkai video', 'Syot & objek'], ['Audio & dialog', 'Transkripsi BM/EN/ZH/TA'], ['Sari kata & teks', 'Teks pada skrin'], ['Metadata serahan', 'Genre, platform, kendiri']];
  const outs = [['Penanda adegan', 'Masa, kotak & bukti'], ['Skor 8 kategori', 'Setiap adegan 0–100'], ['Cadangan klasifikasi', 'U · P12 · 13 · 16 · 18'], ['Nasihat pengguna', 'Dijana automatik']];
  const ys = [170, 260, 350, 440];
  const short = ['Keganasan', 'Seks', 'Bahasa kesat', 'Dadah & alkohol', 'Agama', 'Seram', 'Isu sensitif', 'Bahaya'];
  const topX = [300, 433, 567, 700];
  const chips = CATS.map((c, i) => { const top = i < 4; const x = topX[i % 4], y = top ? 44 : 566; return { c, x, y, top, i, label: short[i] }; });
  const neurons = [[430, 260], [470, 235], [520, 225], [565, 250], [600, 285], [455, 300], [505, 290], [550, 310], [420, 335], [480, 350], [535, 360], [585, 335], [395, 295], [610, 320]];
  const syn = [[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [8, 9], [9, 10], [10, 11], [0, 5], [6, 2], [7, 11], [12, 8], [4, 13], [5, 9]];
  const node = (x, y, w, t, s, col, al) => `<g><rect x="${x}" y="${y - 28}" width="${w}" height="56" rx="14" fill="rgba(255,255,255,.10)" stroke="${col}" stroke-opacity=".55"></rect><text x="${al === 'r' ? x + w - 14 : x + 14}" y="${y - 4}" font-size="14" font-weight="700" fill="#fff" text-anchor="${al === 'r' ? 'end' : 'start'}">${t}</text><text x="${al === 'r' ? x + w - 14 : x + 14}" y="${y + 15}" font-size="11.5" fill="rgba(255,255,255,.75)" text-anchor="${al === 'r' ? 'end' : 'start'}">${s}</text></g>`;
  const inPaths = ys.map(y => `M215 ${y} C 320 ${y}, 330 320, 405 320`);
  const outPaths = ys.map(y => `M600 320 C 670 320, 680 ${y}, 785 ${y}`);
  const svg = `<svg viewBox="0 0 1000 640" role="img" aria-label="Rajah Otak AI KDN: input video, audio, teks dan metadata dianalisis mengikut 8 kategori untuk menghasilkan penanda adegan, skor, cadangan klasifikasi dan nasihat pengguna, dengan maklum balas pegawai melatih semula model">
    <defs>
      <radialGradient id="bgr" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="#9CCBFF"></stop><stop offset=".45" stop-color="#2F7FF0"></stop><stop offset="1" stop-color="#0B2F7A"></stop></radialGradient>
      <radialGradient id="bglow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#22B5F0" stop-opacity=".55"></stop><stop offset="1" stop-color="#22B5F0" stop-opacity="0"></stop></radialGradient>
      <linearGradient id="cer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2563D9"></stop><stop offset="1" stop-color="#0A2463"></stop></linearGradient>
    </defs>
    ${inPaths.map((p, i) => `<path class="flowline" d="${p}" stroke="#8EC5FF" style="animation-delay:${-i * .3}s"></path><circle r="4.5" fill="#D6E8FF"><animateMotion dur="${2.6 + i * .3}s" repeatCount="indefinite" path="${p}"></animateMotion></circle>`).join('')}
    ${outPaths.map((p, i) => `<path class="flowline" d="${p}" stroke="#FDE68A" style="animation-delay:${-i * .3}s"></path><circle r="4.5" fill="#FDE68A"><animateMotion dur="${2.4 + i * .35}s" repeatCount="indefinite" path="${p}"></animateMotion></circle>`).join('')}
    ${chips.map(ch => `<path class="flowline" d="M${ch.x} ${ch.top ? 62 : 548} Q ${(ch.x + 500) / 2} ${ch.top ? 150 : 490} 500 ${ch.top ? 232 : 408}" stroke="${ch.c.c}" style="stroke-opacity:.8;animation-duration:2.2s"></path>`).join('')}
    <ellipse class="brain-glow" cx="505" cy="315" rx="200" ry="160" fill="url(#bglow)"></ellipse>
    <g filter="drop-shadow(0 0 18px rgba(34,181,240,.55))">
      ${[[445, 268, 74], [527, 252, 80], [592, 293, 62], [413, 328, 62], [482, 343, 72], [560, 348, 66], [614, 345, 40], [388, 290, 46]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#bgr)"></circle>`).join('')}
      <ellipse cx="586" cy="398" rx="44" ry="28" fill="url(#cer)"></ellipse>
      <path d="M520 392 C 524 420, 530 440, 534 462" stroke="#1C4FB0" stroke-width="20" stroke-linecap="round" fill="none"></path>
    </g>
    <g fill="none" stroke="rgba(255,255,255,.42)" stroke-width="3" stroke-linecap="round">
      <path d="M505 188 C 492 250, 518 320, 500 405"></path>
      <path d="M395 280 c 20 -30 50 -10 60 -40 s 40 -20 50 10"></path><path d="M410 330 c 30 10 40 -25 70 -15 s 30 30 20 50"></path>
      <path d="M530 210 c 25 10 20 40 50 40 s 30 20 20 50"></path><path d="M540 300 c 20 -20 50 -5 60 15"></path><path d="M455 380 c 20 -15 45 0 60 -10"></path>
      <path d="M565 380 c 10 -15 30 -15 45 -5"></path><path d="M560 405 c 15 -6 30 -6 50 0"></path>
    </g>
    ${syn.map(([a, b]) => `<line class="synapse" x1="${neurons[a][0]}" y1="${neurons[a][1]}" x2="${neurons[b][0]}" y2="${neurons[b][1]}"></line>`).join('')}
    ${neurons.map(([x, y], i) => `<circle class="neuron" cx="${x}" cy="${y}" r="5" fill="#fff" style="animation-delay:${(i * .37) % 2.6}s"></circle>`).join('')}
    <text class="title" x="505" y="506" text-anchor="middle" font-size="20" font-weight="700" fill="#fff" letter-spacing=".06em">Otak AI KDN</text>
    <text x="505" y="526" text-anchor="middle" font-size="11.5" fill="rgba(255,255,255,.8)">Model multimodal · hos berdaulat di Malaysia</text>
    ${chips.map(ch => `<g class="cat8" style="--i:${ch.i}"><rect x="${ch.x - 62}" y="${ch.y - 18}" width="124" height="36" rx="18" fill="${ch.c.c}" stroke="${ch.c.c}" stroke-width="1.5"></rect><text x="${ch.x}" y="${ch.y + 5}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#fff">${ch.label}</text></g>`).join('')}
    ${ins.map((t, i) => node(25, ys[i], 190, t[0], t[1], '#8EC5FF', 'l')).join('')}
    ${outs.map((t, i) => node(785, ys[i], 190, t[0], t[1], '#FDE68A', 'r')).join('')}
    <g><rect x="800" y="520" width="175" height="60" rx="16" fill="#FDE68A"></rect><text x="887" y="546" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0B2340">Pegawai LPF</text><text x="887" y="565" text-anchor="middle" font-size="11" fill="#0B2340">membuat keputusan muktamad</text></g>
    <path class="flowline" d="M880 468 L 884 516" stroke="#FDE68A"></path>
    <path id="fb" class="flowline" d="M800 560 C 720 600, 640 560, 600 430" stroke="#F9A8D4" style="animation-direction:reverse"></path>
    <circle r="4.5" fill="#F9A8D4"><animateMotion dur="3.2s" repeatCount="indefinite" path="M800 560 C 720 600, 640 560, 600 430"></animateMotion></circle>
    <text x="760" y="612" text-anchor="middle" font-size="11.5" fill="#F9A8D4" font-weight="700">Maklum balas pegawai → latihan semula model</text>
    <text x="120" y="120" text-anchor="middle" font-size="12" font-weight="700" fill="#8EC5FF" letter-spacing=".08em">INPUT</text>
    <text x="880" y="120" text-anchor="middle" font-size="12" font-weight="700" fill="#FDE68A" letter-spacing=".08em">OUTPUT</text>
  </svg>`;
  const mod = [['logo-gemini', 'Gemini', 'Analisis multimodal video, audio & teks'], ['logo-gemma', 'Gemma', 'Model terbuka dilatih setempat'], ['logo-vertexai', 'Vertex AI', 'Latihan, versi & pemantauan model'], ['logo-gdc', 'Google Distributed Cloud', 'Berjalan dalam pusat data di Malaysia']];
  return `<section class="brainsec" style="margin-top:40px"><div class="brain-in">
    <div class="brain-head"><div><span class="eyebrow" style="color:#8EC5FF">Otak AI KDN</span><h2>Bagaimana AI membaca setiap filem</h2><p>Setiap filem dipecahkan kepada adegan. Bingkai, audio, dialog dan teks dianalisis serentak, dan setiap adegan diberi skor 0–100 bagi 8 kategori. Skor tertinggi menentukan cadangan klasifikasi; pegawai membuat keputusan muktamad dan maklum balas mereka melatih semula model.</p></div></div>
    <div class="brain-svg">${svg}</div>
    <div class="brain-steps">
      <div><span class="n">01 · PECAHAN ADEGAN</span><b>Filem dipecah kepada adegan</b><small>Pengesanan potongan syot dan perubahan lokasi.</small></div>
      <div><span class="n">02 · ANALISIS MULTIMODAL</span><b>Visual, audio & teks serentak</b><small>Objek, tindakan, ucapan, muzik dan sari kata.</small></div>
      <div><span class="n">03 · SKOR 8 KATEGORI</span><b>Setiap adegan 0–100</b><small>Dengan masa, kotak lokasi dan tahap keyakinan.</small></div>
      <div><span class="n">04 · PERATURAN LPF</span><b>Skor → klasifikasi</b><small>&lt;18 U · 18–33 P12 · 34–51 13 · 52–75 16 · ≥76 18</small></div>
      <div><span class="n">05 · PEGAWAI MEMUTUSKAN</span><b>Manusia dalam gelung</b><small>Setiap pindaan direkod dan digunakan untuk latihan semula.</small></div>
    </div>
    <div class="model-row">${mod.map(([k, n, d]) => `<span class="mchip"><span class="lw">${img(k) ? `<img src="${img(k)}" alt="">` : ''}</span><span><b>${n}</b><small>${d}</small></span></span>`).join('')}</div>
    <p style="margin:12px 0 0;font-size:11.5px;color:rgba(255,255,255,.6)">Komponen cadangan. Logo milik pemilik masing-masing; tiada pengesahan atau perkongsian rasmi dinyatakan.</p>
  </div></section>`;
}
// ---------- view: utama ----------
function viewHome() {
  const modImg = (k, ic) => { const u = img(...k.split('|')); return `<div class="ph-img">${u ? `<img src="${u}" alt="" loading="lazy">` : `<div class="pfb" style="${posterFb(k)}"></div>`}<span class="mi">${I[ic]}</span></div>`; };
  const R = role();
  const mods = [['pengedar', 'gelora-01|cinema-seats', 'upload', 'Portal Pengedar', 'Penerbit, pengedar dan platform penstriman serah filem, bayar fi, jejak status dan muat turun sijil digital.'],
    ['pegawai', 'senja-07|cinema-projector', 'screen', 'Stesen Kerja Pegawai', 'Tonton filem bersama penanda AI, analisis adegan 8 kategori dan cadangan klasifikasi.'],
    ['pengurusan', 'hero-studio|data-centre', 'chart', 'Papan Pemuka Pengurusan', 'Tunggakan, masa keputusan, ketepatan AI, konsistensi panel, kutipan fi dan audit OTT.'],
    ['awam', 'hero-cinema|kl-dusk', 'globe', 'Semakan Klasifikasi Awam', 'Ibu bapa semak klasifikasi dan nasihat pengguna bagi filem di pawagam, TV dan penstriman.']];
  return `${secProcess()}
  ${secMech()}
  <div class="sec-h"><div><span class="eyebrow">Modul</span><h2>Empat portal, satu sistem</h2><p>Setiap portal hanya memaparkan apa yang diperlukan oleh peranan itu. Data mengalir terus antara portal.</p></div></div>
  <div class="mods">${mods.map(([k, im, ic, t, d]) => { const ok = R.mods.includes(k); return `<a class="card mod" href="${ok ? '#' + k : '#utama'}" ${ok ? '' : 'data-act="needrole" data-r="' + k + '"'}>${modImg(im, ic)}<div class="mb"><span class="t">${t}</span><span class="d">${d}</span><span class="go">${ok ? 'Buka portal →' : 'Log masuk sebagai peranan ini →'}</span></div></a>`; }).join('')}</div>
  <div id="otak">${secBrain()}</div>
  ${secArch()}
  <div class="card" style="margin-top:28px"><div class="card-b pillars" style="padding:22px">
    <div class="pillar"><span class="ic">${I.user}</span><div><b>Pegawai kekal berkuasa</b><p>AI hanya menanda dan mencadangkan. Setiap keputusan disahkan oleh pegawai LPF.</p></div></div>
    <div class="pillar"><span class="ic">${I.doc}</span><div><b>Jejak audit penuh</b><p>Siapa menonton, bila, dan mengapa klasifikasi dipinda direkod dalam sistem.</p></div></div>
    <div class="pillar"><span class="ic">${I.data}</span><div><b>Data kekal di Malaysia</b><p>Hos berdaulat. Kandungan filem tidak keluar dari infrastruktur yang diluluskan.</p></div></div>
    <div class="pillar"><span class="ic">${I.layers}</span><div><b>Konsisten antara panel</b><p>Keputusan lampau didigitalkan sebagai rujukan supaya filem serupa diklasifikasi sama.</p></div></div>
  </div></div>
  <p style="font-size:12px;color:var(--ink3);margin-top:14px">* Angka contoh untuk demonstrasi.</p>`;
}

// ---------- scenes ----------
const CAT_SHORT = { ganas: 'Ganas', seks: 'Seks', bahasa: 'Bahasa', dadah: 'Dadah', agama: 'Agama', seram: 'Seram', sensitif: 'Sensitif', bahaya: 'Bahaya' };
const CAT_INFO = {
  ganas: { what: 'Pergaduhan, senjata, kecederaan, darah, penderaan dan kematian', sig: 'Visual: senjata, darah, hentaman · Audio: tembakan, jeritan', eff: 'Menentukan klasifikasi umur' },
  seks: { what: 'Ciuman, bermesra, kebogelan, pakaian menjolok mata dan rujukan seksual', sig: 'Visual: kulit terdedah, pose · Teks: dialog seksual', eff: 'Menentukan klasifikasi umur' },
  bahasa: { what: 'Carutan, makian dan penghinaan dalam BM, Inggeris, Mandarin dan Tamil', sig: 'Audio: transkripsi ucapan · Teks: sari kata', eff: 'Menentukan klasifikasi umur' },
  dadah: { what: 'Rokok, arak, dadah, alat penagihan dan glamorisasi penggunaan', sig: 'Visual: objek & tingkah laku · Teks: nama bahan', eff: 'Menentukan klasifikasi umur' },
  agama: { what: 'Unsur khurafat, ritual, simbol keagamaan dan isu akidah', sig: 'Visual: simbol, ritual · Audio/teks: bacaan & dialog', eff: 'Tidak menentukan umur; skor ≥40 disyorkan rujuk panel' },
  seram: { what: 'Imej ngeri, kejutan mendadak, makhluk ghaib dan suasana menakutkan', sig: 'Visual: imej ngeri · Audio: lonjakan bunyi', eff: 'Menentukan klasifikasi umur' },
  sensitif: { what: 'Isu kaum, agama lain, politik dan institusi negara (3R)', sig: 'Audio & teks: dialog · Visual: simbol, bendera', eff: 'Tidak menentukan umur; skor ≥40 disyorkan rujuk panel' },
  bahaya: { what: 'Aksi boleh ditiru, jenayah terperinci dan memandu secara melulu', sig: 'Visual: aksi berisiko · Teks: kaedah jenayah', eff: 'Menentukan klasifikasi umur' },
};
const RANGE = { U: '0–17', P12: '18–33', '13': '34–51', '16': '52–75', '18': '76–100' };
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function scenesOf(f) {
  if (f._scenes) return f._scenes;
  const dur = f.min * 60; const r = rng(hashStr(f.id + 'scenes')); const out = []; let s = 0, i = 0;
  while (s < dur - 30) { const len = Math.min(dur - s, Math.round(200 + r() * 340)); out.push({ i, s, e: s + len }); s += len; i++; }
  const mult = { Tinggi: 1, Sederhana: .78, Rendah: .5 };
  out.forEach(sc => {
    const rr = rng(hashStr(f.id + ':' + sc.i)); sc.name = SCENES[Math.floor(rr() * SCENES.length)];
    sc.flags = f.ai.flags.filter(x => x.s < sc.e && x.e > sc.s);
    sc.scores = {};
    CATS.forEach(c => { const base = f.ai.scores[c.k] || 0; let v = Math.round(rr() * Math.min(10, base * .25));
      sc.flags.filter(x => x.cat === c.k).forEach(x => { v = Math.max(v, Math.round(base * mult[x.sev])); }); sc.scores[c.k] = v; });
    sc.rating = ratingFromScores(sc.scores);
    const keys = ['ganas', 'seks', 'bahasa', 'dadah', 'seram', 'bahaya'];
    sc.top = keys.reduce((a, k) => sc.scores[k] > sc.scores[a] ? k : a, keys[0]);
    sc.panel = sc.scores.agama >= 40 || sc.scores.sensitif >= 40;
  });
  Object.defineProperty(f, '_scenes', { value: out, enumerable: false, configurable: true });
  return out;
}
function sceneAt(f, t) { const sc = scenesOf(f); return sc.find(x => t >= x.s && t < x.e) || sc[sc.length - 1]; }
function sceneDetailHTML(f, sc) {
  const topV = sc.scores[sc.top];
  return `<div class="card-h"><h2>${g(7)}Butiran adegan semasa · Adegan ${sc.i + 1}</h2><span class="chip">${tc(sc.s)} – ${tc(sc.e)} · ${esc(sc.name)}</span></div>
  <div class="card-b" style="display:flex;flex-direction:column;gap:12px">
    <div class="why">${badge(sc.rating, 52)}<div style="min-width:0"><b>Klasifikasi adegan: ${sc.rating}</b><div style="font-size:12.5px;color:var(--ink2);margin-top:2px">${topV >= 18 ? `Skor tertinggi ialah <b>${CAT[sc.top].n} ${topV}</b>, dalam julat ${RANGE[sc.rating]} → <b>${sc.rating}</b>.` : 'Tiada kategori melebihi 17 → <b>U</b>.'} ${sc.flags.length} penanda AI dalam adegan ini.${sc.panel ? ' <b>Disyorkan rujuk panel</b> (agama/isu sensitif ≥40).' : ''}</div></div></div>
    <div class="scd">${CATS.map(c => { const v = sc.scores[c.k]; const fl = sc.flags.filter(x => x.cat === c.k);
      return `<div class="row"><span class="nm"><i style="background:${c.c}"></i>${c.n}</span><span class="v tnum" style="color:${v >= 52 ? c.c : 'var(--ink)'}">${v}</span><div class="bar"><i style="width:${v}%;background:${c.c}"></i></div><small>${fl.length ? fl.map(x => `${tc(x.s)} · ${x.sev} · ${Math.round(x.conf * 100)}% — ${esc(x.d)}`).join('<br>') : 'Tiada pengesanan · skor latar'}</small></div>`; }).join('')}</div>
  </div>`;
}

// ---------- view: pegawai ----------
const AI_STEPS = ['Memecah filem kepada adegan dan syot', 'Transkripsi audio dan sari kata (BM/EN)', 'Analisis visual mengikut 8 kategori', 'Analisis dialog dan bahasa', 'Menjana skor adegan, cadangan klasifikasi dan nasihat pengguna'];
function stepsHTML(p) {
  return AI_STEPS.map((s, i) => { const a = i * 20, b = a + 20; const cls = p >= b ? 'done' : p >= a ? 'now' : '';
    return `<li class="${cls}">${p >= b ? I.check : p >= a ? '<span class="spin"></span>' : '<span style="width:16px;display:inline-block;text-align:center">·</span>'}${s}</li>`; }).join('');
}
const GUIDE = [
  ['Baris gilir', 'Pilih filem. Laluan ekspres didahulukan; lencana menunjukkan cadangan AI.'],
  ['Pemain semakan', 'Salinan bertera air nama anda. Kotak AI menandakan kawasan dan kategori yang dikesan.'],
  ['Kawalan main', 'Main/jeda dan langkau ±10 saat untuk menonton semula adegan.'],
  ['Lompat penanda', 'Terus ke penanda AI seterusnya atau sebelumnya tanpa menonton keseluruhan filem.'],
  ['Kelajuan', '1× untuk semakan teliti; 4×–60× untuk mengimbas bahagian tanpa penanda.'],
  ['Jalur adegan & 8 lorong', 'Jalur atas: klasifikasi setiap adegan. Lorong: penanda mengikut kategori. Klik untuk melompat.'],
  ['Butiran adegan semasa', 'Skor 0–100 bagi 8 kategori untuk adegan yang sedang ditonton, sebab klasifikasi dan bukti.'],
  ['Analisis adegan', 'Semua adegan dengan skor 8 kategori dan klasifikasi adegan. Klik baris untuk melompat.'],
  ['Penanda AI', 'Sahkan (✓) atau tolak (✕) setiap penanda. Semua penanda tahap Tinggi perlu disemak.'],
  ['Cadangan AI', 'Klasifikasi keseluruhan = adegan dengan skor tertinggi. Keyakinan dan faktor utama dipaparkan.'],
  ['Keputusan pegawai', 'Pilih klasifikasi dan nasihat pengguna. Pindaan daripada AI memerlukan alasan. Sahkan atau rujuk panel.'],
  ['Rubrik 8 kategori', 'Apa yang dikesan bagi setiap kategori, isyarat model dan julat skor kepada klasifikasi.'],
];
function studioView() {
  const q = myTasks();
  if (!ui.sel || !film(ui.sel)) { const pick = q.find(f => f.ai.done) || q[0]; if (pick) selectFilm(pick.id, false); else ui.sel = null; }
  const f = ui.sel ? film(ui.sel) : null;
  if (f && f.ai.done && !ui.dec[f.id]) ui.dec[f.id] = newDec(f);
  const guide = ui.guide ? `<div class="card full"><div class="card-h"><h2>${I.help}Panduan Stesen Kerja · cara menggunakan setiap kawalan</h2><button class="btn btn-sm" data-act="guide">Sembunyikan</button></div><div class="card-b"><div class="guide">${GUIDE.map((s, i) => `<div><span class="gnum">${i + 1}</span><span><b>${s[0]}</b><small>${s[1]}</small></span></div>`).join('')}</div></div></div>` : '';
  const qHTML = studioBar(f);
  if (!f) return `<div class="studio">${guide}${qHTML}<div class="card full empty">Tiada filem dipilih. Pilih kes daripada baris gilir.</div></div>`;
  const fh = `<div class="card"><div class="card-b" style="display:flex;flex-direction:column;gap:12px"><div class="fhead"><div style="min-width:0"><span class="eyebrow">${f.id} · ${f.type} · ${f.genre}</span><h1>${esc(f.title)}</h1><div class="meta2">${f.lang} · ${f.min} minit · ${f.platform} · ${esc(f.dist)}</div></div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">${f.express ? `<span class="chip tag-x">${I.bolt}Ekspres · 48 jam</span>` : ''}${stChip(f.status)}<span class="chip">Diterima ${fmtDate(f.submitted)}</span></div></div>
    ${f.selfRating && f.ai.done ? `<div class="banner v">${I.shield}<span><b>Audit klasifikasi kendiri OTT.</b> Platform mengisytiharkan <b>${f.selfRating}</b>, manakala AI mencadangkan <b>${f.ai.rating}</b>. Semak percanggahan ini sebelum membuat keputusan.</span></div>` : ''}
    ${f.ai.done && f.ai.panel ? `<div class="banner w">${I.shield}<span><b>Disyorkan rujukan panel.</b> AI mengesan unsur agama/kepercayaan atau isu sensitif yang memerlukan pertimbangan panel.</span></div>` : ''}
    ${f.status === 'Rujuk Panel' && f.panel ? `<div class="banner v">${I.shield}<span><b>Dirujuk kepada ${f.panel.name}</b> oleh ${esc(f.panel.by)} · sesi ${fmtDate(f.panel.at)}. ${esc(f.panel.reason)}</span></div>` : ''}
    ${f.status === 'Rayuan' && f.appeal ? `<div class="banner v">${I.shield}<span><b>Rayuan pemohon</b> (difailkan ${fmtDate(f.appeal.at)}, pendengaran ${fmtDate(f.appeal.hearing)}): «${esc(f.appeal.grounds)}» Keputusan asal: tidak lulus, Kod ${f.decision ? f.decision.code : ''}.</span></div>` : ''}
    ${f.resubmitted ? `<div class="banner i">${I.upload}<span><b>Versi disunting diterima</b> ${fmtDate(f.resubmittedAt)}. Sahkan ${f.request.cuts.length} potongan yang diminta sebelum meluluskan ${f.request.rating}.</span></div>` : ''}
    ${f.status === 'Pindaan Diminta' ? `<div class="banner w">${I.clock}<span><b>Pindaan diminta</b> oleh ${esc(f.request.by)} pada ${fmtDate(f.request.at)}. Menunggu versi disunting daripada pengedar.</span></div>` : ''}
    <div class="fmeta">${asg(f.assignee)}${slaChip(f)}<span class="chip">Tarikh akhir ${fmtDate(dueOf(f))}</span><button class="btn btn-sm btn-ghost" data-act="rec" data-id="${f.id}">${I.doc}Jejak kes</button></div></div></div>`;
  if (!f.ai.done) {
    const p = Math.round(f.ai.progress); const u = img((media(f).stills || [])[0]);
    return `<div class="studio">${guide}${qHTML}<div class="col">${fh}
      <div class="card"><div class="card-h"><h2>${I.brain}Pra-saringan Otak AI KDN</h2><span class="chip st-Pra-saringan">8 kategori</span></div><div class="card-b" style="display:flex;flex-direction:column;gap:16px">
        <div class="scan">${u ? `<img src="${u}" alt="">` : `<div class="pfb" style="${posterFb(f.title)};opacity:.6"></div>`}</div>
        ${f.ai.running ? `<div class="prog"><i data-prog="${f.id}" style="width:${p}%"></i></div><div style="font-weight:700"><span data-progtxt="${f.id}">${p}</span>% selesai · pegawai boleh menyemak filem lain sementara menunggu</div><ul class="stepl" data-steps="${f.id}">${stepsHTML(p)}</ul>`
        : `<p style="margin:0;color:var(--ink2);max-width:62ch">Filem ini sudah berada dalam peti simpanan selamat. Jalankan pra-saringan untuk memecah filem kepada adegan, memberi skor 8 kategori bagi setiap adegan dan menjana cadangan klasifikasi.</p><div><button class="btn btn-pri" data-act="runai" data-id="${f.id}">${I.brain}Mulakan pra-saringan AI</button></div>`}
      </div></div></div>
      <div class="insp"><div class="card"><div class="card-h"><h2>Maklumat serahan</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:12px;font-size:13.5px"><p style="margin:0;color:var(--ink2)">${esc(f.synopsis)}</p>
        <div class="sum"><span class="muted">Pemohon</span><b>${esc(f.dist)}</b><span class="muted">Bahasa</span><b>${f.lang}</b><span class="muted">Durasi</span><b>${f.min} minit</b><span class="muted">Laluan</span><b>${f.express ? 'Ekspres' : 'Biasa'}</b></div></div></div></div></div>`;
  }
  const dur = f.min * 60; const fl = [...f.ai.flags].sort((a, b) => a.s - b.s); const scs = scenesOf(f); const cur = sceneAt(f, ui.time);
  const nOk = fl.filter(x => x.v === 'sah').length, nNo = fl.filter(x => x.v === 'tolak').length, nPend = fl.length - nOk - nNo;
  const ticks = [0, .25, .5, .75, 1].map(p => `<span>${tc(dur * p).slice(0, 5)}</span>`).join('');
  const player = `<div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px">${g(2)}${I.screen}Pemain semakan <span class="muted" style="font-weight:500;font-size:12.5px">· salinan bertera air · ${fl.length} penanda AI · ${scs.length} adegan</span></div>
  <div class="player"><div class="frame" id="frame"></div>
    <div class="ctrls">${g(3)}<button class="btn play" data-act="play" id="playbtn" aria-label="Main atau jeda">${ui.playing ? I.pause : I.play}</button>
      <button class="btn" data-act="skip" data-d="-10">−10s</button><button class="btn" data-act="skip" data-d="10">+10s</button>
      ${g(4)}<button class="btn" data-act="jump" data-d="-1">${I.prev}Penanda</button><button class="btn" data-act="jump" data-d="1">Penanda${I.next}</button>
      <span class="grow"></span>${g(5)}
      <span class="seg" role="group" aria-label="Kelajuan">${[1, 4, 16, 60].map(s => `<button class="${ui.speed === s ? 'on' : ''}" data-act="speed" data-v="${s}" aria-pressed="${ui.speed === s}">${s}×</button>`).join('')}</span>
      <span class="mono tnum" id="tcl" style="font-size:12.5px;padding-left:6px"></span></div>
    <div class="lanes">${ui.guide ? `<div style="position:absolute;right:14px;top:-11px">${g(6)}</div>` : ''}
      <div class="scenebar"><span class="sl">Adegan (klasifikasi)</span><span class="st">${scs.map(sc => `<span data-act="seekscene" data-s="${sc.s}" title="Adegan ${sc.i + 1} · ${sc.rating}" style="left:${(sc.s / dur * 100).toFixed(3)}%;width:${((sc.e - sc.s) / dur * 100).toFixed(3)}%;background:${RCOL[sc.rating]};opacity:${sc.rating === 'U' ? .45 : .9}"></span>`).join('')}</span></div>
      ${CATS.map(c => `<div class="lane"><span class="ln" title="${c.n}"><i style="background:${c.c}"></i>${c.n}</span><div class="tr" data-act="seekbar">${fl.filter(x => x.cat === c.k).map(x => `<button class="mk ${x.v === 'sah' ? 'rev' : ''} ${x.v === 'tolak' ? 'rej' : ''}" style="left:${(x.s / dur * 100).toFixed(3)}%;width:${Math.max(0.6, (x.e - x.s) / dur * 100).toFixed(3)}%;background:${c.c}" data-act="seekflag" data-fid="${x.id}" aria-label="${c.n}, ${tc(x.s)}"></button>`).join('')}</div></div>`).join('')}
      <div class="ticks"><span></span><div class="tt">${ticks}</div></div><div class="ph-wrap"><div class="ph" id="ph"></div></div></div></div>`;
  const sceneTbl = `<div class="card"><div class="card-h"><h2>${g(8)}Analisis adegan · ${scs.length} adegan × 8 kategori</h2><span style="font-size:12px;color:var(--ink3)">Skor 0–100 · klik baris untuk melompat</span></div>
    <div class="tbl-box" style="margin-top:8px;max-height:520px;overflow:auto"><table class="tbl stbl"><thead><tr><th>#</th><th>Masa</th><th>Adegan</th>${CATS.map(c => `<th class="cat" title="${c.n}"><span style="display:inline-flex;flex-direction:column;align-items:center;gap:3px"><i style="width:8px;height:8px;border-radius:2px;background:${c.c}"></i>${CAT_SHORT[c.k]}</span></th>`).join('')}<th>Klasifikasi</th><th>Pengesanan</th></tr></thead><tbody>
    ${scs.map(sc => `<tr class="click ${sc === cur ? 'scene-on' : ''}" data-act="seekscene" data-s="${sc.s}" data-scene="${sc.i}"><td class="tnum muted">${sc.i + 1}</td><td class="mono" style="font-size:12px;white-space:nowrap">${tc(sc.s).slice(0, 5)}–${tc(sc.e).slice(0, 5)}</td><td style="white-space:nowrap">${esc(sc.name)}</td>
      ${CATS.map(c => { const v = sc.scores[c.k]; return `<td style="text-align:center"><span class="heat" style="background:${hexA(c.c, .07 + v / 100 * .85)};color:${v > 50 ? '#fff' : 'var(--ink)'}">${v}</span></td>`; }).join('')}
      <td>${badge(sc.rating, 28, true)}</td><td style="font-size:12px;min-width:170px">${sc.flags.length ? `${sc.flags.length} penanda · ${[...new Set(sc.flags.map(x => CAT[x.cat].n))].join(', ')}` : '<span class="muted">Tiada</span>'}${sc.panel ? ' · <b style="color:var(--violet)">rujuk panel</b>' : ''}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="card-b" style="padding-top:10px"><div class="thr"><b style="font-size:12px;color:var(--ink3)">Julat skor → klasifikasi:</b>${RATINGS.map(r => `<span>${badge(r, 22, true)}${RANGE[r]}</span>`).join('')}<small class="muted">Klasifikasi adegan = kategori dengan skor tertinggi (tidak termasuk agama & isu sensitif).</small></div></div></div>`;
  const flagTbl = `<div class="card"><div class="card-h"><h2>${g(9)}Penanda AI (${fl.length})</h2><span style="display:flex;flex-wrap:wrap;gap:6px"><span class="chip st-Diluluskan">${nOk} disahkan</span><span class="chip">${nNo} ditolak</span><span class="chip st-Menunggu">${nPend} belum disemak</span></span></div>
    <div class="tbl-box" style="margin-top:8px"><table class="tbl ftbl"><thead><tr><th>Masa</th><th>Adegan</th><th>Kategori · tahap</th><th>Huraian AI</th><th>Semakan</th><th>Potong</th></tr></thead><tbody>
    ${fl.map(x => { const sc = sceneAt(f, x.s); return `<tr data-row="${x.id}"><td><button class="btn btn-sm mono" data-act="seekflag" data-fid="${x.id}">${tc(x.s)}</button></td><td style="white-space:nowrap">#${sc.i + 1} ${badge(sc.rating, 22, true)}</td><td><div style="display:flex;flex-direction:column;gap:5px;align-items:flex-start">${catDot(x.cat)}<span style="white-space:nowrap">${sevChip(x.sev)} <span class="tnum" style="font-size:12px;color:var(--ink3)">AI ${Math.round(x.conf * 100)}%</span></span></div></td><td style="min-width:180px;color:var(--ink2)">${esc(x.d)}</td>
      <td style="white-space:nowrap">${x.v ? `<button class="chip ${x.v === 'sah' ? 'st-Diluluskan' : ''}" style="border:0;cursor:pointer" data-act="vflag" data-fid="${x.id}" data-v="" title="Klik untuk batal">${x.v === 'sah' ? I.check + 'Sah' : I.x + 'Bukan isu'}</button>`
        : `<button class="btn ibtn" data-act="vflag" data-fid="${x.id}" data-v="sah" aria-label="Sahkan penanda" title="Sah">${I.check}</button> <button class="btn ibtn" data-act="vflag" data-fid="${x.id}" data-v="tolak" aria-label="Bukan isu" title="Bukan isu">${I.x}</button>`}</td><td><button class="btn btn-sm cutb ${ui.dec[f.id] && ui.dec[f.id].cuts.includes(x.id) ? 'on' : ''}" data-act="cutflag" data-fid="${x.id}" title="Tandakan adegan ini untuk dipotong">✂ ${ui.dec[f.id] && ui.dec[f.id].cuts.includes(x.id) ? 'Dipotong' : 'Potong'}</button></td></tr>`; }).join('')}
    </tbody></table></div></div>`;
  const rubric = `<details class="card rubric"${ui.guide ? ' open' : ''}><summary><span style="display:flex;align-items:center;gap:8px">${g(12)}Rubrik 8 kategori · bagaimana AI menilai</span><span class="chev">${I.down}</span></summary>
    <div class="tbl-box"><table class="tbl rub"><thead><tr><th>Kategori</th><th>Apa yang dikesan</th><th>Isyarat model</th><th>Kesan kepada klasifikasi</th><th>Skor filem ini</th></tr></thead><tbody>
    ${CATS.map(c => `<tr><td>${catDot(c.k)}</td><td>${CAT_INFO[c.k].what}</td><td class="muted">${CAT_INFO[c.k].sig}</td><td>${CAT_INFO[c.k].eff}</td><td><b class="tnum">${f.ai.scores[c.k] || 0}</b></td></tr>`).join('')}</tbody></table></div>
    <div class="card-b"><div class="thr"><b style="font-size:12px;color:var(--ink3)">Julat:</b>${RATINGS.map(r => `<span>${badge(r, 22, true)}${RANGE[r]} · ${RATING_DESC[r]}</span>`).join('')}</div></div></details>`;
  const top = CATS.map(c => [c, f.ai.scores[c.k] || 0]).sort((a, b) => b[1] - a[1]);
  const worst = scs.reduce((a, s) => RATINGS.indexOf(s.rating) > RATINGS.indexOf(a.rating) ? s : a, scs[0]);
  const dist = RATINGS.map(r => [r, scs.filter(s => s.rating === r).length]);
  const aiCard = `<div class="card"><div class="card-h"><h2>${g(10)}Cadangan AI</h2><span class="chip st-Pra-saringan">${I.brain}Otak AI KDN</span></div>
    <div class="card-b" style="display:flex;gap:16px;align-items:center">${badge(f.ai.rating, 84)}<div style="min-width:0;flex:1"><b style="font-size:17px">Klasifikasi ${f.ai.rating}</b><div style="color:var(--ink3);font-size:13px">${RATING_DESC[f.ai.rating]}</div>
      <div style="font-size:12.5px;margin-top:6px;color:var(--ink2)">Adegan paling tinggi: <b>#${worst.i + 1} (${tc(worst.s)})</b> · ${CAT[worst.top].n} ${worst.scores[worst.top]}</div></div>
      <div class="ring" style="--p:${Math.round(f.ai.conf * 100)}" title="Keyakinan"><span>${Math.round(f.ai.conf * 100)}%</span></div></div>
    <div class="card-b" style="border-top:1px solid var(--line);display:flex;flex-direction:column;gap:10px">
      <div class="lbl">Taburan klasifikasi adegan</div>
      <div style="display:flex;height:12px;border-radius:6px;overflow:hidden">${dist.filter(d => d[1]).map(([r, n]) => `<span title="${r}: ${n} adegan" style="flex:${n};background:${RCOL[r]}"></span>`).join('')}</div>
      <div class="thr">${dist.map(([r, n]) => `<span>${badge(r, 20, true)}${n}</span>`).join('')}</div>
    </div>
    <div class="card-b" style="border-top:1px solid var(--line);display:flex;flex-direction:column;gap:10px">
      <div class="lbl">Skor keseluruhan 8 kategori</div>
      ${CATS.map(c => { const v = f.ai.scores[c.k] || 0; return `<div class="catrow"><span class="nm"><i style="background:${c.c}"></i>${c.n}</span><span class="v tnum">${v}</span><div class="bar"><i style="width:${v}%;background:${c.c}"></i></div></div>`; }).join('')}
      <p style="margin:4px 0 0;font-size:12px;color:var(--ink3)">Faktor utama: ${top.slice(0, 2).filter(t => t[1] > 15).map(t => t[0].n).join(', ') || 'tiada'}. AI hanya mencadangkan; keputusan muktamad dibuat oleh pegawai.</p>
    </div></div>`;
  const decCard = decCardHTML(f, fl);
  return `<div class="studio">${guide}${qHTML}<div class="col">${fh}${player}<div class="card" id="sceneDetail" data-scene="${cur.i}">${sceneDetailHTML(f, cur)}</div>${sceneTbl}${flagTbl}${rubric}</div><div class="insp">${aiCard}${decCard}</div></div>`;
}
function frameInner(f, sc, act) {
  const a = act[0]; const m = media(f);
  let key = null;
  if (a) key = (m.byFlag && m.byFlag[a.id]) || (m.byCat && m.byCat[a.cat]) || null;
  if (!key && m.stills && m.stills.length) key = m.stills[sc.i % m.stills.length];
  const u = img(key);
  let box = '';
  if (a) { const br = rng(hashStr(a.id + f.id)); box = `<div class="box" style="--fc:${CAT[a.cat].c};--bx:${(14 + br() * 30).toFixed(1)}%;--by:${(26 + br() * 12).toFixed(1)}%;--bw:${(30 + br() * 22).toFixed(1)}%;--bh:${(36 + br() * 16).toFixed(1)}%"><span>AI · ${CAT[a.cat].n} · ${Math.round(a.conf * 100)}% · ${a.sev}</span></div>`; }
  return `${u ? `<img class="still" src="${u}" alt="">` : '<div class="fbk"></div>'}<div class="vign"></div>
    <div class="hud"><span class="rec"><i></i><span id="ftc" style="background:none;border:0;padding:0;backdrop-filter:none"></span></span><span>Adegan ${sc.i + 1} · ${sc.rating}</span></div>
    <span class="sim">Pratonton simulasi</span>${box}
    ${act.some(x => x.cat === 'bahasa') ? '<div class="sub">[Dialog disembunyikan dalam demo · dikesan melalui analisis audio]</div>' : ''}
    <div class="scene"><small>ADEGAN ${sc.i + 1}</small><b>${esc(sc.name)}</b></div>
    <div class="wm">SALINAN SEMAKAN · ${OFFICER}<br>${f.id} · tera air forensik</div>`;
}
function updatePlayer() {
  const f = ui.sel && film(ui.sel); if (!f || !f.ai.done) return;
  const fr = document.getElementById('frame'); if (!fr) return;
  const dur = f.min * 60; const sc = sceneAt(f, ui.time);
  const act = f.ai.flags.filter(x => x.s <= ui.time && ui.time <= x.e);
  const key = sc.i + '|' + act.map(a => a.id).join(',');
  if (fr.dataset.key !== key) { fr.dataset.key = key; fr.innerHTML = frameInner(f, sc, act); }
  const t = document.getElementById('ftc'); if (t) t.textContent = tc(ui.time);
  const ph = document.getElementById('ph'); if (ph) ph.style.left = (ui.time / dur * 100) + '%';
  const tl = document.getElementById('tcl'); if (tl) tl.textContent = tc(ui.time) + ' / ' + tc(dur);
  const pb = document.getElementById('playbtn'); if (pb) pb.innerHTML = ui.playing ? I.pause : I.play;
  document.querySelectorAll('[data-row]').forEach(r => r.classList.toggle('flag-on', act.some(a => a.id === r.dataset.row)));
  const sd = document.getElementById('sceneDetail');
  if (sd && sd.dataset.scene !== String(sc.i)) { sd.dataset.scene = sc.i; sd.innerHTML = sceneDetailHTML(f, sc); document.querySelectorAll('tr[data-scene]').forEach(r => r.classList.toggle('scene-on', r.dataset.scene === String(sc.i))); }
}


function wizard() {
  const w = ui.wiz, st = ui.wizStep;
  const labels = [['Maklumat filem', 'Tajuk, jenis, durasi'], ['Muat naik', 'Fail ke peti selamat'], ['Perkhidmatan & bayaran', 'Laluan dan fi'], ['Pengesahan', 'Semak dan hantar']];
  const steps = `<div class="card"><ol class="vsteps">${labels.map((l, i) => `<li class="${i + 1 === st ? 'on' : i + 1 < st || st === 5 ? 'done' : ''}"><b>${i + 1 < st || st === 5 ? '✓' : i + 1}</b><span>${l[0]}<small>${l[1]}</small></span></li>`).join('')}</ol></div>`;
  const sel = (k, opts) => `<select class="inp" id="w-${k}" data-w="${k}">${opts.map(o => `<option ${w[k] === o ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
  const err = ui.wizErr ? `<div class="err" role="alert">${ui.wizErr}</div>` : '';
  const nav = (next, label = 'Seterusnya') => `<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:6px">${st > 1 ? '<button class="btn" data-act="wback">Kembali</button>' : '<span></span>'}<button class="btn btn-pri" data-act="${next}" ${st === 2 && w.uploaded < 100 ? 'disabled' : ''}>${label} ${I.arrow}</button></div>`;
  const fm = { min: +w.min || 0, express: w.express, precheck: w.precheck };
  let inner = '';
  if (st === 1) inner = `<div class="card"><div class="card-h"><h2>Maklumat filem</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:16px">
    <div class="grid2"><div class="field"><label for="w-title">Tajuk filem</label><input class="inp" id="w-title" data-w="title" value="${esc(w.title)}"></div>
      <div class="field"><label for="w-type">Jenis kandungan</label>${sel('type', ['Filem cereka', 'Siri penstriman', 'Siri TV', 'Dokumentari', 'Treler', 'Iklan'])}</div>
      <div class="field"><label for="w-genre">Genre</label>${sel('genre', Object.keys(GENRES))}<span class="hint">Untuk demo: genre mempengaruhi hasil pra-saringan AI.</span></div>
      <div class="field"><label for="w-lang">Bahasa utama</label>${sel('lang', ['Bahasa Melayu', 'Bahasa Inggeris', 'Bahasa Mandarin', 'Bahasa Tamil', 'Lain-lain'])}</div>
      <div class="field"><label for="w-min">Durasi (minit)</label><input class="inp tnum" id="w-min" data-w="min" inputmode="numeric" value="${esc(w.min)}"></div>
      <div class="field"><label for="w-platform">Platform tayangan</label>${sel('platform', ['Pawagam', 'Penstriman', 'Televisyen'])}</div>
      ${w.platform === 'Penstriman' ? `<div class="field"><label for="w-selfRating">Klasifikasi kendiri platform</label>${sel('selfRating', RATINGS)}<span class="hint">Diaudit oleh AI dan pegawai LPF.</span></div>` : ''}
    </div>
    <div class="field"><label for="w-synopsis">Sinopsis</label><textarea class="inp" id="w-synopsis" data-w="synopsis">${esc(w.synopsis)}</textarea></div>
    ${err}${nav('wnext')}</div></div>`;
  if (st === 2) inner = `<div class="card"><div class="card-h"><h2>Muat naik ke peti simpanan selamat</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:16px">
    ${w.file ? `<div style="border:1px solid var(--line);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:12px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b class="mono" style="font-size:13px;word-break:break-all">${esc(w.file.name)}</b><span class="muted">${esc(w.file.size)}</span></div>
        <div class="prog"><i id="upbar" style="width:${w.uploaded}%"></i></div><div id="uptxt" style="font-size:12.5px" class="muted">${w.uploaded < 100 ? `Memuat naik secara selamat… ${Math.round(w.uploaded)}%` : 'Muat naik selesai'}</div>
        ${w.uploaded >= 100 ? `<ul class="stepl"><li class="done">${I.check}Checksum SHA-256 disahkan</li><li class="done">${I.check}Disulitkan (AES-256) dalam peti simpanan selamat</li><li class="done">${I.check}Tera air forensik dipasang pada salinan semakan</li></ul>` : ''}</div>`
      : `<div class="drop"><span class="di">${I.upload}</span><b style="font-size:16px">Seret fail filem ke sini</b><span class="muted" style="font-size:13px">DCP, MXF, MOV atau MP4 · sambung semula automatik jika terputus</span>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:4px"><label class="btn btn-dark" for="wfile">Pilih fail</label><input id="wfile" type="file" accept="video/*,.mxf,.mov,.mp4" class="sr"><button class="btn" data-act="samplefile">Guna fail contoh</button></div>
        <span style="font-size:12px" class="muted">Demo: fail tidak dihantar ke mana-mana; muat naik disimulasikan.</span></div>`}
    ${nav('wnext')}</div></div>`;
  if (st === 3) inner = `<div class="grid2" style="align-items:start"><div class="card"><div class="card-b" style="display:flex;flex-direction:column;gap:12px">
      <div class="lbl">Laluan penapisan</div>
      <label class="opt"><input type="radio" name="lane" data-w="express" value="0" ${!w.express ? 'checked' : ''}><span><b>Biasa</b><br><span class="muted" style="font-size:13px">Keputusan dalam 7 hari bekerja</span></span></label>
      <label class="opt"><input type="radio" name="lane" data-w="express" value="1" ${w.express ? 'checked' : ''}><span><b>Ekspres</b> <span class="chip tag-x">${I.bolt}48 jam</span><br><span class="muted" style="font-size:13px">Keutamaan dalam baris gilir pegawai · fi ×${EXPRESS_MULT}</span></span></label>
      <div class="lbl" style="margin-top:6px">Perkhidmatan tambahan</div>
      <label class="opt"><input type="checkbox" data-w="precheck" ${w.precheck ? 'checked' : ''}><span><b>Laporan pra-semak AI untuk penerbit</b><br><span class="muted" style="font-size:13px">Salinan laporan penanda AI untuk suntingan awal · ${rm(PRECHECK_FEE)}</span></span></label>
      <div class="lbl" style="margin-top:6px">Kaedah bayaran</div>
      <div class="cks">${['FPX', 'JomPAY', 'Kad debit/kredit'].map(p => `<label class="ck"><input type="radio" name="pay" data-w="pay" value="${p}" ${w.pay === p ? 'checked' : ''}>${p}</label>`).join('')}</div>
    </div></div>
    <div class="card"><div class="card-h"><h3>Ringkasan fi</h3><span class="chip st-Diserahkan">Kadar contoh</span></div><div class="card-b"><div class="sum tnum">
      <span>Fi penapisan (${fm.min} min × ${rm(RATE)})</span><b>${rm(fm.min * RATE)}</b>
      ${w.express ? `<span>Caj ekspres (+${Math.round((EXPRESS_MULT - 1) * 100)}%)</span><b>${rm(fm.min * RATE * (EXPRESS_MULT - 1))}</b>` : ''}
      ${w.precheck ? `<span>Laporan pra-semak AI</span><b>${rm(PRECHECK_FEE)}</b>` : ''}
      <span class="tot">Jumlah</span><b class="tot">${rm(fee(fm))}</b></div>
      <p style="font-size:12px;margin:12px 0 0" class="muted">Kadar dalam demo adalah contoh sahaja; jadual fi sebenar ditetapkan oleh LPF.</p></div></div></div>
    <div style="margin-top:16px">${nav('wnext')}</div>`;
  if (st === 4) inner = `<div class="card"><div class="card-h"><h2>Semak dan hantar</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:16px">
    <div class="sum" style="max-width:600px"><span class="muted">Tajuk</span><b>${esc(w.title)}</b><span class="muted">Jenis / genre</span><b>${w.type} · ${w.genre}</b><span class="muted">Bahasa</span><b>${w.lang}</b><span class="muted">Durasi</span><b>${fm.min} minit</b><span class="muted">Platform</span><b>${w.platform}${w.platform === 'Penstriman' ? ` · kendiri ${w.selfRating}` : ''}</b><span class="muted">Fail</span><b class="mono" style="font-size:12.5px;word-break:break-all">${esc(w.file ? w.file.name : '')}</b><span class="muted">Laluan</span><b>${w.express ? 'Ekspres (48 jam)' : 'Biasa (7 hari bekerja)'}</b><span class="muted">Bayaran</span><b>${rm(fee(fm))} melalui ${w.pay}</b></div>
    <label class="ck" style="align-self:flex-start;padding:10px 12px"><input type="checkbox" data-w="agree" ${w.agree ? 'checked' : ''}>Saya mengesahkan maklumat yang diberikan adalah benar dan lengkap.</label>
    ${err}${nav('wsubmit', 'Hantar &amp; bayar (simulasi)')}</div></div>`;
  if (st === 5) {
    const f = film(ui.wizDone);
    inner = `<div class="card" style="overflow:hidden"><div class="card-b" style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-start;padding:24px">
      ${poster(f, '', true)}<div style="flex:1 1 320px;min-width:0;display:flex;flex-direction:column;gap:14px">
      <span class="chip st-Diluluskan" style="align-self:flex-start">${I.check}Serahan diterima</span>
      <h2 style="font-size:24px;font-weight:800">${esc(f.title)}</h2>
      <div class="sum" style="max-width:420px"><span class="muted">No. rujukan</span><b class="mono">${f.id}</b><span class="muted">Bayaran diterima</span><b>${rm(fee(f))}</b><span class="muted">Status</span><b>${f.ai.done ? 'Menunggu semakan pegawai' : 'Pra-saringan AI'}</b></div>
      <div><div class="lbl" style="margin-bottom:8px">Pra-saringan AI (automatik)</div><div class="prog"><i data-prog="${f.id}" style="width:${Math.round(f.ai.progress)}%"></i></div><div style="font-size:12.5px;margin-top:6px" class="muted"><span data-progtxt="${f.id}">${Math.round(f.ai.progress)}</span>% · pengedar dimaklumkan melalui e-mel apabila keputusan dibuat</div></div>
      <div style="display:flex;flex-wrap:wrap;gap:10px"><button class="btn btn-pri" data-act="gofilm" data-id="${f.id}">Buka di Stesen Kerja Pegawai ${I.arrow}</button><button class="btn" data-act="wreset">Serahan baharu lain</button><button class="btn btn-ghost" data-act="ptab" data-v="list">Kembali ke senarai</button></div>
    </div></div></div>`;
    return inner.replace('class="ph-img "', 'class="ph-img " style="width:180px;aspect-ratio:2/3;border-radius:14px;flex-shrink:0"');
  }
  return `<div class="wz">${steps}<div style="min-width:0">${inner}</div></div>`;
}
// ---------- view: pengurusan ----------
function viewPengurusan() {
  const now = new Date(); const m = now.getMonth();
  const months = Array.from({ length: 6 }, (_, i) => MONTHS[(m - 5 + i + 12) % 12]);
  const base = { Pawagam: [62, 58, 71, 66, 74, 69], Penstriman: [148, 162, 171, 189, 203, 214], Televisyen: [88, 84, 91, 87, 95, 92] };
  S.films.filter(f => f.user).forEach(f => { base[f.platform][5] += 1; });
  const subsMonth = base.Pawagam[5] + base.Penstriman[5] + base.Televisyen[5];
  const q = queue();
  const decided = S.films.filter(f => f.decision && f.decision.by === OFFICER);
  const agreeN = 412 + decided.filter(f => f.decision.agreed).length, agreeD = 468 + decided.length;
  const dist = { U: 61, P12: 48, '13': 72, '16': 64, '18': 39 }; decided.forEach(f => dist[f.decision.rating]++);
  const distTot = Object.values(dist).reduce((a, b) => a + b, 0);
  let accP = 0; const conic = RATINGS.map(r => { const a = accP; accP += dist[r] / distTot * 100; return `${RCOL[r]} ${a.toFixed(2)}% ${accP.toFixed(2)}%`; }).join(',');
  const rev = { 'Pawagam': 184200, 'Penstriman (OTT)': 391500, 'Televisyen': 98400, 'Caj ekspres': 72600, 'Pra-semak AI': 18500 };
  S.payments.forEach(p => { const b = p.min * RATE; rev[p.platform === 'Penstriman' ? 'Penstriman (OTT)' : p.platform] += b; if (p.express) rev['Caj ekspres'] += b * (EXPRESS_MULT - 1); if (p.precheck) rev['Pra-semak AI'] += PRECHECK_FEE; });
  const revTot = Object.values(rev).reduce((a, b) => a + b, 0); const revMax = Math.max(...Object.values(rev));
  const acc = { ganas: 93, seks: 89, bahasa: 95, dadah: 91, agama: 78, seram: 90, sensitif: 74, bahaya: 86 };
  const W = 640, H = 250, pl = 40, pb = 30, pt = 18, cw = (W - pl - 10) / 6;
  const tot = months.map((_, i) => base.Pawagam[i] + base.Penstriman[i] + base.Televisyen[i]);
  const ymax = Math.ceil(Math.max(...tot) / 100) * 100; const ys = v => pt + (H - pt - pb) * (1 - v / ymax);
  const ser = [['Penstriman', '#1E7BF2'], ['Televisyen', '#8EC5FF'], ['Pawagam', '#0A2463']];
  let bars = '';
  months.forEach((mo, i) => { let a0 = 0; const x = pl + i * cw + cw * 0.24, w = cw * 0.52;
    ser.forEach(([k, c], si) => { const v = base[k][i]; const y1 = ys(a0 + v), h = ys(a0) - ys(a0 + v); bars += `<rect x="${x.toFixed(1)}" y="${y1.toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(0, h - 2).toFixed(1)}" rx="${si === 2 ? 6 : 3}" fill="${c}"${i === 5 ? '' : ' opacity=".82"'}></rect>`; a0 += v; });
    bars += `<text x="${(x + w / 2).toFixed(1)}" y="${(ys(a0) - 8).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0D1B2A">${a0}</text><text x="${(x + w / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="12" font-weight="${i === 5 ? 800 : 500}" fill="#5F7186">${mo}</text>`; });
  let grid = ''; for (let v = 0; v <= ymax; v += 100) grid += `<line x1="${pl}" x2="${W - 10}" y1="${ys(v)}" y2="${ys(v)}" stroke="#E3EAF2" stroke-dasharray="${v ? '3 4' : '0'}"></line><text x="${pl - 10}" y="${ys(v) + 4}" text-anchor="end" font-size="11" fill="#8696A8">${v}</text>`;
  const chart = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Serahan bulanan mengikut platform">${grid}${bars}</svg>`;
  const spark = [9.4, 8.7, 6.2, 4.8, 3.6, 3.1]; const sx = i => 4 + i * 18, sy = v => 4 + 26 * (1 - (v - 2) / 8);
  const sparkSvg = `<svg width="98" height="34" viewBox="0 0 98 34" aria-hidden="true"><polyline points="${spark.map((v, i) => sx(i) + ',' + sy(v)).join(' ')}" fill="none" stroke="#1460E0" stroke-width="2.2" stroke-linejoin="round"></polyline><circle cx="${sx(5)}" cy="${sy(3.1)}" r="3.5" fill="#1460E0"></circle></svg>`;
  const ott = [
    { p: 'Platform Penstriman B', t: 'Rimba Terlarang', self: '16', ai: '16', st: 'Sepadan', c: 'st-Diluluskan' },
    { p: 'Platform Penstriman C', t: 'Hari Raya di Kota', self: 'U', ai: 'U', st: 'Sepadan', c: 'st-Diluluskan' },
    { p: 'Platform Penstriman A', t: 'Kota Tanpa Tidur', self: '16', ai: '18', st: 'Dipinda kepada 18', c: 'st-Rujuk' },
    { p: 'Platform Penstriman C', t: 'Misi Angkasa', self: 'P12', ai: 'P12', st: 'Sepadan', c: 'st-Diluluskan' },
  ];
  S.films.filter(f => f.selfRating).forEach(f => ott.unshift({ p: f.dist, t: f.title, self: f.selfRating, ai: f.ai.done ? f.ai.rating : '…', st: f.decision ? (f.decision.rating === f.selfRating ? 'Sepadan' : `Dipinda kepada ${f.decision.rating}`) : (f.ai.done && f.ai.rating !== f.selfRating ? 'Perlu semakan' : 'Dalam proses'), c: f.decision ? 'st-Rujuk' : 'st-Menunggu', id: f.decision ? null : f.id }));
  const logIc = w => w === 'Sistem' ? ['brain', '#E8F2FF', '#1460E0'] : w === OFFICER || w === 'Pegawai Penapis' ? ['user', '#E2F8EE', '#0E8F57'] : ['upload', '#EFEBFD', '#5B3FC0'];
  return `<div class="kpis">
      <div class="card kpi"><div class="top"><small>Serahan bulan ini</small><span class="ki">${I.layers}</span></div><b class="tnum">${num(subsMonth)}</b><span class="dl"><span class="up">▲ ${Math.max(1, Math.round((subsMonth / 372 - 1) * 100))}%</span> berbanding ${months[4]}</span></div>
      <div class="card kpi"><div class="top"><small>Dalam baris gilir</small><span class="ki">${I.clock}</span></div><b class="tnum">${q.length + 33}</b><span class="dl">${q.filter(f => f.express).length + 5} ekspres · ${q.filter(f => f.status === 'Rujuk Panel').length + 3} di panel</span></div>
      <div class="card kpi"><div class="top"><small>Purata masa keputusan</small>${sparkSvg}</div><b class="tnum">3.1 hari</b><span class="dl">Turun daripada 9.4 hari pada ${months[0]}</span></div>
      <div class="card kpi"><div class="top"><small>Persetujuan AI–pegawai</small><span class="ki">${I.ai}</span></div><b class="tnum">${(agreeN / agreeD * 100).toFixed(1)}%</b><span class="dl">${num(agreeN)} daripada ${num(agreeD)} keputusan</span></div>
      <div class="card kpi"><div class="top"><small>Kutipan fi bulan ini</small><span class="ki">${I.money}</span></div><b class="tnum">${rm(revTot)}</b><span class="dl">Termasuk OTT &amp; ekspres</span></div>
    </div>
    <div class="dgrid">
      <div class="card span-7"><div class="card-h"><h2>Serahan bulanan mengikut platform</h2><div class="legend">${ser.map(([k, c]) => `<span><i style="background:${c}"></i>${k}</span>`).join('')}</div></div><div class="card-b" style="overflow-x:auto">${chart}</div></div>
      <div class="card span-5"><div class="card-h"><h2>Taburan klasifikasi · ${MONTHS[m]}</h2></div><div class="card-b" style="display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:center">
        <div class="donut" style="background:conic-gradient(${conic})"><span><b class="tnum">${distTot}</b><small>keputusan</small></span></div>
        <div style="display:flex;flex-direction:column;gap:10px;min-width:150px">${RATINGS.map(r => `<div style="display:flex;align-items:center;gap:10px">${badge(r, 28, true)}<span style="flex:1;font-size:13px" class="muted">${Math.round(dist[r] / distTot * 100)}%</span><b class="tnum">${dist[r]}</b></div>`).join('')}</div>
      </div></div>
      <div class="card span-6"><div class="card-h"><h2>Ketepatan AI mengikut kategori</h2><span style="font-size:12px" class="muted">% penanda disahkan pegawai</span></div><div class="card-b" style="display:flex;flex-direction:column;gap:11px">
        ${CATS.map(c => `<div class="catrow"><span class="nm"><i style="background:${c.c}"></i>${c.n}${acc[c.k] < 80 ? ' <span class="chip sev-Sederhana" style="padding:1px 8px;font-size:11px">Latih semula</span>' : ''}</span><span class="v tnum">${acc[c.k]}%</span><div class="bar"><i style="width:${acc[c.k]}%;background:${acc[c.k] < 80 ? '#E08A2C' : '#1460E0'}"></i></div></div>`).join('')}
      </div></div>
      <div class="card span-6"><div class="card-h"><h2>Audit klasifikasi kendiri OTT</h2></div><div class="tbl-box" style="margin-top:8px"><table class="tbl"><thead><tr><th>Platform</th><th>Tajuk</th><th>Kendiri</th><th>AI</th><th>Status</th></tr></thead><tbody>
        ${ott.map(o => `<tr><td class="muted">${esc(o.p)}</td><td><b>${esc(o.t)}</b></td><td>${badge(o.self, 28, true)}</td><td>${o.ai === '…' ? '…' : badge(o.ai, 28, true)}</td><td>${o.id ? `<button class="btn btn-sm btn-pri" data-act="gofilm" data-id="${o.id}">${o.st} →</button>` : `<span class="chip ${o.c}">${o.st}</span>`}</td></tr>`).join('')}
      </tbody></table></div></div>
      <div class="card span-6"><div class="card-h"><h2>Konsistensi panel</h2><span style="font-size:12px" class="muted">90 hari terakhir</span></div><div class="tbl-box" style="margin-top:8px"><table class="tbl"><thead><tr><th>Panel</th><th>Keputusan</th><th>Selari AI</th><th>Rayuan</th><th>Skor</th></tr></thead><tbody>
        ${[['Panel A', 128, 91, 2, 0.94], ['Panel B', 117, 87, 4, 0.89], ['Panel C', 109, 84, 6, 0.82], ['Panel D', 114, 90, 1, 0.93]].map(p => `<tr><td><b>${p[0]}</b></td><td class="tnum">${p[1]}</td><td class="tnum">${p[2]}%</td><td class="tnum">${p[3]}</td><td>${p[4] < 0.85 ? `<span class="chip sev-Sederhana">${p[4].toFixed(2)} · perlu kalibrasi</span>` : `<span class="chip st-Diluluskan">${p[4].toFixed(2)}</span>`}</td></tr>`).join('')}
      </tbody></table></div></div>
      <div class="card span-6"><div class="card-h"><h2>Kutipan mengikut sumber</h2><b class="tnum">${rm(revTot)}</b></div><div class="card-b">
        ${Object.entries(rev).map(([k, v]) => `<div class="hb"><span style="font-size:13px">${k}</span><div class="bar"><i style="width:${v / revMax * 100}%;background:linear-gradient(90deg,#1460E0,#22B5F0)"></i></div><b class="tnum" style="text-align:right;font-size:13px">${rm(v)}</b></div>`).join('')}
      </div></div>
      ${mgmtExtra()}
      <div class="card span-12"><div class="card-h"><h2>Jejak audit terkini</h2><span style="font-size:12px" class="muted">Setiap tindakan direkod</span></div><div class="card-b"><ul class="log">
        ${S.log.slice(0, 10).map(l => { const [ic, bg, fg] = logIc(l.who); return `<li><span class="lic" style="background:${bg};color:${fg}">${I[ic]}</span><time datetime="${l.at}">${fmtDate(l.at).replace(/ \d{4}$/, '')} · ${fmtTime(l.at)}</time><span><b>${esc(l.who)}</b> · ${esc(l.what)}</span></li>`; }).join('')}
      </ul></div></div>
    </div>`;
}

// ---------- certificate ----------
function showCert(id) {
  const f = film(id); const d = f.decision;
  openModal('Sijil klasifikasi digital', `<div class="cert">
    <div class="cert-h"><img src="${LOGO_DARK}" alt="Logo LPF"><div style="text-align:right"><div class="eyebrow" style="color:var(--maroon);margin:0">Sijil Klasifikasi Filem</div><div class="mono" style="font-size:13px;font-weight:700">${f.cert}</div></div></div>
    <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-start">
      <div style="flex:1 1 300px;min-width:0"><h2 style="font-size:24px;font-weight:800;margin-bottom:14px">${esc(f.title)}</h2>
      <dl><dt>Jenis</dt><dd>${f.type}</dd><dt>Bahasa</dt><dd>${f.lang}</dd><dt>Durasi</dt><dd>${f.min} minit</dd><dt>Platform</dt><dd>${f.platform}</dd><dt>Pemohon</dt><dd>${esc(f.dist)}</dd><dt>No. rujukan</dt><dd class="mono">${f.id}</dd><dt>Tarikh keputusan</dt><dd>${fmtDate(d.at)}</dd><dt>Disahkan oleh</dt><dd>${esc(d.by)}</dd><dt>Nasihat pengguna</dt><dd>${d.advice.length ? d.advice.join(', ') : 'Tiada'}</dd></dl></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px">${badge(d.rating, 112)}${qr(f.cert, 108)}<span style="font-size:11.5px;text-align:center" class="muted">Imbas untuk sahkan<br>di TAPIS</span></div>
    </div>
    <div style="font-size:11.5px;border-top:1px dashed var(--line-2);padding-top:12px" class="muted">Contoh sijil dalam prototaip EzGIG. Bukan dokumen rasmi.</div>
  </div>`);
}

// ---------- modal & toast ----------
function openModal(title, body) {
  const root = document.getElementById('modalRoot');
  root.innerHTML = `<div class="ov" data-act="ovclose"><div class="modal" role="dialog" aria-modal="true" aria-label="${title.replace(/<[^>]+>/g, '')}"><div class="modal-h"><h2>${title}</h2><button class="btn btn-sm btn-ghost" data-act="close" aria-label="Tutup">${I.x}</button></div><div class="modal-b">${body}</div></div></div>`;
  const b = root.querySelector('[data-act="close"]'); if (b) b.focus();
}
function closeModal() { document.getElementById('modalRoot').innerHTML = ''; }
function toast(msg, label, fn) {
  const box = document.getElementById('toasts'); const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status');
  el.innerHTML = `<span class="ti">${I.check}</span><span style="flex:1">${msg}</span>${label ? `<button class="btn">${label}</button>` : ''}`;
  if (label) el.querySelector('button').addEventListener('click', () => { el.remove(); fn && fn(); });
  box.appendChild(el); setTimeout(() => el.remove(), 7000);
}
