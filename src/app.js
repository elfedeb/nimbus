// ----------------------
// IMPORTS

// React
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// import { Router, Route } from 'react-router'`

import LoginAuth0 from './components/LoginAuth0';
import ListPage from './components/ListPage';
import CreateBookmark from './components/CreateBookmark';

// GraphQL
import { gql, graphql, ApolloProvider } from 'react-apollo';

// Routing
import { Link, Route, browserHistory } from 'react-router-dom';

// <Helmet> component for setting the page title
import Helmet from 'react-helmet';

// Helper to merge expected React PropTypes to Apollo-enabled component
import { mergeData } from 'kit/lib/apollo';

// Styles
import './styles.global.css';
import css from './styles.css';

// Get the ReactQL logo.  This is a local .svg file, which will be made
// available as a string relative to [root]/dist/assets/img/
import logo from './assets/plisk-icon.png';

// Stats pulled from the environment.  This demonstrates how data will
// change depending where we're running the code (environment vars, etc)
// and also how we can connect a 'vanilla' React component to an RxJS
// observable source, and feed eventual values in as properties
const Stats = () => {
  const info = [
    ['Environment', process.env.NODE_ENV],
    ['Running', SERVER ? 'On the server' : 'In the browser'],
  ];
  return (
    <ul className={css.data}>
      {info.map(([key, val]) => (
        <li key={key}>{key}: <span>{val}</span></li>
      ))}
    </ul>
  );
};

const clientId = 'IDczC0ct5C9GX9g1cqF3Umr2IVLt1qfy`'
const domain = 'priisma.auth0.com'

class App extends React.Component {
  static propTypes = {
    history: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired,
  }

  _logout = () => {
    // remove token from local storage and reload page to reset apollo client
    window.localStorage.removeItem('auth0IdToken')
    location.reload()
  }

  _isLoggedIn = () => {
    return this.props.data.user
  }

  render() {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }
    if (this._isLoggedIn()) {
      return this.renderLoggedIn()
    } else {
      return this.renderLoggedOut()
    }
  }

  renderLoggedIn() {
    return (
      <div>
        <Helmet
          title="Welcome, xxx to Plisk"
          meta={[{
            name: 'description',
            content: 'Plisk on ReactQL',
          }]} />
        <div className={css.hello}>
          <img src={logo} alt="Plisk" className={css.logo} />
        </div>
        <span
            className='dib bg-red white pa3 pointer dim'
            onClick={this._logout}
          >
            Logout
          </span>
        <hr />
        <Route path='/' component={ListPage}>
          <Route path='bookmark' component={CreateBookmark} />
        </Route>
        <p>Runtime info:</p>
        <Stats />
        <hr />
      </div>
    )
  }
  renderLoggedOut() {
    return (
      <div>
        <Helmet
          title="Login to Plisk"
          meta={[{
            name: 'description',
            content: 'Plisk on ReactQL',
          }]} />
        <div className={css.hello}>
          <img src={logo} alt="Plisk" className={css.logo} />
        </div>
        <LoginAuth0
            clientId={clientId}
            domain={domain}
          />
      </div>
    )
  }
}

const userQuery = gql`
  query userQuery {
    user {
      id
    }
  }
`
export default graphql(userQuery)(App);