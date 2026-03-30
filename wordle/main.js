const DEBUG = true;

function showElement(id) {
    document.getElementById(id).classList.remove("hidden");
}

function hideElement(id) {
    document.getElementById(id).classList.add("hidden");
}

function createBoard() {
    const board = document.getElementById("board");
    for(let i = 0; i < 30; ++i) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.id = "tile" + i;
        board.appendChild(tile);
    }
}

function createKeyboardRow(id) {
    let keys;
    switch(id) {
        case 0:
            keys = ["q", "u", "e", "r", "t", "y", "u", "i", "o", "p"];
            break;
        case 1:
            keys = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
            break;
        case 2:
            keys = ["enter", "z", "x", "c", "v", "b", "n", "m", "delete"];
            break;
    }

    const keyboard = document.getElementById("keyboard");
    const keyboardRow = document.createElement("div");
    keyboardRow.className = "keyboardRow";
    if(id === 1) {
        const keyHalf = document.createElement("div");
        keyHalf.className = "keyHalf";
        keyboardRow.appendChild(keyHalf);
    }
    for(let i = 0; i < keys.length; ++i) {
        const key = document.createElement("button");
        key.id = "key" + i;
        key.textContent = keys[i];
        keyboardRow.appendChild(key);
    }
    if(id === 1) {
        const keyHalf = document.createElement("div");
        keyHalf.className = "keyHalf";
        keyboardRow.appendChild(keyHalf);
    }
    keyboard.appendChild(keyboardRow);
}

function play() {
    showElement("game");
    welcome.classList.add("welcomeFade");
    
    setTimeout(() => {
        hideElement("welcome");
    }, 400);
}

function info() {
    alert("info");
}

function settings() {
    alert("settings");
}

function load() {
    showElement("welcome");
    hideElement("game");

    createBoard();

    createKeyboardRow(0);
    createKeyboardRow(1);
    createKeyboardRow(2);

    if(DEBUG) {
        play();
    }
}

load();
