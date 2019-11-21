const $touchesSimon = document.querySelectorAll(".toucheSimon");

let btnStart = document.getElementById("start");

let simonGame = [];
let joueurList = [];
let tourJoueur = false;
let speed = 1000;
let lightUptime = 1000;
let joueurFlash = 500;
let alive = true;

function reset() {
  simonGame = [];
  joueurList = [];
  tourJoueur = false;
  speed = 1250;
  lightUptime = 1000;
  joueurFlash = 500;
  alive = true;
  document.getElementById("touchesValue").innerHTML = 0; // On reset la valeur de touches dans l'HUD
  document.getElementById("roundValue").innerHTML = 0; // On reset la valeur de touches dans l'HUD
}

// Fonction pour forcer le code à attendre => Chaque fonction comprennant wait() devra être async
async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Lorsque le joueur a fini son tour on lance le tour de Simon
async function nouveauTourSimon() {
  if (alive) {
    joueurList = [];
    document.getElementById("touchesValue").innerHTML = 0; // On reset la valeur de touches dans l'HUD
    simonGame.push(Math.round(Math.random() * 3));
    console.log(simonGame);

    // Fait clignoter les couleur selon l'array simonGame
    for (let i = 0; i < simonGame.length; i++) {
      clignote(document.getElementById("T" + simonGame[i]), lightUptime);
      await wait(speed);
    }

    // La vitesse du jeu augmente les 8 premiers rounds
    if (simonGame.length < 9) {
      speed = (9 / 10) * speed;
      lightUptime = (9 / 10) * lightUptime;
    } else {
      console.log("Max speed reached");
    }

    tourJoueur = true;
  }
}

// Le joueur a perdu lorsque cette fonction est appelée
function hasLost() {
  var modal = document.getElementById("gameOverModal");
  var closeButton = document.getElementById("gameOverCloseButton");

  if (modal.style.display === "none") {
    modal.style.display = "block";
  }

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
  alive = false;
}

// Compare toute la liste du joueur
async function comparaison() {
  let i = 0;
  joueurList.forEach(ele => {
    if (ele !== simonGame[i]) {
      hasLost();
    }
    i++;
  });
  // Lorsque les listes sont identiques : le joueur a réussi le round, au passe au round suivant
  if (simonGame.length == joueurList.length) {
    console.log("Round réussi");
    document.getElementById("roundValue").innerHTML++; // On incrémente la valeur de round dans l'HUD
    await wait(1500); // Lorsque le joueur complète un round, on relance Simon après un petit délai
    nouveauTourSimon();
  }
}

// Fait clignoter la div cliquée ou choisie par Simon
function clignote(ele, time) {
  let baseColor = ele.style.backgroundColor;
  anime({
    easing: "easeInOutSine",
    targets: "#" + ele.id,
    backgroundColor: ["#FFF", baseColor],
    duration: time
  });
}

// Lorsque le joueur clique sur une couleur
[...$touchesSimon].map(async ele => {
  ele.addEventListener("click", () => {
    // On vérifie que c'est son tour
    if (tourJoueur) {
      // La case cliquée change de couleur
      clignote(ele, joueurFlash);
      // On push le numéro correspondant à la case cliquée => 0,1,2,3
      joueurList.push(parseInt(ele.id.slice(-1)));
      document.getElementById("touchesValue").innerHTML++; // On incrémente la valeur de touches dans l'HUD
      // Et on compare la nouvelle entrée
      comparaison();
    }
  });
});

// Reboot le jeu
function start() {
  reset();
  nouveauTourSimon();
}

btnStart.addEventListener("click", async () => {
  await wait(700); // On commence avec un délai après le clic pour ne pas surprendre le joueur
  start();
});

btnRestart.addEventListener("click", async () => {
  var modal = document.getElementById("gameOverModal");
  var closeButton = document.getElementById("btnRestart");
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  await wait(2000); // On commence avec un délai après le clic pour ne pas surprendre le joueur
  start();
});
