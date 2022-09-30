import { AppProps } from 'next/app';
import '../styles/global.scss';
import { Header } from '../components/Header';
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

const activeChainId = ChainId.BinanceSmartChainMainnet;

export default function App({
  Component, pageProps: { session, ...pageProps }
}: AppProps) {
   return (
      <ThirdwebProvider desiredChainId={activeChainId}>
        <Header/>
        <Component {...pageProps}/>
      </ThirdwebProvider> 
  )
}
