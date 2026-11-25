// ---------- public portal: cinematic site ----------
const ADV_CAT = Object.fromEntries(CATS.map(c => [c.adv, c]));
function pubFilms() { return S.films.filter(f => f.status === 'Diluluskan' && f.decision).sort((a, b) => new Date(b.decision.at) - new Date(a.decision.at)); }
function backdrop(f) { const m = media(f); return img((m.stills || [])[0]) || img(m.poster); }
function hasWide(f) { const m = media(f); return !!img((m.stills || [])[0]); }
function runtime(m) { return m >= 60 ? `${Math.floor(m / 60)}j ${m % 60}m` : `${m}m`; }
function relDate(f) { return addDays(f.decision.at, 6); }
function advLevel(f, a) {
  const c = ADV_CAT[a]; const v = c ? (f.ai.scores[c.k] || 0) : 30;
  return v >= 60 ? ['Kuat', 3] : v >= 35 ? ['Sederhana', 2] : ['Ringan', 1];
}
const AGE = { U: 0, P12: 12, '13': 13, '16': 16, '18': 18 };
function pPoster(f, cls = '') {
  const u = img(media(f).poster);
  return `<div class="pp ${cls}">${u ? `<img src="${u}" alt="Poster ${esc(f.title)}" loading="lazy">` : `<div class="pfb2" style="${posterFb(f.title)}"><span class="pg">${esc(f.genre)}</span><b>${esc(f.title)}</b><small>${esc(f.dist)}</small></div>`}<span class="pb">${badge(f.decision.rating, 40, true)}</span></div>`;
}
function pCard(f) {
  return `<button class="pc" data-act="pubfilm" data-id="${f.id}">${pPoster(f)}<span class="pc-t">${esc(f.title)}</span><span class="pc-m">${f.year} · ${f.genre.replace(' / Animasi', '')} · ${runtime(f.min)}</span></button>`;
}
function pRow(title, list, sub) {
  if (!list.length) return '';
  return `<section class="prow2"><div class="prh"><h2>${title}</h2>${sub ? `<span>${sub}</span>` : ''}</div><div class="prs">${list.map(pCard).join('')}</div></section>`;
}
function pNav() {
  const R = role(); const staff = R && S.role !== 'awam';
  const links = [['', 'Utama'], ['Pawagam', 'Pawagam'], ['Penstriman', 'Penstriman'], ['Televisyen', 'Televisyen']];
  return `<header class="pnav"><div class="pn-in">
    <button class="pbrand" data-act="pubhome">${TAPIS_MARK(34)}<span><b>Klasifikasi Filem</b><small>Lembaga Penapisan Filem Malaysia</small></span><span class="lsep2"></span><img src="${LOGO_LIGHT}" alt="Logo LPF"></button>
    <nav class="pn-links" aria-label="Kategori">${links.map(([k, t]) => `<button data-act="pubplat" data-p="${k}" class="${!ui.pubFilm && ui.pub.p === k && !ui.pub.q && !ui.pub.r ? 'on' : ''}">${t}</button>`).join('')}<a href="#panduan">Panduan</a><a href="#sahkan">Sahkan sijil</a></nav>
    <label class="pn-search">${I.search}<span class="sr">Cari tajuk</span><input id="pubq" data-pub="q" placeholder="Cari tajuk filem atau siri" value="${esc(ui.pub.q)}" autocomplete="off"></label>
    ${staff ? `<a class="btn btn-gl btn-sm" href="#${R.home}">${I.prev}${R.name}</a>` : `<button class="btn btn-gl btn-sm" data-act="logout">Log masuk kakitangan</button>`}
  </div></header>`;
}
function pHero(list) {
  const pick = ['LPF-2026-0141', 'LPF-2026-0127', 'LPF-2026-0117', 'LPF-2026-0131', 'LPF-2026-0125'].map(film).filter(f => f && f.status === 'Diluluskan');
  const slides = pick.length ? pick : list.slice(0, 5); const n = ui.hero % slides.length;
  return `<section class="phero" aria-roledescription="karusel">${slides.map((f, i) => { const b = backdrop(f); const wide = hasWide(f); return `<div class="hs ${i === n ? 'on' : ''}" data-hs="${i}">
      <div class="hbg ${wide ? '' : 'blur'}">${b ? `<img src="${b}" alt="">` : `<div style="${posterFb(f.title)};position:absolute;inset:0"></div>`}</div><div class="hscrim"></div>
      <div class="hc"><div class="hl"><span class="hk">${i === 0 ? 'Baru diklasifikasi' : 'Pilihan minggu ini'} · ${f.platform}</span><h1>${esc(f.title)}</h1>
        <div class="hm">${badge(f.decision.rating, 46, true)}<span>${f.year}</span><span>${f.genre}</span><span>${runtime(f.min)}</span><span>${f.lang}</span></div>
        <p>${esc(f.synopsis)}</p>
        <div class="hadv">${f.decision.advice.length ? f.decision.advice.map(a => `<span>${a} · ${advLevel(f, a)[0].toLowerCase()}</span>`).join('') : '<span>Tiada nasihat pengguna</span>'}</div>
        <div class="hbtns"><button class="btn btn-w btn-lg" data-act="pubfilm" data-id="${f.id}">Butiran klasifikasi ${I.arrow}</button><button class="btn btn-gl btn-lg" data-act="pubverify" data-c="${f.cert}">${I.shield}Sahkan sijil</button></div></div>
        ${wide ? '' : `<div class="hr">${pPoster(f, 'big')}</div>`}</div></div>`; }).join('')}
    <div class="hdots">${slides.map((f, i) => `<button class="${i === n ? 'on' : ''}" data-act="hero" data-n="${i}" aria-label="${esc(f.title)}"><span><i></i></span><small>${esc(f.title)}</small></button>`).join('')}</div>
  </section>`;
}
function pGuide() {
  const who = { U: 'Semua peringkat umur', P12: 'Bawah 12 tahun perlu bimbingan ibu bapa', '13': '13 tahun ke atas', '16': '16 tahun ke atas', '18': '18 tahun ke atas' };
  const ex = { U: 'Tiada atau sangat sedikit unsur yang membimbangkan.', P12: 'Unsur ringan seperti aksi kartun, bahasa kasar ringan atau suasana menakutkan sekejap.', '13': 'Keganasan sederhana tanpa darah berlebihan, bahasa kesat terhad, tema matang.', '16': 'Keganasan dengan darah, bahasa kesat berulang, unsur dadah atau seram yang kuat.', '18': 'Keganasan grafik, tema dewasa yang berat atau kandungan yang kuat secara berterusan.' };
  return `<section class="pguide" id="panduan"><div class="prh"><h2>Panduan klasifikasi</h2><span>Apa maksud setiap label</span></div>
    <div class="pg5">${RATINGS.map(r => `<div class="pgc" style="--rc:${RCOL[r]}">${badge(r, 58)}<b>${who[r]}</b><p>${ex[r]}</p><div class="ageb"><i style="left:${AGE[r] / 18 * 100}%"></i></div><small class="agel"><span>0</span><span>12</span><span>18+</span></small></div>`).join('')}</div>
    <div class="padv"><b>Nasihat pengguna</b><span>Setiap judul disertakan nasihat kandungan dan tahapnya (ringan, sederhana, kuat):</span><div>${CATS.map(c => `<span class="ac"><i style="background:${c.c}"></i>${c.adv}</span>`).join('')}</div></div></section>`;
}
function pVerify() {
  const v = ui.verify; let res = '';
  if (v && v.done) { const f = S.films.find(x => x.cert && x.cert.toLowerCase() === v.q.trim().toLowerCase() && x.status === 'Diluluskan');
    res = f ? `<div class="vres ok"><span class="vi">${I.check}</span><div style="flex:1;min-width:0"><b>Sijil sah</b><span>${esc(f.title)} · ${f.decision.rating} · diputuskan ${fmtDate(f.decision.at)} · ${esc(f.dist)}</span></div>${badge(f.decision.rating, 44, true)}<button class="btn btn-sm btn-w" data-act="pubfilm" data-id="${f.id}">Lihat</button></div>`
      : `<div class="vres bad"><span class="vi">${I.x}</span><div><b>Sijil tidak ditemui</b><span>Semak nombor atau laporkan salinan palsu kepada LPF.</span></div></div>`; }
  return `<section class="pverify" id="sahkan"><div><span class="hk">Untuk pawagam, peruncit & orang awam</span><h2>Sahkan sijil klasifikasi</h2><p>Imbas kod QR pada sijil atau masukkan nombor sijil untuk memastikan klasifikasi adalah sah dan terkini.</p></div>
    <div class="vbox"><div class="vin"><input id="vq" data-verify="1" placeholder="cth. LPF/K/2026/02188" value="${esc(v ? v.q : '')}"><button class="btn btn-pri" data-act="pubverifygo">Sahkan</button></div>${res}<small class="muted2">Cuba: ${pubFilms().slice(0, 2).map(f => `<button class="lnk" data-act="pubverify" data-c="${f.cert}">${f.cert}</button>`).join(' · ')}</small></div></section>`;
}
function pFooter() {
  return `<footer class="pfoot"><div class="pf-in"><div>${TAPIS_MARK(28)}<b>Klasifikasi Filem Malaysia</b><p>Rekod rasmi klasifikasi oleh Lembaga Penapisan Filem, Kementerian Dalam Negeri. Prototaip konsep: semua tajuk, syarikat dan angka adalah rekaan.</p></div>
    <div><b>Untuk industri</b><a href="#masuk">Portal Pengedar</a><a href="#sahkan">Pengesahan sijil</a><button class="lnk" data-act="pubapi">API klasifikasi terbuka</button></div>
    <div><b>Bantuan</b><a href="#panduan">Panduan klasifikasi</a><button class="lnk" data-act="pubreport">Lapor kandungan</button><span>Hotline 03-0000 0000 (contoh)</span></div></div></footer>`;
}
function viewAwamPage() {
  const list = pubFilms();
  if (ui.pubFilm && film(ui.pubFilm)) return pNav() + pDetail(film(ui.pubFilm)) + pFooter();
  const q = ui.pub.q.trim().toLowerCase();
  if (q || ui.pub.r || ui.pub.p) {
    const res = list.filter(f => !q || (f.title + ' ' + f.genre + ' ' + f.dist).toLowerCase().includes(q)).filter(f => !ui.pub.r || f.decision.rating === ui.pub.r).filter(f => !ui.pub.p || f.platform === ui.pub.p);
    return `${pNav()}<main class="pmain pres"><div class="pres-h"><div><span class="hk">${ui.pub.p || 'Carian'}</span><h1>${q ? `Hasil untuk «${esc(ui.pub.q)}»` : ui.pub.p ? `Diklasifikasi untuk ${ui.pub.p.toLowerCase()}` : 'Semua judul'}</h1></div>${pRates()}</div>
      ${res.length ? `<div class="pgrid2">${res.map(pCard).join('')}</div>` : '<div class="pempty">Tiada judul sepadan. Cuba tajuk lain atau kosongkan penapis.</div>'}</main>${pFooter()}`;
  }
  return `${pNav()}${pHero(list)}<main class="pmain">
    <div class="pfilter">${pRates()}<span class="pcount">${list.length} judul dalam rekod awam · dikemas kini serta-merta</span></div>
    ${pRow('Baru diklasifikasi', list.slice(0, 10), 'Keputusan LPF terkini')}
    ${pRow('Di pawagam', list.filter(f => f.platform === 'Pawagam'), 'Sedang dan akan ditayangkan')}
    ${pRow('Platform penstriman', list.filter(f => f.platform === 'Penstriman'), 'Termasuk audit klasifikasi kendiri OTT')}
    ${pRow('Untuk seisi keluarga', list.filter(f => ['U', 'P12'].includes(f.decision.rating)), 'Klasifikasi U dan P12')}
    ${pRow('Televisyen', list.filter(f => f.platform === 'Televisyen'))}
    ${pGuide()}${pVerify()}</main>${pFooter()}`;
}
function pRates() { return `<div class="prates"><button class="${!ui.pub.r ? 'on' : ''}" data-act="pubr" data-r="">Semua</button>${RATINGS.map(r => `<button class="${ui.pub.r === r ? 'on' : ''}" data-act="pubr" data-r="${r}" style="--rc:${RCOL[r]}"><i></i>${r}</button>`).join('')}</div>`; }
function pDetail(f) {
  const d = f.decision; const b = backdrop(f); const wide = hasWide(f);
  const sim = pubFilms().filter(x => x.id !== f.id && (x.genre === f.genre || x.decision.rating === d.rating)).slice(0, 8);
  const why = d.advice.length ? `Klasifikasi <b>${d.rating}</b> kerana filem ini mengandungi ${d.advice.map(a => `<b>${a.toLowerCase()}</b> (${advLevel(f, a)[0].toLowerCase()})`).join(', ')}.` : `Klasifikasi <b>${d.rating}</b>: tiada unsur yang membimbangkan dikesan.`;
  return `<section class="pdh"><div class="hbg ${wide ? '' : 'blur'}">${b ? `<img src="${b}" alt="">` : ''}</div><div class="hscrim"></div>
    <div class="pd-in"><button class="btn btn-gl btn-sm" data-act="pubback">${I.prev}Kembali</button>
      <div class="pd-g">${pPoster(f, 'big')}<div class="pd-m"><span class="hk">${f.type} · ${f.platform}</span><h1>${esc(f.title)}</h1>
        <div class="hm"><span>${f.year}</span><span>${f.genre}</span><span>${runtime(f.min)}</span><span>${f.lang}</span><span>${esc(f.dist)}</span></div>
        <div class="pd-rate">${badge(d.rating, 92)}<div><b>${RATING_DESC[d.rating]}</b><p>${why}</p>${d.kind === 'potong' ? '<p class="cutnote">Diluluskan dengan potongan. Hanya versi yang disahkan LPF boleh ditayangkan.</p>' : ''}</div></div>
        <p class="syn">${esc(f.synopsis)}</p>
        <div class="hbtns"><button class="btn btn-w" data-act="cert" data-id="${f.id}">${I.doc}Lihat sijil digital</button><button class="btn btn-gl" data-act="pubreport">Lapor kandungan</button></div></div></div></div></section>
  <main class="pmain"><div class="pd-cols">
    <div class="pcard2"><h2>Nasihat pengguna</h2>${d.advice.length ? `<div class="advl">${d.advice.map(a => { const [t, n] = advLevel(f, a); const c = ADV_CAT[a]; return `<div class="adr"><span class="an"><i style="background:${c ? c.c : '#8EC5FF'}"></i>${a}</span><span class="lv">${[1, 2, 3].map(k => `<i class="${k <= n ? 'on' : ''}" style="--c:${c ? c.c : '#8EC5FF'}"></i>`).join('')}</span><b>${t}</b></div>`; }).join('')}</div>` : '<p class="muted2">Tiada nasihat pengguna bagi judul ini.</p>'}
      <h3 style="margin-top:22px">Kesesuaian umur</h3><div class="agebar">${[0, 6, 12, 13, 16, 18].map(a => `<span class="${a >= AGE[d.rating] || (d.rating === 'P12' && a < 12) ? 'ok' : ''} ${d.rating === 'P12' && a < 12 ? 'pg' : ''}">${a === 18 ? '18+' : a}</span>`).join('')}</div>
      <p class="muted2" style="font-size:12.5px">${d.rating === 'P12' ? 'Kanak-kanak bawah 12 tahun boleh menonton dengan bimbingan ibu bapa.' : d.rating === 'U' ? 'Sesuai untuk semua peringkat umur.' : `Tidak sesuai untuk penonton bawah ${AGE[d.rating]} tahun.`}</p></div>
    <div class="pcard2"><h2>Rekod klasifikasi rasmi</h2><div class="vrow">${qr(f.cert, 96)}<div><span class="okchip">${I.check}Sijil sah</span><b class="mono">${f.cert}</b><small>Diputuskan ${fmtDate(d.at)} · Lembaga Penapisan Filem</small></div></div>
      <dl class="pdl"><dt>Tarikh tayangan</dt><dd>${fmtDate(relDate(f))}</dd><dt>Pemohon</dt><dd>${esc(f.dist)}</dd><dt>Bahasa</dt><dd>${f.lang}${f.lang !== 'Bahasa Melayu' ? ' · sari kata BM' : ''}</dd><dt>Durasi diluluskan</dt><dd>${f.min} minit</dd><dt>No. rujukan</dt><dd class="mono">${f.id}</dd></dl></div>
  </div>${pRow('Judul serupa', sim)}</main>`;
}
let heroTimer = null;
function startHero() { stopHero(); heroTimer = setInterval(() => { if (ui.route !== 'awam' || ui.pubFilm || document.hidden) return; const s = document.querySelectorAll('.phero .hs'); if (!s.length) return; ui.hero = (ui.hero + 1) % s.length; setHero(); }, 7000); }
function stopHero() { if (heroTimer) { clearInterval(heroTimer); heroTimer = null; } }
function setHero() { document.querySelectorAll('.phero .hs').forEach((el, i) => el.classList.toggle('on', i === ui.hero)); document.querySelectorAll('.hdots button').forEach((el, i) => el.classList.toggle('on', i === ui.hero)); }
