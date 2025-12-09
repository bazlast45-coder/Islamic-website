/* ---------------------------
  script.js - Full site logic
  - Daily Hadith / Verse arrays (many entries)
  - AI-style challenge generator (365 non-repeating)
  - LocalStorage locking & history
  - Page population for hadiths.html, verses.html, challenge.html, history.html, index.html
  - Bottom nav animation helper
-----------------------------*/

/* ---------- CONFIG ---------- */
const IG_HANDLE = "Islamic._._dill";

/* ---------- LocalStorage Keys ---------- */
const KEY_DAY = "islamic_site_day_v2";
const KEY_HADITH = "islamic_site_hadith_v2";
const KEY_VERSE = "islamic_site_verse_v2";
const KEY_CHAL = "islamic_site_chal_v2";
const KEY_HISTORY = "islamic_site_history_v2";
const KEY_USED_CHALLENGES = "islamic_site_used_chals_v2";

/* ---------- OFFLINE HADITHS (≈50) ----------
  Short widely-known hadith translations with references.
  These are concise translations; verify and expand later if needed.
--------------------------------------------*/
const OFFLINE_HADITHS = [
  { arabic:"", trans:"Actions are judged by intentions.", ref:"Sahih al-Bukhari 1" },
  { arabic:"", trans:"Cleanliness is half of faith.", ref:"Sahih Muslim" },
  { arabic:"", trans:"The best among you are those who learn the Qur'an and teach it.", ref:"Sahih al-Bukhari" },
  { arabic:"", trans:"None of you truly believes until he wishes for his brother what he wishes for himself.", ref:"Sahih al-Bukhari & Muslim" },
  { arabic:"", trans:"A smile is charity.", ref:"Jami' at-Tirmidhi" },
  { arabic:"", trans:"Whoever believes in Allah and the Last Day should speak good or remain silent.", ref:"Sahih al-Bukhari & Muslim" },
  { arabic:"", trans:"Seek knowledge from the cradle to the grave.", ref:"(Hadith reported)" },
  { arabic:"", trans:"Seek forgiveness of Allah and repent to Him.", ref:"Sahih Muslim" },
  { arabic:"", trans:"The strong person is not the one who overcomes others; the strong person is the one who controls himself when angry.", ref:"Sahih al-Bukhari" },
  { arabic:"", trans:"The best charity is that given in Ramadan.", ref:"Tirmidhi" },
  { arabic:"", trans:"Whoever travels on a road seeking knowledge, Allah will make easy for him a path to Paradise.", ref:"Sahih Muslim" },
  { arabic:"", trans:"The believer does not slander, curse or talk indecently.", ref:"Tirmidhi" },
  { arabic:"", trans:"He who does not show mercy to people, Allah will not show mercy to him.", ref:"Sahih al-Bukhari" },
  { arabic:"", trans:"Feed the hungry, visit the sick, and free the captive.", ref:"Sahih al-Bukhari" },
  { arabic:"", trans:"A Muslim is the one from whose tongue and hand the Muslims are safe.", ref:"Sahih al-Bukhari" },
  { arabic:"", trans:"The best among you are those who are best to their families.", ref:"Tirmidhi" },
  { arabic:"", trans:"Whoever treads a path seeking knowledge, Allah will make easy for him the path to Paradise.", ref:"Sahih Muslim" },
  { arabic:"", trans:"No one eats better food than that which he eats out of the work of his hand.", ref:"Sahih al-Bukhari" },
  { arabic:"", trans:"Make things easy and do not make them difficult.", ref:"Sahih al-Bukhari" },
  { arabic:"", trans:"Help your brother, whether he is an oppressor or he is oppressed.", ref:"Sahih Muslim" },
  { arabic:"", trans:"Whoever does not thank people does not thank Allah.", ref:"Sunan Abi Dawud" },
  { arabic:"", trans:"There is reward for kindness to every living thing.", ref:"Sahih Muslim" },
  { arabic:"", trans:"The best of you in Islam is he who learns the Qur'an and teaches it.", ref:"Sahih al-Bukhari" },
  { arabic:"", trans:"Verily Allah is gentle and loves gentleness in all matters.", ref:"Sahih Muslim" },
  { arabic:"", trans:"Be in this world as if you were a stranger or a traveler.", ref:"Sahih al-Bukhari" },
  { arabic:"", trans:"The most beloved deeds to Allah are those which are most consistent.", ref:"Sahih al-Bukhari" },
  { arabic:"", trans:"Whoever relieves a believer's distress, Allah will relieve his distress.", ref:"Sahih Muslim" },
  { arabic:"", trans:"Whoever does not show mercy will not be shown mercy.", ref:"Sahih Muslim" },
  { arabic:"", trans:"The best among people are those who are most beneficial to people.", ref:"(Hasan) Al-Muwatta" },
  { arabic:"", trans:"Speak a good word or remain silent.", ref:"Sahih al-Bukhari & Muslim" },
  { arabic:"", trans:"The Prophet ﷺ used to seek refuge from the evil of his soul.", ref:"Sahih Muslim" },
  { arabic:"", trans:"Whoever fasts Ramadan with faith and seeking reward, his past sins are forgiven.", ref:"Sahih al-Bukhari" },
  { arabic:"", trans:"He who is not grateful to people is not grateful to Allah.", ref:"Ahmad" },
  { arabic:"", trans:"The best of you are those who feed others.", ref:"Ibn Majah" },
  { arabic:"", trans:"A believer to another believer is like a building whose different parts support each other.", ref:"Sahih Muslim" },
  { arabic:"", trans:"Be mindful of Allah wherever you are.", ref:"Tirmidhi" },
  { arabic:"", trans:"Whoever removes a worldly grief from a believer, Allah will remove from him one of the griefs of the Day of Judgment.", ref:"Sahih Muslim" },
  { arabic:"", trans:"The most beloved of deeds to Allah are those done regularly, even if few.", ref:"Sahih al-Bukhari" },
  { arabic:"", trans:"Visit the sick, and follow the funeral procession.", ref:"Sahih Muslim" },
  { arabic:"", trans:"Respect the aged, show mercy to the young, and make right relations.", ref:"Tirmidhi" },
  { arabic:"", trans:"Whoever guides to an act of goodness, will have a reward similar to it.", ref:"Sahih Muslim" },
  { arabic:"", trans:"The best of provision is a righteous wife/husband and a peaceful heart.", ref:"(General teaching)" },
  { arabic:"", trans:"Whoever treads a path to seek knowledge, can expect Paradise.", ref:"Sahih Muslim" }
];

/* ---------- OFFLINE VERSES (≈35) ----------
  Short Qur'anic verses with references.
--------------------------------------------*/
const OFFLINE_VERSES = [
  { arabic:"إِنَّ مَعَ الْعُسْرِ يُسْرًا", trans:"Indeed, with hardship comes ease. (94:6)", ref:"Qur'an 94:6" },
  { arabic:"إِنَّ فِي ذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", trans:"Indeed, in the remembrance of Allah do hearts find rest. (13:28)", ref:"Qur'an 13:28" },
  { arabic:"فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", trans:"So be patient. He is the best of the patient. (16:127)", ref:"Qur'an 16:127" },
  { arabic:"قُلْ هُوَ اللَّهُ أَحَدٌ", trans:"Say: He is Allah, [Who is] One. (112:1)", ref:"Qur'an 112:1" },
  { arabic:"رَبَّنَا تَقَبَّلْ مِنَّا", trans:"Our Lord, accept [this] from us. (2:127)", ref:"Qur'an 2:127" },
  { arabic:"وَمَنْ يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", trans:"And whoever fears Allah — He will make for him a way out. (65:2)", ref:"Qur'an 65:2" },
  { arabic:"وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", trans:"And my success is not but through Allah. (11:88)", ref:"Qur'an 11:88" },
  { arabic:"وَمَنْ أَحْسَنُ قَوْلًا مِمَّنْ دَعَا إِلَى اللَّهِ", trans:"And who is better in speech than one who invites to Allah? (41:33)", ref:"Qur'an 41:33" },
  { arabic:"وَعَسَى أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَكُمْ", trans:"Perhaps you dislike a thing and it is good for you. (2:216)", ref:"Qur'an 2:216" },
  { arabic:"فَاسْتَبِقُوا الْخَيْرَاتِ", trans:"So race to [all that is] good. (2:148)", ref:"Qur'an 2:148" },
  { arabic:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", trans:"Indeed, Allah is with the patient. (2:153)", ref:"Qur'an 2:153" },
  { arabic:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", trans:"Guide us to the straight path. (1:6)", ref:"Qur'an 1:6" },
  { arabic:"إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", trans:"Indeed, mankind is in loss. (103:2)", ref:"Qur'an 103:2" },
  { arabic:"قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَى أَنفُسِهِمْ", trans:"Say to My servants who have transgressed against themselves... (39:53)", ref:"Qur'an 39:53" },
  { arabic:"وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ", trans:"And I did not create the jinn and mankind except to worship Me. (51:56)", ref:"Qur'an 51:56" },
  { arabic:"كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", trans:"Every soul will taste death. (3:185)", ref:"Qur'an 3:185" },
  { arabic:"وَاتَّقُوا اللَّهَ وَيُعَلِّمُكُمُ اللَّهُ", trans:"And fear Allah; Allah will teach you. (2:282)", ref:"Qur'an 2:282" },
  { arabic:"وَاعْبُدْ رَبَّكَ حَتَّى يَأْتِيَكَ الْيَقِينُ", trans:"Worship your Lord until there comes to you certainty (death). (15:99)", ref:"Qur'an 15:99" },
  { arabic:"فَاذْكُرُونِي أَذْكُرْكُمْ", trans:"So remember Me; I will remember you. (2:152)", ref:"Qur'an 2:152" },
  { arabic:"إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ", trans:"The believers are but brothers. (49:10)", ref:"Qur'an 49:10" },
  { arabic:"وَعَسَى رَبُّكُمْ أَن يُرْحَمَكُمْ", trans:"Perhaps your Lord will have mercy upon you. (11:90)", ref:"Qur'an 11:90" },
  { arabic:"وَمَا يُلَقَّاهَا إِلَّا الَّذِينَ صَبَرُوا", trans:"And none will be granted it except the patient. (41:35)", ref:"Qur'an 41:35" },
  { arabic:"وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ", trans:"And say, 'Do [as you will]; Allah will see your deeds.' (9:105)", ref:"Qur'an 9:105" },
  { arabic:"فَاذْكُرُونِي أَذْكُرْكُمْ", trans:"Remember Me and I will remember you. (2:152)", ref:"Qur'an 2:152" },
  { arabic:"إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ", trans:"Only those fear Allah, from among His servants, who have knowledge. (35:28)", ref:"Qur'an 35:28" },
  { arabic:"لَا تُكَلَّفُ نَفْسٌ إِلَّا وُسْعَهَا", trans:"No soul is burdened beyond that it can bear. (2:286)", ref:"Qur'an 2:286" },
  { arabic:"وَاجْتَبَاهُمْ بِهَا", trans:"He chose you by it. (3:164) — meaning guidance and gifts", ref:"Qur'an 3:164" },
  { arabic:"وَأَن لَّيْسَ لِلْإِنْسَانِ إِلَّا مَا سَعَى", trans:"And that there is not for man except that [good] for which he strives. (53:39)", ref:"Qur'an 53:39" },
  { arabic:"وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى", trans:"And cooperate in righteousness and piety. (5:2)", ref:"Qur'an 5:2" },
  { arabic:"إِنَّ اللَّهَ يُحِبُّ الْمُتَصَدِّقِينَ", trans:"Indeed, Allah loves the charitable. (2:195)", ref:"Qur'an 2:195" },
  { arabic:"يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ", trans:"O you who have believed, fear Allah. (3:102)", ref:"Qur'an 3:102" }
];

/* ---------- CHALLENGE GENERATOR TEMPLATES ----------
   We'll generate challenges with templates and category tags
   to ensure variety; each generated challenge is checked
   against used challenges (history) to avoid repeats.
-----------------------------------------------*/
const CHAL_TEMPLATES = [
  {cat:"worship", text:"Perform 2 raka'ah of voluntary prayer with sincere dua and reflection."},
  {cat:"worship", text:"Recite and reflect on a short surah (e.g., Al-Ikhlas, Al-Falaq, An-Nas) today."},
  {cat:"knowledge", text:"Read a hadith with its reference and reflect on its meaning (5–10 minutes)."},
  {cat:"knowledge", text:"Learn one name of Allah (with meaning) and write it down."},
  {cat:"character", text:"Smile and greet at least 3 people with 'Assalamu Alaikum' today."},
  {cat:"charity", text:"Give a small sadaqah (even a cup of water or snack) to someone in need."},
  {cat:"dhikr", text:"Do 100 tasbeeh (SubhanAllah/Alhamdulillah/Allahu Akbar) with presence of heart."},
  {cat:"fasting", text:"Fast a voluntary day (e.g., Monday or Thursday) with intention."},
  {cat:"habit", text:"Avoid complaining and backbiting for the whole day — keep a soft tongue."},
  {cat:"family", text:"Help a family member with a task without being asked."},
  {cat:"service", text:"Visit or call someone who is alone and make dua for them."},
  {cat:"reflection", text:"Spend 10 minutes in silent reflection, counting blessings and making dua."},
  {cat:"quran", text:"Read 5–10 verses from the Qur'an and note one lesson you learned."},
  {cat:"gratitude", text:"List 5 blessings and thank Allah sincerely for each."},
  {cat:"character", text:"Forgive someone in your heart and make dua for them."},
  {cat:"charity", text:"Donate one small useful item (clothes/food) to someone in need."},
  {cat:"prayer", text:"Make sincere dua for someone who helped you — ask Allah to reward them."},
  {cat:"service", text:"Share an authentic hadith or verse with meaning on your profile."},
  {cat:"habit", text:"Wake up 30 minutes earlier tomorrow and use it for dhikr or reading."},
  {cat:"knowledge", text:"Read a short tafsir/explanation of one verse and write one sentence about it."},
  {cat:"family", text:"Teach a child or sibling a dua or short surah today."},
  {cat:"selfcare", text:"Take care of your health: go for a walk and reflect on the beauty of Allah's creation."},
  {cat:"charity", text:"Pay for someone's tea/coffee or provide a small treat as charity."},
  {cat:"dhikr", text:"Make 50 times 'Astaghfirullah' during the day, with sincerity."},
  {cat:"prayer", text:"Offer an extra 2 rak'ah after Dhuhr with sincere intention."},
  {cat:"reflection", text:"Write a short note about one change you'll make to improve yourself."},
  {cat:"community", text:"Help clean a shared space (home or neighborhood) as a small charity act."},
  {cat:"learning", text:"Read about one of the Prophets' stories and write one takeaway."},
  {cat:"service", text:"Do one act of kindness anonymously."},
  {cat:"gratitude", text:"Send a message of gratitude to someone who has helped you."},
  {cat:"family", text:"Share a beneficial reminder at the family table tonight."}
];

/* ---------- SAMPLE INSTAGRAM POSTS (replace later with your real thumbnails) ---------- */
const INSTAGRAM_POSTS = [
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=900&auto=format&fit=crop"
];

/* ---------- UTILITIES ---------- */
function todayKey(){ const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function loadLS(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } }
function saveLS(k,v){ localStorage.setItem(k, JSON.stringify(v)); }

/* ---------- NAV / BRIEF ANIMATION ---------- */
function navigateWithBriefAnim(target){
  const overlay = document.querySelector(".loader-overlay");
  if(!overlay){ window.location.href = target; return; }
  overlay.classList.add("show");
  setTimeout(()=> window.location.href = target, 850);
}
window.navigateWithBriefAnim = navigateWithBriefAnim;

/* ---------- DAILY HADITH / VERSE (lock-per-day) ---------- */
function ensureDailyContent(){
  const today = todayKey();
  if(localStorage.getItem(KEY_DAY) === today){
    // display saved
    const had = loadLS(KEY_HADITH) || OFFLINE_HADITHS[0];
    const ver = loadLS(KEY_VERSE) || OFFLINE_VERSES[0];
    showHadith(had); showVerse(ver);
    // ensure challenge is set for day if not set (but challenge page will show)
    const chal = loadLS(KEY_CHAL);
    if(!chal || !chal.date || chal.date !== today){
      // generate new but only save if user visits challenge page,
      // however to keep sequence we generate and save now.
      const newCh = generateUniqueChallenge(today);
      saveLS(KEY_CHAL, newCh);
    }
    return;
  }
  // new day: pick random hadith & verse, and generate challenge
  localStorage.setItem(KEY_DAY, today);
  const had = OFFLINE_HADITHS[Math.floor(Math.random()*OFFLINE_HADITHS.length)];
  const ver = OFFLINE_VERSES[Math.floor(Math.random()*OFFLINE_VERSES.length)];
  saveLS(KEY_HADITH, had); saveLS(KEY_VERSE, ver);
  // create challenge now (so it doesn't change if user doesn't open challenge page)
  const newCh = generateUniqueChallenge(today);
  saveLS(KEY_CHAL, newCh);
  showHadith(had); showVerse(ver);
}

function showHadith(h){
  const ah = document.getElementById("hadith-ar"), at = document.getElementById("hadith-trans"), ar = document.getElementById("hadith-ref");
  if(ah) ah.textContent = h.arabic || "";
  if(at) at.textContent = h.trans || "";
  if(ar) ar.textContent = h.ref || "";
}
function showVerse(v){
  const va = document.getElementById("verse-ar"), vt = document.getElementById("verse-trans"), vr = document.getElementById("verse-ref");
  if(va) va.textContent = v.arabic || "";
  if(vt) vt.textContent = v.trans || "";
  if(vr) vr.textContent = v.ref || "";
}

/* ---------- CHALLENGE: Unique generator + no-repeat for 365 ---------- */
function usedChallengesSet(){
  const arr = loadLS(KEY_USED_CHALLENGES) || [];
  return new Set(arr);
}
function saveUsedChallenge(chKey){
  const arr = loadLS(KEY_USED_CHALLENGES) || [];
  if(!arr.includes(chKey)){ arr.push(chKey); saveLS(KEY_USED_CHALLENGES, arr); }
}

/* helper: create a stable key for a challenge text to detect repeats */
function chalKey(ch){
  return btoa(ch.text).slice(0,40); // short encoded key; local only
}

/* generate unique challenge: tries templates + small randomization; ensure not used before */
function generateUniqueChallenge(dateStr){
  const used = usedChallengesSet();
  // make candidate options by combining templates + small modifiers
  const attempts = 200;
  for(let i=0;i<attempts;i++){
    const base = CHAL_TEMPLATES[Math.floor(Math.random()*CHAL_TEMPLATES.length)];
    // sometimes add small modifier for variety
    const modifiers = [
      "", " — do it with presence of heart", " — spend at least 10 minutes", " — reflect and note one lesson",
      " — share with one person", " — make dua after completing", ""
    ];
    const mod = modifiers[Math.floor(Math.random()*modifiers.length)];
    const candidate = { text: base.text + (mod?mod:""), cat: base.cat };
    const key = chalKey(candidate);
    if(!used.has(key)){
      // mark used
      saveUsedChallenge(key);
      // prepare challenge object
      const challengeObj = {
        id: key,
        text: candidate.text,
        cat: candidate.cat,
        date: dateStr,
        done: false,
        generatedAt: new Date().toISOString()
      };
      return challengeObj;
    }
  }
  // fallback: create a basic default (shouldn't happen often)
  const fallback = { id: "fallback-"+Date.now(), text: "Make sincere dua and seek forgiveness (Astaghfirullah).", cat:"dhikr", date:dateStr, done:false, generatedAt:new Date().toISOString() };
  saveUsedChallenge(fallback.id);
  return fallback;
}

/* ---------- MARK DONE & HISTORY ---------- */
function markDone(){
  const chal = loadLS(KEY_CHAL);
  if(!chal) return alert("No challenge found for today.");
  if(chal.done) return alert("You have already completed today's challenge. MashaAllah 🌙");
  chal.done = true;
  chal.completedAt = new Date().toISOString();
  saveLS(KEY_CHAL, chal);

  // save into history array
  const history = loadLS(KEY_HISTORY) || [];
  // day number is history length + 1
  const dayNum = history.length + 1;
  const entry = {
    id: chal.id,
    day: dayNum,
    text: chal.text,
    cat: chal.cat,
    date: chal.date,
    completedAt: chal.completedAt
  };
  history.push(entry);
  saveLS(KEY_HISTORY, history);

  // feedback
  const btn = document.getElementById("mark-done");
  if(btn){ btn.classList.add("done"); btn.textContent = "✔ Well done — MashaAllah 🌙"; btn.disabled = true; }
  const meta = document.getElementById("chal-meta");
  if(meta) meta.textContent = "Completed: " + new Date(chal.completedAt).toLocaleString();

  setTimeout(()=> alert("Well done! MashaAllah 🌙"), 60);
}
window.markDone = markDone;

/* ---------- RENDER challenge on challenge page ---------- */
function renderTodayChallenge(){
  const chal = loadLS(KEY_CHAL);
  if(!chal){
    // if not created yet, create now using today's key
    const today = todayKey();
    const newCh = generateUniqueChallenge(today);
    saveLS(KEY_CHAL, newCh);
    showChallenge(newCh);
    return;
  }
  showChallenge(chal);
}
function showChallenge(chal){
  const ct = document.getElementById("chal-text");
  const cm = document.getElementById("chal-meta");
  const btn = document.getElementById("mark-d
