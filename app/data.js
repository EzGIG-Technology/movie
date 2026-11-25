// ---------- constants ----------
const LS_KEY = 'tapis-demo-v3';
const OFFICER = 'Pn. Aisyah Rahman';
const DIST = 'Studio Cahaya Timur Sdn Bhd';
const RATE = 5;            // kadar contoh RM / minit (demo sahaja)
const EXPRESS_MULT = 1.5;
const PRECHECK_FEE = 500;

const CATS = [
  { k: 'ganas',    n: 'Keganasan',                   c: '#c8102e', adv: 'Keganasan' },
  { k: 'seks',     n: 'Seks & kelucahan',            c: '#b5179e', adv: 'Unsur seksual' },
  { k: 'bahasa',   n: 'Bahasa kesat',                c: '#e07a10', adv: 'Bahasa kesat' },
  { k: 'dadah',    n: 'Dadah & alkohol',             c: '#7a4fd6', adv: 'Dadah / alkohol' },
  { k: 'agama',    n: 'Agama & kepercayaan',         c: '#0b84c6', adv: 'Unsur kepercayaan' },
  { k: 'seram',    n: 'Seram & ngeri',               c: '#5f6f82', adv: 'Seram' },
  { k: 'sensitif', n: 'Isu sensitif (kaum/politik)', c: '#0b8f8a', adv: 'Isu sensitif' },
  { k: 'bahaya',   n: 'Perlakuan berbahaya & jenayah', c: '#a77c00', adv: 'Aksi berbahaya' },
];
const CAT = Object.fromEntries(CATS.map(c => [c.k, c]));
const RATINGS = ['U', 'P12', '13', '16', '18'];
const RATING_DESC = {
  U: 'Sesuai untuk semua peringkat umur',
  P12: 'Bimbingan ibu bapa bagi penonton bawah 12 tahun',
  '13': 'Untuk penonton 13 tahun ke atas',
  '16': 'Untuk penonton 16 tahun ke atas',
  '18': 'Untuk penonton 18 tahun ke atas',
};
const RCLS = { U: 'u', P12: 'p12', '13': 'r13', '16': 'r16', '18': 'r18' };
const RCOL = { U: '#0b84c6', P12: '#17a34a', '13': '#e0b400', '16': '#e07a10', '18': '#c8102e' };
const STATUSES = ['Draf', 'Menunggu Bayaran', 'Diserahkan', 'Pra-saringan AI', 'Menunggu Semakan', 'Rujuk Panel', 'Pindaan Diminta', 'Rayuan', 'Diluluskan', 'Ditolak'];
const OFFICERS = ['Pn. Aisyah Rahman', 'En. Faizal Osman', 'Cik Tan Mei Ling', 'En. Rajesh Kumar', 'Pn. Noraini Yusof'];
function initials(n) { return String(n || '').replace(/^(Pn|En|Cik|Dr|Tn)\.\s*/, '').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase(); }
const REJECT = [
  ['A', 'Unsur 3R (agama, kaum, institusi diraja) yang boleh menjejaskan keharmonian awam'],
  ['B', 'Kelucahan melampau yang tidak dapat diatasi melalui potongan'],
  ['C', 'Keganasan melampau atau sadistik sebagai tema utama'],
  ['D', 'Mengagungkan jenayah, keganasan atau penyalahgunaan dadah'],
  ['E', 'Bahan serahan tidak lengkap atau salinan tidak sah'],
];
const PANELS = ['Panel A', 'Panel B', 'Panel C', 'Panel D'];
function addDays(iso, d) { const x = new Date(iso); x.setDate(x.getDate() + d); return x.toISOString(); }
function dueOf(f) { return addDays(f.resubmittedAt || f.submitted, f.express ? 2 : 7); }
function daysLeft(f) { const a = new Date(dueOf(f)); a.setHours(0, 0, 0, 0); const b = new Date(); b.setHours(0, 0, 0, 0); return Math.round((a - b) / 86400000); }
const PRE_ST = ['Draf', 'Menunggu Bayaran'];
const DONE_ST = ['Diluluskan', 'Ditolak'];
const MONTHS = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];

const DESC = {
  ganas: ['Pergaduhan fizikal antara watak', 'Penggunaan senjata api', 'Kecederaan dengan darah kelihatan', 'Pukulan berulang dalam syot dekat'],
  seks: ['Adegan bermesra dan ciuman', 'Pakaian menjolok mata', 'Rujukan seksual dalam dialog'],
  bahasa: ['Kata-kata kesat dalam dialog', 'Carutan berulang', 'Penghinaan lisan antara watak'],
  dadah: ['Watak menghisap rokok', 'Minuman keras di majlis', 'Penggunaan dadah tersirat'],
  agama: ['Ritual dan amalan khurafat', 'Penggambaran simbol keagamaan', 'Dialog menyentuh soal akidah'],
  seram: ['Imej mengerikan / kejutan mendadak', 'Makhluk ghaib dalam syot dekat', 'Suasana menakutkan berpanjangan'],
  sensitif: ['Rujukan kaum dalam dialog', 'Sindiran isu politik semasa', 'Penggambaran institusi negara'],
  bahaya: ['Aksi berbahaya yang boleh ditiru', 'Memandu secara melulu', 'Jenayah dipaparkan secara terperinci'],
};
const SCENES = ['Dermaga, malam', 'Rumah keluarga, siang', 'Gudang lama', 'Jalan raya, hujan', 'Bilik hotel', 'Pasar pagi', 'Balai polis', 'Kedai kopi', 'Hutan simpan', 'Pejabat, lewat malam', 'Kampung, senja', 'Hospital', 'Bumbung bangunan', 'Kereta, perjalanan'];

const GENRES = {
  'Aksi':                { ganas: [58, 88], bahasa: [20, 55], dadah: [5, 35], bahaya: [25, 55] },
  'Drama':               { bahasa: [10, 45], seks: [5, 35], dadah: [5, 30], sensitif: [5, 30] },
  'Seram':               { seram: [62, 90], ganas: [30, 58], agama: [12, 48] },
  'Komedi':              { bahasa: [10, 40], seks: [5, 25] },
  'Keluarga / Animasi':  { ganas: [3, 14], seram: [2, 12] },
  'Dokumentari':         { sensitif: [10, 45], ganas: [5, 35] },
};

// ---------- helpers ----------
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function tc(sec) { sec = Math.max(0, Math.floor(sec)); const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return [h, m, s].map(x => String(x).padStart(2, '0')).join(':'); }
function fmtDate(iso) { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; }
function fmtTime(iso) { const d = new Date(iso); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; }
function rm(n) { return 'RM ' + Math.round(n).toLocaleString('en-MY'); }
function num(n) { return Math.round(n).toLocaleString('en-MY'); }
function daysAgo(d, h = 10) { const x = new Date(); x.setDate(x.getDate() - d); x.setHours(h, 15, 0, 0); return x.toISOString(); }
function sevOf(score) { return score >= 70 ? 'Tinggi' : score >= 40 ? 'Sederhana' : 'Rendah'; }
function ratingFromScores(sc) {
  const keys = ['ganas', 'seks', 'bahasa', 'dadah', 'seram', 'bahaya'];
  const m = Math.max(...keys.map(k => sc[k] || 0));
  if (m < 18) return 'U'; if (m < 34) return 'P12'; if (m < 52) return '13'; if (m < 76) return '16'; return '18';
}
function adviceFrom(sc) { return CATS.filter(c => (sc[c.k] || 0) >= 30).map(c => c.adv); }
function fee(f) { let base = f.min * RATE; if (f.express) base *= EXPRESS_MULT; return base + (f.precheck ? PRECHECK_FEE : 0); }

function mkFlags(defs) { return defs.map((d, i) => ({ id: 'f' + i, s: d[0], e: d[1], cat: d[2], sev: d[3], conf: d[4], d: d[5], v: null })); }
function toSec(s) { const p = s.split(':').map(Number); return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]; }
function F(a, b, cat, sev, conf, d) { return [toSec(a), toSec(b), cat, sev, conf, d]; }

// generate an AI result for a newly submitted film
function generatePlan(f) {
  const r = rng(hashStr(f.title + f.id));
  const prof = GENRES[f.genre] || {};
  const scores = {};
  CATS.forEach(c => { const rg = prof[c.k] || [0, 7]; scores[c.k] = Math.round(rg[0] + r() * (rg[1] - rg[0])); });
  const dur = f.min * 60;
  const flags = [];
  CATS.forEach(c => {
    const sc = scores[c.k]; if (sc < 14) return;
    const n = Math.max(1, Math.round(sc / 22));
    for (let i = 0; i < n; i++) {
      const s = Math.floor(dur * (0.04 + r() * 0.9));
      const len = 15 + Math.floor(r() * 110);
      const sv = sevOf(Math.max(8, sc - Math.floor(r() * 30)));
      const list = DESC[c.k];
      flags.push([s, Math.min(dur - 1, s + len), c.k, sv, +(0.62 + r() * 0.34).toFixed(2), list[Math.floor(r() * list.length)]]);
    }
  });
  flags.sort((a, b) => a[0] - b[0]);
  const rating = ratingFromScores(scores);
  return { scores, flags: mkFlags(flags), rating, conf: +(0.72 + r() * 0.22).toFixed(2), panel: (scores.agama >= 40 || scores.sensitif >= 40) };
}

// ---------- seed ----------
function seed() {
  const films = [];
  // 1. main demo film — AI done, waiting for officer
  films.push({
    id: 'LPF-2026-0148', title: 'Senja di Pelabuhan', type: 'Filem cereka', genre: 'Aksi', lang: 'Bahasa Melayu', min: 112, platform: 'Pawagam',
    dist: DIST, synopsis: 'Seorang bekas pegawai kastam terperangkap dalam sindiket penyeludupan di pelabuhan kampung halamannya.',
    submitted: daysAgo(2, 9), status: 'Menunggu Semakan', express: true, precheck: false, year: 2026, assignee: OFFICER,
    ai: { done: true, progress: 100, rating: '16', conf: 0.87, panel: false,
      scores: { ganas: 72, seks: 18, bahasa: 48, dadah: 41, agama: 3, seram: 8, sensitif: 6, bahaya: 22 },
      flags: mkFlags([
        F('00:04:12', '00:04:40', 'bahasa', 'Sederhana', 0.91, 'Kata-kata kesat ketika pertengkaran di jeti'),
        F('00:18:05', '00:19:30', 'dadah', 'Rendah', 0.78, 'Watak merokok dan minum arak di bar'),
        F('00:31:44', '00:33:10', 'ganas', 'Sederhana', 0.88, 'Pergaduhan tangan di gudang; tiada darah jelas'),
        F('00:47:02', '00:47:55', 'bahasa', 'Sederhana', 0.86, 'Carutan berulang (4 kali) dalam dialog'),
        F('01:02:30', '01:04:15', 'ganas', 'Tinggi', 0.94, 'Tikaman pisau; darah kelihatan dalam syot dekat'),
        F('01:15:20', '01:16:05', 'dadah', 'Sederhana', 0.83, 'Transaksi dadah di dermaga, bungkusan serbuk putih'),
        F('01:28:40', '01:31:00', 'ganas', 'Tinggi', 0.92, 'Tembak-menembak; mangsa rebah berdarah'),
        F('01:36:10', '01:36:40', 'seks', 'Rendah', 0.71, 'Adegan berpelukan dan ciuman ringkas'),
        F('01:44:05', '01:44:30', 'bahaya', 'Rendah', 0.66, 'Menunggang motosikal laju tanpa topi keledar'),
      ]) },
  });
  // 2. family animation
  films.push({
    id: 'LPF-2026-0149', title: 'Kampung Pisang Emas', type: 'Filem cereka', genre: 'Keluarga / Animasi', lang: 'Bahasa Melayu', min: 88, platform: 'Pawagam',
    dist: 'Animasi Nusantara Sdn Bhd', synopsis: 'Tiga beradik monyet menyelamatkan kebun pisang kampung daripada musim kemarau.',
    submitted: daysAgo(3, 14), status: 'Menunggu Semakan', express: false, precheck: true, year: 2026, assignee: OFFICER,
    ai: { done: true, progress: 100, rating: 'U', conf: 0.93, panel: false,
      scores: { ganas: 12, seks: 0, bahasa: 2, dadah: 0, agama: 1, seram: 10, sensitif: 1, bahaya: 6 },
      flags: mkFlags([
        F('00:22:10', '00:22:30', 'ganas', 'Rendah', 0.62, 'Slapstik: watak jatuh dari pokok (kartun)'),
        F('00:51:00', '00:51:45', 'seram', 'Rendah', 0.58, 'Adegan gelap di hutan dengan bunyi menakutkan ringan'),
      ]) },
  });
  // 3. OTT series — self-classified 13, AI says 16
  films.push({
    id: 'LPF-2026-0151', title: 'Kod Merah: Musim 2 (Ep. 1–8)', type: 'Siri penstriman', genre: 'Aksi', lang: 'Bahasa Inggeris', min: 360, platform: 'Penstriman',
    dist: 'Platform Penstriman A', synopsis: 'Unit siber polis memburu sindiket penipuan dalam talian merentas sempadan.',
    submitted: daysAgo(1, 11), status: 'Menunggu Semakan', express: false, precheck: false, year: 2026, selfRating: '13',
    ai: { done: true, progress: 100, rating: '16', conf: 0.84, panel: false,
      scores: { ganas: 64, seks: 22, bahasa: 70, dadah: 30, agama: 2, seram: 6, sensitif: 12, bahaya: 35 },
      flags: mkFlags([
        F('00:12:30', '00:13:05', 'bahasa', 'Tinggi', 0.95, 'Ep.1 — carutan berulang dalam Bahasa Inggeris'),
        F('00:58:20', '01:00:10', 'ganas', 'Sederhana', 0.89, 'Ep.2 — serbuan bersenjata, tembakan'),
        F('01:46:00', '01:46:40', 'dadah', 'Sederhana', 0.80, 'Ep.3 — watak menghidu dadah di kelab malam'),
        F('02:31:15', '02:33:00', 'ganas', 'Tinggi', 0.91, 'Ep.4 — penderaan tahanan, darah kelihatan'),
        F('03:20:40', '03:21:20', 'bahasa', 'Tinggi', 0.93, 'Ep.5 — penghinaan lisan dan carutan'),
        F('04:05:00', '04:05:50', 'seks', 'Rendah', 0.70, 'Ep.6 — adegan bermesra ringkas'),
        F('05:12:10', '05:13:30', 'bahaya', 'Sederhana', 0.76, 'Ep.7 — kaedah penipuan dalam talian dipaparkan terperinci'),
      ]) },
  });
  // 4. horror — AI not yet run (officer can start it live)
  const horror = {
    id: 'LPF-2026-0152', title: 'Bayang di Bilik 7', type: 'Filem cereka', genre: 'Seram', lang: 'Bahasa Melayu', min: 101, platform: 'Pawagam',
    dist: DIST, synopsis: 'Seorang jururawat syif malam mula melihat pesakit yang sudah lama meninggal dunia.',
    submitted: daysAgo(0, 8), status: 'Pra-saringan AI', express: false, precheck: false, year: 2026, assignee: OFFICER,
    ai: { done: false, running: false, progress: 0 },
  };
  horror.ai.plan = { rating: '18', conf: 0.74, panel: true,
    scores: { ganas: 52, seks: 4, bahasa: 14, dadah: 2, agama: 46, seram: 81, sensitif: 8, bahaya: 6 },
    flags: mkFlags([
      F('00:09:40', '00:10:05', 'seram', 'Sederhana', 0.82, 'Kejutan mendadak di koridor wad'),
      F('00:27:15', '00:29:00', 'agama', 'Sederhana', 0.77, 'Ritual pemujaan dengan bacaan jampi'),
      F('00:44:30', '00:45:10', 'seram', 'Tinggi', 0.90, 'Mayat bangkit dalam syot dekat, solekan ngeri'),
      F('01:03:20', '01:04:40', 'ganas', 'Sederhana', 0.85, 'Pembedahan mengerikan, darah kelihatan'),
      F('01:21:05', '01:22:30', 'seram', 'Tinggi', 0.92, 'Makhluk ghaib menyerang watak utama'),
      F('01:30:00', '01:31:10', 'agama', 'Sederhana', 0.73, 'Penggambaran bomoh dan amalan khurafat'),
    ]) };
  films.push(horror);

  // approved catalogue (public)
  const ok = (id, title, type, genre, lang, min, platform, dist, rating, advice, d, cert, year, synopsis) => withAI({
    id, title, type, genre, lang, min, platform, dist, synopsis, submitted: daysAgo(d + 4), status: 'Diluluskan', express: false, precheck: false, year,
    ai: { done: true, progress: 100, rating, conf: 0.9, scores: {}, flags: [] },
    decision: { kind: 'lulus', rating, by: OFFICERS[1 + (hashStr(id) % 4)], at: daysAgo(d, 15), advice, note: '', reason: '', agreed: true, cuts: [] }, cert,
  });
  films.push(
    ok('LPF-2026-0131', 'Cinta Hujung Minggu', 'Filem cereka', 'Komedi', 'Bahasa Melayu', 98, 'Pawagam', DIST, 'P12', ['Bahasa kasar ringan'], 6, 'LPF/K/2026/02188', 2026, 'Dua jurugambar perkahwinan bersaing untuk tempahan terbesar musim ini.'),
    ok('LPF-2026-0127', 'Lari!', 'Filem cereka', 'Aksi', 'Bahasa Melayu', 104, 'Pawagam', 'Rantau Pictures', '18', ['Keganasan', 'Bahasa kesat'], 8, 'LPF/K/2026/02171', 2026, 'Seorang penghantar makanan menjadi saksi pembunuhan dan diburu sepanjang malam.'),
    ok('LPF-2026-0125', 'Hikayat Laksamana (Treler)', 'Treler', 'Drama', 'Bahasa Melayu', 2, 'Pawagam', 'Rantau Pictures', 'U', [], 9, 'LPF/K/2026/02166', 2026, 'Treler rasmi epik sejarah maritim.'),
    ok('LPF-2026-0119', 'Pasar Malam Mak Jah', 'Siri TV', 'Komedi', 'Bahasa Melayu', 300, 'Televisyen', 'Seri Media', 'U', [], 12, 'LPF/K/2026/02140', 2026, 'Siri komedi keluarga tentang gerai pasar malam warisan.'),
    ok('LPF-2026-0117', 'Rimba Terlarang', 'Filem cereka', 'Seram', 'Bahasa Melayu', 95, 'Penstriman', 'Platform Penstriman B', '16', ['Seram', 'Keganasan'], 13, 'LPF/K/2026/02133', 2026, 'Sekumpulan pendaki tersesat di hutan yang tidak wujud dalam peta.'),
    ok('LPF-2026-0112', 'Jalan Pulang', 'Filem cereka', 'Drama', 'Bahasa Melayu', 117, 'Pawagam', 'Teratai Films', '13', ['Tema matang'], 16, 'LPF/K/2026/02110', 2026, 'Seorang anak perantau pulang menjaga bapanya yang menghidap demensia.'),
    ok('LPF-2026-0108', 'Detektif Cilik', 'Siri penstriman', 'Keluarga / Animasi', 'Bahasa Melayu', 220, 'Penstriman', 'Animasi Nusantara Sdn Bhd', 'U', [], 18, 'LPF/K/2026/02092', 2026, 'Tiga sahabat sekolah rendah menyelesaikan misteri kecil di taman perumahan.'),
    ok('LPF-2026-0101', 'Kota Tanpa Tidur', 'Siri penstriman', 'Aksi', 'Bahasa Melayu', 400, 'Penstriman', 'Platform Penstriman A', '18', ['Dadah / alkohol', 'Keganasan', 'Bahasa kesat'], 21, 'LPF/K/2026/02061', 2026, 'Kehidupan malam ibu kota dari mata seorang pemandu teksi.'),
    ok('LPF-2026-0096', 'Layang-Layang Terakhir', 'Filem cereka', 'Drama', 'Bahasa Melayu', 92, 'Pawagam', 'Teratai Films', 'P12', ['Tema sedih'], 24, 'LPF/K/2026/02043', 2026, 'Seorang datuk dan cucunya membina layang-layang untuk pertandingan terakhir kampung.'),
    ok('LPF-2026-0090', 'Gelombang Merah', 'Dokumentari', 'Dokumentari', 'Bahasa Inggeris', 76, 'Televisyen', 'Seri Media', '13', ['Isu sensitif'], 27, 'LPF/K/2026/02015', 2026, 'Dokumentari tentang nelayan pantai timur dan perubahan iklim.'),
  );
  seedMore(films);
  return {
    films,
    seq: { ref: 170, cert: 2201 },
    log: [
      { at: daysAgo(0, 9), who: 'Sistem', what: 'Serahan LPF-2026-0152 «Bayang di Bilik 7» diterima; bayaran FPX disahkan' },
      { at: daysAgo(1, 16), who: 'Sistem', what: 'Pra-saringan AI selesai bagi «Kod Merah: Musim 2» — cadangan 16, klasifikasi kendiri platform 13' },
      { at: daysAgo(2, 12), who: 'Sistem', what: 'Pra-saringan AI selesai bagi «Senja di Pelabuhan» — cadangan 16' },
      { at: daysAgo(2, 16), who: OFFICER, what: 'Meminta pindaan bagi «Geng Motor Lebuh Raya»: 3 potongan untuk kelulusan 16' },
      { at: daysAgo(3, 15), who: OFFICER, what: 'Menolak «Jerat» (Kod C: keganasan melampau sebagai tema utama)' },
      { at: daysAgo(4, 15), who: OFFICER, what: 'Meluluskan «Gelora Selat» sebagai 16 dengan 2 potongan; sijil dijana' },
      { at: daysAgo(5, 11), who: DIST, what: 'Rayuan difailkan bagi «Bisikan Hutan Paya»; pendengaran Jawatankuasa Rayuan dijadualkan' },
      { at: daysAgo(6, 15), who: 'En. Rajesh Kumar', what: 'Meluluskan «Cinta Hujung Minggu» sebagai P12 (selari dengan AI)' },
    ],
    payments: [],
  };
}

// give catalogue entries a full AI record consistent with the decided rating
function withAI(f) {
  const p = generatePlan({ ...f, genre: f.genre });
  const want = f.decision.rating; const lim = { U: 15, P12: 30, '13': 48, '16': 70, '18': 95 }[want];
  const keys = ['ganas', 'seks', 'bahasa', 'dadah', 'seram', 'bahaya'];
  keys.forEach(k => { p.scores[k] = Math.min(p.scores[k], lim); });
  const top = keys.reduce((a, k) => p.scores[k] > p.scores[a] ? k : a, keys[0]);
  p.scores[top] = Math.max(p.scores[top], { U: 8, P12: 22, '13': 40, '16': 60, '18': 82 }[want]);
  const r = ratingFromScores(p.scores);
  f.ai = { done: true, progress: 100, rating: r, conf: p.conf, scores: p.scores, flags: p.flags.filter(x => p.scores[x.cat] >= 14), panel: false };
  f.decision.agreed = r === want;
  return f;
}
function seedMore(films) {
  const mk = o => {
    const f = Object.assign({ type: 'Filem cereka', lang: 'Bahasa Melayu', platform: 'Pawagam', express: false, precheck: false, year: 2026 }, o);
    f.submitted = daysAgo(o.d || 1, o.h || 10); delete f.d; delete f.h;
    if (!['Draf', 'Menunggu Bayaran', 'Diserahkan', 'Pra-saringan AI'].includes(f.status)) {
      const p = generatePlan(f);
      if (o.over) { Object.assign(p.scores, o.over); p.rating = ratingFromScores(p.scores); p.panel = p.scores.agama >= 40 || p.scores.sensitif >= 40; }
      f.ai = { done: true, progress: 100, rating: p.rating, conf: p.conf, scores: p.scores, flags: p.flags, panel: p.panel };
    } else f.ai = { done: false, running: false, progress: o.prog || 0, queued: o.queued || 0 };
    delete f.over; delete f.prog; delete f.queued;
    return f;
  };
  const dec = (f, kind, rating, by, d, extra = {}) => {
    f.decision = Object.assign({ kind, rating, by, at: daysAgo(d, 15), advice: adviceFrom(f.ai.scores), note: '', reason: '', agreed: rating === f.ai.rating, cuts: [] }, extra);
    if (kind !== 'tolak') f.cert = `LPF/K/2026/0${2100 + (hashStr(f.id) % 90)}`;
    return f;
  };
  const C = (a, b, d) => ({ s: toSec(a), e: toSec(b), d });
  const T = 'Teratai Films', SM = 'Seri Media', AN = 'Animasi Nusantara Sdn Bhd', LP = 'Layar Perak Entertainment', GL = 'Golden Lotus Pictures', KP = 'Kalai Productions', RP = 'Rantau Pictures';
  films.push(
    mk({ id: 'LPF-2026-0160', title: 'Pulau Terakhir', genre: 'Aksi', min: 118, dist: DIST, status: 'Draf', d: 0, h: 9, synopsis: 'Seorang penyelam komersial menemui kapal karam yang menyimpan rahsia keluarganya.', file: null }),
    mk({ id: 'LPF-2026-0159', title: 'Lagu Untuk Ibu', genre: 'Drama', min: 97, dist: DIST, status: 'Menunggu Bayaran', d: 1, h: 17, synopsis: 'Seorang penyanyi jalanan pulang ke kampung untuk menunaikan janji terakhir kepada ibunya.' }),
    mk({ id: 'LPF-2026-0158', title: 'Kopitiam Lane', type: 'Siri TV', genre: 'Komedi', lang: 'Bahasa Inggeris', min: 264, platform: 'Televisyen', dist: SM, status: 'Diserahkan', d: 0, h: 7, synopsis: 'Tiga generasi pengusaha kopitiam di Ipoh berdepan rangkaian kafe moden.' }),
    mk({ id: 'LPF-2026-0157', title: 'Ratu Dodol', genre: 'Komedi', min: 102, dist: T, status: 'Pra-saringan AI', d: 0, h: 6, prog: 0, queued: 2, synopsis: 'Pertandingan dodol peringkat negeri bertukar menjadi perang antara dua keluarga.' }),
    mk({ id: 'LPF-2026-0156', title: 'Banjir Kilat', type: 'Siri penstriman', genre: 'Aksi', min: 300, platform: 'Penstriman', dist: 'Platform Penstriman C', status: 'Menunggu Semakan', d: 1, selfRating: '13', synopsis: 'Pasukan penyelamat bomba berlumba dengan masa ketika banjir melanda bandar.' }),
    mk({ id: 'LPF-2026-0155', title: 'Mahjong Malam Raya', genre: 'Komedi', lang: 'Bahasa Kantonis', min: 104, dist: GL, status: 'Menunggu Semakan', assignee: 'Cik Tan Mei Ling', d: 2, synopsis: 'Sebuah keluarga Cina-Melayu berkumpul untuk Tahun Baru dan Hari Raya yang jatuh pada minggu sama.' }),
    mk({ id: 'LPF-2026-0154', title: 'Thangamana Vazhkai', genre: 'Drama', lang: 'Bahasa Tamil', min: 142, dist: KP, status: 'Menunggu Semakan', assignee: 'En. Rajesh Kumar', d: 3, synopsis: 'Kisah tiga beradik di estet getah Kedah yang memilih jalan hidup berbeza.' }),
    mk({ id: 'LPF-2026-0153', title: 'Kapten Kancil', type: 'Siri penstriman', genre: 'Keluarga / Animasi', min: 240, platform: 'Penstriman', dist: AN, status: 'Menunggu Semakan', assignee: OFFICER, d: 9, selfRating: 'U', synopsis: 'Kancil yang cerdik mengetuai pelayaran untuk menyelamatkan pulau haiwan.' }),
    mk({ id: 'LPF-2026-0147', title: 'Anak Bulan', genre: 'Drama', min: 109, dist: T, status: 'Menunggu Semakan', assignee: OFFICER, d: 4, synopsis: 'Seorang guru muda ditugaskan ke sekolah pedalaman Sarawak.' }),
    mk({ id: 'LPF-2026-0146', title: 'Dendam Puaka Kebun Getah', genre: 'Seram', min: 96, dist: LP, status: 'Rujuk Panel', assignee: 'Pn. Noraini Yusof', d: 6, over: { agama: 58, seram: 79 }, synopsis: 'Penoreh getah diganggu selepas membuka semula kebun yang ditinggalkan.',
      panel: { name: 'Panel B', at: daysAgo(-2, 10), by: 'Pn. Noraini Yusof', reason: 'Unsur khurafat dan ritual pemujaan (skor agama 58). Perlu pertimbangan panel sebelum klasifikasi.' } }),
    mk({ id: 'LPF-2026-0145', title: 'Geng Motor Lebuh Raya', genre: 'Aksi', min: 101, dist: DIST, status: 'Pindaan Diminta', assignee: OFFICER, d: 8, over: { bahaya: 82, ganas: 62 }, synopsis: 'Sekumpulan pelumba haram terjebak dengan sindiket kereta curi.',
      request: { by: OFFICER, at: daysAgo(2, 16), rating: '16', due: daysAgo(-12, 17), note: 'Filem boleh diluluskan sebagai 16 jika tiga adegan di bawah dipotong. Tanpa potongan, filem dinilai 18.',
        cuts: [C('00:41:10', '00:42:05', 'Aksi wheelie di lebuh raya dipaparkan secara terperinci (boleh ditiru)'), C('01:12:30', '01:13:00', 'Kaedah mengubah suai motosikal untuk lumba haram'), C('01:30:15', '01:30:40', 'Syot dekat kemalangan dengan kecederaan grafik')] } }),
    mk({ id: 'LPF-2026-0144', title: 'Bisikan Hutan Paya', genre: 'Seram', min: 92, dist: DIST, status: 'Rayuan', assignee: 'En. Faizal Osman', d: 16, over: { agama: 71, seram: 84 }, synopsis: 'Sepasang suami isteri berpindah ke rumah di tepi paya dan mula mendengar bisikan pada waktu malam.',
      appeal: { at: daysAgo(5, 11), hearing: daysAgo(-6, 10), grounds: 'Unsur ritual adalah sebahagian daripada naratif budaya dan bukan promosi amalan. Kami bersedia memotong adegan 00:58–01:01.', status: 'Menunggu Jawatankuasa Rayuan' } }),
    mk({ id: 'LPF-2026-0143', title: 'Suara Rakyat', type: 'Dokumentari', genre: 'Dokumentari', lang: 'Bahasa Inggeris', min: 84, platform: 'Penstriman', dist: 'Platform Penstriman A', status: 'Ditolak', assignee: 'En. Faizal Osman', d: 14, over: { sensitif: 81 }, synopsis: 'Dokumentari tentang perhimpunan jalanan dan sentimen kaum.' }),
    mk({ id: 'LPF-2026-0142', title: 'Jerat', genre: 'Aksi', min: 99, dist: DIST, status: 'Ditolak', assignee: OFFICER, d: 7, over: { ganas: 96, bahaya: 70 }, synopsis: 'Seorang pembunuh upahan memburu saksi terakhir sebuah pembunuhan beramai-ramai.' }),
    mk({ id: 'LPF-2026-0141', title: 'Gelora Selat', genre: 'Aksi', min: 108, dist: DIST, status: 'Diluluskan', assignee: OFFICER, d: 9, synopsis: 'Dua beradik nelayan terjebak dalam konflik dengan lanun moden di Selat Melaka.' }),
    mk({ id: 'LPF-2026-0139', title: 'Rindu Seberang', genre: 'Drama', min: 113, dist: T, status: 'Diluluskan', d: 10, synopsis: 'Kisah cinta merentas Selat Johor antara dua keluarga yang bermusuhan.' }),
    mk({ id: 'LPF-2026-0138', title: 'The Last Ferry', genre: 'Drama', lang: 'Bahasa Inggeris', min: 106, platform: 'Penstriman', dist: 'Platform Penstriman B', status: 'Diluluskan', d: 12, over: { bahasa: 58 }, synopsis: 'Penumpang terakhir feri Pulau Pinang berkongsi rahsia sepanjang perjalanan malam.' }),
    mk({ id: 'LPF-2026-0137', title: 'Misi Angkasa', type: 'Siri penstriman', genre: 'Keluarga / Animasi', min: 180, platform: 'Penstriman', dist: AN, status: 'Diluluskan', d: 15, over: { ganas: 22 }, synopsis: 'Kadet angkasa Malaysia pertama melatih robot comel untuk misi ke bulan.' }),
    mk({ id: 'LPF-2026-0136', title: 'Hari Raya di Kota', type: 'Siri TV', genre: 'Komedi', min: 220, platform: 'Televisyen', dist: SM, status: 'Diluluskan', d: 18, over: { bahasa: 12, seks: 4 }, synopsis: 'Keluarga besar berebut rumah untuk menyambut Hari Raya di kondominium kecil.' }),
    mk({ id: 'LPF-2026-0135', title: 'Ah Beng Pergi Hollywood', genre: 'Komedi', lang: 'Bahasa Kantonis', min: 99, dist: GL, status: 'Diluluskan', d: 19, over: { bahasa: 28 }, synopsis: 'Seorang pelakon tambahan dari Petaling Street mendapat peranan besar secara tidak sengaja.' }),
    mk({ id: 'LPF-2026-0134', title: 'Kadal Kanni', genre: 'Drama', lang: 'Bahasa Tamil', min: 128, dist: KP, status: 'Diluluskan', d: 22, over: { bahasa: 38 }, synopsis: 'Seorang gadis nelayan di Port Dickson bercita-cita menjadi juruterbang.' }),
    mk({ id: 'LPF-2026-0133', title: 'Operasi Gerhana', genre: 'Aksi', min: 116, dist: LP, status: 'Diluluskan', d: 25, over: { ganas: 88 }, synopsis: 'Unit elit polis menyerbu kubu sindiket dadah di sempadan.' }),
  );
  const f = id => films.find(x => x.id === id);
  dec(f('LPF-2026-0143'), 'tolak', null, 'En. Faizal Osman', 9, { code: 'A', reason: 'Dokumentari memaparkan dakwaan berkaitan kaum tanpa konteks seimbang; tidak dapat diatasi melalui potongan.' });
  dec(f('LPF-2026-0142'), 'tolak', null, OFFICER, 3, { code: 'C', reason: 'Keganasan sadistik berpanjangan (penyeksaan 01:05–01:14) menjadi tema utama; potongan akan menjejaskan keseluruhan naratif.' });
  dec(f('LPF-2026-0144'), 'tolak', null, 'En. Faizal Osman', 10, { code: 'A', reason: 'Ritual pemujaan dan bacaan jampi dipaparkan secara terperinci dan berulang.' });
  dec(f('LPF-2026-0141'), 'potong', '16', OFFICER, 4, { advice: ['Keganasan', 'Aksi berbahaya'], cuts: [C('00:52:40', '00:53:10', 'Syot dekat tikaman parang'), C('01:21:05', '01:21:30', 'Kaedah membuat bom petrol')] });
  dec(f('LPF-2026-0139'), 'lulus', '13', 'Cik Tan Mei Ling', 5);
  dec(f('LPF-2026-0138'), 'lulus', '16', 'En. Rajesh Kumar', 7);
  dec(f('LPF-2026-0137'), 'lulus', 'P12', 'Pn. Noraini Yusof', 11);
  dec(f('LPF-2026-0136'), 'lulus', 'U', 'Cik Tan Mei Ling', 14);
  dec(f('LPF-2026-0135'), 'lulus', 'P12', 'En. Rajesh Kumar', 15);
  dec(f('LPF-2026-0134'), 'lulus', '13', 'En. Rajesh Kumar', 17);
  dec(f('LPF-2026-0133'), 'potong', '18', 'En. Faizal Osman', 19, { cuts: [C('01:02:00', '01:02:40', 'Penyeksaan tahanan dalam syot dekat')] });
  films.filter(x => x.decision && x.decision.kind === 'lulus' && x.status === 'Diluluskan').forEach(x => { if (!x.decision.advice) x.decision.advice = adviceFrom(x.ai.scores); });
}
