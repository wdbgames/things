const DEBUG = false;

function showElement(id) {
    document.getElementById(id).classList.remove("hidden");
}

function hideElement(id) {
    document.getElementById(id).classList.add("hidden");
}

function play() {
    showElement("game");
    welcome.classList.add("welcomeFade");
    
    setTimeout(() => {
        hideElement("welcome");
    }, 400);
}

function info() {
}

function settings() {
}

function load() {
    showElement("welcome");
    hideElement("game");

    if(DEBUG) {
        play();
    }
}

load();
