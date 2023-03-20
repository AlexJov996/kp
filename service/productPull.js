const fs = require('fs');
const userAction = require('./userActions');

const baseUrl = `https://www.kupujemprodajem.com`;
const marinaUrls = [
  '/automobili-oprema/sijalice-led-diode-i-trake/led-diode-za-auto/oglas/148897608?filterId=2699886876',
    '/automobili-oprema/sijalice-led-diode-i-trake/led-traka-za-unutrasnjost-auta/oglas/148897587?filterId=2699886876',
    '/muzika-i-instrumenti/mikrofoni/mikrofon-shure-sm58/oglas/148897572?filterId=2699886876',
    '/motocikli-oprema-i-delovi/obezbedjenje-motocikala/cerada-za-motor/oglas/148897557?filterId=2699886876',
    '/automobili-oprema/multimedije-za-auto/multimedija-univerzalna-10-inca-gps-android/oglas/148897533?filterId=2699886876',
    '/lov-i-ribolov/lov-optika-i-kamere/bushnell-opticki-nisan-3-9x40-eg/oglas/148897519?filterId=2699886876',
    '/tv-i-video/smart-tv-box/q-smart-tv-box/oglas/148897501?filterId=2699886876',
    '/mobilni-tel-oprema-i-delovi/razna-oprema/uvelicavajuci-ekran-za-mobilni-telefon/oglas/148897491?filterId=2699886876',
    '/lov-i-ribolov/lov-lampe/lampa-za-pusku-sa-dve-i-sa-tri-baterije/oglas/148897472?filterId=2699886876',
    '/lov-i-ribolov/lov-optika-i-kamere/binculars-mini-dvogled/oglas/148897456?filterId=2699886876',
    '/lov-i-ribolov/lov-lampe/lampa-za-glavu-sa-8-dioda/oglas/148897441?filterId=2699886876',
    '/alati-i-orudja/elektricne-brusilice/nova-elektricna-brusilica-bosch/oglas/148897416?filterId=2699886876',
    '/elektronika-i-komponente/lemilice-i-oprema/pistolj-lemilica-za-varenje-plastike-i-plasticnih-delova/oglas/148897404?filterId=2699886876',
    '/alati-i-orudja/elektricne-brusilice/ceona-brusilica-bijaks-sa-priborom-makita/oglas/148897387?filterId=2699886876',
    '/alati-i-orudja/elektricni-aku-alati/makita-udarna-busilica-710w/oglas/148897376?filterId=2699886876',
    '/alati-i-orudja/elektricni-aku-alati/aku-srafilica-busilica-bosch-26v-sa-nastavcima/oglas/148897364?filterId=2699886876',
    '/alati-i-orudja/elektricni-aku-alati/aku-srafilica-i-busilica-makita-12v-sa-nastavcima/oglas/148897348?filterId=2699886876',
    '/elektronika-i-komponente/video-nadzor/wifi-smart-kucno-zvono-sa-kamerom/oglas/148897332?filterId=2699886876',
    '/elektronika-i-komponente/video-nadzor/kamere-za-video-nadzor/oglas/148897319?filterId=2699886876',
    '/elektronika-i-komponente/video-nadzor/spoljna-ip-wifi-kamera-ptz-8mp-10x-zoom/oglas/148897300?filterId=2699886876',
    '/elektronika-i-komponente/video-nadzor/ip-camera-720-hd-sa-tri-antene/oglas/148897288?filterId=2699886876',
    '/elektronika-i-komponente/video-nadzor/spoljna-ip-kamera-ip66-fullhd-wifi-3mpx/oglas/148897273?filterId=2699886876',
    '/automobili-oprema/radio-cd-i-dvd-za-auto/radio-za-auto-sa-bluetooth-poovezivanjem/oglas/148897256?filterId=2699886876',
    '/elektro-i-rasveta/led-rasveta/led-traka-10-m/oglas/148897242?filterId=2699886876',
    '/tv-i-video/delovi-i-oprema/drzac-za-tv-zglobni/oglas/148897221?filterId=2699886876',
    '/automobili-oprema/obavezna-oprema/prva-pomoc-set/oglas/148897179?filterId=2699886876',
    '/fitnes-i-vezbanje/steznici-pojasevi-stitnici-i-rukavice/pametnj-pojas-za-ledja/oglas/147644766?filterId=2699886876',
    '/alati-i-orudja/elektricne-brusilice/makita-aku-brusilica-sa-potenciometrom-2000w-128v/oglas/147644714?filterId=2699886876',
    '/alati-i-orudja/elektricni-aku-alati/makita-udarni-odvijac-128v/oglas/147644653?filterId=2699886876',
    '/lov-i-ribolov/lov-lampe/lampa-za-pusku-bailong/oglas/147644619?filterId=2699886876',
    '/muzika-i-instrumenti/mikrofoni-oprema-i-delovi/stalak-za-mikrofon/oglas/147644576?filterId=2699901471',
    '/elektro-i-rasveta/led-rasveta/ring-svelto-ring-ligh-velicine-12inch-30cm/oglas/147644530?filterId=2699901471',
    '/foto-aparati-i-kamere/rasveta-blicevi-blic-glave-i-led/ring-light-sa-stalkom/oglas/147643945?filterId=2699901471',
    '/alati-i-orudja/elektricne-testere-i-cirkulari/aku-testera-rucna-stihl-36v-550w/oglas/147643867?filterId=2699901471',
    '/alati-i-orudja/elektricni-aku-alati/dewalt-udarni-odvijac-128v/oglas/147643807?filterId=2699901471',
    '/alati-i-orudja/elektricni-aku-alati/makita-aku-srafilica-busilica-cekic-128v-pribor-2-baterije/oglas/147643749?filterId=2699901471',
    '/alati-i-orudja/elektricni-aku-alati/makita-aku-srafilica-brusilica-48v-sa-nastavcima/oglas/147643672?filterId=2699901471',
    '/alati-i-orudja/stolarski/frezeri-glodala-za-drvo/oglas/147643601?filterId=2699901471',
    '/alati-i-orudja/za-merenje/laserski-nivelator-lfine-llks-serije-4v1h1d/oglas/147643333?filterId=2699901471',
    '/alati-i-orudja/za-merenje/nivelator-llx-360-01-12liniski-3d/oglas/147643058?filterId=2699901471',
    '/sport-i-razonoda/dronovi/dron-a17s-wifi-hd-dual-kamera/oglas/147642879?filterId=2699901471',
    '/automobili-oprema/lanci-za-sneg/lanci-za-sneg/oglas/147642815?filterId=2699901471',
    '/alati-i-orudja/elektricne-busilice/elektricna-busilica-bosch-800w/oglas/147642751?filterId=2699901471',
    '/alati-i-orudja/elektricni-aku-alati/de-walt-srafilica-24v/oglas/147642691?filterId=2699901471',
    '/muzika-i-instrumenti/mikrofoni/mikrofon-shure-sm-beta-58a/oglas/147642598?filterId=2699901471',
    '/muzika-i-instrumenti/mikrofoni/studijski-mikrofon-bm800/oglas/147642505?filterId=2699901471',
    '/muzika-i-instrumenti/prof-studijska-oprema/refleksioni-filter/oglas/147642408?filterId=2699901471',
    '/muzika-i-instrumenti/ozvucenja-miksete/studijski-mikrofon-bm800-sa-miksetom/oglas/147642350?filterId=2699901471',
    '/muzika-i-instrumenti/ozvucenja-miksete/v8-live-sound-card-mikseta/oglas/147642279?filterId=2699901471',
    '/elektronika-i-komponente/moduli-za-samoizgradnju/radio-stanica-model-baofeng-bflf-918uv/oglas/147642197?filterId=2699901471',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/vodootporna-radio-stanica-toki-voki-baofeng-uv-9r-15w/oglas/147642078?filterId=2699901471',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/vodootporna-radio-stanica-toki-voki-baofeng-uv-9r-10w/oglas/147642020?filterId=2699901471',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/radio-stanica-baofeng-uv6r-snaga-7w/oglas/147641969?filterId=2699901471',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/toki-voki-baofeng-uv-5r-dual-band-8w/oglas/147623124?filterId=2699901471',
    '/elektronika-i-komponente/radio-primopredajnici-i-oprema/baofeng-dual-band-radio-stanica-uv82-8w/oglas/147623063?filterId=2699901471',
    '/bela-tehnika-i-kucni-aparati/kuhinjski-bojleri-i-slavine-sa-grejacem/delimano-slavina-i-protocni-bojler-2-u-1/oglas/147622982?filterId=2699901471',
    '/bela-tehnika-i-kucni-aparati/kuhinjski-bojleri-i-slavine-sa-grejacem/delimano-slavina-i-protocni-bojler-2-u-1/oglas/147622910?filterId=2699901471',
    '/bela-tehnika-i-kucni-aparati/kuhinjski-bojleri-i-slavine-sa-grejacem/protocni-termostaticni-bojler-delimano/oglas/147622826?filterId=2699901471',
    '/elektronika-i-komponente/video-nadzor/spoljna-vodootporna-ip-wifi-kamera-8mp-a15-icsee/oglas/147622694?filterId=2699901471',
    '/alati-i-orudja/za-merenje/laserski-metar-daljinometar/oglas/147622606?filterId=2699901471',
    '/nega-lica-tela-i-ulepsavanje/oprema-za-masazu/pistolj-za-masazu/oglas/147622532?filterId=2699889207',
    '/nega-lica-tela-i-ulepsavanje/oprema-za-masazu/masazer-za-telo/oglas/147622464?filterId=2699889207',
    '/kompjuteri-desktop/mrezni-uredjaji/wifi-repiter-pojacivac-signala-za-internet/oglas/147622391?filterId=2699889207',
    '/automobili-oprema/patosnice-presvlake-i-tapacirung/univerzalane-presvlake-za-auto-sedista/oglas/147622237?filterId=2699889207',
    '/automobili-oprema/ostalo/elektricna-pumpa-sluzi-za-pretakanje-goriva/oglas/147622157?filterId=2699889207' ];

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
    //     await page.waitForSelector('#__next');
    //     await page.waitFor(5000);
    //
    //     let ads = await page.$$eval('article.AdItem_adHolder__NoNLJ > a.Link_link__J4Qd8', a => {
    //         return a.map(a=>a.getAttribute('href'));
    //     });
    //     links = links.concat(ads);
    // }
    //
    // console.log(links.toString());
    // let imageName = 1111;
    // for (const marinaUrl of marinaUrls) {
    //     let product = await scrapePage(page,`${baseUrl}${marinaUrl}`);
    //     product = await pullImages(page, product, imageName);
    //     console.log("Finished product...", product.title);
    //     imageName++;
    //     await writeToFile(product);
    // }
};
exports.loadProductList = loadProductList;

const scrapePage = async function (page, url) {
    await page.goto(url);
    await page.waitFor(5000);

    const priceText = await page.$eval('h2.AdViewInfo_price__RLvIy',el => el.innerHTML);
    const title = await page.$eval('h1.AdViewInfo_name__ShcRk',el => el.innerHTML);
    const imageUrls = await page.$$eval('img.GallerySlideItem_imageGalleryImage__2eGga', el => {
        return el.map(e => e.getAttribute('src'));
    })

    let product = {
        title: title,
        category:  await page.$$eval('.BreadcrumbHolder_breadcrumb__KAsXr .Link_link__J4Qd8', el => {
            return el.map(e => e.innerHTML);
        }),
        price: (priceText.split(' '))[3].replace("&nbsp;din","").replace('.',"").replace('-->',''),
        description: await page.$eval('.AdViewDescription_descriptionHolder__SUMWu p',el => el.innerHTML),
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
        if (!product.images[i].includes('//')) continue;
        let viewSource = await page.goto(product.images[i]);
        await page.waitForTimeout(2000);

        console.log("https:" + product.images[i]);
        fs.writeFileSync(`images/${imageName}${i}.jpg`, await viewSource.buffer());
        console.log("saved");
        images.push(`${imageName}${i}.jpg`);
    }
    product.imagesUrls = images;
    if (images.length === 0) console.error("NO IMAGES",product.title);
    return product;
};

const pullImagesFromObj = async function (page) {
    let products = await userAction.readData();
    let num = 1111;

    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        console.log(`Procesing (${i}/${products.length}) with ${product.images.length} images`,num);
        product = await pullImages(page, product, num );
        num++;
    }

};
exports.pullImagesFromObj = pullImagesFromObj;
