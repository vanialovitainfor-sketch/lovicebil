// login.js – coba API dulu, fallback localStorage, fallback akun demo

const API_BASE  = 'https://herisusanta.my.id/javalogin/api/';
const PROXY     = 'https://corsproxy.io/?';

// Akun demo jika API dan localStorage sama-sama gagal
const DEMO_ACCOUNTS = [
  { username: 'heri',  password: '123', role: 'user'  },
  { username: 'admin', password: '123', role: 'admin' },
];

function loginBerhasil(username, role) {
  localStorage.setItem('loggedUser', username);
  localStorage.setItem('role', role);
  if (role === 'admin') {
    window.location.href = '../admin/index.html';
  } else {
    window.location.href = '../index.html';
  }
}

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username  = document.getElementById('username').value.trim();
  const password  = document.getElementById('password').value.trim();
  const btnSubmit = this.querySelector('button[type="submit"]');

  if (!username || !password) {
    alert('Username dan password tidak boleh kosong.');
    return;
  }

  const originalText    = btnSubmit.textContent;
  btnSubmit.textContent = 'Memproses...';
  btnSubmit.disabled    = true;

  // ── TAHAP 1: Coba API via proxy ──────────────────────────────────────────
  try {
    const res = await fetch(PROXY + encodeURIComponent(API_BASE + 'login'), {
      method : 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body   : JSON.stringify({ username, password })
    });

    const text = await res.text();
    const data = JSON.parse(text);

    const berhasil =
      data.status === 'success' ||
      data.success === true     ||
      data.token   != null      ||
      data.user    != null;

    if (berhasil) {
      const namaUser = data.username || data.user?.username || username;
      const role     = data.role     || data.user?.role     || 'user';
      loginBerhasil(namaUser, role);
      return;
    } else {
      // API berhasil dihubungi tapi login ditolak (salah password)
      const pesan = data.message || data.msg || data.error || 'Username atau password salah.';
      alert('Login gagal: ' + pesan);
      return;
    }

  } catch (errAPI) {
    console.warn('API gagal, mencoba localStorage...', errAPI);
  }

  // ── TAHAP 2: Fallback ke localStorage ───────────────────────────────────
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user  = users.find(u => u.username === username && u.password === password);

    if (user) {
      loginBerhasil(user.username, user.role || 'user');
      return;
    } else if (users.length > 0) {
      // localStorage bisa diakses tapi user tidak ditemukan
      alert('Username atau password salah.');
      return;
    }
    // Kalau users kosong (belum ada yang register), lanjut ke tahap 3
  } catch (errLS) {
    console.warn('localStorage gagal, mencoba akun demo...', errLS);
  }

  // ── TAHAP 3: Fallback ke akun demo ──────────────────────────────────────
  const demo = DEMO_ACCOUNTS.find(a => a.username === username && a.password === password);

  if (demo) {
    loginBerhasil(demo.username, demo.role);
  } else {
    alert(
      'Login gagal.\n\n' +
      'Kamu bisa mencoba akun demo berikut:\n' +
      '• User  → username: heri  | password: 123\n' +
      '• Admin → username: admin | password: 123'
    );
  }

  btnSubmit.textContent = originalText;
  btnSubmit.disabled    = false;
});
