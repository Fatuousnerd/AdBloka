import { Blocker } from "@/lib/blocker";
import { AD_DOMAINS } from "@/lib/helpers";

const ports: chrome.runtime.Port[] = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  (async () => {
    for (const domain of AD_DOMAINS) {
      await blocker.block(domain);
    }
  })();
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

const blocker = new Blocker();
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const payload = {
      url: details.url,
      method: details.method,
      type: details.type,
      tabId: details.tabId,
      initiator: details.initiator,
      timeStamp: details.timeStamp,
    };

    for (const port of ports) {
      port.postMessage(payload);
    }

    const classified = blocker.classify(details);

    (async () => {
      if (classified.isAd) await blocker.block(classified.domain);
    })();

    return undefined;
  },
  { urls: ["<all_urls>"] },
);
