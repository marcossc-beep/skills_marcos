// Uso (site de referencia aberto): playwright-cli run-code --filename=extract-style.js
// Retorna cores dominantes, fontes, escala tipografica, raios, sombras, espacamento e estilo de botao.
async page => {
  return await page.evaluate(() => {
    const count = arr => Object.entries(arr.reduce((m, k) => (m[k] = (m[k] || 0) + 1, m), {})).sort((a, b) => b[1] - a[1]);
    const els = [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().width > 0);
    const hex = c => { const m = c.match(/[\d.]+/g) || []; if (m.length < 3 || (m[3] !== undefined && +m[3] < .1)) return null; return '#' + m.slice(0, 3).map(v => Math.round(+v).toString(16).padStart(2, '0')).join(''); };
    const bg = [], fg = [], fonts = [], sizes = [], radii = [], shadows = [], gaps = [];
    els.forEach(e => {
      const s = getComputedStyle(e);
      const b = hex(s.backgroundColor); if (b) bg.push(b);
      if ([...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) {
        const f = hex(s.color); if (f) fg.push(f);
        fonts.push(s.fontFamily.split(',')[0].replace(/["']/g, '').trim());
        sizes.push(s.fontSize + '/' + s.fontWeight + '/' + s.lineHeight);
      }
      if (s.borderRadius !== '0px') radii.push(s.borderRadius);
      if (s.boxShadow !== 'none') shadows.push(s.boxShadow);
      ['paddingTop', 'paddingBottom'].forEach(k => { const v = parseFloat(s[k]); if (v >= 32) gaps.push(Math.round(v)); });
    });
    const pick = sel => { const e = document.querySelector(sel); if (!e) return null; const s = getComputedStyle(e); return { font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, color: s.color, textTransform: s.textTransform }; };
    const btn = document.querySelector('a[class*=btn],button,a[class*=button],a[class*=cta]');
    const bs = btn && getComputedStyle(btn);
    return {
      title: document.title,
      background: count(bg).slice(0, 8),
      text: count(fg).slice(0, 8),
      fonts: count(fonts).slice(0, 4),
      typeScale: count(sizes).slice(0, 12),
      h1: pick('h1'), h2: pick('h2'), body: pick('p'),
      radii: count(radii).slice(0, 5),
      shadows: count(shadows).slice(0, 3),
      sectionPadding: count(gaps).slice(0, 5),
      button: bs && { bg: bs.backgroundColor, color: bs.color, radius: bs.borderRadius, padding: bs.padding, font: bs.fontSize + '/' + bs.fontWeight, border: bs.border },
      cssVars: [...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch (e) { return []; } }).filter(r => r.selectorText === ':root').flatMap(r => r.cssText.match(/--[\w-]+:\s*[^;]+/g) || []).slice(0, 40),
      sections: [...document.querySelectorAll('section,header,footer,nav')].map(e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + ' | ' + ((e.querySelector('h1,h2,h3') || {}).textContent || '').trim().slice(0, 50)),
    };
  });
}
