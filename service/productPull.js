const fs = require('fs');

const baseUrl = `https://www.kupujemprodajem.com`;
const marinaUrls = [ '/kupatilo-i-oprema/kupatilski-namestaj/ormaric-za-kupatilo/oglas/140858295',
    '/foto-aparati-i-kamere/rasveta-blicevi-blic-glave-i-led/ring-light-12-led-prsten-svetlo/oglas/140754898',
    '/elektronika-i-komponente/video-nadzor/spoljna-ip-wifi-kamera-ptz-8mp/oglas/140754817',
    '/alati-i-orudja/elektricni-aku-alati/de-walt-srafilica-24v/oglas/140754660',
    '/alati-i-orudja/elektricne-busilice/elektricna-busilica-bosch-800w/oglas/140754619',
    '/alati-i-orudja/elektricni-aku-alati/de-walt-strafilica-36v-sa-nastavcima/oglas/140754569',
    '/alati-i-orudja/elektricni-aku-alati/makita-aku-srafilica-busilica-24v-pribor-2-baterije/oglas/140754527',
    '/alati-i-orudja/elektricni-aku-alati/aku-srafilica-i-busilica-makita-12v-sa-nastavcima-2-baterije/oglas/140754476',
    '/alati-i-orudja/elektricni-aku-alati/aku-Srafilica-busilica-bosch-26v-sa-nastavcima/oglas/140754425',
    '/alati-i-orudja/elektricni-aku-alati/makita-udarna-busilica-710w/oglas/140754380',
    '/alati-i-orudja/elektricne-brusilice/ceona-brusilica-bijaks-sa-priborom-makita/oglas/140754332',
    '/elektronika-i-komponente/video-nadzor/ip-camera-720-hd-sa-tri-antene/oglas/140754288',
    '/elektronika-i-komponente/video-nadzor/spoljna-ip-kamera-fullhd-wifi-3mpx/oglas/140754223',
    '/kompjuteri-desktop/3d-stampaci/wifi-repiter-pojacivac-signala-za-internet/oglas/140754144',
    '/nega-lica-tela-i-ulepsavanje/oprema-za-masazu/masazer-za-telo/oglas/140754060',
    '/nega-lica-tela-i-ulepsavanje/oprema-za-masazu/pistolj-masazer/oglas/140753962',
    '/motocikli-oprema-i-delovi/agregati/cerada-za-motor/oglas/140753864',
    '/automobili-oprema/alarmni-sistemi/univerzalana-multimedia-7-inca-gps-android/oglas/140753833',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/vodootporna-radio-stanica-toki-voki-baofeng-uv-9r-15w/oglas/140753777',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/dve-radio-stanice-baofeng-888s/oglas/140753696',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/vodootporna-radio-stanica-toki-voki-baofeng-uv-9r-10w/oglas/140753641',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/radio-stanica-baofeng-uv6r-snaga-7w/oglas/140753568',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/toki-voki-baofeng-uv-5r-dual-band-8w/oglas/140753513',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/baofeng-dual-band-radio-stanica-uv82/oglas/140753413',
    '/tv-i-video/smart-tv-box/smart-tv-box-t95/oglas/140750570',
    '/elektronika-i-komponente/video-nadzor/ip-spoljna-vodootporna-kamera-4g/oglas/140750484',
    '/automobili-oprema/sijalice-led-diode-i-trake/led-traka-za-unutrasnjost-auta/oglas/140750440',
    '/elektronika-i-komponente/video-nadzor/kamere-za-nadzor-set-od-4-kamere/oglas/140750355',
    '/tv-i-video/smart-tv-box/q-smart-tv-box/oglas/140750284',
    '/elektronika-i-komponente/interfoni/wifi-smart-kucno-zvono-sa-kamerom/oglas/140750189',
    '/bela-tehnika-i-kucni-aparati/kuhinjski-bojleri-i-slavine-sa-grejacem/protocni-termostaticni-bojler-delimano/oglas/140750115',
    '/alati-i-orudja/za-merenje/lasersi-metar-daljinometar/oglas/140750024',
    '/lov-i-ribolov/lov-optika-i-kamere/hc-700m-vildlife-camera-16mp/oglas/140749952',
    '/lov-i-ribolov/lov-optika-i-kamere/kamera-za-lov-hc-300m/oglas/140749802',
    '/lov-i-ribolov/lov-optika-i-kamere/lovacka-kamera-suntek-hc-801a/oglas/140749681',
    '/muzika-i-instrumenti/mikrofoni/mikrofon-shure-sm-beta-58a/oglas/140749548',
    '/muzika-i-instrumenti/mikrofoni/studijski-mikrofon-bm800/oglas/140749488',
    '/muzika-i-instrumenti/prof-studijska-oprema/refleksioni-filter/oglas/140749431',
    '/automobili-oprema/radio-cd-dvd-za-auto-delovi/led-diode-za-auto/oglas/140749381',
    '/lov-i-ribolov/lov-lampe/lampa-za-glavu-sa-8-dioda/oglas/140749343',
    '/automobili-oprema/radio-cd-dvd-za-auto-delovi/radio-za-automobil/oglas/140749268',
    '/muzika-i-instrumenti/mikrofoni/studijski-mikrofon-bm800-sa-miksetom/oglas/140749183',
    '/muzika-i-instrumenti/ozvucenja-miksete/v8-live-sound-card-mikseta/oglas/140749115',
    '/sport-i-razonoda/dvogledi-durbini-i-teleskopi/binculars-mini-dvogled/oglas/140749049',
    '/lov-i-ribolov/lov-lampe/lampa-za-pusku-sa-dve-i-sa-tri-baterije/oglas/140749003',
    '/muzika-i-instrumenti/mikrofoni/mikrofon-shure-sm58/oglas/140748939',
    '/automobili-oprema/alarmni-sistemi/elektricna-pumpa-za-gorivo/oglas/140748898',
    '/automobili-oprema/alarmni-sistemi/multimedija-univerzalna-10-inca/oglas/140748859',
    '/mobilni-tel-oprema-i-delovi/acer-oprema-i-delovi/uvelicavajuci-ekran-za-mobilni-telefon/oglas/140748790',
    '/lov-i-ribolov/lov-optika-i-kamere/lovacka-kamera-huntcam-hc-801m/oglas/140748688',
    '/lov-i-ribolov/lov-optika-i-kamere/kamera-za-lov-ht-001/oglas/140748500',
    '/mama-i-beba/zastita-i-nadzor-beba/bebi-monitor-kamera-vb602/oglas/140748422',
    '/bela-tehnika-i-kucni-aparati/kuhinjski-bojleri-i-slavine-sa-grejacem/delimano-slavina-i-protocni-bojler-2-u-1/oglas/140748339',
    '/mama-i-beba/zastita-i-nadzor-beba/bebi-monitor-kamera-vb601/oglas/140748253',
    '/lov-i-ribolov/lov-optika-i-kamere/bushnell-opticki-nisan-3-9x40-eg/oglas/140748201',
    '/bela-tehnika-i-kucni-aparati/kuhinjski-bojleri-i-slavine-sa-grejacem/delimano-slavina-i-protocni-bojler-2-u-1/oglas/140748146',
    '/elektro-i-rasveta/rasveta/solarne-lampe-za-dvoriste-6-komada/oglas/140748077',
    '/elektro-i-rasveta/led-rasveta/led-traka-10-m/oglas/140748028',
    '/poljoprivreda/vodosnabdevanje-i-navodnjavanje/pumpa-za-vodu-0-55-kw/oglas/140747991',
    '/poljoprivreda/vodosnabdevanje-i-navodnjavanje/pumpa-za-vodu/oglas/140747958',
    '/poljoprivreda/vodosnabdevanje-i-navodnjavanje/pumpa-za-vodu-1-5kw/oglas/140747932',
    '/elektronika-i-komponente/lemilice-i-oprema/pistolj-lemilica-za-varenje-plastike-i-plasticnih-delova/oglas/140747908',
    '/automobili-oprema/alarmni-sistemi/presvlake-za-auto-sedista/oglas/140747837',
    '/alati-i-orudja/elektricne-brusilice/bosh-brusilica-1000w/oglas/140747802' ];

const loadProductList = async function (page) {
    // let urls = [
    //     'https://www.kupujemprodajem.com/marina/svi-oglasi/2169850/1?action=list&data%5Baction%5D=list&data%5B_user_name%5D=marina&data%5B_page_url%5D=marina%2Fsvi-oglasi%2F2169850%2F1&data%5Buser_id%5D=2169850&data%5Bpage%5D=1&data%5Blist_type%5D=user',
    //     'https://www.kupujemprodajem.com/marina/svi-oglasi/2169850/2?action=list&data%5Baction%5D=list&data%5B_user_name%5D=marina&data%5B_page_url%5D=marina%2Fsvi-oglasi%2F2169850%2F1&data%5Buser_id%5D=2169850&data%5Bpage%5D=2&data%5Blist_type%5D=user',
    //     'https://www.kupujemprodajem.com/marina/svi-oglasi/2169850/3?action=list&data%5Baction%5D=list&data%5B_user_name%5D=marina&data%5B_page_url%5D=marina%2Fsvi-oglasi%2F2169850%2F1&data%5Buser_id%5D=2169850&data%5Bpage%5D=3&data%5Blist_type%5D=user'
    // ];
    //
    // let links = [];
    // for (const url of urls) {
    //     await page.goto(url);
    //
    //     await page.waitForSelector('#adListContainer');
    //     await page.waitFor(5000);
    //
    //     let ads = await page.$$eval('a.adName', a => {
    //         return a.map(a=>a.getAttribute('href'));
    //     });
    //     links = links.concat(ads);
    // }
    //
    // console.log(links);
    let imageName = 1111;
    for (const marinaUrl of marinaUrls) {
        let product = await scrapePage(page,`${baseUrl}${marinaUrl}`);
        product = await pullImages(page, product, imageName);
        console.log("Finished product...", product.title);
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
