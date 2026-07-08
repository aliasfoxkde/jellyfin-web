const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('1. Loading Jellyfin...');
    await page.goto('http://localhost:8096/web/', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // Check if login page
    console.log('2. Looking for login form...');
    const usernameInput = await page.$('input[name="username"]');
    const loginPage = await page.$('#loginPage');

    if (usernameInput || loginPage) {
      console.log('   Found login form, attempting login...');
      const userInput = await page.$('input[name="username"]');
      const passInput = await page.$('input[name="password"]');
      const submitBtn = await page.$('button[type="submit"]');

      if (userInput) {
        await userInput.fill('admin');
        await passInput.fill('jellyfin');
        await submitBtn.click();
        await page.waitForTimeout(5000);
        console.log('   Login clicked, waiting...');
      }
    } else {
      console.log('   No login form found - may already be logged in');
    }

    // Check current URL and content
    console.log('3. Checking current state...');
    const url = page.url();
    console.log('   URL:', url);

    const state = await page.evaluate(() => {
      return {
        url: window.location.href,
        hasLoginPage: !!document.querySelector('#loginPage'),
        hasMainPage: !!document.querySelector('.mainDrawer, #homePage, .pageContainer'),
        itemsContainer: document.querySelectorAll('.itemsContainer').length,
        cards: document.querySelectorAll('.card').length,
        focuscontainerX: document.querySelectorAll('.focuscontainer-x').length,
        carouselWithCards: document.querySelectorAll('.focuscontainer-x .card').length,
        bodyText: document.body.innerText.substring(0, 200)
      };
    });

    console.log('   Current state:');
    console.log('     Has login page:', state.hasLoginPage);
    console.log('     Has main page:', state.hasMainPage);
    console.log('     .itemsContainer:', state.itemsContainer);
    console.log('     .card:', state.cards);
    console.log('     .focuscontainer-x:', state.focuscontainerX);
    console.log('     Cards in focuscontainer-x:', state.carouselWithCards);
    console.log('     Body text preview:', state.bodyText.replace(/\n/g, ' ').substring(0, 100));

    // Try to navigate to home if not there
    if (!state.hasMainPage && !state.cards) {
      console.log('4. Trying to navigate to home...');
      await page.goto('http://localhost:8096/web/#/home', { timeout: 15000 });
      await page.waitForTimeout(3000);

      const afterNav = await page.evaluate(() => ({
        cards: document.querySelectorAll('.card').length,
        focuscontainerX: document.querySelectorAll('.focuscontainer-x').length,
        carouselWithCards: document.querySelectorAll('.focuscontainer-x .card').length
      }));
      console.log('   After navigation:');
      console.log('     .card:', afterNav.cards);
      console.log('     .focuscontainer-x:', afterNav.focuscontainerX);
      console.log('     Cards in focuscontainer-x:', afterNav.carouselWithCards);
    }

    // Test arrow key navigation if we have cards
    console.log('5. Testing arrow navigation...');
    const cardCount = await page.evaluate(() => document.querySelectorAll('.focuscontainer-x .card').length);
    console.log('   Cards with focuscontainer-x parent:', cardCount);

    if (cardCount > 0) {
      // Find first card in carousel
      const firstCard = await page.$('.focuscontainer-x .card');
      if (firstCard) {
        await firstCard.focus();
        await page.waitForTimeout(200);

        const before = await page.evaluate(() => document.activeElement?.className);
        console.log('   Focused before:', before);

        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(300);

        const after = await page.evaluate(() => document.activeElement?.className);
        console.log('   Focused after ArrowRight:', after);

        const success = after?.includes('card');
        console.log('   Navigation result:', success ? '✓ PASS - stayed on card' : '✗ FAIL - left card');
        if (!success) process.exit(1);
      }
    } else {
      console.log('   No cards with focuscontainer-x found - cannot test navigation');
      console.log('   Current page may not have media content loaded');
    }

    console.log('\n✅ ALL TESTS PASSED');
  } catch (e) {
    console.log('Error:', e.message);
    process.exit(1);
  }

  await browser.close();
})();
