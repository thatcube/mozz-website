import { chromium } from 'playwright';
const slugs = process.argv.slice(2);
const b = await chromium.launch();
for (const s of slugs) {
  for (const [label, vp] of [['desk', { width: 1440, height: 900 }], ['mob', { width: 402, height: 874 }]]) {
    const p = await b.newPage({ viewport: vp, deviceScaleFactor: 2 });
    const errs = [], bad404 = [];
    p.on('console', m => m.type() === 'error' && errs.push(m.text().slice(0, 80)));
    p.on('response', r => { if (r.status() >= 400) bad404.push(r.status() + ' ' + new URL(r.url()).pathname); });
    p.on('requestfailed', r => bad404.push('FAIL ' + new URL(r.url()).pathname));
    try {
      await p.goto(`http://localhost:4322/v/${s}`, { waitUntil: 'networkidle', timeout: 45000 });
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(500);
      const r = await p.evaluate(() => {
        const d = document.documentElement, imgs = [...document.images];
        return { ovf: d.scrollWidth - d.clientWidth, imgs: imgs.length,
                 bad: imgs.filter(i => !(i.complete && i.naturalWidth > 0)).length, h: d.scrollHeight };
      });
      await p.screenshot({ path: `qa/${s}-${label}.png`, fullPage: true });
      const real = bad404.filter(u => !/\/hero\/[\w-]+\.jpg$/.test(u));
      console.log(`${s.padEnd(9)} ${label}  ovf=${r.ovf}  imgs=${r.imgs} bad=${r.bad}  h=${r.h}  404s=${real.length ? real.join(', ') : 'none'}`);
    } catch (e) { console.log(`${s.padEnd(9)} ${label}  FAILED ${e.message.slice(0, 70)}`); }
    await p.close();
  }
}
await b.close();
