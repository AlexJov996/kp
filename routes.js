'use strict';

const express = require('express');
const router = express.Router();
const querystring = require('querystring');

const {to, ReE, ReS, TERR, ELAPSED}  = require('./util.service');

const puppeteer = require("puppeteer");

const timeout = ms => new Promise(res => setTimeout(res, ms));

let puppeteerOptions, browser;
process.env.APP='DEVEL';
if(process.env.APP === 'DEVEL') {
    puppeteerOptions = {
        dumpio: true,
        headless: false,
        devtools: false,
    };
    console.log('Starting bundled chromium');
} else {
    console.log('Starting platform chromium');
    puppeteerOptions = {
        dumpio: true,
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
    };
}

puppeteer.launch(puppeteerOptions).then( b => {
    browser = b;
    console.log('Chromium started');
}).catch( e => {
    console.error('Unable to start chromium:',e);
});


/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({status: "success", message: "CHROMIUM HELPER API", data: {"version_number": "v1.0.0"}})
});

const test = async function (req, res) {
    if (!browser) return ReE(res, "Chromium not running", 422);
    //console.log(req);
    const ts = process.hrtime();
    const page = await browser.newPage();
    await page.setViewport({ width: 2048, height: 6000 });
    await page.goto('https://google.com/');
    //await page.goto('https://www.nytimes.com/', { timeout: 0, waitUntil: "networkidle0" });
    //await page.screenshot({ path: 'nytimes.png', fullPage: true });
    const screenShot = await page.screenshot();
    console.log(`PAGE ${screenShot.length} bytes in ${ELAPSED(ts)}ms`);
    //await page.close();

    res.contentType('image/png');
    res.send(screenShot);
};

const test2 = async function (req, res) {
    if (!browser) return ReE(res, "Chromium not running", 422);
    //console.log(req);
    const ts = process.hrtime();
    const page = await browser.newPage();
    await page.setViewport({ width: 2048, height: 6000 });
    await page.goto('https://www.nytimes.com/');
    const screenShot = await page.screenshot();
    console.log(`PAGE ${screenShot.length} bytes in ${ELAPSED(ts)}ms`);
    await page.close();

    res.contentType('image/png');
    res.send(screenShot);
};

const getPage = async function (req, res) {
    if (!browser) return ReE(res, "Chromium not running", 422);

    let options;
    try {
        options = JSON.parse(req.query.options);
    } catch(e) {
        return ReE(res, "Unable to parse puppeteerOptions", 422);
    }
    if (!options || !options.url || !options.viewPort || !options.clip) return ReE(res, "Invalid puppeteerOptions", 422);

    const ts = process.hrtime();
    try {
        const page = await browser.newPage();
        //page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        await page.setViewport(options.viewPort);

        await page.goto(options.url,{
            waitUntil: ['networkidle0','domcontentloaded'],
        });
        // await timeout(1000);
        const screenShot = await page.screenshot( { clip: options.clip } );
        await page.close();
        console.log(`SCREENSHOT ${options.imageFileName}(${screenShot.length}) in ${ELAPSED(ts)}ms`);

        res.contentType('image/png');
        res.send(screenShot);
    } catch (err) {
        console.error('Unable to process chromium data:',err);
        return ReE(res, "Error occurred trying to process data sent to chromium");
    }

};
const viewPage = async function (req,res){

    let options;
    try {
        options = JSON.parse(req.query.options);
    } catch(e) {
        return ReE(res, "Unable to parse puppeteerOptions", 422);
    }
    if (!options || !options.url) return ReE(res, "Invalid puppeteerOptions", 422);

    try {
        const ts = process.hrtime();
        const page = await browser.newPage();
        //page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        await page.goto(options.url);
        await timeout(1500);
        await page.close();
        console.log(`PAGEVIEW ${options.url} in ${ELAPSED(ts)}ms`);
        return ReS(res,{});
    }catch (err) {
        console.error('Unable to process chromium data:',err);
        return ReE(res, "Error occurred trying to process data sent to chromium");
    }

};
const viewPagePost = async function (req,res){
    let options;
    try {
        options = JSON.parse(req.query.options);
    } catch(e) {
        return ReE(res, "Unable to parse puppeteerOptions", 422);
    }
    if (!options || !options.url) return ReE(res, "Invalid puppeteerOptions", 422);

    try {
        const ts = process.hrtime();
        const page = await browser.newPage();

        await page.setRequestInterception(true);

        const d = req.body.data;
        page.once('request', request => {
            var data = {
                'method': 'POST',
                'postData': querystring.stringify({data:d}),
                'headers': {
                    ...request.headers(),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            };
            request.continue(data);

            // Immediately disable setRequestInterception, or all other requests will hang
            page.setRequestInterception(false);
        });
        await page.goto(options.url);
        await timeout(1500);
        await page.close();
        console.log(`PAGEVIEW ${options.url} in ${ELAPSED(ts)}ms`);
        return ReS(res,{});
    }catch (err) {
        console.error('Unable to process chromium data:',err);
        return ReE(res, "Error occurred trying to process data sent to chromium");
    }

};
const downloadPDF = async function (req, res) {
    let options;
    try {
        options = JSON.parse(req.query.options);
    } catch(e) {
        return ReE(res, "Unable to parse puppeteerOptions", 422);
    }
    if (!options || !options.url  || !options.width || !options.height) return ReE(res, "Invalid puppeteerOptions", 422);

    try {
        const page = await browser.newPage();
        //page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        await page.goto(options.url);

        let pdf = await page.pdf({
            width               : options.width,
            height              : options.height,
            landscape           : options.landscape,
            printBackground     : true,
            scale               : options.scale,
            margin              : { top: 0, right: 0, bottom: 0, left: 0 }
        });
        res.status(200);
        res.send(pdf);
        await page.close();
    } catch (e) {
        console.error('Unable to process chromium data:',e);
        return ReE(res, "Error occurred trying to process data sent to chromium");
    }
}
//
// ************************************   TEST
//
router.get('/test', test);
router.get('/test2', test2);

router.get('/getpage',  getPage);
router.get('/viewpage',  viewPage);
router.post('/viewpage',  viewPagePost);
router.get('/downloadPDF',  downloadPDF);

module.exports = router;
