const challenges=[
"Pray 2 raka’ah and ask Allah for guidance.",
"Recite Surah Ikhlas 3 times in the morning.",
"Avoid backbiting for the entire day.",
"Give a small charity today.",
"Read 5 verses of Qur’an."
];

function generateChallenge(){
    const c = challenges[Math.floor(Math.random()*challenges.length)];
    document.getElementById('challengeBox').innerText = c;
}
