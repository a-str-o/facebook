import Providers from 'next-auth/providers'
import '../styles/globals.css'
import { Provider } from 'next-auth/client'

function MyApp({ Component }) {
  return <Component />
  
  // (
  //   // <Provider session={pageProps.session}>
  //     <Component />
  //   // </Provider>
  // )
    
    
}

export default MyApp
