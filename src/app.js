// ----------------------
// IMPORTS

// React
import React from 'react';
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom'
// import { Router, Route } from 'react-router'

import ListPage from './components/ListPage'
import CreateBookmark from './components/CreateBookmark'

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

export default () => (
  <div>
    <Helmet
      title="ReactQL application"
      meta={[{
        name: 'description',
        content: 'Plisk on ReactQL',
      }]} />
    <div className={css.hello}>
      <img src={logo} alt="Plisk" className={css.logo} />
    </div>
    <hr />
     <Route path='/' component={ListPage}>
        <Route path='bookmark' component={CreateBookmark} />
      </Route>
    <p>Runtime info:</p>
    <Stats />
    <hr />
  </div>
);
