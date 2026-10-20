import { Session, sleep, check, httpGetJson, CDP_PORT, BASE } from "./harness.mjs";

export async function run(ctx) {
  const { s, goto, setViewport, consoleErrors, failedRequests } = ctx;

  // ---------- Test 1: root page + shop images ----------
  console.log("\n[1] Root page (/): shop cards + next/image");
  await setViewport(1280, 900);
  await goto(BASE + "/");
  let r = await s.eval(`(() => {
      const imgs = [...document.querySelectorAll("img")];
      return {
        count: imgs.length,
        allHaveSrcset: imgs.length > 0 && imgs.every(i => i.getAttribute("srcset")),
        allNextImage: imgs.every(i => (i.currentSrc || i.src).includes("/_next/image")),
        shopLinks: [...document.querySelectorAll('a[href*="/book"]')].length,
      };
    })()`);
  console.log("       " + JSON.stringify(r));
  check("shop images rendered", r.count >= 3, JSON.stringify(r));
  check("all images use next/image optimizer", r.allNextImage, JSON.stringify(r));
  check("all images have srcset", r.allHaveSrcset, JSON.stringify(r));
  check("shop cards link to /book", r.shopLinks >= 3, JSON.stringify(r));

  // ---------- Test 2: no raw <img> anywhere ----------
  console.log("\n[2] No raw un-optimized <img> tags anywhere");
  for (const path of ["/", "/dashboard", "/book", "/sa", "/technician", "/parts", "/qc", "/owner"]) {
    await goto(BASE + path);
    const bad = await s.eval(
      `[...document.querySelectorAll("img")].filter(i => !(i.currentSrc||i.src).includes("/_next/image")).length`
    );
    check(path + " has 0 raw <img>", bad === 0, "found " + bad);
  }

  // ---------- Test 3: sidebar links resolve to real routes ----------
  console.log("\n[3] Sidebar links point to valid routes");
  await goto(BASE + "/sa");
  r = await s.eval(`[...document.querySelectorAll('aside nav a')].map(a => ({
      text: a.textContent.trim(),
      href: new URL(a.href).pathname,
    }))`);
  console.log("       " + JSON.stringify(r));
  const validRoutes = ["/sa", "/technician", "/parts", "/qc", "/owner"];
  check("all sidebar hrefs are real routes", r.every((i) => validRoutes.includes(i.href)), JSON.stringify(r));
  check("no /pos prefix in hrefs", r.every((i) => !i.href.startsWith("/pos")), JSON.stringify(r));
  check("no duplicate hrefs", new Set(r.map((i) => i.href)).size === r.length, JSON.stringify(r));

  // ---------- Test 4: active state highlights current route ----------
  r = await s.eval(`(() => {
      const links = [...document.querySelectorAll('aside nav a')];
      const active = links.filter(a => a.className.includes("bg-electric-blue"));
      return { activeCount: active.length, activeText: active.map(a => a.textContent.trim()) };
    })()`);
  check("exactly one active nav item on /sa", r.activeCount === 1, JSON.stringify(r));
  check("active item is Dashboard", r.activeText[0] === "Dashboard", JSON.stringify(r));

  return { consoleErrors, failedRequests };
}
