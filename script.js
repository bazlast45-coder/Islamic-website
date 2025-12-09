/* ---------- script.js — unified site logic ---------- */
/* Put this file in repo root and commit. Works with the index.html provided. */

/* ---------- Utilities ---------- */
const util = {
  todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  },
  safeParse(s) {
    try { return JSON.parse(s); } catch(e) { return null; }
  },
  pickOncePerDay(list, storageBase) {
    const day = this.todayKey();
    const dayKey = `${storageBase}_day`;
    const dataKey = `${storageBase}_data`;
    if(localStorage.getItem(dayKey) === day) {
      const raw = localStorage.getItem(dataKey);
      if(raw) return this.safeParse(raw);
    }
    // pick random
    const pick = list[Math.floor(Math.random()*list.length)];
    try {
      localStorage.setItem(dataKey, JSON.stringify(pick));
      localStorage.setItem(dayKey, day);
    } catch(e){}
    return pick;
  },
  setPerDayValue(key, value) {
    try {
      localStorage.setItem(key + '_' + this.todayKey(), JSON.stringify(value));
    } catch(e){}
  },
  getPerDayValue(key) {
    return this.safeParse(localStorage.getItem(key + '_' + this.todayKey()));
  }
};

/* ---------- Data sets (expandable) ---------- */

/* 40 hadith-like entries (short text + reference) */
const HADITHS_LIST = [
  {text:"Actions are judged by intentions.", ref:"Sahih al-Bukhari"},
  {text:"The best among you are those who learn the Qur'an and teach it.", ref:"Sahih al-Bukhari"},
  {text:"Cleanliness is half of faith.", ref:"Sahih Muslim"},
  {text:"A smile is charity.", ref:"Tirmidhi"},
  {text:"None of you truly believes until he wishes for his brother what he wishes for himself.", ref:"Bukhari & Muslim"},
  {text:"The strong believer is better than the weak believer.", ref:"Sahih Muslim"},
  {text:"Speak good or remain silent.", ref:"Bukhari & Muslim"},
  {text:"The best of you are those who are best to their families.", ref:"Tirmidhi"},
  {text:"Paradise lies at the feet of your mother.", ref:"Ahmad"},
  {text:"Visit the sick and free captives.", ref:"Sahih Bukhari"},
  {text:"Help one another in goodness and piety.", ref:"Quranic principle"},
  {text:"Lower your gaze.", ref:"Prophetic guidance"},
  {text:"Be merciful to others and you will be shown mercy.", ref:"Bukhari & Muslim"},
  {text:"Give charity even from what you love.", ref:"Prophetic encouragement"},
  {text:"Make things easy, not difficult.", ref:"Sahih al-Bukhari"},
  {text:"Protect your tongue from harm.", ref:"Scholarly advice"},
  {text:"Visit the graves to remember death.", ref:"Sahih Muslim"},
  {text:"Help your brother whether he is oppressor or oppressed.", ref:"Prophetic guidance"},
  {text:"The best jihad is to speak a word of truth to an oppressive ruler.", ref:"Reported"},
  {text:"Be moderate in spending and avoid extravagance.", ref:"Prophetic advice"},
  {text:"Seek knowledge from cradle to grave.", ref:"Prophetic encouragement (reported)"},
  {text:"Be just; justice is nearest to piety.", ref:"Quranic principle"},
  {text:"Be patient; there is reward without measure.", ref:"Prophetic promise"},
  {text:"The best charity is that given in Ramadan.", ref:"Tirmidhi"},
  {text:"Do not slander, curse or speak obscenely.", ref:"Sahih Muslim"},
  {text:"Pray as if it were your last prayer.", ref:"Spiritual advice"},
  {text:"Keep ties of kinship; they bring blessing.", ref:"Prophetic encouragement"},
  {text:"Repel evil with that which is best.", ref:"Quran 41:34 (theme)"},
  {text:"Speak truth even if it is bitter.", ref:"Ethical guidance"},
  {text:"Give to relatives first when giving charity.", ref:"Sunan Abu Dawud"},
  {text:"Remember death frequently; it softens the heart.", ref:"Sahih Muslim"},
  {text:"Be humble; humility is part of faith.", ref:"Prophetic teaching"},
  {text:"Teach others gently; people respond to kindness.", ref:"Educational advice"},
  {text:"The best richness is the richness of the soul.", ref:"Hadith theme"},
  {text:"Avoid jealousy and hatred.", ref:"Prophetic guidance"},
  {text:"Pray on time and with feeling.", ref:"Prophetic practice"},
  {text:"Seek forgiveness frequently; it cleanses the heart.", ref:"Bukhari & Muslim"},
  {text:"Do good quietly when possible.", ref:"Ethical counsel"},
  {text:"Be truthful; truth leads to righteousness.", ref:"Bukhari & Muslim"}
];

/* 40 short Quranic verse entries with translation and reference */
const VERSES_LIST = [
  {arabic:"إِنَّ مَعَ الْعُسْرِ يُسْرًا", english:"Indeed, with hardship comes ease.", ref:"94:6"},
  {arabic:"فَاذْكُرُونِي أَذْكُرْكُمْ", english:"So remember Me; I will remember you.", ref:"2:152"},
  {arabic:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", english:"Indeed, Allah is with the patient.", ref:"2:153"},
  {arabic:"ادْعُونِي أَسْتَجِبْ لَكُمْ", english:"Call upon Me; I will respond to you.", ref:"40:60"},
  {arabic:"قُلْ هُوَ اللَّهُ أَحَدٌ", english:"Say: He is Allah, [who is] One.", ref:"112:1"},
  {arabic:"وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", english:"Whoever relies upon Allah — He is sufficient.", ref:"65:3"},
  {arabic:"لَا تُكَلَّفُ نَفْسٌ إِلَّا وُسْعَهَا", english:"No soul is burdened beyond its capacity.", ref:"2:286"},
  {arabic:"إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ", english:"The believers are but brothers.", ref:"49:10"},
  {arabic:"ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ", english:"Repel [evil] with that which is best.", ref:"41:34"},
  {arabic:"وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ", english:"Do [as you will]; Allah will see.", ref:"9:105"},
  {arabic:"وَمَا تُقَدِّمُوا لِأَنفُسِكُمْ", english:"Whatever good you send before you...", ref:"2:110"},
  {arabic:"قُلْ رَبِّ زِدْنِي عِلْمًا", english:"My Lord, increase me in knowledge.", ref:"20:114"},
  {arabic:"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", english:"By the remembrance of Allah hearts are assured.", ref:"13:28"},
  {arabic:"يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ", english:"O you who believe, fear Allah.", ref:"4:1"},
  {arabic:"وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", english:"Seek help through patience and prayer.", ref:"2:45"},
  {arabic:"وَمَنْ يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", english:"Whoever fears Allah — He will make a way out.", ref:"65:2"},
  {arabic:"فَسَيَكْفِيكَهُمُ اللَّهُ", english:"Allah will suffice you against them.", ref:"9:40"},
  {arabic:"وَأَقِمِ الصَّلَاةَ لِذِكْرِي", english:"Establish prayer for My remembrance.", ref:"20:14"},
  {arabic:"إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوْا", english:"Allah is with those who are righteous.", ref:"16:128"},
  {arabic:"إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ", english:"Allah will not change a people's condition...", ref:"13:11"},
  {arabic:"وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", english:"My success is only by Allah.", ref:"11:88 (theme)"},
  {arabic:"إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", english:"Allah loves the doers of good.", ref:"2:195"},
  {arabic:"وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ", english:"I created jinn and mankind to worship Me.", ref:"51:56"},
  {arabic:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", english:"Allah is with the patient.", ref:"8:46"},
  {arabic:"قُلْ يَا أَيُّهَا الْكَافِرُونَ", english:"Say, O disbelievers...", ref:"109:1"},
  {arabic:"أُولَـئِكَ هُمُ الْمُفْلِحُونَ", english:"Those are the successful.", ref:"23:1-11"},
  {arabic:"وَاعْبُدْ رَبَّكَ حَتَّىٰ يَأْتِيَكَ الْيَقِينُ", english:"Worship your Lord until certainty (death).", ref:"15:99"},
  {arabic:"ادْعُو رَبَّكَ بِالْخَوْفِ وَالْجُنْدِ", english:"Call upon your Lord with humility.", ref:"(theme)"},
  {arabic:"وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ", english:"We sent you only as a mercy to the worlds.", ref:"21:107"},
  {arabic:"إِنَّ هَذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ", english:"This Quran guides to what is most right.", ref:"17:9"},
  {arabic:"وَاتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا", english:"Fear Allah and speak words of justice.", ref:"33:70"},
  {arabic:"وَاسْتَغْفِرُوا رَبَّكُمْ", english:"Ask forgiveness from your Lord.", ref:"71:10"}
];

/* ---------- Challenge list (you can expand to 365 later) ---------- */
const CHALLENGES_LIST = [
  "Send a kind message to a family member.",
  "Avoid backbiting for the whole day.",
  "Give sincere praise to someone today.",
  "Read one page of Qur'an tonight with reflection.",
  "Perform two extra voluntary rak'ahs today.",
  "Help someone with a small task without being asked.",
  "Make sincere dua for someone who needs it.",
  "Give a small sadaqah today, even a little.",
  "Make wudu and pray on time intentionally.",
  "Spend 10 minutes learning a short hadith and apply it.",
  "Call your parents simply to ask about their well-being.",
  "Smile and compliment at least three people.",
  "Plan and complete one household task with patience.",
  "Recite salawat 20 times during the day.",
  "Avoid wasting time on social media for 2 hours.",
  "Read and reflect on one verse of the Qur'an.",
  "Fast a recommended fast (if able) or do extra dhikr.",
  "Help clean a shared space or pick up litter.",
  "Teach a short reminder to someone.",
  "Visit or call someone who may be lonely.",
  "Spend five minutes in quiet reflection and gratitude.",
  "Donate clothes you don't use to someone in need.",
  "Give someone food or drink when they need it.",
  "Help a neighbor with a small task.",
  "Pray two rak'ahs with full concentration tonight."
];

/* ---------- Thumbnail fallback helper ---------- */
function attachThumbnailFallbacks() {
  try {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
      img.addEventListener('error', () => {
        // fallback placeholder small data-uri SVG
        img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect fill="%230a0a0a" width="100%" height="100%"/><text x="50%" y="50%" font-size="28" fill="%23cfcfcf" font-family="Arial" text-anchor="middle" alignment-baseline="middle">Image</text></svg>';
      });
    });
  } catch(e){}
}

/* ---------- Renderers ---------- */

function renderIndexHadithVerse() {
  const hadith = util.pickOncePerDay(HADITHS_LIST, 'home_hadith');
  const verse = util.pickOncePerDay(VERSES_LIST, 'home_verse');
  const hdEl = document.getElementById('dailyHadith');
  const hrEl = document.getElementById('hadithRef');
  const vdEl = document.getElementById('dailyVerse');
  const vrEl = document.getElementById('verseRef');
  if(hdEl) hdEl.textContent = hadith.text || (hadith.arabic || hadith);
  if(hrEl) hrEl.textContent = hadith.ref || '';
  if(vdEl) {
    vdEl.textContent = (verse.arabic ? verse.arabic + ' — ' : '') + (verse.english || verse.trans || verse.text || '');
  }
  if(vrEl) vrEl.textContent = verse.ref || '';
}

/* ---------- Hadiths page rendering (all entries) ---------- */
function renderHadithsPage() {
  const container = document.getElementById('allHadiths');
  if(!container) return;
  container.innerHTML = '';
  HADITHS_LIST.forEach(h => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginTop = '10px';
    card.innerHTML = `<div style="font-weight:700">${h.text}</div><div class="meta">${h.ref}</div>`;
    container.appendChild(card);
  });
}

/* ---------- Verses page rendering ---------- */
function renderVersesPage() {
  const container = document.getElementById('allVerses');
  if(!container) return;
  container.innerHTML = '';
  VERSES_LIST.forEach(v => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginTop = '10px';
    card.innerHTML = `<div style="font-size:18px;direction:rtl;text-align:right">${v.arabic}</div><div style="margin-top:8px">${v.english}</div><div class="meta">${v.ref}</div>`;
    container.appendChild(card);
  });
}

/* ---------- Challenge module (one preview box that cycles 1..5) ---------- */
const ChallengeModule = (function(){
  const DAY = util.todayKey();
  const DAILY_KEY = 'daily_challenge_choice'; // stores today's main challenge object text (persist with day tag)
  const DAILY_DAY_TAG = 'daily_challenge_day';
  const PREVIEWS_KEY_PREFIX = 'previews_for_'; // + DAY -> stored map { p1: text, p2: text ...}
  const PREVIEW_POS_KEY = 'preview_pos_for_'; // + DAY -> number 1..6
  const HISTORY_KEY = 'challenge_history';

  function ensureDailyPick() {
    // pick and store today's challenge
    if(localStorage.getItem(DAILY_DAY_TAG) !== DAY) {
      const pick = CHALLENGES_LIST[Math.floor(Math.random()*CHALLENGES_LIST.length)];
      localStorage.setItem(DAILY_KEY, JSON.stringify(pick));
      localStorage.setItem(DAILY_DAY_TAG, DAY);
    }
  }

  function getDaily() {
    try {
      const raw = localStorage.getItem(DAILY_KEY);
      return util.safeParse(raw) || raw;
    } catch(e) { return null; }
  }

  function renderDailyCard() {
    const elText = document.getElementById('todayText');
    const elNote = document.getElementById('todayNote');
    const doneMsg = document.getElementById('doneMsg');
    const markBtn = document.getElementById('markDoneBtn');
    const today = getDaily();
    if(elText) elText.textContent = today || 'No challenge available.';
    // check if already marked today
    const markedKey = 'done_' + DAY;
    if(localStorage.getItem(markedKey)) {
      if(markBtn){ markBtn.disabled = true; markBtn.style.opacity = .6; }
      if(doneMsg) doneMsg.textContent = 'Mashallah — recorded. You will be rewarded in the Akhira.';
    } else {
      if(markBtn){ markBtn.disabled = false; markBtn.style.opacity = 1; }
      if(doneMsg) doneMsg.textContent = '';
    }
    if(elNote) elNote.textContent = '';
  }

  function getPreviewPos() {
    return Number(localStorage.getItem(PREVIEW_POS_KEY + DAY) || 1);
  }
  function setPreviewPos(n) {
    localStorage.setItem(PREVIEW_POS_KEY + DAY, String(n));
  }
  function getPreviewsMap() {
    return util.safeParse(localStorage.getItem(PREVIEWS_KEY_PREFIX + DAY)) || {};
  }
  function setPreviewsMap(m) {
    localStorage.setItem(PREVIEWS_KEY_PREFIX + DAY, JSON.stringify(m));
  }
  function getShownIndices() {
    return util.safeParse(localStorage.getItem('preview_shown_' + DAY)) || [];
  }
  function setShownIndices(arr) {
    localStorage.setItem('preview_shown_' + DAY, JSON.stringify(arr));
  }

  function chooseRandomNotShown() {
    const shown = getShownIndices();
    const available = [];
    for(let i=0;i<CHALLENGES_LIST.length;i++) if(!shown.includes(i)) available.push(i);
    if(available.length === 0){ setShownIndices([]); return Math.floor(Math.random()*CHALLENGES_LIST.length); }
    const idx = available[Math.floor(Math.random()*available.length)];
    shown.push(idx);
    setShownIndices(shown);
    return idx;
  }

  function renderPreviewCard() {
    const pos = getPreviewPos();
    const label = document.getElementById('previewLabel');
    const text = document.getElementById('previewText');
    const hint = document.getElementById('previewHint');
    const card = document.getElementById('previewCard');
    if(!label || !text) return;
    if(pos > 5) {
      label.textContent = 'Previews finished';
      text.textContent = 'You have viewed all 5 previews for today.';
      hint.textContent = '';
      if(card){ card.style.opacity = .85; card.style.cursor = 'default'; }
      return;
    }
    label.textContent = `Preview ${pos} of 5`;
    // check if stored for this pos
    const stored = getPreviewsMap();
    if(stored['p' + pos]) {
      text.textContent = stored['p' + pos];
    } else {
      const idx = chooseRandomNotShown();
      const ptext = CHALLENGES_LIST[idx];
      stored['p' + pos] = ptext;
      setPreviewsMap(stored);
      text.textContent = ptext;
    }
    hint.textContent = 'Click preview to show next (max 5)';
    if(card){ card.style.opacity = 1; card.style.cursor = 'pointer'; }
  }

  function previewClickHandler() {
    let pos = getPreviewPos();
    if(pos >= 5) {
      setPreviewPos(6);
      renderPreviewCard();
      return;
    }
    setPreviewPos(pos + 1);
    renderPreviewCard();
  }

  function markDoneHandler() {
    const markedKey = 'done_' + DAY;
    if(localStorage.getItem(markedKey)) return;
    const today = getDaily();
    const hist = util.safeParse(localStorage.getItem(HISTORY_KEY)) || [];
    hist.unshift({text: today, date: new Date().toLocaleString()});
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    localStorage.setItem(markedKey, '1');
    renderHistory();
    renderDailyCard();
  }

  function renderHistory() {
    const container = document.getElementById('historyList');
    if(!container) return;
    const hist = util.safeParse(localStorage.getItem(HISTORY_KEY)) || [];
    if(!hist.length) {
      container.textContent = 'No completed challenges yet.';
      return;
    }
    container.innerHTML = '';
    hist.forEach(item => {
      const d = document.createElement('div');
      d.className = 'history-item card';
      d.style.marginTop = '10px';
      d.innerHTML = `<div style="font-weight:600">${item.text}</div><div class="meta" style="margin-top:6px">${item.date}</div>`;
      container.appendChild(d);
    });
  }

  function init() {
    // ensure daily pick exists
    ensureDailyPick();
    // ensure preview pos set
    if(!localStorage.getItem(PREVIEW_POS_KEY + DAY)) localStorage.setItem(PREVIEW_POS_KEY + DAY, '1');
    if(!localStorage.getItem('preview_shown_' + DAY)) setShownIndices([]);
    // attach handlers
    const previewCard = document.getElementById('previewCard');
    if(previewCard) previewCard.addEventListener('click', previewClickHandler);
    const markBtn = document.getElementById('markDoneBtn');
    if(markBtn) markBtn.addEventListener('click', markDoneHandler);
    // render
    renderDailyCard();
    renderPreviewCard();
    renderHistory();
  }

  return { init, renderDailyCard, renderPreviewCard, renderHistory };
})();

/* ---------- Page init on DOM load ---------- */
document.addEventListener('DOMContentLoaded', function() {
  // Thumbnail fallback
  attachThumbnailFallbacks();

  // Index page hadith & verse
  if(document.getElementById('dailyHadith') || document.getElementById('dailyVerse')) {
    renderIndexHadithVerse();
  }

  // If hadiths page exists (element with id 'allHadiths'), render the full list
  if(document.getElementById('allHadiths')) {
    renderHadithsPage();
  }

  // If verses page exists (element with id 'allVerses'), render the full list
  if(document.getElementById('allVerses')) {
    renderVersesPage();
  }

  // If challenge page presence detected by element id 'todayText' and 'previewCard', init challenge module
  if(document.getElementById('todayText') && document.getElementById('previewCard')) {
    ChallengeModule.init();
  }

  // Small: ensure links that open Instagram open in new tab
  try {
    document.querySelectorAll('a[href*="instagram.com"]').forEach(a => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });
  } catch(e){}
});
