// ----------------------
// IMPORTS

// React
import React from 'react';
import PropTypes from 'prop-types';
import ListPage from './components/ListPage'
import CreateBookmark from './components/CreateBookmark'

// GraphQL
import { gql, graphql } from 'react-apollo';

// Routing
import { Link, Route } from 'react-router-dom';

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

// ----------------------

// We'll display this <Home> component when we're on the / route
const Home = () => (
  <h1>You&apos;re on the home page - click another link above</h1>
);

// Helper component that will be conditionally shown when the route matches.
// This gives you an idea how React Router v4 works
const Page = ({ match }) => (
  <h1>Changed route: {match.params.name}</h1>
);

// Specify PropTypes if the `match` object, which is injected to props by
// the <Route> component
Page.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
};

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
