'use strict';

const Util = require('util');
const Exec = Util.promisify(require('child_process').exec);

async function findBrowserPath () {
  try {
    const res = await Exec('which google-chrome');
              
    console.log(' Using Google Chrome\n');
   
    return res.stdout.replace('\n', '');
  } catch(err) {
    try{
      const res = await Exec('which brave-browser');

      console.log(' Using Brave browser\n');  

      return res.stdout.replace('\n', '');
    } catch(err) {
      try {
        const res = await Exec('which chromium');
        
        console.log('Using Chromium browser\n');
        
        return res.stdout.replace('\n', '');
      } catch(err) {
          try {
            const res = await Exec('which vivaldi');

            console.log(' Using Vivaldi browser\n');        
            
            return res.stdout.replace('\n', '');
          } catch(err) {
            try {
              const res = await Exec('which microsoft-edge');
            
              console.log(' Using Microsoft Edge browser\n');
              
              return res.stdout.replace('\n', '');
            } catch (error) {
              throw 'A Chromium-based browser not found'
          }
        }
      }
    
    }
  }
}


module.exports = {
  findBrowserPath: findBrowserPath
}
