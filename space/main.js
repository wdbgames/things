const g_canvas = document.getElementById("canvas");
const g_ctx = g_canvas.getContext("2d");

const g_objects = [];

// CONNSTANTS
const g_gravity = 1;
const g_density = 1;
const g_softening = 0.01;
const g_collisions = true;
const g_speed = 0.1;

let g_selectedMass = 0;

let g_deltaTime = 0;
let g_deltaTimeTemp = 0;

const g_keys = [];

let g_mouseX = 0;
let g_mouseY = 0;
let g_mouseDownX = 0;
let g_mouseDownY = 0;
let g_mouseDown = false;

let g_offsetX = g_canvas.width / 2;
let g_offsetY = g_canvas.height / 2;

window.addEventListener("resize", resize);

document.addEventListener("mousemove", (event) => {
    g_mouseX = event.clientX;
    g_mouseY = event.clientY;
});

document.addEventListener("mousedown", (event) => {
    g_mouseDown = true;

    g_mouseDownX = event.clientX;
    g_mouseDownY = event.clientY;

    g_selectedMass = 10;
});

document.addEventListener("mouseup", (event) => {
    g_mouseDown = false;

    addObjectClick(g_mouseDownX, g_mouseDownY, event.clientX, event.clientY);
});

document.addEventListener("wheel", (event) => {
    updateSelectedMass(Math.floor(event.deltaY / 100));
});

document.addEventListener("keydown", (event) => { 
    g_keys[event.key] = true;
});

document.addEventListener("keyup", (event) => { 
    g_keys[event.key] = false;
});

function resize() {
  g_canvas.width = window.innerWidth;
  g_canvas.height = window.innerHeight;
}

function addObjectClick(x0, y0, x1, y1) {
    const velocityMultiplier = 0.1;
    const vx = (x1 - x0) * velocityMultiplier;
    const vy = (y1 - y0) * velocityMultiplier;
    addObject(g_selectedMass, x0 - g_offsetX, y0 - g_offsetY, vx, vy);
}

function updateSelectedMass(x) {
    const max = 1000000;
    const min = 1;

    if (x < 0) {
        g_selectedMass >>= Math.abs(x);
    }

    if (x > 0) {
        g_selectedMass <<= x;
    }

    if (g_selectedMass < min) {
        g_selectedMass = max;
    }

    if (g_selectedMass > max) {
        g_selectedMass = min;
    }
}

function renderObject(radius, x, y) {
    g_ctx.fillStyle = `hsl(${radius * 10}, 100%, 50%)`;

    g_ctx.beginPath();
    g_ctx.arc(x + g_offsetX, y + g_offsetY, radius, 0, Math.PI * 2);
    g_ctx.fill();
}

function renderTrajectory(x0, y0, x1, y1) {
    g_ctx.strokeStyle = "white";
    g_ctx.lineWidth = 2;

    g_ctx.beginPath();
    g_ctx.moveTo(x0, y0);
    g_ctx.lineTo(x1, y1);
    g_ctx.stroke();
}

function addObject(mass, x, y, vx, vy) {
    g_objects.push({
        mass: mass,
        x: x,
        y: y,
        vx: vx,
        vy: vy
    })
}

function removeObject(i) {
    g_objects.splice(i, 1);
}

function start() {
    generate(2);

    resize();
}

function generate(x) {
    /*W
    for (let i = 0; i < x; ++i) {
        Math.random();
        addObject(Math.random() * 1000, Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random(), Math.random());
    }
    */

    addObject(1000, 0, 0, 0, 0);
}

function update() {
    let temp = performance.now();
    g_deltaTime = temp - g_deltaTimeTemp;
    g_deltaTimeTemp = temp;

    if (g_keys["a"]) {
        g_offsetX += 1 * g_deltaTime;
    }

    if (g_keys["d"]) {
        g_offsetX -= 1 * g_deltaTime;
    }

    if (g_keys["w"]) {
        g_offsetY += 1 * g_deltaTime;
    }

    if (g_keys["s"]) {
        g_offsetY -= 1 * g_deltaTime;
    }

    g_objects.forEach((objectA) => {
        g_objects.forEach((objectB) => {
            if (objectA === objectB) {
                return;
            }

            const dx = objectB.x - objectA.x;
            const dy = objectB.y - objectA.y;
            const d = Math.sqrt(dx * dx + dy * dy) + g_softening;
            const ax = g_gravity * ((objectB.mass * dx) / (d * d * d));
            const ay = g_gravity * ((objectB.mass * dy) / (d * d * d));
            objectA.vx += ax;
            objectA.vy += ay;
        });

        objectA.x += objectA.vx * g_deltaTime * g_speed;
        objectA.y += objectA.vy * g_deltaTime * g_speed;
    });
}

function calculateRadius(mass) {
    const volume = mass / g_density;
    return Math.sqrt(volume / Math.PI);
}

function render() {
    g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);

    g_objects.forEach((object) => {
        renderObject(calculateRadius(object.mass), object.x, object.y);
    });

    if (g_mouseDown) {
        renderObject(calculateRadius(g_selectedMass), g_mouseDownX - g_offsetX, g_mouseDownY - g_offsetY);
        renderTrajectory(g_mouseDownX, g_mouseDownY, g_mouseX, g_mouseY);
    }
}

function loop() {
    update();
    render();
    
    requestAnimationFrame(loop);
}

start();
requestAnimationFrame(loop);
