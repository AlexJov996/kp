'use strict';

const puppeteer = require("puppeteer");

// http://localhost:9090/chr/getpage?options=%7B%22url%22%3A%22http%3A%2F%2Fwww.yahoo.com%2F%22%7D

const start = async function() {

    console.log('Starting chromium');
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://www.nytimes.com/', { timeout: 0, waitUntil: "networkidle0" });
    await page.screenshot({ path: 'nytimes.png', fullPage: true });
    const screenShot = await page.screenshot();
    console.log('UZO:' + screenShot.length + ' bytes BRE');
    await browser.close();
};

start()
    .then(o => console.log('DONE:' + JSON.stringify(o)))
    .catch(e => console.error('ERROR:' + JSON.stringify(e)));