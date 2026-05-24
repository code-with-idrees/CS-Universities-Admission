const puppeteer = require('puppeteer');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log(`Navigating to http://localhost:${PORT}...`);
  await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0', timeout: 30000 });

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  // Wait for the app to fully load
  await new Promise(r => setTimeout(r, 2000));

  console.log('Taking screenshot 1: Main View (Dark Mode)...');
  await page.screenshot({ path: 'screenshots/1_main_view.png', fullPage: false });

  console.log('Taking screenshot 2: Filtered by Interest...');
  // Click an interest pill
  const interestPill = await page.$('.interest-pill');
  if (interestPill) {
    await interestPill.click();
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'screenshots/2_filtered_by_interest.png' });
  } else {
    console.log('  No .interest-pill found, trying alternative selector...');
    // Try clicking the first interest button in the filter section
    const altPill = await page.$('.interest-filter button');
    if (altPill) {
      await altPill.click();
      await new Promise(r => setTimeout(r, 1500));
    }
    await page.screenshot({ path: 'screenshots/2_filtered_by_interest.png' });
  }

  console.log('Taking screenshot 3: Expanded Card...');
  const expandBtn = await page.$('.expand-btn');
  if (expandBtn) {
    await expandBtn.click();
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'screenshots/3_expanded_card.png' });
  }

  console.log('Taking screenshot 4: Gemini Chat...');
  const fab = await page.$('#gemini-chat-fab');
  if (fab) {
    await fab.click();
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'screenshots/4_gemini_chat.png' });
  }

  console.log('Taking screenshot 5: Light Mode...');
  // Close chat first
  const closeChat = await page.$('.chatbot-header__close-btn');
  if (closeChat) {
    await closeChat.click();
    await new Promise(r => setTimeout(r, 1000));
  }
  // Collapse any expanded card
  const expandedBtn = await page.$('.card.expanded .expand-btn');
  if (expandedBtn) {
    await expandedBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  }
  // Toggle light mode
  const themeBtn = await page.$('.theme-toggle-btn');
  if (themeBtn) {
    await themeBtn.click();
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'screenshots/5_light_mode.png' });
  }

  // Screenshot 6: Mobile view (bonus)
  console.log('Taking screenshot 6: Mobile View...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'screenshots/6_mobile_view.png' });

  await browser.close();
  console.log('✅ All screenshots saved to /screenshots directory.');
})();
