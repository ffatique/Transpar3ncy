import { GetStaticProps } from 'next';
import Head from 'next/head';
import styles from '../styles/home.module.scss';
import { FaCopy } from 'react-icons/fa';
import { GoTriangleUp, GoTriangleDown } from 'react-icons/go';
import { BsCircleFill, BsGraphDown } from 'react-icons/bs';
import { GiProgression } from 'react-icons/gi';
import { useEffect, useState } from 'react';
import Image from 'next/future/image';
import binance from '../../public/images/binance.png';
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
import { getDetails } from './api/getDetails';
import { getInfo } from './api/getInfo';
import { getTotalWallets } from './api/getTotalWallets';
import { getLastWallets } from './api/getLastWallets';
import { getCategoryWallets } from './api/getCategoryWallets';
import { getRankingWallets } from './api/getRankingWallets';
import { getHotWallets } from './api/getHotWallets';
import { getUniquesDaily } from './api/getUniquesDaily';


//--------------------------------------------------------------------------------------------------//
// BEGIN INTERFACES
//--------------------------------------------------------------------------------------------------//
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

//--------------------------------------------------------------------------------------------------//
// END INTERFACES
//--------------------------------------------------------------------------------------------------//


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
  const [inactives, setInactives] = useState(0);
  const [variation, setVariaton] = useState('');


//--------------------------------------------------------------------------------------------------//
// BEGIN LISTS
//--------------------------------------------------------------------------------------------------//

function compare(a: { amount: number; }, b: { amount: number}) {
  if ( a.amount > b.amount ){
    return -1;
  }
  if ( a.amount < b.amount ){
    return 1;
  }
  return 0;
}

// BURN
const burnAddress = categoryList.slice(0,1).map( wallet => {
  return parseFloat(wallet.tokens.replace(",","").replace(",",""))
}).reduce(function(soma, i) {
  return soma + i;
});

const burnAddressW = categoryList.slice(0,1).map( wallet => {
  return wallet.address
})

// BURN

// BUY AND SELL LISTS
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

// BUY AND SELL LISTS 

// HUMPBACK WHALES LITS
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

// HUMPBACK WHALES LITS

// WHALES LITS
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

// WHALES LITS

// SHARKS LITS

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

// SHARKS LITS

// DOLPHINS LITS
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

// DOLPHINS LITS

// TURTLES LITS
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

// TURTLES LITS

// CRABS LITS
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

// CRABS LITS

// SARDINES LITS
const sardineW = parseInt(holdersActives) - (humpbackW + whaleW + sharkW + dolphinW + turtleW + crabW)
const sardineTotal = 1000000000 - (burnAddress + humpbackTotal + whaleTotal + sharkTotal + dolphinTotal + turtleTotal + crabTotal)
const sardineAvg =  sardineTotal  / sardineW

// SARDINES LITS

//--------------------------------------------------------------------------------------------------//
// END LISTS
//--------------------------------------------------------------------------------------------------//


//--------------------------------------------------------------------------------------------------//
// BEGIN GRAPHICS
//--------------------------------------------------------------------------------------------------//

  // PIE GRAPHIC
  const pieData = {
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
        labels:{
          value:{
            align: 265,
            offset: 50,
            color: '#14112E',
            font:{
              weight: 800,
              size: 20,
            }
          },
        },
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
      },
    },
    
  };

  // PIE GRAPHIC

  // DOUGHNUT GRAPHIC
  const doughnutData = {
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
        labels:{
          value:{
            align: 265,
            offset: -15,
            color: 'white',
            font:{
              weight: 600,
              size: 15,
            }
          },
        },
        formatter: (value: any, context: any)=> {
          const datapoints = context.chart.data.datasets[0].data;
          function totalSum(total: any, datapoint: any) {
            return total + datapoint;
          }
          const totalvalue = datapoints.reduce(totalSum, 0);
          const percentageValue = (value / totalvalue * 1).toLocaleString("en", { style: "percent",  minimumFractionDigits: 2});
          return percentageValue;
        },
      }
    }
  };

  // DOUGHNUT GRAPHIC
 
  // LINE ARE GRAPHIC
  const label = [];
  const data = [];
  for(var i of uniquesDay.slice(2,32)){
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
      tooltip:{
        titleFont: {size: 16},
        bodyFont: {size: 16},
        padding: 2,
      },
      legend: {
        display: false,
      },
      datalabels:{
        display: true,
        labels:{
          value:{
            align: 265,
            color: 'white',
            font:{
              weight: 600,
              size: 16,
            }
          },
        },
      },
    },
  };

  // LINE ARE GRAPHIC

//--------------------------------------------------------------------------------------------------//
// END GRAPHICS
//--------------------------------------------------------------------------------------------------//


 
//--------------------------------------------------------------------------------------------------//
// FUNCTIONS
//--------------------------------------------------------------------------------------------------//

  function copyCreator(){
    navigator.clipboard.writeText('0xe341d141133d82def0ee59a3d9365fd2942eeb63');
  }

  function copyAdd(){
    navigator.clipboard.writeText('0x6dd60afb2586d31bf390450adf5e6a9659d48c4a');
  }

//--------------------------------------------------------------------------------------------------//
// FUNCTION
//--------------------------------------------------------------------------------------------------//



//--------------------------------------------------------------------------------------------------//
// PAGE
//--------------------------------------------------------------------------------------------------//

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
    setInactives(parseInt(totalUniques.uniqueWallets) - parseInt(info.holders.split("address",1).toString().replace(",","")));
    setVariaton((parseInt(lastUnique.lastDayUniqueWallets) / parseInt(totalUniques.uniqueWallets)).toLocaleString("pt-BR", { style: "percent",  minimumFractionDigits: 2}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

 
  return (
    <>
    <Head>
        <title>InfoGraphic MafaCoin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
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
              <div className={styles.uniqueCard2}>
                <h4>Burn Address:<span>{burnAddressW}</span></h4>
                <h3>Burned:<span>{burnAddress.toLocaleString("en")} MafaCoin</span></h3>
                <h3>Value:<span>{ (parseFloat(price) * parseFloat(burnAddress.toString().replace(",","").replace(",",""))).toLocaleString("en", { style: "currency", currency: "USD"})}</span></h3>
              </div>
            </div>
            <div className={styles.cardNet}>
              <div className={styles.uniqueCard}>
                <h2>Network</h2>
                <a><Image src={binance} alt="Binance"/></a>
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
                <Pie data={pieData}  plugins={[ChartDataLabels]} options={pieOptions} width={1200} height={1200}/>
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
              <Line data={areaData} plugins={[ChartDataLabels]} options={areaOptions} />
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
              <ul><p>Place MarineScale <span>TotalSupply%</span></p>
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
              <Doughnut data={doughnutData}  plugins={[ChartDataLabels]} options={doughnutOptions} width={1200} height={1200}/>
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
              <ul><p>Position Wallet <span>Value</span></p>
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


//--------------------------------------------------------------------------------------------------//
// SERVER
//--------------------------------------------------------------------------------------------------//

export const getStaticProps: GetStaticProps = async () => {

  //WEBSCRAPING AND API CONSULTS
  const details = await getDetails();
  const info = await getInfo();
  const totalUniques = await getTotalWallets();
  const lastUnique = await getLastWallets();
  const categoryWallets = await getCategoryWallets();
  const rankingWallets = await getRankingWallets();
  const hotWallets = await getHotWallets();
  const uniquesDaily = await getUniquesDaily();

  return{
    revalidate: 60 * 480, // Revalidate 24 hours
    props: {
      details,
      info,
      totalUniques,
      lastUnique,
      categoryWallets,
      rankingWallets,
      hotWallets,
      uniquesDaily,
    },
  }
}