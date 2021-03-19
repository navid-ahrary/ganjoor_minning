'use strict'

const puppeteer = require('puppeteer-core')
const Fs = require('fs')
const OS = require('os')

const helpers = require('./helpers');

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
  const filePath = OS.homedir() + '/Desktop/' + fileName.join('-') + '.txt'

  console.log(' Data is saving on your Desktop\n')

  const config  = {
    ignoreHTTPSErrors: true,
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
    dumpio: false,
    executablePath: await helpers.findBrowserPath(),
    defaultViewport:{height: 760, width:1366},
    headless: false,
  };
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const blockList = [
      'image', 'font', 'media', 'xhr', 'texttrack', 'script', 'sub_frame', 'object_subrequest'
    ]

    if (blockList.includes(req.resourceType())) {
      req.abort()
    } else {
      req.continue()
    }
  })

  await page.goto(url);
  
  let countOfAnalyzedPage = 1
  let poems = '';
  while(true) {

    const result = await page.evaluate(getPoems);

    poems += result.join('\n') + '\n';

    Fs.appendFileSync(filePath, poems);
    
    console.log(' 👍', page.url());
    
    const nextPageAvailable = await page.evaluate(() => {
      const select = document.querySelector('div.navleft')
      
      return Boolean(select.children.length)
    });
    
    if(!nextPageAvailable) break;
    
    const nexButton = await page.$('div.navleft')

    await nexButton.click();
    await page.waitForNavigation({waitUntil: 'load'});
    
    countOfAnalyzedPage++;
  } 

  console.log(`\n 🖖 Result: "${countOfAnalyzedPage}" pages analyzed`)

  await browser.close();
};

const startPageNon = +(process.argv[2] ?? 1)
app(+startPageNon);
