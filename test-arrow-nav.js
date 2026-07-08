const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('1. Loading Jellyfin...');
    await page.goto('http://localhost:8096/web/', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // Check if login page
    const isLogin = await page.$('input[name="username"], input[id="txtUsername"], #loginPage');
    if (isLogin) {
      console.log('2. Logging in...');
      // Try to find login form
      const usernameInput = await page.$('input[name="username"]');
      const passwordInput = await page.$('input[name="password"]');
      const submitBtn = await page.$('button[type="submit"]');

      if (usernameInput && passwordInput && submitBtn) {
        // Get credentials from env or use default
        const username = process.env.JELLYFIN_USER || 'admin';
        const password = process.env.JELLYFIN_PASS || 'jellyfin';

        await usernameInput.fill(username);
        await passwordInput.fill(password);
        await submitBtn.click();
        await page.waitForTimeout(3000);
        console.log('   Logged in');
      }
    }

    // Now check for cards
    console.log('3. Checking for cards and focuscontainer-x...');
    const cardInfo = await page.evaluate(() => {
      const itemsContainers = document.querySelectorAll('.itemsContainer');
      const focusContainers = document.querySelectorAll('.focuscontainer-x');
      const cards = document.querySelectorAll('.card');

      return {
        itemsContainerCount: itemsContainers.length,
        focuscontainerXCount: focusContainers.length,
        cardCount: cards.length,
        containerClasses: Array.from(itemsContainers).slice(0, 3).map(c => c.className),
        focusXClasses: Array.from(focusContainers).slice(0, 3).map(c => c.className)
      };
    });

    console.log(`   itemsContainer: ${cardInfo.itemsContainerCount}`);
    console.log(`   focuscontainer-x: ${cardInfo.focuscontainerXCount}`);
    console.log(`   .card elements: ${cardInfo.cardCount}`);
    console.log(`   Container classes: ${JSON.stringify(cardInfo.containerClasses)}`);

    // If we have cards with focuscontainer-x, test navigation
    if (cardInfo.cardCount > 0 && cardInfo.focuscontainerXCount > 0) {
      console.log('4. Testing arrow navigation...');

      // Find a card inside a focuscontainer-x
      const cardInFocusX = await page.$('.focuscontainer-x .card');
      if (cardInFocusX) {
        await cardInFocusX.focus();
        await page.waitForTimeout(200);

        const beforeClass = await page.evaluate(() => document.activeElement?.className);
        console.log(`   Before arrow: ${beforeClass}`);

        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(300);

        const afterClass = await page.evaluate(() => document.activeElement?.className);
        console.log(`   After arrow: ${afterClass}`);

        const stayedOnCard = afterClass?.includes('card');
        console.log(`   Stayed on card: ${stayedOnCard ? '✓ YES' : '✗ NO'}`);

        if (!stayedOnCard) {
          console.log('\n⚠️  NAVIGATION ISSUE: Arrow went to non-card element');
          process.exit(1);
        }
      } else {
        console.log('   No card found inside focuscontainer-x');
      }
    } else {
      console.log('   No cards or focuscontainer-x found - need logged-in state');
      console.log('   Set JELLYFIN_USER and JELLYFIN_PASS env vars to auto-login');
    }

    console.log('\n✅ Test complete');
  } catch (e) {
    console.log('Error:', e.message);
    process.exit(1);
  }

  await browser.close();
})();
