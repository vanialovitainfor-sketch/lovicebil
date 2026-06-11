// register.js – menggunakan localStorage (tanpa API)

document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Username dan password tidak boleh kosong.');
    return;
  }

  // Ambil daftar user yang sudah ada
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Cek apakah username sudah dipakai
  const sudahAda = users.find(u => u.username === username);
  if (sudahAda) {
    alert('Username "' + username + '" sudah digunakan. Pilih username lain.');
    return;
  }

  // Simpan user baru
  users.push({ username, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  alert('Registrasi berhasil! Silakan login.');
  window.location.href = 'index.html';
});
