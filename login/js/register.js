// register.js – proses registrasi via REST API
const API = 'https://herisusanta.my.id/javalogin/api/';

document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res  = await fetch(API + 'register', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ username, email, password })
    });
    const data = await res.json();

    if (data.status === 'success') {
      alert('Registrasi berhasil! Silakan login.');
      window.location.href = 'index.html';
    } else {
      alert('Registrasi gagal: ' + (data.message || 'Username sudah digunakan'));
    }
  } catch (err) {
    alert('Terjadi kesalahan jaringan. Coba lagi.');
  }
});
