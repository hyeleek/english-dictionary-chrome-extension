import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './content.styles.css';
import { printLine } from './modules/print';
import Frame from './modules/frame/frame';
import Sidebar from '../Sidebar/Sidebar.jsx';

let sidebarRoot = document.createElement('div');
document.body.appendChild(sidebarRoot);
sidebarRoot.setAttribute('id', 'sidebar-root');

let selectedWord = null;
document.addEventListener("mouseup", handleSelection);

const frameComponent =  ReactDOM.render(
  <Frame
    url={chrome.extension.getURL('sidebar.html')}
  />, sidebarRoot
);

var frame = document.getElementById('sidebar-iframe').contentWindow;

function handleSelection(){
  if (window.getSelection() && window.getSelection().toString()!="") {
    selectedWord = window.getSelection().toString();
    frame.postMessage({type: "parent", term: selectedWord }, "*");
  }
}

function unmountSidebar() {
  try {
    document.body.style.marginLeft = '0px';
    document.body.style.marginRight = '0px';
    ReactDOM.unmountComponentAtNode(sidebarRoot);
  } catch (e) {
    console.log(e);
  }
}

const checkSidebarStatus = () => {
  chrome.runtime.sendMessage(
    {
      from: 'content',
      msg: 'REQUEST_SIDEBAR_STATUS',
    }, function(response){
        changeWidth(response);
    }
  );

};

const changeWidth = (toggleResult) => {
  sidebarRoot.removeAttribute("class");
  if ( toggleResult ){
    sidebarRoot.setAttribute('class', 'expanded');
  } else {
    sidebarRoot.setAttribute('class', 'shrink');
  }
}

checkSidebarStatus();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (
    request.from === 'background' &&
    request.msg === 'TOGGLE_SIDEBAR'
  ) {
    changeWidth(request.toStatus);
  }
});
