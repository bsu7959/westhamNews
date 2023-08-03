
const puppeteer = require('puppeteer');
const fs = require('fs');
let data = require('./test.json'); // 크롤링해둔 json파일 불러오기

const saved_data = 'test.json';

const page_limit = 2; // 페이지 갯수


let present_page = 0;
let isDone = false;

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
    while (present_page < page_limit && !isDone) {

        await page.waitForTimeout(5000);

        const articles = await page.evaluate(() => {
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

        //titles = titles.concat(articles);
        // articles.forEach((el) => {
        //     if(el.title == data[0].title) {
        //         isDone = true;
        //         console.log('isdone')
        //     }else if(!isDone) {
        //         titles.push(el)
        //     }
        // })
        for(let i=0; i<articles.length; i++) {
            if(data.length > 0) {
                if(articles[i].title == data[0].title) {
                    isDone = true;
                    console.log('isdone');
                    break;
                }else {
                    titles.push(articles[i])
                }
            }else {
                titles.push(articles[i])
            }

        }
        present_page++;

        if (isDone || present_page == page_limit) break;


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
            articles_content.content = content;

            return articles_content;
        });
        titles[now].content = articles_content.content;

        console.log(titles[now])
        now++;
    }
    const added_data = titles.concat(data)

    fs.writeFile(saved_data, JSON.stringify(added_data), function (err) {
        console.log('파일 생성 완료')
    })

    await browser.close();
})();