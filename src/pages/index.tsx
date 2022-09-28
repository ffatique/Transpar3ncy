import { GetServerSideProps } from 'next';
import Head from 'next/head';
import styles from '../styles/home.module.scss';
import { FaCopy } from 'react-icons/fa';
import { GoTriangleUp, GoTriangleDown } from 'react-icons/go';
import { BsCircleFill, BsCircleHalf, BsFillSquareFill, BsGraphDown } from 'react-icons/bs';
import { GiProgression } from 'react-icons/gi';
import { db } from '../services/firebaseConnection';
import { doc, getDocs, getDoc, where, collection, orderBy, query, limit, startAfter, endBefore} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { format, startOfYesterday } from 'date-fns';
const axios = require('axios');
const puppeteer = require('puppeteer');
import Image from 'next/future/image';
import binance from '../../public/images/binance.png';
import ethereum from '../../public/images/ethereum.png';
import polygon from '../../public/images/polygon.png';
import whale from '../../public/images/whale.png';
import killerwhale from '../../public/images/killerwhale.png';
import octopus from '../../public/images/octopus.png';
import shark from '../../public/images/shark.png';
import dolphin from '../../public/images/dolphin.png';
import mantaray from '../../public/images/mantaray.png';
import turtle from '../../public/images/turtle.png';
import crab from '../../public/images/crab.png';
import seahorse from '../../public/images/seahorse.png';
import prawn from '../../public/images/prawn.png';

interface List{
  position: string,
  address: string,
  tokens: string,
  percent?: string
}
interface ListH{
  sender: string,
  receiver: string,
  amount: string,
}
interface Token{
  details: {
    name: string,
    value: string,
    creator: string,
  },
  info: {
    symbol: string,
    totalSupply: string,
    marketCap: string,
    decimals: string,
    holders: string,
  },
  totalUniques: {
    uniqueWallets: string,
  },
  lastUnique: {
    lastDayUniqueWallets: string,
  },
  categoryWallets: List[],
  rankingWallets: List[],
  hotWallets: ListH[],
}

export default function Home({ details, info, totalUniques, lastUnique, categoryWallets, rankingWallets, hotWallets }: Token){
  const address = "0x6dd60afb2586d31bf390450adf5e6a9659d48c4a";

  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [marketCap, setMarketCap] = useState('');
  const [wallets, setWallets] = useState('');
  const [creator, setCreator] = useState('');
  const [valueToken, setValueToken] = useState('');
  const [holdersActives, setHoldersActives] = useState('');
  const [totalWallets, setTotalWallets] = useState('');
  const [categoryList, setCategoryList] = useState(categoryWallets);
  const [rankingList, setRankingList] = useState(rankingWallets);
  const [hotList, setHotList] = useState(hotWallets);
  const [price, setPrice] = useState('');

  const inactives = parseInt(totalWallets) - parseInt(holdersActives)
  const variation = (parseInt(wallets) / parseInt(totalWallets)).toLocaleString("pt-BR", { style: "percent",  minimumFractionDigits: 2})
  
  const buyerList = hotList.map( wallet => ({
    buyer: wallet.receiver,
    amount: wallet.amount,
  }))

  const sellerList = hotList.map( wallet => ({
    seller: wallet.sender,
    amount: wallet.amount,
  }))

  useEffect(()=>{

    setTokenName(details.name.split("(",1).toString());
    setValueToken(details.value);
    setCreator(details.creator);
    setSymbol(info.symbol);
    setTotalSupply(info.totalSupply);
    setMarketCap(info.marketCap);
    setDecimals(info.decimals);
    setHoldersActives(info.holders.split("address",1).toString().replace(",",""));
    setTotalWallets(totalUniques.uniqueWallets);
    setWallets(lastUnique.lastDayUniqueWallets);
    setCategoryList(categoryWallets);
    setRankingList(rankingWallets);
    setHotList(hotWallets);
    setPrice(details.value.toString().replace("(","").replace(")","").replace("@","").replace("$",""));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
 
  return (
    <>
    <Head>
        <title>Dashboard MafaCoin</title>
    </Head>

    <main className={styles.mainContainer}>

      <div className={styles.firstRollContainer}>
        <div className={styles.cardContent1}>
          <div className={styles.cardToken}>
            <div className={styles.topCard}>
              <h3>Token Details</h3>
              <p>...<abbr title="Token Details">.</abbr></p>
            </div>
            <div className={styles.middleCard}>
              <a><Image src={binance} alt="Binance"/></a>
            </div>
            <div className={styles.baseCard}>
              <h4>{tokenName}<br/><span>{symbol}</span></h4>
              <p>Decimals : <span>{decimals}</span></p>
              <p>TOTAL SUPPLY :<br/><span>{totalSupply}</span></p>
              <p>MARKET CAP :<br/><span>{marketCap}</span></p>
              <p>Contract Creator:<br/><span>{creator}</span></p>
              <FaCopy size={14} color="white" />
            </div>
          </div>
        </div>
        <div className={styles.cardContent2}>
          <div className={styles.content}>
            <div className={styles.cardAddress}>
              <div className={styles.uniqueCard}>
                <h4>Token Address:<span>{address}</span></h4>
                <FaCopy size={14} color="white" />
              </div>
            </div>
            <div className={styles.cardNet}>
              <div className={styles.uniqueCard}>
                <a><Image src={ethereum} alt="Ethereum"/></a>
                <a><Image src={polygon} alt="Polygon"/></a>
                <a><Image src={binance} alt="Binance"/></a>
                <h2>Network</h2>
              </div>
            </div>
          </div>
          <div className={styles.content2}>
            <div className={styles.cardWallets}>
              <div className={styles.topCard}>
                <h3>Unique Wallets</h3>
                <p>...<abbr title="Number of new wallets that purchased the Token in the last 24 hours">.</abbr></p>
              </div>
              <div className={styles.middleCard}>
                <GoTriangleUp size={10} color="var(--success)"/>
                <span>{variation} (24 hours)</span>
              </div>
              <div className={styles.baseCard}>
                <h2>+ {wallets} Wallets</h2>
              </div>
            </div>
            <div className={styles.cardHolders}>
              <div className={styles.topCard}>
                <h3>Total Uniques Wallets: {totalWallets}</h3>
                <p>...<abbr title="Actives: Holders who kept their positions and Inactives: Holders who sold all their Tokens">.</abbr></p>
              </div>
              <div className={styles.underTopCard}>
                <p>Actives and Inactives</p>
              </div>
              <div className={styles.middleCard}>
                <BsCircleFill size={14} color="var(--error)" />
                <p>Inactives {inactives}</p>
              </div>
              <div className={styles.GraphCard}>
                <BsCircleHalf size={14} color="var(--success)" />
              </div>
              <div className={styles.baseCard}>
                <p>Actives {holdersActives}</p>
                <BsCircleFill size={14} color="var(--success)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.secondRollContainer}>
        <div className={styles.cardContent1}>
          <div className={styles.cardGrowth}>
            <div className={styles.topCard}>
              <h3>Growth Graphic</h3>
              <p>...<abbr title="Monthly growth of new wallets that bought the token">.</abbr></p>
            </div>
            <div className={styles.underTopCard}>
              <p>Growth Month Wallets</p>
            </div>
            <div className={styles.GraphCard}>
              <p>Loading...........Graphic Month Wallets</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.thirdRollContainer}>
        <div className={styles.cardContent1}>
          <div className={styles.cardCategories}>
            <div className={styles.topCard}>
              <h3>Categories</h3>
              <p>...<abbr title="Marine scale model information">.</abbr></p>
            </div>
            <div className={styles.underTopCard}>
              <p>Marine Scale</p>
            </div>
            <div className={styles.listCard}>
              <ul><p>Position MarineScale TotalSupply%</p>
                <li><h4>1</h4><Image src={whale} alt="Whales"/><p>Whales</p><span>+20%</span></li>
                <li><h4>2</h4><Image src={killerwhale} alt="Killer Whales"/><p>Killer Whales</p><span>18 - 19%</span></li>
                <li><h4>3</h4><Image src={octopus} alt="Octopus"/><p>Octopus</p><span>16 - 17%</span></li>
                <li><h4>4</h4><Image src={shark} alt="Sharks"/><p>Sharks</p><span>14 - 15%</span></li>
                <li><h4>5</h4><Image src={dolphin} alt="Dolphins"/><p>Dolphins</p><span>12 - 13%</span></li>
                <li><h4>6</h4><Image src={mantaray} alt="Manta Rays"/><p>Manta Rays</p><span>10 - 11%</span></li>
                <li><h4>7</h4><Image src={turtle} alt="Turtles"/><p>Turtles</p><span>7 - 9%</span></li>
                <li><h4>8</h4><Image src={crab} alt="Crabs"/><p>Crabs</p><span>4 - 6%</span></li>
                <li><h4>9</h4><Image src={seahorse} alt="Seahorses"/><p>Seahorses</p><span>2 - 3%</span></li>
                <li><h4>10</h4><Image src={prawn} alt="Prawns"/><p>Prawns</p><span>1%</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.cardContent2}>
          <div className={styles.cardCatGraph}>
            <div className={styles.topCard}>
              <h3>Categories Graphic</h3>
              <p>...<abbr title="Token represented by each range of the scale">.</abbr></p>
            </div>
            <div className={styles.GraphCard}>
              <BsCircleHalf size={14} color="var(--success)" />
            </div>
            <div className={styles.infoCard}>
              <ul>
                <li><BsFillSquareFill size={10} color="var(--whale)" /><p>Whales - 17%</p></li>
                <li><BsFillSquareFill size={10} color="var(--dolphin)" /><p>Dolphins - 8%</p></li>
                <li><BsFillSquareFill size={10} color="var(--shark)" /><p>Sharks - 39%</p></li>
                <li><BsFillSquareFill size={10} color="var(--crab)" /><p>Crabs - 25%</p></li>
                <li><BsFillSquareFill size={10} color="var(--killerwhale)" /><p>Killer Whales - 11%</p></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.cardContent3}>
          <div className={styles.cardRanking}>
            <div className={styles.topCard}>
              <h3>Wallets Ranking</h3>
              <p>...<abbr title="Wallet ranking by number of tokens in holding">.</abbr></p>
            </div>
            <div className={styles.listRankingCard}>
              <ul><p>Position Wallet <span>  &ensp; Value</span></p>
              {rankingList.slice(0,3).map((wallet, index)=>{
                return(
                  <li key={index}><h4>#{wallet.position}</h4><p>{wallet.address}</p><span>{ (parseFloat(price) * parseFloat(wallet.tokens.replace(",","").replace(",",""))).toLocaleString("en", { style: "currency", currency: "USD"})}</span></li>
                )
              })}
              {rankingList.slice(3,6).map((wallet, index)=>{
                return(
                  <li key={index}><h3>#{wallet.position}</h3><p>{wallet.address}</p><span>{ (parseFloat(price) * parseFloat(wallet.tokens.replace(",","").replace(",",""))).toLocaleString("en", { style: "currency", currency: "USD"})}</span></li>
                )
              })}
              </ul>   
            </div>
          </div>
        </div>
      </div>

      <div className={styles.fourthRollContainer}>
        <div className={styles.cardContent1}>
          <div className={styles.cardBuyers}>
            <div className={styles.topCard}>
              <h3>Hot Buyers</h3>
              <p>...<abbr title="Wallets that bought the most tokens in the last 24 hours">.</abbr></p>
            </div>
            <div className={styles.firtsPlace}>            
              <div className={styles.cardWallet1}>
                <div className={styles.topWallet}>
                  <h2>#1<p>Wallet:<span>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</span></p></h2>
                  <p><GiProgression size={10} color="white" /><span>$168,332.00</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleUp size={10} color="var(--success)"/>
                    <span>8% (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>BUY TOKENS</h4>
                  <h2>134.004.000</h2>
                </div>
              </div>
              <div className={styles.cardWallet1}>
                <div id={styles.wallet1} className={styles.topWallet}>
                  <h2>#2<p>Wallet:<span>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</span></p></h2>
                  <p><GiProgression size={10} color="white" /><span>$118,150.00</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleUp size={10} color="var(--success)"/>
                    <span>15% (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>BUY TOKENS</h4>
                  <h2>114.469.000</h2>
                </div>
              </div>
            </div>
            <div className={styles.secondsPlace}>
              <div className={styles.cardWallet1}>
                <div id={styles.wallet2} className={styles.topWallet}>
                  <h2>#3<p>Wallet:<span>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</span></p></h2>
                  <p><GiProgression size={10} color="white" /><span>$78,842.00</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleUp size={10} color="var(--success)"/>
                    <span>32% (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>BUY TOKENS</h4>
                  <h2>85.406.562</h2>
                </div>
              </div>
              <div className={styles.cardWallet1}>
                <div id={styles.wallet3} className={styles.topWallet}>
                  <h2>#4<p>Wallet:<span>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</span></p></h2>
                  <p><GiProgression size={10} color="white" /><span>$42,590.00</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleUp size={10} color="var(--success)"/>
                    <span>4,5% (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>BUY TOKENS</h4>
                  <h2>52.090.9057</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cardContent2}>
          <div className={styles.cardSellers}>
            <div className={styles.topCard}>
              <h3>Hot Sellers</h3>
              <p>...<abbr title="Wallets that sold the most tokens in the last 24 hours">.</abbr></p>
            </div>
            <div className={styles.firtsPlace}>            
              <div className={styles.cardWallet1}>
                <div className={styles.topWallet}>
                  <h2>#1<p>Wallet:<span>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</span></p></h2>
                  <p><BsGraphDown size={10} color="white" /><span>$-158,332.00</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleDown size={10} color="var(--error)"/>
                    <span>7% (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>SELL TOKENS</h4>
                  <h2>124.004.000</h2>
                </div>
              </div>
              <div className={styles.cardWallet1}>
                <div id={styles.wallet1} className={styles.topWallet}>
                  <h2>#2<p>Wallet:<span>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</span></p></h2>
                  <p><BsGraphDown size={10} color="white" /><span>$-98,150.00</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleDown size={10} color="var(--error)"/>
                    <span>18% (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>SELL TOKENS</h4>
                  <h2>94.469.000</h2>
                </div>
              </div>
            </div>
            <div className={styles.secondsPlace}>
              <div className={styles.cardWallet1}>
                <div id={styles.wallet2} className={styles.topWallet}>
                  <h2>#3<p>Wallet:<span>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</span></p></h2>
                  <p><BsGraphDown size={10} color="white" /><span>$-28,842.00</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleDown size={10} color="var(--error)"/>
                    <span>22% (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>SELL TOKENS</h4>
                  <h2>35.406.562</h2>
                </div>
              </div>
              <div className={styles.cardWallet1}>
                <div id={styles.wallet3} className={styles.topWallet}>
                  <h2>#4<p>Wallet:<span>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</span></p></h2>
                  <p><BsGraphDown size={10} color="white" /><span>$-12,590.00</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleDown size={10} color="var(--error)"/>
                    <span>3% (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>SELL TOKENS</h4>
                  <h2>22.090.9057</h2>
                </div>
              </div>
            </div>
          </div>  
        </div>
      </div>

      <div className={styles.baseContainer}>
        <p>Copyright Designed & Developed by SOZEI 2022</p>
      </div>

    </main>
    </>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const contract = '0x6dd60afb2586d31bf390450adf5e6a9659d48c4a';
  const tradePair =	'0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';

  async function getDetails() {
    const browser = await puppeteer.launch();
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
  
  async function getInfo() {
    const browser = await puppeteer.launch();
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
  
  async function getTotalWallets() {
    const browser = await puppeteer.launch();
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
  
  async function getLastWallets() {
    const startYesterday = startOfYesterday();
    const formated = format(startYesterday,'yyyy-MM-dd');
    const browser = await puppeteer.launch();
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
  
  async function getCategoryWallets() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://bscscan.com/token/tokenholderchart/0x6dd60afb2586d31bf390450adf5e6a9659d48c4a?range=50');
    
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
  
  async function getRankingWallets() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://bscscan.com/token/tokenholderchart/0x6dd60afb2586d31bf390450adf5e6a9659d48c4a?range=10');
    
    const walletList = await page.evaluate(() => {
        
      const nodeList = document.querySelectorAll('#ContentPlaceHolder1_resultrows > table > tbody > tr');
      const walletsArray = [...nodeList]
  
      const list = walletsArray.map( wallet => ({
        position: wallet.querySelector('td')?.innerHTML,
        address: wallet.querySelector('a')?.innerHTML,
        tokens: wallet.querySelector('td:nth-child(3)')?.innerHTML,
      }))
      return list
    })
    
    await browser.close();
    return walletList
  };
  
  async function getHotWallerts(){
    const startYesterday = startOfYesterday();
    const formated = format(startYesterday,'yyyy-MM-dd');
      
    var data = JSON.stringify({
      "query": "query ($network: EthereumNetwork!, $token: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    transfers(\n      options: {desc: \"amount\", limit: $limit, offset: $offset}\n      date: {since: $from, till: $till}\n      amount: {gt: 0}\n      currency: {is: $token}\n    ) {\n      block {\n        timestamp {\n          time(format: \"%Y-%m-%d %H:%M:%S\")\n        }\n        height\n      }\n      sender {\n        address\n      }\n      receiver {\n        address\n      }\n      transaction {\n        hash\n      }\n      amount\n    }\n  }\n}\n",
      "variables": `{\n  \"limit\": 10,\n  \"offset\": 0,\n  \"network\": \"bsc\",\n  \"token\": \"0x6dd60afb2586d31bf390450adf5e6a9659d48c4a\",\n  \"from\": \"${formated}\",\n  \"till\": \"${formated}T23:59:59\",\n  \"dateFormat\": \"%Y-%m-%d\"\n}`
    });
  
    var config = {
      method: 'post',
      url: 'https://graphql.bitquery.io',
      headers: { 
        'Content-Type': 'application/json', 
        'X-API-KEY': 'BQY8tkWK5F4ilrr7FxthT8BVeqTy9hHR'
      },
      data : data
    };
  
    const listHot = await axios(config)
    .then(function (response: any) {
      const list = response.data.data.ethereum.transfers.map( (wallet: any) =>({
        sender: wallet.sender,
        receiver: wallet.receiver,
        amount: wallet.amount,
    }))
      return list
    })
    .catch(function (error: any) {
      console.log(error);
    });
    return listHot
  };
    
  const details = await getDetails();
  const info = await getInfo();
  const totalUniques = await getTotalWallets();
  const lastUnique = await getLastWallets();
  const categoryWallets = await getCategoryWallets();
  const rankingWallets = await getRankingWallets();
  const hotWallets = await getHotWallerts();
        
  return{
    props: {
      details,
      info,
      totalUniques,
      lastUnique,
      categoryWallets,
      rankingWallets,
      hotWallets,
    }
  }

}