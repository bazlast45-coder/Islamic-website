/* script.js
   - expanded hadiths & verses (~40 each)
   - daily locking behavior unchanged
   - "Get Another" preview limited to 5 per day (preview_count)
   - rotating quotes displayed on home to fill space
   - modal + lists + challenge history as before
*/

/* ------------ DATA: hadiths (40-ish) ------------ */
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
  {text:"Feed the hungry.", ref:"Sahih Bukhari"},
  {text:"The best among you are those who learn the Qur'an and teach it.", ref:"Bukhari"},
  {text:"He who does not show mercy will not be shown mercy.", ref:"Bukhari & Muslim"},
  {text:"Modesty is part of faith.", ref:"Bukhari & Muslim"},
  {text:"The one who looks after an orphan and myself will be together in Paradise like this (and he pointed to his two fingers).", ref:"Bukhari"},
  {text:"Be conscious of Allah wherever you are.", ref:"Tirmidhi"},
  {text:"Speak good or remain silent.", ref:"Bukhari & Muslim"},
  {text:"Lower your gaze.", ref:"Quranic guidance (prophetic emphasis)"},
  {text:"Protect your tongue; it is a small organ but causes much good and much evil.", ref:"Ibn al-Jawzi"},
  {text:"Visit the graves to remember death.", ref:"Muslim"},
  {text:"Help your brother whether he is an oppressor or oppressed.", ref:"(contextual hadith)"},
  {text:"Verily, Allah loves that when anyone of you does a job he should perfect it.", ref:"Al-Bayhaqi"},
  {text:"The best charity is that given in Ramadan.", ref:"Tirmidhi"},
  {text:"Whoever relieves a believer’s distress, Allah will relieve his distress on the Day of Resurrection.", ref:"Muslim"},
  {text:"The best of you are those who are best in character.", ref:"Bukhari"},
  {text:"Do not waste water even if you perform ablution on the banks of a fast-flowing river.", ref:"Ibn Majah"},
  {text:"The believer is not a fault-finder nor a curser nor abusive.", ref:"Ibn Hibban"},
  {text:"Pray as if it is your last prayer.", ref:"(General reminder)"},
  {text:"Allah does not look at your forms and possessions, but He looks at your hearts and deeds.", ref:"Muslim"},
  {text:"The best of people are those most beneficial to people.", ref:"Daraqutni"},
  {text:"Give glad tidings and do not repel people.", ref:"Muslim"},
  {text:"Act with sincerity for the sake of Allah.", ref:"(general)"},
  {text:"When a man dies his deeds come to an end except for three: ongoing charity, beneficial knowledge, and a righteous child who prays for him.", ref:"Muslim"},
  {text:"Do not be angry.", ref:"Bukhari"},
  {text:"Spend on your family and be moderate.", ref:"Bukhari"},
  {text:"Allah forgives those who seek forgiveness sincerely.", ref:"Quranic theme / prophetic emphasis"},
  {text:"Maintain ties of kinship.", ref:"Bukhari & Muslim"}
];

/* ------------ DATA: verses (~40) ------------ */
const VERSES = [
  {arabic:"إِنَّ مَعَ الْعُسْرِ يُسْرًا", trans:"Indeed, with hardship comes ease.", ref:"94:6"},
  {arabic:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", trans:"Indeed, Allah is with the patient.", ref:"2:153"},
  {arabic:"فَاذْكُرُونِي أَذْكُرْكُمْ", trans:"So remember Me; I will remember you.", ref:"2:152"},
  {arabic:"وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", trans:"And whoever relies upon Allah — then He is sufficient for him.", ref:"65:3"},
  {arabic:"لَا تُكَلَّفُ نَفْسٌ إِلَّا وُسْعَهَا", trans:"No soul is burdened beyond its capacity.", ref:"2:286"},
  {arabic:"إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ", trans:"The believers are but brothers.", ref:"49:10"},
  {arabic:"قُلْ هُوَ اللَّهُ أَحَدٌ", trans:"Say: He is Allah, One.", ref:"112:1"},
  {arabic:"إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", trans:"Actions are (judged) by intentions (principle).", ref:"Hadith principle / Quranic reinforcement"},
  {arabic:"ادْعُونِي أَسْتَجِبْ لَكُمْ", trans:"Call upon Me; I will respond to you.", ref:"40:60"},
  {arabic:"وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", trans:"My success is only by Allah.", ref:"11:88"},
  {arabic:"بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", trans:"In the name of Allah, the Most Merciful, the Most Compassionate.", ref:"Opening invocation"},
  {arabic:"وَإِنَّكَ لَعَلَى خُلُقٍ عَظِيمٍ", trans:"And indeed, you are of a great moral character.", ref:"68:4"},
  {arabic:"إِنَّ اللَّهَ لا يُغَيِّرُ مَا بِقَوْمٍ", trans:"Indeed, Allah will not change the condition of a people until they change what is in themselves.", ref:"13:11"},
  {arabic:"فَاسْتَبِقُوا الْخَيْرَاتِ", trans:"So race to goodness.", ref:"2:148"},
  {arabic:"إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", trans:"Indeed, Allah loves the doers of good.", ref:"2:195"},
  {arabic:"وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", trans:"Seek help through patience and prayer.", ref:"2:45"},
  {arabic:"ادْعُوا رَبَّكُمْ تَضَرُّعًا وَخُفْيَةً", trans:"Call upon your Lord with humility and in private.", ref:"7:55"},
  {arabic:"اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا", trans:"Fear Allah and speak words of appropriate justice.", ref:"33:70"},
  {arabic:"لَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ", trans:"Do not despair of the mercy of Allah.", ref:"39:53"},
  {arabic:"إِنَّ اللَّهَ مَعَ الْمُتَّقِينَ", trans:"Indeed, Allah is with the righteous.", ref:"16:128"},
  {arabic:"وَعَسَى أَنْ تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ", trans:"Perhaps you hate a thing and it is good for you.", ref:"2:216"},
  {arabic:"فَإِنْ تَابُوا وَأَقَامُوا الصَّلَاةَ", trans:"If they repent and establish prayer...", ref:"(repentance theme)"},
  {arabic:"وَمَنْ عَمِلَ صَالِحًا فَلِنَفْسِهِ", trans:"Whoever does righteousness, it is for his soul.", ref:"41:46"},
  {arabic:"يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ", trans:"O you who have believed, fear Allah.", ref:"2:282 (general exhortation)"},
  {arabic:"وَاعْبُدْ رَبَّكَ حَتَّى يَأْتِيَكَ الْيَقِينُ", trans:"And worship your Lord until there comes to you the certainty (death).", ref:"15:99"},
  {arabic:"وَاقْصِدْ فِي مَشْيِكَ", trans:"Be moderate in your pace (metaphor to be moderate).", ref:"31:19"},
  {arabic:"وَخُلِقَ الْإِنسَانُ ضَعِيفًا", trans:"And man was created weak.", ref:"4:28"},
  {arabic:"قُلْ هُوَ اللَّهُ أَحَدٌ", trans:"Say: He is Allah, One.", ref:"112"},
  {arabic:"إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", trans:"Indeed, We have given you abundance.", ref:"108:1"},
  {arabic:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", trans:"Indeed, Allah is with the patient.", ref:"2:153"},
  {arabic:"يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمْ", trans:"O mankind, fear your Lord.", ref:"4:1"},
  {arabic:"ادْعُونِي أَسْتَجِبْ لَكُمْ", trans:"Call upon Me; I will respond.", ref:"40:60"},
  {arabic:"إِنَّ مَعَ الْعُسْرِ يُسْرًا", trans:"Indeed, with hardship comes ease.", ref:"94:5-6"},
  {arabic:"قُلِ اللَّهُ ثُمَّ صَدِّقْ بِهِ", trans:"Affirm belief and act upon it.", ref:"(general)"},
  {arabic:"وَتَعَاوَنُوا عَلَى الْبِرِّ", trans:"And cooperate in righteousness.", ref:"5:2"},
  {arabic:"وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ", trans:"And We made from water every living thing.", ref:"21:30"},
  {arabic:"الصَّلَاةُ نُورٌ", trans:"Prayer is light.", ref:"(prophetic emphasis)"}
];

/* ------------ CHALLENGES (templates) ------------ */
const CHALLENGES = [
  "Give charity quietly to a person in need.",
  "Read 5 verses of Quran with reflection.",
  "Perform two extra voluntary raka'ah today.",
  "Teach someone a short dua you know.",
  "Visit or call an elder and ask how they are.",
  "Fast a voluntary day with sincere intention.",
  "Help someone carry a load or a task.",
  "Give sincere praise to your parents today.",
  "Recite Surah Al-Kahf or part of it and reflect.",
  "Spend 15 minutes in silent dhikr with focus.",
  "Share a short beneficial reminder with a friend.",
  "Volunteer to clean or help a community spot.",
  "Invite someone to a positive gathering.",
  "Make sincere dua for someone who wronged you.",
  "Write down three things you’re grateful for and thank Allah.",
  "Give dates or water to someone fasting.",
  "Memorize a short dua and practice it.",
  "Donate a small amount to a cause you trust.",
  "Smile and greet five people with sincere warmth.",
  "Help someone with study or work for 30 minutes."
];

/* ------------ QUOTES to fill space (rotating) ------------ */
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

/* ---------- lists & load-more ---------- */
function populateLists(){
  const hadList = document.getElementById("hadith-list");
  const verList = document.getElementById("verse-list");
  if(hadList){
    hadList.innerHTML = "";
    HADITHS.forEach((h, idx) => {
      const el = document.createElement("div"); el.className="list-card";
      el.innerHTML = `<div class="trans">${h.text}</div><div class="meta small">${h.ref}</div><div style="margin-top:8px"><button class="btn ghost" onclick='openModal(${idx},"hadith")'>View</button></div>`;
      if(idx >= 8) el.style.display = "none"; // show first 8, load more reveals rest
      hadList.appendChild(el);
    });
  }
  if(verList){
    verList.innerHTML = "";
    VERSES.forEach((v, idx) => {
      const display = v.arabic && v.arabic.trim() ? `${v.arabic} — ${v.trans}` : `${v.trans} — ${v.ref}`;
      const el = document.createElement("div"); el.className="list-card";
      el.innerHTML = `<div class="trans">${display}</div><div class="meta small">${v.ref}</div><div style="margin-top:8px"><button class="btn ghost" onclick='openModal(${idx},"verse")'>View</button></div>`;
      if(idx >= 8) el.style.display = "none";
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

/* ---------- CHALLENGE logic: daily + preview limit ---------- */
function ensureChallenge(){
  const today = todayKey();
  if(localStorage.getItem("ch_day") === today){
    renderTodayChallenge(); renderPreviewCount(); return;
  }
  localStorage.setItem("ch_day", today);
  const chosen = CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)];
  const obj = { id: btoa(chosen).slice(0,12), text: chosen, date: today, done:false, generatedAt:new Date().toISOString() };
  lsSet("today_challenge", obj);
  // reset preview counter for the new day
  lsSet("preview_count", { day: today, count: 0 });
  renderTodayChallenge(); renderPreviewCount();
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

/* Get Another (preview-only) but limited to 5 per day */
function getAnother(){
  const today = todayKey();
  let pc = lsGet("preview_count") || { day: today, count: 0 };
  if(pc.day !== today){ pc = { day: today, count: 0 }; }
  if(pc.count >= 5){
    // disable button and inform user
    const skipBtn = document.getElementById("skip-btn");
    if(skipBtn){ skipBtn.disabled = true; skipBtn.textContent = "Previews used"; }
    alert("You have used 5 previews today. Come back tomorrow for a new challenge. 🌙");
    return;
  }
  const candidate = CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)];
  document.getElementById("chal-text").textContent = candidate + " (preview)";
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

/* ---------- history ---------- */
function renderHistory(){
  const wrap = document.getElementById("history-wrap");
  if(!wrap) return;
  const history = lsGet("chal_history") || [];
  if(history.length === 0){ wrap.innerHTML = "<div class='small'>No completed challenges yet.</div>"; return; }
  wrap.innerHTML = "";
  history.slice().reverse().forEach(h => {
    const d = document.createElement("div"); d.className="list-card"; d.innerHTML = `<div class="trans">${h.text}</div><div class="meta small">Done: ${new Date(h.completedAt).toLocaleString()}</div>`; wrap.appendChild(d);
  });
}

/* ---------- rotate a quote on the home page to fill blank space ---------- */
function showRotatingQuote(){
  const quoteBoxId = 'home-quote-box';
  let box = document.getElementById(quoteBoxId);
  if(!box){
    box = document.createElement('div');
    box.id = quoteBoxId;
    box.style.marginTop = '18px';
    box.style.padding = '10px 12px';
    box.style.borderRadius = '10px';
    box.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
    box.style.border = '1px solid rgba(255,255,255,0.03)';
    box.className = 'small';
    const main = document.querySelector('.container');
    if(main) main.appendChild(box);
  }
  let idx = Number(localStorage.getItem('quote_idx') || 0);
  box.textContent = "“" + QUOTES[idx % QUOTES.length] + "”";
  idx += 1;
  localStorage.setItem('quote_idx', idx);
  // rotate every 8 seconds while on page
  setInterval(()=> {
    let i = Number(localStorage.getItem('quote_idx') || 0);
    const el = document.getElementById(quoteBoxId);
    if(el){ el.textContent = "“" + QUOTES[i % QUOTES.length] + "”"; i += 1; localStorage.setItem('quote_idx', i); }
  }, 8000);
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  ensureDaily();
  populateLists();
  ensureChallenge();
  renderHistory();
  renderPreviewCount();
  showRotatingQuote();

  const mark = document.getElementById("mark-done"); if(mark) mark.addEventListener("click", markDone);
  const skip = document.getElementById("skip-btn"); if(skip) skip.addEventListener("click", getAnother);

  // image fallback (keeps thumbnails present)
  document.querySelectorAll(".posts img").forEach(img => img.onerror = ()=> {
    img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640'><rect width='100%25' height='100%25' fill='%23333'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%23fff'>Instagram</text></svg>";
  });
});
