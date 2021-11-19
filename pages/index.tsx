import Head from 'next/head'
import styles from 'styles/Home.module.scss'

import Header from 'components/Header'
import Footer from 'components/Footer'

import JobCard from 'components/JobCard'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nextjs Boilerplate</title>
        <meta name="description" content="Nextjs Boilerplate." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>
          Nextjs Boilerplate.
        </h1>

        <JobCard/>
      </main>
      <Footer />
    </div>
  )
}
