import React from 'react';
import moment from 'moment';
import { HashRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Provider } from 'react-redux';
import App from './containers/App';
import Layout from './components/Layout';
import store from './store';
import theme from './theme';


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
        <ThemeProvider theme={theme}>
          <Layout>
            <App />
          </Layout>
        </ThemeProvider>
      </Router>
    </Provider>
  )
}

export default AppRoot;
