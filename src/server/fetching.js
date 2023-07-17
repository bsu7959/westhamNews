const axios = require("axios");
const cheerio = require("cheerio");

let $title = [];
axios.get(`https://www.whufc.com/news`)
    .then(data => {
        const $ = cheerio.load(data.data);
        $('div.o-news__item h3.m-teaser__content-title').each((index, item) => {
            $title.push(item.children[0].data) 
        });
        console.log($title);
    });

 
