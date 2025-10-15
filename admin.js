import { CLOUD_NAME, UPLOAD_PRESET } from './cloudinaryConfig.js';

const ADMIN_EMAIL = "info@zahid.life";
const ADMIN_PASSWORD = "Jusuts123";

const loginForm = document.getElementById("loginForm");
const adminPanel = document.getElementById("adminPanel");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const newMemoryInput = document.getElementById("newMemory");
const createMemoryBtn = document.getElementById("createMemoryBtn");
const fileInput = document.getElementById("fileInput");
const memoryGrid = document.getElementById("memoryGrid");

// Login kontrol
if(localStorage.getItem("loggedIn") === "true") {
  loginForm.classList.add("hidden");
  adminPanel.classList.remove("hidden");
}

// Giriş
loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if(email === ADMIN_EMAIL && password === ADMIN_PASSWORD){
    localStorage.setItem("loggedIn", "true");
    loginForm.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    alert("Giriş başarılı!");
  } else {
    alert("Hatalı giriş!");
  }
});

// Çıkış
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  location.reload();
});

// Yeni Klasör Oluştur
createMemoryBtn.addEventListener("click", () => {
  const memoryName = newMemoryInput.value.trim();
  if(!memoryName) return alert("Lütfen bir isim girin.");
  const div = document.createElement("div");
  div.className = "bg-white p-4 rounded shadow";
  div.innerHTML = `<h3 class="font-bold mb-2">${memoryName}</h3><div class="files flex flex-wrap gap-2"></div>`;
  memoryGrid.appendChild(div);
  newMemoryInput.value = "";
});

// Dosya Yükleme
fileInput.addEventListener("change", async (e) => {
  const files = e.target.files;
  const currentMemory = memoryGrid.lastElementChild?.querySelector(".files");
  if(!currentMemory) return alert("Önce bir klasör oluşturun!");

  for(const file of files){
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();

    const ext = file.name.split('.').pop().toLowerCase();
    let html = "";
    if(ext === "mp4" || ext === "webm") {
      html = `<video width="200" controls src="${data.secure_url}"></video>`;
    } else {
      html = `<img width="200" src="${data.secure_url}">`;
    }

    currentMemory.innerHTML += `<div class="relative">${html}<button class="absolute top-0 right-0 bg-red-500 text-white px-1 rounded hover:bg-red-600" onclick="this.parentElement.remove()">X</button></div>`;
  }
  fileInput.value = "";
});
