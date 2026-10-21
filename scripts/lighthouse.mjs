#!/usr/bin/node
import { spawn } from "node:child_process";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import fs from "fs";
import "path";

console.log("RUNNING LIGHTHOUSE... \n.\n..\n...");

const folderName = "./reports";
const now = new Date();
const dateString = generateDateString(now);

console.log(`Creating folder ${folderName}`);
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

console.log("CH: Creating chrome instance");
const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless", "--no-sandbox"],
});

const options = { logLevel: "warn", output: "html", port: chrome.port };

console.log("Running LH...");

try {
  const runnerResult = await lighthouse("http://localhost:4173", options);
  const reportHtml = runnerResult.report;
  console.log(`Writing report ${dateString}`);

  fs.writeFileSync(`${folderName}/lh.report${dateString}.html`, reportHtml);

  console.log("Report is done for", runnerResult.lhr.finalDisplayedUrl);
  console.log(
    "Performance score was",
    runnerResult.lhr.categories.performance.score * 100,
  );
  console.log("SEO score was", runnerResult.lhr.categories.seo.score * 100);
  console.log(
    "Agentic Browsing score was",
    runnerResult.lhr.categories["agentic-browsing"].score * 100,
  );
} catch (err) {
  console.error(err);
} finally {
  chrome.kill();
}

function generateDateString(dateObj) {
  const year = dateObj.getFullYear().toString().slice(-2);
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const date = dateObj.getDate().toString().padStart(2, "0");
  const hour = dateObj.getHours().toString().padStart(2, "0");

  return `[${year}-${month}-${date}T${hour}]`;
}
