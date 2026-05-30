import type { BlockerType } from "../config/Types";
import { AD_DOMAINS } from "./helpers";

export class Blocker implements BlockerType {
  generateId(domain: string) {
    let hash = 0;

    for (let i = 0; i < domain.length; i++) {
      hash = (hash << 5) - hash + domain.charCodeAt(i);

      hash |= 0;
    }

    return Math.abs(hash);
  }

  classify(req: any) {
    let score = 0;
    // let category = "unknown";

    const url = new URL(req.url);
    if (AD_DOMAINS.some((domain) => url.hostname.includes(domain)))
      score += 100;

    if (req.type === "script") score += 10;
    if (req.type === "image") score += 5;

    if (req.url.includes("ads")) score += 20;
    if (req.url.includes("doubleclick")) score += 100;

    return { domain: url.hostname, isAd: score > 80, score };
  }

  async block(domain: string) {
    const id = this.generateId(domain);

    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    const alreadyExists = existing.some((rule) => rule.id === id);

    if (alreadyExists) return;

    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: `||${domain}^`,
            resourceTypes: [
              "script",
              "image",
              "media",
              "xmlhttprequest",
              "sub_frame",
              "other",
            ],
          },
        },
      ],

      removeRuleIds: [],
    });
    console.log("[BLOCKING]", `||${domain}^`);
  }

  async getBlocked() {
    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    console.log("Rules: ", existing);
    return existing;
  }

  async unblock(id: number) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [id],
    });
    return await chrome.declarativeNetRequest.getDynamicRules();
  }
}
