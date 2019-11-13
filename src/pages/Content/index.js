import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './content.styles.css';
import { printLine } from './modules/print';
import Frame from './modules/frame/frame';

let sidebarRoot = document.createElement('div');
document.body.appendChild(sidebarRoot);
sidebarRoot.setAttribute('id', 'sidebar-root');

function mountSidebar() {
  const App = (
    <Frame
      url={chrome.extension.getURL('sidebar.html')}
    />
  );
  ReactDOM.render(App, sidebarRoot);
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
        console.log("reponse of sidebar", response);
        changeWidth(response);
    }
  );

};

const changeWidth = (toggleResult) => {
  console.log("change width class");
  sidebarRoot.removeAttribute("class");
  if ( toggleResult ){
    sidebarRoot.setAttribute('class', 'expanded');
  } else {
    sidebarRoot.setAttribute('class', 'shrink');
  }

}


checkSidebarStatus();
mountSidebar();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (
    request.from === 'background' &&
    request.msg === 'TOGGLE_SIDEBAR'
  ) {
    changeWidth(request.toStatus);
  }
});
