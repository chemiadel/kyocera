import {useEffect, useState} from 'react';
import {ApolloProvider} from '@apollo/client';
import {useApollo} from '../lib/apollo-client'
import {useRouter} from 'next/router';
import Modal from 'react-modal';

import '@/styles/main.scss';
import 'suneditor/dist/css/suneditor.min.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import {GlobalStateProvider} from '@/components/global-state';

import {MsalProvider} from "@azure/msal-react";
import {EventType, PublicClientApplication} from "@azure/msal-browser";

import {callMsGraph, getUserAccessToken} from '../services/ms-auth-call';
import {clearLocalStorage, getLocalStorage, setLocalStorage} from "../lib/helpers/localstorage.helper";
import Layout from '@/components/layout/layout';
export var msalInstance = null;
export var msalConfig = null;

Modal.setAppElement('#__next');

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const apolloClient = useApollo(pageProps);
  const [user, setUser] = useState(null);
  const [loading, setLoading] =  useState(true)
  const [error, setError] = useState(``);

  const cantLogin = () => {
    setError('The User ID or the user password is incorrect.');
    clearLocalStorage();
  }

  useEffect( async () => {

    if (window) {

      const selectedAdTenant = getLocalStorage('selectedAdTenant');
      const token = getLocalStorage('access-token');
      const activeUser = getLocalStorage('active-user');

      if (!!selectedAdTenant) { 
        msalConfig = {
          auth: {
            clientId: selectedAdTenant.cid,
            authority: `https://login.microsoftonline.com/${selectedAdTenant.auth}`,
            redirectUri: "/",
            postLogoutRedirectUri: "/"
          }
        };
        msalInstance = new PublicClientApplication(msalConfig);
        console.log('msal setted');
      };
      
      if (msalConfig && msalInstance) {
        await msalInstance.handleRedirectPromise();
        const accounts = await msalInstance.getAllAccounts();
  
        msalInstance.addEventCallback( async (event) => {
          console.log(event); 
          if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
            const account = event.payload.account;
            await msalInstance.setActiveAccount(account);
            getUserAccessToken().then((token) => {
              setLocalStorage('access-token', token)
            });
            callMsGraph().then((account) => {
              account.canLogin ? setLocalStorage('active-user', account) : cantLogin();
              router.reload();
            });
          }
        });

        if (accounts.length > 0) {
          console.log('accounttayim');
          console.log(accounts);
          //Azure login
          msalInstance.setActiveAccount(accounts[accounts.length-1]);
          getUserAccessToken().then((token) => {
            setLocalStorage('access-token', token);
          }, err => {
            console.log(err);
          });
          callMsGraph().then((account) => {
            if (account.canLogin) {
              setLocalStorage('active-user', account);
              router.push('/salestoolkit');
            } else {
              clearLocalStorage()
              setError('You are not eligible to use the Sales Toolkit');
              router.push('/login');
            }
          }, err => {
            console.log(err);
          });
        }


      } else { 
        if (!token) {
          //token & forgot password
          if (router.asPath !== '/[token]' && router.asPath !== '/forgot-password'
              && router.asPath !== '/terms' && router.asPath !== '/data-privacy-notice') {
            if (router.asPath !== '/login') {
              router.push('/login');
            }
          }
        }
      }

      if (token && activeUser) {
        setUser(activeUser);
        if (router.asPath === '/' || router.asPath === '/login') {
          router.push('/salestoolkit');
        }
        if (router.asPath.includes('/admin')) {
          if (activeUser.role !== 'ADMIN') {
            router.push('/index');
          }
        }

        return;
      } else {
        if (router.asPath === '/login' && !token) {
          router.push('/login');
        }
      }
    }
  }, []);

  const getLayout = Component.getLayout || ((page) => page)

  if (msalConfig && msalInstance) {
    console.log(msalConfig);
    msalInstance = new PublicClientApplication(msalConfig);
    console.log('with msal');
    return getLayout(
      <ApolloProvider client={apolloClient}>
      <GlobalStateProvider>
      <Layout>
      <MsalProvider instance={msalInstance}>
        <Header user={user} />
        <Component {...pageProps} user={user} error={error} />
        <Footer />
        </MsalProvider>
        </Layout>
        </GlobalStateProvider>
      </ApolloProvider>
    )
  } else { 
    console.log('without msal');
    return getLayout(
      <ApolloProvider client={apolloClient}>
      <GlobalStateProvider>
      <Layout>
        <Header user={user} />
        <Component {...pageProps} user={user} error={error} />
        <Footer />
        </Layout>
        </GlobalStateProvider>
      </ApolloProvider>
    )
  }


  return (
    <ApolloProvider client={apolloClient}>
      <GlobalStateProvider>
        <MsalProvider instance={msalInstance}>
          <Header user={user} />
          <Component {...pageProps} user={user} error={error} />
          </MsalProvider>
        <Footer />
      </GlobalStateProvider>
    </ApolloProvider>
  );
}
