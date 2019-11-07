import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import { selectPaletteType } from '../store/selectors';



const ProvideTheme = ({ children }) => {
  const paletteType = useSelector(selectPaletteType);

  // memoize so not creating a new theme on every
  // render if the paletteType hasn't changed
  const theme = useMemo(() => (
    createMuiTheme({
      palette: {
        type: paletteType
      }
    })
  ), [paletteType])

  return (
    <ThemeProvider theme={theme}>
      { children }
    </ThemeProvider>
  ) 
}

export default ProvideTheme;
