// Uso: playwright-cli resize <W> <H>; playwright-cli run-code --filename=capture.js
// Salva em ./_qa/: full-<W>.png (pagina inteira) + slice-<W>-NN.png (fatias do tamanho da viewport).
// Rola a pagina antes para disparar animacoes/lazy-load. Retorna as alturas.
async page => {
  const vp = page.viewportSize() || { width: 1440, height: 900 };
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += Math.round(vp.height * 0.6)) {
    await page.evaluate(v => window.scrollTo(0, v), y);
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `_qa/full-${vp.width}.png`, fullPage: true });
  let n = 0;
  for (let y = 0; y < total; y += vp.height) {
    await page.evaluate(v => window.scrollTo(0, v), y);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `_qa/slice-${vp.width}-${String(++n).padStart(2, '0')}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return { width: vp.width, viewportHeight: vp.height, pageHeight: total, slices: n };
}
