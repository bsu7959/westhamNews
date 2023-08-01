
const puppeteer = require('puppeteer');

const page_limit = 2; // 페이지 갯수
let present_page = 0;
// const map = async (titles) => {
//     console.log(1)
//     //await page.waitForNavigation();
//    console.log('2')

//     const promises = titles.map(async (el) => {
//         //console.log(el)
//         await page.goto(el.link);
//         const contents = [];
//         document.querySelectorAll('.field__item p').forEach((a) => {
//             contents.push({
//                 contents: a.textContent
//             })
//         })
//         await page.waitForSelector('.m-back-to-top .button');
//         return contents;
//     })
//     console.log(promises);
//     // page.waitForNavigation();
//     // await page.goBack();
//     // await page.waitForSelector('.m-back-to-top .button');
// }
(async () => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1366,
        height: 5000
      });
    let titles = [];
    await page.goto('https://www.whufc.com/news?category=632&page=0');
    // 기사 목록 반복
    while (present_page < page_limit) {
        // try {
        //     await page.waitForNavigation();
        // }catch(e) {

        // }
        await page.waitForTimeout(5000);
        
        //let scroll_done = false;
        //await page.waitForSelector('.m-pagination__icon--next');
        // await page.evaluate(() => {
        //     let current = 0;
        //     while(current != window.innerHeight) {
                
        //         let next_cur = window.innerHeight;
        //         console.log('현재:'+current+' 다음:'+next_cur);
        //         window.scrollBy(current, next_cur);
        //         current = next_cur;
        //     }
        //     scroll_done = true;
        //     //window.scrollBy(0, window.innerHeight);
        // })
        // console.log(scroll_done)
        // while(!scroll_done) {
            //await page.waitForTimeout(1000)
            const articles = await page.evaluate(() => {
                // let infiniteScrollInterval = setInterval(async () => {
                //     window.scrollBy(0, window.innerHeight)
                // }, 500)
                // setTimeout(() => {
                //     clearInterval(infiniteScrollInterval);
                // },500*10)
    
                const articles = [];
    
                document.querySelectorAll('.o-news__listing article .m-teaser__link').forEach((a) => {
                    articles.push({
                        title: a.textContent.trim(),
                        link: a.href,
                        img: '',
                        content: '',
                    });
                });
                let nows = 0;
                document.querySelectorAll('.o-news__listing article .m-teaser__thumbnail img').forEach((img) => {
                    articles[nows].img = img.src;
                    nows++;
                });
    
                return articles;
                
            });
        //}
        titles = titles.concat(articles);

       
        present_page++;
        //if (present_page == page_limit-1) break;
        //await page.waitForNavigation();

        //await page.waitForTimeout(7000)
        //await page.waitForNavigation()
        await page.click('.m-pagination__icon--next a')
        await page.waitForSelector('.m-pagination__icon--next a');



    }

    let now = 0;

    // 기사 내부 반복
    while (now < titles.length) {
        console.log("now: " + now + "// articles: " + titles.length);
        console.log('title: ' + titles[now].title)
        await page.goto(titles[now].link);
        await page.waitForSelector('.m-back-to-top .button');
        const articles_content = await page.evaluate(() => {
            const articles_content = {
                img: '',
                content: ''
            };

            let content = '';
            document.querySelectorAll('.m-article__content .field__item p').forEach((p) => {
                content += p.textContent;
            });
            //articles_content.img = document.querySelector('.m-article__hero .field__item img').src;
            articles_content.content = content;

            return articles_content;
        });
        //titles[now].img = articles_content.img;
        titles[now].content = articles_content.content;

        console.log(titles[now])
        now++;
    }

    //await map(titles);




    // // const pagination = document.querySelectorAll('.m-pagination__icon--next');
    // // console.log('pagination')
    // // //if (pagination == undefined) break;
    // // page.click(pagination);
    // // console.log(articles);
    // // console.log('---------------------------------');
    // browser.click(document.querySelectorAll('.m-pagination__icon--next')[0])

    await browser.close();
})();