// login.js – versi diperbaiki
// Menangani CORS dan berbagai format endpoint API

const API_BASE = 'https://herisusanta.my.id/javalogin/api/';

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const btnSubmit = this.querySelector('button[type="submit"]');

  if (!username || !password) {
    alert('Username dan password tidak boleh kosong.');
    return;
  }

  // Tampilkan loading di tombol
  const originalText = btnSubmit.textContent;
  btnSubmit.textContent = 'Memproses...';
  btnSubmit.disabled = true;

  try {
    // Coba kirim sebagai JSON dulu
    const res = await fetch(API_BASE + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    // Cek apakah response bisa dibaca
    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      // Response bukan JSON — tampilkan isinya untuk debug
      console.error('Response bukan JSON:', text);
      alert('Server mengembalikan response tidak terduga:\n' + text);
      return;
    }

    console.log('Response dari API:', data);

    // Cek berbagai kemungkinan format response sukses
    const berhasil =
      data.status === 'success' ||
      data.status === 'ok' ||
      data.success === true ||
      data.token != null ||
      data.user != null;

    if (berhasil) {
      // Simpan info login ke localStorage
      const namaUser =
        data.username || data.user?.username || data.name || data.user?.name || username;
      const role =
        data.role || data.user?.role || (username === 'admin' ? 'admin' : 'user');

      localStorage.setItem('loggedUser', namaUser);
      localStorage.setItem('role', role);
      if (data.token) localStorage.setItem('token', data.token);

      // Arahkan ke halaman utama
      window.location.href = '../index.html';
    } else {
      // Login gagal — tampilkan pesan dari API
      const pesan =
        data.message || data.msg || data.error || 'Username atau password salah.';
      alert('Login gagal: ' + pesan);
    }

  } catch (err) {
    // Kalau fetch sama sekali gagal, kemungkinan besar CORS
    console.error('Fetch error:', err);

    // Coba fallback: kirim sebagai form-urlencoded
    try {
      const res2 = await fetch(API_BASE + 'login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password })
      });

      const text2 = await res2.text();
      let data2;
      try { data2 = JSON.parse(text2); } catch { data2 = null; }

      if (data2 && (data2.status === 'success' || data2.token)) {
        const namaUser = data2.username || data2.name || username;
        localStorage.setItem('loggedUser', namaUser);
        localStorage.setItem('role', data2.role || 'user');
        window.location.href = '../index.html';
        return;
      }
    } catch (err2) {
      console.error('Fallback juga gagal:', err2);
    }

    // Tampilkan pesan error yang berguna
    alert(
      'Tidak dapat terhubung ke server.\n\n' +
      'Kemungkinan penyebab:\n' +
      '1. CORS: Server tidak mengizinkan request dari domain ini\n' +
      '2. Server sedang tidak aktif\n' +
      '3. URL API salah\n\n' +
      'Buka F12 → Console untuk melihat detail error.'
    );
  } finally {
    btnSubmit.textContent = originalText;
    btnSubmit.disabled = false;
  }
});
