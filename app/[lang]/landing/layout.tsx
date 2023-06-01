'use client'

export default function ShopLayout(props:{
    children: React.ReactNode;
    params: {
      tag: string;
      item: string;
    }
  } ) {
    // URL -> /shop/shoes/nike-air-max-97
    // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
    console.log('ShopLayout',props);
    
    return (
        <section style={{
          width: '100wv',
          minHeight: '100vh',
          backgroundColor:'#ffffff',
        }}>
            {/* <header> */}
            {/*     <h1>boosJob</h1> */}
            {/* </header> */}
            <main>
            {props.children}
            </main>
            <footer>
                footer
            </footer>    
        </section>
    )
  }