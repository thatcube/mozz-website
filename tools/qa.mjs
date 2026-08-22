import { chromium } from 'playwright';

/*
 * Find the shared dev server. Six agents share one Astro dev server and Astro
 * permits only one per project, so whichever agent last ran `--force` decides
 * the port. Probing beats hardcoding: a stale port here silently reports every
 * page as a failure, which reads exactly like a broken variant.
 */
const PORTS = [4322, 4399, 4321, 4323];
let BASE = process.env.BASE ?? null;
if (!BASE) {
  for (const port of PORTS) {
    try {
      const r = await fetch(`http://localhost:${port}/`, { signal: AbortSignal.timeout(2500) });
      if (r.ok) { BASE = `http://localhost:${port}`; break; }
    } catch {}
  }
}
if (!BASE) {
  console.error('No dev server found on ' + PORTS.join(', ') + '. Start one, or set BASE.');
  process.exit(1);
}
console.log(`base: ${BASE}\n`);

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
      await p.goto(`${BASE}/v/${s}`, { waitUntil: 'networkidle', timeout: 45000 });
      await p.evaluate(() => document.fonts.ready);
      /*
       * Scroll the whole page before asserting anything. Images below the fold
       * are lazy, so a straight assert reports them as broken when they are
       * simply not requested yet — which reads exactly like a real defect and
       * nearly got a clean variant sent back for rework.
       */
      await p.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 110));
        }
        window.scrollTo(0, 0);
      });
      await p.waitForLoadState('networkidle').catch(() => {});
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
