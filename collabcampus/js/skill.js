/// js/skill.js

import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  getDoc,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { askGemini } from "./gemini.js";

/* DOM Elements */
const matchList = document.getElementById("matchList");
const matchMsg  = document.getElementById("matchMsg");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location = "index.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const curData = userSnap.data();

  // 1. Fetch all other users from Firestore
  const peersSnap = await getDocs(collection(db, "users"));
  const peers = [];
  peersSnap.forEach(doc => {
    if (doc.id !== user.uid) {
      peers.push(doc.data());
    }
  });

  // 2. Create Gemini Prompt
  const prompt = `
You are an assistant that recommends collaboration partners.
Target student:
- College ID: ${curData.collegeID}
- College: ${curData.college}
- Skills/Interests: ${curData.skills.join(", ")}
- Goals: ${curData.lookingFor.join(", ")}

Here is the list of potential peers (JSON):
${JSON.stringify(peers.slice(0, 15), null, 2)}

Return a JSON array of up to 3 best matches with fields:
name, collegeID, college, match_reason
`;

  matchMsg.textContent = "Thinking...";

  try {
    const gemText = await askGemini(prompt);
    const matches = JSON.parse(gemText);
    displayMatches(matches);
  } catch (e) {
    console.error("Gemini fallback:", e.message);
    matchMsg.textContent = "AI match failed. Showing basic skill-based suggestions.";
    simpleMatch(peers, curData);
  }
});

/* Display Matches */
function displayMatches(matches) {
  matchList.innerHTML = "";
  if (!matches.length) {
    matchMsg.textContent = "No matches found.";
    return;
  }

  matches.forEach(m => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${m.name || m.collegeID}</h4>
      <p>${m.college}</p>
      <p>${m.match_reason || ""}</p>
      <button disabled>Connect</button>
    `;
    matchList.appendChild(card);
  });

  matchMsg.textContent = "";
}

/* Fallback Matching */
function simpleMatch(peers, curUser) {
  const wantSet = new Set(curUser.lookingFor);
  const matches = peers
    .filter(p => p.skills?.some(skill => wantSet.has(skill)))
    .slice(0, 3)
    .map(p => ({
      ...p,
      match_reason: "Shares your desired skill(s)"
    }));
  displayMatches(matches);
}
