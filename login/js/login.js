// login.js – pakai CORS proxy agar bisa diakses dari GitHub Pages

const API_BASE = 'https://herisusanta.my.id/javalogin/api/';

// Proxy publik yang menambahkan header CORS ke setiap request
const PROXY = 'https://corsproxy.io/?';

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

  try {
    const res = await fetch(PROXY + encodeURIComponent(API_BASE + 'login'), {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept'      : 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Response bukan JSON:', text);
      alert('Response tidak terduga dari server:\n' + text);
      return;
    }

    console.log('Response API:', data);

    const berhasil =
      data.status === 'success' ||
      data.success === true     ||
      data.token   != null      ||
      data.user    != null;

    if (berhasil) {
      const namaUser =
        data.username || data.user?.username || data.name || data.user?.name || username;
      const role =
        data.role || data.user?.role || (username === 'admin' ? 'admin' : 'user');

      localStorage.setItem('loggedUser', namaUser);
      localStorage.setItem('role', role);
      if (data.token) localStorage.setItem('token', data.token);

      window.location.href = '../index.html';
    } else {
      const pesan = data.message || data.msg || data.error || 'Username atau password salah.';
      alert('Login gagal: ' + pesan);
    }

  } catch (err) {
    console.error('Error:', err);
    alert('Gagal terhubung ke server. Cek koneksi internet kamu.');
  } finally {
    btnSubmit.textContent = originalText;
    btnSubmit.disabled    = false;
  }
});
