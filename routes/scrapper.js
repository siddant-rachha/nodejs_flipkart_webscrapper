const router = require("express").Router();
const path = require('path');
const puppeteer = require('puppeteer');
require("dotenv").config();


router.post("/scrapper", async (req, res) => {

    const url = req.body.link

    scrapeData(url)
        .then(() => console.log('Success!'))
        .catch((error) => res.json(error));

    function scrapeData(url) {

        return new Promise(async (resolve, reject) => {
            try {
                // Initiate the browser
                const browser = await puppeteer.launch({
                    headless:true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--single-process', // <- this one doesn't works in Windows
                        '--disable-gpu'
                      ],
                    
                        executablePath:
                            process.env.NODE_ENV === "production"
                                ? process.env.PUPPETEER_EXECUTABLE_PATH
                                : puppeteer.executablePath()
                    });
                // Create a new page with the default browser context
                const page = await browser.newPage();
                // Go to the target website
                await page.goto(url, { waitUntil: 'domcontentloaded' })


                // Use Puppeteer's API to extract the product price
                const priceElement = await page.$('div._30jeq3._16Jk6d');
                let price = "not present"
                if (priceElement != null) {
                    price = await page.evaluate(element => element.textContent, priceElement);
                }

                // Use Puppeteer's API to extract the product name
                const nameElement = await page.$('span.B_NuCI');
                let name = "not present"
                if (nameElement != null) {
                    name = await page.evaluate(element => element.textContent, nameElement);
                }

                // Use Puppeteer's API to extract the product description
                const descElement = await page.$('div._1mXcCf');
                let description = "not present"
                if (descElement != null) {
                    description = await page.evaluate(element => element.textContent, descElement);
                }

                // Use Puppeteer's API to extract the product ratings
                const ratingsElement = await page.$('div._3LWZlK');
                let ratings = "not present"
                if (ratingsElement != null) {
                    ratings = await page.evaluate(element => element.textContent, ratingsElement);
                }

                // Closes the browser and all of its pages
                await browser.close();
                resolve();
                res.json({
                    price: price,
                    name: name,
                    description: description,
                    ratings: ratings
                })
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });

    }

})


router.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
})

module.exports = router;