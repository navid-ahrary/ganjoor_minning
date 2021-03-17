'use strict';

const Util = require('util');
const Exec = Util.promisify(require('child_process').exec);

async function findBrowserPath () {
  try {
    const res = await Exec('which google-chrome');

    console.log(' Using the Google Chrome\n');

    return res.stdout.replace('\n', '');
  } catch(err) {
    try {
      const res = await Exec('which brave');

      console.log(' Using the Brave\n');  

      return res.stdout.replace('\n', '');
    }catch(err) {
      try {
        const res = await Exec('which chromium');

        console.log('Using the Chromium\n');

        return res.stdout.replace('\n', '');
      } catch(err) {
        try {

          const res = await Exec('which vivaldi');
  
          console.log(' Using the Vivaldi\n');        

          return res.stdout.replace('\n', '');
        }catch(err) {
          throw 'Chromium browser not found'
        }
      }
    }
  }
}


module.exports = {
  findBrowserPath: findBrowserPath
}
