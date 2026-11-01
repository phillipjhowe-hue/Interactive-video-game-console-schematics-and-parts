const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 256, height: 256 } });
  await p.setContent(`<body style="margin:0;background:transparent"><svg width="256" height="256" viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" rx="7" fill="#141920"/><g transform="translate(4 4) scale(.75)" color="#f2a93b"><rect x="5" y="5" width="22" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="11" y="11" width="10" height="10" fill="currentColor"/><g stroke="currentColor" stroke-width="2"><path d="M10 1v4M16 1v4M22 1v4M10 27v4M16 27v4M22 27v4M1 10h4M1 16h4M1 22h4M27 10h4M27 16h4M27 22h4"/></g></g></svg></body>`);
  await p.screenshot({ path: 'app/icon.png', omitBackground: true }); await b.close();
})();
