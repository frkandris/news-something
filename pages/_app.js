import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Friss hírek | friss-hirek.com</title>
      </Head>

      <div className="grid wrapper">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
