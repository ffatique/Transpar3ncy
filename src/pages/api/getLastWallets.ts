import puppeteer from 'puppeteer';
import { NextApiRequest, NextApiResponse } from 'next';
import { format, startOfYesterday, add } from 'date-fns';

export const getLastWallets = async () => {
  const browserlessAPI = process.env.BROWSERLESS_API_KEY;
  const browser = await puppeteer.connect({ browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessAPI}` });
  const startYesterday = startOfYesterday();
  const yesterdayMore = add(startYesterday,{days:1});
  const formated = format(yesterdayMore,'yyyy-MM-dd');
  const page = await browser.newPage();
  await page.goto(`https://explorer.bitquery.io/bsc/token/0x6dd60afb2586d31bf390450adf5e6a9659d48c4a/receivers?from=${formated}&till=${formated}`);
  
  await page.click('body > div:nth-child(4) > div:nth-child(5) > div:nth-child(4) > div:nth-child(1) > div > div.card-body > div > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(1) > div > svg > g:nth-child(3) > g:nth-child(3) > path');
  await page.waitForTimeout(50);
  const token = await page.evaluate(() =>{
    return{
      lastDayUniqueWallets: document.querySelector('body > div:nth-child(4) > div:nth-child(5) > div:nth-child(4) > div:nth-child(1) > div > div.card-body > div > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(1) > div > svg > g:nth-child(5) > g > g:nth-child(3) > text:nth-child(2)')?.innerHTML,
    };
  });

  await browser.close();
  return token
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (res: NextApiResponse) => {

  const token = await getLastWallets();
  return res.end(token)

};