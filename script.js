/* script.js - daily hadith/verse, lists, challenge, modal, quotes, refs */

/* ---------- DATA ---------- */
const HADITHS = [
  {text:"Actions are judged by intentions.", ref:"Sahih al-Bukhari (1)"},
  {text:"The strong believer is better than the weak believer.", ref:"Sahih Muslim"},
  {text:"Cleanliness is half of faith.", ref:"Sahih Muslim"},
  {text:"A smile is charity.", ref:"Tirmidhi"},
  {text:"None of you truly believes until he wishes for his brother what he wishes for himself.", ref:"Bukhari & Muslim"},
  {text:"Make things easy, not difficult.", ref:"Sahih al-Bukhari"},
  {text:"Whoever guides to good will have reward like it.", ref:"Sahih Muslim"},
  {text:"The best of you are those best to their families.", ref:"Tirmidhi"},
  {text:"Seek knowledge from cradle to grave.", ref:"(General)"},
  {text:"Visit the sick and free captives.", ref:"Sahih Bukhari"},
  {text:"Be kind to neighbors.", ref:"Sahih Muslim"},
  {text:"Feed the hungry.", ref:"Sahih Bukhari"},
  {text:"The best among you are those who learn the Qur'an and teach it.", ref:"Bukhari"},
  {text:"He who does not show mercy will not be shown mercy.", ref:"Bukhari & Muslim"},
  {text:"Modesty is part of faith.", ref:"Bukhari & Muslim"},
  {text:"The one who looks after an orphan and myself will be together in Paradise like this.", ref:"Bukhari"},
  {text:"Be conscious of Allah wherever you are.", ref:"Tirmidhi"},
  {text:"Speak good or remain silent.", ref:"Bukhari & Muslim"},
  {text:"Lower your gaze.", ref:"(Prophetic emphasis)"},
  {text:"Protect your tongue; it causes much good and much evil.", ref:"Ibn al-Jawzi"},
  {text:"Visit the graves to remember death.", ref:"Muslim"},
  {text:"Help your brother whether he is oppressor or oppressed.", ref:"(contextual)"},
  {text:"Perfect your work.", ref:"Al-Bayhaqi"},
  {text:"The best charity is that given in Ramadan.", ref:"Tirmidhi"},
  {text:"Whoever relieves a believer’s distress, Allah will relieve his distress.", ref:"Muslim"},
  {text:"The best of you are those best in character.", ref:"Bukhari"},
  {text:"Do not waste water even in ablution.", ref:"Ibn Majah"},
  {text:"The believer is not a fault-finder nor a curser.", ref:"Ibn Hibban"},
  {text:"Pray as if it is your last prayer.", ref:"(General)"},
  {text:"Allah looks at hearts and deeds.", ref:"Muslim"},
  {text:"The best of people are those most beneficial to people.", ref:"Daraqutni"},
  {text:"Give glad tidings and do not repel people.", ref:"Muslim"},
  {text:"Act with sincerity for the sake of Allah.", ref:"(General)"},
  {text:"Good deeds after death: ongoing charity, beneficial knowledge, pious child.", ref:"Muslim"},
  {text:"Do not be angry.", ref:"Bukhari"},
  {text:"Spend on your family and be moderate.", ref:"Bukhari"},
  {text:"Allah forgives those who sincerely seek forgiveness.", ref:"Quran reference"},
  {text:"Maintain ties of kinship.", ref:"Bukhari & Muslim"}
];

const VERSES = [
  {arabic:"إِنَّ مَعَ الْعُسْرِ يُسْرًا", trans:"Indeed, with hardship comes ease.", ref:"94:6"},
  {arabic:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", trans:"Indeed, Allah is with the patient.", ref:"2:153"},
  {arabic:"فَاذْكُرُونِي أَذْكُرْكُمْ", trans:"So remember Me; I will remember you.", ref:"2:152"},
  {arabic:"وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", trans:"And whoever relies upon Allah — then He is sufficient for him.", ref:"65:3"},
  {arabic:"لَا تُكَلَّفُ نَفْسٌ إِلَّا وُسْعَهَا", trans:"No soul is burdened beyond its capacity.", ref:"2:286"},
  {arabic:"إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ", trans:"The believers are but brothers.", ref:"49:10"},
  {arabic:"ادْعُونِي أَسْتَجِبْ لَكُمْ", trans:"Call upon Me; I will respond to you.", ref:"40:60"},
  {arabic:"لَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ", trans:"Do not despair of the mercy of Allah.", ref:"39:53"},
  {arabic:"فَاسْتَبِقُوا الْخَيْرَاتِ", trans:"So race to goodness.", ref:"2:148"},
  {arabic:"إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", trans:"Indeed, Allah loves the doers of good.", ref:"2:195"}
];

const CHALLENGES = [
  "Give charity quietly to a person in need.",
  "Read 5 verses of Quran with reflection.",
  "Perform two extra voluntary raka'ah today.",
  "Teach someone a short dua you know.",
  "Visit or call an elder and ask how they are.",
  "Fast a voluntary day with sincere intention.",
  "Help someone carry a load or a task.",
  "Give sincere praise to your parents today."
];

const QUOTES = [
  "Turn to Allah in small moments — little deeds stack up in front of the Lord.",
  "A heart that is grateful finds light in every difficulty.",
  "Knowledge without action is like a lamp without oil — fuel it with practice.",
  "Speak gently — the softest voice can move the hardest heart.",
  "Sincere intention turns small actions into great reward."
];

/* ---------- UTILS ---------- */
function todayKey(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function lsSet(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
function lsGet(k){ try{ return JSON.parse(localStorage.getItem(k)); } catch(e){ return null } }

/* ---------- DAILY hadith & verse ---------- */
function ensureDaily(){
  const today = todayKey();
  if(localStorage.getItem("site_day") === today){
    const had = lsGet("hadith_today"); const ver = lsGet("verse_today");
    if(had) showHadith(had);
    if(ver) showVerse(ver);
    return;
  }
  localStorage.setItem("site_day", today);
  const had = HADITHS[Math.floor(Math.random()*HADITHS.length)];
  const ver = VERSES[Math.floor(Math.random()*VERSES.length)];
  lsSet("hadith_today", had); lsSet("verse_today", ver);
  showHadith(had); showVerse(ver);
}
function showHadith(h){
  const home = document.getElementById("hadith-display");
  const refEl = document.getElementById("hadith-ref");
  if(home) home.textContent = `"${h.text}"`;
  if(refEl) refEl.textContent = `Reference: ${h.ref}`;
}
function showVerse(v){
  const home = document.getElementById("verse-display");
  const refEl = document.getElementById("verse-ref");
  const display = v.arabic && v.arabic.trim() ? `${v.arabic}\n\n${v.trans}` : `${v.trans}`;
  if(home) home.textContent = display;
  if(refEl) refEl.textContent = `${v.ref}`;
}

/* ---------- lists & load more (for hadiths/verses pages) ---------- */
function populateLists(){
  const hadList = document.getElementById("hadith-list");
  const verList = document.getElementById("verse-list");
  if(hadList){
    hadList.innerHTML = "";
    HADITHS.forEach((h, idx) => {
      const el = document.createElement("div"); el.className="list-card";
      el.innerHTML = `<div class="trans">${h.text}</div><div class="meta small">${h.ref}</div><div style="margin-top:8px"><button class="btn ghost" onclick='openModal(${idx},"hadith")'>View</button></div>`;
      hadList.appendChild(el);
    });
  }
  if(verList){
    verList.innerHTML = "";
    VERSES.forEach((v, idx) => {
      const display = v.arabic && v.arabic.trim() ? `${v.arabic} — ${v.trans}` : `${v.trans} — ${v.ref}`;
      const el = document.createElement("div"); el.className="list-card";
      el.innerHTML = `<div class="trans">${display}</div><div class="meta small">${v.ref}</div><div style="margin-top:8px"><button class="btn ghost" onclick='openModal(${idx},"verse")'>View</button></div>`;
      verList.appendChild(el);
    });
  }
}

/* ---------- modal ---------- */
function openModal(idx,type){
  const bg = document.getElementById("modal-bg");
  const content = document.getElementById("modal-content");
  let html="";
  if(type==="hadith"){
    const h = HADITHS[idx];
    html = `<div class="trans">${h.text}</div><div class="meta small">Reference: ${h.ref}</div>`;
  } else {
    const v = VERSES[idx];
    html = `<div class="arabic">${v.arabic || ''}</div><div class="trans">${v.trans} — ${v.ref}</div>`;
  }
  content.innerHTML = html; bg.style.display = "flex";
}
window.openModal = openModal;
function closeModal(e){
  if(e && e.target && e.target.id !== "modal-bg") return;
  document.getElementById("modal-bg").style.display = "none";
}

/* ---------- challenge functions (unchanged) ---------- */
function ensureChallenge(){
  const today = todayKey();
  if(localStorage.getItem("ch_day") === today){
    renderTodayChallenge(); renderPreviewCount(); return;
  }
  localStorage.setItem("ch_day", today);
  const chosen = CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)];
  const obj = { id: btoa(chosen).slice(0,12), text: chosen, date: today, done:false, generatedAt:new Date().toISOString() };
  lsSet("today_challenge", obj);
  lsSet("preview_count", { day: today, count: 0 });
  renderTodayChallenge(); renderPreviewCount();
}
function renderTodayChallenge(){
  const chal = lsGet("today_challenge");
  if(!chal) return;
  const txt = document.getElementById("chal-text"); if(txt) txt.textContent = chal.text;
  const meta = document.getElementById("chal-meta"); if(meta) meta.textContent = chal.done ? ("Completed: " + (chal.completedAt || "")) : ("Generated: " + new Date(chal.generatedAt).toLocaleString());
  const mark = document.getElementById("mark-done");
  if(mark) { if(chal.done){ mark.disabled=true; mark.textContent="✔ Completed — MashaAllah"; } else { mark.disabled=false; mark.textContent="Mark Done"; } }
}
function markDone(){
  const chal = lsGet("today_challenge"); if(!chal) return alert("No challenge.");
  if(chal.done) return alert("Already completed. MashaAllah.");
  chal.done = true; chal.completedAt = new Date().toISOString(); lsSet("today_challenge", chal);
  const history = lsGet("chal_history") || []; history.push({ id:chal.id,text:chal.text,date:chal.date,completedAt:chal.completedAt}); lsSet("chal_history", history);
  renderHistory(); renderTodayChallenge();
  setTimeout(()=> alert("Mashallah! You have completed the challenge 🌙\nMay Allah reward you in the Akhira 🤲"), 120);
}
window.markDone = markDone;

function getAnother(){
  const today = todayKey();
  let pc = lsGet("preview_count") || { day: today, count: 0 };
  if(pc.day !== today){ pc = { day: today, count: 0 }; }
  if(pc.count >= 5){
    const skipBtn = document.getElementById("skip-btn");
    if(skipBtn){ skipBtn.disabled = true; skipBtn.textContent = "Previews used"; }
    alert("You have used 5 previews today. Come back tomorrow for a new challenge. 🌙");
    return;
  }
  const candidate = CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)];
  const el = document.getElementById("chal-text");
  if(el) el.textContent = candidate + " (preview)";
  pc.count += 1;
  lsSet("preview_count", pc);
  renderPreviewCount();
}
window.getAnother = getAnother;
function renderPreviewCount(){
  const pc = lsGet("preview_count") || { day: todayKey(), count: 0 };
  const skipBtn = document.getElementById("skip-btn");
  if(!skipBtn) return;
  if(pc.day !== todayKey()) { lsSet("preview_count", { day: todayKey(), count: 0 }); skipBtn.disabled = false; skipBtn.textContent = "Get Another"; return; }
  if(pc.count >= 5){ skipBtn.disabled = true; skipBtn.textContent = "Previews used"; } else { skipBtn.disabled = false; skipBtn.textContent = `Get Another (${5-pc.count} left)`; }
}

/* history */
function renderHistory(){
  const wrap = document.getElementById("history-wrap"); if(!wrap) return;
  const history = lsGet("chal_history") || [];
  if(history.length === 0){ wrap.innerHTML = "<div class='small'>No completed challenges yet.</div>"; return; }
  wrap.innerHTML = "";
  history.slice().reverse().forEach(h => {
    const d = document.createElement("div"); d.className="list-card"; d.innerHTML = `<div class="trans">${h.text}</div><div class="meta small">Done: ${new Date(h.completedAt).toLocaleString()}</div>`; wrap.appendChild(d);
  });
}

/* rotating quote on home */
function showRotatingQuote(){
  const quoteBoxId = 'home-quote-box';
  let box = document.getElementById(quoteBoxId);
  if(!box){
    box = document.createElement('div');
    box.id = quoteBoxId;
    box.style.marginTop = '18px';
    box.style.padding = '12px';
    box.style.borderRadius = '10px';
    box.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
    box.style.border = '1px solid rgba(255,255,255,0.03)';
    box.style.color = 'var(--muted)';
    box.className = 'small';
    const main = document.querySelector('.container');
    if(main) main.appendChild(box);
  }
  let idx = Number(localStorage.getItem('quote_idx') || 0);
  box.textContent = "“" + QUOTES[idx % QUOTES.length] + "”";
  idx += 1;
  localStorage.setItem('quote_idx', idx);
  setInterval(()=> {
    let i = Number(localStorage.getItem('quote_idx') || 0);
    const el = document.getElementById(quoteBoxId);
    if(el){ el.textContent = "“" + QUOTES[i % QUOTES.length] + "”"; i += 1; localStorage.setItem('quote_idx', i); }
  }, 9000);
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  ensureDaily(); populateLists(); ensureChallenge(); renderHistory(); renderPreviewCount(); showRotatingQuote();

  // fallback for posts images if errors
  document.querySelectorAll(".posts img").forEach(img => img.onerror = ()=> {
    img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640'><rect width='100%25' height='100%25' fill='%23333'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%23fff'>Instagram</text></svg>";
  });
});
