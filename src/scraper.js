const axios = require('axios');
const cheerio = require('cheerio');
const { saveToFile } = require('../utils/helpers');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for the URL to scrape
rl.question('enter the URL to scrape: ', async (url) => {
  await scrapeStaticSite(url); 
  rl.close();
});

async function scrapeStaticSite(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const data = [];
    // Modify the selectors according to the structure of the target website
    $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
        data.push({
          type: 'heading',
          level: elem.tagName,
          content: $(elem).text().trim(),
        });
      });
  
      $('p').each((i, elem) => {
        data.push({
          type: 'paragraph',
          content: $(elem).text().trim(),
        });
      });
  
      $('img').each((i, elem) => {
        data.push({
          type: 'image',
          src: $(elem).attr('src'),
          alt: $(elem).attr('alt') || '',
        });
      });
  
      $('a').each((i, elem) => {
        data.push({
          type: 'link',
          href: $(elem).attr('href'),
          text: $(elem).text().trim(),
        });
      });

    console.log('Scraped Data:', data);
    saveToFile('./data/scraped_data.json', data);
  } catch (error) {
    console.error('Error scraping static site:', error);
  }
}
