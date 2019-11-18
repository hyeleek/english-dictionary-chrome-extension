import React from 'react';
import ReactDOM, { render } from 'react-dom';
import Sidebar from './Sidebar';
import './index.css';

const sidebarComponent =  ReactDOM.render(
  <Sidebar/>,
  window.document.querySelector('#app-container')
);
