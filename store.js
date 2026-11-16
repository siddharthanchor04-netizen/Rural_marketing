/* Meri Kahani, Meri Zubani — data layer.
   Two back ends with the same interface:
   - "online": Supabase (free tier). Stories, photos and comments are shared by every visitor.
   - "local":  the visitor's own browser (IndexedDB). Used when js/config.js has no Supabase keys.
   Women sign in with a username, not an email. Online, the username is turned into a
   placeholder address (username@<authEmailDomain>) because Supabase Auth expects one;
   no email is ever sent to it. */
(function(){
"use strict";
const CFG = window.MKMZ_CONFIG || {};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const kindOf = mime => mime.startsWith("image/") ? "image" : mime.startsWith("video/") ? "video" : mime.startsWith("audio/") ? "audio" : null;
const err = m => { const e = new Error(m); e.userMessage = m; return e; };

/* ============================== LOCAL ============================== */
function LocalStore(){
  const mem = {users:new Map(), posts:new Map(), react:new Map()};
  let dbp = null, urls = [];
  function open(){
    if (dbp) return dbp;
    dbp = new Promise(res => {
      try{
        const r = indexedDB.open("amchi-kani", 1);
        r.onupgradeneeded = () => { const d = r.result;
          d.createObjectStore("users", {keyPath:"username"});
          d.createObjectStore("posts", {keyPath:"id"});
          d.createObjectStore("react", {keyPath:"id"}); };
        r.onsuccess = () => res(r.result); r.onerror = () => res(null); r.onblocked = () => res(null);
      }catch(e){ res(null); }
    });
    return dbp;
  }
  async function tx(store, mode, fn){
    const d = await open();
    if (!d) return fn(null, mem[store]);
    return new Promise((res, rej) => {
      const t = d.transaction(store, mode), s = t.objectStore(store);
      let out; const q = fn(s);
      if (q && "onsuccess" in q) q.onsuccess = () => { out = q.result; };
      t.oncomplete = () => res(out); t.onerror = () => rej(t.error);
      t.onabort = () => rej(t.error || new Error("Storage is full or blocked"));
    });
  }
  const DB = {
    get: (st, k) => tx(st, "readonly", (s, m) => m ? m.get(k) : s.get(k)),
    all: st => tx(st, "readonly", (s, m) => m ? Array.from(m.values()) : s.getAll()),
    put: (st, v) => tx(st, "readwrite", (s, m) => { if (m){ m.set(v.username || v.id, v); return; } return s.put(v); }),
    del: (st, k) => tx(st, "readwrite", (s, m) => m ? m.delete(k) : s.delete(k))
  };
  const session = {
    get(){ try{ return localStorage.getItem("mkmz-user"); }catch(e){ return this._u || null; } },
    set(u){ this._u = u; try{ u ? localStorage.setItem("mkmz-user", u) : localStorage.removeItem("mkmz-user"); }catch(e){} }
  };
  async function hash(pw, salt){
    const data = new TextEncoder().encode(salt + ":" + pw);
    if (window.crypto && crypto.subtle){
      const buf = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
    }
    let h = 5381; for (const b of data) h = ((h << 5) + h + b) | 0; return "w" + (h >>> 0).toString(16);
  }
  const pub = u => u && ({id:u.username, username:u.username, name:u.name, village:u.village||"", trade:u.trade||""});
  const url = b => { const u = URL.createObjectURL(b); urls.push(u); return u; };
  const norm = p => ({...p, media:(p.media||[]).map(m => ({type:m.type, name:m.name, url:url(m.blob)}))});
  let me = null;
  return {
    mode: "local",
    async init(){ const u = session.get(); me = u ? pub(await DB.get("users", u)) : null; if (u && !me) session.set(null); },
    release(){ urls.forEach(u => URL.revokeObjectURL(u)); urls = []; },
    auth: {
      current: () => me,
      async signUp({username, password, name, village, trade}){
        if (await DB.get("users", username)) throw err("That username is taken. Try adding a number.");
        const salt = uid();
        await DB.put("users", {username, name, village, trade, salt, pw: await hash(password, salt), created: Date.now()});
        session.set(username); me = pub(await DB.get("users", username)); return me;
      },
      async signIn(username, password){
        const u = await DB.get("users", username);
        if (!u || u.pw !== await hash(password, u.salt)) throw err("Username or password doesn't match. Check both and try again.");
        session.set(username); me = pub(u); return me;
      },
      async signOut(){ session.set(null); me = null; },
      async update(f){ const u = await DB.get("users", me.username); Object.assign(u, f); await DB.put("users", u); me = pub(u); return me; }
    },
    posts: {
      async list(limit=200){ return (await DB.all("posts")).sort((a,b) => b.created - a.created).slice(0, limit).map(norm); },
      async get(id){ const p = await DB.get("posts", id); return p ? norm(p) : null; },
      async create({title, body, category, village, files}){
        const p = {id:uid(), author:me.id, authorName:me.name, trade:me.trade, village, title, body, category, created:Date.now(),
          media: files.map(f => ({type:kindOf(f.type), mime:f.type, name:f.name, blob:f}))};
        try{ await DB.put("posts", p); }catch(e){ throw err("Couldn't save: your browser storage may be full. Remove a large video and try again."); }
        return p.id;
      },
      async remove(id){ await DB.del("posts", id); await DB.del("react", "p:" + id); }
    },
    react: {
      async get(id){ const r = (await DB.get("react", id)) || {id, claps:[], comments:[]}; return {claps:r.claps, comments:r.comments}; },
      async toggleClap(id){ const r = (await DB.get("react", id)) || {id, claps:[], comments:[]}; const i = r.claps.indexOf(me.id); i < 0 ? r.claps.push(me.id) : r.claps.splice(i,1); await DB.put("react", r); },
      async comment(id, text){ const r = (await DB.get("react", id)) || {id, claps:[], comments:[]}; r.comments.push({name:me.name, text, at:Date.now()}); await DB.put("react", r); }
    }
  };
}

/* ============================== SUPABASE ============================== */
function SupabaseStore(){
  const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey, {auth:{persistSession:true, autoRefreshToken:true}});
  const domain = CFG.authEmailDomain || "users.merikahani.app";
  const email = u => `${u}@${domain}`;
  const BUCKET = "media";
  let me = null;
  const fail = (e, fallback) => { console.error(e); throw err(fallback); };
  async function loadProfile(userId){
    const {data, error} = await sb.from("profiles").select("id, username, name, village, trade").eq("id", userId).maybeSingle();
    if (error) fail(error, "Couldn't load your profile. Check your internet and try again.");
    return data;
  }
  const norm = r => ({
    id:r.id, author:r.author, authorName:r.author_name, trade:r.author_trade || "", village:r.village || "",
    title:r.title, body:r.body, category:r.category, created:new Date(r.created_at).getTime(),
    media:(r.media || []).map(m => ({type:m.type, name:m.name, url:sb.storage.from(BUCKET).getPublicUrl(m.path).data.publicUrl, path:m.path}))
  });
  return {
    mode: "online",
    async init(){
      const {data} = await sb.auth.getSession();
      me = data && data.session ? await loadProfile(data.session.user.id) : null;
    },
    release(){},
    auth: {
      current: () => me,
      async signUp({username, password, name, village, trade}){
        const {data, error} = await sb.auth.signUp({email: email(username), password, options:{data:{username, name, village, trade}}});
        if (error){
          if (/already|registered|exists/i.test(error.message)) throw err("That username is taken. Try adding a number.");
          if (/password/i.test(error.message)) throw err("Choose a stronger password: at least 6 characters.");
          if (/rate|too many/i.test(error.message)) throw err("Too many sign-ups from this network right now. Wait a few minutes and try again.");
          fail(error, "Couldn't create the account: " + error.message);
        }
        if (!data.session) throw err("Account created, but the site owner needs to turn off email confirmation in Supabase before you can sign in.");
        me = await loadProfile(data.user.id);
        if (!me) fail(new Error("profile missing"), "Your account was created but the profile table isn't set up. Ask the site owner to run schema.sql.");
        return me;
      },
      async signIn(username, password){
        const {data, error} = await sb.auth.signInWithPassword({email: email(username), password});
        if (error){
          if (/invalid login/i.test(error.message)) throw err("Username or password doesn't match. Check both and try again.");
          fail(error, "Couldn't sign in: " + error.message);
        }
        me = await loadProfile(data.user.id); return me;
      },
      async signOut(){ await sb.auth.signOut(); me = null; },
      async update(f){
        const {data, error} = await sb.from("profiles").update(f).eq("id", me.id).select("id, username, name, village, trade").single();
        if (error) fail(error, "Couldn't save your profile. Try again.");
        me = data; return me;
      }
    },
    posts: {
      async list(limit=200){
        const {data, error} = await sb.from("posts").select("*").order("created_at", {ascending:false}).limit(limit);
        if (error) fail(error, "Couldn't load stories. Check your internet and refresh the page.");
        return data.map(norm);
      },
      async get(id){
        if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
        const {data, error} = await sb.from("posts").select("*").eq("id", id).maybeSingle();
        if (error) fail(error, "Couldn't load this story. Check your internet and try again.");
        return data ? norm(data) : null;
      },
      async create({title, body, category, village, files}, onProgress){
        const id = crypto.randomUUID ? crypto.randomUUID() : null;
        const folder = `${me.id}/${id || uid()}`;
        const media = [];
        for (let i = 0; i < files.length; i++){
          const f = files[i];
          if (onProgress) onProgress(`Uploading ${i+1} of ${files.length}…`);
          const safe = f.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
          const path = `${folder}/${i}-${safe}`;
          const {error} = await sb.storage.from(BUCKET).upload(path, f, {contentType: f.type, upsert:false});
          if (error){
            await sb.storage.from(BUCKET).remove(media.map(m => m.path));
            fail(error, `Couldn't upload ${f.name}. Check your internet, or try a smaller file.`);
          }
          media.push({type:kindOf(f.type), mime:f.type, name:f.name, path});
        }
        if (onProgress) onProgress("Saving your story…");
        const row = {author:me.id, author_name:me.name, author_trade:me.trade || "", village, title, body, category, media};
        if (id) row.id = id;
        const {data, error} = await sb.from("posts").insert(row).select("id").single();
        if (error){
          await sb.storage.from(BUCKET).remove(media.map(m => m.path));
          fail(error, "Couldn't publish your story. Try again in a moment.");
        }
        return data.id;
      },
      async remove(id){
        const {data} = await sb.from("posts").select("media").eq("id", id).maybeSingle();
        const {error} = await sb.from("posts").delete().eq("id", id);
        if (error) fail(error, "Couldn't delete this story. Try again.");
        const paths = ((data && data.media) || []).map(m => m.path);
        if (paths.length) await sb.storage.from(BUCKET).remove(paths);
        await sb.from("comments").delete().eq("item_id", "p:" + id).eq("user_id", me.id);
      }
    },
    react: {
      async get(id){
        const [c, m] = await Promise.all([
          sb.from("claps").select("user_id").eq("item_id", id),
          sb.from("comments").select("name, body, created_at").eq("item_id", id).order("created_at", {ascending:true})
        ]);
        if (c.error || m.error) fail(c.error || m.error, "Couldn't load comments.");
        return { claps: c.data.map(x => x.user_id), comments: m.data.map(x => ({name:x.name, text:x.body, at:new Date(x.created_at).getTime()})) };
      },
      async toggleClap(id){
        const {data} = await sb.from("claps").select("item_id").eq("item_id", id).eq("user_id", me.id).maybeSingle();
        const q = data ? sb.from("claps").delete().eq("item_id", id).eq("user_id", me.id)
                       : sb.from("claps").insert({item_id:id, user_id:me.id});
        const {error} = await q; if (error) fail(error, "Couldn't save that. Try again.");
      },
      async comment(id, text){
        const {error} = await sb.from("comments").insert({item_id:id, user_id:me.id, name:me.name, body:text});
        if (error) fail(error, "Couldn't post your comment. Try again.");
      }
    }
  };
}

/* ============================== PICK ============================== */
function loadScript(src){
  return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
}
window.Store = {
  async open(){
    if (CFG.supabaseUrl && CFG.supabaseKey){
      try{
        if (!window.supabase) await loadScript("vendor/supabase.js");
        const s = SupabaseStore(); await s.init(); return s;
      }catch(e){
        console.error("Online storage unavailable, using this browser instead.", e);
        const s = LocalStore(); s.offlineFallback = true; await s.init(); return s;
      }
    }
    const s = LocalStore(); await s.init(); return s;
  }
};
})();
