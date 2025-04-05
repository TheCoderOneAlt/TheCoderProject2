let attempts = 0;
const maxAttempts = 3;
const lockTime = 10 * 60 * 1000; // 10 dakika
const dbName = "DosyaDeposu";

function checkPassword() {
  const pass = document.getElementById("passwordInput").value;
  const msg = document.getElementById("loginMessage");

  const lockedUntil = localStorage.getItem("lockedUntil");
  const now = Date.now();

  if (lockedUntil && now < parseInt(lockedUntil)) {
    showCountdown(parseInt(lockedUntil) - now);
    return;
  }

  if (pass === "depolama1kod") {
    unlockApp();
  } else {
    attempts++;
    if (attempts >= maxAttempts) {
      const until = now + lockTime;
      localStorage.setItem("lockedUntil", until);
      showCountdown(lockTime);
    } else {
      msg.textContent = `Hatalı şifre. Kalan deneme: ${maxAttempts - attempts}`;
    }
  }
}

function showCountdown(msRemaining) {
  const msg = document.getElementById("loginMessage");

  const interval = setInterval(() => {
    msRemaining -= 1000;
    if (msRemaining <= 0) {
      clearInterval(interval);
      localStorage.removeItem("lockedUntil");
      msg.textContent = "Kilit açıldı. Lütfen tekrar giriş yapın.";
      attempts = 0;
    } else {
      const minutes = Math.floor(msRemaining / 60000);
      const seconds = Math.floor((msRemaining % 60000) / 1000);
      msg.textContent = `Kilitli. Kalan süre: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

function unlockApp() {
  document.getElementById("firewall").style.display = "none";
  document.getElementById("app").style.display = "block";
  loadFiles();
  getIP();
}

document.getElementById("fileInput").addEventListener("change", function (e) {
  const files = Array.from(e.target.files);
  const request = indexedDB.open(dbName, 1);

  request.onupgradeneeded = function (e) {
    e.target.result.createObjectStore("files", { keyPath: "name" });
  };

  request.onsuccess = function (e) {
    const db = e.target.result;
    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function () {
        const data = { name: file.name, type: file.type, data: reader.result };
        store.put(data);
        displayFile(data);
      };
      reader.readAsDataURL(file);
    });
  };
});

function loadFiles() {
  const request = indexedDB.open(dbName, 1);
  request.onsuccess = function (e) {
    const db = e.target.result;
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
      getAll.result.forEach(displayFile);
    };
  };
}

function displayFile(file) {
  const container = document.createElement("div");
  container.innerHTML = `<strong>${file.name}</strong>`;

  if (file.type.startsWith("audio/")) {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = file.data;
    container.appendChild(audio);
  } else if (file.type.startsWith("video/")) {
    const video = document.createElement("video");
    video.controls = true;
    video.src = file.data;
    container.appendChild(video);
  } else if (file.type.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = file.data;
    img.style.maxWidth = "200px";
    container.appendChild(img);
  } else {
    const link = document.createElement("a");
    link.href = file.data;
    link.download = file.name;
    link.textContent = "Dosyayı indir";
    container.appendChild(link);
  }

  document.getElementById("fileList").appendChild(container);
}

function talkToAssistant() {
  const input = document.getElementById("assistantInput").value;
  const response = document.getElementById("assistantResponse");

  if (!input) return response.textContent = "Dosya adı giriniz.";
  response.textContent = `Dosya "${input}" hakkında: Bu dosya sistemde kayıtlıysa türünü ve içeriğini analiz edebilirim.`;
}

function generateFilm() {
  const topic = document.getElementById("filmInput").value;
  const output = document.getElementById("filmOutput");

  if (!topic) return output.innerHTML = "<p>Film konusu girin.</p>";

  output.innerHTML = `
    <h4>${topic} - Film Senaryosu</h4>
    <p>Diyalog: "Bu karanlıkta bile umut var..."</p>
    <img src="https://placekitten.com/400/200" alt="Sahne 1">
    <img src="https://placekitten.com/401/200" alt="Sahne 2">
  `;
}

function getIP() {
  fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(data => {
      document.getElementById("ipAddress").textContent = `IP Adresiniz: ${data.ip}`;
      saveIP(data.ip);
    });
}

function saveIP(ip) {
  const ipList = JSON.parse(localStorage.getItem("ipLogs") || "[]");
  if (!ipList.includes(ip)) {
    ipList.push(ip);
    localStorage.setItem("ipLogs", JSON.stringify(ipList));
  }
}

document.getElementById("devtoolsInput").addEventListener("change", function (e) {
  if (e.target.value === "/devtools") {
    const list = document.getElementById("ipList");
    list.innerHTML = "";
    const ips = JSON.parse(localStorage.getItem("ipLogs") || "[]");
    ips.forEach(ip => {
      const li = document.createElement("li");
      li.textContent = ip;
      list.appendChild(li);
    });
    document.getElementById("devtools").style.display = "block";
  }
});
