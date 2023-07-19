const puppeteer = require('puppeteer');


(async () => {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.whufc.com/news?category=All&page=0');

    while (true) {

        const articles = await page.evaluate(() => {
            const articles = [];
            document.querySelectorAll('.m-teaser__link').forEach((a) => {
                articles.push({
                    title: a.textContent.trim(),
                    link: a.href,
                });
            });
            console.log(document.querySelector('.m-pagination__icon--next a'))
            return articles;
        });
        console.log(articles);


        //if(!articles[1]) break;
        //page.click('.m-pagination__icon--next a');
        page.waitForNavigation();
        await page.click('.m-pagination__icon--next a')
        await page.waitForSelector('.m-pagination__icon--next a');

    }



    // // const pagination = document.querySelectorAll('.m-pagination__icon--next');
    // // console.log('pagination')
    // // //if (pagination == undefined) break;
    // // page.click(pagination);
    // // console.log(articles);
    // // console.log('---------------------------------');
    // browser.click(document.querySelectorAll('.m-pagination__icon--next')[0])

    await browser.close();
})();