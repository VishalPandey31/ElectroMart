const axios = require('axios');

async function testWiki(name) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|pageterms&generator=search&gsrsearch=${encodeURIComponent(name)}&gsrlimit=1&piprop=original`;
    const { data } = await axios.get(searchUrl);
    const pages = data.query?.pages;
    if (!pages) return null;
    const pageId = Object.keys(pages)[0];
    return pages[pageId].original?.source;
  } catch (e) {
    return null;
  }
}

async function run() {
  const names = ['Arduino Uno', 'ESP32-CAM', 'MQ-2 Gas Sensor', 'HC-SR04'];
  for (const n of names) {
    const url = await testWiki(n);
    console.log(`${n}: ${url || 'NOT FOUND'}`);
  }
}

run();
