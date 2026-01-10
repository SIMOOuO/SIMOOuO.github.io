//---------get header and footer---------
function loadHTML(id, file) {
  return fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}

loadHTML("header", "header.html").then(() => {
  setActiveNav();
});

loadHTML("footer", "footer.html").then(() => {
  initDisclaimer();
});

//---------header---------
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");

  if (window.scrollY > 50) {
    header.classList.add("shrink");
  } else {
    header.classList.remove("shrink");
  }
});

//get active
function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll(".nav-link").forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
    setActiveNav();
  });

//wave effect
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");

  let lastWave = 0; // throttle so it doesn't create too many waves

  header.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastWave < 450) return;
    lastWave = now;

    const wave = document.createElement("span");
    wave.classList.add("wave");

    // Random size for subtle variation
    const size = 15 + Math.random() * 25;
    wave.style.width = size + "px";
    wave.style.height = size + "px";

    // Random shade from white to light gray
    const shade = 200 + Math.floor(Math.random() * 55);
    wave.style.background = `rgba(${shade}, ${shade}, ${shade}, 0.2)`;

    // Position relative to header
    const rect = header.getBoundingClientRect();
    wave.style.left = e.clientX - rect.left - size / 2 + "px";
    wave.style.top = e.clientY - rect.top - size / 2 + "px";

    header.appendChild(wave);

    // Remove wave after animation ends
    wave.addEventListener("animationend", () => wave.remove());
  });
});

//---------scroll top functional---------
// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 50px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

//---------disclaimer---------
function initDisclaimer() {
  const modal = document.getElementById("disclaimerModal");
  const acceptBtn = document.getElementById("acceptDisclaimer");
  const openBtn = document.getElementById("openDisclaimer");
  const closeBtn = document.getElementById("closeModal");

  if (!modal || !acceptBtn || !openBtn || !closeBtn) {
    console.error("Disclaimer modal elements missing");
    return;
  }

  function showModal() {
    modal.classList.add("show");
  }

  function hideModal() {
    modal.classList.remove("show");
  }

  if (!localStorage.getItem("disclaimerAccepted")) {
    showModal();
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("disclaimerAccepted", "true");
    hideModal();
  });

  closeBtn.addEventListener("click", hideModal);
  openBtn.addEventListener("click", showModal);
}


