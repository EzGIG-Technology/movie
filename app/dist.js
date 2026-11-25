// ---------- distributor portal ----------
const DTAB_T = { ringkasan: 'Ringkasan syarikat', serahan: 'Serahan saya', baru: 'Serahan baharu', sijil: 'Sijil klasifikasi', bayaran: 'Invois & bayaran', profil: 'Profil syarikat' };
function myFilms() { return S.films.filter(f => f.dist === DIST); }
function needsAction(f) { return ['Draf', 'Menunggu Bayaran', 'Pindaan Diminta'].includes(f.status) || (f.status === 'Ditolak' && !f.appeal); }
function dtabsHTML() {
  const m = myFilms(); const n = { ringkasan: m.filter(needsAction).length, serahan: m.length, sijil: m.filter(f => f.status === 'Diluluskan').length };
  return `<div class="seg-l" role="tablist">${Object.entries(DTAB_T).map(([k, t]) => `<button role="tab" class="${ui.dtab === k ? 'on' : ''}" data-act="dtab" data-v="${k}">${k === 'baru' ? '+ ' : ''}${t.replace(' syarikat', '').replace(' klasifikasi', '')}${n[k] ? `<span class="tc">${n[k]}</span>` : ''}</button>`).join('')}</div>`;
}
const DST = { 'Draf': ['Draf', 'st-Draf'], 'Menunggu Bayaran': ['Menunggu bayaran', 'st-Menunggu'], 'Diserahkan': ['Diterima', 'st-Diserahkan'], 'Pra-saringan AI': ['Dalam semakan', 'st-Pra-saringan'], 'Menunggu Semakan': ['Dalam semakan', 'st-Pra-saringan'], 'Rujuk Panel': ['Semakan panel', 'st-Rujuk'], 'Pindaan Diminta': ['Pindaan diminta', 'st-Pindaan'], 'Rayuan': ['Rayuan', 'st-Rayuan'], 'Diluluskan': ['Diluluskan', 'st-Diluluskan'], 'Ditolak': ['Tidak diluluskan', 'st-Ditolak'] };
function dChip(f) { const [t, c] = DST[f.status]; return `<span class="chip ${c}"><span class="dot"></span>${f.resubmitted && f.status === 'Menunggu Semakan' ? 'Versi disunting disemak' : t}</span>`; }
function dStage(f) { return { 'Draf': 0, 'Menunggu Bayaran': 0, 'Diserahkan': 1, 'Pra-saringan AI': 2, 'Menunggu Semakan': 2, 'Rujuk Panel': 3, 'Pindaan Diminta': 3, 'Rayuan': 3, 'Diluluskan': 5, 'Ditolak': 4 }[f.status]; }
function dAction(f) {
  if (f.status === 'Draf') return `<button class="btn btn-sm btn-pri" data-act="ddraft" data-id="${f.id}">Sambung draf</button>`;
  if (f.status === 'Menunggu Bayaran') return `<button class="btn btn-sm btn-pri" data-act="dpay" data-id="${f.id}">${I.money}Bayar ${rm(fee(f))}</button>`;
  if (f.status === 'Pindaan Diminta') return `<button class="btn btn-sm btn-pri" data-act="dview" data-id="${f.id}">Lihat pindaan</button>`;
  if (f.status === 'Ditolak' && !f.appeal) return `<button class="btn btn-sm" data-act="dappeal" data-id="${f.id}">Failkan rayuan</button>`;
  if (f.status === 'Diluluskan') return `<button class="btn btn-sm" data-act="cert" data-id="${f.id}">${I.doc}Sijil</button>`;
  return `<button class="btn btn-sm btn-ghost" data-act="dview" data-id="${f.id}">Butiran</button>`;
}
function viewPengedar() {
  const t = ui.dtab;
  if (t === 'baru') return wizard();
  if (t === 'serahan') return dSubs();
  if (t === 'sijil') return dCerts();
  if (t === 'bayaran') return dPay();
  if (t === 'profil') return dProfile();
  return dHome();
}
function dTrack(f) {
  const st = dStage(f); const lbl = ['Serahan', 'Bayaran & muat naik', 'Semakan LPF', 'Keputusan', 'Sijil'];
  return `<div class="dtrack">${lbl.map((l, i) => `<span class="${i < st ? 'done' : i === st ? 'now' : ''}"><i></i><small>${l}</small></span>`).join('')}</div>`;
}
function dHome() {
  const m = myFilms(); const act = m.filter(needsAction); const live = m.filter(f => isActive(f));
  const paid = m.filter(f => !PRE_ST.includes(f.status)).reduce((s, f) => s + fee(f), 0) + 12460;
  const notes = m.flatMap(f => timelineOf(f).filter(e => !e.fut && e.who !== 'Otak AI KDN' && !/Ditugaskan/.test(e.t)).map(e => ({ ...e, f }))).sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 8);
  const actTxt = f => f.status === 'Draf' ? ['Lengkapkan draf serahan', 'Muat naik fail dan hantar untuk penapisan'] : f.status === 'Menunggu Bayaran' ? ['Bayaran belum diterima', `Invois ${rm(fee(f))} · serahan diproses selepas bayaran`] : f.status === 'Pindaan Diminta' ? [`LPF meminta ${f.request.cuts.length} potongan`, `Hantar versi disunting sebelum ${fmtDate(f.request.due)} untuk kelulusan ${f.request.rating}`] : ['Tidak diluluskan', `Rayuan boleh difailkan sebelum ${fmtDate(addDays(f.decision.at, 30))}`];
  return `<div class="kpis">
    <div class="card kpi"><div class="top"><small>Serahan aktif</small><span class="ki">${I.layers}</span></div><b class="tnum">${live.length}</b><span class="dl">Sedang diproses LPF</span></div>
    <div class="card kpi ${act.length ? 'kwarn' : ''}"><div class="top"><small>Perlu tindakan anda</small><span class="ki">${I.bolt}</span></div><b class="tnum">${act.length}</b><span class="dl">Draf, bayaran, pindaan, rayuan</span></div>
    <div class="card kpi"><div class="top"><small>Diluluskan 2026</small><span class="ki">${I.cert}</span></div><b class="tnum">${m.filter(f => f.status === 'Diluluskan').length + 9}</b><span class="dl">Sijil digital tersedia</span></div>
    <div class="card kpi"><div class="top"><small>Jumlah bayaran 2026</small><span class="ki">${I.money}</span></div><b class="tnum">${rm(paid)}</b><span class="dl">Lihat invois & resit</span></div>
    <div class="card kpi"><div class="top"><small>Purata masa keputusan</small><span class="ki">${I.clock}</span></div><b class="tnum">3.1 hari</b><span class="dl">Ekspres: dalam 48 jam</span></div>
  </div>
  <div class="dgrid" style="margin-top:16px">
    <div class="card span-7"><div class="card-h"><h2>${I.bolt}Perlu tindakan anda</h2></div><div class="card-b clist">${act.map(f => { const [a, b] = actTxt(f); return `<div class="crow">${poster(f, 'pthumb')}<div class="cm"><div class="ct"><b>${esc(f.title)}</b>${dChip(f)}</div><div class="cs"><b style="color:var(--ink)">${a}</b> · ${b}</div></div><div class="cr">${dAction(f)}</div></div>`; }).join('') || '<div class="empty">Tiada tindakan diperlukan.</div>'}</div></div>
    <div class="card span-5"><div class="card-h"><h2>Notifikasi</h2><span class="chip">E-mel & portal</span></div><div class="card-b"><ul class="log">${notes.map(n => `<li><span class="lic" style="background:var(--sky);color:var(--teal)">${I.msg}</span><time>${fmtDate(n.at).replace(/ \d{4}$/, '')} · ${fmtTime(n.at)}</time><span><b>${esc(n.f.title)}</b> · ${esc(n.t)}</span></li>`).join('')}</ul></div></div>
    <div class="card span-12"><div class="card-h"><h2>${I.layers}Status serahan aktif</h2><button class="btn btn-sm btn-ghost" data-act="dtab" data-v="serahan">Semua serahan →</button></div><div class="card-b dlive">${live.map(f => `<button class="dl-row" data-act="dview" data-id="${f.id}">${poster(f, 'pthumb')}<span class="dl-m"><b>${esc(f.title)}</b><small>${f.id} · diserahkan ${fmtDate(f.submitted)} · jangkaan keputusan ${['Pindaan Diminta', 'Rayuan', 'Rujuk Panel'].includes(f.status) ? 'selepas ' + (f.status === 'Rayuan' ? 'pendengaran' : f.status === 'Rujuk Panel' ? 'sesi panel' : 'versi disunting') : fmtDate(dueOf(f))}</small></span>${dTrack(f)}${dChip(f)}</button>`).join('') || '<div class="empty">Tiada serahan aktif.</div>'}</div></div>
  </div>`;
}
const DFILT = [['semua', 'Semua', () => true], ['draf', 'Draf & bayaran', f => PRE_ST.includes(f.status)], ['proses', 'Dalam semakan', f => ['Diserahkan', 'Pra-saringan AI', 'Menunggu Semakan', 'Rujuk Panel'].includes(f.status)], ['pindaan', 'Pindaan diminta', f => f.status === 'Pindaan Diminta'], ['rayuan', 'Rayuan', f => f.status === 'Rayuan'], ['lulus', 'Diluluskan', f => f.status === 'Diluluskan'], ['tolak', 'Tidak diluluskan', f => f.status === 'Ditolak']];
function dSubs() {
  const m = myFilms(); const fk = ui.dfilt || 'semua'; const fn = DFILT.find(x => x[0] === fk)[2];
  const list = m.filter(fn).sort((a, b) => new Date(b.submitted) - new Date(a.submitted));
  return `<div class="card"><div class="card-h" style="padding-bottom:4px"><div class="fchips">${DFILT.map(([k, t, ff]) => `<button class="fchip ${fk === k ? 'on' : ''}" data-act="dfilt" data-v="${k}">${t}<span>${m.filter(ff).length}</span></button>`).join('')}</div><button class="btn btn-pri btn-sm" data-act="dtab" data-v="baru">+ Serahan baharu</button></div>
  <div class="tbl-box" style="margin-top:8px"><table class="tbl qtbl"><thead><tr><th>Filem</th><th>Platform</th><th>Diserahkan</th><th>Jangkaan keputusan</th><th>Status</th><th>Klasifikasi</th><th></th></tr></thead><tbody>
  ${list.map(f => `<tr class="click" data-act="dview" data-id="${f.id}"><td><span class="fcell">${poster(f, 'pthumb')}<span><b>${esc(f.title)}</b><span class="sub">${f.id} · ${f.type} · ${f.min} min${f.express ? ' · Ekspres' : ''}</span></span></span></td><td>${f.platform}</td><td class="tnum" style="white-space:nowrap">${f.status === 'Draf' ? '—' : fmtDate(f.submitted)}</td>
    <td class="tnum" style="white-space:nowrap">${['Diserahkan', 'Pra-saringan AI', 'Menunggu Semakan'].includes(f.status) ? fmtDate(dueOf(f)) : f.decision ? `<span class="muted">Diputuskan ${fmtDate(f.decision.at)}</span>` : '<span class="muted">—</span>'}</td>
    <td>${dChip(f)}</td><td>${resultCell(f)}</td><td style="text-align:right" data-stop="1">${dAction(f)}</td></tr>`).join('') || '<tr><td colspan="7"><div class="empty">Tiada serahan.</div></td></tr>'}
  </tbody></table></div></div>`;
}
function dCerts() {
  const list = myFilms().filter(f => f.status === 'Diluluskan').sort((a, b) => new Date(b.decision.at) - new Date(a.decision.at));
  return `<div class="certgrid">${list.map(f => `<div class="card ccard">${poster(f, '', false)}<div class="cb"><div style="display:flex;gap:10px;align-items:center">${badge(f.decision.rating, 44, true)}<div style="min-width:0"><b>${esc(f.title)}</b><small class="mono">${f.cert}</small></div></div>
    <div class="sum" style="font-size:12.5px"><span class="muted">Diputuskan</span><b>${fmtDate(f.decision.at)}</b><span class="muted">Nasihat</span><b>${f.decision.advice.length ? f.decision.advice.join(', ') : 'Tiada'}</b>${f.decision.kind === 'potong' ? `<span class="muted">Syarat</span><b>${f.decision.cuts.length} potongan</b>` : ''}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-sm btn-pri" data-act="cert" data-id="${f.id}">${I.doc}Lihat sijil</button><button class="btn btn-sm" data-act="dpdf" data-id="${f.id}">Muat turun PDF</button></div></div></div>`).join('')}
    <div class="card ccard older"><div class="cb" style="justify-content:center;align-items:center;text-align:center;min-height:200px"><b style="font-size:26px" class="tnum">+9</b><span class="muted">sijil lain tahun 2026<br>dalam arkib syarikat</span></div></div></div>`;
}
function dPay() {
  const m = myFilms().filter(f => f.status !== 'Draf').sort((a, b) => new Date(b.submitted) - new Date(a.submitted));
  const paid = m.filter(f => f.status !== 'Menunggu Bayaran'); const due = m.filter(f => f.status === 'Menunggu Bayaran');
  return `<div class="kpis" style="margin-bottom:16px"><div class="card kpi"><div class="top"><small>Dibayar (dalam senarai)</small><span class="ki">${I.money}</span></div><b class="tnum">${rm(paid.reduce((s, f) => s + fee(f), 0))}</b><span class="dl">${paid.length} invois</span></div>
    <div class="card kpi ${due.length ? 'kwarn' : ''}"><div class="top"><small>Belum dibayar</small><span class="ki">${I.clock}</span></div><b class="tnum">${rm(due.reduce((s, f) => s + fee(f), 0))}</b><span class="dl">${due.length} invois</span></div>
    <div class="card kpi"><div class="top"><small>Kaedah bayaran</small><span class="ki">${I.shield}</span></div><b style="font-size:17px">FPX · JomPAY · DuitNow · Kad</b><span class="dl">Resit rasmi dijana serta-merta</span></div></div>
  <div class="card"><div class="card-h"><h2>Invois & resit</h2><span class="chip">Kadar contoh RM ${RATE}/minit</span></div><div class="tbl-box" style="margin-top:8px"><table class="tbl"><thead><tr><th>No. invois</th><th>Filem</th><th>Butiran</th><th>Jumlah</th><th>Tarikh</th><th>Status</th><th></th></tr></thead><tbody>
  ${m.map(f => `<tr><td class="mono" style="font-size:12.5px">INV-${f.id.slice(-4)}-${String(hashStr(f.title) % 900 + 100)}</td><td><b>${esc(f.title)}</b><span class="sub">${f.id}</span></td><td style="font-size:12.5px">${f.min} min × ${rm(RATE)}${f.express ? ' · ekspres ×1.5' : ''}${f.precheck ? ' · pra-semak AI' : ''}</td><td class="tnum"><b>${rm(fee(f))}</b></td><td class="tnum">${fmtDate(f.submitted)}</td>
    <td>${f.status === 'Menunggu Bayaran' ? '<span class="chip st-Menunggu"><span class="dot"></span>Belum dibayar</span>' : '<span class="chip st-Diluluskan"><span class="dot"></span>Dibayar · FPX</span>'}</td><td style="text-align:right">${f.status === 'Menunggu Bayaran' ? `<button class="btn btn-sm btn-pri" data-act="dpay" data-id="${f.id}">Bayar</button>` : `<button class="btn btn-sm" data-act="dreceipt" data-id="${f.id}">Resit ${receiptNo(f)}</button>`}</td></tr>`).join('')}
  </tbody></table></div></div>`;
}
function dProfile() {
  const users = [['Encik Firdaus Hamid', 'Pentadbir syarikat', 'Hari ini, 09:12'], ['Cik Nurul Izzah', 'Penyerah filem', 'Semalam, 16:40'], ['Encik Daniel Wong', 'Kewangan (invois sahaja)', '3 hari lalu']];
  return `<div class="dgrid">
    <div class="card span-6"><div class="card-h"><h2>Maklumat syarikat</h2><span class="chip st-Diluluskan">${I.check}Disahkan</span></div><div class="card-b"><div class="sum"><span class="muted">Nama</span><b>${DIST}</b><span class="muted">No. SSM</span><b class="mono">201901023456 (contoh)</b><span class="muted">Kategori</span><b>Penerbit & pengedar filem</b><span class="muted">Alamat</span><b>Aras 8, Menara Contoh, Jalan Contoh, 50450 Kuala Lumpur</b><span class="muted">E-mel notifikasi</span><b>penapisan@contoh.com.my</b><span class="muted">Berdaftar sejak</span><b>Mac 2019</b></div></div></div>
    <div class="card span-6"><div class="card-h"><h2>Dokumen dalam fail</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:10px">${[['Sijil pendaftaran syarikat (SSM)', 'Sah hingga Mac 2027'], ['Lesen pengedaran filem (contoh)', 'Sah hingga Dis 2026', 'w'], ['Surat wakil kuasa penyerah', 'Dikemas kini Jan 2026']].map(([t, s, w]) => `<div class="mini-row"><span class="ki">${I.doc}</span><span style="flex:1"><b>${t}</b><small>${s}</small></span>${w ? '<span class="chip st-Menunggu">Perlu diperbaharui</span>' : `<span class="chip st-Diluluskan">${I.check}Sah</span>`}</div>`).join('')}</div></div>
    <div class="card span-12"><div class="card-h"><h2>Pengguna berdaftar</h2><button class="btn btn-sm" data-act="dpdf">+ Jemput pengguna</button></div><div class="tbl-box" style="margin-top:8px"><table class="tbl"><thead><tr><th>Nama</th><th>Peranan</th><th>MyDigital ID</th><th>Log masuk terakhir</th></tr></thead><tbody>${users.map(u => `<tr><td>${asg(u[0])}</td><td>${u[1]}</td><td><span class="chip st-Diluluskan">${I.check}Dipautkan</span></td><td>${u[2]}</td></tr>`).join('')}</tbody></table></div></div>
  </div>`;
}
function distDetail(id) {
  const f = film(id);
  const tl = timelineOf(f).filter(e => (e.who !== 'Otak AI KDN' || f.precheck) && !/Ditugaskan/.test(e.t));
  let main = '';
  if (f.status === 'Pindaan Diminta') main = `<div class="banner w">${I.shield}<span><b>LPF meminta ${f.request.cuts.length} potongan</b> untuk kelulusan <b>${f.request.rating}</b>. ${esc(f.request.note || '')} Hantar versi disunting sebelum <b>${fmtDate(f.request.due)}</b>.</span></div>${cutsHTML(f.request.cuts)}
    ${ui.resub === f.id ? `<div class="prog"><i id="rsbar" style="width:0%"></i></div><div class="muted" style="font-size:12.5px">Memuat naik versi disunting secara selamat…</div>` : `<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-pri" data-act="dresub" data-id="${f.id}">${I.upload}Muat naik versi disunting</button><button class="btn" data-act="dappeal" data-id="${f.id}">Tidak bersetuju? Failkan rayuan</button></div>`}`;
  else if (f.status === 'Ditolak') main = `<div class="banner bad">${I.x}<span><b>Tidak diluluskan</b> · Kod ${f.decision.code}: ${esc((REJECT.find(r => r[0] === f.decision.code) || ['', ''])[1])}<br>${esc(f.decision.reason)}</span></div>${f.appeal ? '' : `<div><button class="btn btn-pri" data-act="dappeal" data-id="${f.id}">Failkan rayuan</button> <span class="muted" style="font-size:12.5px">Sebelum ${fmtDate(addDays(f.decision.at, 30))}</span></div>`}`;
  else if (f.status === 'Rayuan') main = `<div class="banner v">${I.shield}<span><b>Rayuan sedang diproses.</b> Pendengaran Jawatankuasa Rayuan pada ${fmtDate(f.appeal.hearing)}. Alasan anda: «${esc(f.appeal.grounds)}»</span></div>`;
  else if (f.status === 'Diluluskan') main = `<div style="display:flex;gap:14px;align-items:center">${badge(f.decision.rating, 64)}<div><b style="font-size:16px">Diluluskan sebagai ${f.decision.rating}</b><div class="muted" style="font-size:13px">${RATING_DESC[f.decision.rating]}</div><div style="font-size:13px;margin-top:3px">Nasihat pengguna: ${f.decision.advice.length ? f.decision.advice.join(', ') : 'Tiada'}</div></div></div>${f.decision.kind === 'potong' ? `<div><div class="lbl" style="margin-bottom:8px">Syarat: potongan berikut wajib dalam semua salinan tayangan</div>${cutsHTML(f.decision.cuts)}</div>` : ''}<div><button class="btn btn-pri" data-act="cert" data-id="${f.id}">${I.doc}Lihat sijil digital</button></div>`;
  else if (f.status === 'Menunggu Bayaran') main = `<div class="banner w">${I.money}<span>Invois <b>${rm(fee(f))}</b> belum dibayar. Serahan akan diproses selepas bayaran diterima.</span></div><div><button class="btn btn-pri" data-act="dpay" data-id="${f.id}">Bayar sekarang</button></div>`;
  else if (f.status === 'Draf') main = `<div class="banner i">${I.doc}<span>Draf belum dihantar.</span></div><div><button class="btn btn-pri" data-act="ddraft" data-id="${f.id}">Sambung draf</button></div>`;
  else main = `<div class="banner i">${I.clock}<span>${f.status === 'Rujuk Panel' ? 'Serahan anda sedang dinilai oleh panel penapisan. Tarikh keputusan akan dimaklumkan.' : `Dalam semakan LPF. Jangkaan keputusan: <b>${fmtDate(dueOf(f))}</b>${f.express ? ' (ekspres)' : ''}.`}</span></div>`;
  openModal(`${esc(f.title)} <span class="muted" style="font-weight:500;font-size:13px">· ${f.id}</span>`, `<div class="rec">
    <div class="rec-l">${poster(f).replace('class="ph-img "', 'class="ph-img " style="aspect-ratio:2/3;border-radius:14px"')}<div class="sum" style="margin-top:14px;font-size:13px"><span class="muted">Jenis</span><b>${f.type} · ${f.genre}</b><span class="muted">Durasi</span><b>${f.min} minit</b><span class="muted">Platform</span><b>${f.platform}</b><span class="muted">Laluan</span><b>${f.express ? 'Ekspres' : 'Biasa'}</b><span class="muted">Fi</span><b>${rm(fee(f))}</b></div></div>
    <div class="rec-r"><div style="display:flex;gap:8px;flex-wrap:wrap">${dChip(f)}</div>${dTrack(f)}${main}<div><div class="lbl" style="margin-bottom:8px">Sejarah serahan</div><ol class="tl2">${tl.map(e => `<li class="${e.fut ? 'fut' : ''}"><span class="d"></span><div><b>${esc(e.t)}</b><small>${fmtDate(e.at)} · ${fmtTime(e.at)}${e.fut ? ' · dijadualkan' : ''}</small>${e.d ? `<p>${esc(e.d)}</p>` : ''}</div></li>`).join('')}</ol></div></div></div>`);
}
function payModal(id) {
  const f = film(id);
  openModal('Bayaran fi penapisan', `<div style="display:flex;flex-direction:column;gap:16px;max-width:520px">
    <div class="sum tnum"><span class="muted">Filem</span><b>${esc(f.title)} (${f.id})</b><span>Fi penapisan (${f.min} min × ${rm(RATE)})</span><b>${rm(f.min * RATE)}</b>${f.express ? `<span>Caj ekspres</span><b>${rm(f.min * RATE * (EXPRESS_MULT - 1))}</b>` : ''}${f.precheck ? `<span>Pra-semak AI</span><b>${rm(PRECHECK_FEE)}</b>` : ''}<span class="tot">Jumlah</span><b class="tot">${rm(fee(f))}</b></div>
    <div><div class="lbl" style="margin-bottom:8px">Kaedah</div><div class="cks">${['FPX (perbankan internet)', 'DuitNow QR', 'JomPAY', 'Kad debit/kredit'].map((p, i) => `<label class="ck"><input type="radio" name="pm" ${i ? '' : 'checked'}>${p}</label>`).join('')}</div></div>
    <p class="muted" style="margin:0;font-size:12.5px">Prototaip: tiada bayaran sebenar dibuat dan tiada butiran bank diminta.</p>
    ${ui.paying ? '<button class="btn btn-pri btn-lg" disabled><span class="spin"></span>Menghubungi bank…</button>' : `<button class="btn btn-pri btn-lg" data-act="dpayok" data-id="${f.id}">Bayar ${rm(fee(f))} (simulasi)</button>`}</div>`);
}
function appealModal(id) {
  const f = film(id);
  openModal(`Failkan rayuan · ${esc(f.title)}`, `<div style="display:flex;flex-direction:column;gap:14px;max-width:620px">
    <p style="margin:0" class="muted">Rayuan dinilai oleh Jawatankuasa Rayuan yang bebas daripada pegawai asal. Anda boleh mencadangkan potongan sebagai alternatif.</p>
    <div class="field"><label for="apg">Alasan rayuan</label><textarea class="inp" id="apg" style="min-height:110px">Kami tidak bersetuju dengan keputusan ini. Adegan berkenaan penting kepada naratif dan kami bersedia membuat potongan pada adegan yang dikenal pasti untuk kelulusan 18.</textarea></div>
    <label class="ck" style="align-self:flex-start"><input type="checkbox" checked>Sedia hadir ke sesi pendengaran (dalam talian atau fizikal)</label>
    <div style="display:flex;gap:10px"><button class="btn btn-pri" data-act="dappealsend" data-id="${f.id}">Hantar rayuan</button><button class="btn" data-act="close">Batal</button></div></div>`);
}
