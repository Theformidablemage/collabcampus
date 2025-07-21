import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* DOM Elements */
const idInput   = document.getElementById("collegeID");
const passInput = document.getElementById("password");
const colInput  = document.getElementById("collegeName");
const loginBtn  = document.getElementById("loginBtn");
const regBtn    = document.getElementById("registerBtn");
const authMsg   = document.getElementById("authMsg");

const makeEmail = (id, college) => `${id}@${college.replace(/\s+/g,"").toLowerCase()}.edu`;

async function register() {
  const id = idInput.value.trim();
  const pwd = passInput.value;
  const col = colInput.value.trim();
  if (!id || !pwd || !col) {
    authMsg.textContent = "Fill all fields";
    return;
  }
  const email = makeEmail(id, col);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pwd);
    await setDoc(doc(db, "users", cred.user.uid), {
      collegeID: id,
      college: col,
      skills: [],
      lookingFor: [],
      points: 0
    });
    window.location = "dashboard.html";
  } catch (e) {
    authMsg.textContent = e.message;
  }
}

async function login() {
  const id = idInput.value.trim();
  const pwd = passInput.value;
  const col = colInput.value.trim();
  if (!id || !pwd || !col) {
    authMsg.textContent = "Fill all fields";
    return;
  }
  const email = makeEmail(id, col);
  try {
    await signInWithEmailAndPassword(auth, email, pwd);
    window.location = "dashboard.html";
  } catch (e) {
    authMsg.textContent = e.message;
  }
}

loginBtn.onclick = login;
regBtn.onclick = register;
