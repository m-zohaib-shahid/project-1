import { sleep, check, BASE } from "./harness.mjs";

export async function run(ctx) {
  const { s, goto } = ctx;

  // ---------- Test 5: technician inspection modal ----------
  console.log("\n[5] Technician inspection modal");
  await goto(BASE + "/technician");
  let r = await s.eval(`(() => {
      const btns = [...document.querySelectorAll("button")].filter(b => b.textContent.includes("Inspection Form"));
      return { btnCount: btns.length, modalPresent: !!document.querySelector('[role="dialog"]') };
    })()`);
  check("Inspection Form button exists", r.btnCount >= 1, JSON.stringify(r));
  check("modal hidden before click", r.modalPresent === false, JSON.stringify(r));

  await s.eval(`(() => {
      const b = [...document.querySelectorAll("button")].find(x => x.textContent.includes("Inspection Form"));
      b.click();
    })()`);
  await sleep(800);
  r = await s.eval(`(() => {
      const d = document.querySelector('[role="dialog"]');
      if (!d) return { present: false };
      return {
        present: true,
        title: d.querySelector("h2") ? d.querySelector("h2").textContent : null,
        desc: d.querySelector("h2 + p") ? d.querySelector("h2 + p").textContent : null,
        checkboxes: d.querySelectorAll('input[type="checkbox"]').length,
        hasOdometer: [...d.querySelectorAll("label")].some(l => l.textContent.includes("Odometer")),
        hasNotes: [...d.querySelectorAll("label")].some(l => l.textContent.includes("Notes")),
        submit: [...d.querySelectorAll("button")].some(b => b.textContent.includes("Submit Inspection")),
        cancel: [...d.querySelectorAll("button")].some(b => b.textContent.includes("Cancel")),
      };
    })()`);
  console.log("       " + JSON.stringify(r));
  check("modal opens", r.present === true);
  check("title is 'Vehicle Inspection Form'", r.title === "Vehicle Inspection Form", JSON.stringify(r));
  check("shows vehicle description", !!r.desc, JSON.stringify(r));
  check("6 inspection checkboxes", r.checkboxes === 6, JSON.stringify(r));
  check("has odometer field", r.hasOdometer === true);
  check("has notes field", r.hasNotes === true);
  check("has submit button", r.submit === true);
  check("has cancel button", r.cancel === true);

  await s.eval(`(() => {
      const d = document.querySelector('[role="dialog"]');
      [...d.querySelectorAll("button")].find(b => b.textContent.includes("Cancel")).click();
    })()`);
  await sleep(500);
  r = await s.eval(`!!document.querySelector('[role="dialog"]')`);
  check("modal closes on Cancel", r === false);

  await s.eval(`(() => {
      const b = [...document.querySelectorAll("button")].find(x => x.textContent.includes("Inspection Form"));
      b.click();
    })()`);
  await sleep(600);
  await s.eval(`document.querySelector('[role="dialog"] button[aria-label="Close"]').click()`);
  await sleep(500);
  r = await s.eval(`!!document.querySelector('[role="dialog"]')`);
  check("modal closes on X button", r === false);

  // reopen and verify checkbox interaction works
  await s.eval(`(() => {
      const b = [...document.querySelectorAll("button")].find(x => x.textContent.includes("Inspection Form"));
      b.click();
    })()`);
  await sleep(600);
  await s.eval(`document.querySelector('[role="dialog"] input[type="checkbox"]').click()`);
  await sleep(200);
  r = await s.eval(`document.querySelector('[role="dialog"] input[type="checkbox"]').checked`);
  check("checkbox is interactive", r === true, JSON.stringify(r));
  await s.eval(`document.querySelector('[role="dialog"] button[aria-label="Close"]').click()`);
  await sleep(400);
}
