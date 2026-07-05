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


