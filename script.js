import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwY0GPOUgejjNR2hY810SCC7skxCt05NA",
  authDomain: "landschaftspark-fotorallye.firebaseapp.com",
  projectId: "landschaftspark-fotorallye",
  storageBucket: "landschaftspark-fotorallye.firebasestorage.app",
  messagingSenderId: "183065397640",
  appId: "1:183065397640:web:23c78170ae0cb625c6d23d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const stations=[
  {
    "image": "assets/stations/bild-01.jpg",
    "title": "Bild 1",
    "prompt": "Welche Farbe hat die linke Turbine?",
    "correct": "rot",
    "options": [
      "rot",
      "blau",
      "grün",
      "gelb",
      "schwarz",
      "weiß",
      "silber",
      "violett"
    ]
  },
  {
    "image": "assets/stations/bild-02.jpg",
    "title": "Bild 2",
    "prompt": "Welches ist das letzte englische Wort auf der Erklärungs-Tafel?",
    "correct": "reef",
    "options": [
      "reef",
      "river",
      "water",
      "system",
      "bridge",
      "plant",
      "steel",
      "park"
    ]
  },
  {
    "image": "assets/stations/bild-03.jpg",
    "title": "Bild 3",
    "prompt": "Aus welchem Jahrzehnt stammt der Architekturstil dieses Gebäudes?",
    "correct": "1950er",
    "options": [
      "1950er",
      "1930er",
      "1940er",
      "1960er",
      "1970er",
      "1920er",
      "1980er",
      "1910er"
    ]
  },
  {
    "image": "assets/stations/bild-04.jpg",
    "title": "Bild 4",
    "prompt": "Welche Farbkombination verbirgt sich hinter dem, was hier pink ist?",
    "correct": "gelb-schwarz",
    "options": [
      "gelb-schwarz",
      "rot-weiß",
      "blau-weiß",
      "grün-weiß",
      "schwarz-weiß",
      "blau-gelb",
      "grün-schwarz",
      "weiß-orange"
    ]
  },
  {
    "image": "assets/stations/bild-05.jpg",
    "title": "Bild 5",
    "prompt": "Wann wurde dieser Kran gebaut?",
    "correct": "1953",
    "options": [
      "1953",
      "1950",
      "1951",
      "1952",
      "1954",
      "1955",
      "1963",
      "1943"
    ]
  },
  {
    "image": "assets/stations/bild-06.jpg",
    "title": "Bild 6",
    "prompt": "Wie wurden die Bunkerverschlüsse geöffnet? Lies auf der Erklärungs-Tafel nach.",
    "correct": "per Hand",
    "options": [
      "per Hand",
      "mit Dampf",
      "elektrisch",
      "hydraulisch",
      "mit Druckluft",
      "per Kettenzug",
      "automatisch",
      "mit Motor"
    ]
  },
  {
    "image": "assets/stations/bild-07.jpg",
    "title": "Bild 7",
    "prompt": "Wo der Kreis ist, ist ein kleines gelbes Schild. Welche Zahl steht darauf?",
    "correct": "1",
    "options": [
      "1",
      "2",
      "3",
      "4",
      "5",
      "7",
      "10",
      "11"
    ]
  },
  {
    "image": "assets/stations/bild-08.jpg",
    "title": "Bild 8",
    "prompt": "Welche Farbe hat der Punkt neben „das Gelbe vom Ei“?",
    "correct": "blau",
    "options": [
      "blau",
      "gelb",
      "grün",
      "rot",
      "orange",
      "schwarz",
      "weiß",
      "violett"
    ]
  },
  {
    "image": "assets/stations/bild-09.jpg",
    "title": "Bild 9",
    "prompt": "Wodurch herrscht hier Lebensgefahr?",
    "correct": "Stahlteile unter Wasser",
    "options": [
      "Stahlteile unter Wasser",
      "Stromleitungen im Wasser",
      "giftige Gase am Wasser",
      "tiefe Schächte am Wasser",
      "rutschige Steine im Wasser",
      "heiße Rohre unter Wasser",
      "scharfe Kanten am Ufer",
      "lockere Geländer am Becken"
    ]
  },
  {
    "image": "assets/stations/bild-10.jpg",
    "title": "Bild 10",
    "prompt": "Wie viele Maschinen stehen in der alten Schlackeschäumanlage?",
    "correct": "7",
    "options": [
      "7",
      "5",
      "6",
      "8",
      "9",
      "10",
      "4",
      "3"
    ]
  },
  {
    "image": "assets/stations/bild-11.jpg",
    "title": "Bild 11",
    "prompt": "Wohin geht es links die Treppe rauf? Das Schild verrät es.",
    "correct": "Aussichtsturm HO5",
    "options": [
      "Aussichtsturm HO5",
      "Aussichtsturm HO1",
      "Aussichtsturm HO2",
      "Aussichtsturm HO3",
      "Aussichtsturm HO4",
      "Hochofenstraße",
      "Gießhalle HO5",
      "Erzbunker HO5"
    ]
  },
  {
    "image": "assets/stations/bild-12.jpg",
    "title": "Bild 12",
    "prompt": "Wie viele Arbeitsbereiche waren ursprünglich in der Wassermannwerkstatt untergebracht?",
    "correct": "3",
    "options": [
      "3",
      "2",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ]
  },
  {
    "image": "assets/stations/bild-13.jpg",
    "title": "Bild 13",
    "prompt": "Wie viele Bilder hängen in der Hochofenstraße?",
    "correct": "8",
    "options": [
      "8",
      "6",
      "7",
      "9",
      "10",
      "11",
      "12",
      "5"
    ]
  },
  {
    "image": "assets/stations/bild-14.jpg",
    "title": "Bild 14",
    "prompt": "Bis wohin wird gespeichertes Wasser aus der Erzbunkeranlage geleitet?",
    "correct": "Klarwasserkanal",
    "options": [
      "Klarwasserkanal",
      "Abwasserkanal",
      "Regenwasserbecken",
      "Kühlwasserbecken",
      "Emscherkanal",
      "Sammelbecken",
      "Wasserspeicher",
      "Pumpenhaus"
    ]
  },
  {
    "image": "assets/stations/bild-15.jpg",
    "title": "Bild 15",
    "prompt": "Welche Traglast haben Podest und Ladeklappe?",
    "correct": "5000kg",
    "options": [
      "5000kg",
      "2500kg",
      "3000kg",
      "4000kg",
      "4500kg",
      "5500kg",
      "6000kg",
      "7500kg"
    ]
  }
];
const storageKey = "landschaftspark-rallye-v3";
const teamKey = storageKey + "-team";
const views = document.querySelectorAll(".view");
const stationGrid = document.querySelector("#stationGrid");
const answerGrid = document.querySelector("#answerGrid");
const feedback = document.querySelector("#feedback");
const headerScore = document.querySelector("#headerScore");
const totalScore = document.querySelector("#totalScore");
const finishedCount = document.querySelector("#finishedCount");
const progressFill = document.querySelector("#progressFill");
const progressList = document.querySelector("#progressList");
const splashScreen = document.querySelector("#splashScreen");
const nameGate = document.querySelector("#nameGate");
const nameForm = document.querySelector("#nameForm");
const playerNameInput = document.querySelector("#playerName");
const playerBadge = document.querySelector("#playerBadge");
const toast = document.querySelector("#toast");

let toastTimer;
let state = JSON.parse(localStorage.getItem(storageKey) || "{}");
let team = JSON.parse(localStorage.getItem(teamKey) || "null");
let currentIndex = 0;
let isSaving = false;

function teamIdFromName(name) {
  return name.trim().toLocaleLowerCase("de-DE").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
}

function teamRef() {
  if (!team?.id) return null;
  return doc(db, "teams", team.id);
}

function saveLocal() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function saveTeamLocal(nextTeam) {
  team = nextTeam;
  localStorage.setItem(teamKey, JSON.stringify(team));
  playerBadge.textContent = team.name;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function showView(id) {
  views.forEach((view) => view.classList.toggle("is-active", view.id === id));
  if (id === "rallyView") renderStations();
  if (id === "progressView") renderProgress();
}

function resultFor(index) {
  return state[String(index + 1)] || null;
}

function total() {
  return Object.keys(state).reduce((sum, key) => {
    if (key.startsWith("attempts-")) return sum;
    return sum + (state[key]?.points || 0);
  }, 0);
}

function completedPayload() {
  const completed = {};
  stations.forEach((station, index) => {
    const result = resultFor(index);
    if (!result) return;
    completed[String(index + 1)] = {
      title: station.title,
      points: result.points,
      chosen: result.chosen,
      correct: result.correct,
      answeredAt: result.answeredAt || null
    };
  });
  return completed;
}

async function syncTeamProgress() {
  if (!teamRef()) return;
  await updateDoc(teamRef(), {
    totalScore: total(),
    completedCount: Object.keys(completedPayload()).length,
    completed: completedPayload(),
    updatedAt: serverTimestamp()
  });
}

function updateScore() {
  headerScore.textContent = total();
}

function attemptsFor(index) {
  return state["attempts-" + (index + 1)] || 0;
}

function setAttempts(index, value) {
  state["attempts-" + (index + 1)] = value;
  saveLocal();
}

function renderStations() {
  updateScore();
  stationGrid.innerHTML = "";
  stations.forEach((station, index) => {
    const result = resultFor(index);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "station-btn" + (result ? " is-complete" : "");
    button.style.setProperty("--img", "url('" + station.image + "')");
    button.dataset.points = result ? result.points : 0;
    button.innerHTML = "<strong>" + station.title + "</strong><small>" + (result ? "abgeschlossen" : "offen") + "</small>";
    button.disabled = Boolean(result);
    button.addEventListener("click", () => {
      if (result) return;
      openQuestion(index);
    });
    stationGrid.appendChild(button);
  });
}

function openQuestion(index) {
  currentIndex = index;
  const station = stations[index];
  document.querySelector("#questionNumber").textContent = station.title;
  document.querySelector("#questionText").textContent = station.prompt;
  const questionImage = document.querySelector("#questionImage");
  questionImage.src = station.image;
  questionImage.alt = station.title + " Originalbild";
  feedback.textContent = "";
  renderAnswers();
  showView("questionView");
}

function shuffledOptions(options) {
  const copy = [...options];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderAnswers() {
  const station = stations[currentIndex];
  const attempts = attemptsFor(currentIndex);
  document.querySelector("#attemptInfo").textContent = attempts === 0 ? "3 Punkte möglich" : "1 Punkt möglich";
  answerGrid.innerHTML = "";
  shuffledOptions(station.options).forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    button.textContent = option;
    button.addEventListener("click", () => answer(option, button));
    answerGrid.appendChild(button);
  });
}

async function finishQuestion(points, chosen) {
  if (isSaving) return;
  isSaving = true;
  const id = String(currentIndex + 1);
  state[id] = {
    points,
    chosen,
    correct: stations[currentIndex].correct,
    title: stations[currentIndex].title,
    answeredAt: new Date().toISOString()
  };
  delete state["attempts-" + id];
  saveLocal();
  updateScore();
  answerGrid.querySelectorAll("button").forEach((btn) => { btn.disabled = true; });

  window.setTimeout(() => {
    showView("rallyView");
    showToast(points + " Punkt" + (points === 1 ? "" : "e") + " gespeichert. Gesamt: " + total());
  }, 500);

  try {
    await syncTeamProgress();
  } catch (error) {
    localStorage.removeItem(teamKey);
    team = null;
    showToast("Team muss neu angemeldet werden");
    window.setTimeout(() => nameGate.classList.add("is-active"), 900);
  } finally {
    isSaving = false;
  }
}

function answer(option, button) {
  const station = stations[currentIndex];
  const attempts = attemptsFor(currentIndex);
  if (option === station.correct) {
    button.classList.add("is-right");
    feedback.textContent = attempts === 0 ? "Richtig. Das gibt 3 Punkte." : "Richtig. Das gibt 1 Punkt.";
    finishQuestion(attempts === 0 ? 3 : 1, option);
    return;
  }
  button.classList.add("is-wrong");
  button.disabled = true;
  if (attempts === 0) {
    setAttempts(currentIndex, 1);
    feedback.textContent = "Nicht ganz. Du hast noch einen Versuch für 1 Punkt.";
    answerGrid.querySelectorAll("button").forEach((btn) => { btn.disabled = true; });
    document.querySelector("#attemptInfo").textContent = "1 Punkt möglich";
    window.setTimeout(() => {
      showView("rallyView");
      showToast("Noch ein Versuch für 1 Punkt möglich.");
    }, 700);
    return;
  }
  feedback.textContent = "Leider falsch. Die Frage ist abgeschlossen.";
  finishQuestion(0, option);
}

function renderProgress() {
  updateScore();
  const completed = stations.filter((_, index) => resultFor(index)).length;
  totalScore.textContent = total();
  finishedCount.textContent = completed + " von " + stations.length + " Fragen abgeschlossen";
  progressFill.style.width = ((completed / stations.length) * 100) + "%";
  progressList.innerHTML = "";
  stations.forEach((station, index) => {
    const result = resultFor(index);
    const points = result ? result.points : 0;
    const item = document.createElement("article");
    item.className = "progress-item";
    item.innerHTML = "<div><strong>" + station.title + "</strong><small>" + (result ? "Antwort: " + result.chosen : "Noch offen") + "</small></div><span class='points " + (points === 3 ? "good" : points === 1 ? "mid" : "") + "'>" + points + " P</span>";
    progressList.appendChild(item);
  });
}

async function registerTeam(name) {
  const trimmed = name.trim().replace(/\s+/g, " ");
  const id = teamIdFromName(trimmed);
  if (!id) throw new Error("Bitte einen gültigen Teamnamen eingeben.");
  const ref = doc(db, "teams", id);
  const existing = await getDoc(ref);
  if (existing.exists()) throw new Error("Dieser Teamname ist schon angemeldet.");
  await setDoc(ref, {
    name: trimmed,
    totalScore: 0,
    completedCount: 0,
    completed: {},
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  state = {};
  saveLocal();
  saveTeamLocal({ id, name: trimmed });
}

async function requireTeamName() {
  if (team?.id && team?.name) {
    playerBadge.textContent = team.name;
    nameGate.classList.remove("is-active");
    try {
      const snap = await getDoc(teamRef());
      if (snap.exists()) {
        const data = snap.data();
        if (data.completed) {
          state = {};
          Object.entries(data.completed).forEach(([id, value]) => { state[id] = value; });
          saveLocal();
          renderStations();
          renderProgress();
        }
      } else {
        localStorage.removeItem(teamKey);
        team = null;
        nameGate.classList.add("is-active");
        showToast("Team wurde gelöscht. Bitte neu anmelden.");
      }
    } catch (error) {
      showToast("Firebase nicht erreichbar. Lokaler Stand wird angezeigt.");
    }
    return;
  }
  nameGate.classList.add("is-active");
  window.setTimeout(() => playerNameInput.focus(), 50);
}

function startIntro() {
  window.setTimeout(() => {
    splashScreen.classList.remove("is-active");
    requireTeamName();
  }, 3000);
}

nameForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = playerNameInput.value.trim();
  if (!name) return;
  const submitButton = nameForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Wird angemeldet...";
  try {
    await registerTeam(name);
    nameGate.classList.remove("is-active");
    showToast("Willkommen, " + name);
    renderStations();
    renderProgress();
  } catch (error) {
    showToast(error.message || "Anmeldung fehlgeschlagen");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Start freischalten";
  }
});

document.querySelector("#startBtn").addEventListener("click", () => showView("rallyView"));
document.querySelector("#progressBtn").addEventListener("click", () => showView("progressView"));
document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));

renderStations();
renderProgress();
showView("homeView");
startIntro();



