import { useState, useEffect, useContext, createContext } from 'react'
import {useMsal} from "@azure/msal-react";
import {callMsGraph, getUserAccessToken} from '../../services/ms-auth-call';

const authUserContext = createContext({
    user: null,
    loading: true,
    setUser: ()=> {},
    errorAzure: ''
});

export default function  AuthContextProvider({children, instanceInit, cookies}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorAzure, setError] = useState('')
  const { instance, accounts, inProgress } = useMsal();

  async function checkUser(){
    console.log('-----chckeru',{cookies})
    const token = JSON.parse(cookies['access-token'] || null)
    const activeUser = JSON.parse(cookies['active-user']  || null)

    if(instanceInit){
    if ((inProgress === "none" ) && accounts.length > 0) {

        await instance.setActiveAccount(accounts[0]);
        const acc=await callMsGraph(instance)
        console.log('user account', acc);
        if (acc.canLogin) {
          setUser(acc)
          setError('')
        } else {
          setError('You are not eligible to use the Sales Toolkit');
        }
      }
    
      // if (inProgress === "handleRedirect" && accounts.length <= 0) setLoading(false)
    }
    
    if (token && activeUser) {
      setUser(activeUser)
    }

    if (inProgress === "none" ) setLoading(false)

  }
  useEffect( () => {
      checkUser()
  },[inProgress, accounts, instance]);

  console.log('accounts',accounts)
  console.log('instance', instanceInit)
  console.log('inProgress', inProgress)

  return <authUserContext.Provider value={{user, loading, setUser, errorAzure}}>{children}</authUserContext.Provider>;

}

export const useAuth = () => useContext(authUserContext);

