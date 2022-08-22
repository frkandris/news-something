import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import Head from 'next/head'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-WCCSKJS' });
  }, []);
  return (
    <>
      <Head>
        <title>Friss hírek | friss-hirek.com</title>
      </Head>

      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <Link href="/">
            <a className="navbar-brand">friss hírek</a>
          </Link>
        </div>
      </nav>

      <div className="grid wrapper">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
