offsety = 0;
fireArray = [150, 250];
let treeImages = [];
minYchange = 0;
maxYchange = 35;
rotStripe = 0;
ribbonAlpha = 255;
ribbonStrokeWeight = 3;

function loadTree(path) {
  return new Promise((resolve) => {
    const tree = new Image();
    tree.onload = () => resolve(tree);
    tree.src = path;
  });
}

function mousePressed() {
  redraw();
}

async function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  treeImages = await Promise.all([
    loadTree("tree01.png"),
    loadTree("tree02.png"),
    loadTree("tree03.png"),
    loadTree("tree04.png"),
    loadTree("tree05.png"),
    loadTree("tree06.png"),
    loadTree("tree07.png"),
  ]);
}

//I used perlin noise for this function(reference code:https://youtu.be/y7sgcFhk6ZM?si=WcAUiyTOwGN03XbJ)
function fire() {
  noStroke();
  fill(154, 6, 6);
  let edge = [];

  beginShape();
  for (let x = 0; x <= width; x++) {
    offsety += 0.008;
    let y = (noise(offsety) * height) / 3;
    let edgeY = y + random(-5, 5);
    edge.push(edgeY);
    vertex(x, edgeY);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  drawFireTexture(edge, [
    [140, 5, 5],
    [155, 9, 8],
    [170, 17, 11],
  ]);
}

function fire2() {
  noStroke();
  fill(196, 34, 13);
  let edge = [];

  beginShape();
  for (let x = 0; x <= width; x++) {
    offsety += 0.005;
    let y = (noise(offsety) * height) / 3 + 150;
    let edgeY = y + random(-5, 5);
    edge.push(edgeY);
    vertex(x, edgeY);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  drawFireTexture(edge, [
    [181, 25, 10],
    [195, 36, 15],
    [234, 9, 9],
  ]);
}

function fire3() {
  noStroke();
  fill(207, 50, 42);
  let edge = [];

  beginShape();
  for (let x = 0; x <= width; x++) {
    offsety += 0.005;
    let y = (noise(offsety) * height) / 3 + 350;
    let edgeY = y + random(-5, 5);
    edge.push(edgeY);
    vertex(x, edgeY);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  drawFireTexture(edge, [
    [213, 57, 46],
    [223, 69, 54],
    [248, 203, 83],
  ]);
}

// inspirition from Steve's Makerspace:https://youtu.be/_9yK32iUHm0?si=cv8_JbT0gPi5yKbx
// I used AI to help clip these textures into the fire shapes
function drawFireTexture(edge, palette) {
  push();

  noStroke();
  beginClip();
  beginShape();
  for (let px = 0; px < edge.length; px++) {
    vertex(px, edge[px]);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  endClip();

  // Match curveVertex's control-point behavior in p5.js v2.
  splineProperty("ends", EXCLUDE);

  const layers = floor(random(3, 30));
  const span = Math.hypot(width, height);
  const end = span / 2 + 500;
  const xStart = -span / 2 - 300;
  const xEnd = span / 2 + 300;

  for (let layer = 0; layer < layers; layer++) {
    let y1;

    if (layer === 0) {
      y1 = -span / 2 - 300;
    } else {
      y1 = -span / 2 + (span / layers) * layer;
    }

    let y2 = y1;
    let y3 = y1;
    let y4 = y1;
    let y5 = y1;
    let y6 = y1;

    const rotLayer = random(PI, HALF_PI);
    let rotThisStripe = 3;

    // Bound the loop so it cannot run indefinitely.
    const averageStep = (minYchange + maxYchange) / 2;
    const maxStripes = Math.ceil(((end - y1) / Math.max(1, averageStep)) * 3);

    for (
      let stripe = 0;
      stripe < maxStripes &&
      y1 < end &&
      y2 < end &&
      y3 < end &&
      y4 < end &&
      y5 < end &&
      y6 < end;
      stripe++
    ) {
      y1 += random(minYchange, maxYchange);
      y2 += random(minYchange, maxYchange);
      y3 += random(minYchange, maxYchange);
      y4 += random(minYchange, maxYchange);
      y5 += random(minYchange, maxYchange);
      y6 += random(minYchange, maxYchange);

      const shade = palette[floor(random(palette.length))];
      fill(shade[0], shade[1], shade[2], ribbonAlpha);
      noStroke();
      strokeWeight(ribbonStrokeWeight);

      push();
      translate(width / 2, height / 2);
      rotThisStripe += rotStripe;
      rotate(rotThisStripe + rotLayer);

      beginShape();
      splineVertex(xStart, end);
      splineVertex(xStart, y1);
      splineVertex(-span / 2 + span / 5, y2);
      splineVertex(-span / 2 + (span / 5) * 2, y3);
      splineVertex(-span / 2 + (span / 5) * 3, y4);
      splineVertex(-span / 2 + (span / 5) * 4, y5);
      splineVertex(xEnd, y6);
      splineVertex(xEnd, end);
      endShape(CLOSE);

      pop();
    }
  }

  splineProperty("ends", INCLUDE);
  pop();
}

function ground() {
  fill(0);
  beginShape();
  for (let x = 0; x <= width; x++) {
    vertex(x, height - 160 + random(-7, 3));
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

function drawTrees() {
  let treeSpacing = Math.floor(random(75, 85));
  let treeCount = Math.max(treeImages.length, Math.ceil(width / treeSpacing));

  let designs = [];
  for (let i = 0; i < treeCount; i++) {
    designs.push(i % treeImages.length);
  }

  for (let i = designs.length - 1; i > 0; i--) {
    let j = Math.floor(random(i + 1));
    [designs[i], designs[j]] = [designs[j], designs[i]];
  }

  for (let i = 0; i < treeCount; i++) {
    let tree = treeImages[designs[i]];
    let sx = tree.width * 0.2;
    let sy = tree.height * 0.1;
    let sw = tree.width * 0.6;
    let sh = tree.height * 0.9;
    let treeHeight = random(height * 0.18, height * 0.28);
    let treeWidth = (treeHeight * sw) / sh;
    let centerX = ((i + random(0.15, 0.85)) * width) / treeCount;
    let baseY = height - 150 + random(-8, 8);

    for (let pass = -1; pass <= 1; pass++) {
      drawingContext.drawImage(
        tree,
        sx,
        sy,
        sw,
        sh,
        centerX - treeWidth / 2 + pass * 1.5,
        baseY - treeHeight,
        treeWidth,
        treeHeight
      );
    }
  }
}

function draw() {
  background(241, 223, 186);

  noFill();

  fire();
  fire2();
  fire3();
  drawTrees();
  ground();
}
