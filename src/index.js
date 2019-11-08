import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './index.css'
import 'typeface-mclaren';
import 'typeface-roboto';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register();
