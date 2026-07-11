import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p = await b.newPage({viewport:{width:900,height:800}, deviceScaleFactor:2});
await p.goto(pathToFileURL(process.env.SC+'/comp-light.html').href);
await p.waitForTimeout(300);
// clip just the Full width section for a focused check
const el = await p.$('[data-pv-section="Full width"]');
await el.screenshot({path:process.env.SC+'/fullwidth.png'});
await b.close(); console.log('shot');
