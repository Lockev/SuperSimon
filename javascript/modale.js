var modal = document.getElementById("infoModal");
var trigger = document.querySelector(".fa-info-circle");
var closeButton = document.getElementById("infoCloseButton");

trigger.addEventListener("click", () => {
  if (modal.style.display === "none") {
    modal.style.display = "block";
  }
});

closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});
