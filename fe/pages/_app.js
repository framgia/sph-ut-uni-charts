import '@/styles/global.css'
import Main from '@/src/templates/Main'

export default function MyApp({ Component, pageProps }) {
  return (
    <Main>
      <Component {...pageProps} />
    </Main>
  )
}
