import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import axios from 'axios'

// create instance of SpotifyWebApi and pass in parameters
const spotifyApi = new SpotifyWebApi({
    clientId: "6a132f4de6684e5abde7622e54a88af0",
})

export default function Dashboard({ code }) {

    // pass in the code from useAuth
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")

    function chooseTrack(track) {
        setPlayingTrack(track)
        setSearch('')
        setLyrics('')
    }

    useEffect(() => {
        if (!playingTrack) return

        axios.get('http://localhost:8000/api/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist
            }
        }).then(res => {
            setLyrics(res.data.lyrics)
        })
    }, [playingTrack])

    // everytime access token changes we need to set access token
    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    // anytime or search query changes or access token changes rerun useEffect
    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return

        let cancel = false
        // search track, artist, song, album based on search term
        spotifyApi.searchTracks(search).then(res => {

            if (cancel) return // waits for search results to complete to then set results so it doesn't display mulitple results as user is typing
            // console.log(res.body.tracks.items)
            setSearchResults(
                // map through array and get track's artist, title, uri and album Url
                res.body.tracks.items.map(track => {
                    // start at the 1st index, get smallest image
                    const smallestAlbumImage = track.album.images.reduce(
                        (smallest, image) => {
                            if (image.height < smallest.height) return image
                            return smallest
                        },
                        track.album.images[0]
                    )
                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url,
                    }
                })
            )
        })
        return () => (cancel = true)
    }, [search, accessToken])

    return (
        <Container className="d-flex flex-column py-2" style={{ backgroundColor: "#1e1f21", height: "100vh", width: "150vh" }}>

            {/* create search bar */}
            <Form.Control type="search" placeholder="Search Songs/Artists" value={search} onChange={e => setSearch(e.target.value)} />

            {/* songs, album and lyrics container; size will grow based on amt of content and is scrollable */}
            <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>

                {/* Track Search Results */}
                {searchResults.map(track => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                ))}

                {searchResults.length === 0 && (
                    <div className="text-center" style={{ color: "white", whiteSpace: "pre" }}>
                        {lyrics}
                    </div>
                )}
            </div>
            {/* Music Player */}
            {/* if there's a playingTrack then get uri */}
            <div><Player accessToken={accessToken} trackUri={playingTrack?.uri} /></div>

        </Container>

    )
}
