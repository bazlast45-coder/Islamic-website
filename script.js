/* script.js - Daily locked random content (per visitor) */

// Keys
const TODAY_KEY = 'aj_today_date_v3';
const HADITH_KEY = 'aj_today_hadith_v3';
const VERSE_KEY  = 'aj_today_verse_v3';
const CHAL_KEY   = 'aj_today_chal_v3';

// Fallback local data (a large set to avoid frequent repeats).
// I included a meaningful list — you can expand to 365 easily by adding more entries.
const OFFLINE_VERSES = [
  {arabic:"إِنَّ فِي ذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", trans:"Indeed, in the remembrance of Allah do hearts find rest. (13:28)", ref:"Qur'an 13:28"},
  {arabic:"فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", trans:"Indeed, with hardship comes ease. (94:6)", ref:"Qur'an 94:6"},
  {arabic:"وَمَنْ تَوَكَّلَ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", trans:"And whoever relies upon Allah — then He is sufficient for him. (65:3)", ref:"Qur'an 65:3"},
  {arabic:"قُلْ يَا أَيُّهَا الْكَافِرُونَ", trans:"Say, 'O disbelievers.' (112:1)", ref:"Qur'an 112"},
  {arabic:"قُلْ هُوَ اللَّهُ أَحَدٌ", trans:"Say: He is Allah, One. (112:1)", ref:"Qur'an 112"}
  // add more to expand
];

const OFFLINE_HADITHS = [
  {arabic:"", trans:"The best among you are those who learn the Qur'an and teach it. — Sahih al-Bukhari", ref:"Sahih al-Bukhari"},
  {arabic:"", trans:"Allah does not look at your appearance or wealth, but He looks at your hearts and deeds. — Muslim", ref:"Sahih Muslim"},
  {arabic:"", trans:"Whoever guides someone to goodness will have a reward like one who did it. — Muslim", ref:"Sahih Muslim"},
  {arabic:"", trans:"The best of you are those best to their families. — Tirmidhi", ref:"Tirmidhi"},
  {arabic:"", trans:"Cleanliness is half of faith. — Muslim", ref:"Sahih Muslim"}
  // add more to expand
];

const CHALLENGES = [
  {text:"Pray two raka'ah of voluntary prayer tonight and make sincere dua.", evidence:"Voluntary prayers increase closeness to Allah."},
  {text:"Read 5 verses of the Qur'an and reflect on them.", evidence:"Reflection increases guidance."},
  {text:"Say Astaghfirullah 100 times today.", evidence:"Repentance refreshes the heart."},
  {text:"Give a small charity to someone in need.", evidence:"Charity purifies wealth and gives reward."},
  {text:"Learn one of the 99 names of Allah and memorize its meaning.", evidence:"Knowing the names increases awareness."},
  {text:"Avoid backbiting for the entire day.", evidence:"Guarding the tongue is beloved."},
  {text:"Send salam to three people today and smile genuinely.", evidence:"Small acts of kindness are beloved."},
  {text:"Recite Surah Al-Ikhlas three times this morning.", evidence:"Short surahs bring reward if recited sincerely."},
  {text:"Help a family member with a task without being asked.", evidence:"Helping others is charity."},
  {text:"Make dua for another person and ask them to make dua for you.", evidence:"Mutual dua strengthens community."}
  // expand to 365 if desired
];

// DOM
const loader = document.getElementById('loader');
const hadithAr = document.getElementById('hadith-ar');
const hadithTrans = document.getElementById('hadith-trans');
const hadithRef = document.getElementById('hadith-ref');

const verseAr = document.getElementById('verse-ar');
const verseTrans = document.getElementById('verse-trans');
const verseRef = document.getElementById('verse-ref');

const chalDay = document.getElementById('challenge-day');
const chalText = document.getElementById('challenge-text');
const chalEvidence = document.getElementById('challenge-evidence');
const generateBtn = document.getElementById('generate-btn');
const markDoneBtn = document.getElementById('mark-done');
const doneStatus = document.getElementById('done-status');

const gregDateNode = document.getElementById('greg-date');
const hijriDateNode = document.getElementById('hijri-date');

// Helper: today yyyy-mm-dd (local)
function todayDate(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${dd}`;
}

// Hijri conversion (algorithmic approximation, good for display)
// Source: simple tabular algorithm (approximate). Good for showing Hijri date; for precise religious observances consult official calendar.
function gregorianToHijri(gDate){
  // gDate is Date object
  // algorithm from "Umm al-Qura" approximations (astronomical variations ignored)
  const jd = (gDate / 86400000) + 2440587.5; // convert ms to Julian date
  const islamicEpoch = 1948439.5; // Julian date of Islamic epoch
  const days = Math.floor(jd - islamicEpoch);
  const hijriYear = Math.floor((30 * days + 10646) / 10631);
  const firstDayOfYear = Math.floor(29.5 * ( (hijriYear-1) * 354 + Math.floor((3 + (11 * hijriYear)) / 30) ));
  const dayOfYear = days - firstDayOfYear + 1;
  // approximate month/day
  const hijriMonth = Math.min(12, Math.ceil(dayOfYear / 29.5));
  const hijriDay = Math.max(1, Math.round(dayOfYear - (29.5 * (hijriMonth - 1))));
  return {year:hijriYear, month:hijriMonth, day:hijriDay};
}

function displayDates(){
  const now = new Date();
  const g = now.toLocaleDateString(undefined, {weekday:'long', year:'numeric', month:'long', day:'numeric'});
  gregDateNode.textContent = g;
  const h = gregorianToHijri(now);
  hijriDateNode.textContent = `Hijri: ${h.day}/${h.month}/${h.year}`;
}

// Local storage helpers
function loadSaved(key){ try { return JSON.parse(localStorage.getItem(key)); } catch(e){ return null; } }
function saveObj(key,obj){ localStorage.setItem(key, JSON.stringify(obj)); }

// Display functions
function displayHadith(obj){
  hadithAr.textContent = obj.arabic || "";
  hadithTrans.textContent = obj.trans || "";
  hadithRef.textContent = obj.ref || "";
}
function displayVerse(obj){
  verseAr.textContent = obj.arabic || "";
  verseTrans.textContent = obj.trans || "";
  verseRef.textContent = obj.ref || "";
}
function displayChallenge(obj){
  chalDay.textContent = obj.day ? `Day ${obj.day}` : 'Today';
  chalText.textContent = obj.text || '';
  chalEvidence.textContent = obj.evidence || '';
  doneStatus.textContent = obj.done ? 'Yes' : 'No';
}

// Fetch verse from API (alquran.cloud)
async function fetchVerseAPI(){
  try {
    const r = await fetch('https://api.alquran.cloud/v1/ayah/random');
    if(!r.ok) throw new Error('verse fetch failed');
    const j = await r.json();
    if(j && j.data){
      const d = j.data;
      return {arabic: d.text || "", trans: d.translation || d.text || "", ref: `Qur'an ${d.surah.englishName}:${d.numberInSurah}`};
    }
  } catch(e){
    console.warn('Verse API fail', e);
    return null;
  }
}

// Fetch hadith from public endpoint (might fail); fallbacks are used
async function fetchHadithAPI(){
  const attempts = [
    'https://api.hadith.sutanlab.id/hadiths/random'
  ];
  for(const url of attempts){
    try {
      const r = await fetch(url);
      if(!r.ok) throw new Error('bad');
      const j = await r.json();
      if(j && j.data){
        // sutanlab returns .data.id, .data.arab, .data.id (indonesian) etc
        return {
          arabic: j.data.arab || "",
          trans: j.data.id || j.data.en || j.data.text || "",
          ref: j.data.hadith || j.data.book || "Hadith"
        };
      }
    } catch(err){
      console.warn('Hadith API attempt failed', url, err);
      // continue
    }
  }
  return null;
}

// generate local random challenge
function generateLocalChallenge(){
  const idx = Math.floor(Math.random()*CHALLENGES.length);
  const base = CHALLENGES[idx];
  const obj = Object.assign({}, base);
  // generate a "day number" for display (not required to be unique)
  obj.day = Math.floor(Math.random()*365) + 1;
  obj.done = false;
  return obj;
}

// Main: ensure the visitor has content saved for today; if not, create & save
async function ensureDailyContent(){
  displayDates();
  const today = todayDate();
  const savedDate = localStorage.getItem(TODAY_KEY);

  if(savedDate === today){
    // load saved and display
    const sh = loadSaved(HADITH_KEY);
    const sv = loadSaved(VERSE_KEY);
    const sc = loadSaved(CHAL_KEY);
    displayHadith(sh || OFFLINE_HADITHS[0]);
    displayVerse(sv || OFFLINE_VERSES[0]);
    displayChallenge(sc || generateLocalChallenge());
    hideLoader();
    return;
  }

  // new day: try to fetch verse & hadith, fallback if fail
  let verse = await fetchVerseAPI();
  if(!verse) verse = OFFLINE_VERSES[Math.floor(Math.random()*OFFLINE_VERSES.length)];

  let hadith = await fetchHadithAPI();
  if(!hadith) hadith = OFFLINE_HADITHS[Math.floor(Math.random()*OFFLINE_HADITHS.length)];

  let challenge = generateLocalChallenge();

  // save
  localStorage.setItem(TODAY_KEY, today);
  saveObj(HADITH_KEY, hadith);
  saveObj(VERSE_KEY, verse);
  saveObj(CHAL_KEY, challenge);

  // display
  displayHadith(hadith);
  displayVerse(verse);
  displayChallenge(challenge);

  hideLoader();
}

// UI handlers
generateBtn.addEventListener('click', () => {
  const saved = loadSaved(CHAL_KEY);
  if(saved){
    displayChallenge(saved);
    return;
  }
  const newc = generateLocalChallenge();
  saveObj(CHAL_KEY, newc);
  localStorage.setItem(TODAY_KEY, todayDate());
  displayChallenge(newc);
});

markDoneBtn.addEventListener('click', () => {
  const sc = loadSaved(CHAL_KEY);
  if(!sc){ alert('Generate the challenge first.'); return; }
  sc.done = true;
  saveObj(CHAL_KEY, sc);
  displayChallenge(sc);
  alert('MashaAllah — marked done for today.');
});

// loader
function hideLoader(){ if(loader) loader.style.display='none'; }

// init
document.addEventListener('DOMContentLoaded', () => {
  ensureDailyContent();
  // hide loader after a max of 3s if something blocks
  setTimeout(hideLoader, 3000);
});
