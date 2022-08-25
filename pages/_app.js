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

      <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <p className="col-md-4 mb-0 text-muted">&copy; 2022 friss-hirek.com</p>

          <ul className="nav col-md-4 justify-content-end">
            <li className="nav-item"><Link href="/"><a href="#" className="nav-link px-2 text-muted">Főoldal</a></Link></li>
            <li className="nav-item"><Link href="/about"><a href="#" className="nav-link px-2 text-muted">Rólunk</a></Link></li>
            <li className="nav-item"><Link href="/source"><a href="#" className="nav-link px-2 text-muted">Források</a></Link></li>
          </ul>
        </footer>
      </div>

    </>
  )
}

export default MyApp
