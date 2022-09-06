import { GetServerSideProps } from 'next';
import Head from 'next/head';
import styles from '../styles/home.module.scss';
import { Header } from '../components/Header';
import { FiEdit2 } from 'react-icons/fi';
import { db } from '../services/firebaseConnection';
import { doc, getDocs, getDoc, where, collection, orderBy, query, limit, startAfter, endBefore, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function Home(){

  const [adminRule, setAdminRule] = useState('');
 
  useEffect(()=>{

  },[]);
 
  return (
    <>
    <Head>
        <title>Home</title>
    </Head>
    <main className={styles.mainCotainer}>

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