import '../../assets/img/icon-34.png';
import '../../assets/img/icon-34-mark.png';
import '../../assets/img/icon-128.png';

let sidebarOpen = true; // open -> true  |  close -> false

chrome.storage.local.get(['sidebarOpen'], (result) => {
  if (result.sidebarOpen !== undefined) {
    sidebarOpen = result.sidebarOpen === true;
    console.log("got local storage data ", sidebarOpen);
  }
  changeBrowserIconBadgeWithSidebarOpenStatus(sidebarOpen);
});


const toggleSidebar = (toStatus = null) => {
  if (toStatus === null || toStatus === undefined) {
    sidebarOpen = !sidebarOpen;
  } else {
    sidebarOpen = toStatus;
  }
  persistSidebarOpenStatus(sidebarOpen);
  changeBrowserIconBadgeWithSidebarOpenStatus(sidebarOpen);
  let sidebarOpenCopy = sidebarOpen;
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    function(tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          from: 'background',
          msg: 'TOGGLE_SIDEBAR',
          toStatus: sidebarOpenCopy,
        });
      });
    }
  );
};


const changeBrowserIconBadgeWithSidebarOpenStatus = (status) => {
  if (status) {
    chrome.browserAction.setIcon({
      path: chrome.extension.getURL('icon-34-mark.png'),
    });
  } else {
    chrome.browserAction.setIcon({
      path: chrome.extension.getURL('icon-34.png'),
    });
  }
};

const persistSidebarOpenStatus = (status) => {
  chrome.storage.local.set({
    sidebarOpen: status,
  });
};


chrome.browserAction.onClicked.addListener((senderTab) => {
  console.log("browser icon clicked");
  toggleSidebar();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (
      request.from === 'content' &&
      request.msg === 'REQUEST_SIDEBAR_STATUS'
    ) {
      sendResponse(sidebarOpen);
    }
  }
);
