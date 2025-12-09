// Keys for daily locking
const TODAY_KEY = 'islamic_today';
const HADITH_KEY = 'islamic_hadith';
const VERSE_KEY = 'islamic_verse';
const CHAL_KEY = 'islamic_chal';

// Sample data
const OFFLINE_HADITHS = [
  {arabic:"", trans:"The best among you are those who learn the Qur'an and teach it. — Sahih al-Bukhari", ref:"Sahih al-Bukhari"},
  {arabic:"", trans:"Cleanliness is half of faith. — Sahih Muslim", ref:"Sahih Muslim"}
];

const OFFLINE_VERSES = [
  {arabic:"إِنَّ فِي ذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", trans:"Indeed, in the remembrance of Allah do hearts find rest. (13:28)", ref:"Qur'an 13:28"},
  {arabic:"فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", trans:"Indeed, with hardship comes ease. (94:6)", ref:"Qur'an 94:6"}
];

const CHALLENGES = [
  {text:"Pray two raka'ah of voluntary prayer tonight.", evidence:"Voluntary prayers increase closeness to Allah."},
  {text:"Read 5 verses of the Qur'an.", evidence:"Reflection increases guidance."}
];

// DOM Elements
const hadithAr = document.getElementById('hadith-ar');
const hadithTrans = document.getElementById('hadith-trans');
const hadithRef = document.getElementById('hadith-ref');

const verseAr = document.getElementById('verse-ar');
const verseTrans = document.getElementById('verse-trans');
const verseRef = document.getElementById('verse-ref');

const chalText = document.getElementById('chal-text');
const chalEvidence = document.getElementById('chal-evidence');
const challengeBlock = document.getElementById('challenge');
const showChalBtn = document.getElementById('show-chal');
const markDoneBtn = document.getElementById('mark-done');
const doneStatus = document.getElementById('done-status');

function todayDate(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function loadSaved(key){try{return JSON.parse(localStorage.getItem(key));}catch(e){return null;}}
function saveObj(key,obj){localStorage.setItem(key,JSON.stringify(obj));}

function displayHadith(obj){hadithAr.textContent=obj.arabic; hadithTrans.textContent=obj.trans; hadithRef.textContent=obj.ref;}
function displayVerse(obj){verseAr.textContent=obj.arabic; verseTrans.textContent=obj.trans; verseRef.textContent=obj.ref;}
function displayChallenge(obj){chalText.textContent=obj.text; chalEvidence.textContent=obj.evidence; doneStatus.textContent=obj.done?'Yes':'No';}

function generateLocalChallenge(){const idx=Math.floor(Math.random()*CHALLENGES.length); const obj=Object.assign({}, CHALLENGES[idx]); obj.done=false; return obj;}

function ensureDailyContent(){
  const today = todayDate();
  if(localStorage.getItem(TODAY_KEY)===today){
    displayHadith(loadSaved(HADITH_KEY) || OFFLINE_HADITHS[0]);
    displayVerse(loadSaved(VERSE_KEY) || OFFLINE_VERSES[0]);
    displayChallenge(loadSaved(CHAL_KEY) || generateLocalChallenge());
    return;
  }
  localStorage.setItem(TODAY_KEY,today);
  saveObj(HADITH_KEY, OFFLINE_HADITHS[Math.floor(Math.random()*OFFLINE_HADITHS.length)]);
  saveObj(VERSE_KEY, OFFLINE_VERSES[Math.floor(Math.random()*OFFLINE_VERSES.length)]);
  saveObj(CHAL_KEY, generateLocalChallenge());
  displayHadith(loadSaved(HADITH_KEY));
  displayVerse(loadSaved(VERSE_KEY));
}

showChalBtn.addEventListener('click', ()=>{
  challengeBlock.style.display = 'block';
  displayChallenge(loadSaved(CHAL_KEY));
});

markDoneBtn.addEventListener('click', ()=>{
  const sc = loadSaved(CHAL_KEY);
  sc.done = true;
  saveObj(CHAL_KEY, sc);
  displayChallenge(sc);
  alert('MashaAllah — marked done for today.');
});

document.addEventListener('DOMContentLoaded', ()=>{
  ensureDailyContent();
});
