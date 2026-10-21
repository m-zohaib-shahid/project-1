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

// SA: assign technician flow
await goto("http://localhost:3111/sa");
console.log("SA assign btn:", await ev(`[...document.querySelectorAll("button")].some(b=>b.textContent.includes("Assign Technician"))`));
await ev(`[...document.querySelectorAll("button")].find(b=>b.textContent.includes("Assign Technician")).click()`);
await sleep(600);
console.log("SA modal open:", await ev(`!!document.querySelector('[role="dialog"]')`));
console.log("SA modal title:", await ev(`document.querySelector('[role="dialog"] h2')?.textContent`));
console.log("SA selects:", await ev(`[...document.querySelectorAll('[role="dialog"] select')].map(s=>s.options.length)`));
// submit empty -> validation
await ev(`[...document.querySelectorAll('[role="dialog"] button')].find(b=>b.textContent.trim()==="Assign").click()`);
await sleep(400);
console.log("SA validation msg:", await ev(`document.querySelector('[role="dialog"]')?.textContent.includes("Select both")`));
// select and assign
await ev(`(()=>{const s=document.querySelectorAll('[role="dialog"] select');s[0].value=s[0].options[1].value;s[0].dispatchEvent(new Event("change",{bubbles:true}));})()`);
await sleep(300);
await ev(`(()=>{const s=document.querySelectorAll('[role="dialog"] select');s[1].value=s[1].options[1].value;s[1].dispatchEvent(new Event("change",{bubbles:true}));})()`);
await sleep(300);
await ev(`[...document.querySelectorAll('[role="dialog"] button')].find(b=>b.textContent.trim()==="Assign").click()`);
await sleep(700);
console.log("SA notice:", await ev(`document.body.textContent.includes("assigned to booking")`));
console.log("SA modal closed:", await ev(`!document.querySelector('[role="dialog"]')`));
// view button
console.log("SA view btn count:", await ev(`[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="View").length`));
await ev(`[...document.querySelectorAll("button")].find(b=>b.textContent.trim()==="View").click()`);
await sleep(600);
console.log("SA detail modal:", await ev(`document.querySelector('[role="dialog"] h2')?.textContent`));
console.log("SA detail body has services:", await ev(`document.querySelector('[role="dialog"]')?.textContent.includes("Services")`));
await ev(`document.querySelector('[role="dialog"] button[aria-label="Close"]').click()`);
await sleep(400);
// empty filter state
await ev(`[...document.querySelectorAll("button")].find(b=>b.textContent.includes("QC (")).click()`);
await sleep(500);
console.log("SA QC filter rows:", await ev(`[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="View").length`));
process.exit(0);
