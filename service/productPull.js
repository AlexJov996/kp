const fs = require('fs');

const baseUrl = `https://www.kupujemprodajem.com`;
const marinaUrls = [
    '/foto-aparati-i-kamere/rasveta-blicevi-blic-glave-i-led/ring-light-12-led-prsten-svetlo/oglas/139982869',
    '/elektronika-i-komponente/video-nadzor/spoljna-ip-wifi-kamera-ptz-8mp/oglas/139982801',
    '/alati-i-orudja/elektricni-aku-alati/de-walt-srafilica-24v/oglas/139982630',
    '/alati-i-orudja/elektricne-busilice/elektricna-busilica-bosch-800w/oglas/139982584',
    '/alati-i-orudja/elektricni-aku-alati/de-walt-strafilica-36v-sa-nastavcima/oglas/139982537',
    '/alati-i-orudja/elektricni-aku-alati/makita-aku-srafilica-busilica-24v-pribor-2-baterije/oglas/139982507',
    '/alati-i-orudja/elektricni-aku-alati/aku-srafilica-i-busilica-makita-12v-sa-nastavcima-2-baterije/oglas/139982460',
    '/alati-i-orudja/elektricni-aku-alati/aku-Srafilica-busilica-bosch-26v-sa-nastavcima/oglas/139982401',
    '/alati-i-orudja/elektricni-aku-alati/makita-udarna-busilica-710w/oglas/139982356',
    '/alati-i-orudja/elektricne-brusilice/ceona-brusilica-bijaks-sa-priborom-makita/oglas/139982302',
    '/elektronika-i-komponente/video-nadzor/ip-camera-720-hd-sa-tri-antene/oglas/139982254',
    '/elektronika-i-komponente/video-nadzor/spoljna-ip-kamera-fullhd-wifi-3mpx/oglas/139982190',
    '/kompjuteri-desktop/3d-stampaci/wifi-repiter-pojacivac-signala-za-internet/oglas/139982111',
    '/nega-lica-tela-i-ulepsavanje/oprema-za-masazu/masazer-za-telo/oglas/139982041',
    '/nega-lica-tela-i-ulepsavanje/oprema-za-masazu/pistolj-masazer/oglas/139981963',
    '/motocikli-oprema-i-delovi/agregati/cerada-za-motor/oglas/139981872',
    '/automobili-oprema/alarmni-sistemi/univerzalana-multimedia-7-inca-gps-android/oglas/139981834',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/vodootporna-radio-stanica-toki-voki-baofeng-uv-9r-15w/oglas/139981785',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/dve-radio-stanice-baofeng-888s/oglas/139981707',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/vodootporna-radio-stanica-toki-voki-baofeng-uv-9r-10w/oglas/139981649',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/radio-stanica-baofeng-uv6r-snaga-7w/oglas/139981565',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/toki-voki-baofeng-uv-5r-dual-band-8w/oglas/139981480',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/baofeng-dual-band-radio-stanica-uv82/oglas/139981188',
    '/tv-i-video/smart-tv-box/smart-tv-box-t95/oglas/139981096',
    '/elektronika-i-komponente/video-nadzor/ip-spoljna-vodootporna-kamera-4g/oglas/139981020',
    '/automobili-oprema/sijalice-led-diode-i-trake/led-traka-za-unutrasnjost-auta/oglas/139980976',
    '/elektronika-i-komponente/video-nadzor/kamere-za-nadzor-set-od-4-kamere/oglas/139980891',
    '/tv-i-video/smart-tv-box/q-smart-tv-box/oglas/139980794',
    '/elektronika-i-komponente/interfoni/wifi-smart-kucno-zvono-sa-kamerom/oglas/139980665',
    '/bela-tehnika-i-kucni-aparati/kuhinjski-bojleri-i-slavine-sa-grejacem/protocni-termostaticni-bojler-delimano/oglas/139980603',
    '/alati-i-orudja/za-merenje/lasersi-metar-daljinometar/oglas/139980538',
    '/lov-i-ribolov/lov-optika-i-kamere/hc-700m-vildlife-camera-16mp/oglas/139980478',
    '/lov-i-ribolov/lov-optika-i-kamere/kamera-za-lov-hc-300m/oglas/139980335',
    '/lov-i-ribolov/lov-optika-i-kamere/lovacka-kamera-suntek-hc-801a/oglas/139980246',
    '/muzika-i-instrumenti/mikrofoni/mikrofon-shure-sm-beta-58a/oglas/139980127',
    '/muzika-i-instrumenti/mikrofoni/studijski-mikrofon-bm800/oglas/139980085',
    '/muzika-i-instrumenti/prof-studijska-oprema/refleksioni-filter/oglas/139980028',
    '/automobili-oprema/radio-cd-dvd-za-auto-delovi/led-diode-za-auto/oglas/139979971',
    '/lov-i-ribolov/lov-lampe/lampa-za-glavu-sa-8-dioda/oglas/139979931',
    '/automobili-oprema/radio-cd-dvd-za-auto-delovi/radio-za-automobil/oglas/139979865',
    '/muzika-i-instrumenti/mikrofoni/studijski-mikrofon-bm800-sa-miksetom/oglas/139979791',
    '/muzika-i-instrumenti/ozvucenja-miksete/v8-live-sound-card-mikseta/oglas/139979732',
    '/sport-i-razonoda/dvogledi-durbini-i-teleskopi/binculars-mini-dvogled/oglas/139979659',
    '/lov-i-ribolov/lov-lampe/lampa-za-pusku-sa-dve-i-sa-tri-baterije/oglas/139979613',
    '/muzika-i-instrumenti/mikrofoni/mikrofon-shure-sm58/oglas/139979544',
    '/automobili-oprema/alarmni-sistemi/elektricna-pumpa-za-gorivo/oglas/139979501',
    '/automobili-oprema/alarmni-sistemi/multimedija-univerzalna-10-inca/oglas/139979454',
    '/mobilni-tel-oprema-i-delovi/acer-oprema-i-delovi/uvelicavajuci-ekran-za-mobilni-telefon/oglas/139979377',
    '/lov-i-ribolov/lov-optika-i-kamere/lovacka-kamera-huntcam-hc-801m/oglas/139979280',
    '/lov-i-ribolov/lov-optika-i-kamere/kamera-za-lov-ht-001/oglas/139979117',
    '/mama-i-beba/zastita-i-nadzor-beba/bebi-monitor-kamera-vb602/oglas/139979022',
    '/bela-tehnika-i-kucni-aparati/kuhinjski-bojleri-i-slavine-sa-grejacem/delimano-slavina-i-protocni-bojler-2-u-1/oglas/139978949',
    '/mama-i-beba/zastita-i-nadzor-beba/bebi-monitor-kamera-vb601/oglas/139978855',
    '/lov-i-ribolov/lov-optika-i-kamere/bushnell-opticki-nisan-3-9x40-eg/oglas/139978793',
    '/bela-tehnika-i-kucni-aparati/kuhinjski-bojleri-i-slavine-sa-grejacem/delimano-slavina-i-protocni-bojler-2-u-1/oglas/139978716',
    '/elektro-i-rasveta/rasveta/solarne-lampe-za-dvoriste-6-komada/oglas/139978243',
    '/elektro-i-rasveta/led-rasveta/led-traka-10-m/oglas/139978198',
    '/poljoprivreda/vodosnabdevanje-i-navodnjavanje/pumpa-za-vodu-0-55-kw/oglas/139978145',
    '/poljoprivreda/vodosnabdevanje-i-navodnjavanje/pumpa-za-vodu/oglas/139978107',
    '/poljoprivreda/vodosnabdevanje-i-navodnjavanje/pumpa-za-vodu-1-5kw/oglas/139978037',
    '/elektronika-i-komponente/lemilice-i-oprema/pistolj-lemilica-za-varenje-plastike-i-plasticnih-delova/oglas/139977996',
    '/automobili-oprema/alarmni-sistemi/presvlake-za-auto-sedista/oglas/139977922',
    '/alati-i-orudja/elektricne-brusilice/bosh-brusilica-1000w/oglas/139977862' ];

const loadProductList = async function (page) {
    // let url = `https://www.kupujemprodajem.com/marina/svi-oglasi/2169850/1?action=list&data%5Baction%5D=list&data%5B_user_name%5D=marina&data%5B_page_url%5D=marina%2Fsvi-oglasi%2F2169850%2F1&data%5Buser_id%5D=2169850&data%5Bpage%5D=1&data%5Blist_type%5D=user`;
    //
    // await page.goto(url);
    //
    // await page.waitForSelector('#adListContainer');
    // await page.waitFor(5000);
    //
    // let ads = await page.$$eval('a.adName', a => {
    //     return a.map(a=>a.getAttribute('href'));
    // });
    //
    // console.log(ads[0].outerHTML)
    // console.log(ads[1].innerHTML)
    // console.log(ads)
    let imageName = 1111;
    for (const marinaUrl of marinaUrls) {
        let product = await scrapePage(page,`${baseUrl}${marinaUrl}`);
        product = await pullImages(page, product, imageName);
        console.log("Finished product...", product);
        imageName++;
        await writeToFile(product);
    }
};
exports.loadProductList = loadProductList;

const scrapePage = async function (page, url) {
    await page.goto(url);
    await page.waitFor(5000);

    const priceText = await page.$eval('h2.price-holder',el => el.innerHTML);
    const title = await page.$eval('h1.oglas-title',el => el.innerHTML);
    const imageUrls = await page.$$eval('#thumbsList > a', el => {
        return el.map(e => e.getAttribute('href'));
    })

    let product = {
        title: title,
        category:  await page.$$eval('.breadcrumbs > .crumbs', el => {
            return el.map(e => e.innerHTML);
        }),
        price: (priceText.split(' '))[1].replace("&nbsp;din","").replace('.',""),
        description: await page.$eval('div.oglas-description',el => el.innerHTML),
        images: imageUrls
    };
    product.description += `\n Kontakt telefon / Viber : 0628901036`;
    product.descriptionV2 = product.description.replace(/<\/?[^>]+(>|$)/g, "");
    return product

};

const writeToFile = async function(data) {
    let dataFile = fs.readFileSync(`data.json`);

    dataFile = JSON.parse(dataFile);
    dataFile.push(data);
    fs.writeFileSync(`data.json`, JSON.stringify(dataFile));
};
const pullImages = async function (page, product, num) {
    let imageName = num + '-';
    let images = [];
    if (product.images.length === 0) console.error("NO IMAGES IN PRODUCT",product.title)
    for (let i = 0; i < product.images.length; i++) {
        let viewSource = await page.goto("https:" + product.images[i]);
        await page.waitForTimeout(2000);

        fs.writeFileSync(`images/${imageName}${i}.jpg`, await viewSource.buffer());
        images.push(`${imageName}${i}.jpg`);
    }
    product.imagesUrls = images;
    if (images.length === 0) console.error("NO IMAGES",product.title);
    return product;
};
