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
import { format } from 'date-fns';
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

const axios = require('axios').default;

interface Token{
  holders: string,
  nameT: string,
  symbolT: string,
  decimalsT: string,
  typeT: string,
  totalT: string,
  priceT: string,
}

export default function Home({holders, nameT, symbolT, decimalsT, typeT, totalT, priceT }: Token){
  const address = "0x6dd60afb2586d31bf390450adf5e6a9659d48c4a";
  const creator = "0xe341d141133d82def0ee59a3d9365fd2942eeb63";

  const [tokenName, setTokenName] = useState("MafaCoin");
  const [symbol, setSymbol] = useState("MAFA");
  const [decimals, setDecimals] = useState("18");
  const [totalSupply, setTotalSupply] = useState("1,000,000,000");
  const [marketCap, setMarketCap] = useState(0);
  const [variation, setVariation] = useState("8%");
  const [wallets, setWallets] = useState("1280");
 
  useEffect(()=>{

    setTokenName(nameT)
    setSymbol(symbolT)
    setDecimals(decimalsT)
    setTotalSupply(totalT)

    const market = parseFloat(priceT) * parseFloat(totalT)
    setMarketCap(market)
    setVariation("8%")
    setWallets("1280")

  },[decimalsT, nameT, priceT, symbolT, totalT]);
 
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
                <h3>Holders</h3>
                <p>...<abbr title="Actives: Holders who kept their positions and Inactives: Holders who sold all their Tokens">.</abbr></p>
              </div>
              <div className={styles.underTopCard}>
                <p>Actives and Inactives</p>
              </div>
              <div className={styles.middleCard}>
                <BsCircleFill size={14} color="var(--error)" />
                <p>Inactives</p>
              </div>
              <div className={styles.GraphCard}>
                <BsCircleHalf size={14} color="var(--success)" />
              </div>
              <div className={styles.baseCard}>
                <p>Actives</p>
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
                <li><h4>#1</h4><p>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</p><span>$19000</span></li>
                <li><h4>#2</h4><p>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</p><span>$14700</span></li>
                <li><h4>#3</h4><p>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</p><span>$10700</span></li>
                <li><h3>#4</h3><p>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</p><span>$8750</span></li>
                <li><h3>#5</h3><p>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</p><span>$4530</span></li>
                <li><h3>#6</h3><p>0xA0307680088080ea92DC91fA399283Ebd44d7Fbd</p><span>$1750</span></li>
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

  const getHolders = await axios.get('https://api.bscscan.com/api?module=token&action=tokenholderlist', {
    params:{
      contractaddress: contract,
      apikey: process.env.BSC_API_KEY
    }
  })

  const holders = getHolders.data.result

  const infoToken = await axios.get('https://api.bscscan.com/api?module=token&action=tokeninfot', {
    params:{
      contractaddress: contract,
      apikey: process.env.BSC_API_KEY
    }
  })

  const infoResult = infoToken.data.result

  const nameT = infoResult.tokenName || null
  const symbolT = infoToken.data.result.symbol || null
  const decimalsT = infoToken.data.result.divisor || null
  const typeT = infoToken.data.result.tokenType || null
  const totalT = infoToken.data.result.totalSupply || null
  const priceT = infoToken.data.result.tokenPriceUSD || null
      
  return{
    props: {
      holders,
      nameT,
      symbolT,
      decimalsT,
      typeT,
      totalT,
      priceT,
    }
  }

}