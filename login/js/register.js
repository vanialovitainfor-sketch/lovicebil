// register.js – versi diperbaiki

const API_BASE = 'https://herisusanta.my.id/javalogin/api/';

document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const btnSubmit = this.querySelector('button[type="submit"]');

  if (!username || !password) {
    alert('Username dan password tidak boleh kosong.');
    return;
  }

  const originalText = btnSubmit.textContent;
  btnSubmit.textContent = 'Memproses...';
  btnSubmit.disabled = true;

  try {
    const res = await fetch(API_BASE + 'register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch {
      console.error('Response bukan JSON:', text);
      alert('Server mengembalikan response tidak terduga:\n' + text);
      return;
    }

    console.log('Response dari API:', data);

    const berhasil =
      data.status === 'success' ||
      data.success === true ||
      data.message?.toLowerCase().includes('berhasil') ||
      data.message?.toLowerCase().includes('success');

    if (berhasil) {
      alert('Registrasi berhasil! Silakan login.');
      window.location.href = 'index.html';
    } else {
      const pesan = data.message || data.msg || data.error || 'Registrasi gagal.';
      alert('Registrasi gagal: ' + pesan);
    }

  } catch (err) {
    console.error('Fetch error:', err);
    alert(
      'Tidak dapat terhubung ke server.\n\n' +
      'Buka F12 → Console untuk melihat detail error.'
    );
  } finally {
    btnSubmit.textContent = originalText;
    btnSubmit.disabled = false;
  }
});
