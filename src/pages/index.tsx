import { GetServerSideProps } from 'next';
import Head from 'next/head';
import styles from '../styles/home.module.scss';
import { FaCopy } from 'react-icons/fa';
import { GoTriangleUp } from 'react-icons/go';
import { db } from '../services/firebaseConnection';
import { doc, getDocs, getDoc, where, collection, orderBy, query, limit, startAfter, endBefore, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/future/image';
import binance from '../../public/images/binance.png';
import ethereum from '../../public/images/ethereum.png';
import polygon from '../../public/images/polygon.png';

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
        <title>Home</title>
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
          </div>
        </div>
        <div className={styles.cardContent2}>
          <div className={styles.cardCatGraph}>
            <div className={styles.topCard}>
              <h3>Categories Graphic</h3>
              <p>...</p>
            </div>
          </div>
        </div>
        <div className={styles.cardContent3}>
          <div className={styles.cardRanking}>
            <div className={styles.topCard}>
              <h3>Wallets Ranking</h3>
              <p>...</p>
            </div>
            <div className={styles.underTopCard}>
              <p>Position</p>
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