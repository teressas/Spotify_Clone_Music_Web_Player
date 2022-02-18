import React from 'react'
import { Container } from 'react-bootstrap'

// create authentication uri to authenticate a user

// https://developer.spotify.com/documentation/web-playback-sdk/quick-start/#
const authEndpoint = "https://accounts.spotify.com/authorize";
// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "6a132f4de6684e5abde7622e54a88af0";
const redirectUri = "http://18.223.151.44";
const scopes = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-modify-playback-state",
];


const AUTH_URL = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
    "%20"
)}`;

console.log(AUTH_URL)

// const AUTH_URL =
//     "https://accounts.spotify.com/authorize?client_id=6a132f4de6684e5abde7622e54a88af0&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

// button to login user, this redirects user to the auth_url and generates code
export const Login = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <a className="btn btn-success btn-lg" href={AUTH_URL}>Login With Spotify</a>
        </Container>
    )
}