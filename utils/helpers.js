const fs = require('fs');

function saveToFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');  // Write data to the file
  console.log(`Data saved to ${filename}`);  // Log a confirmation message
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));  // Return a promise that resolves after a delay
}

// Function to get a random User-Agent string
function getRandomUserAgent() {
  const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',  // User-Agent for macOS
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',  //  User-Agent for Windows
    // Add more User-Agents here
  ];

  return userAgents[Math.floor(Math.random() * userAgents.length)];  
}

module.exports = {
  saveToFile,
  delay,
  getRandomUserAgent,
};
