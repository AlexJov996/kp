const fs = require("fs");
const player = require('play-sound')(opts = {});
const {User, Product} = require('../models');

const publishProductFlow = async function (page) {

    const user = await loginToKP(page,'sale.tkd.lesa@gmail.com');
    const products = await Product.findAll({ where: { userId: user.id }}).catch(e => console.error('GET ALL products', e));

    for (let i = 0; i < 1; i++) {
        const product = products[i];
        try {
            console.log(`Started product (${i+1} / ${products.length})`, product.title);
            await startNewProductWizard(page);
            await firstStepOfWizzard(page, product);
            await secondStepOfWizzard(page, product);
            // await thirdStepOfWizzard(page);
            // await lastStepOfWizzard(page);
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

const loginToKP = async function (page, email) {
    console.log(`Open KP login..`);
    const user = await User.findOne({ where: { email: email }}).catch(e => console.error('USER get', e));
    if (!user) return false;

    await page.goto('https://novi.kupujemprodajem.com/login');
    await page.waitForTimeout(2000);

    let emailInput = await page.$('#email');
    let passwordInput = await page.$('#password');
    if (emailInput && passwordInput) {
        console.log('Login page..');
        await page.type('#email', user.email ,{ delay: 100 });
        await page.type('#password', user.password ,{ delay: 100 });
        // await page.type('#email', 'marina.nikolic1995@yahoo.com',{ delay: 100 });
        //         await page.type('#password', 'sasauto1996',{ delay: 100 });

        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);
    } else {
        console.log('Not login page..');
    }
    return user;
};
exports.login = loginToKP;

const startNewProductWizard = async function (page) {
    const url = await page.evaluate(() => document.location.href);
    const isWelcomePage = url.includes('user.php');

    if (!isWelcomePage) {
        page.goto('https://www.kupujemprodajem.com/user.php?action=welcome');
        await page.waitFor(5000);
    }

    await page.click("a[href='/postavljanje-oglasa']");
    await page.waitForTimeout(2000);
    const newUrl = await page.evaluate(() => document.location.href);
    const isWizardPage = newUrl.includes('postavljanje-oglasa');
    if (!isWizardPage) {
        page.goto('https://novi.kupujemprodajem.com/postavljanje-oglasa');
        await page.waitForTimeout(2000);

    }

    return page;

};
exports.goToWizard  = startNewProductWizard;

const firstStepOfWizzard = async function (page, product) {
    console.log("First step");

    const url = await page.evaluate(() => document.location.href);
    const isNewProductPage = url.includes('oglasi.php?action=new');

    await page.type("input[id='groupSuggestText']", product.title,{ delay: 100 });
    await page.waitForTimeout(2000);
    await page.click("input[value='goods']");
    await page.waitForTimeout(2000);

    await page.type('input[aria-describedby="react-select-categoryId-placeholder"]', product.category[0],{ delay: 100 });
    await page.waitForTimeout(2000);
    await page.$eval(`div[id="react-select-categoryId-option-0"]`, el => el.click());
    await page.waitForTimeout(2000);

    await page.keyboard.type( product.category[1],{ delay: 100 });

    await page.keyboard.press('Enter');

    await page.waitForTimeout(2000);

};
exports.firstStep = firstStepOfWizzard;

const secondStepOfWizzard = async function (page, product) {
    console.log("Second step");

    const [button] = await page.$x("//p[contains(., 'Kao novo')]");
    console.log(1)
    if (button) {
        await button.click();
        console.log(2)

    }
    if (!product.price) product.price = "1000";
    await page.type("#price", product.price,{ delay: 100 });
    console.log(3)

    await page.click('input[value="rsd"]');
    console.log(4)

    //POPRAVI ZA EUR
    await page.waitForSelector("iframe[id='text-field-editor_ifr']");
    const elementHandle = await page.$(
        "iframe[id='text-field-editor_ifr']",
    );
    console.log(5)

    const frame = await elementHandle.contentFrame();
    // let text = 'Protočni termostatični bojler Delimano.  Delimano Bojler za kupatilo i kuhinju.  Različite vrste zaštite: zaštita od curenja, zaštita od suvog grejanja, izolacija električne energije, automatsko isključivanje u praznom hodu, automatsko isključivanje od pregrevanja.      -  Nema potrebe za skladištenjem vode, nema potrebe za grejanjem, uštedom energije i zaštitom životne sredine.      - Održavanje konstantne temperature na optimalnoj temperaturi vode za Vas.      - Malih dimenzija, ušteda energije i visoka efikasnost.      - Digitalni LCD prikaz temperature.      Napomena- Strogo zabranjeno stavljati ga sa strane / vodoravno / naopako.      - Prva instalacija mora biti voda, a zatim uključitiTermostaticki grejac vode-Snaga: 3500W-Voltaža : 220V~-Vodootpornost : IPx4-Pritisak : 0Pa-Servisni pritisak : 0.04-0,4mpa-Protok pročišćene vode iznosi : ( 8 L ) u Minuti-Primenjiva temperatura prečišćavanja vode : 5*C - 60*C-Primenjiva temperatura prečišćavanja vode : 5*C - 60*C-Ukupna neto zapremina vode : 50000 L';
    console.log(6)
    await frame.waitForSelector("#tinymce");

    await frame.type('#tinymce',product.description, { delay: 50 });
    // await frame.$eval('#tinymce', (el, product) => el.value = product.description, product);
    console.log(7)

    const input = await page.$("input[type='file']");
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

exports.writeDataToDB = async function () {
    const userObj = {
        fullName: 'Aleksandar Jovanovic',
        email: 'sale.tkd.lesa@gmail.com',
        password: 'Lesa159753'
    };

    let user;

    user = await User.findOne({ where: {email: userObj.email}}).catch(e => {console.error('GET error', e)});

    if (!user) {
        user = await User.create(userObj).catch(e => {console.error('CREATE user error', e)});
    }

    const products = await readData();


    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        product.userId = user.id;
        try {
            console.log(`Started product (${i+1} / ${products.length})`, product.title);
            let productCreated = await Product.create(product).catch(e => {console.error('CREATE post error', e)});
            console.log(`Finished product (${i+1} / ${products.length})`, product.title);

        } catch (e) {
            // player.play('alarm.mp3', function(err){
            //     if (err) throw err;
            // })
            throw e;
        }

    }

}