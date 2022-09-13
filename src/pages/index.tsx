import { GetServerSideProps } from 'next';
import Head from 'next/head';
import styles from '../styles/home.module.scss';
import { FaCopy } from 'react-icons/fa';
import { GoTriangleUp } from 'react-icons/go';
import { BsCircleFill, BsCircleHalf, BsFillSquareFill } from 'react-icons/bs';
import { db } from '../services/firebaseConnection';
import { doc, getDocs, getDoc, where, collection, orderBy, query, limit, startAfter, endBefore, Timestamp } from 'firebase/firestore';
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

export default function Home(){

  const [adminRule, setAdminRule] = useState('');

  const address = "0x6dd60afb2586d31bf390450adf5e6a9659d48c4a";
  const tokenName = "MafaCoin";
  const symbol = "MAFA";
  const decimals = "18";
  const totalSupply = "1,000,000,000";
  const marketCap = "$1,365,267";
  const creator = "0xe341d141133d82def0ee59a3d9365fd2942eeb63";
  const variation = "8%";
  const wallets = "1280";
 
  useEffect(()=>{

  },[]);
 
  return (
    <>
    <Head>
        <title>Dashboard {tokenName}</title>
    </Head>

    <main className={styles.mainContainer}>

      <div className={styles.firstRollContainer}>
        <div className={styles.cardContent1}>
          <div className={styles.cardToken}>
            <div className={styles.topCard}>
              <h3>Token Details</h3>
              <p>...</p>
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
                <p>...</p>
              </div>
              <div className={styles.middleCard}>
                <GoTriangleUp size={10} color="var(--success)"/>
                <span>{variation} (24hours)</span>
              </div>
              <div className={styles.baseCard}>
                <h2>+ {wallets} Wallets</h2>
              </div>
            </div>
            <div className={styles.cardHolders}>
              <div className={styles.topCard}>
                <h3>Holders</h3>
                <p>...</p>
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
              <p>...</p>
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
              <p>...</p>
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
              <p>...</p>
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
              <p>...</p>
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
              <p>...</p>
            </div>
          </div>
        </div>
        <div className={styles.cardContent2}>
          <div className={styles.cardSellers}>
            <div className={styles.topCard}>
              <h3>Hot Sellers</h3>
              <p>...</p>
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
    
  return{
    props: {
    }
  }

}