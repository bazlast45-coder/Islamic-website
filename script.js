/* script.js - daily hadith/verse, lists, challenge, modal, thumbnails fallback */

/* ---------- DATA ---------- */
const HADITHS = [
  {text:"Actions are judged by intentions.", ref:"Sahih al-Bukhari 1"},
  {text:"The strong believer is better than the weak believer.", ref:"Muslim"},
  {text:"Cleanliness is half of faith.", ref:"Sahih Muslim"},
  {text:"A smile is charity.", ref:"Tirmidhi"},
  {text:"None of you truly believes until he wishes for his brother what he wishes for himself.", ref:"Bukhari & Muslim"},
  {text:"Make things easy, not difficult.", ref:"Sahih al-Bukhari"},
  {text:"Whoever guides to good will have reward like it.", ref:"Sahih Muslim"},
  {text:"The best of you are those best to their families.", ref:"Tirmidhi"},
  {text:"Seek knowledge from cradle to grave.", ref:"(General)"},
  {text:"Visit the sick and free captives.", ref:"Sahih Bukhari"},
  {text:"Be kind to neighbors.", ref:"Sahih Muslim"},
  {text:"Feed the hungry.", ref:"Sahih Bukhari"}
];

const VERSES = [
  {arabic:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", trans:"Indeed, Allah is with the patient.", ref:"2:153"},
  {arabic:"فَاذْكُرُونِي أَذْكُرْكُمْ", trans:"So remember Me; I will remember you.", ref:"2:152"},
  {arabic:"وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", trans:"My success is only by Allah.", ref:"11:88"},
  {arabic:"إِنَّ مَعَ الْعُسْرِ يُسْرًا", trans:"Indeed, with hardship comes ease.", ref:"94:6"},
  {arabic:"لَا تُكَلَّفُ نَفْسٌ إِلَّا وُسْعَهَا", trans:"No soul is burdened beyond its capacity.", ref:"2:286"},
  {arabic:"إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ", trans:"The believers are but brothers.", ref:"49:10"},
  {arabic:"فَاسْتَبِقُوا الْخَيْرَاتِ", trans:"So race to goodness.", ref:"2:148"},
  {arabic:"قُلْ هُوَ اللَّهُ أَحَدٌ", trans:"Say: He is Allah, One.", ref:"112:1"}
];

const CHALLENGES = [
  "Pray two voluntary raka'ah with sincere dua.",
  "Read 5 verses of the Qur'an and reflect on one lesson.",
  "Say Astaghfirullah 100 times with presence of heart.",
  "Give a small sadaqah to someone in need.",
  "Teach someone a short dua or surah today.",
  "Wake up 30 minutes earlier and use time for dhikr.",
  "Smile and greet 5 people with 'Assalamu Alaikum'.",
  "Help a family member without being asked."
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
  const page = document.getElementById("hadith-display-page");
  const refEl = document.getElementById("hadith-ref");
  const text = `"${h.text}" — ${h.ref}`;
  if(home) home.textContent = text;
  if(page) page.textContent = text;
  if(refEl) refEl.textContent = h.ref || "";
}
function showVerse(v){
  const home = document.getElementById("verse-display");
  const page = document.getElementById("verse-display-page");
  const refEl = document.getElementById("verse-ref");
  const display = v.arabic && v.arabic.trim() ? `${v.arabic}\n\n${v.trans}` : `${v.trans} — ${v.ref}`;
  if(home) home.textContent = display;
  if(page) page.textContent = display;
  if(refEl) refEl.textContent = v.ref || "";
}

/* ---------- lists & load more ---------- */
function populateLists(){
  const hadList = document.getElementById("hadith-list");
  const verList = document.getElementById("verse-list");
  if(hadList){
    hadList.innerHTML = "";
    HADITHS.forEach((h, idx) => {
      const el = document.createElement("div"); el.className="list-card";
      el.innerHTML = `<div class="trans">${h.text}</div><div class="meta small">${h.ref}</div><div style="margin-top:8px"><button class="btn ghost" onclick='openModal(${idx},"hadith")'>View</button></div>`;
      if(idx >= 6) el.style.display = "none";
      hadList.appendChild(el);
    });
  }
  if(verList){
    verList.innerHTML = "";
    VERSES.forEach((v, idx) => {
      const display = v.arabic && v.arabic.trim() ? `${v.arabic} — ${v.trans}` : `${v.trans} — ${v.ref}`;
      const el = document.createElement("div"); el.className="list-card";
      el.innerHTML = `<div class="trans">${display}</div><div class="meta small">${v.ref}</div><div style="margin-top:8px"><button class="btn ghost" onclick='openModal(${idx},"verse")'>View</button></div>`;
      if(idx >= 6) el.style.display = "none";
      verList.appendChild(el);
    });
  }
  const lmHad = document.getElementById("load-more-hadiths");
  if(lmHad) lmHad.onclick = function(){ document.querySelectorAll("#hadith-list .list-card").forEach(el=>el.style.display="block"); lmHad.style.display="none"; }
  const lmVer = document.getElementById("load-more-verses");
  if(lmVer) lmVer.onclick = function(){ document.querySelectorAll("#verse-list .list-card").forEach(el=>el.style.display="block"); lmVer.style.display="none"; }
}

/* ---------- modal ---------- */
function openModal(idx,type){
  const bg = document.getElementById("modal-bg");
  const content = document.getElementById("modal-content");
  let html="";
  if(type==="hadith"){
    const h = HADITHS[idx];
    html = `<div class="trans">${h.text}</div><div class="meta small">${h.ref}</div>`;
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

/* ---------- challenge logic ---------- */
function ensureChallenge(){
  const today = todayKey();
  if(localStorage.getItem("ch_day") === today){
    renderTodayChallenge(); return;
  }
  localStorage.setItem("ch_day", today);
  const chosen = CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)];
  const obj = { id: btoa(chosen).slice(0,12), text: chosen, date: today, done:false, generatedAt:new Date().toISOString() };
  lsSet("today_challenge", obj); renderTodayChallenge();
}
function renderTodayChallenge(){
  const chal = lsGet("today_challenge");
  if(!chal) return;
  document.getElementById("chal-text").textContent = chal.text;
  document.getElementById("chal-meta").textContent = chal.done ? ("Completed: " + (chal.completedAt || "")) : ("Generated: " + new Date(chal.generatedAt).toLocaleString());
  const mark = document.getElementById("mark-done");
  if(chal.done){ mark.disabled=true; mark.textContent="✔ Completed — MashaAllah"; } else { mark.disabled=false; mark.textContent="Mark Done"; }
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
  const candidate = CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)];
  document.getElementById("chal-text").textContent = candidate + " (preview)";
}
window.getAnother = getAnother;
function renderHistory(){
  const wrap = document.getElementById("history-wrap"); if(!wrap) return;
  const history = lsGet("chal_history") || []; if(history.length===0){ wrap.innerHTML="<div class='small'>No completed challenges yet.</div>"; return; }
  wrap.innerHTML=""; history.slice().reverse().forEach(h => {
    const d = document.createElement("div"); d.className="list-card"; d.innerHTML = `<div class="trans">${h.text}</div><div class="meta small">Done: ${new Date(h.completedAt).toLocaleString()}</div>`; wrap.appendChild(d);
  });
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  ensureDaily(); populateLists(); ensureChallenge(); renderHistory();
  const mark = document.getElementById("mark-done"); if(mark) mark.addEventListener("click", markDone);
  const skip = document.getElementById("skip-btn"); if(skip) skip.addEventListener("click", getAnother);
  document.querySelectorAll(".posts img").forEach(img => img.onerror = ()=> { img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640'><rect width='100%25' height='100%25' fill='%23ddd'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%23666'>Instagram</text></svg>"; });
});
