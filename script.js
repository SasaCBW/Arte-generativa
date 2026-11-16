
const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");

const angleRange = document.getElementById("angleRange");
const depthRange = document.getElementById("depthRange");
const leafRange = document.getElementById("leafRange");
const paletteSelect = document.getElementById("paletteSelect");
const fruitToggle = document.getElementById("fruitToggle");

const angleValue = document.getElementById("angleValue");
const depthValue = document.getElementById("depthValue");
const leafValue = document.getElementById("leafValue");

const branchCountElement = document.getElementById("branchCount");
const leafCountElement = document.getElementById("leafCount");
const fruitCountElement = document.getElementById("fruitCount");
const artTitle = document.getElementById("artTitle");

const WIDTH = 1000;
const HEIGHT = 650;

let seed = 1;
let compositionNumber = 1;
let random = Math.random;

const palettes = {
  forest: {
    leaves: ["#315d3d", "#47794a", "#6b9855", "#8bad65", "#a9c77d"],
    fruit: ["#c94f3d", "#e28b45"],
    backgroundTop: "#dce9d6",
    backgroundBottom: "#a9c9a1",
    hill: "#91b28a",
    hillFar: "#b0cba4"
  },
  autumn: {
    leaves: ["#a94e2e", "#c66b35", "#dc923f", "#e5b75a", "#9c733e"],
    fruit: ["#a83c31", "#d85a3e"],
    backgroundTop: "#f1dfc2",
    backgroundBottom: "#d8b58d",
    hill: "#bd9870",
    hillFar: "#d5b797"
  },
  tropical: {
    leaves: ["#145b45", "#16815a", "#32a16a", "#71b95e", "#a3cb58"],
    fruit: ["#ed7844", "#e8c34d"],
    backgroundTop: "#d0e9d9",
    backgroundBottom: "#8dc5a2",
    hill: "#68a77d",
    hillFar: "#a4d0aa"
  },
  lavender: {
    leaves: ["#665078", "#84638e", "#a47ca4", "#bd91b0", "#d0a5bd"],
    fruit: ["#d87579", "#e9b15d"],
    backgroundTop: "#e7deed",
    backgroundBottom: "#c4b5d5",
    hill: "#a899bc",
    hillFar: "#c7b9d5"
  }
};

function createRandomGenerator(value) {
  let state = value >>> 0;

  return function () {
    state = (state + 0x6D2B79F5) | 0;

    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomBetween(min, max) {
  return min + random() * (max - min);
}

function choose(array) {
  return array[Math.floor(random() * array.length)];
}

function updateLabels() {
  angleValue.textContent = `${angleRange.value}°`;
  depthValue.textContent = `${depthRange.value} níveis`;
  leafValue.textContent = `${leafRange.value}%`;
}

function drawBackground(palette) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, palette.backgroundTop);
  gradient.addColorStop(1, palette.backgroundBottom);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Sol
  ctx.beginPath();
  ctx.arc(795, 130, 48, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 244, 203, 0.85)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(795, 130, 62, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 244, 203, 0.18)";
  ctx.fill();

  // Nuvens
  drawCloud(180, 135, 0.9);
  drawCloud(570, 90, 0.65);

  // Morros distantes
  ctx.fillStyle = palette.hillFar;
  ctx.beginPath();
  ctx.moveTo(0, 475);
  ctx.quadraticCurveTo(180, 340, 360, 465);
  ctx.quadraticCurveTo(600, 330, 820, 460);
  ctx.quadraticCurveTo(930, 390, 1000, 445);
  ctx.lineTo(1000, 650);
  ctx.lineTo(0, 650);
  ctx.closePath();
  ctx.fill();

  // Morros próximos
  ctx.fillStyle = palette.hill;
  ctx.beginPath();
  ctx.moveTo(0, 535);
  ctx.quadraticCurveTo(230, 420, 470, 530);
  ctx.quadraticCurveTo(730, 430, 1000, 515);
  ctx.lineTo(1000, 650);
  ctx.lineTo(0, 650);
  ctx.closePath();
  ctx.fill();

  // Chão
  ctx.fillStyle = "rgba(46, 91, 58, 0.18)";
  ctx.fillRect(0, 590, WIDTH, 60);

  // Pequenas plantas no chão
  for (let i = 0; i < 70; i++) {
    const x = randomBetween(0, WIDTH);
    const y = randomBetween(585, 645);

    ctx.strokeStyle = "rgba(45, 95, 54, 0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + randomBetween(-5, 5), y - randomBetween(5, 15));
    ctx.stroke();
  }
}

function drawCloud(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.beginPath();
  ctx.arc(0, 10, 25, 0, Math.PI * 2);
  ctx.arc(28, 0, 34, 0, Math.PI * 2);
  ctx.arc(61, 12, 25, 0, Math.PI * 2);
  ctx.arc(32, 20, 25, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawLeaf(x, y, size, color, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(size * 0.8, -size * 1.1, size * 1.8, -size * 0.2);
  ctx.quadraticCurveTo(size * 1.3, size * 0.9, 0, 0);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size * 1.5, -size * 0.2);
  ctx.stroke();

  ctx.restore();
}

function drawLeafCluster(x, y, palette, density) {
  const amount = Math.max(1, Math.round(randomBetween(3, 7) * density));
  let leaves = 0;

  for (let i = 0; i < amount; i++) {
    if (random() * 100 > density * 100) continue;

    const leafX = x + randomBetween(-22, 22);
    const leafY = y + randomBetween(-23, 23);
    const size = randomBetween(6, 13);
    const color = choose(palette.leaves);

    drawLeaf(
      leafX,
      leafY,
      size,
      color,
      randomBetween(-Math.PI, Math.PI)
    );

    leaves++;
  }

  return leaves;
}

function drawFruit(x, y, palette) {
  const size = randomBetween(5, 9);

  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = choose(palette.fruit);
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#70513a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -size + 1);
  ctx.lineTo(2, -size - 7);
  ctx.stroke();

  ctx.restore();
}

function drawBranch(x, y, length, angle, thickness, depth, settings, palette, stats) {
  const endX = x + Math.sin(angle) * length;
  const endY = y - Math.cos(angle) * length;

  stats.branches++;

  // Galho com espessura variável
  ctx.strokeStyle = depth > 3 ? "#67442e" : "#765039";
  ctx.lineWidth = Math.max(1, thickness);
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(
    x + Math.sin(angle) * length * 0.45 + randomBetween(-3, 3),
    y - Math.cos(angle) * length * 0.45,
    endX,
    endY
  );
  ctx.stroke();

  if (depth <= 0 || length < 5) {
    stats.leaves += drawLeafCluster(
      endX,
      endY,
      palette,
      settings.leafDensity
    );

    if (settings.fruits && random() < 0.24) {
      drawFruit(endX + randomBetween(-8, 8), endY + 7, palette);
      stats.fruits++;
    }

    return;
  }

  const spread = settings.angle * Math.PI / 180;
  const nextLength = length * randomBetween(0.70, 0.79);
  const nextThickness = thickness * 0.69;

  // Ramificação esquerda e direita
  const leftAngle = angle - spread * randomBetween(0.72, 1.22);
  const rightAngle = angle + spread * randomBetween(0.72, 1.22);

  drawBranch(
    endX, endY,
    nextLength,
    leftAngle,
    nextThickness,
    depth - 1,
    settings, palette, stats
  );

  drawBranch(
    endX, endY,
    nextLength,
    rightAngle,
    nextThickness,
    depth - 1,
    settings, palette, stats
  );

  // Pequena ramificação adicional em alguns pontos
  if (depth > 3 && random() < 0.18) {
    const extraAngle = angle + randomBetween(-spread, spread);

    drawBranch(
      endX, endY,
      nextLength * 0.75,
      extraAngle,
      nextThickness * 0.8,
      depth - 2,
      settings, palette, stats
    );
  }
}

function drawTree(settings, palette) {
  const stats = {
    branches: 0,
    leaves: 0,
    fruits: 0
  };

  // Sombra da árvore
  ctx.fillStyle = "rgba(42, 63, 43, 0.20)";
  ctx.beginPath();
  ctx.ellipse(500, 595, 125, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Raízes
  ctx.strokeStyle = "#68442e";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";

  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(500, 585);
    ctx.quadraticCurveTo(500 + i * 15, 600, 500 + i * 35, 608);
    ctx.stroke();
  }

  // Tronco e ramificações
  drawBranch(
    500,
    590,
    155,
    0,
    24,
    settings.depth,
    settings,
    palette,
    stats
  );

  return stats;
}

function render() {
  const palette = palettes[paletteSelect.value];

  random = createRandomGenerator(seed);

  const settings = {
    angle: Number(angleRange.value),
    depth: Number(depthRange.value),
    leafDensity: Number(leafRange.value) / 100,
    fruits: fruitToggle.checked
  };

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  drawBackground(palette);
  const stats = drawTree(settings, palette);

  branchCountElement.textContent = stats.branches.toLocaleString("pt-BR");
  leafCountElement.textContent = stats.leaves.toLocaleString("pt-BR");
  fruitCountElement.textContent = stats.fruits.toLocaleString("pt-BR");
}

function generateNewTree() {
  seed = Math.floor(Math.random() * 1000000000);
  compositionNumber++;

  artTitle.textContent = `Árvore nº ${String(compositionNumber).padStart(3, "0")}`;

  render();
}

function applySettings() {
  updateLabels();
  render();
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = `jardim-digital-${compositionNumber}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

angleRange.addEventListener("input", updateLabels);
depthRange.addEventListener("input", updateLabels);
leafRange.addEventListener("input", updateLabels);

document.getElementById("applyBtn").addEventListener("click", applySettings);
document.getElementById("generateBtn").addEventListener("click", generateNewTree);
document.getElementById("downloadBtn").addEventListener("click", downloadImage);

// Também permite atualizar a arte ao mudar a paleta ou os frutos.
paletteSelect.addEventListener("change", render);
fruitToggle.addEventListener("change", render);

// Primeira composição
updateLabels();
render();
