// ---------- interactive architecture ----------
const ARCH_LAYERS = [
  ['Pengguna', 'Siapa yang menggunakan'], ['Saluran & akses', 'Satu log masuk, ikut peranan'], ['Perkhidmatan teras', 'Aliran kerja LPF'],
  ['Otak AI KDN', 'Pra-saringan 8 kategori'], ['Data & keselamatan', 'Disulitkan hujung ke hujung'], ['Infrastruktur berdaulat', 'Kekal di Malaysia'],
];
const AX5 = [300, 520, 740, 960, 1180], AX4 = [340, 620, 900, 1160], AY = [70, 190, 310, 430, 550, 670], NW = 196, NH = 54;
const ARCH_NODES = [
  ['pengedar', 0, 0, 'upload', null, 'Pengedar & penerbit', 'Serah filem & bayar', 'Syarikat filem dan pengedar berdaftar. Log masuk dengan MyDigital ID, menyerahkan filem, membayar fi dan menerima sijil digital.'],
  ['ott', 0, 1, 'screen', null, 'Platform OTT', 'Klasifikasi kendiri', 'Platform penstriman menghantar klasifikasi kendiri melalui API. TAPIS mengaudit setiap judul dengan AI dan pegawai.'],
  ['pegawai', 0, 2, 'user', null, 'Pegawai LPF', 'Semak & putuskan', 'Pegawai Penapis menyemak penanda AI di Stesen Kerja dan membuat keputusan muktamad.'],
  ['pengurusan', 0, 3, 'chart', null, 'Pengurusan LPF/KDN', 'Pantau & audit', 'Pengurusan memantau tunggakan, masa keputusan, ketepatan AI, kutipan fi dan konsistensi panel.'],
  ['awam', 0, 4, 'globe', null, 'Orang awam', 'Semak klasifikasi', 'Ibu bapa dan orang awam mencari klasifikasi, nasihat pengguna dan mengesahkan sijil melalui QR.'],
  ['portal', 1, 0, 'upload', null, 'Portal Pengedar', 'Web & mudah alih', 'Borang serahan, muat naik boleh disambung semula, bayaran dalam talian dan status masa nyata.'],
  ['stesen', 1, 1, 'screen', null, 'Stesen Kerja', 'Pemain bertera air', 'Pemain video selamat dengan penanda AI, analisis adegan 8 kategori, semakan penanda dan borang keputusan.'],
  ['papan', 1, 2, 'chart', null, 'Papan Pemuka', 'Masa nyata', 'KPI, carta, audit OTT, konsistensi panel dan jejak audit untuk pengurusan.'],
  ['api', 1, 3, 'code', null, 'API & Semakan Awam', 'Pawagam, OTT, aplikasi', 'Carian awam dan API terbuka; juga menerima klasifikasi kendiri daripada platform OTT.'],
  ['mydid', 1, 4, 'lock', 'logo-mydigitalid', 'MyDigital ID', 'Identiti nasional', 'Log masuk tunggal untuk pengedar, pegawai dan pengurusan. Tiada kata laluan disimpan dalam TAPIS.'],
  ['bayar', 2, 0, 'money', null, 'Serahan & bayaran', 'FPX · JomPAY', 'Mengesahkan maklumat serahan, mengira fi (biasa/ekspres) dan menerima bayaran.'],
  ['gilir', 2, 1, 'layers', null, 'Baris gilir & SLA', 'Ekspres didahulukan', 'Enjin aliran kerja: mencipta kes, memulakan pra-saringan AI dan mengagihkan filem kepada pegawai mengikut SLA.'],
  ['sijil', 2, 2, 'cert', null, 'Sijil digital & QR', 'Boleh disahkan awam', 'Menjana sijil klasifikasi berkod QR dan nasihat pengguna sebaik keputusan dibuat.'],
  ['audit', 2, 3, 'doc', null, 'Jejak audit', 'Setiap tindakan direkod', 'Merekod siapa melihat apa, bila, dan setiap keputusan atau pindaan, untuk audit dan rayuan.'],
  ['notif', 2, 4, 'msg', null, 'Notifikasi', 'E-mel & SMS', 'Memaklumkan pengedar tentang status, keputusan dan sijil.'],
  ['pecah', 3, 0, 'layers', null, 'Pecahan adegan', 'Syot & lokasi', 'Memecah filem kepada adegan dan syot, serta mengekstrak bingkai, audio dan sari kata.'],
  ['gemini', 3, 1, 'brain', 'logo-gemini', 'Gemini', 'Analisis multimodal', 'Model multimodal yang membaca visual, audio dan teks setiap adegan serentak.'],
  ['gemma', 3, 2, 'brain', 'logo-gemma', 'Gemma', 'Model setempat', 'Model terbuka yang dilatih dengan keputusan LPF dan berjalan sepenuhnya dalam infrastruktur Malaysia.'],
  ['enjin', 3, 3, 'shield', null, 'Enjin peraturan LPF', 'Skor → klasifikasi', 'Menggabungkan skor 8 kategori setiap adegan dan menukarnya kepada cadangan klasifikasi mengikut garis panduan LPF.'],
  ['vertex', 3, 4, 'brain', 'logo-vertexai', 'Vertex AI', 'Latihan & pemantauan', 'Menyimpan versi model, melatih semula daripada pindaan pegawai dan memantau ketepatan setiap kategori.'],
  ['peti', 4, 0, 'lock', null, 'Peti simpanan filem', 'Storan disulitkan', 'Fail filem asal disimpan disulitkan; hanya salinan semakan bertera air dikeluarkan kepada pegawai.'],
  ['kms', 4, 1, 'lock', 'logo-kms', 'Cloud KMS', 'Kunci dikawal kerajaan', 'Kunci penyulitan dipegang dan diputar di bawah kawalan kerajaan.'],
  ['tera', 4, 2, 'shield', null, 'Tera air forensik', 'Setiap salinan semakan', 'Menanam identiti pegawai dan masa dalam setiap strim supaya kebocoran boleh dikesan.'],
  ['arkib', 4, 3, 'data', null, 'Arkib keputusan', 'Rujukan konsistensi', 'Keputusan lampau yang didigitalkan, digunakan sebagai rujukan supaya filem serupa diklasifikasi sama.'],
  ['db', 4, 4, 'data', null, 'Pangkalan data', 'Rekod klasifikasi rasmi', 'Rekod rasmi setiap judul, klasifikasi, nasihat pengguna dan nombor sijil.'],
  ['gdc', 5, 0, 'data', 'logo-gdc', 'Google Distributed Cloud', 'Awan berdaulat', 'Platform awan yang berjalan dalam pusat data di Malaysia untuk aplikasi, data dan model AI.'],
  ['dnex', 5, 1, 'data', 'logo-dnex', 'DNeX', 'Rakan infrastruktur', 'Rakan tempatan untuk rangkaian, operasi dan sokongan infrastruktur.'],
  ['dc', 5, 2, 'data', null, 'Pusat data Malaysia', 'Utama & pemulihan bencana', 'Dua tapak di Malaysia untuk ketersediaan tinggi dan pemulihan bencana.'],
  ['soc', 5, 3, 'shield', null, 'Pemantauan 24/7', 'SOC & ketersediaan', 'Pusat operasi keselamatan memantau ancaman, prestasi dan ketersediaan sepanjang masa.'],
].map(([id, l, i, ic, logo, t, s, d]) => ({ id, l, i, ic, logo, t, s, d, x: (l === 5 ? AX4 : AX5)[i], y: AY[l] }));
const AN = Object.fromEntries(ARCH_NODES.map(n => [n.id, n]));
const ARCH_EDGES = [
  ['pengedar', 'portal', 'Log masuk & serah'], ['ott', 'api', 'Klasifikasi kendiri'], ['pegawai', 'stesen', 'Semak filem'], ['pengurusan', 'papan', 'Pantau'], ['awam', 'api', 'Cari klasifikasi'],
  ['portal', 'mydid', 'Sahkan identiti'], ['stesen', 'mydid', 'Sahkan identiti'], ['papan', 'mydid', 'Sahkan identiti'],
  ['portal', 'bayar', 'Maklumat & bayaran'], ['portal', 'peti', 'Muat naik fail filem'], ['peti', 'kms', 'Kunci penyulitan'], ['bayar', 'gilir', 'Cipta kes'], ['bayar', 'audit', 'Direkod'],
  ['gilir', 'pecah', 'Mula pra-saringan'], ['peti', 'pecah', 'Fail sumber'], ['pecah', 'gemini', 'Bingkai, audio, teks'], ['pecah', 'gemma', 'Analisis setempat'],
  ['gemini', 'enjin', 'Skor 8 kategori'], ['gemma', 'enjin', 'Skor 8 kategori'], ['arkib', 'enjin', 'Rujukan konsistensi'], ['enjin', 'gilir', 'Cadangan & penanda'],
  ['gilir', 'stesen', 'Baris gilir pegawai'], ['tera', 'stesen', 'Strim bertera air'], ['peti', 'tera', 'Salinan semakan'],
  ['stesen', 'sijil', 'Keputusan pegawai'], ['stesen', 'audit', 'Direkod'], ['stesen', 'arkib', 'Keputusan disimpan'], ['stesen', 'vertex', 'Pindaan → maklum balas'], ['vertex', 'gemma', 'Model dikemas kini'],
  ['sijil', 'db', 'Rekod klasifikasi'], ['sijil', 'notif', 'Maklumkan pengedar'], ['notif', 'portal', 'E-mel & SMS'], ['db', 'api', 'Data awam'], ['sijil', 'audit', 'Direkod'],
  ['api', 'gilir', 'Kes audit OTT'], ['audit', 'papan', 'Log & laporan'], ['db', 'papan', 'Statistik'],
  ['peti', 'gdc', 'Dihoskan'], ['db', 'gdc', 'Dihoskan'], ['gemma', 'gdc', 'Berjalan di'], ['gemini', 'gdc', 'Berjalan di'], ['kms', 'gdc', 'Kunci'],
  ['gdc', 'dc', 'Pusat data'], ['dnex', 'dc', 'Rangkaian & operasi'], ['soc', 'dc', 'Pemantauan'],
].map(([a, b, lb], k) => ({ k, a, b, lb }));
function edgeIdx(a, b) { return ARCH_EDGES.findIndex(e => e.a === a && e.b === b); }
const ARCH_FLOWS = {
  serah: { t: 'Serahan filem', ic: 'upload', steps: [
    ['pengedar', 'portal', 'Studio Cahaya Timur log masuk ke Portal Pengedar dan mengisi maklumat «Gelora Selat».'],
    ['portal', 'mydid', 'Identiti syarikat disahkan melalui MyDigital ID; tiada kata laluan disimpan.'],
    ['portal', 'peti', 'Fail DCP 48 GB dimuat naik terus ke peti simpanan; checksum SHA-256 disahkan.'],
    ['peti', 'kms', 'Fail disulitkan dengan kunci yang dipegang kerajaan dalam Cloud KMS.'],
    ['portal', 'bayar', 'Fi dikira (108 min, ekspres) dan dibayar melalui FPX.'],
    ['bayar', 'gilir', 'Kes LPF-2026-0153 dicipta dalam baris gilir dengan SLA 48 jam.'],
    ['bayar', 'audit', 'Serahan dan bayaran direkod dalam jejak audit.']] },
  ai: { t: 'Pra-saringan Otak AI', ic: 'brain', steps: [
    ['gilir', 'pecah', 'Baris gilir memulakan pra-saringan sebaik bayaran disahkan.'],
    ['peti', 'pecah', 'Fail sumber dibaca dalam persekitaran selamat; filem dipecah kepada adegan dan syot.'],
    ['pecah', 'gemini', 'Bingkai, audio dan sari kata setiap adegan dianalisis secara multimodal.'],
    ['pecah', 'gemma', 'Model setempat yang dilatih dengan keputusan LPF menilai adegan yang sama.'],
    ['gemini', 'enjin', 'Skor 0–100 bagi 8 kategori dihantar ke enjin peraturan.'],
    ['gemma', 'enjin', 'Skor model setempat digabungkan untuk keyakinan yang lebih tinggi.'],
    ['arkib', 'enjin', 'Keputusan lampau bagi filem serupa dirujuk untuk konsistensi.'],
    ['enjin', 'gilir', 'Cadangan klasifikasi, penanda adegan dan nasihat pengguna dihantar ke baris gilir.']] },
  putus: { t: 'Keputusan pegawai', ic: 'user', steps: [
    ['pegawai', 'stesen', 'Pn. Aisyah membuka Stesen Kerja.'],
    ['stesen', 'mydid', 'Identiti pegawai disahkan; tera air memakai nama beliau.'],
    ['gilir', 'stesen', 'Filem ekspres muncul di atas baris gilir bersama cadangan AI.'],
    ['tera', 'stesen', 'Video distrim sebagai salinan bertera air forensik; fail asal tidak keluar dari peti.'],
    ['stesen', 'sijil', 'Pegawai mengesahkan atau meminda klasifikasi; sijil dijana serta-merta.'],
    ['stesen', 'audit', 'Keputusan, alasan pindaan dan semakan penanda direkod.'],
    ['stesen', 'arkib', 'Keputusan disimpan sebagai rujukan untuk filem akan datang.'],
    ['stesen', 'vertex', 'Pindaan pegawai menjadi data latihan.'],
    ['vertex', 'gemma', 'Model setempat dilatih semula dan dikemas kini selepas pengesahan.']] },
  awam: { t: 'Sijil & semakan awam', ic: 'cert', steps: [
    ['sijil', 'db', 'Klasifikasi dan nombor sijil masuk ke pangkalan data rasmi.'],
    ['sijil', 'notif', 'Pengedar dimaklumkan bahawa keputusan sudah dibuat.'],
    ['notif', 'portal', 'Sijil digital boleh dimuat turun dari portal.'],
    ['db', 'api', 'Rekod diterbitkan untuk carian awam dan API.'],
    ['awam', 'api', 'Ibu bapa mencari filem dan mengimbas QR untuk mengesahkan sijil.']] },
  ott: { t: 'Audit OTT', ic: 'shield', steps: [
    ['ott', 'api', 'Platform penstriman menghantar klasifikasi kendiri «Kod Merah: Musim 2» (13).'],
    ['api', 'gilir', 'TAPIS mencipta kes audit secara automatik.'],
    ['gilir', 'pecah', 'Episod dipecah kepada adegan untuk pra-saringan.'],
    ['enjin', 'gilir', 'AI mencadangkan 16, berbeza daripada klasifikasi kendiri.'],
    ['gilir', 'stesen', 'Kes dengan percanggahan diberi keutamaan kepada pegawai.'],
    ['stesen', 'sijil', 'Pegawai memutuskan; klasifikasi rasmi menggantikan klasifikasi kendiri.']] },
  urus: { t: 'Pemantauan pengurusan', ic: 'chart', steps: [
    ['pengurusan', 'papan', 'Pengarah membuka Papan Pemuka.'],
    ['papan', 'mydid', 'Akses disahkan mengikut peranan.'],
    ['audit', 'papan', 'Log tindakan dan keputusan dipaparkan untuk audit.'],
    ['db', 'papan', 'Statistik serahan, klasifikasi, kutipan fi dan ketepatan AI dikemas kini masa nyata.']] },
  infra: { t: 'Hos berdaulat', ic: 'data', steps: [
    ['peti', 'gdc', 'Peti simpanan filem dihoskan dalam Google Distributed Cloud di Malaysia.'],
    ['gemini', 'gdc', 'Model AI berjalan dalam awan berdaulat yang sama; kandungan tidak keluar negara.'],
    ['kms', 'gdc', 'Kunci penyulitan kekal di bawah kawalan kerajaan.'],
    ['gdc', 'dc', 'Awan berjalan di dua pusat data Malaysia untuk pemulihan bencana.'],
    ['dnex', 'dc', 'Rakan tempatan mengendalikan rangkaian dan operasi.'],
    ['soc', 'dc', 'SOC memantau keselamatan dan ketersediaan 24/7.']] },
};
function edgePath(e) {
  const A = AN[e.a], B = AN[e.b];
  if (A.l === B.l) { const s = A.x < B.x ? 1 : -1; const x1 = A.x + s * NW / 2, x2 = B.x - s * NW / 2, y = A.y; return `M${x1} ${y} C ${x1 + s * 30} ${y - 46}, ${x2 - s * 30} ${y - 46}, ${x2} ${y}`; }
  const down = B.y > A.y; const y1 = A.y + (down ? NH / 2 : -NH / 2), y2 = B.y + (down ? -NH / 2 : NH / 2); const my = (y1 + y2) / 2;
  const ox = (e.k % 5 - 2) * 6;
  return `M${A.x + ox} ${y1} C ${A.x + ox} ${my}, ${B.x + ox} ${my}, ${B.x + ox} ${y2}`;
}
function archState() {
  const nodes = new Set(), edges = new Set(); let cur = -1;
  if (ui.archFlow) { const F = ARCH_FLOWS[ui.archFlow]; F.steps.slice(0, ui.archStep + 1).forEach(([a, b], i) => { const k = edgeIdx(a, b); edges.add(k); nodes.add(a); nodes.add(b); if (i === ui.archStep) cur = k; }); }
  else if (ui.archSel) { nodes.add(ui.archSel); ARCH_EDGES.forEach(e => { if (e.a === ui.archSel || e.b === ui.archSel) { edges.add(e.k); nodes.add(e.a); nodes.add(e.b); } }); }
  return { nodes, edges, cur, any: nodes.size > 0 };
}
function archSVG() {
  const st = archState();
  const edgesSvg = ARCH_EDGES.map(e => { const on = st.edges.has(e.k), c = e.k === st.cur; const d = edgePath(e);
    return `<path class="ae ${on ? 'on' : ''} ${c ? 'cur' : ''} ${st.any && !on ? 'dim' : ''}" d="${d}"></path>${c ? `<circle r="6" fill="#FDE68A"><animateMotion dur="1.3s" repeatCount="indefinite" path="${d}"></animateMotion></circle>` : ''}`; }).join('');
  const labels = ARCH_EDGES.filter(e => st.edges.has(e.k)).map(e => { const A = AN[e.a], B = AN[e.b]; const x = (A.x + B.x) / 2, y = A.l === B.l ? A.y - 40 : (A.y + B.y) / 2; const w = e.lb.length * 6.4 + 18;
    return `<g class="al ${e.k === st.cur ? 'cur' : ''}"><rect x="${x - w / 2}" y="${y - 11}" width="${w}" height="22" rx="11"></rect><text x="${x}" y="${y + 4}" text-anchor="middle">${esc(e.lb)}</text></g>`; }).join('');
  const layers = ARCH_LAYERS.map(([t, s], l) => `<g class="alayer"><rect x="8" y="${AY[l] - 34}" width="1264" height="68" rx="16"></rect><text x="26" y="${AY[l] - 3}" class="lt1">${t}</text><text x="26" y="${AY[l] + 15}" class="lt2">${s}</text></g>`).join('');
  const nodesSvg = ARCH_NODES.map(n => { const on = st.nodes.has(n.id), sel = ui.archSel === n.id; const u = n.logo && img(n.logo);
    return `<g class="an ${n.l === 3 ? 'ai' : ''} ${on ? 'on' : ''} ${sel ? 'sel' : ''} ${st.any && !on ? 'dim' : ''}" data-act="archnode" data-id="${n.id}" role="button" tabindex="0" aria-label="${n.t}: ${n.s}">
      <rect x="${n.x - NW / 2}" y="${n.y - NH / 2}" width="${NW}" height="${NH}" rx="14"></rect>
      <rect class="aic" x="${n.x - NW / 2 + 10}" y="${n.y - 15}" width="30" height="30" rx="9"></rect>
      ${u ? `<image href="${u}" x="${n.x - NW / 2 + 13}" y="${n.y - 12}" width="24" height="24" preserveAspectRatio="xMidYMid meet"></image>` : `<g transform="translate(${n.x - NW / 2 + 16},${n.y - 9})" style="color:#CFE3FF">${I[n.ic]}</g>`}
      <text x="${n.x - NW / 2 + 50}" y="${n.y - 2}" class="t1">${n.t}</text><text x="${n.x - NW / 2 + 50}" y="${n.y + 14}" class="t2">${n.s}</text></g>`; }).join('');
  return `<svg viewBox="0 0 1280 720" role="img" aria-label="Rajah seni bina interaktif TAPIS">${layers}${edgesSvg}${nodesSvg}${labels}</svg>`;
}
function archPanel() {
  if (ui.archFlow) {
    const F = ARCH_FLOWS[ui.archFlow]; const s = F.steps[ui.archStep]; const A = AN[s[0]], B = AN[s[1]];
    return `<div class="apanel-h"><span class="ai-ic">${I[F.ic]}</span><span><small>Senario</small><b>${F.t}</b></span><span class="chip" style="margin-left:auto">Langkah ${ui.archStep + 1}/${F.steps.length}</span></div>
      <div class="hop"><span>${A.t}</span>${I.arrow}<span>${B.t}</span></div>
      <p class="anarr">${s[2]}</p>
      <div class="actl"><button class="btn btn-sm btn-gl" data-act="archprev" ${ui.archStep === 0 ? 'disabled' : ''}>${I.prev}Sebelum</button><button class="btn btn-sm btn-w" data-act="archplay">${ui.archPlaying ? I.pause + 'Jeda' : I.play + 'Main'}</button><button class="btn btn-sm btn-gl" data-act="archnext" ${ui.archStep >= F.steps.length - 1 ? 'disabled' : ''}>Seterusnya${I.next}</button></div>
      <ol class="asteps">${F.steps.map((x, i) => `<li><button class="${i === ui.archStep ? 'on' : i < ui.archStep ? 'done' : ''}" data-act="archstep" data-n="${i}"><span>${i + 1}</span>${AN[x[0]].t} → ${AN[x[1]].t}</button></li>`).join('')}</ol>`;
  }
  if (ui.archSel) {
    const n = AN[ui.archSel]; const inE = ARCH_EDGES.filter(e => e.b === n.id), outE = ARCH_EDGES.filter(e => e.a === n.id); const u = n.logo && img(n.logo);
    const li = (e, other) => `<li><button data-act="archnode" data-id="${other}"><b>${AN[other].t}</b><small>${esc(e.lb)}</small></button></li>`;
    return `<div class="apanel-h"><span class="ai-ic ${u ? 'logo' : ''}">${u ? `<img src="${u}" alt="">` : I[n.ic]}</span><span><small>${ARCH_LAYERS[n.l][0]}</small><b>${n.t}</b></span><button class="btn btn-sm btn-gl" style="margin-left:auto" data-act="archclear" aria-label="Tutup">${I.x}</button></div>
      <p class="anarr">${n.d}</p>
      ${inE.length ? `<div class="alist"><span>Menerima daripada (${inE.length})</span><ul>${inE.map(e => li(e, e.a)).join('')}</ul></div>` : ''}
      ${outE.length ? `<div class="alist"><span>Menghantar kepada (${outE.length})</span><ul>${outE.map(e => li(e, e.b)).join('')}</ul></div>` : ''}`;
  }
  return `<div class="apanel-h"><span class="ai-ic">${I.help}</span><span><small>Rajah interaktif</small><b>Teroka sambungan sistem</b></span></div>
    <p class="anarr">Klik mana-mana komponen untuk melihat apa yang ia terima dan hantar. Atau pilih senario di atas untuk melihat data bergerak melalui sistem, langkah demi langkah.</p>
    <div class="alegend"><span><i class="lg-on"></i>Sambungan aktif</span><span><i class="lg-cur"></i>Langkah semasa</span><span><i class="lg-ai"></i>Komponen AI</span></div>
    <div class="alist"><span>${ARCH_NODES.length} komponen · ${ARCH_EDGES.length} sambungan · ${Object.keys(ARCH_FLOWS).length} senario</span></div>
    <button class="btn btn-w btn-sm" data-act="archflow" data-k="serah">${I.play}Mulakan dengan serahan filem</button>`;
}
function archInner() {
  return `<div class="aflows">${Object.entries(ARCH_FLOWS).map(([k, F]) => `<button class="afbtn" data-act="archflow" data-k="${k}" aria-pressed="${ui.archFlow === k}">${I[F.ic]}${F.t}</button>`).join('')}<button class="afbtn" data-act="archclear" aria-pressed="${!ui.archFlow && !ui.archSel}">${I.layers}Semua sambungan</button></div>
    <div class="agrid"><div class="asvg">${archSVG()}</div><aside class="apanel">${archPanel()}</aside></div>`;
}
function refreshArch() { document.querySelectorAll('[data-archbox]').forEach(el => { el.innerHTML = archInner(); }); }
function stopArch() { ui.archPlaying = false; if (ui.archTimer) { clearInterval(ui.archTimer); ui.archTimer = null; } }
function playArch() {
  stopArch(); ui.archPlaying = true;
  ui.archTimer = setInterval(() => {
    if (!document.querySelector('[data-archbox]') || !ui.archFlow) { stopArch(); return; }
    const n = ARCH_FLOWS[ui.archFlow].steps.length;
    if (ui.archStep >= n - 1) { stopArch(); refreshArch(); return; }
    ui.archStep++; refreshArch();
  }, 2600);
}
function secArch() {
  const db = img('data-centre');
  return `<section class="archsec" style="margin-top:28px" id="senibina"><div class="ab">${db ? `<img src="${db}" alt="">` : ''}</div><div class="arch-in">
    <span class="eyebrow" style="color:#8EC5FF">Seni bina sistem · interaktif</span><h2>Bagaimana keseluruhan sistem bersambung</h2>
    <p>Enam lapisan, ${ARCH_NODES.length} komponen. Pilih senario untuk melihat aliran data dari serahan hingga sijil, atau klik komponen untuk melihat sambungannya.</p>
    <div data-archbox>${archInner()}</div>
    <p class="arch-note">Seni bina cadangan untuk perbincangan. Logo milik pemilik masing-masing; tiada pengesahan atau perkongsian rasmi dinyatakan.</p>
  </div></section>`;
}
