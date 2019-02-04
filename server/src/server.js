import "@babel/polyfill";
const puppeteer = require('puppeteer');

async function getScreenShot(url) {
	try {
		const browser = await puppeteer.launch({headless:true});
		const page = await browser.newPage();
		await page.goto(url);
		var res = await page.screenshot({ encoding: "base64"});
		await browser.close();
		return res;
	}
	catch(e) {
		console.log("error: " + e);
		return 0;
	}
}

//test


const express = require('express')
const app = express()
const port = 2019
let count = 0;
app.get('/', async (req, res) => {
	count++;
	var response;
	try {
		response = await  getScreenShot(req.param('url'));
	}
	catch (e) {
		response = "error";
	}

	console.log( " visits: " + count);
	res.send(response);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))