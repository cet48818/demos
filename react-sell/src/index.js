import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './common/css/reset.css';
import './common/css/index.scss';
import fastclick from 'fastclick'


fastclick.attach(document.body)
// import Perf from 'react-addons-perf';
// window.Perf = Perf

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
