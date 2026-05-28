const slider =
document.querySelector(".slider");

// NEXT
document.querySelector(".next")
.addEventListener("click", () => {

  slider.scrollBy({
    left:400,
    behavior:"smooth"
  });

});

// PREV
document.querySelector(".prev")
.addEventListener("click", () => {

  slider.scrollBy({
    left:-400,
    behavior:"smooth"
  });

});

// SCROLL
function scrollPortfolio(){

  document.querySelector("#portfolio")
  .scrollIntoView({
    behavior:"smooth"
  });

}

// LOGIN LOGOUT

const authArea =
document.getElementById("authArea");

const currentUser =
localStorage.getItem("loggedInUser");

if(currentUser){

  authArea.innerHTML = `

    <div class="user-box">

      <span>
        Hi, ${currentUser}
      </span>

      <button
      onclick="logout()"
      class="logout-btn">

        Logout

      </button>

    </div>

  `;

}

// LOGOUT
function logout(){

  localStorage.removeItem(
    "loggedInUser"
  );

  alert("Yey, logout berhasil!");

  window.location.reload();

}
