import React from 'react';
import moment from 'moment';
import { render as RTLRender } from '@testing-library/react';
import { HashRouter as Router } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { Provider } from 'react-redux';


import '@testing-library/jest-dom/extend-expect'
import 'jest-localstorage-mock';
import 'mutationobserver-shim';

import store from './store';


moment.now = () => {
  return new Date('December 17, 1995 03:24:00')
}

const theme = createMuiTheme({});

export const render = element => {
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
