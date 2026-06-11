// login.js – proses login via REST API
const API = 'https://herisusanta.my.id/javalogin/api/';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res  = await fetch(API + 'login', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.status === 'success') {
      localStorage.setItem('loggedUser', data.username);
      localStorage.setItem('role', data.role);   // 'user' atau 'admin'
      // arahkan ke halaman utama
      window.location.href = '../index.html';
    } else {
      alert('Login gagal: ' + (data.message || 'Username/password salah'));
    }
  } catch (err) {
    alert('Terjadi kesalahan jaringan. Coba lagi.');
  }
});
