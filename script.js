// script.js - populates daily hadith/verse and tries to render Instagram embeds.
// Put this file in the repo root named exactly: script.js

(function(){
  console.log("script.js starting...");

  // ---------- Data (add more later) ----------
  const HADITHS = [
    {text: "Actions are judged by intentions.", ref: "Sahih al-Bukhari 1"},
    {text: "The strong believer is better than the weak believer.", ref: "Muslim"},
    {text: "A smile is charity.", ref: "Jami' at-Tirmidhi"},
    {text: "None of you truly believes until he wishes for his brother what he wishes for himself.", ref: "Bukhari & Muslim"},
    {text: "Make things easy and do not make them difficult.", ref: "Sahih al-Bukhari"}
  ];

  const VERSES = [
    {arabic: "", trans: "Indeed, Allah is with the patient.", ref: "Qur'an 2:153"},
    {arabic: "", trans: "So remember Me; I will remember you.", ref: "Qur'an 2:152"},
    {arabic: "", trans: "And whoever relies upon Allah — then He is sufficient for him.", ref: "Qur'an 65:3"},
    {arabic: "", trans: "Indeed, with hardship comes ease.", ref: "Qur'an 94:6"},
    {arabic: "", trans: "No soul is burdened beyond what it can bear.", ref: "Qur'an 2:286"}
  ];

  // ---------- helpers ----------
  function todayKey(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function save(key,val){ localStorage.setItem(key, JSON.stringify(val)); }
  function load(key){ try { return JSON.parse(localStorage.getItem(key)); } catch(e){ return null; } }

  // get daily item or create and save
  function getDaily(arr, keyPrefix){
    const key = keyPrefix + "-" + todayKey();
    const existing = load(key);
    if(existing) return existing;
    const item = arr[Math.floor(Math.random()*arr.length)];
    save(key, item);
    return item;
  }

  // display hadiths/verses in all relevant containers
  function renderDaily(){
    try {
      const had = getDaily(HADITHS, "hadith");
      const ver = getDaily(VERSES, "verse");
      const hHome = document.getElementById("hadith-display");
      const hPage = document.getElementById("hadith-display-page");
      const vHome = document.getElementById("verse-display");
      const vPage = document.getElementById("verse-display-page");

      const hadText = (had.arabic && had.arabic.trim()) ? `${had.arabic}\n\n${had.trans || ""}` : `${had.text} — ${had.ref}`;
      const verText = (ver.arabic && ver.arabic.trim()) ? `${ver.arabic}\n\n${ver.trans || ""}` : `${ver.trans} — ${ver.ref}`;

      if(hHome) hHome.textContent = hadText;
      if(hPage) hPage.textContent = hadText;
      if(vHome) vHome.textContent = verText;
      if(vPage) vPage.textContent = verText;
      console.log("Daily hadith & verse rendered.");
    } catch(err){
      console.error("renderDaily error:", err);
    }
  }

  // Try to trigger Instagram embed processing. If it fails after timeout, replace blockquotes with clickable thumbnails.
  function ensureInstagramEmbeds(){
    function fallbackReplace(){
      console.log("Instagram embed fallback: replacing blockquotes with thumbnails.");
      const blocks = Array.from(document.querySelectorAll("blockquote.instagram-media"));
      // small thumbnail URL map — using safe hosted images (we can't hotlink IG images reliably)
      const fallbackThumbs = [
        {permalink:"https://www.instagram.com/p/DR_9PHzk0Os/", img:"https://via.placeholder.com/640x640.png?text=Post+1"},
        {permalink:"https://www.instagram.com/reel/DSACgkgE08o/", img:"https://via.placeholder.com/640x640.png?text=Reel+1"},
        {permalink:"https://www.instagram.com/reel/DSADchnE6hv/", img:"https://via.placeholder.com/640x640.png?text=Reel+2"}
      ];
      blocks.forEach((b, i) => {
        const link = b.querySelector("a") ? b.querySelector("a").href : (fallbackThumbs[i] && fallbackThumbs[i].permalink);
        const thumb = (fallbackThumbs[i] && fallbackThumbs[i].img) || "https://via.placeholder.com/640x640.png?text=Instagram";
        const wrapper = document.createElement("div");
        wrapper.style.display = "inline-block";
        wrapper.style.width = "30%";
        wrapper.style.margin = "6px";
        const a = document.createElement("a");
        a.href = link;
        a.target = "_blank";
        a.rel = "noopener";
        const img = document.createElement("img");
        img.src = thumb;
        img.alt = "Instagram post";
        img.style.width = "100%";
        img.style.borderRadius = "8px";
        a.appendChild(img);
        wrapper.appendChild(a);
        b.parentNode.replaceChild(wrapper, b);
      });
    }

    // First try to run official embed processor if present
    if(window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === "function"){
      try {
        window.instgrm.Embeds.process();
        console.log("Called instgrm.Embeds.process()");
        // still set a timeout to fallback if embeds don't show up
        setTimeout(() => {
          // if no images present inside .posts, fallback
          const posts = document.querySelectorAll("#instagram-posts img");
          if(!posts || posts.length === 0){
            fallbackReplace();
          }
        }, 2500);
        return;
      } catch(e){
        console.warn("instgrm.process threw:", e);
      }
    }
    // if embed script is not available or failed, do fallback immediately after brief wait
    setTimeout(fallbackReplace, 800);
  }

  // run on DOM ready
  document.addEventListener("DOMContentLoaded", function(){
    try {
      renderDaily();
      ensureInstagramEmbeds();
      console.log("script.js DOMContentLoaded finished.");
    } catch(e){
      console.error("script.js top-level error:", e);
    }
  });

})();
