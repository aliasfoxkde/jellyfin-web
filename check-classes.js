const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8096/web/', { timeout: 15000 });
    await page.waitForTimeout(2000);
    
    // Check for itemsContainer with focuscontainer-x
    const carouselCount = await page.evaluate(() => {
      const containers = document.querySelectorAll('.itemsContainer');
      const withFocusX = document.querySelectorAll('.itemsContainer.focuscontainer-x');
      return {
        totalItemsContainer: containers.length,
        itemsContainerWithFocusX: withFocusX.length,
        firstFewClasses: Array.from(containers).slice(0, 3).map(c => c.className)
      };
    });
    
    console.log('Carousel analysis:');
    console.log('  Total .itemsContainer:', carouselCount.totalItemsContainer);
    console.log('  With .focuscontainer-x:', carouselCount.itemsContainerWithFocusX);
    console.log('  First few classes:', JSON.stringify(carouselCount.firstFewClasses, null, 2));
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
