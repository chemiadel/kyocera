import {ApolloProvider} from '@apollo/client';
import {useApollo} from '../lib/apollo-client'
import Modal from 'react-modal';
import '@/styles/main.scss';
import 'suneditor/dist/css/suneditor.min.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import {GlobalStateProvider} from '@/components/global-state';

import {MsalProvider} from "@azure/msal-react";
import Layout from '@/components/layout/layout';
import initMSA from '../lib/azureAuth/init'
import App from "next/app"
const { parseCookies, setCookie, destroyCookie } = require('nookies');
import AuthProvider from '../lib/azureAuth/authContext'

Modal.setAppElement('#__next');

export default function MyApp({ Component, pageProps, tenant, cookies }) {
  const apolloClient = useApollo(pageProps);
  const getLayout = Component.getLayout || ((page) => page)
    

    if(tenant) {
      const msalInstance=initMSA(JSON.parse(tenant))
      console.log('--------------msal',true)
      return getLayout(
      <ApolloProvider client={apolloClient}>
      <GlobalStateProvider>
      <Layout>
      <MsalProvider instance={msalInstance}>
          <AuthProvider instanceInit={true} cookies={cookies}>
              <Header />
              <main className="main">
              <Component {...pageProps}/>
              </main>
              <Footer />
          </AuthProvider>
      </MsalProvider>
      </Layout>
      </GlobalStateProvider>
      </ApolloProvider>)
    } else {
      return <ApolloProvider client={apolloClient}>
      <GlobalStateProvider>
      <Layout>
          <AuthProvider instanceInit={false} cookies={cookies}>
              <Header />
              <Component {...pageProps}/>
              <Footer />
          </AuthProvider>
      </Layout>
      </GlobalStateProvider>
      </ApolloProvider>
    }
}


MyApp.getInitialProps = async (appContext) => {

  const cookies = parseCookies(appContext.ctx);
  const tenant = cookies.tenant
  console.log('----------------------tenant', tenant)

  const appProps = await App.getInitialProps(appContext)
  return { ...appProps, tenant, cookies }

}
