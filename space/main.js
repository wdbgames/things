const g_canvas = document.getElementById("canvas");
const g_ctx = g_canvas.getContext("2d");

const g_objects = [];

// CONSTANTS
const g_gravity = 1;
const g_softening = 0.01;
const g_collisions = true;
const g_simulationSpeed = 0.1;

let g_selectedMass = 0;
let g_selectedDensity = 1;

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

// CONFIG
const g_crosshairSize = 16;
const g_speed = 1;
const g_minRadius = 1;

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
    addObject(g_selectedMass, g_selectedDensity, (x0 - g_offsetX) / g_zoom, (y0 - g_offsetY) / g_zoom, vx, vy);
}

function updateSelectedMass(x) {
    const max = 1000000;
    const min = 1;

    const massMultiplier = 2;

    if (x < 0) {
        g_selectedMass *= massMultiplier;
    }

    if (x > 0) {
        g_selectedMass /= massMultiplier;
    } 

    if (g_selectedMass < min) {
        g_selectedMass = min;
    }

    if (g_selectedMass > max) {
        g_selectedMass = max;
    }
}

function updateZoom(x) {
    const max = 1000000;
    const min = 0.000001;

    const zoomMultiplier = 1.1;
    const prevZoom = g_zoom;

    if (x < 0) {
        g_zoom *= zoomMultiplier;
    }

    if (x > 0) {
        g_zoom /= zoomMultiplier;
    } 

    if (g_zoom < min) {
        g_zoom = min;
    }

    if (g_zoom > max) {
        g_zoom = max;
    }

    g_offsetX = (g_offsetX - g_canvas.width / 2) * (g_zoom / prevZoom) + g_canvas.width / 2;
    g_offsetY = (g_offsetY - g_canvas.height / 2) * (g_zoom / prevZoom) + g_canvas.height / 2;
}

function renderCrosshair(size) {
    g_ctx.fillStyle = "white";

    const x = g_canvas.width / 2;
    const y = g_canvas.height / 2;
    const width = size / 8;

    g_ctx.fillRect(x - size / 2, y - width, size - width, width);
    g_ctx.fillRect(x - width, y - size / 2, width, size - width);
}

function renderObject(radius, x, y) {
    g_ctx.fillStyle = `hsl(${radius * 10}, 100%, 50%)`;

    g_ctx.beginPath();
    g_ctx.arc(x * g_zoom + g_offsetX, y * g_zoom + g_offsetY, Math.max(g_minRadius, radius * g_zoom), 0, Math.PI * 2);
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

function addObject(mass, density, x, y, vx, vy) {
    g_objects.push({
        mass: mass,
        density: density,
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        radius: calculateRadius(mass, density),
    })
}

function removeObject(i) {
    g_objects.splice(i, 1);
}

function start() {
    generate();

    resize();

    g_offsetX = g_canvas.width / 2;
    g_offsetY = g_canvas.height / 2;
}

function generate() {
    const centralType = Math.floor(Math.random() * 4);
    const orbitingType = Math.floor(Math.random() * 3);
    const otherType = Math.floor(Math.random() * 1);

    switch(centralType) {
        case 0:
            break;
        case 1:
            addObject(100000, 0, 0, 0, 0, 0);
            break;
        case 2:
            addObject(10000, 1, 0, 0, 0, 0);
            break;
        case 3:
            addObject(1000, 1, 0, 0, 0, 0);
            for (let i = 0; i < 20; ++i) {
                const degree = Math.floor(Math.random() * 360);

                addObject(100, 1, Math.cos(degree) * 250, Math.sin(degree) * 250, 0, 0);
            }
            break;
        default:
            break; 
    }

    switch(orbitingType) {
        case 0:
            break;
        case 1:
            for (let i = 0; i < 10; ++i) {
                const randomX = Math.random() * 10000 - 5000;
                const randomY = Math.random() * 10000 - 5000;

                addObject(Math.random() * 100, 1, randomX, randomY, Math.random() * 5, Math.random() * 5);
            }
            break;  
        case 2:
            for (let i = 0; i < 20; ++i) {
                const degree = Math.floor(Math.random() * 360);

                addObject(Math.random() * 100, 1, Math.cos(degree) * 1000, Math.sin(degree) * 1000, 0, 0);
            }
            break;
        default:
            break; 
    }

    switch(otherType) {
        case 0:
            break;
        default:
            break;
    }
}

/*
function generate(x) {
    addObject(100000, 0, 0, 0, 0, 0);
    // addObject(10000, 1, 0, 0, 0, 0);

    for (let i = 0; i < x; ++i) {
        const randomX = Math.random() * 10000 - 5000;
        const randomY = Math.random() * 10000 - 5000;

        addObject(Math.random() * 100, 1, randomX, randomY, Math.random() * 5, Math.random() * 5);
    }
}
    */

function update() {
    let temp = performance.now();
    g_deltaTime = temp - g_deltaTimeTemp;
    g_deltaTimeTemp = temp;

    if (g_keys["a"]) {
        g_offsetX += g_speed * g_deltaTime;
    }

    if (g_keys["d"]) {
        g_offsetX -= g_speed * g_deltaTime;
    }

    if (g_keys["w"]) {
        g_offsetY += g_speed * g_deltaTime;
    }

    if (g_keys["s"]) {
        g_offsetY -= g_speed * g_deltaTime;
    }

    g_objects.forEach((objectA) => {
        g_objects.forEach((objectB) => {
            if (objectA == objectB) {
                return;
            }

            const dx = objectB.x - objectA.x;
            const dy = objectB.y - objectA.y;
            const d = Math.sqrt(dx * dx + dy * dy) + g_softening;
            const ax = g_gravity * ((objectB.mass * dx) / (d * d * d));
            const ay = g_gravity * ((objectB.mass * dy) / (d * d * d));
            objectA.vx += ax;
            objectA.vy += ay;

            if (g_collisions) {
                if (objectA.x - objectA.radius <= objectB.x + objectB.radius &&
                    objectA.x - objectA.radius >= objectB.x - objectB.radius &&
                    objectA.y - objectA.radius <= objectB.y + objectB.radius &&
                    objectA.y + objectA.radius >= objectB.y - objectB.radius) {
                    const dx = objectA.x - objectB.x;
                    const dy = objectA.y - objectB.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < objectA.radius + objectB.radius) {
                        if (objectA.mass > objectB.mass) {
                            objectA.mass += objectB.mass;
                            objectA.radius = calculateRadius(objectA.mass, objectA.density);
                            objectB.mass = 0;
                        } else {
                            objectB.mass += objectA.mass;
                            objectB.radius = calculateRadius(objectB.mass, objectB.density);
                            objectA.mass = 0;
                        }
                    }
                }
            }
        });

        objectA.x += objectA.vx * g_deltaTime * g_simulationSpeed;
        objectA.y += objectA.vy * g_deltaTime * g_simulationSpeed;
    });

    if (g_collisions) {
        for(let i = 0; i < g_objects.length; ++i) {
            if (g_objects[i].mass == 0) {
                g_objects.splice(i, 1);
            }
        }
    }
}

function calculateRadius(mass, density) {
    if (density == 0) {
        return 0;
    }

    return Math.sqrt(mass / density / Math.PI);
}

function render() {
    g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);

    g_objects.forEach((object) => {
        renderObject(object.radius, object.x, object.y);
    });

    if (g_mouseDown) {
        renderObject(calculateRadius(g_selectedMass, g_selectedDensity), (g_mouseDownX - g_offsetX) / g_zoom, (g_mouseDownY - g_offsetY) / g_zoom);
        renderTrajectory(g_mouseDownX, g_mouseDownY, g_mouseX, g_mouseY);
    }

    renderCrosshair(g_crosshairSize);
}

function loop() {
    update();
    render();
    
    requestAnimationFrame(loop);
}

start();
requestAnimationFrame(loop);
