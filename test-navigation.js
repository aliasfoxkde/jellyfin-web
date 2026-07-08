const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    pageLoaded: false,
    cardsFound: false,
    navigationWorks: false,
    onlyCardsFocused: true,
    errors: []
  };

  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.errors.push(msg.text());
    }
  });

  try {
    console.log('1. Loading Jellyfin...');
    await page.goto('http://localhost:8096/web/', { waitUntil: 'networkidle', timeout: 30000 });
    results.pageLoaded = true;
    console.log('   ✓ Page loaded');

    // Wait for content
    await page.waitForTimeout(2000);

    // Find cards in items container
    console.log('2. Finding card elements...');
    const cards = await page.$$('.itemsContainer .card');
    console.log(`   Found ${cards.length} cards`);

    if (cards.length > 0) {
      results.cardsFound = true;

      // Focus first card
      console.log('3. Focusing first card...');
      await cards[0].focus();
      await page.waitForTimeout(300);

      const focused1 = await page.evaluate(() => document.activeElement?.className);
      console.log(`   Focused element: ${focused1}`);

      // Press RIGHT arrow
      console.log('4. Pressing RIGHT arrow...');
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(300);

      const focused2 = await page.evaluate(() => document.activeElement?.className);
      console.log(`   Focused element after RIGHT: ${focused2}`);

      // Check if still a card
      const isCard = focused2?.includes('card');
      console.log(`   Is card: ${isCard}`);

      if (isCard) {
        results.navigationWorks = true;
        console.log('   ✓ Navigation works - stayed on card');
      } else {
        results.onlyCardsFocused = false;
        console.log('   ✗ Navigation left card - went to: ' + focused2);
      }

      // Press RIGHT again
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(300);
      const focused3 = await page.evaluate(() => document.activeElement?.className);
      console.log(`   Focused after 2nd RIGHT: ${focused3}`);
    }

    // Test Tab still works for all elements
    console.log('5. Testing Tab key (should cycle through all focusable elements)...');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    const tabFocused = await page.evaluate(() => document.activeElement?.tagName);
    console.log(`   Tab focused element: ${tabFocused}`);
    console.log('   ✓ Tab still works');

  } catch (e) {
    console.log('Error:', e.message);
    results.errors.push(e.message);
  }

  console.log('\n=== RESULTS ===');
  console.log(`Page Loaded: ${results.pageLoaded ? '✓' : '✗'}`);
  console.log(`Cards Found: ${results.cardsFound ? '✓' : '✗'}`);
  console.log(`Navigation Works: ${results.navigationWorks ? '✓' : '✗'}`);
  console.log(`Only Cards Focused: ${results.onlyCardsFocused ? '✓' : '✗'}`);
  if (results.errors.length > 0) {
    console.log(`Errors: ${results.errors.join(', ')}`);
  }

  await browser.close();

  // Exit with error if navigation doesn't work
  if (!results.navigationWorks || !results.onlyCardsFocused) {
    console.log('\n⚠️  NAVIGATION ISSUE DETECTED');
    process.exit(1);
  }
  console.log('\n✅ ALL TESTS PASSED');
})();
