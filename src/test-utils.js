import React from 'react';
import moment from 'moment';
import { render as RTLRender } from '@testing-library/react';
import { HashRouter as Router } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { Provider } from 'react-redux';
import store from './store';

// mock some browswer api's
import '@testing-library/jest-dom/extend-expect'
import 'jest-localstorage-mock';
import 'mutationobserver-shim';
import 'fake-indexeddb/auto';


// it is now the beginning of time
moment.now = () => {
  return new Date('January 1, 1970 00:00:00')
}

const theme = createMuiTheme({ props: {
  MuiWithWidth: { initialWidth: 'lg' }
}});

export const render = element => {
  //
  // need to provide context to hooks expecting it
  // so that components can properly render
  //
  return {
    ...RTLRender(
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          { element }
        </ThemeProvider>
      </Router>
    </Provider>
    )
  }
}
