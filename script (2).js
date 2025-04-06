document.addEventListener('DOMContentLoaded', () => {
  fetchIpAddress();
});

function login() {
  const password = document.getElementById('password').value;
  if (password === '1453') {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
  } else {
    alert('Hatalı şifre!');
  }
}

function fetchIpAddress() {
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      document.getElementById('ip').textContent = data.ip;
    })
    .catch(error => {
      console.error('IP adresi alınamadı:', error);
    });
}

function handleFiles() {
  const fileInput = document.getElementById('fileInput');
  const files = fileInput.files;
  if (files.length === 0) {
    alert('Lütfen bir dosya seçin.');
    return;
  }

  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';

  Array.from(files).forEach(file => {
    const li = document.createElement('li');
    li.textContent = file.name;
    fileList.appendChild(li);
  });

  // Dosyaları tarayıcıda depolamak için IndexedDB veya localStorage kullanılabilir
  // Ancak, güvenlik ve depolama sınırları göz önünde bulundurulmalıdır
}

function handleCommand() {
  const commandInput = document.getElementById('commandInput').value.toLowerCase();
  const assistantOutput = document.getElementById('assistantOutput');

  if (commandInput === '/devtools') {
    // Geliştirici menüsünü aç
    alert('Geliştirici menüsü açılıyor...');
  } else {
    // Basit bir NLP işlevselliği
    if (commandInput.includes('merhaba')) {
      assistantOutput.textContent = 'Merhaba! Size nasıl yardımcı olabilirim?';
    } else {
      assistantOutput.textContent = 'Üzgünüm, bu komutu anlayamadım.';
    }
  }
}

// 3D Görüntüleme ve WASD Kontrolleri için Three.js Kullanımı
// Three.js kütüphanesini projenize dahil etmeniz gerekmektedir
// Daha fazla bilgi için: https://threejs.org/

// Örnek olarak, basit bir 3D sahne oluşturulabilir ve WASD kontrolleri eklenebilir
// Ancak, bu kodun detayları ve entegrasyonu için Three.js dokümantasyonuna başvurmanız önerilir
