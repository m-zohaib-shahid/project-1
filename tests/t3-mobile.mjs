import { sleep, check, BASE } from "./harness.mjs";

const OVERLAY_SEL = `[...document.querySelectorAll("div")].find(d => d.className.includes("bg-slate-900/50"))`;

// Tailwind v4 implements translate-x-* via the standalone CSS `translate` property,
// so we must read both `translate` and `transform` to know the real offset.
const OFFSET_FN = `function (el) {
      const r = el.getBoundingClientRect();
      return {
        left: r.left,
        right: r.right,
        width: r.width,
        offScreen: r.right <= 1,
        onScreen: r.left >= -1 && r.right > 1,
      };
    }`;

export async function run(ctx) {
  const { s, goto, setViewport } = ctx;

  // ---------- Test 6: mobile navigation ----------
  console.log("\n[6] Mobile navigation (375x812)");
  await setViewport(375, 812);
  await goto(BASE + "/sa");
  let r = await s.eval(`(() => {
      const aside = document.querySelector("aside");
      const burger = document.querySelector('button[aria-label="Open navigation"]');
      const off = ${OFFSET_FN}(aside);
      return {
        asideExists: !!aside,
        left: off.left,
        right: off.right,
        offScreen: off.offScreen,
        burgerExists: !!burger,
        burgerVisible: burger ? getComputedStyle(burger).display !== "none" : false,
      };
    })()`);
  console.log("       " + JSON.stringify(r));
  check("hamburger button exists", r.burgerExists === true);
  check("hamburger visible on mobile", r.burgerVisible === true);
  check("sidebar translated off-screen initially", r.offScreen === true, JSON.stringify(r));

  await s.eval(`document.querySelector('button[aria-label="Open navigation"]').click()`);
  await sleep(700);
  r = await s.eval(`(() => {
      const aside = document.querySelector("aside");
      const overlay = ${OVERLAY_SEL};
      const off = ${OFFSET_FN}(aside);
      return {
        left: off.left,
        right: off.right,
        onScreen: off.onScreen,
        overlayPointer: overlay ? getComputedStyle(overlay).pointerEvents : null,
        overlayOpacity: overlay ? getComputedStyle(overlay).opacity : null,
      };
    })()`);
  console.log("       " + JSON.stringify(r));
  check("sidebar slides in when opened", r.onScreen === true, JSON.stringify(r));
  check("overlay becomes interactive", r.overlayPointer === "auto", JSON.stringify(r));
  check("overlay fades in", parseFloat(r.overlayOpacity) > 0.5, JSON.stringify(r));

  await s.eval(`(() => { const o = ${OVERLAY_SEL}; o.click(); })()`);
  await sleep(700);
  r = await s.eval(`(() => {
      const aside = document.querySelector("aside");
      const overlay = ${OVERLAY_SEL};
      const off = ${OFFSET_FN}(aside);
      return {
        offScreen: off.offScreen,
        overlayPointer: overlay ? getComputedStyle(overlay).pointerEvents : null,
      };
    })()`);
  check("sidebar closes via overlay", r.offScreen === true, JSON.stringify(r));
  check("overlay no longer interactive", r.overlayPointer === "none", JSON.stringify(r));

  await s.eval(`document.querySelector('button[aria-label="Open navigation"]').click()`);
  await sleep(600);
  await s.eval(`document.querySelector('button[aria-label="Close navigation"]').click()`);
  await sleep(700);
  r = await s.eval(`(() => ${OFFSET_FN}(document.querySelector("aside")))()`);
  check("sidebar closes via X button", r.offScreen === true, JSON.stringify(r));

  await s.eval(`document.querySelector('button[aria-label="Open navigation"]').click()`);
  await sleep(600);
  await s.eval(`(() => {
      const a = [...document.querySelectorAll("aside nav a")].find(x => x.getAttribute("href") === "/parts");
      a.click();
    })()`);
  await sleep(2500);
  r = await s.eval(`(() => {
      const off = ${OFFSET_FN}(document.querySelector("aside"));
      return { path: location.pathname, offScreen: off.offScreen };
    })()`);
  check("nav link navigates to /parts", r.path === "/parts", JSON.stringify(r));
  check("sidebar auto-closes after nav on mobile", r.offScreen === true, JSON.stringify(r));

  // ---------- Test 7: desktop sidebar always visible ----------
  console.log("\n[7] Desktop (1280px) sidebar always visible");
  await setViewport(1280, 900);
  await goto(BASE + "/sa");
  r = await s.eval(`(() => {
      const aside = document.querySelector("aside");
      const burger = document.querySelector('button[aria-label="Open navigation"]');
      const off = ${OFFSET_FN}(aside);
      return {
        onScreen: off.onScreen,
        burgerVisible: burger ? getComputedStyle(burger).display !== "none" : false,
      };
    })()`);
  console.log("       " + JSON.stringify(r));
  check("sidebar visible on desktop", r.onScreen === true, JSON.stringify(r));
  check("hamburger hidden on desktop", r.burgerVisible === false, JSON.stringify(r));

  // content is not hidden behind the fixed sidebar on desktop
  r = await s.eval(`(() => {
      const aside = document.querySelector("aside").getBoundingClientRect();
      const main = document.querySelector("aside").nextElementSibling.getBoundingClientRect();
      return { asideRight: aside.right, mainLeft: main.left };
    })()`);
  check("content not overlapped by sidebar on desktop", r.mainLeft >= r.asideRight - 1, JSON.stringify(r));
}
