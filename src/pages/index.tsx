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
import { format, startOfYesterday, getMonth } from 'date-fns';
import Image from 'next/future/image';
import binance from '../../public/images/binance.png';
import ethereum from '../../public/images/ethereum.png';
import polygon from '../../public/images/polygon.png';
import whale from '../../public/images/whale.png';
import hwhale from '../../public/images/hwhale.png';
import sardine from '../../public/images/sardine.png';
import shark from '../../public/images/shark.png';
import dolphin from '../../public/images/dolphin.png';
import turtle from '../../public/images/turtle.png';
import crab from '../../public/images/crab.png';
import mafa from '../../public/images/mafa.jpg';
import { Pie, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, Filler } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, CategoryScale, LinearScale, LineElement, PointElement, Filler);

const axios = require('axios');
const puppeteer = require('puppeteer');

interface List{
  position: string,
  address: string,
  tokens: string,
  percent: string
}
interface ListH{
  sender: string,
  receiver: string,
  amount: number,
  balanceOf: string,
}
interface ListU{
  date: string,
  uniques: number,
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
  uniquesDaily: ListU[],
}

export default function Home({ details, info, totalUniques, lastUnique, categoryWallets, rankingWallets, hotWallets, uniquesDaily }: Token){
  const address = "0x6dd60afb2586d31bf390450adf5e6a9659d48c4a";
  const tradePair =	'0x591b7b63dcd9ac56573418a62ab37c936be7459c';

  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [marketCap, setMarketCap] = useState('');
  const [wallets, setWallets] = useState('');
  const [creator, setCreator] = useState('');
  const [holdersActives, setHoldersActives] = useState('');
  const [totalWallets, setTotalWallets] = useState('');
  const [categoryList, setCategoryList] = useState(categoryWallets);
  const [rankingList, setRankingList] = useState(rankingWallets);
  const [hotList, setHotList] = useState(hotWallets);
  const [price, setPrice] = useState('');
  const [uniquesDay, setUniquesDay] = useState(uniquesDaily);
    
  const inactives = parseInt(totalWallets) - parseInt(holdersActives)
  const variation = (parseInt(wallets) / parseInt(totalWallets)).toLocaleString("pt-BR", { style: "percent",  minimumFractionDigits: 2})

  function compare(a: { amount: number; }, b: { amount: number}) {
    if ( a.amount > b.amount ){
      return -1;
    }
    if ( a.amount < b.amount ){
      return 1;
    }
    return 0;
  }

  const burnAddress = categoryList.slice(0,1).map( wallet => {
    return parseFloat(wallet.tokens.replace(",","").replace(",",""))
  }).reduce(function(soma, i) {
    return soma + i;
  });

  const buyerList = hotList.map( wallet => {
    
    if(wallet.sender === tradePair){
      return {
        buyer: wallet.receiver,
        amount: wallet.amount,
      } 
    } else {
      return {
        buyer: wallet.receiver,
        amount: 0,
      } 
    }

  }).sort(compare) 

  const sellerList = hotList.map( wallet => {
    
    if(wallet.receiver === tradePair){
      return {
        seller: wallet.sender,
        amount: wallet.amount,
      } 
    } else {
      return {
        seller: wallet.sender,
        amount: 0,
      } 
    }
  }).sort(compare)

  const humpbackList = categoryList.slice(1,10).map( wallet => {
    
    if(parseFloat(wallet.tokens.replace(",","").replace(",","")) > (1000000000 / 100)){
      return parseFloat(wallet.tokens.replace(",","").replace(",","")) }
       else return 0
    })

  const humpbackTotal = humpbackList.reduce(function(soma, i) {
    return soma + i;
  });

  const humpbackW = humpbackList.reduce((total, valor) => {
    if (valor > 0 ) {
      return total + 1;
    }
    return total;
  }, 0)

  const humpbackAvg =  humpbackTotal / humpbackW
  
  const whaleList = categoryList.slice(1,10).map( wallet => {
    
    if(parseFloat(wallet.tokens.replace(",","").replace(",","")) > (1000000000 / 200) && parseFloat(wallet.tokens.replace(",","").replace(",","")) <= (1000000000 / 100)){
      return parseFloat(wallet.tokens.replace(",","").replace(",","")) }
       else return 0
    })

  const whaleTotal = whaleList.reduce(function(soma, i) {
    return soma + i;
  });

  const whaleW = whaleList.reduce((total, valor) => {
    if (valor > 0 ) {
      return total + 1;
    }
    return total;
  }, 0)

  const whaleAvg =  whaleTotal / whaleW

  const sharkList = categoryList.slice(1,20).map( wallet => {
    
    if(parseFloat(wallet.tokens.replace(",","").replace(",","")) > (1000000000 / 400) && parseFloat(wallet.tokens.replace(",","").replace(",","")) <= (1000000000 / 200)){
      return parseFloat(wallet.tokens.replace(",","").replace(",","")) }
       else return 0
    })

  const sharkTotal = sharkList.reduce(function(soma, i) {
    return soma + i;
  });

  const sharkW = sharkList.reduce((total, valor) => {
    if (valor > 0 ) {
      return total + 1;
    }
    return total;
  }, 0)

  const sharkAvg =  sharkTotal / sharkW

  const dolphinList = categoryList.slice(1,50).map( wallet => {
    
    if(parseFloat(wallet.tokens.replace(",","").replace(",","")) > (1000000000 / 666.6666667) && parseFloat(wallet.tokens.replace(",","").replace(",","")) <= (1000000000 / 400)){
      return parseFloat(wallet.tokens.replace(",","").replace(",","")) }
       else return 0
    })

  const dolphinTotal = dolphinList.reduce(function(soma, i) {
    return soma + i;
  });

  const dolphinW = dolphinList.reduce((total, valor) => {
    if (valor > 0 ) {
      return total + 1;
    }
    return total;
  }, 0)

  const dolphinAvg =  dolphinTotal / dolphinW

  const turtleList = categoryList.slice(1,50).map( wallet => {
    
    if(parseFloat(wallet.tokens.replace(",","").replace(",","")) > (1000000000 / 1000) && parseFloat(wallet.tokens.replace(",","").replace(",","")) <= (1000000000 / 666.6666667)){
      return parseFloat(wallet.tokens.replace(",","").replace(",","")) }
       else return 0
    })

  const turtleTotal = turtleList.reduce(function(soma, i) {
    return soma + i;
  });

  const turtleW = turtleList.reduce((total, valor) => {
    if (valor > 0 ) {
      return total + 1;
    }
    return total;
  }, 0)

  const turtleAvg =  turtleTotal / turtleW

  const crabList = categoryList.slice(1,100).map( wallet => {
    
    if(parseFloat(wallet.tokens.replace(",","").replace(",","")) > (1000000000 / 2000) && parseFloat(wallet.tokens.replace(",","").replace(",","")) <= (1000000000 / 1000)){
      return parseFloat(wallet.tokens.replace(",","").replace(",","")) }
       else return 0
    })

  const crabTotal = crabList.reduce(function(soma, i) {
    return soma + i;
  });

  const crabW = crabList.reduce((total, valor) => {
    if (valor > 0 ) {
      return total + 1;
    }
    return total;
  }, 0)

  const crabAvg =  crabTotal / crabW

  const sardineW = parseInt(holdersActives) - (humpbackW + whaleW + sharkW + dolphinW + turtleW + crabW)
  const sardineTotal = 1000000000 - (burnAddress + humpbackTotal + whaleTotal + sharkTotal + dolphinTotal + turtleTotal + crabTotal)
  const sardineAvg =  sardineTotal  / sardineW

  console.log(uniquesDay)

  // Graphs

  // Pie

  const pieData = {
    maintainAspectRatio: false,
    responsive: false,
    datasets: [
      {
        labels: ['Wallets', 'Wallets'],
        data: [parseInt(holdersActives), inactives],
        backgroundColor: [
          "#2DCE98",
          "#F53C56"
        ],
        borderColor: [
          "#14112E",
        ],
      }
    ]
  };

  const pieOptions = {
    elements: {
      arc: {
        borderWidth: 4
      },
    },
    plugins:{
      tooltip:{
        titleFont: {weight: 'bold', size: 28},
        bodyFont: {weight: 'bold', size: 28},
        footerFont: {weight: 'bold', size: 28},
        padding: 10,
      },
      datalabels:{
        display: true,
        formatter: (value: any, context: any)=> {
          const datapoints = context.chart.data.datasets[0].data;
          function totalSum(total: any, datapoint: any) {
            return total + datapoint;
          }
          const totalvalue = datapoints.reduce(totalSum, 0);
          const percentageValue = (value / totalvalue * 1).toLocaleString("en", { style: "percent",  minimumFractionDigits: 2});
          return percentageValue;
        },
        labels: {
          value: {
            color: '#14112E',
            font:{
              size: 18,
              weight: 'bold',
            },
            align: 'start',
            anchor:  'end',
          },
        }
      },
    }
  };

  // Doughnut

  const doughnutData = {
    maintainAspectRatio: false,
    responsive: false,
    labels: ['Humpback Whales', 'Whales', 'Sharks', 'Dolphins', 'Turtles', 'Crabs', 'Sardines'],
    datasets: [
      {
        data: [humpbackTotal, whaleTotal, sharkTotal, dolphinTotal, turtleTotal, crabTotal, sardineTotal ],
        backgroundColor: [
          "#28C741",
          "#3475DC",
          "#FFAB2D",
          "#EE3CD2",
          "#2C2754",
          "#BD5D0C",
          "#3EC6A4",
        ],
        borderColor: [
          "#14112E",
        ],
      }
    ]
  };

  const doughnutOptions = {
    elements: {
      arc: {
        borderWidth: 4
      },
    },
    plugins:{
      tooltip:{
        bodyFont: {size: 20},
        padding: 2,
      },
      legend:{
        labels:{
          color:  "#fff",
          font: {size: 16},
          boxWidth: 20,
        },
        title: {
          display: false,
        }
      },
      datalabels:{
        formatter: (value: any, context: any)=> {
          const datapoints = context.chart.data.datasets[0].data;
          function totalSum(total: any, datapoint: any) {
            return total + datapoint;
          }
          const totalvalue = datapoints.reduce(totalSum, 0);
          const percentageValue = (value / totalvalue * 1).toLocaleString("en", { style: "percent",  minimumFractionDigits: 2});
          return percentageValue;
        },
        labels: {
          value: {
            color: 'white',
            font:{
              size: 15,
              weight: 'bold',
            },
            align: 'start',
            anchor:  'end',
          },
        }
      }
    }
  };

 
  // Line Area
  const label = [];
  const data = [];
  for(var i of uniquesDay.reverse().slice(0,30).reverse()){
    label.push(i.date);
    data.push(i.uniques);
  }

  const areaData = {
    labels: label,
    datasets: [
      {
        fill: true,
        data: data,
        backgroundColor: '#533483',
        borderColor: 'rgb(53, 162, 235)',
        tension: 0.1,
        pointBackgroundColor: 'white',
      }
    ]
  };

  const areaOptions = {
    responsive: true,
    plugins:{
      legend: {
        display: false,
      },
      datalabels:{
        display: true,

        labels: {
          value: {
            color: 'white',
            font:{
              size: 16,
              weight: 'bold',
            },
            align: 'top',
            anchor:  'end',
          },
        }
      },
      
    },
  };

  function copyCreator(){
    navigator.clipboard.writeText('0xe341d141133d82def0ee59a3d9365fd2942eeb63');
  }

  function copyAdd(){
    navigator.clipboard.writeText('0x6dd60afb2586d31bf390450adf5e6a9659d48c4a');
  }

  useEffect(()=>{

    setTokenName(details.name.split("(",1).toString());
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
        <title>InfoGraphic MafaCoin</title>
    </Head>

    <main className={styles.mainContainer}>

      <div className={styles.firstRollContainer}>
        <div className={styles.cardContent1}>
          <div className={styles.cardToken}>
            <div className={styles.topCard}>
              <h3>Token Details</h3>
              <p>...<abbr title="Token Details ref: BscScan">.</abbr></p>
            </div>
            <div className={styles.middleCard}>
              <a><Image src={mafa} alt="Logo Mafa"/></a>
            </div>
            <div className={styles.baseCard}>
              <h4>{tokenName}<br/><span>{symbol}</span></h4>
              <p>Decimals : <span>{decimals}</span></p>
              <p>TOTAL SUPPLY :<br/><span>{totalSupply}</span></p>
              <p>MARKET CAP :<br/><span>{marketCap}</span></p>
              <p>Contract Creator:<br/><span>{creator}</span></p>
              <FaCopy onClick={copyCreator} size={14} color="white" />
            </div>
          </div>
        </div>

        <div className={styles.cardContent2}>
          <div className={styles.content}>
            <div className={styles.cardAddress}>
              <div className={styles.uniqueCard}>
                <h4>Token Address:<span>{address}</span></h4>
                <FaCopy onClick={copyAdd} size={14} color="white" />
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
                <h3>Total Uniques Wallets: <span>{totalWallets}</span></h3>
                <p>...<abbr title="Actives: Holders who kept their positions and Inactives: Holders who sold all their Tokens">.</abbr></p>
              </div>
              <div className={styles.underTopCard}>
                <p>Actives and Inactives</p>
              </div>
              <div className={styles.middleCard}>
                <BsCircleFill size={14} color="var(--error)" />
                <p>Inactives <span>{inactives}</span></p>
              </div>
              <div className={styles.GraphCard}>
                <Pie data={pieData} options={pieOptions} width={1200} height={1200}/>
              </div>
              <div className={styles.baseCard}>
                <p>Actives <span>{holdersActives}</span></p>
                <BsCircleFill size={14} color="var(--success)" />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className={styles.secondRollContainer}>
        <div className={styles.cardContent1}>
          <div className={styles.cardGrowth}>
            <div id="growth" className={styles.topCard}>
              <h3>Growth Graphic Daily</h3>
              <p>...<abbr title="Monthly growth of new wallets that bought the token">.</abbr></p>
            </div>
            <div className={styles.underTopCard}>
              <p>Uniques Wallets (Last 30 Days)</p>
            </div>
            <div className={styles.GraphCard}>
              <Line data={areaData} options={areaOptions} />
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
              <ul><p>Place MarineScale &ensp; &ensp;  &ensp; TotalSupply%</p>
                <li><h4>1</h4><Image src={hwhale} alt="Humpback Whales"/><p>Humpback Whales</p><span>1%+</span></li>
                <li><h4>2</h4><Image src={whale} alt="Whales"/><p>Whales</p><span>0,5% - 1%</span></li>
                <li><h4>3</h4><Image src={shark} alt="Sharks"/><p>Sharks</p><span>0,25% - 0,5%</span></li>
                <li><h4>4</h4><Image src={dolphin} alt="Dolphins"/><p>Dolphins</p><span>0,15% - 0,25%</span></li>
                <li><h4>5</h4><Image src={turtle} alt="Turtles"/><p>Turtles</p><span>0,10% - 0,15%</span></li>
                <li><h4>6</h4><Image src={crab} alt="Crabs"/><p>Crabs</p><span>0,05% - 0,10%</span></li>
                <li><h4>7</h4><Image src={sardine} alt="Sardines"/><p>Sardines</p><span>0,0% - 0,05%</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.cardContent2}>
          <div className={styles.cardCatGraph}>
            <div id="category" className={styles.topCard}>
              <h3>Categories Graphic</h3>
              <p>...<abbr title="Token represented by each range of the scale">.</abbr></p>
            </div>
            <div className={styles.GraphCard}>
              <Doughnut data={doughnutData} options={doughnutOptions} width={1200} height={1200}/>
            </div>
            <div className={styles.infoCard}>
            
            </div>
          </div>
        </div>
        <div className={styles.cardContent3}>
          <div className={styles.cardRanking}>
            <div id="ranking" className={styles.topCard}>
              <h3>Wallets Ranking</h3>
              <p>...<abbr title="Wallet ranking by number of tokens in holding">.</abbr></p>
            </div>
            <div className={styles.listRankingCard}>
              <ul><p>Position Wallet <span>  &ensp; Value</span></p>
              {rankingList.slice(1,4).map((wallet, index)=>{
                return(
                  <li key={index}><h4>#{parseInt(wallet.position) - 1}</h4><p>{wallet.address}</p><span>{ (parseFloat(price) * parseFloat(wallet.tokens.replace(",","").replace(",",""))).toLocaleString("en", { style: "currency", currency: "USD"})}</span></li>
                )
              })}
              {rankingList.slice(4,7).map((wallet, index)=>{
                return(
                  <li key={index}><h3>#{parseInt(wallet.position) - 1}</h3><p>{wallet.address}</p><span>{ (parseFloat(price) * parseFloat(wallet.tokens.replace(",","").replace(",",""))).toLocaleString("en", { style: "currency", currency: "USD"})}</span></li>
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
            <div id="hot" className={styles.topCard}>
              <h3>Hot Buyers</h3>
              <p>...<abbr title="Wallets that bought the most tokens in the last 24 hours">.</abbr></p>
            </div>
            <div className={styles.firtsPlace}>            
              <div className={styles.cardWallet1}>
                <div className={styles.topWallet}>
                  <h2><a>#1</a><p>Wallet:<span>{buyerList[0]?.buyer}</span></p></h2>
                  <p><GiProgression size={10} color="white" /><span>{ (parseFloat(price) * buyerList[0]!.amount).toLocaleString("en", { style: "currency", currency: "USD"}) }</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleUp size={10} color="var(--success)"/>
                    <span>{(buyerList[0]?.amount / 1000000000).toLocaleString("pt-BR", { style: "percent",  minimumFractionDigits: 4})} (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>BUY TOKENS</h4>
                  <h2>{buyerList[0]?.amount.toLocaleString("en")}</h2>
                </div>
              </div>
              <div className={styles.cardWallet1}>
                <div id={styles.wallet1} className={styles.topWallet}>
                  <h2><a>#2</a><p>Wallet:<span>{buyerList[1]?.buyer}</span></p></h2>
                  <p><GiProgression size={10} color="white" /><span>{ (parseFloat(price) * buyerList[1]!.amount).toLocaleString("en", { style: "currency", currency: "USD"}) }</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleUp size={10} color="var(--success)"/>
                    <span>{(buyerList[1]?.amount / 1000000000).toLocaleString("pt-BR", { style: "percent",  minimumFractionDigits: 4})} (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>BUY TOKENS</h4>
                  <h2>{buyerList[1]?.amount.toLocaleString("en")}</h2>
                </div>
              </div>
            </div>
            <div className={styles.secondsPlace}>
              <div className={styles.cardWallet1}>
                <div id={styles.wallet2} className={styles.topWallet}>
                  <h2><a>#3</a><p>Wallet:<span>{buyerList[2]?.buyer}</span></p></h2>
                  <p><GiProgression size={10} color="white" /><span>{ (parseFloat(price) * buyerList[2]!.amount).toLocaleString("en", { style: "currency", currency: "USD"}) }</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleUp size={10} color="var(--success)"/>
                    <span>{(buyerList[2]?.amount / 1000000000).toLocaleString("pt-BR", { style: "percent",  minimumFractionDigits: 4})} (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>BUY TOKENS</h4>
                  <h2>{buyerList[2]?.amount.toLocaleString("en")}</h2>
                </div>
              </div>
              <div className={styles.cardWallet1}>
                <div id={styles.wallet3} className={styles.topWallet}>
                  <h2><a>#4</a><p>Wallet:<span>{buyerList[3]?.buyer}</span></p></h2>
                  <p><GiProgression size={10} color="white" /><span>{ (parseFloat(price) * buyerList[3]!.amount).toLocaleString("en", { style: "currency", currency: "USD"}) }</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleUp size={10} color="var(--success)"/>
                    <span>{(buyerList[3]?.amount / 1000000000).toLocaleString("pt-BR", { style: "percent",  minimumFractionDigits: 4})} (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>BUY TOKENS</h4>
                  <h2>{buyerList[3]?.amount.toLocaleString("en")}</h2>
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
                  <h2><a>#1</a><p>Wallet:<span>{sellerList[0]?.seller}</span></p></h2>
                  <p><BsGraphDown size={10} color="white" /><span>{ (parseFloat(price) * sellerList[0]!.amount).toLocaleString("en", { style: "currency", currency: "USD"}) }</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleDown size={10} color="var(--error)"/>
                    <span>{(buyerList[0]?.amount / 1000000000).toLocaleString("pt-BR", { style: "percent",  minimumFractionDigits: 4})} (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>SELL TOKENS</h4>
                  <h2>{sellerList[0]?.amount.toLocaleString("en")}</h2>
                </div>
              </div>
              <div className={styles.cardWallet1}>
                <div id={styles.wallet1} className={styles.topWallet}>
                  <h2><a>#2</a><p>Wallet:<span>{sellerList[1]?.seller}</span></p></h2>
                  <p><BsGraphDown size={10} color="white" /><span>{ (parseFloat(price) * sellerList[1]!.amount).toLocaleString("en", { style: "currency", currency: "USD"}) }</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleDown size={10} color="var(--error)"/>
                    <span>{(buyerList[1]?.amount / 1000000000).toLocaleString("pt-BR", { style: "percent",  minimumFractionDigits: 4})} (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>SELL TOKENS</h4>
                  <h2>{sellerList[1]?.amount.toLocaleString("en")}</h2>
                </div>
              </div>
            </div>
            <div className={styles.secondsPlace}>
              <div className={styles.cardWallet1}>
                <div id={styles.wallet2} className={styles.topWallet}>
                  <h2><a>#3</a><p>Wallet:<span>{sellerList[2]?.seller}</span></p></h2>
                  <p><BsGraphDown size={10} color="white" /><span>{ (parseFloat(price) * sellerList[2]!.amount).toLocaleString("en", { style: "currency", currency: "USD"}) }</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleDown size={10} color="var(--error)"/>
                    <span>{(buyerList[2]?.amount / 1000000000).toLocaleString("pt-BR", { style: "percent",  minimumFractionDigits: 4})} (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>SELL TOKENS</h4>
                  <h2>{sellerList[2]?.amount.toLocaleString("en")}</h2>
                </div>
              </div>
              <div className={styles.cardWallet1}>
                <div id={styles.wallet3} className={styles.topWallet}>
                  <h2><a>#4</a><p>Wallet:<span>{sellerList[3]?.seller}</span></p></h2>
                  <p><BsGraphDown size={10} color="white" /><span>{ (parseFloat(price) * sellerList[3]!.amount).toLocaleString("en", { style: "currency", currency: "USD"}) }</span></p>
                  <div className={styles.middleCard}>
                    <GoTriangleDown size={10} color="var(--error)"/>
                    <span>{(buyerList[3]?.amount / 1000000000).toLocaleString("pt-BR", { style: "percent",  minimumFractionDigits: 4})} (24 hours)</span>
                  </div>
                </div>
                <div className={styles.bottomWallet}>
                  <h4>SELL TOKENS</h4>
                  <h2>{sellerList[3]?.amount.toLocaleString("en")}</h2>
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
      "variables": `{\n  \"limit\": 40,\n  \"offset\": 0,\n  \"network\": \"bsc\",\n  \"token\": \"0x6dd60afb2586d31bf390450adf5e6a9659d48c4a\",\n  \"from\": \"${formated}\",\n  \"till\": \"${formated}T23:59:59\",\n  \"dateFormat\": \"%Y-%m-%d\"\n}`
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
        sender: wallet.sender.address,
        receiver: wallet.receiver.address,
        amount: wallet.amount,
    }))
      return list
    })
    .catch(function (error: any) {
      console.log(error);
    });
    return listHot
  };

  async function getWalletsDaily(){
    const startYesterday = startOfYesterday();
    const formated = format(startYesterday,'yyyy-MM-dd');
      
    var data = JSON.stringify({
      "query": "query ($network: EthereumNetwork!, $token: String!, $dateFormat: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    transfers(\n      currency: {is: $token}\n      height: {gt: 0}\n      amount: {gt: 0}\n      date: {since: $from, till: $till}\n    ) {\n      date {\n        date(format: $dateFormat)\n      }\n      count: countBigInt(uniq: receivers)\n    }\n  }\n}\n",
      "variables": `{\"limit\":1000,\"offset\":0,\"network\":\"bsc\",\"token\":\"0x6dd60afb2586d31bf390450adf5e6a9659d48c4a\",\"from\":\"2022-02-26\",\"till\":\"${formated}T23:59:59\",\"dateFormat\":\"%Y-%m-%d\"}`
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
  
    const listUniques = await axios(config)
    .then(function (response: any) {
      const list = response.data.data.ethereum.transfers.map( (wallet: any) =>({
        date: format(new Date(wallet.date.date), 'MM-dd'),
        uniques: parseFloat(wallet.count),
    }))
      return list
    })
    .catch(function (error: any) {
      console.log(error);
    });
    return listUniques
  };
    
  const details = await getDetails();
  const info = await getInfo();
  const totalUniques = await getTotalWallets();
  const lastUnique = await getLastWallets();
  const categoryWallets = await getCategoryWallets();
  const rankingWallets = await getRankingWallets();
  const hotWallets = await getHotWallerts();
  const uniquesDaily = await getWalletsDaily();
        
  return{
    props: {
      details,
      info,
      totalUniques,
      lastUnique,
      categoryWallets,
      rankingWallets,
      hotWallets,
      uniquesDaily,
    }
  }

}