const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts/.test(m.text())) errs.push('console: ' + m.text()); });
  await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await p.goto('file://' + process.cwd() + '/index.html'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
  const shot = async (n, full) => { await p.waitForTimeout(350); await p.screenshot({ path: `tests/shots/v9-${n}.png`, fullPage: !!full }); };
  const ev = s => p.evaluate(s);
  await p.click('[data-act="pickrole"][data-r="pegawai"]'); await p.click('[data-act="lstep"]'); await p.click('[data-act="login"]'); await p.waitForTimeout(1300);
  await shot('o-board', true);
  await p.click('[data-act="otab"][data-v="gilir"]'); await shot('o-queue', true);
  await p.click('[data-act="ofilt"][data-v="pindaan"]'); await shot('o-queue-pindaan');
  await p.click('[data-act="otab"][data-v="arkib"]'); await shot('o-arch', true);
  await p.click('tr[data-act="rec"]'); await shot('o-rec');
  await p.click('[data-act="close"]');
  await p.click('[data-act="otab"][data-v="semak"]'); await shot('o-studio');
  console.log('studio film', await ev(() => film(ui.sel).title));
  // cut two flags and request edit
  await ev(() => A.openfilm({ dataset: { id: 'LPF-2026-0148' } })); await p.waitForTimeout(300);
  const cuts = await p.$$('[data-act="cutflag"]'); await cuts[0].click(); await (await p.$$('[data-act="cutflag"]'))[1].click();
  await p.locator('.dkinds').scrollIntoViewIfNeeded(); await shot('o-decide-cut');
  await p.click('[data-act="decide"]'); await p.waitForTimeout(400);
  console.log('after decide', await ev(() => S.films.filter(f => f.request && f.request.by === OFFICER).map(f => f.title + ':' + f.status).join(', ')));
  // reject current film
  await p.click('[data-act="dkind"][data-v="tolak"]'); await p.click('[data-act="decide"]'); await p.waitForTimeout(200);
  console.log('err shown', await ev(() => ui.decErr));
  await p.fill('#why', 'Ujian penolakan.'); await p.click('[data-act="decide"]'); await p.waitForTimeout(300);
  console.log('rejected', await ev(() => S.films.filter(f => f.decision && f.decision.reason === 'Ujian penolakan.').map(f => f.title + ':' + f.status).join()));
  // distributor
  await ev(() => switchRole('pengedar', 'pengedar')); await p.waitForTimeout(500); await shot('d-home', true);
  await p.click('[data-act="dtab"][data-v="serahan"]'); await shot('d-subs', true);
  await ev(() => distDetail('LPF-2026-0145')); await shot('d-pindaan');
  await p.click('[data-act="dresub"]'); await p.waitForTimeout(2500); console.log('resub status', await ev(() => film('LPF-2026-0145').status));
  await ev(() => closeModal());
  await p.click('[data-act="dtab"][data-v="sijil"]'); await shot('d-certs');
  await p.click('[data-act="dtab"][data-v="bayaran"]'); await shot('d-pay');
  await ev(() => payModal('LPF-2026-0159')); await p.click('[data-act="dpayok"]'); await p.waitForTimeout(1600); console.log('paid', await ev(() => film('LPF-2026-0159').status));
  await p.click('[data-act="dtab"][data-v="profil"]'); await shot('d-prof');
  await ev(() => A.ddraft({ dataset: { id: 'LPF-2026-0160' } })); await shot('d-draft');
  // officer verifies resubmission
  await ev(() => switchRole('pegawai', 'pegawai')); await ev(() => A.openfilm({ dataset: { id: 'LPF-2026-0145' } })); await p.waitForTimeout(400);
  await p.locator('.dkinds').scrollIntoViewIfNeeded(); await shot('o-verify');
  await p.$$eval('[data-cutok]', els => els.forEach(e => e.click())); await p.click('[data-act="decide"]'); await p.waitForTimeout(300);
  console.log('verified', await ev(() => film('LPF-2026-0145').status + ' ' + (film('LPF-2026-0145').decision || {}).kind));
  // management
  await ev(() => switchRole('pengurusan', 'pengurusan')); await p.waitForTimeout(500); await shot('m-dash', true);
  // public
  await ev(() => { location.hash = 'awam'; }); await p.waitForTimeout(800); await shot('p-home'); await shot('p-home-full', true);
  await p.click('.pc'); await p.waitForTimeout(500); await shot('p-detail'); await shot('p-detail-full', true);
  await ev(() => A.pubverify({ dataset: { c: film('LPF-2026-0131').cert } })); await p.waitForTimeout(500); await shot('p-verify');
  await p.fill('#pubq', 'kota'); await p.waitForTimeout(300); await shot('p-search');
  // phone
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  m.on('pageerror', e => errs.push('m: ' + e.message)); await m.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await m.goto('file://' + process.cwd() + '/index.html'); await m.waitForTimeout(300);
  const widths = {};
  for (const [r, h, extra] of [['pegawai', 'pegawai', ''], ['pegawai', 'pegawai', 'gilir'], ['pegawai', 'pegawai', 'semak'], ['pengedar', 'pengedar', ''], ['pengurusan', 'pengurusan', ''], ['awam', 'awam', '']]) {
    await m.evaluate(([r, h, x]) => { S.role = r; if (x) ui.otab = x; location.hash = h; route(); }, [r, h, extra]); await m.waitForTimeout(400);
    widths[r + extra] = await m.evaluate(() => document.documentElement.scrollWidth);
  }
  await m.screenshot({ path: 'tests/shots/v9-phone-awam.png' });
  console.log('phone widths', widths);
  console.log('errors', errs); await b.close();
})();
