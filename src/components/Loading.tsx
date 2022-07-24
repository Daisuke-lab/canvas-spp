import React , {useState, useEffect}from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';


function Loading() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = (url:string) => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url:string) => (url === router.asPath) && setLoading(false);

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    })
    
    return loading?(<Box sx={{ width: '100%' }}>
    <LinearProgress />
  </Box>):(<></>);
}

export default Loading