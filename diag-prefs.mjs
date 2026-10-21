const res = await fetch("http://127.0.0.1:9333/json/list");
const t = (await res.json()).find(x=>x.type==="page");
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener("open",r,{once:true}));
let id=0; const pending=new Map();
const consoleErrors=[];
ws.addEventListener("message",e=>{const m=JSON.parse(e.data);
  if(m.method==="Runtime.consoleAPICalled"&&m.params.type==="error")consoleErrors.push(m.params.args.map(a=>a.value??a.description??"").join(" "));
  if(m.method==="Runtime.exceptionThrown")consoleErrors.push("EXC: "+(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text));
  if(m.id&&pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id);}});
const send=(method,params={})=>{const i=++id;return new Promise(r=>{pending.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});};
const ev=async x=>{const r=await send("Runtime.evaluate",{expression:x,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails)return "EVAL_ERR:"+JSON.stringify(r.exceptionDetails).slice(0,300);
  return r.result?.value;};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await send("Page.enable");
await send("Runtime.enable");

// find elements whose right edge exceeds the viewport, sorted by overflow amount
const PROBE = "() => {" +
  "const vw = document.documentElement.clientWidth;" +
  "const out = [];" +
  "const all = document.querySelectorAll('*');" +
  "for (let i = 0; i < all.length; i++) {" +
  "  const el = all[i];" +
  "  const r = el.getBoundingClientRect();" +
  "  if (r.width === 0 && r.height === 0) continue;" +
  "  const over = r.right - vw;" +
  "  if (over > 2) {" +
  "    const pos = getComputedStyle(el).position;" +
  "    if (pos === 'fixed') continue;" +
  "    out.push({ t: el.tagName, c: (el.className && el.className.baseVal === undefined ? String(el.className) : '').slice(0,70)," +
  "      over: Math.round(over), w: Math.round(r.width), txt: (el.textContent||'').trim().slice(0,26) });" +
  "  }" +
  "}" +
  "out.sort(function(a,b){return b.over - a.over;});" +
  "return JSON.stringify(out.slice(0,8));" +
  "}";

const ROUTES=process.argv[2] ? [process.argv[2]] : ["/dashboard","/sa","/owner"];
for (const vp of [{label:"mobile",w:375,h:812}]) {
  await send("Emulation.setDeviceMetricsOverride",{width:vp.w,height:vp.h,deviceScaleFactor:1,mobile:true});
  for (const route of ROUTES) {
    consoleErrors.length=0;
    await send("Page.navigate",{url:"http://localhost:3111"+route});
    await sleep(2200);
    const info = await ev("(" + PROBE + ")()");
    console.log("  " + route + " | " + info + (consoleErrors.length ? " ERR="+JSON.stringify(consoleErrors.slice(0,2)) : ""));
  }
}
process.exit(0);



