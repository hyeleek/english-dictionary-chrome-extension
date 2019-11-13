import React from 'react';
import { render } from 'react-dom';
import Sidebar from './Sidebar';
import './index.css';

const App = () => (
  <Sidebar />
);

render(<App />, window.document.querySelector('#app-container'));
