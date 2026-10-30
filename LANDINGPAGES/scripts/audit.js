// Uso: playwright-cli run-code --filename=audit.js  (rode em cada viewport). Retorna JSON de problemas objetivos.
async page => {
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push(String(e)));
  await page.reload({ waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const lum = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; };
    const parse = s => (s.match(/[\d.]+/g) || []).map(Number);
    const hasImgBg = el => { while (el) { const s = getComputedStyle(el); if (s.backgroundImage !== 'none') return true; el = el.parentElement; } return false; };
    const bgOf = el => { while (el) { const c = parse(getComputedStyle(el).backgroundColor); if (c.length >= 3 && (c[3] === undefined || c[3] > .9)) return c; el = el.parentElement; } return [255, 255, 255]; };
    const lowContrast = [];
    document.querySelectorAll('h1,h2,h3,h4,p,a,li,button,span,label').forEach(el => {
      if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return;
      if (hasImgBg(el)) return; // fundo com imagem/gradiente: avaliar visualmente
      const cs = getComputedStyle(el);
      const L1 = lum(parse(cs.color).slice(0, 3)), L2 = lum(bgOf(el));
      const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
      const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
      if (ratio < (big ? 3 : 4.5)) lowContrast.push({ text: el.textContent.trim().slice(0, 40), ratio: +ratio.toFixed(2) });
    });
    return {
      viewportWidth: vw,
      horizontalOverflow: document.documentElement.scrollWidth > vw + 1,
      overflowingElements: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > vw + 1).slice(0, 8).map(e => e.tagName + '.' + String(e.className).slice(0, 40)),
      h1Count: document.querySelectorAll('h1').length,
      brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src),
      imagesWithoutAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
      emptyLinks: [...document.querySelectorAll('a')].filter(a => !a.textContent.trim() && !a.getAttribute('aria-label')).length,
      deadHrefs: document.querySelectorAll('a[href="#"],a:not([href])').length,
      smallTapTargets: [...document.querySelectorAll('a,button')].filter(e => { const b = e.getBoundingClientRect(); return b.width && (b.height < 40 || b.width < 40); }).length,
      smallText: [...document.querySelectorAll('p,li')].filter(e => parseFloat(getComputedStyle(e).fontSize) < 14 && e.textContent.trim()).length,
      lowContrast: lowContrast.slice(0, 12),
      lowContrastTotal: lowContrast.length,
      lang: document.documentElement.lang,
      title: document.title,
      metaDescription: !!document.querySelector('meta[name=description]'),
      viewportMeta: !!document.querySelector('meta[name=viewport]'),
      reducedMotionRule: [...document.styleSheets].some(s => { try { return [...s.cssRules].some(r => r.conditionText && r.conditionText.includes('prefers-reduced-motion')); } catch (e) { return false; } }),
    };
  });
  r.consoleErrors = consoleErrors;
  return r;
}
