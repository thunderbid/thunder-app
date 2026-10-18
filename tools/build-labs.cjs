/* Builds a self-contained HTML deliverable with the libraries from npm.
 * This DOES NOT modify the existing production recovery build.
 */
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const INPUT = path.join(ROOT, "labs", "scene-workshop", "index.html");
const VENDORS = [
  { name: "Konva", package: "konva", file: "konva.min.js", slot: "KONVA" },
  { name: "Phaser", package: "phaser", file: "dist/phaser.min.js", slot: "PHASER" },
  { name: "Howler", package: "howler", file: "dist/howler.min.js", slot: "HOWLER" },
];

function findLicense(folder) {
  for (const name of ["LICENSE", "LICENSE.md", "LICENSE.txt", "license.md", "LICENSE.MD"]) {
    const candidate = path.join(folder, name);
    if (fs.existsSync(candidate)) return fs.readFileSync(candidate, "utf8");
  }
  throw new Error("Missing license in " + folder);
}

function buildLabs(dest = path.join(ROOT, "dist-labs")) {
  let html = fs.readFileSync(INPUT, "utf8");
  const notice = ["THUNDER LABS | THIRD-PARTY OPEN-SOURCE NOTICES", ""];
  for (const item of VENDORS) {
    const base = path.join(ROOT, "node_modules", item.package);
    const pkg = JSON.parse(fs.readFileSync(path.join(base, "package.json"), "utf8"));
    const js = fs.readFileSync(path.join(base, item.file), "utf8");
    const tag = "<!-- INJECT:" + item.slot + " -->";
    if (!html.includes(tag)) throw new Error("Missing placeholder: " + tag);
    html = html.replace(tag, "<script>\n" + js.replace(/<\/script/gi, "<\\/script") + "\n<\/script>");
    notice.push(item.name + " " + pkg.version + " (" + (pkg.license || "see included license") + ")");
    notice.push(findLicense(base), "", "------------------------------------------------------", "");
  }
  const legal = notice.join("\n");
  const legalTag = "<!-- INJECT:LICENSES -->";
  if (!html.includes(legalTag)) throw new Error("Missing license placeholder");
  html = html.replace(legalTag, "<!--\n" + legal.replace(/-->/g, "-- >") + "\n-->");
  if (html.includes("<!-- INJECT:")) throw new Error("Unresolved HTML inject placeholder");
  const target = path.join(dest, "labs", "scene-workshop");
  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(path.join(target, "index.html"), html);
  fs.writeFileSync(path.join(target, "THIRD_PARTY_NOTICES.txt"), legal);
  console.log("THUNDER LABS: built standalone HTML", (html.length / 1024 / 1024).toFixed(2) + " MiB", target);
  return path.join(target, "index.html");
}
if (require.main === module) buildLabs();
module.exports = { buildLabs };
