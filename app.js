/* Meri Kahani, Meri Zubani — app: accounts, routing, pages. No build step.
   Data goes through store.js: Supabase when configured, otherwise the visitor's browser. */
(function(){
"use strict";
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cat = id => AK.categories.find(c => c.id === id) || AK.categories[0];
const woman = id => AK.women.find(w => w.id === id);
const fmtDate = t => new Date(t).toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"});
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);

/* ---------------- Motifs (line drawings, 48×48) ---------------- */
const MOTIF = {
  jar:    '<path d="M17 9h14v5H17z"/><path d="M15 14h18v4l-2 3v17a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3V21l-2-3z"/><path d="M19 28h10"/>',
  basket: '<path d="M7 20h34l-4 18H11z"/><path d="M14 20c0-9 20-9 20 0"/><path d="M10 28h28M19 20v18M29 20v18"/>',
  needle: '<path d="M9 39L36 12"/><circle cx="37.5" cy="10.5" r="3"/><path d="M14 31c6 7 15 10 22 4 5-4 1-10-5-7"/>',
  glass:  '<path d="M14 13h20l-3 27H17z"/><path d="M15.5 21h17"/><path d="M28 5l-3 16"/>',
  mirror: '<circle cx="24" cy="18" r="11"/><path d="M24 29v12M17 42h14"/><path d="M18.5 15a6.5 6.5 0 0 1 6-4.5"/>',
  hands:  '<circle cx="16" cy="13" r="5"/><circle cx="32" cy="13" r="5"/><path d="M7 41c0-11 4-17 9-17s9 6 9 17"/><path d="M23 41c0-11 4-17 9-17s9 6 9 17"/>',
  coin:   '<circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="11"/><path d="M19 18h10M19 22h10M21 18c6 0 6 8 0 8l7 7"/>',
  lamp:   '<path d="M7 28c4 9 30 9 34 0z"/><path d="M24 27c-5-4-2-11 0-15 2 4 5 11 0 15z"/><path d="M19 41h10"/>',
  pot:    '<path d="M8 19h32"/><path d="M11 19c0 13 5 19 13 19s13-6 13-19"/><path d="M18 19v-4h12v4"/><path d="M16 27h16"/>'
};
const motifSVG = (m, size=46, sw=2.6) =>
  `<svg viewBox="0 0 48 48" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${MOTIF[m]||MOTIF.lamp}</svg>`;

/* Block-print cover for stories without a photo */
function coverSVG(motif, color, seed=1){
  const id = "p"+motif+seed;
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs><pattern id="${id}" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(${seed%2?8:-8})">
      <g transform="translate(4 4)" fill="none" stroke="#FFF1C9" stroke-opacity=".28" stroke-width="2.4" stroke-linecap="round">${MOTIF[motif]||MOTIF.lamp}</g>
    </pattern></defs>
    <rect width="400" height="300" fill="${color}"/>
    <rect width="400" height="300" fill="url(#${id})"/>
    <rect x="10" y="10" width="380" height="280" fill="none" stroke="#FFF1C9" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/>
    <circle cx="200" cy="150" r="88" fill="#F5EACB" stroke="#2B1B10" stroke-width="4"/>
    <circle cx="200" cy="150" r="76" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="1 7" stroke-linecap="round"/>
    <g transform="translate(152 102) scale(2)" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${MOTIF[motif]||MOTIF.lamp}</g>
  </svg>`;
}

/* ---------------- Data layer (see store.js) ---------------- */
let S = null;      // the store: online (Supabase) or local (this browser)
let me = null;     // signed-in profile
function refreshMe(){
  me = S.auth.current();
  $("#accLink").textContent = me ? me.name.split(" ")[0] + "’s account" : "Sign in";
}
async function safe(fn, el){
  try{ return await fn(); }
  catch(e){ const m = e.userMessage || "Something went wrong. Check your internet and try again."; if (el) el.textContent = m; else toast(m); return undefined; }
}

/* ---------------- UI helpers ---------------- */
let toastT;
function toast(msg){ const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); }
function modal(title, bodyHTML, mount){
  const s = $("#scrim");
  s.innerHTML = `<div class="win" role="dialog" aria-modal="true" aria-labelledby="mTitle">
    <div class="win-bar"><h3 id="mTitle">${title}</h3><span class="bolts"><i></i><i></i></span></div>
    <div class="win-body">${bodyHTML}</div></div>`;
  s.hidden = false;
  const close = () => { s.hidden = true; s.innerHTML = ""; document.removeEventListener("keydown", onKey); };
  const onKey = e => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);
  s.onclick = e => { if (e.target === s) close(); };
  const first = s.querySelector("input,button,select,textarea,a"); if (first) first.focus();
  if (mount) mount(s, close);
  return close;
}
function confirmBox(text, yes, onYes){
  modal("Please confirm", `<p>${text}</p><div class="actions"><button class="btn red" data-yes>${yes}</button><button class="btn plain" data-no>Keep it</button></div>`,
    (s, close) => { $("[data-yes]", s).onclick = () => { close(); onYes(); }; $("[data-no]", s).onclick = close; });
}
const win = (title, body, bar="", extra="") =>
  `<section class="win ${extra}"><div class="win-bar ${bar}"><h3>${title}</h3><span class="bolts" aria-hidden="true"><i></i><i></i></span></div><div class="win-body">${body}</div></section>`;
function requireLogin(why){
  modal("Sign in first", `<p>${why}</p><div class="actions"><a class="btn green" href="#account" data-go>Sign in or create account</a></div>`,
    (s, close) => $("[data-go]", s).addEventListener("click", close));
}

/* ---------------- Object URLs for stored media ---------------- */
let liveURLs = [];
function blobURL(b){ const u = URL.createObjectURL(b); liveURLs.push(u); return u; }
function freeURLs(){ liveURLs.forEach(u => URL.revokeObjectURL(u)); liveURLs = []; }

/* ---------------- Reactions (claps + comments) ---------------- */
async function getReact(id){ return (await safe(() => S.react.get(id))) || {claps:[], comments:[]}; }
function reactHTML(r){
  const clapped = me && r.claps.includes(me.id);
  return `<div class="actions">
      <button class="btn small ${clapped?"green":""}" data-clap aria-pressed="${clapped}">Shabaash! ${r.claps.length ? "("+r.claps.length+")" : ""}</button>
      <button class="btn small plain" data-copy>Copy link</button>
    </div>
    ${win("Comments", `
      ${r.comments.length ? `<ul class="comments">${r.comments.map(c => `<li><div class="who">${esc(c.name)}, ${fmtDate(c.at)}</div>${esc(c.text)}</li>`).join("")}</ul>` : `<p class="muted">No comments yet. Say something encouraging.</p>`}
      <form data-comment><label for="cmt">Add a comment</label><textarea id="cmt" style="min-height:5rem" maxlength="800" required></textarea>
      <div class="actions"><button class="btn small green" type="submit">Post comment</button></div></form>`, "blue")}`;
}
async function wireReact(root, id, rerender){
  $("[data-clap]", root).onclick = async () => {
    if (!me) return requireLogin("Create a free account to cheer for a story.");
    $("[data-clap]", root).disabled = true;
    await safe(() => S.react.toggleClap(id)); rerender();
  };
  $("[data-copy]", root).onclick = async () => {
    try{ await navigator.clipboard.writeText(location.href.split("#")[0] + "#" + id.replace(/^s:/,"story-").replace(/^p:/,"post-")); toast("Link copied"); }
    catch(e){ toast("Copy the address from your browser bar"); }
  };
  $("[data-comment]", root).onsubmit = async e => {
    e.preventDefault();
    if (!me) return requireLogin("Create a free account to comment.");
    const t = $("#cmt", root).value.trim(); if (!t) return;
    const b = $("[data-comment] button", root); b.disabled = true;
    const ok = await safe(async () => { await S.react.comment(id, t); return true; });
    if (ok) toast("Comment posted"); rerender();
  };
}

/* ---------------- Cards ---------------- */
function womanTile(w, i){
  const c = cat(w.category);
  const cover = w.photo ? `<img src="${w.photo}" alt="${esc(w.photoAlt)}" loading="lazy">` : coverSVG(w.motif, c.color, i);
  return `<a class="tile" href="#story-${w.id}"><div class="cover">${cover}</div>
    <h3>${esc(w.name)}</h3><div class="trade">${esc(w.trade)}, ${esc(w.place.split(" (")[0])}</div><p>${esc(w.dek)}</p></a>`;
}
function fieldCard(w, i){
  const c = cat(w.category);
  const cover = w.photo ? `<img src="${w.photo}" alt="${esc(w.photoAlt)}" loading="lazy">` : coverSVG(w.motif, c.color, i);
  return `<article class="card"><div class="cover">${cover}</div><div class="in">
    <span class="tag" style="--c:${c.color}">${c.name}</span>
    <h3><a href="#story-${w.id}">${esc(w.title)}</a></h3><p>${esc(w.dek)}</p>
    <span class="badge-field">Field story</span>
    <div class="by">${esc(w.name)}, ${esc(w.place.split(" (")[0])}</div></div></article>`;
}
function postCard(p, i){
  const c = cat(p.category);
  const m = (p.media||[]).find(x => x.type === "image") || (p.media||[]).find(x => x.type === "video");
  let cover = coverSVG(c.motif, c.color, i+3);
  if (m && m.type === "image") cover = `<img src="${esc(m.url)}" alt="" loading="lazy">`;
  else if (m && m.type === "video") cover = `<video src="${esc(m.url)}#t=0.5" muted preload="metadata"></video>`;
  const ex = p.body.length > 150 ? p.body.slice(0,150).trim() + "…" : p.body;
  return `<article class="card"><div class="cover">${cover}</div><div class="in">
    <span class="tag" style="--c:${c.color}">${c.name}</span>
    <h3><a href="#post-${p.id}">${esc(p.title)}</a></h3><p>${esc(ex)}</p>
    <div class="by">${esc(p.authorName)}${p.village ? ", " + esc(p.village) : ""}, ${fmtDate(p.created)}</div></div></article>`;
}

/* ---------------- Pages ---------------- */
const Pages = {};

Pages.home = async v => {
  const posts = (await safe(() => S.posts.list(3))) || [];
  const W = AK.women;
  const rows = [
    ["Spoke to us themselves", ["sunita","pooja","bilkis","harshala"], "var(--ink)"],
    ["Part of a self-help group", ["sunita","bilkis"], "var(--green)"],
    ["Took a loan at some point", ["pooja","bilkis","traders"], "var(--sindoor)"],
    ["Used or applying for a scheme", ["pooja","harshala"], "var(--peacock)"],
    ["Travel out of town for stock", ["pooja","harshala","traders"], "var(--marigold)"],
    ["Plan to expand", ["pooja","harshala"], "var(--rani)"]
  ];
  const span = [1970, 2026], pos = y => ((y - span[0]) / (span[1] - span[0]) * 100).toFixed(1);
  v.innerHTML = `
  <section class="hero">
    <div>
      <h2>Six women.<br>One bazaar town.</h2>
      <p class="lead"><i>Meri kahani, meri zubani</i>: my story, in my own words. These are the women who sell vegetables, stitch blouses, pour lassi and run parlours around Sanquelim.</p>
      <p class="prose">Read their stories, ask Sakhi about loans and government schemes, and add your own.</p>
      <div class="cta"><a class="btn green" href="#women">Read the stories</a><a class="btn" href="#share">Share your story</a></div>
    </div>
    <figure class="print"><img src="img/pooja.jpg" alt="${esc(woman("pooja").photoAlt)}"><figcaption>Pooja, eighteen years at her vegetable stall</figcaption></figure>
  </section>

  <div class="section-head"><h2>Meet the six</h2><a href="#women">All profiles</a></div>
  <div class="tiles">${W.map(womanTile).join("")}</div>

  <div class="section-head"><h2>Browse by trade</h2><span class="hand muted">Pick a label</span></div>
  <div class="labels">${AK.categories.map(c => `<a class="label" style="--c:${c.color}" href="#stories" data-cat="${c.id}">${motifSVG(c.motif)}<b>${c.name}</b><small lang="hi">${c.hi}</small></a>`).join("")}</div>

  <div class="section-head"><h2>What the six told us</h2><span class="hand muted">From our interview notebook</span></div>
  <div class="ledger">
    <h3>Out of six businesses we visited…</h3>
    ${rows.map(([l, ids, col]) => `<div class="bar-row" style="--c:${col}"><span class="lbl">${l}</span>
      <span class="track" role="img" aria-label="${ids.length} of 6: ${ids.map(i => woman(i).name).join(", ")}">${W.map(w => `<span class="dot ${ids.includes(w.id)?"on":""}" title="${esc(w.name)}"></span>`).join("")}</span>
      <span class="val">${ids.length}/6</span></div>`).join("")}
    <h3 style="margin-top:1.6rem">When they started</h3>
    <div class="timeline" aria-label="Start years: traders 1970s, Bilkis 1986, Pooja 2008, Sunita 2016, Shree Cold Drinks 2020, Harshala 2021">
      <div class="axis"></div>
      ${[...W].sort((a,b)=>a.since-b.since).map((w,i) => `<div class="pin ${i%2?"lo":""}" style="left:${pos(w.since)}%"><span class="yr">${w.id==="traders"?"1970s":w.since}</span>${esc(w.name.split(" ")[0] === "The" ? "Traders" : w.name.split(" ")[0])}</div>`).join("")}
    </div>
    <div class="tl-ends"><span>1970</span><span>2026</span></div>
  </div>

  <div class="section-head"><h2>From the community</h2><a href="#stories">All stories</a></div>
  ${posts.length ? `<div class="feed">${posts.map(postCard).join("")}</div>` :
    `<div class="empty"><p class="lead" style="margin:0 auto 1rem">No community stories yet.</p><a class="btn" href="#share">Share the first one</a></div>`}

  <div class="section-head"><h2>Questions women ask us</h2><a href="#faq">Open the help desk</a></div>
  <div class="row">${["mudra","svanidhi","shg-join"].map(id => { const f = AK.faq.find(x => x.id===id);
    return win(esc(f.q), `<p>${f.a[0].replace(/<[^>]+>/g,"").slice(0,160).replace(/[\s.,:;]+$/,"")}…</p><a href="#faq-${f.id}">Read the answer</a>`); }).join("")}</div>
  `;
  $$(".label", v).forEach(a => a.addEventListener("click", () => { state.cat = a.dataset.cat; }));
};

const state = { cat: null, kind: "all", q: "" };
Pages.stories = async v => {
  const posts = (await safe(() => S.posts.list(300))) || [];
  v.innerHTML = `
    <div class="section-head" style="margin-top:0"><h2>Stories</h2><a class="btn small" href="#share">Share your story</a></div>
    <div class="feed-tools">
      <label class="sr-only" for="fq">Search stories</label>
      <input id="fq" type="search" placeholder="Search by name, place or trade" value="${esc(state.q)}">
      <label class="sr-only" for="fk">Show</label>
      <select id="fk" style="max-width:15rem">
        <option value="all">Field and community stories</option><option value="field">Field stories only</option><option value="community">Community stories only</option>
      </select>
    </div>
    <div class="chips" role="group" aria-label="Filter by category">
      <button class="chip" data-c="" aria-pressed="${!state.cat}">All</button>
      ${AK.categories.map(c => `<button class="chip" data-c="${c.id}" aria-pressed="${state.cat===c.id}">${c.name}</button>`).join("")}
    </div>
    <div id="feed"></div>`;
  $("#fk", v).value = state.kind;
  const draw = () => {
    const q = state.q.toLowerCase();
    const hit = s => !q || s.toLowerCase().includes(q);
    const field = state.kind === "community" ? [] : AK.women.filter(w => (!state.cat || w.category === state.cat || (state.cat==="shg" && /SHG/.test(w.shg) && !/^Not/.test(w.shg)) || (state.cat==="money" && /loan|scheme/i.test(w.loans) && !/^None/.test(w.loans)))
      && hit([w.name,w.place,w.trade,w.title,w.dek,w.story.join(" ")].join(" ")));
    const comm = state.kind === "field" ? [] : posts.filter(p => (!state.cat || p.category === state.cat) && hit([p.title,p.body,p.authorName,p.village||""].join(" ")));
    const html = [...comm.map(postCard), ...field.map((w) => fieldCard(w, AK.women.indexOf(w)))];
    $("#feed", v).innerHTML = html.length ? `<div class="feed">${html.join("")}</div>` :
      `<div class="empty"><p>No stories match. Try another category or search word.</p>${state.kind!=="field" ? `<a class="btn" href="#share">Share a story in this category</a>`:""}</div>`;
  };
  $("#fq", v).addEventListener("input", e => { state.q = e.target.value; draw(); });
  $("#fk", v).addEventListener("change", e => { state.kind = e.target.value; draw(); });
  $$(".chip", v).forEach(b => b.addEventListener("click", () => {
    state.cat = b.dataset.c || null; $$(".chip", v).forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); }));
  draw();
};

Pages.women = async v => {
  v.innerHTML = `<div class="section-head" style="margin-top:0"><h2>The six</h2><span class="hand muted">Sanquelim, Keri, Surla and Amona</span></div>
  <p class="lead" style="max-width:60ch">We visited six small businesses around Sanquelim in Bicholim taluka, North Goa. Four women told us their stories themselves. At the other two shops, the women who run them hesitated to speak to strangers and asked their husbands to answer for them. We have kept those stories, told in the husbands' words, because that hesitation is part of the picture. This platform exists so the next telling can be her own.</p>
  <div class="tiles" style="margin-top:1.5rem">${AK.women.map(womanTile).join("")}</div>`;
};

Pages.story = async (v, id) => {
  const w = woman(id); if (!w) return Pages.notfound(v);
  const c = cat(w.category), i = AK.women.indexOf(w);
  const names = w.interviewers.map(k => AK.interviewers[k].name);
  const render = async () => {
    const r = await getReact("s:" + w.id);
    const paras = w.story.map(p => `<p>${esc(p)}</p>`);
    paras.splice(2, 0, `<blockquote class="pull">“${esc(w.quote)}”</blockquote>`);
    v.innerHTML = `
    <p><a href="#women">All six profiles</a></p>
    <div class="story-top">
      <div>
        <span class="tag" style="--c:${c.color}">${c.name}</span>
        <h2 style="margin-top:.5rem">${esc(w.title)}</h2>
        <p class="dek">${esc(w.dek)}</p>
        <span class="stamp">Interviewed by ${names.join(" & ")}</span>
        ${w.toldBy ? `<p class="hand" style="font-size:1.1rem;color:var(--ink-soft);margin:-.3rem 0 1rem">${esc(w.toldBy)}</p>` : ""}
        <div class="prose">${paras.join("")}</div>
        ${win("What other women can take from this", `<ul class="lessons">${w.lessons.map(l => `<li>${esc(l)}</li>`).join("")}</ul><p class="note" style="margin:.6rem 0 0">Have a question about this? <button class="btn small plain" data-ask>Ask Sakhi</button></p>`, "red")}
        ${win("From the interview notebook", `<ul class="qa">${w.transcript.map(([who, t]) => `<li class="${names.includes(who)?"":"a"}"><b>${esc(who)}</b><span>${esc(t)}</span></li>`).join("")}</ul>`, "blue")}
        <div id="react"></div>
      </div>
      <aside>
        <figure class="print" style="transform:rotate(-1.2deg)">${w.photo ? `<img src="${w.photo}" alt="${esc(w.photoAlt)}">` : `<div style="aspect-ratio:4/5;overflow:hidden">${coverSVG(w.motif, c.color, i)}</div>`}
          <figcaption>${esc(w.name)}${w.owner ? ". " + esc(w.owner) : ""}</figcaption></figure>
        <table class="facts" style="margin-top:1.6rem"><caption class="sr-only">Business facts</caption>
          <tr><th scope="row">Business</th><td>${esc(w.trade)}</td></tr>
          <tr><th scope="row">Place</th><td>${esc(w.place)}</td></tr>
          <tr><th scope="row">Running</th><td>${esc(w.years)}</td></tr>
          <tr><th scope="row">SHG</th><td>${esc(w.shg)}</td></tr>
          <tr><th scope="row">Finance</th><td>${esc(w.loans)}</td></tr>
          <tr><th scope="row">Next</th><td>${esc(w.plans)}</td></tr>
        </table>
      </aside>
    </div>
    <div class="section-head"><h2>More stories</h2></div>
    <div class="tiles">${AK.women.filter(x => x.id !== w.id).slice(0,3).map(x => womanTile(x, AK.women.indexOf(x))).join("")}</div>`;
    $("#react", v).innerHTML = reactHTML(r);
    wireReact(v, "s:" + w.id, render);
    $("[data-ask]", v).onclick = () => window.Sakhi && Sakhi.open("Which loans or schemes could help a business like " + w.name + "'s?");
  };
  await render();
};

Pages.post = async (v, id) => {
  const p = await safe(() => S.posts.get(id)); if (!p) return Pages.notfound(v);
  const c = cat(p.category);
  const render = async () => {
    const r = await getReact("p:" + p.id);
    const media = (p.media||[]).map(m =>
      m.type === "image" ? `<img src="${esc(m.url)}" alt="${esc(m.name)}">` :
      m.type === "video" ? `<video src="${esc(m.url)}" controls preload="metadata"></video>` :
      `<figure style="margin:0"><figcaption class="note">${esc(m.name)}</figcaption><audio src="${esc(m.url)}" controls></audio></figure>`).join("");
    const mine = me && me.id === p.author;
    v.innerHTML = `<p><a href="#stories">All stories</a></p>
      <article style="max-width:860px">
        <span class="tag" style="--c:${c.color}">${c.name}</span>
        <h2 style="margin-top:.5rem">${esc(p.title)}</h2>
        <p class="hand muted" style="font-size:1.15rem">By ${esc(p.authorName)}${p.trade ? ", " + esc(p.trade) : ""}${p.village ? " from " + esc(p.village) : ""}. ${fmtDate(p.created)}</p>
        ${media ? `<div class="media-grid">${media}</div>` : ""}
        <div class="prose"><p class="post-body">${esc(p.body)}</p></div>
        ${mine ? `<div class="actions"><button class="btn small red" data-del>Delete this story</button></div>` : ""}
        <div id="react"></div>
      </article>`;
    $("#react", v).innerHTML = reactHTML(r);
    wireReact(v, "p:" + p.id, render);
    const d = $("[data-del]", v);
    if (d) d.onclick = () => confirmBox("Delete “" + esc(p.title) + "”? This can't be undone.", "Delete story", async () => {
      const ok = await safe(async () => { await S.posts.remove(p.id); return true; });
      if (ok){ toast("Story deleted"); location.hash = "#account"; } });
  };
  await render();
};

Pages.share = async v => {
  if (!me){
    v.innerHTML = `<div style="max-width:640px">${win("Share your story", `
      <p class="lead">Every business has a beginning worth telling. Write yours, add photos, a video or a voice note, and other women can learn from it.</p>
      <p>You need a free account so your story shows your name and you can edit or delete it later.</p>
      <div class="actions"><a class="btn green" href="#account">Sign in or create account</a></div>`)}</div>`;
    return;
  }
  let files = [];
  v.innerHTML = `<div style="max-width:820px">${win("Write your story", `
    <form id="compose" novalidate>
      <label for="t">Title</label>
      <input id="t" type="text" maxlength="120" placeholder="For example: How I started my pickle business" required>
      <div class="row">
        <div><label for="c">Category</label><select id="c">${AK.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}</select></div>
        <div><label for="vl">Village or town <span class="muted">(optional)</span></label><input id="vl" type="text" maxlength="60" value="${esc(me.village||"")}"></div>
      </div>
      <label for="b">Your story</label>
      <p class="note" style="margin:0 0 .4rem">What do you sell? How did you start? What was hard, and what helped? Write in any language.</p>
      <textarea id="b" maxlength="8000" required></textarea>
      <label for="files">Photos, video or voice notes <span class="muted">(up to 6 files, 15 MB each)</span></label>
      <div class="drop" id="drop" tabindex="0" role="button" aria-describedby="dropHelp">
        ${motifSVG("lamp", 38)}<div id="dropHelp">Drop files here or <u>choose files</u></div>
        <input id="files" type="file" accept="image/*,video/*,audio/*" multiple class="sr-only" tabindex="-1">
      </div>
      <div class="previews" id="prev"></div>
      <p class="form-err" id="err" role="alert"></p>
      <div class="actions"><button class="btn green" type="submit" id="pub">Publish story</button><a class="btn plain" href="#stories">Cancel</a></div>
    </form>`)}</div>`;
  const inp = $("#files", v), drop = $("#drop", v), prev = $("#prev", v), err = $("#err", v);
  const kind = f => f.type.startsWith("image/") ? "image" : f.type.startsWith("video/") ? "video" : f.type.startsWith("audio/") ? "audio" : null;
  const drawPrev = () => {
    freeURLs();
    prev.innerHTML = files.map((f,i) => {
      const k = kind(f), u = blobURL(f);
      const inner = k === "image" ? `<img src="${u}" alt="">` : k === "video" ? `<video src="${u}" muted></video>` : `<div class="aud">Voice note<br>${esc(f.name.slice(0,24))}</div>`;
      return `<figure>${inner}<button type="button" data-rm="${i}" aria-label="Remove ${esc(f.name)}">&times;</button></figure>`;
    }).join("");
    $$("[data-rm]", prev).forEach(b => b.onclick = () => { files.splice(+b.dataset.rm, 1); drawPrev(); });
  };
  const add = list => {
    err.textContent = "";
    for (const f of list){
      if (!kind(f)){ err.textContent = f.name + " isn't a photo, video or audio file."; continue; }
      if (f.size > 15*1024*1024){ err.textContent = f.name + " is larger than 15 MB. Try a shorter video or a smaller photo."; continue; }
      if (files.length >= 6){ err.textContent = "You can add up to 6 files."; break; }
      files.push(f);
    }
    drawPrev();
  };
  drop.onclick = () => inp.click();
  drop.onkeydown = e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); inp.click(); } };
  inp.onchange = () => { add(inp.files); inp.value = ""; };
  ["dragenter","dragover"].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave","drop"].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", e => add(e.dataTransfer.files));
  $("#compose", v).onsubmit = async e => {
    e.preventDefault();
    const title = $("#t", v).value.trim(), body = $("#b", v).value.trim();
    if (!title) { err.textContent = "Add a title for your story."; $("#t", v).focus(); return; }
    if (body.length < 20) { err.textContent = "Write a few more lines. Your story needs at least 20 characters."; $("#b", v).focus(); return; }
    const pub = $("#pub", v); pub.disabled = true; pub.textContent = "Publishing…";
    const id = await safe(() => S.posts.create({title, body, category: $("#c", v).value, village: $("#vl", v).value.trim(), files},
      msg => { pub.textContent = msg; }), err);
    if (id){ toast("Story published"); location.hash = "#post-" + id; }
    else { pub.disabled = false; pub.textContent = "Publish story"; }
  };
};

Pages.account = async v => {
  if (!me){
    v.innerHTML = `<div class="row" style="align-items:flex-start">
      ${win("Sign in", `<form id="li"><label for="lu">Username</label><input id="lu" type="text" autocomplete="username" required>
        <label for="lp">Password</label><input id="lp" type="password" autocomplete="current-password" required>
        <p class="form-err" id="le" role="alert"></p><button class="btn green" type="submit">Sign in</button></form>`)}
      ${win("Create an account", `<form id="su">
        <label for="sn">Your name</label><input id="sn" type="text" maxlength="60" autocomplete="name" required>
        <div class="row"><div><label for="sv">Village or town</label><input id="sv" type="text" maxlength="60"></div>
        <div><label for="st">Your business</label><input id="st" type="text" maxlength="60" placeholder="e.g. Tailoring"></div></div>
        <label for="suu">Username <span class="muted">(letters and numbers)</span></label><input id="suu" type="text" maxlength="24" autocomplete="username" required>
        <label for="sp">Password <span class="muted">(at least 6 characters)</span></label><input id="sp" type="password" autocomplete="new-password" required>
        <p class="form-err" id="se" role="alert"></p><button class="btn" type="submit">Create account</button>
        <p class="note" style="margin-top:1rem">${S.mode === "online" ? "No email needed. Keep your username and password safe: write them down somewhere private." : "Your account is saved in this browser on this device."}</p></form>`, "red")}
    </div>`;
    $("#li", v).onsubmit = async e => {
      e.preventDefault();
      const u = $("#lu", v).value.trim().toLowerCase(), p = $("#lp", v).value, b = $("#li button", v);
      if (!/^[a-z0-9_]{3,24}$/.test(u)) return $("#le", v).textContent = "Usernames have 3 to 24 letters, numbers or underscores.";
      b.disabled = true;
      const ok = await safe(() => S.auth.signIn(u, p), $("#le", v));
      b.disabled = false;
      if (ok){ refreshMe(); toast("Signed in. Welcome back, " + me.name.split(" ")[0]); route(); }
    };
    $("#su", v).onsubmit = async e => {
      e.preventDefault();
      const name = $("#sn", v).value.trim(), u = $("#suu", v).value.trim().toLowerCase(), p = $("#sp", v).value, se = $("#se", v);
      if (!name) return se.textContent = "Enter your name.";
      if (!/^[a-z0-9_]{3,24}$/.test(u)) return se.textContent = "Username needs 3 to 24 letters, numbers or underscores.";
      if (p.length < 6) return se.textContent = "Password needs at least 6 characters.";
      const b = $("#su button", v); b.disabled = true; se.textContent = "";
      const ok = await safe(() => S.auth.signUp({username:u, password:p, name, village:$("#sv", v).value.trim(), trade:$("#st", v).value.trim()}), se);
      b.disabled = false;
      if (ok){ refreshMe(); toast("Account created"); location.hash = "#share"; }
    };
    return;
  }
  const mine = ((await safe(() => S.posts.list(300))) || []).filter(p => p.author === me.id);
  v.innerHTML = `<div class="row" style="align-items:flex-start">
    <div style="flex:1 1 320px">${win("Your profile", `
      <form id="pf"><label for="pn">Name</label><input id="pn" type="text" maxlength="60" value="${esc(me.name)}" required>
      <label for="pv">Village or town</label><input id="pv" type="text" maxlength="60" value="${esc(me.village||"")}">
      <label for="pt">Your business</label><input id="pt" type="text" maxlength="60" value="${esc(me.trade||"")}">
      <p class="note">Username: ${esc(me.username)}</p>
      <div class="actions"><button class="btn green small" type="submit">Save profile</button><button class="btn plain small" type="button" id="so">Sign out</button></div></form>`)}</div>
    <div style="flex:2 1 420px">${win("Your stories", mine.length ? `<ul class="comments">${mine.map(p => `<li><a href="#post-${p.id}"><b>${esc(p.title)}</b></a><div class="who">${cat(p.category).name}, ${fmtDate(p.created)}</div></li>`).join("")}</ul><a class="btn small" href="#share">Write another</a>` :
      `<p>You haven't shared a story yet.</p><a class="btn" href="#share">Share your story</a>`, "blue")}</div></div>`;
  $("#pf", v).onsubmit = async e => {
    e.preventDefault();
    const ok = await safe(() => S.auth.update({name: $("#pn", v).value.trim() || me.name, village: $("#pv", v).value.trim(), trade: $("#pt", v).value.trim()}));
    if (ok){ refreshMe(); toast("Profile saved"); }
  };
  $("#so", v).onclick = async () => { await safe(() => S.auth.signOut()); refreshMe(); toast("Signed out"); location.hash = "#home"; };
};

Pages.faq = async (v, focus) => {
  const groups = [...new Set(AK.faq.map(f => f.group))];
  v.innerHTML = `<div class="section-head" style="margin-top:0"><h2>Help desk</h2><button class="btn small red" data-ask>Ask Sakhi a question</button></div>
  <p class="lead" style="max-width:62ch">Plain answers about growing a business, loans, government schemes and paperwork. Figures were checked in November 2026. Rules change, so confirm at your bank or the scheme office before you apply.</p>
  <div class="faq-wrap" style="margin-top:1.5rem">
    <nav class="faq-nav" aria-label="Help desk topics">${groups.map(g => `<a href="#faq-${AK.faq.find(f=>f.group===g).id}">${g}</a>`).join("")}</nav>
    <div>${groups.map(g => `<h3 class="group-title">${g}</h3>` + AK.faq.filter(f => f.group === g).map(f =>
      `<details class="q" id="faq-${f.id}"><summary>${esc(f.q)}</summary><div class="ans">${f.a.map(x => x.startsWith("<") ? x : `<p>${x}</p>`).join("")}<p class="where">Where to go: ${esc(f.where)}</p></div></details>`).join("")).join("")}
    <h3 class="group-title">Sources</h3>
    <ul class="note">${AK.sources.map(([t,u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("")}</ul>
    <p class="note">This help desk gives general information, not legal or financial advice.</p></div>
  </div>`;
  $("[data-ask]", v).onclick = () => window.Sakhi && Sakhi.open();
  $$(".faq-nav a", v).forEach(a => a.addEventListener("click", e => { e.preventDefault(); const d = $(a.getAttribute("href"), v); if (d){ d.open = true; d.scrollIntoView({block:"start"}); } }));
  if (focus){ const d = $("#faq-" + focus, v); if (d){ d.open = true; setTimeout(() => d.scrollIntoView({block:"start"}), 30); } }
};

Pages.about = async v => {
  v.innerHTML = `<div class="section-head" style="margin-top:0"><h2>About this project</h2></div>
  <div class="row" style="align-items:flex-start">
    <div style="flex:2 1 460px">
      ${win("Why “Meri Kahani, Meri Zubani”", `<div class="prose">
        <p>Women at the bottom of the pyramid run a large share of India's small trade: the vegetable stall, the tailoring room, the parlour above a shop. Their experience of credit, self-help groups and government schemes rarely reaches the next woman who needs it.</p>
        <p>Several women we met hesitated to speak and asked their husbands to answer for them. The name is a promise: here, she tells her own story, in her own words, in writing or in a voice note.</p>
        <p>This platform was built for the ET Rural Marketing project on women's entrepreneurship in rural markets. It does three things. It tells the life stories of six businesses we interviewed. It answers the questions they raised about loans and schemes. And it gives other women a place to publish their own stories, with photos, video and voice notes.</p></div>`)}
      ${win("How we gathered the stories", `<ul class="lessons">
        <li>Structured, in-person interviews at each business in and around Sanquelim, Bicholim taluka, North Goa.</li>
        <li>The same core questions for everyone: years in business, SHG membership, loans and schemes, who decides how money is spent, challenges, and plans.</li>
        <li>At two of the six shops, the women hesitated and asked their husbands to answer. We noted this as a finding: many women in small towns are not used to being asked about their own business.</li>
        <li>Stories on this site are written from the interview transcripts. Quotes are lightly cleaned for grammar.</li>
        <li>Help-desk answers come from government and bank sources, listed on the help desk page.</li>
        <li>Sakhi, the help bot, answers from the help-desk content and the six stories, so it works without internet access to any AI service.</li></ul>`, "blue")}
      ${win("Your data", S.mode === "online"
        ? `<p>Accounts, stories, photos and comments are saved in an online database, so every visitor can read published stories. You need only a username and password; we don't ask for email or phone numbers. You can delete your own stories at any time from your account page.</p>`
        : `<p>Accounts, stories, photos and comments are saved in your own browser on this device. They are not uploaded to a server, and other visitors won't see them. Clearing your browser data deletes them.</p>`, "red")}
    </div>
    <div style="flex:1 1 260px">
      ${win("Field team", `<div class="team">${Object.values(AK.interviewers).map(p => `<div class="member"><div class="ini">${p.name[0]}</div><b class="hand" style="font-size:1.2rem">${p.name}</b><div class="note">${p.role}</div></div>`).join("")}</div>`)}
      <figure class="print" style="transform:rotate(1deg);margin-top:1rem"><img src="img/traders.jpg" alt="${esc(woman("traders").photoAlt)}" loading="lazy"><figcaption>With the traders at New Market</figcaption></figure>
    </div>
  </div>`;
};

Pages.notfound = v => { v.innerHTML = `<div class="empty"><h2>This page isn't here</h2><p>The story may have been deleted, or it was saved in another browser.</p><a class="btn" href="#home">Go to the home page</a></div>`; };

/* ---------------- Router ---------------- */
async function route(){
  const h = (location.hash || "#home").slice(1);
  const v = $("#view");
  freeURLs(); S.release();
  let key = h, arg;
  if (h.startsWith("story-")) { key = "story"; arg = h.slice(6); }
  else if (h.startsWith("post-")) { key = "post"; arg = h.slice(5); }
  else if (h.startsWith("faq-")) { key = "faq"; arg = h.slice(4); }
  if (!Pages[key] || key === "notfound") key = "home";
  const navKey = {story:"women", post:"stories"}[key] || key;
  $$(".nav a").forEach(a => a.dataset.r === navKey ? a.setAttribute("aria-current","page") : a.removeAttribute("aria-current"));
  $("#nav").classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded","false");
  await Pages[key](v, arg);
  if (key !== "faq" || !arg) window.scrollTo(0, 0);
  const t = {home:"",stories:"Stories",women:"The six",faq:"Help desk",share:"Share your story",account:"Account",about:"About"}[key];
  document.title = (key === "story" ? woman(arg)?.name + " | " : t ? t + " | " : "") + "Meri Kahani, Meri Zubani";
}
window.addEventListener("hashchange", route);
$("#menuBtn").onclick = () => { const n = $("#nav"); n.classList.toggle("open"); $("#menuBtn").setAttribute("aria-expanded", n.classList.contains("open")); };

window.AKApp = { esc, woman, cat, motifSVG };
Store.open().then(store => {
  S = store; refreshMe();
  $("#dataNote").textContent = S.mode === "online" ? "Stories are saved online and shared with every visitor."
    : S.offlineFallback ? "Couldn't reach the online database, so stories are being saved in this browser only."
    : "Stories are saved in this browser only. Add Supabase keys in js/config.js to share them online.";
  route();
});
})();
