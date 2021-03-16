'use strict'

const puppeteer = require('puppeteer-core')

const url = 'https://ganjoor.net/moulavi/shams/ghazalsh/sh1/'

async function app () {
  const config  = {
    ignoreHTTPSErrors: true,
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
    dumpio: false,
    executablePath: '/usr/bin/vivaldi',
    defaultViewport:{height: 760, width:1366},
    headless: false,
  };
  const browser = await puppeteer.launch(config)
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: 'example.png' });

  await browser.close();
};

app();
