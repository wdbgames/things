function play() {
    const welcomeScreen = document.querySelector(".welcome");
    welcomeScreen.classList.add("welcomeFade");

    setTimeout(() => {
        welcomeScreen.style.display = "none";
    }, 400);
}

function load() {

}

load();
