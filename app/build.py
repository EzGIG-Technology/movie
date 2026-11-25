import base64, pathlib, json
d = pathlib.Path(__file__).parent; root = d.parent
b64 = lambda p: 'data:image/png;base64,' + base64.b64encode((root/'assets'/p).read_bytes()).decode()
imgs = {p.stem: 'img/'+p.name for p in sorted((root/'img').iterdir()) if p.suffix in ('.jpg','.png')}
html = f'''<title>TAPIS Klasifikasi Filem</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@800&display=swap">
<style>
{(d/'style.css').read_text()}
</style>
<div class="waves" aria-hidden="true"></div>
<div id="app"></div>
<div id="modalRoot"></div>
<div class="toasts" id="toasts" aria-live="polite"></div>
<script>
const LOGO_LIGHT = "{b64('lpf-mark-light.png')}";
const LOGO_DARK = "{b64('lpf-mark-dark.png')}";
const IMGS = {json.dumps(imgs)};
{(d/'data.js').read_text()}
{(d/'views.js').read_text()}
{(d/'arch.js').read_text()}
{(d/'mech.js').read_text()}
{(d/'officer.js').read_text()}
{(d/'dist.js').read_text()}
{(d/'pub.js').read_text()}
{(d/'mgmt.js').read_text()}
{(d/'core.js').read_text()}
</script>
'''
(root/'myklasifikasi.html').write_text(html)
(root/'index.html').write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'+html+'</body></html>')
(root/'files.json').write_text(json.dumps({v:v for v in imgs.values()}))
print(len(html), 'imgs:', len(imgs))
