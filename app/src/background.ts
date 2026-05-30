import { Blocker } from "@/lib/blocker";
import { AD_DOMAINS } from "@/lib/helpers";

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  (async () => {
    for (const domain of AD_DOMAINS) {
      await blocker.block(domain);
    }
  })();
});

const blocker = new Blocker();
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const classified = blocker.classify(details);

    (async () => {
      if (classified.isAd) await blocker.block(classified.domain);
    })();

    return undefined;
  },
  { urls: ["<all_urls>"] },
);
