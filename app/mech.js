// ---------- mechanics of the TAPIS solution (slide-style hub diagram) ----------
const MECH_STEPS = [
  ['Serahan filem', 'Pengedar, penerbit atau platform OTT menyerahkan filem dan metadata melalui Portal Pengedar.'],
  ['Sahkan identiti', 'TAPIS mengesahkan pengguna melalui MyDigital ID dan menyemak pendaftaran syarikat.'],
  ['Simpan di repositori pusat', 'Fail filem disulitkan dan disimpan di Peti Simpanan Pusat dalam Malaysia; salinan semakan diberi tera air.'],
  ['Kutip fi penapisan', 'Fi dikira (biasa atau ekspres) dan dikutip melalui FPX, JomPAY, DuitNow, kad atau e-dompet.'],
  ['Pra-saringan Otak AI KDN', 'AI memecah filem kepada adegan, memberi skor 8 kategori dan menghantar cadangan klasifikasi kepada TAPIS.'],
  ['Keputusan pegawai LPF', 'Pegawai atau panel menyemak penanda AI dan membuat keputusan muktamad; pindaan melatih semula AI.'],
  ['Sijil & rekod awam', 'Sijil digital berkod QR dikeluarkan; klasifikasi diterbitkan untuk orang awam, pawagam dan OTT melalui API.'],
  ['Penyelesaian kutipan', 'Kutipan fi diselesaikan ke akaun LPF pada T+1, dengan penyesuaian harian.'],
  ['Pemantauan & audit KDN', 'Papan pemuka dan jejak audit: tunggakan, masa keputusan, kutipan dan ketepatan AI.'],
];
function secMech() {
  const pin = ui.mechPin;
  const cls = n => `ms ${pin === n ? 'on' : ''}`;
  const sty = n => `style="--i:${n - 1}"`;
  const box = (x, y, w, h, title, sub, icon, extra = '') => `<g class="mnode"><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="18"></rect>
    <text x="${x}" y="${y - h / 2 + 26}" text-anchor="middle" class="mt">${title}</text>${sub ? `<text x="${x}" y="${y - h / 2 + 44}" text-anchor="middle" class="ms2">${sub}</text>` : ''}${icon}${extra}</g>`;
  const ico = (x, y, name, col = '#1460E0') => `<g transform="translate(${x - 14},${y - 14}) scale(1.55)" style="color:${col}">${I[name]}</g>`;
  const arrow = (n, d, mk = 'mA') => `<path class="${cls(n)} ma" ${sty(n)} d="${d}" marker-end="url(#${mk})"></path>`;
  const badge = (n, x, y) => `<g class="${cls(n)} mb" ${sty(n)} data-act="mechpin" data-n="${n}" role="button" tabindex="0" aria-label="Langkah ${n}: ${MECH_STEPS[n - 1][0]}"><circle cx="${x}" cy="${y}" r="15"></circle><text x="${x}" y="${y + 5}" text-anchor="middle">${n}</text></g>`;
  const note = (n, x, y, lines, anchor = 'start') => `<text class="${cls(n)} mn" ${sty(n)} x="${x}" y="${y}" text-anchor="${anchor}">${lines.map((l, i) => `<tspan x="${x}" dy="${i ? 16 : 0}">${l}</tspan>`).join('')}</text>`;
  const pay = ['FPX', 'JomPAY', 'DuitNow QR', 'Visa · Mastercard', 'MyDebit', 'e-dompet'];
  const md = img('logo-mydigitalid'), gm = img('logo-gemini');
  const svg = `<svg viewBox="0 0 1200 720" role="img" aria-label="Mekanik penyelesaian TAPIS: aliran 9 langkah antara pengedar, MyDigital ID, repositori pusat, sistem pembayaran, Otak AI KDN, pegawai LPF, orang awam dan KDN">
    <defs>
      <marker id="mA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#5B7290"></path></marker>
      <linearGradient id="hubg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B2F7A"></stop><stop offset=".6" stop-color="#1460E0"></stop><stop offset="1" stop-color="#22B5F0"></stop></linearGradient>
      <filter id="msh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#10388C" flood-opacity=".14"></feDropShadow></filter>
    </defs>
    ${arrow(1, 'M270 170 C 380 220, 420 280, 485 318')}
    ${arrow(2, 'M485 360 L 272 360')}
    ${arrow(3, 'M600 292 L 600 168')}
    ${arrow(4, 'M715 350 L 912 350')}
    ${arrow(5, 'M705 305 C 800 230, 880 190, 935 170')}${arrow(5, 'M945 205 C 880 250, 800 300, 712 330')}
    ${arrow(6, 'M708 392 C 800 470, 880 540, 930 568')}${arrow(6, 'M925 600 C 840 580, 760 500, 705 410')}
    ${arrow(7, 'M492 395 C 400 470, 330 530, 272 568')}${arrow(7, 'M492 330 C 420 260, 340 210, 272 196')}
    ${arrow(8, 'M985 420 C 960 520, 820 600, 712 615')}
    ${arrow(9, 'M600 410 L 600 560')}
    <g filter="url(#msh)">
      ${box(150, 160, 240, 104, 'Pengedar &amp; penerbit', 'Termasuk platform OTT', ico(150, 200, 'upload'))}
      ${box(150, 360, 240, 96, 'MyDigital ID', 'Identiti digital nasional', md ? `<image href="${md}" x="90" y="378" width="120" height="30" preserveAspectRatio="xMidYMid meet"></image>` : ico(150, 392, 'lock'))}
      <g class="mnode"><path d="M520 70 v70 a80 18 0 0 0 160 0 v-70" ></path><ellipse cx="600" cy="70" rx="80" ry="18"></ellipse><text x="600" y="108" text-anchor="middle" class="mt">Repositori pusat</text><text x="600" y="126" text-anchor="middle" class="ms2">Peti simpanan disulitkan</text></g>
      ${box(1050, 160, 250, 104, 'Otak AI KDN', 'Skor adegan · 8 kategori', ico(1010, 200, 'brain'), gm ? `<image href="${gm}" x="1035" y="188" width="70" height="22" preserveAspectRatio="xMidYMid meet"></image>` : '')}
      <g class="mnode"><rect x="920" y="275" width="260" height="150" rx="18"></rect><text x="1050" y="302" text-anchor="middle" class="mt">Sistem pembayaran</text>
        ${pay.map((p, i) => { const col = i % 2, row = Math.floor(i / 2); const x = 940 + col * 120, y = 318 + row * 32; return `<rect class="pchip" x="${x}" y="${y}" width="${col ? 100 : 112}" height="24" rx="12"></rect><text x="${x + (col ? 50 : 56)}" y="${y + 16}" text-anchor="middle" class="pct">${p}</text>`; }).join('')}</g>
      ${box(1050, 600, 250, 104, 'Pegawai &amp; panel LPF', 'Keputusan muktamad', `<image href="${LOGO_DARK}" x="1015" y="620" width="70" height="30" preserveAspectRatio="xMidYMid meet"></image>`)}
      ${box(600, 625, 240, 100, 'KDN &amp; pengurusan LPF', 'Papan pemuka · audit', ico(600, 660, 'chart'))}
      ${box(150, 600, 240, 104, 'Orang awam, pawagam &amp; OTT', 'Semakan awam · API', ico(150, 640, 'globe'))}
      <g class="mhub"><rect x="485" y="290" width="230" height="120" rx="24" fill="url(#hubg)"></rect>
        <g transform="translate(515,322)"><rect width="56" height="56" rx="16" fill="rgba(255,255,255,.18)"></rect><path transform="translate(9,9) scale(.35)" d="M19.44 88.56Q19.44 96.48 28.8 91.44L79.92 61.2Q90 54 79.92 46.8L28.8 16.56Q19.44 11.52 19.44 20.88z" fill="#fff"></path></g>
        <text x="585" y="345" class="hub1">TAPIS</text><text x="585" y="366" class="hub2">Platform klasifikasi</text><text x="585" y="382" class="hub2">filem nasional</text></g>
    </g>
    ${badge(1, 335, 196)}${note(1, 300, 240, ['Serah filem', '& metadata'], 'end')}
    ${badge(2, 378, 360)}${note(2, 378, 392, ['Sahkan identiti &', 'pendaftaran syarikat'], 'middle')}
    ${badge(3, 600, 230)}${note(3, 622, 222, ['Fail disulitkan &', 'kekal di Malaysia'])}
    ${badge(4, 812, 350)}${note(4, 812, 382, ['Kutip fi penapisan', 'biasa / ekspres'], 'middle')}
    ${badge(5, 830, 230)}${note(5, 808, 178, ['Skor 8 kategori &', 'cadangan klasifikasi'], 'middle')}
    ${badge(6, 820, 486)}${note(6, 845, 470, ['Semak penanda &', 'putuskan klasifikasi'])}
    ${badge(7, 380, 486)}${note(7, 355, 470, ['Sijil QR & rekod', 'awam melalui API'], 'end')}
    ${badge(8, 880, 565)}${note(8, 800, 540, ['Kutipan diselesaikan', 'ke akaun LPF (T+1)'], 'end')}
    ${badge(9, 600, 486)}${note(9, 578, 508, ['Papan pemuka', '& jejak audit'], 'end')}
  </svg>`;
  return `<section class="mechsec" id="mekanik" data-pin="${pin || ''}">
    <div class="mech-h"><div><span class="eyebrow">Mekanik penyelesaian</span><h2>Mekanik penyelesaian TAPIS</h2><p>Sembilan langkah yang menghubungkan pengedar, LPF, KDN, sistem pembayaran dan orang awam melalui satu platform. ${pin ? 'Klik langkah sekali lagi untuk menyambung animasi.' : 'Klik nombor untuk memberi tumpuan pada satu langkah.'}</p></div>
      <div class="mech-logos">${TAPIS_MARK(34)}<b>TAPIS</b><span class="lsep"></span><img src="${LOGO_DARK}" alt="Logo LPF"></div></div>
    <div class="mech-svg">${svg}</div>
    <ol class="mech-list">${MECH_STEPS.map(([t, d], i) => `<li class="${cls(i + 1)}" ${sty(i + 1)}><button data-act="mechpin" data-n="${i + 1}"><span class="mnum">${i + 1}</span><span><b>${t}</b><small>${d}</small></span></button></li>`).join('')}</ol>
  </section>`;
}
