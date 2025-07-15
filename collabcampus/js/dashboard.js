// js/dashboard.js
import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location = "index.html";
    return;
  }

  const docRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(docRef);
  const data = snapshot.data();

  document.getElementById("profileHeader").textContent =
    `Logged in as: ${data.collegeID} – ${data.college}`;
  document.getElementById("pointsSpan").textContent = data.points || 0;

  renderTags("skillsContainer", data.skills);
  renderTags("goalsContainer", data.lookingFor);

  document.getElementById("saveSkillsBtn").onclick = () =>
    saveTags("skillsInput", "skillsContainer", "skills");

  document.getElementById("saveGoalsBtn").onclick = () =>
    saveTags("goalsInput", "goalsContainer", "lookingFor");

  document.getElementById("findBtn").onclick = () =>
    window.location = "skill-match.html";

  document.getElementById("logoutBtn").onclick = () =>
    signOut(auth).then(() => (window.location = "index.html"));
});

/* Helpers */
function renderTags(containerId, arr) {
  const box = document.getElementById(containerId);
  box.innerHTML = "";
  arr.forEach(t => {
    const div = document.createElement("div");
    div.className = "skill-tag";
    div.textContent = t;
    box.appendChild(div);
  });
}

async function saveTags(inputId, containerId, field) {
  const val = document.getElementById(inputId).value;
  if (!val) return;

  const list = val.split(",").map(s => s.trim()).filter(Boolean);
  const uid = auth.currentUser.uid;

  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    [field]: arrayUnion(...list)
  });

  renderTags(containerId, list);
  document.getElementById(inputId).value = "";
}
