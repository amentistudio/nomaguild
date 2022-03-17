import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga4';
import { MoralisProvider } from "react-moralis";
import './index.scss';

const { REACT_APP_MORAILIS_URL, REACT_APP_MORALIS_APP_ID } = process.env;

ReactGA.initialize('G-J6M4SL768E');

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider serverUrl={REACT_APP_MORAILIS_URL} appId={REACT_APP_MORALIS_APP_ID}>
      <Router basename='/'>
        <App />
      </Router>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();