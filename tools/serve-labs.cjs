/* Minimal static server for local Playwright tests, no external dependencies. */
"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "..", "dist-labs");
const PORT = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".txt": "text/plain; charset=utf-8" };
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
  catch { res.writeHead(400); res.end("Bad request"); return; }
  let abs = path.resolve(ROOT, "." + pathname);
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }
  try {
    if (fs.statSync(abs).isDirectory()) abs = path.join(abs, "index.html");
    const data = fs.readFileSync(abs);
    res.writeHead(200, { "content-type": types[path.extname(abs)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(data);
  } catch {
    res.writeHead(404); res.end("Not found");
  }
}).listen(PORT, "127.0.0.1", () => console.log("THUNDER LABS http://127.0.0.1:" + PORT + "/labs/scene-workshop/"));
