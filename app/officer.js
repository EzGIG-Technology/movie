// ---------- shared case helpers ----------
const ACTIVE_ST = ['Diserahkan', 'Pra-saringan AI', 'Menunggu Semakan', 'Rujuk Panel', 'Pindaan Diminta', 'Rayuan'];
function isActive(f) { return ACTIVE_ST.includes(f.status); }
function myTasks() { return S.films.filter(f => f.assignee === OFFICER && ['Menunggu Semakan', 'Rujuk Panel', 'Rayuan', 'Pra-saringan AI'].includes(f.status)).sort((a, b) => daysLeft(a) - daysLeft(b)); }
function slaChip(f) {
  if (!isActive(f)) return '';
  if (['Pindaan Diminta', 'Rayuan', 'Rujuk Panel'].includes(f.status)) return `<span class="chip sla-p">${I.clock}SLA dijeda</span>`;
  const d = daysLeft(f); const cls = d < 0 ? 'sla-bad' : d <= 1 ? 'sla-warn' : 'sla-ok';
  return `<span class="chip ${cls}">${I.clock}${d < 0 ? `Lewat ${-d} hari` : d === 0 ? 'Akhir hari ini' : d === 1 ? 'Esok' : `${d} hari lagi`}</span>`;
}
function asg(n) { return n ? `<span class="asg"><span class="av2">${initials(n)}</span>${esc(n)}</span>` : '<span class="chip st-Menunggu">Belum ditugaskan</span>'; }
function kindChip(f) {
  if (!f.decision) return '';
  const k = f.decision.kind; return k === 'tolak' ? '<span class="chip st-Ditolak">Ditolak</span>' : k === 'potong' ? `<span class="chip st-Pindaan">Lulus · ${f.decision.cuts.length} potongan</span>` : '<span class="chip st-Diluluskan">Lulus penuh</span>';
}
function resultCell(f) { return f.decision ? (f.decision.kind === 'tolak' ? '<span class="rej-b">TIDAK<br>LULUS</span>' : badge(f.decision.rating, 30, true)) : '<span class="muted">—</span>'; }
function stChipX(f) {
  if (f.status === 'Pra-saringan AI') return `<span class="chip st-Pra-saringan">${f.ai.running ? '<span class="spin"></span>' : ''}${f.ai.running ? `AI <span data-progtxt="${f.id}">${Math.round(f.ai.progress)}</span>%` : f.ai.queued ? `Giliran GPU #${f.ai.queued}` : 'Pra-saringan AI'}</span>`;
  if (f.status === 'Menunggu Semakan' && f.resubmitted) return '<span class="chip st-Menunggu"><span class="dot"></span>Versi disunting</span>';
  return stChip(f.status);
}
function timelineOf(f) {
  const ev = []; const s = f.submitted; const add = (at, t, d, who, fut) => ev.push({ at, t, d, who, fut: fut || new Date(at) > new Date() });
  add(s, f.status === 'Draf' ? 'Draf dicipta' : 'Serahan dihantar', `${f.type} · ${f.min} minit · ${f.platform}`, f.dist);
  if (f.status === 'Draf') return ev;
  if (f.status === 'Menunggu Bayaran') { add(s, 'Menunggu bayaran', `Invois ${rm(fee(f))} dikeluarkan`, 'Sistem'); return ev; }
  add(addDays(s, 0.003), 'Bayaran diterima', `${rm(fee(f))} melalui FPX · resit ${receiptNo(f)}`, 'Sistem');
  add(addDays(s, 0.02), 'Fail disahkan & disulitkan', 'Checksum SHA-256 · AES-256 · tera air forensik', 'Sistem');
  if (f.ai.done) add(addDays(s, 0.12), 'Pra-saringan AI selesai', `Cadangan ${f.ai.rating} · ${f.ai.flags.length} penanda · keyakinan ${Math.round(f.ai.conf * 100)}%`, 'Otak AI KDN');
  else if (f.status === 'Pra-saringan AI') add(addDays(s, 0.01), 'Dalam pra-saringan AI', f.ai.queued ? `Giliran pemprosesan #${f.ai.queued}` : 'Sedang dianalisis', 'Otak AI KDN');
  if (f.assignee) add(addDays(s, 0.16), 'Ditugaskan', `Kepada ${f.assignee}`, 'Pengurusan LPF');
  if (f.panel) { add(addDays(s, 1.2), 'Dirujuk kepada panel', `${f.panel.name}: ${f.panel.reason}`, f.panel.by); add(f.panel.at, `Sesi ${f.panel.name}`, 'Tontonan bersama dan keputusan panel', 'LPF'); }
  if (f.request) { add(f.request.at, 'Pindaan diminta', `${f.request.cuts.length} potongan untuk kelulusan ${f.request.rating}`, f.request.by); if (!f.resubmitted && f.status === 'Pindaan Diminta') add(f.request.due, 'Tarikh akhir versi disunting', 'Serahan ditutup jika tiada respons', 'Sistem'); }
  if (f.resubmittedAt) add(f.resubmittedAt, 'Versi disunting diterima', 'Sedia untuk pengesahan potongan', f.dist);
  if (f.decision) {
    const d = f.decision;
    if (d.kind === 'tolak') add(d.at, 'Tidak diluluskan', `Kod ${d.code}: ${(REJECT.find(r => r[0] === d.code) || ['', ''])[1]}`, d.by);
    else { add(d.at, `Diluluskan · ${d.rating}`, d.kind === 'potong' ? `Dengan ${d.cuts.length} potongan` : 'Tanpa potongan', d.by); add(addDays(d.at, 0.001), 'Sijil digital dijana', f.cert, 'Sistem'); }
  }
  if (f.appeal) { add(f.appeal.at, 'Rayuan difailkan', f.appeal.grounds, f.dist); add(f.appeal.hearing, 'Pendengaran Jawatankuasa Rayuan', f.appeal.status, 'LPF'); }
  return ev.sort((a, b) => new Date(a.at) - new Date(b.at));
}
function receiptNo(f) { return 'RS' + f.id.slice(-4) + String(hashStr(f.id) % 9000 + 1000); }
function timelineHTML(f) {
  return `<ol class="tl2">${timelineOf(f).map(e => `<li class="${e.fut ? 'fut' : ''}"><span class="d"></span><div><b>${esc(e.t)}</b><small>${fmtDate(e.at)} · ${fmtTime(e.at)} · ${esc(e.who)}${e.fut ? ' · dijadualkan' : ''}</small>${e.d ? `<p>${esc(e.d)}</p>` : ''}</div></li>`).join('')}</ol>`;
}
function cutsHTML(cuts) { return `<ol class="cuts">${cuts.map((c, i) => `<li><span class="cn">${i + 1}</span><span class="mono tnum">${tc(c.s)}–${tc(c.e)}</span><span>${esc(c.d)}</span></li>`).join('')}</ol>`; }

// record modal (officer / management)
function recordModal(id) {
  const f = film(id); const d = f.decision;
  const head = d ? (d.kind === 'tolak' ? `<div class="banner bad">${I.x}<span><b>Tidak diluluskan</b> · Kod ${d.code}: ${esc((REJECT.find(r => r[0] === d.code) || ['', ''])[1])}<br>${esc(d.reason)}</span></div>`
    : `<div style="display:flex;gap:14px;align-items:center">${badge(d.rating, 64)}<div><b style="font-size:16px">Diluluskan sebagai ${d.rating}</b>${d.kind === 'potong' ? ' <span class="chip st-Pindaan">dengan potongan</span>' : ''}<div class="muted" style="font-size:13px">${RATING_DESC[d.rating]}</div><div style="font-size:13px;margin-top:3px">Nasihat pengguna: <b>${d.advice && d.advice.length ? d.advice.join(', ') : 'Tiada'}</b></div></div></div>`) : `<div class="banner i">${I.clock}<span>Kes masih aktif: <b>${f.status}</b>.</span></div>`;
  openModal(`${esc(f.title)} <span class="muted" style="font-weight:500;font-size:13px">· ${f.id}</span>`, `<div class="rec">
    <div class="rec-l">${poster(f).replace('class="ph-img "', 'class="ph-img " style="aspect-ratio:2/3;border-radius:14px"')}
      <div class="sum" style="margin-top:14px;font-size:13px"><span class="muted">Pemohon</span><b>${esc(f.dist)}</b><span class="muted">Jenis</span><b>${f.type} · ${f.genre}</b><span class="muted">Bahasa</span><b>${f.lang}</b><span class="muted">Durasi</span><b>${f.min} minit</b><span class="muted">Platform</span><b>${f.platform}${f.selfRating ? ` · kendiri ${f.selfRating}` : ''}</b><span class="muted">Laluan</span><b>${f.express ? 'Ekspres' : 'Biasa'}</b><span class="muted">Pegawai</span><b>${esc(f.assignee || (d && d.by) || '—')}</b></div></div>
    <div class="rec-r">${head}
      ${d && d.kind === 'potong' && d.cuts.length ? `<div><div class="lbl" style="margin-bottom:8px">Potongan yang diwajibkan</div>${cutsHTML(d.cuts)}</div>` : ''}
      ${f.request && f.status !== 'Diluluskan' ? `<div><div class="lbl" style="margin-bottom:8px">Pindaan diminta (untuk ${f.request.rating})</div>${cutsHTML(f.request.cuts)}</div>` : ''}
      ${f.ai.done ? `<div class="aisum"><div style="display:flex;gap:12px;align-items:center">${badge(f.ai.rating, 40, true)}<div><b>Cadangan AI: ${f.ai.rating}</b><div class="muted" style="font-size:12.5px">${f.ai.flags.length} penanda · keyakinan ${Math.round(f.ai.conf * 100)}%${d && d.kind !== 'tolak' ? ` · ${d.agreed ? 'selari dengan keputusan' : 'dipinda oleh pegawai'}` : ''}</div></div></div>
        <div class="mini8">${CATS.map(c => { const v = f.ai.scores[c.k] || 0; return `<span title="${c.n}: ${v}"><i style="height:${Math.max(4, v)}%;background:${c.c}"></i><small>${CAT_SHORT[c.k]}</small></span>`; }).join('')}</div></div>` : ''}
      <div><div class="lbl" style="margin-bottom:8px">Jejak kes</div>${timelineHTML(f)}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">${f.cert && d && d.kind !== 'tolak' ? `<button class="btn btn-pri" data-act="cert" data-id="${f.id}">${I.doc}Lihat sijil</button>` : ''}${isActive(f) && role().mods.includes('pegawai') ? `<button class="btn" data-act="openfilm" data-id="${f.id}">${I.screen}Buka dalam stesen kerja</button>` : ''}</div>
    </div></div>`);
}

// ---------- officer portal ----------
const OFILT = [
  ['aktif', 'Semua aktif', f => isActive(f)],
  ['saya', 'Tugasan saya', f => f.assignee === OFFICER && isActive(f)],
  ['baru', 'Belum ditugaskan', f => f.status === 'Menunggu Semakan' && !f.assignee],
  ['ai', 'Diserahkan & AI', f => ['Diserahkan', 'Pra-saringan AI'].includes(f.status)],
  ['semakan', 'Menunggu semakan', f => f.status === 'Menunggu Semakan'],
  ['lewat', 'Lewat SLA', f => f.status === 'Menunggu Semakan' && daysLeft(f) < 0],
  ['panel', 'Rujuk panel', f => f.status === 'Rujuk Panel'],
  ['pindaan', 'Pindaan diminta', f => f.status === 'Pindaan Diminta'],
  ['rayuan', 'Rayuan', f => f.status === 'Rayuan'],
];
const OTABS = [['tugasan', 'Papan kerja'], ['gilir', 'Baris gilir'], ['semak', 'Semakan filem'], ['arkib', 'Arkib keputusan']];
function otabsHTML() {
  const n = { tugasan: myTasks().length, gilir: S.films.filter(isActive).length, arkib: S.films.filter(f => DONE_ST.includes(f.status)).length };
  return `<div class="seg-l" role="tablist">${OTABS.map(([k, t]) => `<button role="tab" class="${ui.otab === k ? 'on' : ''}" data-act="otab" data-v="${k}">${t}${n[k] ? `<span class="tc">${n[k]}</span>` : ''}</button>`).join('')}</div>`;
}
function viewPegawai() {
  if (ui.otab === 'semak') return studioView();
  if (ui.otab === 'gilir') return oQueue();
  if (ui.otab === 'arkib') return oArchive();
  return oBoard();
}
function caseRow(f, opts = {}) {
  const act = caseAction(f);
  return `<div class="crow">${stillThumb(f)}<div class="cm"><div class="ct"><b>${esc(f.title)}</b>${f.express ? `<span class="chip tag-x">${I.bolt}Ekspres</span>` : ''}${f.selfRating ? '<span class="chip st-Rujuk">Audit OTT</span>' : ''}</div>
    <div class="cs">${f.id} · ${esc(f.dist)} · ${f.min} min · ${f.platform}</div>
    <div class="cc">${stChipX(f)}${slaChip(f)}${f.ai.done ? `<span class="chip">${f.ai.flags.filter(x => x.v).length}/${f.ai.flags.length} penanda disemak</span>` : ''}${opts.asg ? asg(f.assignee) : ''}</div></div>
    <div class="cr">${f.ai.done ? `<span class="aib">${badge(f.ai.rating, 34, true)}<small>AI</small></span>` : ''}${act}</div></div>`;
}
function caseAction(f) {
  if (f.status === 'Menunggu Semakan' && !f.assignee) return `<button class="btn btn-sm" data-act="take" data-id="${f.id}">Ambil tugasan</button>`;
  if (f.assignee === OFFICER && ['Menunggu Semakan', 'Rujuk Panel', 'Rayuan', 'Pra-saringan AI'].includes(f.status)) return `<button class="btn btn-sm btn-pri" data-act="openfilm" data-id="${f.id}">${f.status === 'Pra-saringan AI' ? 'Buka' : 'Semak'} ${I.arrow}</button>`;
  return `<button class="btn btn-sm" data-act="rec" data-id="${f.id}">Lihat</button>`;
}
function oBoard() {
  const mine = myTasks(); const late = mine.filter(f => f.status === 'Menunggu Semakan' && daysLeft(f) < 0);
  const today = mine.filter(f => f.status === 'Menunggu Semakan' && daysLeft(f) >= 0 && daysLeft(f) <= 1);
  const myDec = S.films.filter(f => f.decision && f.decision.by === OFFICER).sort((a, b) => new Date(b.decision.at) - new Date(a.decision.at));
  const agreeD = myDec.filter(f => f.decision.kind !== 'tolak'); const agreeN = agreeD.filter(f => f.decision.agreed).length;
  const un = S.films.filter(f => f.status === 'Menunggu Semakan' && !f.assignee);
  const sched = [];
  S.films.forEach(f => { if (f.panel && f.status === 'Rujuk Panel') sched.push([f.panel.at, `Sesi ${f.panel.name}`, f]); if (f.appeal && f.status === 'Rayuan') sched.push([f.appeal.hearing, 'Jawatankuasa Rayuan', f]); if (f.assignee === OFFICER && f.status === 'Menunggu Semakan') sched.push([dueOf(f), 'Tarikh akhir SLA', f]); });
  sched.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  return `<div class="kpis">
    <div class="card kpi"><div class="top"><small>Tugasan aktif saya</small><span class="ki">${I.layers}</span></div><b class="tnum">${mine.length}</b><span class="dl">${mine.filter(f => f.express).length} ekspres</span></div>
    <div class="card kpi ${late.length ? 'kbad' : ''}"><div class="top"><small>Lewat SLA</small><span class="ki">${I.clock}</span></div><b class="tnum">${late.length}</b><span class="dl">${late.length ? esc(late[0].title) : 'Tiada'}</span></div>
    <div class="card kpi"><div class="top"><small>Keputusan perlu dalam 24 jam</small><span class="ki">${I.bolt}</span></div><b class="tnum">${today.length}</b><span class="dl">${today.map(f => esc(f.title)).join(', ') || 'Tiada'}</span></div>
    <div class="card kpi"><div class="top"><small>Diputuskan bulan ini</small><span class="ki">${I.cert}</span></div><b class="tnum">${19 + myDec.length}</b><span class="dl">Purata 2.4 hari setiap kes</span></div>
    <div class="card kpi"><div class="top"><small>Selari dengan AI</small><span class="ki">${I.ai}</span></div><b class="tnum">${Math.round((17 + agreeN) / (19 + agreeD.length) * 100)}%</b><span class="dl">${17 + agreeN} daripada ${19 + agreeD.length} kelulusan bulan ini</span></div>
  </div>
  <div class="dgrid" style="margin-top:16px">
    <div class="card span-8"><div class="card-h"><h2>${I.layers}Tugasan saya</h2><span class="muted" style="font-size:12.5px">Disusun mengikut tarikh akhir SLA</span></div><div class="card-b clist">${mine.length ? mine.map(f => caseRow(f)).join('') : '<div class="empty">Tiada tugasan aktif. Ambil kes daripada baris gilir.</div>'}</div></div>
    <div class="col4 span-4">
      <div class="card"><div class="card-h"><h2>${I.clock}Jadual</h2></div><div class="card-b"><ul class="sched">${sched.slice(0, 6).map(([at, t, f]) => { const dd = new Date(at); return `<li><span class="dt"><b>${dd.getDate()}</b><small>${MONTHS[dd.getMonth()]}</small></span><span><b>${t}</b><small>${esc(f.title)}${t === 'Tarikh akhir SLA' ? ` · ${slaChip(f).replace(/<[^>]+>/g, '')}` : ''}</small></span></li>`; }).join('')}</ul></div></div>
      <div class="card"><div class="card-h"><h2>Belum ditugaskan</h2><span class="chip">${un.length}</span></div><div class="card-b" style="display:flex;flex-direction:column;gap:10px">${un.length ? un.map(f => `<div class="mini-row">${stillThumb(f)}<span style="flex:1;min-width:0"><b>${esc(f.title)}</b><small>${esc(f.dist)} · ${f.ai.done ? 'AI ' + f.ai.rating : ''}</small></span><button class="btn btn-sm" data-act="take" data-id="${f.id}">Ambil</button></div>`).join('') : '<span class="muted">Semua kes telah ditugaskan.</span>'}</div></div>
    </div>
    <div class="card span-7"><div class="card-h"><h2>${I.cert}Keputusan terkini saya</h2><button class="btn btn-sm btn-ghost" data-act="otab" data-v="arkib">Lihat arkib →</button></div><div class="tbl-box" style="margin-top:8px"><table class="tbl"><thead><tr><th>Filem</th><th>Keputusan</th><th>AI</th><th>Tarikh</th></tr></thead><tbody>
      ${myDec.slice(0, 5).map(f => `<tr class="click" data-act="rec" data-id="${f.id}"><td><b>${esc(f.title)}</b><span class="sub">${f.id} · ${esc(f.dist)}</span></td><td><span style="display:flex;gap:8px;align-items:center">${resultCell(f)}${kindChip(f)}</span></td><td>${badge(f.ai.rating, 26, true)}</td><td class="tnum">${fmtDate(f.decision.at)}</td></tr>`).join('') || '<tr><td colspan="4" class="muted">Belum ada keputusan.</td></tr>'}</tbody></table></div></div>
    <div class="card span-5"><div class="card-h"><h2>Aktiviti pasukan</h2></div><div class="card-b"><ul class="log">${S.log.slice(0, 7).map(l => `<li><span class="lic" style="background:var(--sky);color:var(--teal)">${l.who === 'Sistem' ? I.brain : I.user}</span><time>${fmtDate(l.at).replace(/ \d{4}$/, '')} · ${fmtTime(l.at)}</time><span><b>${esc(l.who)}</b> · ${esc(l.what)}</span></li>`).join('')}</ul></div></div>
  </div>`;
}
function oQueue() {
  const fk = ui.ofilt || 'aktif'; const fn = OFILT.find(x => x[0] === fk)[2]; const q = (ui.oq || '').toLowerCase();
  const list = S.films.filter(fn).filter(f => !q || (f.title + f.id + f.dist).toLowerCase().includes(q)).sort((a, b) => (b.express - a.express) || (new Date(a.submitted) - new Date(b.submitted)));
  return `<div class="card"><div class="card-h" style="padding-bottom:4px"><div class="fchips">${OFILT.map(([k, t, ff]) => `<button class="fchip ${fk === k ? 'on' : ''}" data-act="ofilt" data-v="${k}">${t}<span>${S.films.filter(ff).length}</span></button>`).join('')}</div>
    <label class="tsearch">${I.search}<input id="oq" data-oq="1" placeholder="Cari tajuk, rujukan, pemohon…" value="${esc(ui.oq || '')}"></label></div>
    <div class="tbl-box" style="margin-top:8px"><table class="tbl qtbl"><thead><tr><th>Filem</th><th>Pemohon</th><th>Diterima</th><th>SLA</th><th>AI</th><th>Pegawai</th><th>Status</th><th></th></tr></thead><tbody>
    ${list.map(f => `<tr><td><span class="fcell">${stillThumb(f)}<span><b>${esc(f.title)}</b>${f.express ? ` <span class="chip tag-x" style="padding:0 7px">${I.bolt}</span>` : ''}<span class="sub">${f.id} · ${f.type} · ${f.min} min · ${f.platform}</span></span></span></td>
      <td style="max-width:180px">${esc(f.dist)}</td><td class="tnum" style="white-space:nowrap">${fmtDate(f.submitted)}</td><td>${slaChip(f) || '<span class="muted">—</span>'}</td>
      <td>${f.ai.done ? badge(f.ai.rating, 28, true) : '<span class="muted">—</span>'}${f.selfRating ? `<span class="sub">kendiri ${f.selfRating}</span>` : ''}</td><td>${asg(f.assignee)}</td><td>${stChipX(f)}</td><td style="text-align:right">${caseAction(f)}</td></tr>`).join('') || `<tr><td colspan="8"><div class="empty">Tiada kes dalam kategori ini.</div></td></tr>`}
    </tbody></table></div></div>`;
}
const AFILT = [['semua', 'Semua', () => true], ['lulus', 'Lulus penuh', f => f.decision.kind === 'lulus'], ['potong', 'Lulus dengan potongan', f => f.decision.kind === 'potong'], ['tolak', 'Tidak diluluskan', f => f.decision.kind === 'tolak'], ['saya', 'Oleh saya', f => f.decision.by === OFFICER], ['pinda', 'Dipinda daripada AI', f => f.decision.kind !== 'tolak' && !f.decision.agreed]];
function oArchive() {
  const all = S.films.filter(f => DONE_ST.includes(f.status) && f.decision);
  const fk = ui.afilt || 'semua'; const fn = AFILT.find(x => x[0] === fk)[2]; const q = (ui.oq || '').toLowerCase();
  const list = all.filter(fn).filter(f => !q || (f.title + f.id + f.dist + (f.cert || '')).toLowerCase().includes(q)).sort((a, b) => new Date(b.decision.at) - new Date(a.decision.at));
  return `<div class="kpis" style="margin-bottom:16px">${[['Diluluskan', all.filter(f => f.decision.kind === 'lulus').length, 'st-Diluluskan'], ['Dengan potongan', all.filter(f => f.decision.kind === 'potong').length, 'st-Pindaan'], ['Tidak diluluskan', all.filter(f => f.decision.kind === 'tolak').length, 'st-Ditolak'], ['Dipinda daripada AI', all.filter(f => f.decision.kind !== 'tolak' && !f.decision.agreed).length, 'st-Rujuk']].map(([t, n, c]) => `<div class="card kpi"><div class="top"><small>${t}</small><span class="chip ${c}" style="padding:0 8px"><span class="dot"></span></span></div><b class="tnum">${n}</b><span class="dl">Dalam rekod demo</span></div>`).join('')}</div>
  <div class="card"><div class="card-h" style="padding-bottom:4px"><div class="fchips">${AFILT.map(([k, t, ff]) => `<button class="fchip ${fk === k ? 'on' : ''}" data-act="afilt" data-v="${k}">${t}<span>${all.filter(ff).length}</span></button>`).join('')}</div>
    <label class="tsearch">${I.search}<input id="oq" data-oq="1" placeholder="Cari tajuk, rujukan, no. sijil…" value="${esc(ui.oq || '')}"></label></div>
    <div class="tbl-box" style="margin-top:8px"><table class="tbl qtbl"><thead><tr><th>Filem</th><th>Pemohon</th><th>Keputusan</th><th>AI</th><th>Selari</th><th>Pegawai</th><th>Tarikh</th><th>No. sijil</th></tr></thead><tbody>
    ${list.map(f => `<tr class="click" data-act="rec" data-id="${f.id}"><td><span class="fcell">${poster(f, 'pthumb')}<span><b>${esc(f.title)}</b><span class="sub">${f.id} · ${f.type} · ${f.platform}</span></span></span></td><td style="max-width:170px">${esc(f.dist)}</td>
      <td><span style="display:flex;gap:8px;align-items:center">${resultCell(f)}${kindChip(f)}</span></td><td>${badge(f.ai.rating, 26, true)}</td>
      <td>${f.decision.kind === 'tolak' ? '<span class="muted">—</span>' : f.decision.agreed ? `<span class="okc">${I.check}</span>` : '<span class="chip st-Rujuk">Dipinda</span>'}</td><td>${asg(f.decision.by)}</td><td class="tnum" style="white-space:nowrap">${fmtDate(f.decision.at)}</td><td class="mono" style="font-size:12px;white-space:nowrap">${f.decision.kind === 'tolak' ? '—' : f.cert}</td></tr>`).join('') || '<tr><td colspan="8"><div class="empty">Tiada rekod.</div></td></tr>'}
    </tbody></table></div></div>`;
}

// decision panel for the studio
const DKINDS = [['lulus', 'Lulus'], ['potong', 'Lulus dengan potongan'], ['tolak', 'Tidak lulus'], ['panel', 'Rujuk panel']];
function decCardHTML(f, fl) {
  const d = ui.dec[f.id]; const highPend = fl.filter(x => x.sev === 'Tinggi' && !x.v).length;
  const who = f.status === 'Rujuk Panel' ? 'Keputusan panel' : f.status === 'Rayuan' ? 'Keputusan Jawatankuasa Rayuan' : 'Keputusan pegawai';
  if (f.status === 'Pindaan Diminta') return `<div class="card"><div class="card-h"><h2>${who}</h2><span class="chip st-Pindaan">Pindaan diminta</span></div><div class="card-b" style="display:flex;flex-direction:column;gap:12px">
    <p style="margin:0">Menunggu versi disunting daripada <b>${esc(f.dist)}</b> sebelum ${fmtDate(f.request.due)}. Tiada tindakan diperlukan sehingga versi baharu diterima.</p>${cutsHTML(f.request.cuts)}</div></div>`;
  const kinds = DKINDS.filter(k => !(k[0] === 'panel' && ['Rujuk Panel', 'Rayuan'].includes(f.status)));
  const cutSel = fl.filter(x => d.cuts.includes(x.id));
  let body = '';
  if (d.kind === 'lulus' || d.kind === 'potong') body = `
    <div><div class="lbl" style="margin-bottom:9px">Klasifikasi</div><div class="rpills">${RATINGS.map(r => `<button class="rpill" data-act="pick" data-r="${r}" aria-pressed="${d.rating === r}">${badge(r, 34, true)}<span>${r === f.ai.rating ? 'AI' : '&nbsp;'}</span></button>`).join('')}</div></div>
    ${d.rating !== f.ai.rating ? `<div class="field"><label for="reason">Alasan pindaan daripada cadangan AI (wajib)</label><textarea class="inp" id="reason" data-bind="reason" placeholder="Contoh: Adegan tembakan pada 01:28:40 lebih grafik daripada dinilai AI">${esc(d.reason)}</textarea></div>` : ''}
    ${d.kind === 'potong' ? (f.resubmitted ? `<div><div class="lbl" style="margin-bottom:8px">Sahkan potongan dalam versi disunting</div>${f.request.cuts.map((c, i) => `<label class="ck" style="width:100%;margin-bottom:6px"><input type="checkbox" data-cutok="${i}" ${d.cutok && d.cutok[i] ? 'checked' : ''}>${i + 1}. ${tc(c.s)} · ${esc(c.d)}</label>`).join('')}</div>`
      : `<div><div class="lbl" style="margin-bottom:8px">Potongan diwajibkan (${cutSel.length})</div>${cutSel.length ? cutsHTML(cutSel.map(x => ({ s: x.s, e: x.e, d: x.d }))) : '<div class="banner w">' + I.shield + '<span>Pilih adegan dengan butang <b>Potong</b> dalam jadual penanda AI.</span></div>'}<p class="muted" style="font-size:12px;margin:8px 0 0">Pengedar akan diminta menghantar versi disunting dalam 14 hari. Sijil dijana selepas potongan disahkan.</p></div>`) : ''}
    <div><div class="lbl" style="margin-bottom:9px">Nasihat pengguna</div><div class="cks">${CATS.map(c => `<label class="ck"><input type="checkbox" data-adv="${c.adv}" ${d.advice.includes(c.adv) ? 'checked' : ''}>${c.adv}</label>`).join('')}</div>
      <div style="font-size:12.5px;color:var(--ink3);margin-top:9px">Dipaparkan kepada umum: <b id="advPrev" style="color:var(--ink)">${d.advice.length ? d.advice.join(', ') : 'Tiada'}</b></div></div>`;
  if (d.kind === 'tolak') body = `<div class="field"><label for="dcode">Asas penolakan (garis panduan, contoh)</label><select class="inp" id="dcode" data-dsel="code">${REJECT.map(r => `<option value="${r[0]}" ${d.code === r[0] ? 'selected' : ''}>Kod ${r[0]} · ${r[1]}</option>`).join('')}</select></div>
    <div class="field"><label for="why">Justifikasi kepada pemohon (wajib)</label><textarea class="inp" id="why" data-bind="why" placeholder="Nyatakan adegan dan sebab potongan tidak memadai">${esc(d.why)}</textarea></div>
    <div class="banner w">${I.shield}<span>Pemohon boleh memfailkan rayuan dalam tempoh 30 hari selepas keputusan.</span></div>`;
  if (d.kind === 'panel') body = `<div class="field"><label for="dpanel">Panel</label><select class="inp" id="dpanel" data-dsel="panel">${PANELS.map(p => `<option ${d.panel === p ? 'selected' : ''}>${p}</option>`).join('')}</select></div>
    <div class="field"><label for="pwhy">Sebab rujukan (wajib)</label><textarea class="inp" id="pwhy" data-bind="pwhy" placeholder="Contoh: Unsur ritual keagamaan memerlukan pandangan panel">${esc(d.pwhy)}</textarea></div>
    <p class="muted" style="margin:0;font-size:12.5px">Sesi panel dijadualkan secara automatik dalam 3 hari bekerja. SLA dijeda sehingga keputusan panel.</p>`;
  const label = { lulus: `${I.check}Luluskan sebagai ${d.rating}`, potong: f.resubmitted ? `${I.check}Sahkan potongan & luluskan ${d.rating}` : `Hantar permintaan potongan`, tolak: `${I.x}Sahkan tidak lulus`, panel: 'Rujuk kepada panel' }[d.kind];
  return `<div class="card"><div class="card-h"><h2>${g(11)}${who}</h2>${f.status === 'Rujuk Panel' ? `<span class="chip st-Rujuk">${f.panel ? f.panel.name : 'Panel'}</span>` : f.status === 'Rayuan' ? '<span class="chip st-Rayuan">Rayuan</span>' : ''}</div><div class="card-b" style="display:flex;flex-direction:column;gap:16px">
    <div class="dkinds" role="tablist">${kinds.map(([k, t]) => `<button role="tab" class="${d.kind === k ? 'on' : ''} dk-${k}" data-act="dkind" data-v="${k}">${t}</button>`).join('')}</div>
    ${body}
    <div class="field"><label for="note">Catatan dalaman (pilihan)</label><textarea class="inp" id="note" data-bind="note" style="min-height:56px">${esc(d.note)}</textarea></div>
    ${highPend && d.kind !== 'panel' ? `<div class="banner w">${I.shield}<span>${highPend} penanda tahap <b>Tinggi</b> belum disemak.</span></div>` : ''}
    ${ui.decErr ? `<div class="err" role="alert">${ui.decErr}</div>` : ''}
    <button class="btn ${d.kind === 'tolak' ? 'btn-bad' : 'btn-pri'} btn-lg" data-act="decide" style="width:100%">${label}</button>
  </div></div>`;
}
function studioBar(f) {
  const mine = myTasks().filter(x => x.id !== (f && f.id)).slice(0, 5);
  return `<div class="card full sbar"><button class="btn btn-sm" data-act="otab" data-v="gilir">${I.prev}Baris gilir</button><span class="muted" style="font-size:12.5px;font-weight:600">Tugasan saya seterusnya:</span>
    ${mine.map(x => `<button class="sbt" data-act="openfilm" data-id="${x.id}">${stillThumb(x)}<span><b>${esc(x.title)}</b>${slaChip(x)}</span></button>`).join('') || '<span class="muted">Tiada</span>'}</div>`;
}
