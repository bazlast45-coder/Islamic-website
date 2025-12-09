// -------------------- Daily Content Setup --------------------
// LocalStorage keys
const TODAY_KEY = 'islamic_today';
const HADITH_KEY = 'islamic_hadith';
const VERSE_KEY = 'islamic_verse';
const CHAL_KEY = 'islamic_chal';

// Sample data (start small, can expand weekly)
const OFFLINE_HADITHS = [
  {arabic:"", trans:"The best among you are those who learn the Qur'an and teach it. — Sahih al‑Bukhari", ref:"Sahih al‑Bukhari 1"},
  {arabic:"", trans:"Cleanliness is half of faith. — Sahih Muslim", ref:"Sahih Muslim 223"},
  {arabic:"", trans:"The best of people are those most beneficial to others. — Hadith", ref:"Al-Mu’jam Al-Awsat 578"}
];

const OFFLINE_VERSES = [
  {arabic:"إِنَّ فِي ذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", trans:"Indeed, in the remembrance of Allah do hearts find rest. (13:28)", ref:"Qur'an 13:28"},
  {arabic:"فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", trans:"Indeed, with hardship comes ease. (94:6)", ref:"Qur'an 94:6"},
  {arabic:"وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِلْعَالَمِينَ", trans:"And We have not sent you, [O Muhammad], except as a mercy to the worlds. (21:107)", ref:"Qur'an 21:107"}
];

const CHALLENGES = [
  {text:"Pray two raka'ah of voluntary prayer tonight.", evidence:"Voluntary prayers increase closeness to Allah."},
  {text:"Read 5 verses of the Qur'an.", evidence:"Reflection increases guidance."},
  {text:"Give charity to someone in need today.", evidence:"Charity purifies wealth and soul."},
  {text:"Make dhikr (remembrance of Allah) 100 times.", evidence:"Dhikr brings tranquility and reward."}
];

// Loader quotes
const LOADER_QUOTES = [
  "“Verily, Allah is with the patient.” — Qur'an 2:153",
  "“The best among you are those who learn the Qur'an and teach it.” — Sahih al-Bukhari",
  "“Cleanliness is half of faith.” — Sahih Muslim"
];

// -------------------- Utilities --------------------
function todayDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function loadSaved(key){ try{ return JSON.parse(localStorage.getItem(key)); } catch(e){ return null; } }
function saveObj(key,obj){ localStorage.setItem(key,JSON.stringify(obj)); }

// -------------------- Display Functions --------------------
function displayHadith(obj){
  document.getElementById('hadith-ar')?.textContent = obj.arabic;
  document.getElementById('hadith-trans')?.textContent = obj.trans;
  document.getElementById('hadith-ref')?.textContent = obj.ref;
}

function displayVerse(obj){
  document.getElementById('verse-ar')?.textContent = obj.arabic;
  document.getElementById('verse-trans')?.textContent = obj.trans;
  document.getElementById('verse-ref')?.textContent = obj.ref;
}

function displayChallenge(obj){
  document.getElementById('chal-text')?.textContent = obj.text;
  document.getElementById('chal-evidence')?.textContent = obj.evidence;
  const statusEl = document.getElementById('done-status');
  if(obj.done) statusEl.textContent = 'Yes — MashaAllah 🌙';
  else statusEl.textContent = 'No';
}

// -------------------- Generate Challenge --------------------
function generateLocalChallenge(){
  const idx = Math.floor(Math.random() * CHALLENGES.length);
  const obj = Object.assign({}, CHALLENGES[idx]);
  obj.done = false;
  return obj;
}

// -------------------- Ensure Daily Content --------------------
function ensureDailyContent(){
  const today = todayDate();
  if(localStorage.getItem(TODAY_KEY) === today){
    displayHadith(loadSaved(HADITH_KEY) || OFFLINE_HADITHS[0]);
    displayVerse(loadSaved(VERSE_KEY) || OFFLINE_VERSES[0]);
    displayChallenge(loadSaved(CHAL_KEY) || generateLocalChallenge());
    return;
  }
  localStorage.setItem(TODAY_KEY, today);
  saveObj(HADITH_KEY, OFFLINE_HADITHS[Math.floor(Math.random() * OFFLINE_HADITHS.length)]);
  saveObj(VERSE_KEY, OFFLINE_VERSES[Math.floor(Math.random() * OFFLINE_VERSES.length)]);
  saveObj(CHAL_KEY, generateLocalChallenge());
  displayHadith(loadSaved(HADITH_KEY));
  displayVerse(loadSaved(VERSE_KEY));
  displayChallenge(loadSaved(CHAL_KEY));
}

// -------------------- Loader --------------------
function loaderScreen(callback){
  const loader = document.getElementById('loader');
  const content = document.getElementById('content');
  if(!loader || !content){callback(); return;}
  let quoteIndex = 0;
  const quoteInterval = setInterval(()=>{
    loader.querySelector('#loader-quote').textContent = LOADER_QUOTES[quoteIndex];
    quoteIndex = (quoteIndex + 1) % LOADER_QUOTES.length;
  }, 3000);
  setTimeout(()=>{
    clearInterval(quoteInterval);
    loader.style.display='none';
    content.style.display='block';
    callback();
  }, 5000); // 5 seconds loader
}

// -------------------- DOMContentLoaded --------------------
document.addEventListener('DOMContentLoaded',()=>{
  loaderScreen(()=>{
    ensureDailyContent();

    const showChalBtn = document.getElementById('show-chal');
    const challengeSection = document.getElementById('challenge');
    const markDoneBtn = document.getElementById('mark-done');

    showChalBtn?.addEventListener('click', ()=>{
      challengeSection.style.display='block';
      displayChallenge(loadSaved(CHAL_KEY));
    });

    markDoneBtn?.addEventListener('click', ()=>{
      const chalObj = loadSaved(CHAL_KEY);
      if(!chalObj.done){
        chalObj.done = true;
        saveObj(CHAL_KEY, chalObj);
        displayChallenge(chalObj);
        alert('Well done! MashaAllah 🌙');
      } else {
        alert('You have already completed today’s challenge. MashaAllah 🌙');
      }
    });

    const chalObj = loadSaved(CHAL_KEY);
    if(chalObj && chalObj.done){
      document.getElementById('done-status').textContent = 'Yes — MashaAllah 🌙';
    }
  });
});
