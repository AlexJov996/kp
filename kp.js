const userActions = require('./service/userActions');
const productPull = require('./service/productPull');
const DBModels = require('./models');
const CONFIG = require('./config');
const appEvent = require('./service/app.events');


// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require('puppeteer-extra');

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteer.use(StealthPlugin());
puppeteer.use(
    AdblockerPlugin({
        // Optionally enable Cooperative Mode for several request interceptors
        interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
    })
);
databaseConnection();

appEvent.on('dbConnected', function (){
    // That's it, the rest is puppeteer usage as normal 😊
    puppeteer.launch({ headless: false }).then(async browser => {
        const page = await browser.newPage();
        await page.setViewport({ width: 800, height: 600 });


        await userActions.start(page);
        // await userActions.writeDataToDB(page);
        // await userActions.removeProducts(page);
        // await productPull.loadProductList(page);
        // await productPull.pullImagesFromObj(page);
        console.log(`All done ✨`);
        await browser.close();
    });
});


function databaseConnection () {
    DBModels.sequelize.authenticate().then(() => {
        console.log('Connected to SQL database:' + CONFIG.db_name);
        appEvent.emit('dbConnected');
    }).catch(err => {
        console.error('Unable to connect to SQL database ' + CONFIG.db_name, err);
    });
}