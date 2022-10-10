import puppeteer from 'puppeteer';
import { NextApiRequest, NextApiResponse } from 'next'

export const getTotalWallets = async () => {
  const browserlessAPI = process.env.BROWSERLESS_API_KEY;
  const browser = await puppeteer.connect({ browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessAPI}` });
  const page = await browser.newPage();
  await page.goto('https://explorer.bitquery.io/bsc/token/0x6dd60afb2586d31bf390450adf5e6a9659d48c4a');

  const token = await page.evaluate(() =>{
    return{
      uniqueWallets: document.querySelector('body > div:nth-child(4) > div:nth-child(5) > div > div:nth-child(3) > div > div.card-body > div > div:nth-child(1) > div > div.table-responsive > table > tbody > tr:nth-child(3) > td:nth-child(2) > span')?.innerHTML,
    };
  });

  await browser.close();
  return token
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (res: NextApiResponse) => {

  const token = await getTotalWallets();
  return res.end(token)

};