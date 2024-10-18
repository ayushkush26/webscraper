const axios = require('axios');
const cheerio = require('cheerio');
const { saveToFile } = require('../utils/helpers');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('enter the base URL for pagination: ', async (baseUrl) => {
  await scrapeAllPages(baseUrl);
  rl.close();
});

// function to scrape data from a specific page
async function scrapePaginatedSite(pageNum = 1) {
  const url = `${baseUrl}/page/${pageNum}`; 
  const response = await axios.get(url); 
  const html = response.data;  // get the HTML content from the response
  const $ = cheerio.load(html);  

  const data = [];
  
  $('.item').each((i, elem) => {
    data.push($(elem).text());  // add the text of each element to the data array
  });

  return data;  
}

// function to scrape all pages until no more data is found
async function scrapeAllPages() {
  let page = 1;
  let allData = [];  // Array to store all scraped data

  while (true) {
    const data = await scrapePaginatedSite(page); 
    if (data.length === 0) break;  

    allData = allData.concat(data); 
    page++;  
  }

  console.log('All Scraped Data:', allData);  // Log all the scraped data
  saveToFile('./data/scraped_data.json', allData);  
}

// function to start scraping
scrapeAllPages();
