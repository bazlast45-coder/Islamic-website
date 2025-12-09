/* robust script.js - ensures daily hadith & verse render and references show */

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
  {text:"The best of you are those best in character.", ref:"Bukhari"}
];

const VERSES = [
  {arabic:"إِنَّ مَعَ الْعُسْرِ يُسْرًا", trans:"Indeed, with hardship comes ease.", ref:"94:6"},
  {arabic:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", trans:"Indeed, Allah is with the patient.", ref:"2:153"},
  {arabic:"فَاذْكُرُونِي أَذْكُرْكُمْ", trans:"So remember Me; I will remember you.", ref:"2:152"},
  {arabic:"وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", trans:"And whoever relies upon Allah — then He is sufficient for him.", ref:"65:3"},
  {arabic:"لَا تُكَلَّفُ نَفْسٌ إِلَّا وُسْعَهَا", trans:"No soul is burdened beyond its capacity.", ref:"2:286"}
];

/* ---------- helpers ---------- */
function todayKey(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function safeSet(key,value){ try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){} }
function safeGet(key){ try{ return JSON.parse(localStorage.getItem(key)); }catch(e){ return null } }

/* ---------- render daily (robust) ---------- */
function ensureDaily(){
  try{
    const today = todayKey();
    const storedDay = safeGet("site_day");
    if(storedDay === today){
      const had = safeGet("hadith_today");
      const ver = safeGet("verse_today");
      if(had) renderHadithBlock(had);
      else { const h=rand(HADITHS); safeSet("hadith_today",h); safeSet("site_day",today); renderHadithBlock(h); }
      if(ver) renderVerseBlock(ver);
      else { const v=rand(VERSES); safeSet("verse_today",v); safeSet("site_day",today); renderVerseBlock(v); }
      return;
    }
    // new day or not stored
    const h = rand(HADITHS);
    const v = rand(VERSES);
    safeSet("hadith_today", h);
    safeSet("verse_today", v);
    safeSet("site_day", today);
    renderHadithBlock(h);
    renderVerseBlock(v);
  }catch(err){
    // fallback: render random ones immediately
    renderHadithBlock(rand(HADITHS));
    renderVerseBlock(rand(VERSES));
  }
}

function renderHadithBlock(h){
  const display = document.getElementById("hadith-display");
  const refEl = document.getElementById("hadith-ref");
  if(display) display.textContent = `"${h.text}"`;
  if(refEl) refEl.textContent = `Reference: ${h.ref || ''}`;
}

function renderVerseBlock(v){
  const display = document.getElementById("verse-display");
  const refEl = document.getElementById("verse-ref");
  if(display){
    if(v.arabic && v.arabic.trim()){
      display.textContent = v.arabic + "\n\n" + v.trans;
    } else {
      display.textContent = v.trans;
    }
  }
  if(refEl) refEl.textContent = v.ref || "";
}

/* ---------- hadiths & verses listing (pages) ---------- */
function populateLists(){
  try{
    const hadList = document.getElementById("hadith-list");
    if(hadList){
      hadList.innerHTML = "";
      HADITHS.forEach((h, idx) => {
        const el = document.createElement("div"); el.className="list-card";
        el.innerHTML = `<div class="trans">${h.text}</div><div class="meta small">${h.ref}</div><div style="margin-top:8px"><button class="btn ghost" onclick='openModal(${idx},"hadith")'>View</button></div>`;
        hadList.appendChild(el);
      });
    }
    const verList = document.getElementById("verse-list");
    if(verList){
      verList.innerHTML = "";
      VERSES.forEach((v, idx) => {
        const display = v.arabic && v.arabic.trim() ? `${v.arabic} — ${v.trans}` : `${v.trans} — ${v.ref}`;
        const el = document.createElement("div"); el.className="list-card";
        el.innerHTML = `<div class="trans">${display}</div><div class="meta small">${v.ref}</div><div style="margin-top:8px"><button class="btn ghost" onclick='openModal(${idx},"verse")'>View</button></div>`;
        verList.appendChild(el);
      });
    }
  }catch(e){}
}

/* ---------- modal ---------- */
function openModal(idx,type){
  const bg = document.getElementById("modal-bg");
  const content = document.getElementById("modal-content");
  if(!bg || !content) return;
  let html = "";
  if(type === "hadith"){
    const h = HADITHS[idx];
    html = `<div class="trans">${h.text}</div><div class="meta small">Reference: ${h.ref}</div>`;
  } else {
    const v = VERSES[idx];
    html = `<div class="arabic">${v.arabic || ""}</div><div class="trans">${v.trans} — ${v.ref}</div>`;
  }
  content.innerHTML = html;
  bg.style.display = "flex";
}
window.openModal = openModal;
function closeModal(e){
  if(e && e.target && e.target.id && e.target.id !== "modal-bg") return;
  const bg = document.getElementById("modal-bg");
  if(bg) bg.style.display = "none";
}
window.closeModal = closeModal;

/* ---------- rotating quote (fills blank space) ---------- */
const QUOTES = [
  "Turn to Allah in small moments — little deeds stack up in front of the Lord.",
  "A heart that is grateful finds light in every difficulty.",
  "Knowledge without action is like a lamp without oil — fuel it with practice.",
  "Speak gently — the softest voice can move the hardest heart.",
  "Sincere intention turns small actions into great reward."
];
function showRotatingQuote(){
  const id = 'home-quote-box';
  if(document.getElementById(id)) return;
  const box = document.createElement('div');
  box.id = id;
  box.className = 'card small';
  box.style.marginTop = '14px';
  box.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
  document.querySelector('.container')?.appendChild(box);
  let i = Math.floor(Math.random()*QUOTES.length);
  box.textContent = '“' + QUOTES[i] + '”';
  setInterval(()=>{ i = (i+1) % QUOTES.length; box.textContent = '“' + QUOTES[i] + '”'; }, 9000);
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  ensureDaily(); populateLists(); showRotatingQuote();

  // fallback for image errors
  document.querySelectorAll('.posts img').forEach(img=>{
    img.onerror = ()=> img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640'><rect width='100%25' height='100%25' fill='%23333'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%23fff'>Instagram</text></svg>";
  });
});
