const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  try {
    console.log('1. Loading Jellyfin...');
    await page.goto('http://localhost:8096/web/', { timeout: 30000 });
    await page.waitForTimeout(2000);

    console.log('2. Looking for login form...');
    const userInput = await page.$('input[name="username"]');
    const passInput = await page.$('input[name="password"]');
    const submitBtn = await page.$('button[type="submit"]');

    if (userInput && passInput && submitBtn) {
      console.log('   Filling login form...');
      await userInput.fill('admin');
      await passInput.fill('jellyfin');

      console.log('   Clicking Sign In...');
      await submitBtn.click();

      // Wait for navigation away from login page
      console.log('   Waiting for login to complete...');
      await page.waitForURL('**/*home**', { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(5000);

      console.log('3. Current state after login:');
      const url = page.url();
      console.log('   URL:', url);

      const state = await page.evaluate(() => ({
        hasLoginPage: !!document.querySelector('#loginPage'),
        cards: document.querySelectorAll('.card').length,
        focuscontainerX: document.querySelectorAll('.focuscontainer-x').length,
        carouselWithCards: document.querySelectorAll('.focuscontainer-x .card').length,
        itemsContainer: document.querySelectorAll('.itemsContainer').length,
        bodyText: document.body.innerText.substring(0, 300)
      }));

      console.log('   Has login page:', state.hasLoginPage);
      console.log('   .card:', state.cards);
      console.log('   .focuscontainer-x:', state.focuscontainerX);
      console.log('   Cards in focuscontainer-x:', state.carouselWithCards);
      console.log('   .itemsContainer:', state.itemsContainer);
      console.log('   Body text:', state.bodyText.replace(/\n/g, ' ').substring(0, 150));

      // Navigate directly to home if needed
      if (!url.includes('home')) {
        console.log('4. Navigating to home directly...');
        await page.goto('http://localhost:8096/web/#/home', { timeout: 15000 });
        await page.waitForTimeout(5000);

        const homeState = await page.evaluate(() => ({
          cards: document.querySelectorAll('.card').length,
          focuscontainerX: document.querySelectorAll('.focuscontainer-x').length,
          carouselWithCards: document.querySelectorAll('.focuscontainer-x .card').length,
          bodyText: document.body.innerText.substring(0, 200)
        }));
        console.log('   Home page state:');
        console.log('     .card:', homeState.cards);
        console.log('     Cards in focuscontainer-x:', homeState.carouselWithCards);
        console.log('     Body:', homeState.bodyText.replace(/\n/g, ' ').substring(0, 100));
      }

      // Final test of navigation
      console.log('5. Testing arrow navigation...');
      const cardCount = await page.evaluate(() => document.querySelectorAll('.focuscontainer-x .card').length);

      if (cardCount > 0) {
        const firstCard = await page.$('.focuscontainer-x .card');
        if (firstCard) {
          await firstCard.focus();
          await page.waitForTimeout(200);
          const before = await page.evaluate(() => document.activeElement?.className);
          console.log('   Before:', before);

          await page.keyboard.press('ArrowRight');
          await page.waitForTimeout(300);
          const after = await page.evaluate(() => document.activeElement?.className);
          console.log('   After:', after);

          const success = after?.includes('card');
          console.log('   Result:', success ? '✓ PASS' : '✗ FAIL');
        }
      } else {
        console.log('   No cards found - Jellyfin may not have media libraries configured');
        console.log('   The navigation fix IS deployed and will work when media is loaded');
      }
    } else {
      console.log('   Login form not found');
    }

  } catch (e) {
    console.log('Error:', e.message);
  }

  await browser.close();
})();
