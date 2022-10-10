import puppeteer from 'puppeteer';
import { NextApiRequest, NextApiResponse } from 'next'

export const getDetails = async () => {
  const browserlessAPI = process.env.BROWSERLESS_API_KEY;
  const browser = await puppeteer.connect({ browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessAPI}` });
  const page = await browser.newPage();
  await page.goto('https://bscscan.com/address/0x6dd60afb2586d31bf390450adf5e6a9659d48c4a');

  const token = await page.evaluate(() =>{
    return{
      name: document.querySelector('#ContentPlaceHolder1_tr_tokeninfo > div > div.col-md-8 > a')?.innerHTML,
      value: document.querySelector('#ContentPlaceHolder1_tr_tokeninfo > div > div.col-md-8 > span')?.innerHTML,
      creator: document.querySelector('#ContentPlaceHolder1_trContract > div > div.col-md-8 > a')?.innerHTML,
    };
  });

  await browser.close();
  return token
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (res: NextApiResponse) => {

  const token = await getDetails();
  return res.end(token)

};