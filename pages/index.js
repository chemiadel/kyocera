import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from 'lib/azureAuth/authContext';

const Index = (props) => {
    const { user, loading} = useAuth()
    useEffect(()=>{

        if(!loading && user) return window.location.href="/salestoolkit"
        if(!loading && !user) return window.location.href="/login"

    },[user,loading])

    // console.log('')
    return null
}

export default Index;