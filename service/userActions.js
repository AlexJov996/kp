const fs = require("fs");
const player = require('play-sound')(opts = {});

const publishProductFlow = async function (page) {

    await loginToKP(page);
    const products = await readData();

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        try {
            console.log(`Started product (${i+1} / ${products.length})`, product.title);
            await startNewProductWizard(page);
            await firstStepOfWizzard(page, product);
            await secondStepOfWizzard(page, product);
            await thirdStepOfWizzard(page);
            await lastStepOfWizzard(page);
            console.log(`Finished product (${i+1} / ${products.length})`, product.title);

        } catch (e) {
            player.play('alarm.mp3', function(err){
                if (err) throw err;
            })
            throw e;
        }

    }

};
exports.start = publishProductFlow;

const loginToKP = async function (page) {
    console.log(`Open KP login..`);

    await page.goto('https://www.kupujemprodajem.com/login');
    await page.waitForTimeout(2000);

    let emailInput = await page.$('#email');
    let passwordInput = await page.$('#password');
    if (emailInput && passwordInput) {
        console.log('Login page..');
        await page.type('#email', 'marina.nikolic1995@yahoo.com',{ delay: 100 });
        await page.type('#password', 'sasauto1996',{ delay: 100 });
        // await page.$eval('#email', el => el.value = 'sale.tkd.lesa@gmail.com');
        // await page.$eval('#password', el => el.value = 'Lesa159753');

        await page.click('#submitButton');
        await page.waitForTimeout(2000);
    } else {
        console.log('Not login page..');
    }
    return page;
};
exports.login = loginToKP;

const startNewProductWizard = async function (page) {
    const url = await page.evaluate(() => document.location.href);
    const isWelcomePage = url.includes('user.php');

    if (!isWelcomePage) {
        page.goto('https://www.kupujemprodajem.com/user.php?action=welcome');
        await page.waitFor(5000);
    }

    await page.click("a[href='/oglasi.php?action=new']");
    await page.waitForTimeout(2000);
    const newUrl = await page.evaluate(() => document.location.href);
    const isWizardPage = newUrl.includes('oglasi.php');
    if (!isWizardPage) {
        page.goto('https://www.kupujemprodajem.com/oglasi.php?action=new');
        await page.waitForTimeout(2000);

    }

    return page;

};
exports.goToWizard  = startNewProductWizard;

const firstStepOfWizzard = async function (page, product) {
    console.log("First step");

    const url = await page.evaluate(() => document.location.href);
    const isNewProductPage = url.includes('oglasi.php?action=new');

    await page.type("input[id='data[group_suggest_text]']", product.title,{ delay: 100 });
    await page.waitForTimeout(2000);
    await page.click("input[id='data[ad_kind]goods']");
    await page.waitForTimeout(2000);
    if (product.category[0].includes('|')) {
        let categorySections = product.category[0].split('|');
        await page.type("div.uiMenuButtonSelectionHolder input.mg-field", categorySections[0],{ delay: 100 });
        await page.waitForTimeout(2000);

        await page.$eval(`div[data-text="${product.category[0]}"]`, el => el.click());
        await page.waitForTimeout(2000);

    } else {
        await page.type("div.uiMenuButtonSelectionHolder input.mg-field", product.category[0],{ delay: 100 });

    }
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    if (product.category[1].includes('|')) {
        let subCategorySections = product.category[1].split('|');
        await page.type("#groupInsertSpot div.uiMenuButtonSelectionHolder input.mg-field", subCategorySections[0],{ delay: 100 });
        await page.waitForTimeout(2000);
        await page.$eval(`div[data-text="${product.category[1]}"]`, el => el.click());
        await page.waitForTimeout(2000);
    } else {
        await page.type("#groupInsertSpot div.uiMenuButtonSelectionHolder input.mg-field", product.category[1],{ delay: 100 });

    }
    await page.keyboard.press('Enter');

    await page.waitForTimeout(3000);

};
exports.firstStep = firstStepOfWizzard;

const secondStepOfWizzard = async function (page, product) {
    console.log("Second step");

    await page.click("input[id='data[condition]as-new']");

    await page.type("#price_number", product.price,{ delay: 100 });
    await page.click("#currency_rsd");
    //POPRAVI ZA EUR

    const elementHandle = await page.$(
        "iframe[id='data[description]_ifr']",
    );
    const frame = await elementHandle.contentFrame();
    // let text = 'Protočni termostatični bojler Delimano.  Delimano Bojler za kupatilo i kuhinju.  Različite vrste zaštite: zaštita od curenja, zaštita od suvog grejanja, izolacija električne energije, automatsko isključivanje u praznom hodu, automatsko isključivanje od pregrevanja.      -  Nema potrebe za skladištenjem vode, nema potrebe za grejanjem, uštedom energije i zaštitom životne sredine.      - Održavanje konstantne temperature na optimalnoj temperaturi vode za Vas.      - Malih dimenzija, ušteda energije i visoka efikasnost.      - Digitalni LCD prikaz temperature.      Napomena- Strogo zabranjeno stavljati ga sa strane / vodoravno / naopako.      - Prva instalacija mora biti voda, a zatim uključitiTermostaticki grejac vode-Snaga: 3500W-Voltaža : 220V~-Vodootpornost : IPx4-Pritisak : 0Pa-Servisni pritisak : 0.04-0,4mpa-Protok pročišćene vode iznosi : ( 8 L ) u Minuti-Primenjiva temperatura prečišćavanja vode : 5*C - 60*C-Primenjiva temperatura prečišćavanja vode : 5*C - 60*C-Ukupna neto zapremina vode : 50000 L';

    await frame.type('#tinymce',product.description, { delay: 50 });
    // await frame.$eval('#tinymce', (el, product) => el.value = product.description, product);

    await page.waitForSelector("#upload_file");
    const input = await page.$("#upload_file");
    for (const img of product.imagesUrls) {
        await input.uploadFile("./images/"+img);
    }
    await page.waitForTimeout(6000);

    await page.click("div.slide-info-top-buttons  input[action-name='adInfoNextButton']");
    await page.waitForTimeout(3000);

};
exports.secondStep = secondStepOfWizzard;

const thirdStepOfWizzard = async function (page) {
    console.log("Third step");
    await page.click("div.slide-promo-top-buttons  input[action-name='adPromoNextButton']");
    await page.waitForTimeout(3000);

};
exports.thirdStep = thirdStepOfWizzard;

const lastStepOfWizzard = async function (page) {
    console.log("Final step");

    await page.click("#accept_yes");
    await page.click("div.slide-declaration-top-buttons  input[action-name='adDeclarationPostButton']");
    await page.waitForTimeout(6000);


};
exports.lastStep = lastStepOfWizzard;

const readData = function () {
    let dataFile = fs.readFileSync(`data.json`);

    dataFile = JSON.parse(dataFile);
    return dataFile;
};
exports.readData = readData;

const removeProducts = async function (page) {

    await loginToKP(page);

    await page.goto('https://www.kupujemprodajem.com/user.php?action=welcome');
    await page.waitForTimeout(2000);

    while (urls = await page.$$(' a[href*="delete"]')){
        const url = urls[0];
        await url.click();
        const linkPromise = await url.getProperty('href');
        const link = await linkPromise.jsonValue();
        await page.waitForTimeout(5000);
        const frame = page.frames().find(frame => frame.url() === link);
        await frame.click('input[value="other"]');
        await page.waitForTimeout(1000);

        await frame.click('input[value=" Obriši "]');

        await page.waitForTimeout(5000);
    }

};
exports.removeProducts = removeProducts;