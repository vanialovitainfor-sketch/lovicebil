// welcome.js – tampilkan nama user & tombol logout di landing page

const loggedUser = localStorage.getItem('loggedUser');
const loginBtn   = document.getElementById('loginBtn');

if (loggedUser && loginBtn) {
  loginBtn.textContent = 'Logout (' + loggedUser + ')';
  loginBtn.href        = '#';
  loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('role');
    window.location.reload();
  });
}
