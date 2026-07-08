import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  collection,
  deleteDoc,
  doc,
  onSnapshot
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
const adminList = document.querySelector("#adminList");
const teamCount = document.querySelector("#teamCount");
const adminIntroGate = document.querySelector("#adminIntroGate");
const adminIntroKicker = document.querySelector("#adminIntroKicker");
const adminIntroTitle = document.querySelector("#adminIntroTitle");
const adminIntroText = document.querySelector("#adminIntroText");
const adminIntroNext = document.querySelector("#adminIntroNext");
const adminMoreInfo = document.querySelector("#adminMoreInfo");
const adminIntroSeenKey = "landschaftspark-admin-intro-seen";
const adminIntroSteps = [
  { title: "Teamnamen absprechen", text: "Lass dir vor dem Start die Teamnamen geben. Tauchen in deiner Liste sp\u00E4ter andere Namen auf, will wahrscheinlich jemand schummeln. Diese Namen kannst du einfach l\u00F6schen." },
  { title: "Teamnamen verwalten", text: "Jeder Teamname kann nur einmal verwendet werden. Wenn ein Team neu starten soll, musst du den Teamnamen l\u00F6schen und die Kinder m\u00FCssen die App einmal neu laden." },
  { title: "Reset / Neustart", text: "Es gibt in der App keinen Reset-Button f\u00FCr Teams. Ein Neustart geht bewusst nur \u00FCber den Admin, damit niemand aus Versehen den Fortschritt l\u00F6scht." }
];
const adminExtraSteps = [
  ...adminIntroSteps,
  { title: "Fortschritt pr\u00FCfen", text: "In der Liste siehst du Punktzahl, erledigte Bilder und letzte Aktivit\u00E4t. So erkennst du schnell, ob ein Team fertig ist oder festh\u00E4ngt." },
  { title: "Alte Seite sichtbar?", text: "Nach \u00C4nderungen an der App m\u00FCssen die Kinder die Seite manchmal neu laden. Bei Home-Bildschirm-Icons hilft notfalls, die Verkn\u00FCpfung neu anzulegen." },
  { title: "Maximalpunktzahl", text: "15 Bilder mal 3 Punkte ergeben 45 Punkte. Ein zweiter richtiger Versuch z\u00E4hlt nur noch 1 Punkt, ein falscher zweiter Versuch 0 Punkte." }
];
let activeAdminSteps = adminIntroSteps;
let adminIntroIndex = 0;

function formatDate(value) {
  if (!value?.toDate) return "-";
  return value.toDate().toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
}

function renderTeams(snapshot) {
  const teams = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  teams.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0) || (a.name || "").localeCompare(b.name || ""));
  teamCount.textContent = teams.length;
  adminList.innerHTML = "";

  if (!teams.length) {
    adminList.innerHTML = "<article class='progress-item'><div><strong>Noch keine Teams</strong><small>Sobald sich ein Team anmeldet, erscheint es hier.</small></div></article>";
    return;
  }

  teams.forEach((team) => {
    const item = document.createElement("article");
    item.className = "admin-team";
    const completed = team.completed || {};
    const completedText = Object.entries(completed)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([id, result]) => "Bild " + id + ": " + (result.points || 0) + "P")
      .join(", ") || "Noch keine Antworten";

    item.innerHTML = `
      <div class="admin-team__main">
        <strong>${team.name || team.id}</strong>
        <span>${team.totalScore || 0} Punkte \u00B7 ${team.completedCount || 0} von 15 erledigt</span>
        <small>Angemeldet: ${formatDate(team.createdAt)} \u00B7 Letzte Aktivit\u00E4t: ${formatDate(team.updatedAt)}</small>
        <small>${completedText}</small>
      </div>
      <button class="danger-action" type="button">L\u00F6schen</button>
    `;
    item.querySelector("button").addEventListener("click", async () => {
      const ok = window.confirm("Team '" + (team.name || team.id) + "' wirklich l\u00F6schen?");
      if (!ok) return;
      await deleteDoc(doc(db, "teams", team.id));
    });
    adminList.appendChild(item);
  });
}

onSnapshot(collection(db, "teams"), renderTeams, (error) => {
  adminList.innerHTML = "<article class='progress-item'><div><strong>Firebase-Fehler</strong><small>" + error.message + "</small></div></article>";
});



function renderAdminIntroStep() {
  const step = activeAdminSteps[adminIntroIndex];
  const prefix = activeAdminSteps === adminExtraSteps ? "Erklärung " : "Admin-Hinweis ";
  adminIntroKicker.textContent = prefix + (adminIntroIndex + 1) + " von " + activeAdminSteps.length;
  adminIntroTitle.textContent = step.title;
  adminIntroText.textContent = step.text;
  adminIntroNext.textContent = adminIntroIndex === activeAdminSteps.length - 1 ? "Alles klar" : "Weiter";
  adminIntroGate.querySelector(".intro-card").classList.toggle("is-extra", activeAdminSteps === adminExtraSteps);
}

function showAdminIntro(steps, remember) {
  activeAdminSteps = steps;
  adminIntroIndex = 0;
  adminIntroGate.dataset.remember = remember ? "yes" : "no";
  renderAdminIntroStep();
  adminIntroGate.classList.add("is-active");
}

adminIntroNext.addEventListener("click", () => {
  if (adminIntroIndex < activeAdminSteps.length - 1) {
    adminIntroIndex += 1;
    renderAdminIntroStep();
    return;
  }
  adminIntroGate.classList.remove("is-active");
  if (adminIntroGate.dataset.remember === "yes") localStorage.setItem(adminIntroSeenKey, "yes");
});

adminMoreInfo.addEventListener("click", () => showAdminIntro(adminExtraSteps, false));

if (localStorage.getItem(adminIntroSeenKey) !== "yes") showAdminIntro(adminIntroSteps, true);