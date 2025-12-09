/* HADITHS WITH REFERENCES */
const HADITHS = [
  {text:"Actions are judged by intentions.", ref:"Sahih al-Bukhari (1)"},
  {text:"The strong believer is better than the weak believer.", ref:"Sahih Muslim"},
  {text:"Cleanliness is half of faith.", ref:"Sahih Muslim"},
  {text:"A smile is charity.", ref:"Tirmidhi"},
  {text:"None of you truly believes until he wishes for his brother what he wishes for himself.", ref:"Bukhari & Muslim"},
  {text:"Make things easy, not difficult.", ref:"Sahih al-Bukhari"},
];

/* VERSES */
const VERSES = [
  {arabic:"إِنَّ مَعَ الْعُسْرِ يُسْرًا", trans:"Indeed, with hardship comes ease.", ref:"94:6"},
  {arabic:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", trans:"Indeed, Allah is with the patient.", ref:"2:153"},
  {arabic:"فَاذْكُرُونِي أَذْكُرْكُمْ", trans:"So remember Me; I will remember you.", ref:"2:152"}
];

/* DAILY LOADER FIX */
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function choose(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}

function loadDaily() {
  try {
    const key = todayKey();
    let savedDay = localStorage.getItem("day_key");

    if (savedDay !== key) {
      const had = choose(HADITHS);
      const ver = choose(VERSES);
      localStorage.setItem("day_key", key);
      localStorage.setItem("had", JSON.stringify(had));
      localStorage.setItem("ver", JSON.stringify(ver));
    }

    const h = JSON.parse(localStorage.getItem("had"));
    const v = JSON.parse(localStorage.getItem("ver"));

    document.getElementById("hadith-display").textContent = `"${h.text}"`;
    document.getElementById("hadith-ref").textContent = "Reference: " + h.ref;

    document.getElementById("verse-display").textContent =
      `${v.arabic}\n\n${v.trans}`;
    document.getElementById("verse-ref").textContent = v.ref;

  } catch (e) {
    console.log("Daily load error:", e);
  }
}

document.addEventListener("DOMContentLoaded", loadDaily);
