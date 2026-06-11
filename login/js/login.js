// login.js – menggunakan localStorage (tanpa API)

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Username dan password tidak boleh kosong.');
    return;
  }

  // Ambil daftar user yang tersimpan di localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Cek admin hardcoded
  if (username === 'admin' && password === '123') {
    localStorage.setItem('loggedUser', 'admin');
    localStorage.setItem('role', 'admin');
    window.location.href = '../admin/index.html';
    return;
  }

  // Cari user yang cocok
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem('loggedUser', user.username);
    localStorage.setItem('role', 'user');
    window.location.href = '../index.html';
  } else {
    alert('Username atau password salah. Belum punya akun? Silakan daftar dulu.');
  }
});
