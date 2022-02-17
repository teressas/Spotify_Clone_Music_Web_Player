import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useAuth(code) {

    // store required tokens pulled from login
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()


    // run useEffect everytime code changes, calls Api created in server 
    useEffect(() => {
        axios
            .post('http://localhost:8000/login', {
                // post code to route, calls all the code on server
                code,
            })
            .then(res => {
                console.log("inside useAuth.then code is",code)
                setAccessToken(res.data.accessToken)
                setRefreshToken(res.data.refreshToken)
                setExpiresIn(res.data.expiresIn)
                // removes code from url
                window.history.pushState({}, null, "/")
            })
            .catch(() => {
                console.log("inside useAuth.catch code is", code)
                // if there's an error takes user back to login
                window.location = '/'
            })
    }, [code])

    // when refresh token or expiresIn changes, then run useEffect
    // resets the access token and expiresIn after token is refreshed
    useEffect(() => {
        // useEffect is running before refresh token or expiresIn exists
        // if check prevents refresh token or expiresIn from running, before it actually exists
        if (!refreshToken || !expiresIn) return
        // ensures refresh happens before token expires
        // do this on an interval based on the expired time
        const interval = setInterval(() => {
            axios
                .post('http://localhost:8000/refresh', {
                    refreshToken,
                })
                .then(res => {
                    setAccessToken(res.data.accessToken)
                    setExpiresIn(res.data.expiresIn)
                })
                .catch(() => {
                    window.location = '/'
                })
        }, (expiresIn - 60) * 1000) // refreshes 1 min before expiresIn expires, * 1000 convert to milliseconds

        return () => clearInterval(interval) // prevents the use of an incorrect refresh token
    }, [refreshToken, expiresIn])

    return accessToken
}

