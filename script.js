const questions = [
  {
    question: "Which nickname should I whisper to make you blush first?",
    options: ["My queen 👑", "Cutest troublemaker 😏", "Mrs. Forever 💍"],
  },
  {
    question: "When we finally live together, what should our first mini-date be?",
    options: ["Late-night chai and balcony talks ☕", "Dance in the kitchen barefoot 💃", "Blanket fort + movie marathon 🎬"],
  },
  {
    question: "Pick our daily long-distance habit I never want to lose:",
    options: ["Random 'I miss you' voice notes 🎙️", "Goodnight call no matter what 🌙", "Sending silly selfies all day 📸"],
  },
  {
    question: "Which high-school memory of us still melts me?",
    options: ["Stealing glances in class 💞", "Those endless chats after school 🏫", "Laughing at jokes no one else got 😂"],
  },
  {
    question: "Final question: what are you to me?",
    options: ["My home 🏡", "My best friend + soulmate ❤️", "All of the above, forever ♾️"],
  },
];

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const questionBox = document.getElementById("questionBox");
const surpriseBox = document.getElementById("surprise");
const progressText = document.getElementById("progressText");
const replayBtn = document.getElementById("replayBtn");

let currentIndex = 0;

function renderQuestion() {
  const current = questions[currentIndex];
  questionEl.textContent = current.question;
  choicesEl.innerHTML = "";

  current.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.textContent = option;
    btn.addEventListener("click", goNext);
    choicesEl.appendChild(btn);
  });

  progressText.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
}

function goNext() {
  currentIndex += 1;

  if (currentIndex < questions.length) {
    renderQuestion();
    return;
  }

  questionBox.classList.add("hidden");
  surpriseBox.classList.remove("hidden");
  progressText.textContent = "Forever mode activated 💖";
  showerHearts();
}

function showerHearts() {
  const heartSymbols = ["💖", "💕", "💗", "💘", "💞"];

  for (let i = 0; i < 26; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${3 + Math.random() * 3}s`;
    heart.style.opacity = `${0.4 + Math.random() * 0.6}`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 6500);
  }
}

replayBtn.addEventListener("click", () => {
  currentIndex = 0;
  surpriseBox.classList.add("hidden");
  questionBox.classList.remove("hidden");
  renderQuestion();
});

renderQuestion();
