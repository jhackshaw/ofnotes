import React from 'react';
import moment from 'moment';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import store from './store';


// instead of saying 5 days ago
// say 5d ago
moment.locale('en', {
  relativeTime: {
    s: '1s',
    ss: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    y: '1y',
    yy: '%dy'
  }
})

const AppRoot = props => {
  return (
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  )
}

export default AppRoot;
