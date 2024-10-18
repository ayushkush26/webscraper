const axios = require('axios');
const { saveToFile } = require('../utils/helpers');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('enter the API URL to scrape: ', async (apiUrl) => {
  await scrapeApiData(apiUrl);
  rl.close();
});


async function scrapeApiData() {
  try {
    // GET request to the API
    const response = await axios.get(apiUrl);
    const data = response.data;  // extract the data from the response
    console.log('API Data:', data);

    saveToFile('./data/scraped_data.json', data);
  } catch (error) {
    // log any errors encountered during the API request
    console.error('Error scraping API data:', error);
  }
}

// function to scrape API data
scrapeApiData();
