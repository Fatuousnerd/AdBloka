const reqs: any[] = [];
const ports: chrome.runtime.Port[] = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.runtime.onConnect.addListener((port: any) => {
  if (port.name === "reqmon") {
    ports.push(port);

    port.onDisconnect.addListener(() => {
      const idx = ports.indexOf(port);

      if (idx >= 0) ports.splice(idx, 1);
    });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const payload = {
      url: details.url,
      method: details.method,
      type: details.type,
      tabId: details.tabId,
      timeStamp: details.timeStamp,
    };

    for (const port of ports) {
      port.postMessage(payload);
    }

    reqs.push({
      url: details.url,
      method: details.method,
      type: details.type,
      tabId: details.tabId,
      timeStamp: details.timeStamp,
    });

    return undefined;
  },
  { urls: ["<all_urls>"] },
);
