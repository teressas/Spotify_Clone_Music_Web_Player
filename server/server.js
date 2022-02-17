// call .env file 
require('dotenv').config()

// import express, cors, bodyParser, lyricsFinder and SpotifyWebApi library
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const lyricsFinder = require('lyrics-finder')
const SpotifyWebApi = require('spotify-web-api-node')

const path = require('path');

const app = express()
app.use(cors())

// use json bodyParser
app.use(bodyParser.json())
// allow url parser 
app.use(bodyParser.urlencoded({ extended: true }))

// route to refresh token
app.post('/api/refresh', (req, res) => {
    // get refresh token from
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken,
    })

    // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
    // source: spotify documentation
    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn
            })
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(400)
        })
})

// create login route to create new instance of the SpotifyWebApi and pass in the authentication parameters
app.post('/api/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    })

    // from spotify-web-api-node documentation, 
    // authorizes that we have a code then provides the tokens we need to do the accessing of the code that we need to refresh authorization
    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            // call access token, refresh token and expiresIn from API call
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch(err => {
            res.sendStatus(400)
        })
})

app.get('/api/lyrics', async (req, res) => {
    const lyrics =
        (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
})

app.listen(8000)