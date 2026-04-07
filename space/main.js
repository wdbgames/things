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

let g_zoom = 1;
let g_offsetX = 0;
let g_offsetY = 0;

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
    if (g_mouseDown) {
        updateSelectedMass(Math.floor(event.deltaY / 100));
    } else {
        updateZoom(Math.floor(event.deltaY / 100));
    }
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
    addObject(g_selectedMass, (x0 - g_offsetX) / g_zoom, (y0 - g_offsetY) / g_zoom, vx, vy);
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
        g_selectedMass = min;
    }

    if (g_selectedMass > max) {
        g_selectedMass = max;
    }
}

function updateZoom(i) {
    const max = 1000000;
    const min = 0.000001;

    const zoomMultiplier = 1.1;
    const prevZoom = g_zoom;

    if (i < 0) {
        g_zoom /= zoomMultiplier;
    }

    if (i > 0) {
        g_zoom *= zoomMultiplier;
    } 

    if (g_zoom < min) {
        g_zoom = min;
    }

    if (g_zoom > max) {
        g_zoom = max;
    }

    g_offsetX = centerX - (g_canvas.width / 2 - g_offsetX) * (g_zoom / prevZoom);
    g_offsetY = centerY - (g_canvas.height / 2 - g_offsetY) * (g_zoom / prevZoom);
}

function renderObject(radius, x, y) {
    g_ctx.fillStyle = `hsl(${radius * 10}, 100%, 50%)`;

    g_ctx.beginPath();
    g_ctx.arc(x * g_zoom + g_offsetX, y * g_zoom + g_offsetY, radius * g_zoom, 0, Math.PI * 2);
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
    generate(10);

    resize();

    g_offsetX = g_canvas.width / 2;
    g_offsetY = g_canvas.height / 2;
}

function generate(x) {
    addObject(10000, 0, 0, 0, 0);

    for (let i = 0; i < x; ++i) {
        addObject(Math.random() * 100, Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random() * 5, Math.random() * 5);
    }
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
        renderObject(calculateRadius(g_selectedMass), (g_mouseDownX - g_offsetX) / g_zoom, (g_mouseDownY - g_offsetY) / g_zoom);
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
