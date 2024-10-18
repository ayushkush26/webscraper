const puppeteer = require('puppeteer');
const { saveToFile } = require('../utils/helpers');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the URL to scrape: ', async (url) => {
  await scrapeDynamicSite(url);
  rl.close();
});

async function scrapeDynamicSite(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the specified URL and wait for network activity to idle
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Evaluate the page to extract more comprehensive data
    const data = await page.evaluate(() => {
      const items = [];

      // Extract all headings (h1 to h6)
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((item) => {
        items.push({ type: 'heading', text: item.innerText });
      });

      // Extract all paragraphs
      document.querySelectorAll('p').forEach((item) => {
        items.push({ type: 'paragraph', text: item.innerText });
      });

      // Extract all links
      document.querySelectorAll('a').forEach((item) => {
        items.push({ type: 'link', href: item.href, text: item.innerText });
      });

      // Extract all images (with src and alt text)
      document.querySelectorAll('img').forEach((item) => {
        items.push({ type: 'image', src: item.src, alt: item.alt });
      });

      // Extract elements with specific class (e.g., 'dynamic-class')
      document.querySelectorAll('.dynamic-class').forEach((item) => {
        items.push({ type: 'dynamic-content', text: item.innerText });
      });

      return items;
    });

    console.log('Scraped Dynamic Data:', data);

    // Save data to a JSON file
    saveToFile('./data/scraped_data.json', data);

  } catch (error) {
    console.error('Error scraping the site:', error);
  } finally {
    await browser.close();
  }
}
