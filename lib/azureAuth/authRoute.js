import { useAuth } from '../azureAuth/authContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Authroute({ Component, children }) {
    const { user, loading } = useAuth()
    const router=useRouter()

    useEffect(()=>{
        if(Component.private && 
            !loading && 
            !user ) return router.push('/login')
            
    },[user, loading])

    if(!Component.private) return children
    if(loading) return null
    if(user) return children
}