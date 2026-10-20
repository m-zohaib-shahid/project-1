import { Session, sleep, check, httpGetJson, CDP_PORT, BASE, totals } from "./harness.mjs";
import * as t1 from "./t1-routes.mjs";
import * as t2 from "./t2-modal.mjs";
import * as t3 from "./t3-mobile.mjs";

let pass = 0;
let fail = 0;

async function main() {
  const targets = await httpGetJson("/json/list");
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  const s = new Session(ws);

  await s.send("Page.enable");
  await s.send("Runtime.enable");
  await s.send("Network.enable");

  const consoleErrors = [];
  const failedRequests = [];
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
      consoleErrors.push(
        msg.params.args.map((a) => a.value ?? a.description ?? "").join(" ")
      );
    }
    if (msg.method === "Runtime.exceptionThrown") {
      consoleErrors.push(
        "EXCEPTION: " +
          (msg.params.exceptionDetails.exception?.description ||
            msg.params.exceptionDetails.text)
      );
    }
    if (msg.method === "Network.loadingFailed") {
      failedRequests.push(msg.params.errorText);
    }
  });

  async function goto(url) {
    await s.send("Page.navigate", { url });
    await sleep(2500);
  }
  async function setViewport(width, height) {
    await s.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
  }

  const ctx = { s, goto, setViewport, consoleErrors, failedRequests };

  await t1.run(ctx);
  await t2.run(ctx);
  await t3.run(ctx);

  // ---------- Test 8: console errors / failed requests ----------
  console.log("\n[8] Console errors and failed network requests");
  const realErrors = consoleErrors.filter((e) => !/favicon|404 \(Not Found\)/i.test(e));
  check("no console errors", realErrors.length === 0, JSON.stringify(realErrors.slice(0, 5)));
  const realFailed = failedRequests.filter((e) => !/favicon|net::ERR_ABORTED/i.test(e));
  check("no failed network requests", realFailed.length === 0, JSON.stringify(realFailed.slice(0, 5)));

  const t = totals();
  console.log("\n==== " + t.pass + " passed, " + t.fail + " failed ====");
  ws.close();
  process.exit(t.fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(2);
});
