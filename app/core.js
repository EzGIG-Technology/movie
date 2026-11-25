// ---------- state ----------
let S;
const ui = {
  route: 'utama', sel: null, time: 0, playing: false, speed: 1, timer: null, dec: {},
  ptab: 'list', wizStep: 1, wiz: null, wizErr: '', wizDone: null, upTimer: null,
  pub: { q: '', r: '', p: '' }, decErr: '', guide: false, otab: 'tugasan', fb: 'semua', fopen: {}, slmin: 18, slcat: '', ofilt: 'aktif', afilt: 'semua', oq: '', dtab: 'ringkasan', dfilt: 'semua', pubFilm: null, hero: 0, verify: null, resub: null, paying: false, loginStep: 1, loginRole: 'pegawai', archSel: null, archFlow: null, archStep: 0, archPlaying: false, archTimer: null,
};
const jobs = {};
function load() {
  try { const raw = localStorage.getItem(LS_KEY); if (raw) { S = JSON.parse(raw); if (S && S.films) return; } } catch (e) { /* storage unavailable */ }
  S = seed();
}
function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }
function film(id) { return S.films.find(f => f.id === id); }
function addLog(who, what) { S.log.unshift({ at: new Date().toISOString(), who, what }); S.log = S.log.slice(0, 60); }
function newWiz() {
  return { title: 'Laut Bercerita', type: 'Filem cereka', genre: 'Aksi', lang: 'Bahasa Melayu', min: '108', platform: 'Pawagam', selfRating: '13',
    synopsis: 'Dua beradik nelayan terjebak dalam konflik dengan lanun moden di Selat Melaka.', file: null, uploaded: 0, express: false, precheck: true, pay: 'FPX', agree: false };
}
ui.wiz = newWiz();
const QUEUE_ST = ['Diserahkan', 'Pra-saringan AI', 'Menunggu Semakan', 'Rujuk Panel'];
function queue() {
  return S.films.filter(f => isActive(f)).sort((a, b) => (b.express - a.express) || (new Date(a.submitted) - new Date(b.submitted)));
}
function newDec(f) { const rs = !!f.resubmitted; return { kind: rs ? 'potong' : 'lulus', rating: rs ? f.request.rating : f.ai.rating, advice: rs && f.request.advice ? [...f.request.advice] : adviceFrom(f.ai.scores), reason: rs && f.request.rating !== f.ai.rating ? `Cadangan AI ${f.ai.rating} adalah sebelum potongan; versi disunting tidak lagi mengandungi adegan yang dipotong.` : '', note: '', code: 'A', why: '', panel: 'Panel A', pwhy: '', cuts: [], cutok: {} }; }


function selectFilm(id, doRender = true) {
  stopPlay(); if (ui.sel !== id) ui.slcat = ''; ui.sel = id; ui.time = 0; ui.decErr = '';
  const f = film(id);
  if (f && f.ai.done && !ui.dec[id]) ui.dec[id] = newDec(f);
  if (doRender) render();
}
function stopPlay() { ui.playing = false; if (ui.timer) { clearInterval(ui.timer); ui.timer = null; } }
function startPlay() {
  const f = film(ui.sel); if (!f) return; ui.playing = true;
  ui.timer = setInterval(() => { ui.time += 0.25 * ui.speed; if (ui.time >= f.min * 60) { ui.time = f.min * 60; stopPlay(); } updatePlayer(); }, 250);
}
function seek(t) { const f = film(ui.sel); if (!f) return; ui.time = Math.max(0, Math.min(f.min * 60, t)); updatePlayer(); }

// ---------- AI jobs ----------
function startAI(id) {
  const f = film(id); if (!f || f.ai.done || jobs[id]) return;
  if (!f.ai.plan) f.ai.plan = generatePlan(f);
  f.ai.running = true; f.status = 'Pra-saringan AI'; save();
  jobs[id] = setInterval(() => {
    f.ai.progress = Math.min(100, f.ai.progress + 1.8 + Math.random() * 2.2);
    const p = Math.round(f.ai.progress);
    document.querySelectorAll(`[data-prog="${id}"]`).forEach(e => e.style.width = p + '%');
    document.querySelectorAll(`[data-progtxt="${id}"]`).forEach(e => e.textContent = p);
    document.querySelectorAll(`[data-steps="${id}"]`).forEach(e => e.innerHTML = stepsHTML(p));
    if (f.ai.progress >= 100) finishAI(f);
  }, 160);
}
function finishAI(f) {
  clearInterval(jobs[f.id]); delete jobs[f.id];
  const p = f.ai.plan;
  f.ai = { done: true, running: false, progress: 100, rating: p.rating, conf: p.conf, scores: p.scores, flags: p.flags, panel: p.panel };
  f.status = 'Menunggu Semakan';
  if (!ui.dec[f.id]) ui.dec[f.id] = newDec(f);
  addLog('Sistem', `Pra-saringan AI selesai bagi «${f.title}»: ${p.flags.length} penanda, cadangan ${p.rating}`);
  save();
  if (S.role !== 'pengedar') toast(`Pra-saringan AI selesai: «${esc(f.title)}», cadangan ${p.rating}.`, ui.route === 'pegawai' && ui.sel === f.id ? null : 'Buka', () => A.openfilm({ dataset: { id: f.id } }));
  safeRender();
}
function safeRender() {
  const a = document.activeElement;
  if (a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && a.type !== 'checkbox' && a.type !== 'radio'))) return;
  if (ui.route === 'pengedar' && ui.dtab === 'baru' && ui.wizStep < 5) return;
  if (document.getElementById('modalRoot').innerHTML) return;
  render();
}


function startUpload(name, size) {
  ui.wiz.file = { name, size }; ui.wiz.uploaded = 0; render();
  clearInterval(ui.upTimer);
  ui.upTimer = setInterval(() => {
    ui.wiz.uploaded = Math.min(100, ui.wiz.uploaded + 4 + Math.random() * 6);
    const b = document.getElementById('upbar'); if (b) b.style.width = ui.wiz.uploaded + '%';
    const t = document.getElementById('uptxt'); if (t) t.textContent = `Memuat naik secara selamat… ${Math.round(ui.wiz.uploaded)}%`;
    if (ui.wiz.uploaded >= 100) { clearInterval(ui.upTimer); render(); }
  }, 140);
}

// ---------- render & routing ----------
const VIEWS = { utama: viewHome, pengedar: viewPengedar, pegawai: viewPegawai, pengurusan: viewPengurusan, awam: viewAwamPage };
function render() {
  const app = document.getElementById('app'); document.body.classList.toggle('pubmode', ui.route === 'awam' && !!role());
  if (ui.route === 'masuk' || !role()) { stopHero(); app.innerHTML = viewMasuk(); return; }
  if (ui.route === 'awam') { app.innerHTML = viewAwamPage(); if (ui.pubFilm) stopHero(); else startHero(); return; }
  stopHero();
  document.getElementById('app').innerHTML = shell(VIEWS[ui.route]());
  if (ui.route === 'pegawai') updatePlayer();
}
function route() {
  const h = location.hash.replace('#', '');
  let next = h === 'masuk' ? 'masuk' : VIEWS[h] ? h : null;
  const R = role();
  if (!R) next = 'masuk';
  else if (!next || (next !== 'masuk' && !R.mods.includes(next))) { next = R.home; if (location.hash !== '#' + next) { try { history.replaceState(null, '', '#' + next); } catch (e) { /* ignore */ } } }
  if (next !== ui.route) { stopPlay(); stopArch(); window.scrollTo(0, 0); if (next !== 'awam') ui.pubFilm = ui.pubFilm; }
  ui.route = next; render();
}
function switchRole(k, dest) { S.role = k; save(); const R = ROLES[k]; toast(`Kini sebagai ${R.name}: ${esc(R.user)}`); location.hash = dest || R.home; route(); }

// ---------- actions ----------
const A = {
  sel: t => selectFilm(t.dataset.id),
  play: () => { ui.playing ? stopPlay() : startPlay(); updatePlayer(); },
  skip: t => seek(ui.time + +t.dataset.d),
  speed: t => { ui.speed = +t.dataset.v; document.querySelectorAll('[data-act="speed"]').forEach(b => { const on = +b.dataset.v === ui.speed; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); },
  jump: t => { const f = film(ui.sel); const fl = [...f.ai.flags].sort((a, b) => a.s - b.s); const d = +t.dataset.d;
    const nx = d > 0 ? fl.find(x => x.s > ui.time + 0.5) : [...fl].reverse().find(x => x.s < ui.time - 0.5); if (nx) seek(nx.s); },
  seekflag: t => { const f = film(ui.sel); const x = f.ai.flags.find(z => z.id === t.dataset.fid); if (x) seek(x.s); },
  seekbar: (t, e) => { const f = film(ui.sel); const r = t.getBoundingClientRect(); seek((e.clientX - r.left) / r.width * f.min * 60); },
  vflag: t => { const f = film(ui.sel); const x = f.ai.flags.find(z => z.id === t.dataset.fid); x.v = t.dataset.v || null; save(); render(); },
  pick: t => { ui.dec[ui.sel].rating = t.dataset.r; ui.decErr = ''; render(); },
  runai: t => { startAI(t.dataset.id); render(); },
  refer: () => { const f = film(ui.sel); f.status = 'Rujuk Panel'; addLog(OFFICER, `Merujuk «${f.title}» kepada panel`); save(); render(); toast(`«${esc(f.title)}» dirujuk kepada panel.`); },
  pfilm: t => portalDetail(t.dataset.id),
  samplefile: () => startUpload(`${(ui.wiz.title || 'Filem').replace(/\s+/g, '')}_DCP_v3.mxf`, '48.2 GB'),
  wback: () => { ui.wizStep--; ui.wizErr = ''; render(); },
  wnext: () => {
    const w = ui.wiz;
    if (ui.wizStep === 1) { const m = +w.min; if (!w.title.trim()) { ui.wizErr = 'Sila isi tajuk filem.'; return render(); } if (!(m >= 1 && m <= 1500)) { ui.wizErr = 'Durasi mesti nombor antara 1 dan 1500 minit.'; return render(); } }
    if (ui.wizStep === 2 && w.uploaded < 100) return;
    ui.wizErr = ''; ui.wizStep++; render(); window.scrollTo(0, 0);
  },
  wsubmit: () => {
    const w = ui.wiz; if (!w.agree) { ui.wizErr = 'Sila tandakan pengesahan sebelum menghantar.'; return render(); }
    const id = `LPF-2026-${String(S.seq.ref++).padStart(4, '0')}`;
    const f = { id, title: w.title.trim(), type: w.type, genre: w.genre, lang: w.lang, min: +w.min, platform: w.platform, dist: DIST, synopsis: w.synopsis, submitted: new Date().toISOString(), status: 'Diserahkan', express: w.express, precheck: w.precheck, year: 2026, user: true, ai: { done: false, running: false, progress: 0 } };
    if (w.platform === 'Penstriman') f.selfRating = w.selfRating;
    f.ai.plan = generatePlan(f);
    if (w.draftId) S.films = S.films.filter(x => x.id !== w.draftId);
    S.films.push(f); S.payments.push({ at: f.submitted, amount: fee(f), min: f.min, platform: f.platform, express: f.express, precheck: f.precheck });
    addLog(DIST, `Serahan baharu ${id} «${f.title}»; bayaran ${rm(fee(f))} diterima melalui ${w.pay}`);
    save(); ui.wizDone = id; ui.wizStep = 5; ui.wizErr = ''; render(); window.scrollTo(0, 0);
    toast(`Serahan ${id} diterima. Bayaran ${rm(fee(f))} disahkan.`);
    setTimeout(() => { if (f.status === 'Diserahkan') { startAI(id); safeRender(); } }, 2200);
  },
  wreset: () => { ui.wiz = newWiz(); ui.wizStep = 1; render(); },
  gofilm: t => { closeModal(); ui.otab = 'semak'; selectFilm(t.dataset.id, false); if (!role().mods.includes('pegawai')) { switchRole('pegawai', 'pegawai'); return; } location.hash === '#pegawai' ? render() : (location.hash = 'pegawai'); },
  pickrole: t => { ui.loginRole = t.dataset.r; ui.loginStep = 1; render(); },
  lstep: () => { ui.loginStep = 2; render(); const o = document.getElementById('otp'); if (o) o.focus(); },
  lback: () => { ui.loginStep = 1; render(); },
  quickpublic: () => { ui.loginRole = 'awam'; A.login(); },
  needrole: (t, e) => { e.preventDefault(); ui.loginRole = t.dataset.r; ui.loginStep = 1; S.role = null; save(); location.hash = 'masuk'; route(); },
  login: () => { const k = ui.loginRole || 'pegawai'; if (k === 'awam') { S.role = k; save(); location.hash = 'awam'; route(); return; } ui.loggingIn = true; render(); setTimeout(() => { ui.loggingIn = false; ui.loginStep = 1; S.role = k; save(); const R = ROLES[k]; location.hash = R.home; route(); toast(`Log masuk berjaya: ${esc(R.user)} (${R.name})`); }, 900); },
  logout: () => { stopPlay(); ui.loginRole = S.role || 'pegawai'; ui.loginStep = 1; S.role = null; save(); location.hash = 'masuk'; route(); },
  guide: () => { ui.guide = !ui.guide; render(); },
  mechpin: t => { const n = +t.dataset.n; ui.mechPin = ui.mechPin === n ? null : n; document.querySelectorAll('#mekanik').forEach(el => { el.outerHTML = secMech(); }); },
  archnode: t => { stopArch(); ui.archFlow = null; ui.archSel = ui.archSel === t.dataset.id ? null : t.dataset.id; refreshArch(); },
  archflow: t => { ui.archSel = null; ui.archFlow = t.dataset.k; ui.archStep = 0; refreshArch(); playArch(); refreshArch(); },
  archclear: () => { stopArch(); ui.archSel = null; ui.archFlow = null; refreshArch(); },
  archprev: () => { stopArch(); ui.archStep = Math.max(0, ui.archStep - 1); refreshArch(); },
  archnext: () => { stopArch(); ui.archStep = Math.min(ARCH_FLOWS[ui.archFlow].steps.length - 1, ui.archStep + 1); refreshArch(); },
  archstep: t => { stopArch(); ui.archStep = +t.dataset.n; refreshArch(); },
  archplay: () => { if (ui.archPlaying) { stopArch(); } else { if (ui.archStep >= ARCH_FLOWS[ui.archFlow].steps.length - 1) ui.archStep = 0; playArch(); } refreshArch(); },
  seekscene: t => seek(+t.dataset.s + 1),
  pubr: t => { ui.pub.r = t.dataset.r; ui.pubFilm = null; render(); },
  pubfilm: t => { closeModal(); ui.pubFilm = t.dataset.id; if (ui.route !== 'awam') { location.hash = 'awam'; } else render(); window.scrollTo(0, 0); },
  pubback: () => { ui.pubFilm = null; render(); window.scrollTo(0, 0); },
  pubhome: () => { ui.pubFilm = null; ui.pub = { q: '', r: '', p: '' }; render(); window.scrollTo(0, 0); },
  pubplat: t => { ui.pubFilm = null; ui.pub = { q: '', r: '', p: t.dataset.p }; render(); window.scrollTo(0, 0); },
  hero: t => { ui.hero = +t.dataset.n; setHero(); startHero(); },
  pubverify: t => { ui.pubFilm = null; ui.pub = { q: '', r: '', p: '' }; ui.verify = { q: t.dataset.c, done: true }; render(); const e = document.getElementById('sahkan'); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
  pubverifygo: () => { const v = document.getElementById('vq'); ui.verify = { q: v ? v.value : '', done: true }; render(); const e = document.getElementById('sahkan'); if (e) e.scrollIntoView({ block: 'center' }); },
  pubreport: () => openModal('Lapor kandungan', `<div style="display:flex;flex-direction:column;gap:14px;max-width:560px"><p class="muted" style="margin:0">Laporan dihantar terus kepada Unit Penguatkuasaan LPF. Anda tidak perlu log masuk.</p><div class="field"><label for="rp1">Jenis laporan</label><select class="inp" id="rp1"><option>Klasifikasi tidak sesuai</option><option>Tayangan versi tidak diluluskan</option><option>Sijil palsu atau tiada sijil</option><option>Lain-lain</option></select></div><div class="field"><label for="rp2">Butiran</label><textarea class="inp" id="rp2" placeholder="Nama pawagam / platform, tarikh dan masa tayangan"></textarea></div><div style="display:flex;gap:10px"><button class="btn btn-pri" data-act="pubreportsend">Hantar laporan</button><button class="btn" data-act="close">Batal</button></div></div>`),
  pubreportsend: () => { closeModal(); toast('Laporan diterima. No. rujukan ADU-2026-' + (1000 + Math.floor(Math.random() * 8999)) + '.'); },
  pubapi: () => { const ex = pubFilms()[0]; openModal('API klasifikasi terbuka', `<p class="muted" style="margin:0 0 12px">Pawagam, platform penstriman dan aplikasi kawalan ibu bapa boleh memaparkan klasifikasi rasmi secara automatik.</p><pre class="code">GET /api/v1/klasifikasi?sijil=${esc(ex.cert)}\n\n${esc(JSON.stringify({ tajuk: ex.title, klasifikasi: ex.decision.rating, nasihat: ex.decision.advice, no_sijil: ex.cert, tarikh_keputusan: ex.decision.at.slice(0, 10), status: 'SAH' }, null, 2))}</pre>`); },
  otab: t => { ui.otab = t.dataset.v; ui.oq = ''; closeModal(); if (ui.route !== 'pegawai') location.hash = 'pegawai'; else render(); window.scrollTo(0, 0); },
  ofilt: t => { ui.ofilt = t.dataset.v; render(); },
  fb: t => { ui.fb = t.dataset.v; render(); },
  slmin: t => { ui.slmin = +t.dataset.v; render(); },
  slcat: t => { ui.slcat = t.dataset.v; render(); },
  slseek: t => { seek(+t.dataset.s + 1); const e = document.getElementById('frame'); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
  slopen: t => { closeModal(); ui.otab = 'semak'; selectFilm(t.dataset.id, false); ui.time = +t.dataset.s + 1; if (ui.route !== 'pegawai') location.hash = 'pegawai'; else render(); setTimeout(() => { const e = document.getElementById('frame'); if (e) e.scrollIntoView({ block: 'center' }); }, 60); },
  afilt: t => { ui.afilt = t.dataset.v; render(); },
  openfilm: t => { closeModal(); ui.otab = 'semak'; selectFilm(t.dataset.id, false); if (!role().mods.includes('pegawai')) { switchRole('pegawai', 'pegawai'); return; } if (ui.route !== 'pegawai') location.hash = 'pegawai'; else render(); window.scrollTo(0, 0); },
  take: t => { const f = film(t.dataset.id); f.assignee = OFFICER; addLog(OFFICER, `Mengambil tugasan «${f.title}»`); save(); render(); toast(`«${esc(f.title)}» ditambah kepada tugasan anda.`, 'Semak', () => A.openfilm({ dataset: { id: f.id } })); },
  rec: t => recordModal(t.dataset.id),
  assign: t => { const f = film(t.dataset.id); const sel = document.querySelector(`[data-asgsel="${f.id}"]`); f.assignee = sel ? sel.value : OFFICER; addLog(ROLES.pengurusan.user, `Mengagihkan «${f.title}» kepada ${f.assignee}`); save(); render(); toast(`«${esc(f.title)}» diagihkan kepada ${esc(f.assignee)}.`); },
  dkind: t => { ui.dec[ui.sel].kind = t.dataset.v; ui.decErr = ''; render(); },
  cutflag: t => { const d = ui.dec[ui.sel]; const id = t.dataset.fid; if (d.cuts.includes(id)) d.cuts = d.cuts.filter(x => x !== id); else { d.cuts.push(id); if (d.kind === 'lulus') d.kind = 'potong'; } render(); },
  decide: () => {
    const f = film(ui.sel); const d = ui.dec[f.id]; const now = new Date().toISOString(); const fail = m => { ui.decErr = m; render(); const e = document.querySelector('.err'); if (e) e.scrollIntoView({ block: 'center' }); };
    const who = f.status === 'Rujuk Panel' ? `${OFFICER} (${f.panel ? f.panel.name : 'panel'})` : f.status === 'Rayuan' ? `${OFFICER} (Jawatankuasa Rayuan)` : OFFICER;
    const done = (msg, label, fn) => { stopPlay(); ui.sel = null; ui.decErr = ''; save(); render(); window.scrollTo(0, 0); toast(msg, label, fn); };
    if (d.kind === 'lulus' || d.kind === 'potong') {
      if (d.rating !== f.ai.rating && !d.reason.trim()) return fail('Sila nyatakan alasan pindaan kerana klasifikasi berbeza daripada cadangan AI.');
      if (d.kind === 'potong' && !f.resubmitted) {
        const cuts = f.ai.flags.filter(x => d.cuts.includes(x.id)).sort((a, b) => a.s - b.s).map(x => ({ s: x.s, e: x.e, d: x.d }));
        if (!cuts.length) return fail('Pilih sekurang-kurangnya satu adegan untuk dipotong (butang ✂ Potong dalam jadual penanda AI).');
        f.status = 'Pindaan Diminta'; f.assignee = f.assignee || OFFICER;
        f.request = { by: OFFICER, at: now, rating: d.rating, due: addDays(now, 14), note: d.note || `Filem boleh diluluskan sebagai ${d.rating} selepas potongan berikut.`, cuts, advice: [...d.advice] };
        addLog(who, `Meminta pindaan bagi «${f.title}»: ${cuts.length} potongan untuk kelulusan ${d.rating}`);
        return done(`Permintaan ${cuts.length} potongan dihantar kepada ${esc(f.dist)}.`);
      }
      if (d.kind === 'potong' && f.request.cuts.some((c, i) => !d.cutok[i])) return fail('Sahkan setiap potongan dalam versi disunting sebelum meluluskan.');
      f.status = 'Diluluskan'; f.cert = `LPF/K/${new Date().getFullYear()}/${String(S.seq.cert++).padStart(5, '0')}`;
      f.decision = { kind: d.kind, rating: d.rating, by: OFFICER, at: now, advice: [...d.advice], note: d.note, reason: d.reason, agreed: d.rating === f.ai.rating, cuts: d.kind === 'potong' ? f.request.cuts : [] };
      if (f.appeal) f.appeal.status = 'Rayuan diterima';
      addLog(who, `Meluluskan «${f.title}» sebagai ${d.rating}${d.kind === 'potong' ? ` dengan ${f.decision.cuts.length} potongan` : ''} ${f.decision.agreed ? '(selari dengan AI)' : `(dipinda daripada AI ${f.ai.rating})`}; sijil ${f.cert} dijana`);
      return done(`«${esc(f.title)}» diluluskan sebagai ${d.rating}. Sijil ${f.cert} dijana.`, 'Lihat sijil', () => showCert(f.id));
    }
    if (d.kind === 'tolak') {
      if (!d.why.trim()) return fail('Sila nyatakan justifikasi kepada pemohon.');
      f.status = 'Ditolak'; f.decision = { kind: 'tolak', rating: null, by: OFFICER, at: now, code: d.code, reason: d.why.trim(), advice: [], note: d.note, cuts: [], agreed: false };
      if (f.appeal) f.appeal.status = 'Rayuan ditolak';
      addLog(who, `Tidak meluluskan «${f.title}» (Kod ${d.code})`);
      return done(`«${esc(f.title)}» tidak diluluskan. Pemohon dimaklumkan dan boleh merayu dalam 30 hari.`);
    }
    if (!d.pwhy.trim()) return fail('Sila nyatakan sebab rujukan kepada panel.');
    f.status = 'Rujuk Panel'; f.panel = { name: d.panel, at: addDays(now, 3), by: OFFICER, reason: d.pwhy.trim() };
    addLog(OFFICER, `Merujuk «${f.title}» kepada ${d.panel}`);
    return done(`«${esc(f.title)}» dirujuk kepada ${d.panel}. Sesi dijadualkan ${fmtDate(f.panel.at)}.`);
  },
  dtab: t => { ui.dtab = t.dataset.v; if (ui.dtab === 'baru' && ui.wizStep === 5) { ui.wiz = newWiz(); ui.wizStep = 1; } closeModal(); if (ui.route !== 'pengedar') location.hash = 'pengedar'; else render(); window.scrollTo(0, 0); },
  ptab: t => A.dtab({ dataset: { v: t.dataset.v === 'new' ? 'baru' : 'serahan' } }),
  dfilt: t => { ui.dfilt = t.dataset.v; render(); },
  dview: t => distDetail(t.dataset.id),
  dpay: t => { ui.paying = false; payModal(t.dataset.id); },
  dpayok: t => { const f = film(t.dataset.id); ui.paying = true; payModal(f.id); setTimeout(() => { ui.paying = false; f.status = 'Diserahkan'; f.submitted = new Date().toISOString(); f.user = true; addLog(DIST, `Bayaran ${rm(fee(f))} bagi «${f.title}» diterima melalui FPX`); save(); closeModal(); render(); toast(`Bayaran diterima. Resit ${receiptNo(f)} dijana.`); setTimeout(() => { if (f.status === 'Diserahkan') { startAI(f.id); safeRender(); } }, 1800); }, 1300); },
  ddraft: t => { const f = film(t.dataset.id); ui.wiz = Object.assign(newWiz(), { title: f.title, type: f.type, genre: f.genre, lang: f.lang, min: String(f.min), platform: f.platform, synopsis: f.synopsis, draftId: f.id }); ui.wizStep = 2; ui.wizErr = ''; A.dtab({ dataset: { v: 'baru' } }); },
  dresub: t => { const f = film(t.dataset.id); ui.resub = f.id; distDetail(f.id); let p = 0; const iv = setInterval(() => { p = Math.min(100, p + 7 + Math.random() * 9); const b = document.getElementById('rsbar'); if (b) b.style.width = p + '%'; if (p >= 100) { clearInterval(iv); ui.resub = null; f.resubmitted = true; f.resubmittedAt = new Date().toISOString(); f.status = 'Menunggu Semakan'; addLog(DIST, `Versi disunting «${f.title}» dimuat naik (${f.request.cuts.length} potongan)`); save(); distDetail(f.id); render(); toast('Versi disunting diterima. Pegawai LPF akan mengesahkan potongan.'); } }, 120); },
  dappeal: t => appealModal(t.dataset.id),
  dappealsend: t => { const f = film(t.dataset.id); const g = (document.getElementById('apg') || {}).value || ''; const now = new Date().toISOString(); f.status = 'Rayuan'; f.appeal = { at: now, hearing: addDays(now, 10), grounds: g.trim() || 'Tidak bersetuju dengan keputusan.', status: 'Menunggu Jawatankuasa Rayuan' }; addLog(DIST, `Rayuan difailkan bagi «${f.title}»`); save(); closeModal(); render(); toast(`Rayuan bagi «${esc(f.title)}» diterima. Pendengaran ${fmtDate(f.appeal.hearing)}.`); },
  dpdf: () => toast('Muat turun disimulasikan dalam prototaip.'),
  dreceipt: t => { const f = film(t.dataset.id); openModal(`Resit ${receiptNo(f)}`, `<div class="sum tnum" style="max-width:460px"><span class="muted">Diterima daripada</span><b>${esc(f.dist)}</b><span class="muted">Untuk</span><b>Fi penapisan ${esc(f.title)} (${f.id})</b><span class="muted">Tarikh</span><b>${fmtDate(f.submitted)} · ${fmtTime(f.submitted)}</b><span class="muted">Kaedah</span><b>FPX</b><span class="tot">Jumlah</span><b class="tot">${rm(fee(f))}</b></div><p class="muted" style="font-size:12px;margin:14px 0 0">Contoh resit dalam prototaip. Bukan dokumen rasmi.</p>`); },  cert: t => showCert(t.dataset.id),
  close: () => closeModal(),
  ovclose: (t, e) => { if (e.target === t) closeModal(); },
  askreset: () => openModal('Set semula data demo?', `<p style="margin:0 0 16px">Semua serahan, keputusan dan log yang dibuat semasa demo akan dipadam dan data contoh asal dipulihkan.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-pri" data-act="doreset">Set semula</button><button class="btn" data-act="close">Batal</button></div>`),
  doreset: () => { Object.keys(jobs).forEach(k => { clearInterval(jobs[k]); delete jobs[k]; }); stopPlay(); const keep = S.role; S = seed(); S.role = keep; ui.dec = {}; ui.sel = null; ui.wiz = newWiz(); ui.wizStep = 1; ui.dtab = 'ringkasan'; ui.pub = { q: '', r: '', p: '' }; ui.pubFilm = null; ui.verify = null; save(); closeModal(); render(); toast('Data demo telah diset semula.'); },
};
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const fn = A[t.dataset.act]; if (fn) fn(t, e);
});
document.addEventListener('toggle', e => { const t = e.target; if (t && t.dataset && t.dataset.fid) ui.fopen[t.dataset.fid] = t.open; }, true);
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.w && t.type !== 'radio' && t.type !== 'checkbox' && t.tagName !== 'SELECT') ui.wiz[t.dataset.w] = t.value;
  if (t.dataset.bind && ui.sel && ui.dec[ui.sel]) ui.dec[ui.sel][t.dataset.bind] = t.value;
  if (t.dataset.pub === 'q') { ui.pub.q = t.value; ui.pubFilm = null; const pos = t.selectionStart; render(); const n = document.getElementById('pubq'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }
  if (t.dataset.oq) { ui.oq = t.value; const pos = t.selectionStart; render(); const n = document.getElementById('oq'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'wfile' && t.files && t.files[0]) { const fl = t.files[0]; startUpload(fl.name, fl.size > 1e9 ? (fl.size / 1e9).toFixed(1) + ' GB' : (fl.size / 1e6).toFixed(1) + ' MB'); return; }
  if (t.dataset.w) {
    const k = t.dataset.w;
    if (t.type === 'checkbox') ui.wiz[k] = t.checked;
    else if (k === 'express') ui.wiz.express = t.value === '1';
    else ui.wiz[k] = t.value;
    if (t.tagName === 'SELECT' || t.type === 'radio' || (t.type === 'checkbox' && k !== 'agree')) render();
  }
  if (t.dataset.adv && ui.sel && ui.dec[ui.sel]) {
    const d = ui.dec[ui.sel]; const a = t.dataset.adv;
    d.advice = t.checked ? [...new Set([...d.advice, a])] : d.advice.filter(x => x !== a);
    d.advice = CATS.map(c => c.adv).filter(x => d.advice.includes(x));
    const p = document.getElementById('advPrev'); if (p) p.textContent = d.advice.length ? d.advice.join(', ') : 'Tiada';
  }
  if (t.dataset.dsel && ui.sel && ui.dec[ui.sel]) ui.dec[ui.sel][t.dataset.dsel] = t.value;
  if (t.dataset.cutok !== undefined && ui.sel && ui.dec[ui.sel]) ui.dec[ui.sel].cutok[t.dataset.cutok] = t.checked;
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('modalRoot').innerHTML) closeModal();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('g[role="button"][data-act]')) { e.preventDefault(); const fn = A[e.target.dataset.act]; if (fn) fn(e.target, e); }
  if (e.key === 'Enter' && e.target.id === 'vq') A.pubverifygo();
  if (e.key === 'Enter' && e.target.id === 'gsearch') { ui.pub = { q: e.target.value, r: '', p: '' }; if (location.hash === '#awam') render(); else location.hash = 'awam'; }
});
window.addEventListener('hashchange', route);

// ---------- boot ----------
load();
S.films.forEach(f => { if (f.ai && !f.ai.done && (f.ai.running || (f.user && f.status === 'Diserahkan'))) { f.ai.running = false; startAI(f.id); } });
route();
setInterval(() => { const n = clockNow(); document.querySelectorAll('[data-clock]').forEach(e => { e.textContent = n; }); }, 1000);
