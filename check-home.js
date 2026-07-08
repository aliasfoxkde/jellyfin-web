const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Go to web app
    await page.goto('http://localhost:8096/web/', { timeout: 15000 });
    await page.waitForTimeout(3000);
    
    // Try to see what's on screen
    const content = await page.evaluate(() => {
      const body = document.body.innerHTML;
      return {
        hasLogin: body.includes('login') || body.includes('Login'),
        hasItemsContainer: body.includes('itemsContainer'),
        itemsContainerCount: document.querySelectorAll('.itemsContainer').length,
        focuscontainerXCount: document.querySelectorAll('.focuscontainer-x').length,
        cardCount: document.querySelectorAll('.card').length,
        bodyLength: body.length
      };
    });
    
    console.log('Page content analysis:');
    console.log('  Has login form:', content.hasLogin);
    console.log('  Has itemsContainer:', content.hasItemsContainer);
    console.log('  .itemsContainer count:', content.itemsContainerCount);
    console.log('  .focuscontainer-x count:', content.focuscontainerXCount);
    console.log('  .card count:', content.cardCount);
    console.log('  Body HTML length:', content.bodyLength);
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
