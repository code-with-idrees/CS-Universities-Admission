const puppeteer = require('puppeteer');
const fs = require('fs');
const { spawn } = require('child_process');

(async () => {
  console.log('Starting Vite dev server...');
  const serverProcess = spawn('npm', ['run', 'dev'], { shell: true });
  
  // Wait for server to start (fixed delay instead of parsing stdout)
  await new Promise(r => setTimeout(r, 6000));

  // Give it an extra second just in case
  await new Promise(r => setTimeout(r, 1000));

  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });

  // Navigate to the local dev server (default port for Vite is usually 5173, but check output)
  // Let's assume 5173 for Vite
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  console.log('Taking screenshot: Main View...');
  await page.screenshot({ path: 'screenshots/1_main_view.png', fullPage: false });

  console.log('Taking screenshot: Toggle Interest...');
  // Click an interest pill
  const interestPill = await page.$('.interest-pill');
  if (interestPill) {
    await interestPill.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'screenshots/2_filtered_by_interest.png' });
  }

  console.log('Taking screenshot: Expanded Card...');
  const expandBtn = await page.$('.expand-btn');
  if (expandBtn) {
    await expandBtn.click();
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'screenshots/3_expanded_card.png' });
  }

  console.log('Taking screenshot: Gemini Chat...');
  const fab = await page.$('#gemini-chat-fab');
  if (fab) {
    await fab.click();
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'screenshots/4_gemini_chat.png' });
  }

  console.log('Taking screenshot: Light Mode...');
  // Close chat
  const closeChat = await page.$('.chatbot-header__close-btn');
  if (closeChat) {
    await closeChat.click();
    await new Promise(r => setTimeout(r, 1000));
  }
  // Toggle light mode
  const themeBtn = await page.$('.theme-toggle-btn');
  if (themeBtn) {
    await themeBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'screenshots/5_light_mode.png' });
  }

  await browser.close();
  console.log('Screenshots saved to /screenshots directory.');

  // Kill server
  serverProcess.kill();
  process.exit(0);
})();
