import puppeteer from 'puppeteer';
import { NextApiRequest, NextApiResponse } from 'next'

export const getInfo = async () => {
  const browserlessAPI = process.env.BROWSERLESS_API_KEY;
  const browser = await puppeteer.connect({ browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessAPI}` });
  const page = await browser.newPage();
  await page.goto('https://bscscan.com/token/0x6dd60afb2586d31bf390450adf5e6a9659d48c4a');

  const token = await page.evaluate(() =>{
    return{
      symbol: document.querySelector('#ContentPlaceHolder1_divSummary > div.row.mb-4 > div.col-md-6.mb-3.mb-md-0 > div > div.card-body > div.row.align-items-center > div.col-md-8.font-weight-medium > b')?.innerHTML,
      totalSupply: document.querySelector('#ContentPlaceHolder1_divSummary > div.row.mb-4 > div.col-md-6.mb-3.mb-md-0 > div > div.card-body > div.row.align-items-center > div.col-md-8.font-weight-medium > span.hash-tag.text-truncate')?.innerHTML,
      marketCap: document.querySelector('#pricebutton')?.innerHTML,
      decimals: document.querySelector('#ContentPlaceHolder1_trDecimals > div > div.col-md-8')?.innerHTML,
      holders: document.querySelector('#ContentPlaceHolder1_tr_tokenHolders > div > div.col-md-8 > div > div')?.innerHTML,
    };
  });

  await browser.close();
  return token
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (res: NextApiResponse) => {

  const token = await getInfo();
  return res.end(token)
};