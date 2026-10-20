// CDP-driven smoke test for BayFlow (no external deps; uses Node 24 global WebSocket)
const CDP_PORT = 9333;
const BASE = "http://localhost:3111";

export { CDP_PORT, BASE };
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pass = 0;
let fail = 0;
export function check(name, cond, extra = "") {
  if (cond) {
    pass++;
    console.log("  PASS  " + name);
  } else {
    fail++;
    console.log("  FAIL  " + name + " " + extra);
  }
}

async function httpGetJson(path) {
  const res = await fetch(`http://127.0.0.1:${CDP_PORT}${path}`);
  return res.json();
}

export { httpGetJson };

class Session {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error("timeout: " + method));
        }
      }, 30000);
    });
  }
  async eval(expression) {
    const r = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) {
      throw new Error("eval error: " + JSON.stringify(r.exceptionDetails));
    }
    return r.result.value;
  }
}

export { Session };

export function totals() {
  return { pass, fail };
}
