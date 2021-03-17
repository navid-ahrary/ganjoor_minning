'use strict'

const puppeteer = require('puppeteer-core')
const Fs = require('fs')


function getPoems () {
  const m1 = document.querySelectorAll('div.m1');
  const m2 = document.querySelectorAll('div.m2');
  
  const poems = [];

  m1.forEach(m => poems.push(m.innerText))
  m2.forEach(m => poems.push(m.innerText))
  
  return poems
}

async function app (pageNumber = 1) {
  const url = `https://ganjoor.net/hafez/ghazal/sh${pageNumber}/`;

  var fileName = url.split('ganjoor.net/')[1].split('/')
  fileName.splice(-2, 2)
  fileName = fileName.join('-') + '.txt'

  const config  = {
    ignoreHTTPSErrors: true,
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
    dumpio: false,
    executablePath: '/usr/bin/vivaldi',
    defaultViewport:{height: 760, width:1366},
    headless: false,
  };
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const blockList = ['image', 'font', 'media', 'xhr', 'texttrack', 'script']

    if (blockList.includes(req.resourceType())) {
      req.abort()
    } else {
      req.continue()
    }
  })
  // "document" | "stylesheet" | "image" | "media" | "font" | "script" | "texttrack" | "xhr" | "fetch" | "eventsource" | "websocket" | "manifest" | "signedexchange" | "ping" | "cspviolationreport" | "preflight" | "other"

  await page.goto(url);
  
  let countOfAnalyzedPage = 1
  let poems = '';
  while(true) {

    const result = await page.evaluate(getPoems);

    poems += result.join('\n') + '\n';

    Fs.appendFileSync(fileName, poems);
    
    console.log(' 👍', page.url());
    
    const nextPageAvailable = await page.evaluate(() => {
      const select = document.querySelector('div.navleft')
      
      return Boolean(select.children.length)
    });
    
    if(!nextPageAvailable) break;
    
    const nexButton = await page.$('div.navleft')
    await nexButton.click();
    await page.waitForNavigation({waitUntil: 'domcontentloaded'});
    
    countOfAnalyzedPage++;
  } 

  console.log(`\n 🖖 Result: "${countOfAnalyzedPage}" pages analyzed`)

  await browser.close();
};

const startPageNon = +(process.argv[2] ?? 1)
app(+startPageNon);
