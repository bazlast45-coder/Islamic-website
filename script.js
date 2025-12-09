/* script.js - Daily hadith/verse/challenge + smooth nav + bottom nav behavior
   Theme A - Black & Gold. Instagram feed sample included (replace with your images).
*/

/* ---------- CONFIG & DATA (expand weekly) ---------- */
const IG_HANDLE = "Islamic._._dill";

/* small sample arrays: add more weekly (you can expand to 365 over time) */
const OFFLINE_HADITHS = [
  {arabic:"", trans:"The best among you are those who learn the Qur'an and teach it. — Sahih al-Bukhari", ref:"Sahih al-Bukhari"},
  {arabic:"", trans:"Cleanliness is half of faith. — Sahih Muslim", ref:"Sahih Muslim"},
  {arabic:"", trans:"A smile is charity. — Jami' at-Tirmidhi", ref:"Tirmidhi"}
];

const OFFLINE_VERSES = [
  {arabic:"إِنَّ فِي ذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", trans:"Indeed, in the remembrance of Allah do hearts find rest. (13:28)", ref:"Qur'an 13:28"},
  {arabic:"فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", trans:"Indeed, with hardship comes ease. (94:6)", ref:"Qur'an 94:6"},
  {arabic:"وَمَنْ تَوَكَّلَ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", trans:"And whoever relies upon Allah — then He is sufficient for him. (65:3)", ref:"Qur'an 65:3"}
];

const CHALLENGES = [
  {text:"Pray two raka'ah of voluntary prayer tonight.", evidence:"Voluntary prayers increase closeness to Allah."},
  {text:"Read 5 verses of the Qur'an and reflect on them.", evidence:"Reflection increases guidance."},
  {text:"Say Astaghfirullah 100 times today.", evidence:"Repentance refreshes the heart."}
];

/* small example Instagram image URLs (replace with your own post thumbnail URLs) */
const INSTAGRAM_POSTS = [
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=3a138e0dc4d1fd2018b05b0d8e6d7f43",
  "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=7c4d6b3e0f0c1f8c73a9f8a2a4c9b55e",
  "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=7e0f4bf1e3f41727e2f8e1e2ef0b8f6b"
];

/* ---------- localStorage keys ---------- */
const KEY_DAY = "islamic_site_day_v1";
const KEY_HADITH = "islamic_site_hadith_v1";
const KEY_VERSE = "islamic_site_verse_v1";
const KEY_CHAL = "islamic_site_chal_v1";

/* ---------- small helper utilities ---------- */
function todayKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function save(key,val){ localStorage.setItem(key, JSON.stringify(val)); }
function load(key){ try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; } }

/* ---------- minimal loader on first DOM load (non-blocking) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // hide any old loader quickly (we keep the overlay for short nav animations)
  const floral = document.querySelector(".header-floral");
  if(floral) floral.style.opacity = "0.12";

  const loaderOverlay = document.querySelector(".loader-overlay");
  if(loaderOverlay){
    // give tiny graceful delay for first paint then hide
    setTimeout(() => {
      loaderOverlay.classList.remove("show");
    }, 700);
  }

  // run page-specific populate logic
  runPageInit();
});

/* ---------- small animated overlay when navigating (click icons) ---------- */
function navigateWithBriefAnim(target){
  const overlay = document.querySelector(".loader-overlay");
  if(!overlay) {
    window.location.href = target;
    return;
  }
  overlay.classList.add("show");
  // keep 850ms for smoothness (short)
  setTimeout(() => { window.location.href = target; }, 850);
}

/* attach to global for html onclick attributes */
window.navigateWithBriefAnim = navigateWithBriefAnim;

/* ---------- ensure daily content: pick and lock ---------- */
function ensureDaily(){
  const current = todayKey();
  if(localStorage.getItem(KEY_DAY) === current){
    // already set for today -> display
    const had = load(KEY_HADITH) || OFFLINE_HADITHS[0];
    const ver = load(KEY_VERSE) || OFFLINE_VERSES[0];
    const chal = load(KEY_CHAL) || Object.assign({}, CHALLENGES[0], {done:false});
    displayDailyIfPresent(had, ver, chal);
    return;
  }
  // new day -> choose random and save
  localStorage.setItem(KEY_DAY, current);
  const had = OFFLINE_HADITHS[Math.floor(Math.random()*OFFLINE_HADITHS.length)];
  const ver = OFFLINE_VERSES[Math.floor(Math.random()*OFFLINE_VERSES.length)];
  const chal = Object.assign({}, CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)], {done:false});
  save(KEY_HADITH, had);
  save(KEY_VERSE, ver);
  save(KEY_CHAL, chal);
  displayDailyIfPresent(had, ver, chal);
}

function displayDailyIfPresent(had, ver, chal){
  const ah = document.getElementById("hadith-ar");
  const at = document.getElementById("hadith-trans");
  const ar = document.getElementById("hadith-ref");
  if(ah) ah.textContent = had.arabic || "";
  if(at) at.textContent = had.trans || "";
  if(ar) ar.textContent = had.ref || "";

  const va = document.getElementById("verse-ar");
  const vt = document.getElementById("verse-trans");
  const vr = document.getElementById("verse-ref");
  if(va) va.textContent = ver.arabic || "";
  if(vt) vt.textContent = ver.trans || "";
  if(vr) vr.textContent = ver.ref || "";

  const ct = document.getElementById("chal-text");
  const ce = document.getElementById("chal-evidence");
  const ds = document.getElementById("done-status");
  if(ct) ct.textContent = chal.text || "";
  if(ce) ce.textContent = chal.evidence || "";
  if(ds) ds.textContent = chal.done ? "Yes — MashaAllah 🌙" : "No";
}

/* ---------- mark challenge done ---------- */
function markDone(){
  const chal = load(KEY_CHAL);
  if(!chal) return;
  if(chal.done){
    alert("You have already completed today's challenge. MashaAllah 🌙");
    return;
  }
  chal.done = true;
  save(KEY_CHAL, chal);
  const btn = document.getElementById("mark-done");
  if(btn){ btn.classList.add("done"); btn.textContent = "✔ Well done — MashaAllah 🌙"; btn.disabled = true; }
  const ds = document.getElementById("done-status");
  if(ds) ds.textContent = "Yes — MashaAllah 🌙";
  // small toast-like confirm
  setTimeout(()=> alert("Well done! MashaAllah 🌙"), 80);
}
window.markDone = markDone;

/* ---------- Populate pages: hadiths, verses, challenges, instagram feed ---------- */
function runPageInit(){
  // always ensure daily data on site load
  ensureDaily();

  // populate Instagram feed snapshot (sample images)
  const igWrap = document.getElementById("insta-grid");
  if(igWrap){
    INSTAGRAM_POSTS_LOOP(INSTAGRAM_POSTS_ARRAY(), igWrap);
  }

  // Populate lists on hadiths/verses/challenge pages if present
  const hadListEl = document.getElementById("hadith-list");
  if(hadListEl){
    OFFLINE_HADITHS.forEach(h => {
      const c = document.createElement("div"); c.className = "card fade-in";
      c.innerHTML = `<div class="arabic">${h.arabic || ""}</div><div class="trans">${h.trans}</div><div class="meta">${h.ref || ""}</div>`;
      hadListEl.appendChild(c);
    });
  }

  const verseListEl = document.getElementById("verse-list");
  if(verseListEl){
    OFFLINE_VERSES.forEach(v => {
      const c = document.createElement("div"); c.className = "card fade-in";
      c.innerHTML = `<div class="arabic">${v.arabic || ""}</div><div class="trans">${v.trans}</div><div class="meta">${v.ref || ""}</div>`;
      verseListEl.appendChild(c);
    });
  }

  const chalListEl = document.getElementById("chal-list");
  if(chalListEl){
    CHALLENGES.forEach(cObj => {
      const c = document.createElement("div"); c.className = "card fade-in";
      c.innerHTML = `<div class="trans"><strong>Challenge:</strong> ${cObj.text}</div><div class="trans"><em>Benefit:</em> ${cObj.evidence}</div>`;
      chalListEl.appendChild(c);
    });
  }

  // Make bottom nav active based on path
  const path = window.location.pathname.split("/").pop();
  const navButtons = document.querySelectorAll(".bottom-nav button");
  navButtons.forEach(btn => {
    const target = btn.getAttribute("data-target");
    if(target && target === path) btn.classList.add("active");
  });

  // set instagram handle text if present
  const igHandleEls = document.querySelectorAll(".ig-handle");
  igHandleEls.forEach(e=> e.textContent = "@" + IG_HANDLE);
}

/* ---------- Instagram helper - populate grid ---------- */
function INSTAGRAM_POSTS_ARRAY(){
  // Use INSTAGRAM_POSTS declared above; fallback to sample
  return (typeof INSTAGRAM_POSTS !== "undefined" && Array.isArray(INSTAGRAM_POSTS) && INSTAGRAM_POSTS.length) ? INSTAGRAM_POSTS : [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=3a138e0dc4d1fd2018b05b0d8e6d7f43",
    "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=7c4d6b3e0f0c1f8c73a9f8a2a4c9b55e",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=7e0f4bf1e3f41727e2f8e1e2ef0b8f6b"
  ];
}

function INSTAGRAM_POSTS_LOOP(arr, container){
  container.innerHTML = "";
  arr.slice(0,9).forEach(url=>{
    const a = document.createElement("a");
    a.href = `https://instagram.com/${IG_HANDLE}`;
    a.target = "_blank";
    a.rel = "noopener";
    const img = document.createElement("img");
    img.src = url;
    img.loading = "lazy";
    a.appendChild(img);
    container.appendChild(a);
  });
}

/* ---------- quick helper for index page to open hadiths/verses with animation ---------- */
window.openHadiths = function(){ navigateWithBriefAnim("hadiths.html"); }
window.openVerses = function(){ navigateWithBriefAnim("verses.html"); }
window.openChallenge = function(){ navigateWithBriefAnim("challenge.html"); }
window.openHome = function(){ navigateWithBriefAnim("index.html"); }

/* expose for console debugging if needed */
window.islamicSite = { ensureDaily, load, save };
