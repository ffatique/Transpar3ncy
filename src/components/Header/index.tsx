import styles from './styles.module.scss';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { CgMenuBoxed } from 'react-icons/cg';
import { FaWallet } from 'react-icons/fa';
import { GiTrophiesShelf, GiProgression } from 'react-icons/gi';
import { AiOutlinePieChart } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import Image from 'next/future/image';
import logo from '../../../public/images/Logo.png';
import Link from 'next/link';

export function Header(){
  
  return (
    <header className={styles.headerContainer}>   
      <div className={styles.headerContent}>
        <Image src={logo} alt="Logo Transpar3ncy"/>
        <CgMenuBoxed id={styles.burguer} size={25} color="white" />
        <h2>InfoGraphic Token</h2>
        <nav>
          <Link href="#growth">       
            <a><FaWallet size={25} color="white" /></a>
          </Link>
          <Link href="#ranking">
            <a><GiTrophiesShelf size={25} color="white" /></a>
          </Link>
          <Link href="#category">  
            <a><AiOutlinePieChart size={25} color="white" /></a>
          </Link>
          <Link href="#hot">
            <a><GiProgression size={25} color="white" /></a>
          </Link>
        </nav>
      </div>
    </header>
  )
}