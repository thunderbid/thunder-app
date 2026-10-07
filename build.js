const fs = require("fs");
const path = require("path");

const DIST = path.join(process.cwd(), "dist");
const BASE = "https://thunder.bid";

async function get(url, binary = false) {
  const response = await fetch(url, {
    headers: { "user-agent": "THUNDER-Deploy/1.0" },
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`);
  return binary ? Buffer.from(await response.arrayBuffer()) : await response.text();
}

(async () => {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(path.join(DIST, "wallet"), { recursive: true });

  // Recovery build: preserve the currently served THUNDER application exactly.
  const html = await get(BASE + "/?thunder_recovery=" + Date.now());
  fs.writeFileSync(path.join(DIST, "index.html"), html);

  const walletIndex = await get(BASE + "/wallet/?thunder_recovery=" + Date.now());
  fs.writeFileSync(path.join(DIST, "wallet", "index.html"), walletIndex);
  fs.writeFileSync(path.join(DIST, "wallet", "wallet.html"), walletIndex);

  const version = await get(BASE + "/wallet/version.json?thunder_recovery=" + Date.now());
  fs.writeFileSync(path.join(DIST, "wallet", "version.json"), version);

  const walletZip = await get(BASE + "/wallet/THUNDER_WALLET.zip?thunder_recovery=" + Date.now(), true);
  fs.writeFileSync(path.join(DIST, "wallet", "THUNDER_WALLET.zip"), walletZip);

  fs.writeFileSync(path.join(DIST, "_headers"), `/
  Cache-Control: no-store, no-cache, must-revalidate
/index.html
  Cache-Control: no-store, no-cache, must-revalidate
/wallet/version.json
  Cache-Control: no-store, no-cache, must-revalidate
`);

  console.log("THUNDER recovery build complete", {
    index: fs.statSync(path.join(DIST, "index.html")).size,
    wallet: fs.statSync(path.join(DIST, "wallet", "index.html")).size
  });
})().catch(error => {
  console.error(error);
  process.exit(1);
});
