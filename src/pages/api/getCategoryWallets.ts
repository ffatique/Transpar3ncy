import puppeteer from 'puppeteer';
import { NextApiRequest, NextApiResponse } from 'next'

export const getCategoryWallets = async () => {
  const browserlessAPI = process.env.BROWSERLESS_API_KEY;
  const browser = await puppeteer.connect({ browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessAPI}` });
  const page = await browser.newPage();
  await page.goto('https://bscscan.com/token/tokenholderchart/0x6dd60afb2586d31bf390450adf5e6a9659d48c4a?range=100');
  
  const walletList = await page.evaluate(() => {
      
    const nodeList = document.querySelectorAll('#ContentPlaceHolder1_resultrows > table > tbody > tr');
    const walletsArray = [...nodeList]

    const list = walletsArray.map( wallet => ({
      position: wallet.querySelector('td')?.innerHTML,
      address: wallet.querySelector('a')?.innerHTML,
      tokens: wallet.querySelector('td:nth-child(3)')?.innerHTML,
      percent: wallet.querySelector('td:nth-child(4)')?.innerHTML,
    }))
    return list
  })
  
  await browser.close();
  return walletList
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (res: NextApiResponse) => {

  const walletList = await getCategoryWallets();
  return res.end(walletList)

};