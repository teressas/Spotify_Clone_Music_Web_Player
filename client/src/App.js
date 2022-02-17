import "bootstrap/dist/css/bootstrap.min.css"
import { Login } from './Login';
import Dashboard from './Dashboard'

// get code from url parameters
const code = new URLSearchParams(window.location.search).get('code')

function App() {
  return (
    // if code exists, display dashboard and pass in code else send the user to the login.
    code ? <Dashboard code={code} /> : <Login />
  );
}

export default App;
