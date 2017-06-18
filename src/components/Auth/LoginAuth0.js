import { EventEmitter } from 'events'
import auth0 from 'auth0-js'
import { AUTH_CONFIG } from './auth0-variables'
import { withRouter } from 'react-router-dom'

export default class Auth extends EventEmitter {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    responseType: 'token id_token',
    scope: 'openid'
  });

  constructor() {
    super();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    this.auth0.authorize()
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.props.history.push(`/signup`)
        console.warn('Ya estas loggeao papáaahh');
      } else if (err) {
        this.props.history.push(`/signup`)
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setSession(authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      window.localStorage.setItem('access_token', authResult.accessToken);
      window.localStorage.setItem('id_token', authResult.idToken);
      window.localStorage.setItem('expires_at', expiresAt);
      // navigate to the home route
      this.props.history.push(`/signup`)
    }
  }

  logout() {
    // Clear access token and ID token from local storage
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('id_token');
    window.localStorage.removeItem('expires_at');
    // navigate to the home route
    this.props.history.push(`/signup`)
  }

  isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    let expiresAt = JSON.parse(window.localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
