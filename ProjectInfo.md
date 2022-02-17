Project Information: 

OAuth Flow:
- web app running on server
- user grants permission only once
- the client secret key is safely stored
- see authorization code flow on Spotify documentation to create authorization URL: 
    https://developer.spotify.com/documentation/general/guides/authorization/code-flow/

Authentication URL:
 "https://accounts.spotify.com/authorize?client_id=6a132f4de6684e5abde7622e54a88af0&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

Break down:
1. https://accounts.spotify.com/authorize : from Spotify Documentation
2. To get the client token, go to developer.spotify.com to create a new app on the Dashboard
3. & = concatenate
4. response_type=code
5. http://localhost:3000
6. scope=streaming
    - %20 = space
    - user-read-email: scope found in Spotify documentation, depends on what you what bring back from API calls

Client Side Dependencies
npm i bootstrap react-bootstrap
npm i spotify-web-api-node 
npm i react-spotify-web-playback 
    - https://www.npmjs.com/package/react-spotify-web-playback

Server side dependencies
npm i express
npm i spotify-web-api-node
npm i nodemon --save-dev
(save as dev dependency)
npm i cors
npm i body-parser
npm i lyrics-finder 
npm i dotenv

How to call Server
 "scripts": {
    "devStart": "nodemon server.js",
    "start": "node server.js"
  },
npm run devStart
instead of nodemon server.js


Spotify Web API Node
    - https://github.com/thelinmichael/spotify-web-api-node
    - used to make authentication easier
    - setup server.js to store expires_in, refresh_token and access_token

useAuth:
- custom hook that handles all the code authentication logic

- .env file created to store API keys