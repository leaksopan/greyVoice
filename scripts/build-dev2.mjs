import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

// Next's static export serves the same React page without a Node/Workers runtime.
const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build", "--webpack"], {
  stdio: "inherit",
  env: { ...process.env, GREYVOICE_DEPLOY_TARGET: "dev2", NEXT_TELEMETRY_DISABLED: "1" },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
const html = readFileSync("out/index.html", "utf8");
assert.match(html, /GreyVoice/);
assert.match(html, /Request a demo/);
assert.match(html, /0\.012/);
assert.match(html, /0\.024/);
assert.ok(existsSync("out/images/clinician-portrait.webp"));
assert.ok(existsSync("out/images/consultation.webp"));
assert.doesNotMatch(html, /signin-with-chatgpt/);
console.log("Dev2 static export verified: out/index.html");
