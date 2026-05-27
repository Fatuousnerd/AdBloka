import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "AdBloka",
  version: "1.0.0",
  description: "Block ads from multiple sites for FREE",

  action: { default_popup: "index.html" },
  side_panel: { default_path: "sidepanel.html" },

  permissions: ["storage", "activeTab", "webRequest", "tabs", "sidePanel"],

  host_permissions: ["<all_urls>"],

  background: { service_worker: "src/background.ts", type: "module" },

  content_scripts: [{ matches: ["<all_urls>"], js: ["src/content.ts"] }],
});
