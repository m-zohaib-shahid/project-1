const res = await fetch("http://127.0.0.1:9333/json/list");
const t = (await res.json()).find(x=>x.type==="page");
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener("open",r,{once:true}));
let id=0; const pending=new Map();
ws.addEventListener("message",e=>{const m=JSON.parse(e.data); if(m.id&&pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id);}});
const send=(method,params={})=>{const i=++id;return new Promise(r=>{pending.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});};
const ev=async x=>{const r=await send("Runtime.evaluate",{expression:x,returnByValue:true,awaitPromise:true});return r.result?.value;};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});
const goto=async u=>{await send("Page.navigate",{url:u});await sleep(2200);};

// Customer landing
await goto("http://localhost:3111/");
console.log("LANDING services shown:", await ev(`document.body.textContent.includes("Popular Services")`));
console.log("Landing shop cards:", await ev(`document.querySelectorAll('a[href*="/book"]').length`));
await ev(`[...document.querySelectorAll("button")].find(b=>b.textContent.includes("View all services")).click()`);
await sleep(500);
console.log("Landing after expand, all services visible:", await ev(`document.body.textContent.includes("Battery Replacement")`));
await ev(`[...document.querySelectorAll("button")].find(b=>b.textContent.includes("Show fewer services")).click()`);
await sleep(400);
console.log("Landing collapsed:", await ev(`!document.body.textContent.includes("Battery Replacement")`));

// search filter
await ev(`(()=>{const i=document.querySelector('input[placeholder*="Search shops"]');const setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set;setter.call(i,"Dallas");i.dispatchEvent(new Event("input",{bubbles:true}));})()`);
await sleep(600);
console.log("Landing search Dallas cards:", await ev(`document.querySelectorAll('a[href*="/book"]').length`));
await ev(`[...document.querySelectorAll("button")].find(b=>b.textContent.includes("See all")).click()`);
await sleep(600);
console.log("Landing after See all reset:", await ev(`document.querySelectorAll('a[href*="/book"]').length`));

// Customer dashboard
await goto("http://localhost:3111/dashboard");
console.log("DASH estimate accept btn:", await ev(`[...document.querySelectorAll("button")].some(b=>b.textContent.includes("Accept Estimate"))`));
await ev(`[...document.querySelectorAll("button")].find(b=>b.textContent.includes("Accept Estimate")).click()`);
await sleep(600);
console.log("DASH notice after accept:", await ev(`document.body.textContent.includes("accepted")`));
console.log("DASH estimate gone:", await ev(`![...document.querySelectorAll("button")].some(b=>b.textContent.includes("Accept Estimate"))`));
console.log("DASH view details count:", await ev(`[...document.querySelectorAll("button")].filter(b=>b.textContent.includes("View Details")).length`));
await ev(`[...document.querySelectorAll("button")].find(b=>b.textContent.includes("View Details")).click()`);
await sleep(600);
console.log("DASH detail modal:", await ev(`document.querySelector('[role="dialog"] h2')?.textContent`));
console.log("DASH detail has services:", await ev(`document.querySelector('[role="dialog"]')?.textContent.includes("Services")`));
process.exit(0);
