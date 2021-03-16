'use strict'

const puppeteer = require('puppeteer-core')
const Fs = require('fs')

const url = 'https://ganjoor.net/moulavi/shams/ghazalsh/sh1/'

function getPoems () {
  const m1 = document.querySelectorAll('div.m1');
  const m2 = document.querySelectorAll('div.m2');
  
  const poems = [];
  m1.forEach(m => poems.push(m.innerText))
  m2.forEach(m => poems.push(m.innerText))

  return poems
}

async function app () {
  const config  = {
    ignoreHTTPSErrors: true,
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
    dumpio: false,
    executablePath: '/usr/bin/vivaldi',
    defaultViewport:{height: 760, width:1366},
    headless: true,
  };
  const browser = await puppeteer.launch(config)
  const page = await browser.newPage();
  await page.goto(url);
  
  let poems = ''

  while(true) {
    const result = await page.evaluate(getPoems);

    poems += result.join('\n')
    
    Fs.appendFileSync('poems.txt', poems)
    
    const nextButton = await page.$('div.navleft')
    
    if(!Boolean(nextButton)) {
      break;
    }

    await nextButton.click()
    await page.waitForNavigation({waitUntil: 'domcontentloaded'})
  } 

  await browser.close();
};

app();
