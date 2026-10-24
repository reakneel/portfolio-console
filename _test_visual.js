// Playwright 实测：截图全部标签页 + 检查控制台错误
const { chromium } = require('playwright');
const path = require('path');
const outDir = path.join(__dirname, '_shot');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('http://localhost:3311', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, 'verify_overview.png'), fullPage: true });

  const tabs = ['走势分析', '重大事件', '财报追踪', '交易记录'];
  for (const t of tabs) {
    await page.click(`button.tab:has-text("${t}")`);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, `verify_${t}.png`), fullPage: true });
  }

  console.log('PAGE TITLE:', await page.title());
  console.log('CONSOLE ERRORS:', errors.length ? errors.join(' | ') : 'none');
  await browser.close();
})();
