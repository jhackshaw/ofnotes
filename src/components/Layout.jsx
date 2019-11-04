import React from 'react';
import { CssBaseline } from '@material-ui/core';




const Layout = ({ children }) => {

  return (
    <>
      <CssBaseline />
      { children }
    </>
  )
}


export default Layout;
