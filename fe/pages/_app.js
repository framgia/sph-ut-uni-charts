import '@/styles/global.css'
import Main from '@/src/templates/Main'

import AuthMiddleware from '@/src/templates/AuthMiddleware'

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthMiddleware>
      <Main>
        <Component {...pageProps} />
      </Main>
    </AuthMiddleware>
  )
}
