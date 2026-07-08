const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(err.message);
  });

  try {
    await page.goto('http://localhost:8096/web/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if React root has content
    const reactRoot = await page.$('#reactRoot');
    const html = await reactRoot?.innerHTML();
    console.log('React root content length:', html?.length || 0);
    console.log('React root preview:', html?.substring(0, 500));
    
    if (errors.length > 0) {
      console.log('\nConsole errors:');
      errors.forEach(e => console.log('  ERROR:', e));
    } else {
      console.log('\nNo console errors detected');
    }
  } catch (e) {
    console.log('Page load error:', e.message);
  }
  
  await browser.close();
})();
