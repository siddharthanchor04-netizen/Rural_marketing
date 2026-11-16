/* Sakhi — a small offline help bot. It matches questions against the help desk and the six stories.
   Understands common English, Hinglish and a few Konkani and Hindi greetings. */
(function(){
"use strict";
const $ = s => document.querySelector(s);
const {esc, woman} = window.AKApp;
const log = $("#botLog"), box = $("#bot"), fab = $("#botFab"), input = $("#botIn"), sugg = $("#botSugg");

const STOP = new Set("a an the is are am i me my we our you your to of for in on and or do does how what which who can could should would will get give tell about any there this that it with from be have has need want please kya hai ka ki ke se mein mujhe".split(" "));
const words = s => s.toLowerCase().replace(/[^a-z0-9ऀ-ॿ\s-]/g," ").split(/\s+/).filter(w => w && !STOP.has(w));

const PEOPLE = [
  {id:"sunita",   names:["sunita","swar"],        trade:["general store","ravalnath"]},
  {id:"pooja",    names:["pooja"],                trade:["vegetable","sabzi","keri"]},
  {id:"bilkis",   names:["bilkis"],               trade:["tailor","tailoring","afreen","silai"]},
  {id:"shree",    names:["shree","shivprasad"],   trade:["cold drink","lassi","samosa"]},
  {id:"traders",  names:["trader","traders","amona"], trade:["utensil","flood","belgaum"]},
  {id:"harshala", names:["harshala","kadam"],     trade:["parlour","parlor","beauty","surla"]}
];

const SMALL = [
  {re:/^(hi|hello|hey|namaste|namaskar|dev borem|hola|good (morning|evening|afternoon))\b/i,
   say:() => `Namaskar! I'm Sakhi. I can help with loans, government schemes, self-help groups, paperwork and growing your business. I also know the six stories on this site. What would you like to know?`},
  {re:/\b(thank|thanks|dhanyavad|shukriya|dev borem korum)\b/i, say:() => `You're welcome. All the best with your business!`},
  {re:/\b(post|share|write|upload|publish)\b.*\b(story|photo|video|post)\b|\bhow (do|can) i (post|share)\b/i,
   say:() => `To share your story, <a href="#account">create a free account</a>, then open <a href="#share">Share your story</a>. You can add a title, pick a category, and attach up to 6 photos, videos or voice notes.`},
  {re:/\b(sign ?up|register|create (an )?account|log ?in|sign ?in|password)\b/i,
   say:() => `Go to <a href="#account">Sign in</a>. New here? Fill in "Create an account" with your name, a username and a password. No email is needed.`},
  {re:/\b(who are you|what are you|your name)\b/i, say:() => `I'm Sakhi, the help desk of Meri Kahani, Meri Zubani. I answer from the help desk and the field stories, and I can't see your personal details.`},
  {re:/\b(stories|six women|profiles|who did you interview)\b/i,
   say:() => `We interviewed six businesses around Sanquelim: ${window.AK.women.map(w => `<a href="#story-${w.id}">${esc(w.name)}</a>`).join(", ")}. Ask me about any of them.`}
];

function scoreFaq(q){
  const ql = " " + q.toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g," ") + " ", qw = new Set(words(q));
  let best = null, bestS = 0;
  for (const f of window.AK.faq){
    let s = 0;
    for (const k of f.keys){ if (ql.includes(k.length < 4 ? " " + k + " " : k)) s += k.includes(" ") ? 4 : 3; }
    for (const w of words(f.q)) if (qw.has(w)) s += 1;
    if (s > bestS){ bestS = s; best = f; }
  }
  return bestS >= 3 ? best : null;
}
function findPerson(q){
  const ql = q.toLowerCase();
  const byName = PEOPLE.find(p => p.names.some(k => ql.includes(k)));
  if (byName) return {id:byName.id, byName:true};
  const byTrade = PEOPLE.find(p => p.trade.some(k => ql.includes(k)));
  return byTrade ? {id:byTrade.id, byName:false} : null;
}
function faqHTML(f){
  return `<b>${esc(f.q)}</b>${f.a.map(x => x.startsWith("<") ? x : `<p style="margin:.3rem 0">${x}</p>`).join("")}<div class="where">Where to go: ${esc(f.where)}</div><div style="margin-top:.3rem"><a href="#faq-${f.id}">Open in the help desk</a></div>`;
}
function personHTML(id, q){
  const w = woman(id);
  const askMoney = /loan|scheme|money|help|yojana|finance/i.test(q);
  let extra = "";
  if (askMoney){
    const map = {pooja:"svanidhi", harshala:"goa-edc", bilkis:"shg-loans", sunita:"shg-join", shree:"digital", traders:"insurance"};
    const f = window.AK.faq.find(x => x.id === map[id]);
    if (f) extra = `<p style="margin:.4rem 0 0">A help-desk answer that fits: <a href="#faq-${f.id}">${esc(f.q)}</a></p>`;
  }
  return `<b>${esc(w.name)}</b>, ${esc(w.trade.toLowerCase())} in ${esc(w.place)}. ${esc(w.dek)}<p style="margin:.4rem 0 0"><i>“${esc(w.quote)}”</i></p>${extra}<a href="#story-${w.id}">Read the full story</a>`;
}

function answer(q){
  for (const [i, s] of SMALL.entries()){
    if (i === 0 && words(q).length > 3) continue; // a greeting followed by a real question: answer the question
    if (s.re.test(q)) return s.say();
  }
  const p = findPerson(q), f = scoreFaq(q);
  if (p && p.byName) return personHTML(p.id, q);
  if (f) return faqHTML(f);
  if (p) return personHTML(p.id, q);
  return `I don't have an answer for that yet. Try asking about <b>Mudra loans</b>, <b>street vendor loans</b>, <b>PMEGP subsidy</b>, <b>SHGs</b>, <b>documents</b>, <b>licences</b> or the <b>Goa EDC scheme</b>. For anything specific to your case, your bank branch or SHG book-keeper is the best next step.`;
}

const CHIPS = ["How do I get a Mudra loan?","Loans for street vendors","Goa EDC scheme","How to start an SHG","Documents for a loan","How to grow my business","Tell me Harshala's story","How do I post my story?"];
function chips(){ sugg.innerHTML = CHIPS.map(c => `<button type="button">${c}</button>`).join(""); sugg.querySelectorAll("button").forEach(b => b.onclick = () => ask(b.textContent)); }

function bubble(html, who){
  const d = document.createElement("div");
  d.className = "msg " + who; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight;
  d.querySelectorAll("a[href^='#']").forEach(a => a.addEventListener("click", () => { if (innerWidth < 640) close(); }));
}
function ask(q){
  q = q.trim(); if (!q) return;
  bubble(esc(q), "me");
  setTimeout(() => bubble(answer(q), "her"), 250);
}
let started = false;
function open(q){
  box.hidden = false; fab.setAttribute("aria-expanded","true");
  if (!started){ started = true; chips(); bubble(SMALL[0].say(), "her"); }
  if (q) ask(q);
  input.focus();
}
function close(){ box.hidden = true; fab.setAttribute("aria-expanded","false"); fab.focus(); }

fab.onclick = () => box.hidden ? open() : close();
$("#botClose").onclick = close;
$("#botForm").onsubmit = e => { e.preventDefault(); const q = input.value; input.value = ""; ask(q); };
box.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

/* Drag the window by its title bar (desktop) */
const bar = $("#botBar");
bar.addEventListener("pointerdown", e => {
  if (e.target.closest("button") || innerWidth < 640) return;
  const r = box.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
  bar.setPointerCapture(e.pointerId);
  const mv = ev => {
    const x = Math.max(0, Math.min(innerWidth - r.width, ev.clientX - dx));
    const y = Math.max(0, Math.min(innerHeight - 60, ev.clientY - dy));
    Object.assign(box.style, {left:x+"px", top:y+"px", right:"auto", bottom:"auto"});
  };
  const up = () => { bar.removeEventListener("pointermove", mv); bar.removeEventListener("pointerup", up); };
  bar.addEventListener("pointermove", mv); bar.addEventListener("pointerup", up);
});

window.Sakhi = { open, ask, answer };
})();
