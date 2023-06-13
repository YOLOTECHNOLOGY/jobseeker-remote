'use client'

// import './flexible';
import Footer from './components/Footer'
import {useEffect} from 'react'
import useResponsiveFont from "./components/responseHook";
export default function ShopLayout(props:{
    children: React.ReactNode;
    params: {
      tag: string;
      item: string;
    }
  } ) {
    // URL -> /shop/shoes/nike-air-max-97
    // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
    useResponsiveFont(360, 540);
    return (
        <section style={{
          width: '100%',
          // overflow: "hidden",
          overflowX: 'clip',
          minHeight: '100vh',
          backgroundColor:'#ffffff',

        }}>
            {/* <header> */}
            {/*     <h1>boosJob</h1> */}
            {/* </header> */}
            <main>
            {props.children}
            </main>
            <Footer/>
        </section>
    )
  }