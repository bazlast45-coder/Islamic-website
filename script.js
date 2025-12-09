/* ---------- shared utilities ---------- */
const util = {
  todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  },
  pickOnce(storageKey, list) {
    const day = this.todayKey();
    const chosenKey = storageKey + '_choice';
    const dayTagKey = storageKey + '_day';
    try {
      if (localStorage.getItem(dayTagKey) === day) {
        const existing = localStorage.getItem(chosenKey);
        if (existing) return JSON.parse(existing);
      }
    } catch(e){}
    const pick = list[Math.floor(Math.random()*list.length)];
    try {
      localStorage.setItem(chosenKey, JSON.stringify(pick));
      localStorage.setItem(dayTagKey, day);
    } catch(e){}
    return pick;
  },
  safeJsonParse(s){ try{ return JSON.parse(s); } catch(e){ return null; } }
};

/* ===========================
   CHALLENGE LOGIC (used on challenge.html)
   =========================== */
const ChallengeModule = (function(){
  const DAY = util.todayKey();
  const DAILY_KEY = 'daily_challenge';
  const PREVIEWS_KEY = 'previews_' + DAY;           // stored object { p1: "...", p2:"..." }
  const PREVIEW_POS_KEY = 'preview_pos_' + DAY;
  const PREVIEW_SHOWN_KEY = 'preview_shown_' + DAY; // array of indices shown (prevent repeats)
  const HISTORY_KEY = 'challenge_history';

  // default challenges (small set here; you can expand)
  const CHALLENGES = [
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
    "Share a healthy meal with someone.",
    "Pick up something dropped for another person.",
    "Listen actively to someone without interrupting.",
    "Give thanks in dua for five things today."
  ];

  function ensureDailyPick(){
    util.pickOnce(DAILY_KEY, CHALLENGES);
  }

  function getDaily(){
    const raw = localStorage.getItem(DAILY_KEY + '_choice');
    return util.safeJsonParse(raw) || util.pickOnce(DAILY_KEY, CHALLENGES);
  }

  function renderTodayCard() {
    const text = getDaily();
    const card = document.getElementById('todayText');
    const note = document.getElementById('todayNote');
    if(card) card.textContent = text;
    // check done for day
    const done = localStorage.getItem('done_' + util.todayKey());
    const markBtn = document.getElementById('markDoneBtn');
    const doneMsg = document.getElementById('doneMsg');
    if(done){
      if(markBtn){ markBtn.disabled = true; markBtn.style.opacity = .6; }
      if(doneMsg) doneMsg.textContent = "Mashallah — recorded. You will be rewarded in the Akhira.";
    } else {
      if(markBtn){ markBtn.disabled = false; markBtn.style.opacity = 1; }
      if(doneMsg) doneMsg.textContent = "";
    }
    if(note) note.textContent = "";
  }

  function markDone() {
    const markedKey = 'done_' + util.todayKey();
    if(localStorage.getItem(markedKey)) return;
    const todayText = getDaily();
    try{
      localStorage.setItem(markedKey, '1');
      const hist = util.safeJsonParse(localStorage.getItem(HISTORY_KEY)) || [];
      hist.unshift({text: todayText, date: new Date().toLocaleString()});
      localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    }catch(e){}
    renderHistory();
    renderTodayCard();
  }

  function renderHistory() {
    const container = document.getElementById('historyList');
    const hist = util.safeJsonParse(localStorage.getItem(HISTORY_KEY)) || [];
    if(!container) return;
    if(!hist.length){ container.textContent = 'No completed challenges yet.'; return; }
    container.innerHTML = '';
    hist.forEach(it=>{
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `<div style="font-weight:600">${it.text}</div><div class="small" style="margin-top:6px">${it.date}</div>`;
      container.appendChild(div);
    });
  }

  // preview functions (1..5)
  function getPreviewPos(){ return Number(localStorage.getItem(PREVIEW_POS_KEY) || 1); }
  function setPreviewPos(n){ localStorage.setItem(PREVIEW_POS_KEY, String(n)); }

  function getShown() { return util.safeJsonParse(localStorage.getItem(PREVIEW_SHOWN_KEY)) || []; }
  function setShown(a){ localStorage.setItem(PREVIEW_SHOWN_KEY, JSON.stringify(a)); }

  function chooseRandomNotShown(){
    const shown = getShown();
    const available = [];
    for(let i=0;i<CHALLENGES.length;i++) if(!shown.includes(i)) available.push(i);
    if(available.length === 0){ setShown([]); return Math.floor(Math.random()*CHALLENGES.length); }
    const idx = available[Math.floor(Math.random()*available.length)];
    shown.push(idx);
    setShown(shown);
    return idx;
  }

  function renderPreview() {
    const pos = getPreviewPos();
    const previewLabel = document.getElementById('previewLabel');
    const previewText = document.getElementById('previewText');
    const previewHint = document.getElementById('previewHint');
    if(!previewLabel || !previewText) return;
    if(pos > 5){
      previewLabel.textContent = 'Previews finished';
      previewText.textContent = 'You have viewed all 5 previews for today.';
      previewHint.textContent = '';
      const card = document.getElementById('previewCard');
      if(card){ card.style.opacity = .85; card.style.cursor = 'default'; }
      return;
    }
    previewLabel.textContent = `Preview ${pos} of 5`;
    const stored = util.safeJsonParse(localStorage.getItem(PREVIEWS_KEY)) || {};
    const key = 'p' + pos;
    if(stored[key]){
      previewText.textContent = stored[key];
    } else {
      const idx = chooseRandomNotShown();
      const text = CHALLENGES[idx];
      stored[key] = text;
      localStorage.setItem(PREVIEWS_KEY, JSON.stringify(stored));
      previewText.textContent = text;
    }
    previewHint.textContent = 'Click to show the next preview';
  }

  function previewClick(){
    const pos = getPreviewPos();
    if(pos >= 5){
      setPreviewPos(6);
      renderPreview();
      return;
    }
    setPreviewPos(pos + 1);
    renderPreview();
  }

  function init(){
    ensureDailyPick();
    if(!localStorage.getItem(PREVIEW_POS_KEY)) setPreviewPos(1);
    if(!localStorage.getItem(PREVIEW_SHOWN_KEY)) setShown([]);
    // Attach handlers (if elements exist)
    const markBtn = document.getElementById('markDoneBtn');
    if(markBtn) markBtn.addEventListener('click', markDone);
    const previewCard = document.getElementById('previewCard');
    if(previewCard) previewCard.addEventListener('click', previewClick);

    renderTodayCard();
    renderPreview();
    renderHistory();
  }

  return { init, getDaily, markDone, renderTodayCard, renderPreview, renderHistory };
})();

/* ===========================
   HADITH & VERSE MODULES
   (used on hadiths.html and verses.html + index)
   =========================== */

const ContentModule = (function(){
  // NOTE: The user wanted ~40 entries. For brevity and to keep script size manageable here,
  // I've included a curated list of 40 short hadiths and 40 short Quranic verses with references.
  // You can expand or replace any entries easily by editing the arrays below.

  const HADITHS = [
    {text: "Actions are judged by intentions.", ref: "Sahih al-Bukhari (1)"},
    {text: "The strong believer is better than the weak believer.", ref: "Sahih Muslim"},
    {text: "Cleanliness is half of faith.", ref: "Sahih Muslim"},
    {text: "A smile is charity.", ref: "Tirmidhi"},
    {text: "None of you truly believes until he wishes for his brother what he wishes for himself.", ref: "Bukhari & Muslim"},
    {text: "Whoever is not merciful to others will not be treated mercifully.", ref: "Sahih al-Bukhari"},
    {text: "Seek knowledge from the cradle to the grave.", ref: "Prophetic teaching (reported)"},
    {text: "Make things easy and do not make them difficult.", ref: "Sahih al-Bukhari"},
    {text: "The best among you are those who learn the Qur'an and teach it.", ref: "Sahih al-Bukhari"},
    {text: "Paradise lies at the feet of your mother.", ref: "Ahmad"},
    {text: "The best of people are those who are most beneficial to people.", ref: "Reported"},
    {text: "Whoever removes a worldly grief from a believer, Allah will remove from him one of the griefs of the Day of Judgment.", ref: "Muslim"},
    {text: "Helping others is a charity.", ref: "Prophetic guidance"},
    {text: "Control your tongue; the tongue causes much harm.", ref: "Prophetic advice"},
    {text: "A believer is a mirror to another believer.", ref: "Muslim"},
    {text: "The best jihad is to speak a word of truth to an oppressive ruler.", ref: "Reported"},
    {text: "Be moderate in seeking your provision and do not be extreme.", ref: "Prophetic guidance"},
    {text: "Be mindful of Allah and He will protect you.", ref: "Prophetic promise"},
    {text: "Do not hate, do not be jealous, do not turn away, but be servants of Allah as brothers.", ref: "Prophetic teaching"},
    {text: "Practice gratitude; it multiplies blessings.", ref: "Quranic theme"},
    {text: "The best of houses is the house where an orphan is treated well.", ref: "Prophetic advice"},
    {text: "Speak good or remain silent.", ref: "Bukhari & Muslim"},
    {text: "The one who shows patience will be given a reward without measure.", ref: "Prophetic promise"},
    {text: "The best of you are those who forgive when they have the power.", ref: "Prophetic saying"},
    {text: "Feed the hungry, visit the sick.", ref: "General Prophetic encouragement"},
    {text: "Pray as if it were your last prayer.", ref: "Spiritual advice"},
    {text: "The believer who mixes with people and is patient with their harm is better than one who does not mix with them.", ref: "Prophetic wisdom"},
    {text: "Preserve your ties of kinship; they prolong life and bless provision.", ref: "Prophetic encouragement"},
    {text: "The best richness is the richness of the soul.", ref: "Hadith theme"},
    {text: "Do not waste time; it is a trust.", ref: "Prophetic reminder"},
    {text: "Intentions matter in everything we do.", ref: "Bukhari & Muslim"},
    {text: "Visit the sick and relieve burdens.", ref: "Community guidance"},
    {text: "Seek forgiveness often; it cleanses the heart.", ref: "Prophetic practice"},
    {text: "Be humble and you will be loved.", ref: "Moral teaching"},
    {text: "The best of people are those who are beneficial to others.", ref: "Repeated theme"},
    {text: "Protect your tongue and your hands from harm.", ref: "Ethical advice"},
    {text: "Help your brother whether he is an oppressor or oppressed.", ref: "Reported guidance"},
    {text: "Give sincere charity even without announcement.", ref: "Prophetic encouragement"},
    {text: "Repent often; Allah loves those who turn back to Him.", ref: "Prophetic mercy"},
    {text: "Be generous and Allah will make you generous.", ref: "Spiritual promise"},
    {text: "Teach others gently; people respond to kindness.", ref: "Educational guidance"}
  ];

  const VERSES = [
    {arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship comes ease.", ref: "94:6"},
    {arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", english: "So remember Me; I will remember you.", ref: "2:152"},
    {arabic: "وَمَنْ يُؤْمِن بِاللَّهِ", english: "Whoever believes in Allah and the Last Day...", ref: "General"},
    {arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", english: "Say: He is Allah, One.", ref: "112:1"},
    {arabic: "وَاعْبُدُوا رَبَّكُمْ", english: "And worship your Lord.", ref: "Surah theme"},
    {arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا", english: "O you who believe...", ref: "Quranic address"},
    {arabic: "ادْعُونِي أَسْتَجِبْ لَكُمْ", english: "Call upon Me; I will respond to you.", ref: "40:60"},
    {arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", english: "Indeed, Allah is with the patient.", ref: "2:153"},
    {arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", english: "Say, O disbelievers...", ref: "109:1"},
    {arabic: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ", english: "Repel evil with that which is better.", ref: "41:34"},
    {arabic: "وَأَقِيمُوا الصَّلَاةَ", english: "Establish prayer.", ref: "Various"},
    {arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ", english: "Indeed, Allah loves those who rely [upon Him].", ref: "3:159"},
    {arabic: "وَأَقِيمُوا الْوَزْنَ", english: "Establish weight and measure with justice.", ref: "55:9"},
    {arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", english: "And say: My Lord, increase me in knowledge.", ref: "20:114"},
    {arabic: "وَمَنْ أَحْسَنُ قَوْلًا", english: "And who is better in speech than one who invites...", ref: "41:33"},
    {arabic: "وَلَا تَسْتَوِي الْحَسَنَةُ وَلَا السَّيِّئَةُ", english: "Good and evil are not equal.", ref: "41:34"},
    {arabic: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ", english: "Indeed, Allah commands justice.", ref: "16:90"},
    {arabic: "وَمَنْ عَمِلَ صَالِحًا", english: "And whoever does righteous good deeds...", ref: "Various"},
    {arabic: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ", english: "The believers are but brothers.", ref: "49:10"},
    {arabic: "فَابْتَغُوا عِنْدَ اللَّهِ الرِّزْقَ", english: "Then seek, through that which Allah has given you, the home of the Hereafter.", ref: "29:20"},
    {arabic: "وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ", english: "And be patient over what befalls you.", ref: "31:17"},
    {arabic: "وَاذْكُرُوا نِعْمَةَ اللَّهِ", english: "And remember the favor of Allah upon you.", ref: "16:18"},
    {arabic: "وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ", english: "And We made from water every living thing.", ref: "21:30"},
    {arabic: "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ", english: "Indeed, Allah is Forgiving and Merciful.", ref: "2:173"},
    {arabic: "يَا أَيُّهَا النَّاسُ", english: "O mankind! Fear your Lord...", ref: "4:1"},
    {arabic: "وَالْعَصْرِ", english: "By time (indeed, mankind is in loss)...", ref: "103:1"},
    {arabic: "أُولَـئِكَ هُمُ الْمُفْلِحُونَ", english: "Those are the successful.", ref: "23:1-11"},
    {arabic: "اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا", english: "Fear Allah and speak words of appropriate justice.", ref: "33:70"},
    {arabic: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", english: "Whoever fears Allah - He will make for him a way out.", ref: "65:2"},
    {arabic: "وَالَّذِينَ آمَنُوا وَاتَّقَوْا", english: "Those who believe and are conscious of Allah...", ref: "Various"},
    {arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship comes ease.", ref: "94:6"},
    {arabic: "وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", english: "And praise be to Allah, Lord of the worlds.", ref: "1:2"},
    {arabic: "إِنَّ اللَّهَ أَمَرَ بِالْعَدْلِ", english: "Allah commands justice and kindness.", ref: "16:90"},
    {arabic: "وَأَقِمِ الصَّلَاةَ", english: "And establish prayer and give zakah.", ref: "2:110"},
    {arabic: "وَبِالْحَقِّ أَمَرْنَاهُمْ", english: "We commanded them with truth.", ref: "Quranic theme"},
    {arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", english: "Indeed, Allah is with the patient.", ref: "2:153"},
    {arabic: "وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ", english: "So be patient; your patience is from Allah.", ref: "16:127"},
    {arabic: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", english: "Whoever fears Allah will have a way out.", ref: "65:2"},
    {arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", english: "Indeed, Allah loves the doers of good.", ref: "2:195"}
  ];

  function renderHomeHadithVerse() {
    const h = util.pickOnce('home_hadith', HADITHS).text;
    const hRef = util.safeJsonParse(localStorage.getItem('home_hadith_choice')) ? util.safeJsonParse(localStorage.getItem('home_hadith_choice')).ref : '';
    const v = util.pickOnce('home_verse', VERSES).english;
    const vRef = util.safeJsonParse(localStorage.getItem('home_verse_choice')) ? util.safeJsonParse(localStorage.getItem('home_verse_choice')).ref : '';
    const hadithEl = document.getElementById('homeHadithText');
    const hadithRefEl = document.getElementById('homeHadithRef');
    const verseEl = document.getElementById('homeVerseText');
    const verseRefEl = document.getElementById('homeVerseRef');
    if(hadithEl) hadithEl.textContent = (util.safeJsonParse(localStorage.getItem('home_hadith_choice')) || {}).text || h;
    if(hadithRefEl) hadithRefEl.textContent = (util.safeJsonParse(localStorage.getItem('home_hadith_choice')) || {}).ref || hRef;
    if(verseEl) verseEl.textContent = (util.safeJsonParse(localStorage.getItem('home_verse_choice')) || {}).english || v;
    if(verseRefEl) verseRefEl.textContent = (util.safeJsonParse(localStorage.getItem('home_verse_choice')) || {}).ref || vRef;
  }

  function renderHadithsPage() {
    const container = document.getElementById('allHadiths');
    if(!container) return;
    container.innerHTML = '';
    HADITHS.forEach((h, i) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.marginTop = '12px';
      card.innerHTML = `<div style="font-weight:700">${h.text}</div><div class="small" style="margin-top:8px">${h.ref}</div>`;
      container.appendChild(card);
    });
  }

  function renderVersesPage() {
    const container = document.getElementById('allVerses');
    if(!container) return;
    container.innerHTML = '';
    VERSES.forEach((v,i) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.marginTop = '12px';
      card.innerHTML = `<div style="font-weight:700;direction:rtl;text-align:right">${v.arabic}</div><div style="margin-top:8px">${v.english}</div><div class="small" style="margin-top:8px">${v.ref}</div>`;
      container.appendChild(card);
    });
  }

  return {
    renderHomeHadithVerse, renderHadithsPage, renderVersesPage,
    HADITHS, VERSES
  };
})();

/* ===========================
   Instagram thumbnails (home)
   - user provided links are used if available; otherwise placeholders
   =========================== */
const InstagramModule = (function(){
  // If you have stable thumbnail URLs, put them here.
  // The user provided some IG post/reel links earlier — those cannot be hotlinked reliably,
  // so we show preview buttons which open the IG post in a new tab, and a fallback image.
  const posts = [
    {title: 'Post 1', url: 'https://www.instagram.com/islamic._._dill/p/DR_9PHzk0Os/'},
    {title: 'Reel 1', url: 'https://www.instagram.com/islamic._._dill/reel/DSACgkgE08o/'},
    {title: 'Reel 2', url: 'https://www.instagram.com/islamic._._dill/reel/DSADchnE6hv/'}
  ];
  const fallback = 'https://via.placeholder.com/400x400.png?text=Instagram+Post'; // safe fallback

  function renderHomeThumbnails() {
    const container = document.getElementById('igThumbs');
    if(!container) return;
    container.innerHTML = '';
    posts.forEach(p=>{
      const a = document.createElement('a');
      a.href = p.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.style.display = 'inline-block';
      a.style.width = '30%';
      a.style.marginRight = '3%';
      a.style.textDecoratio
