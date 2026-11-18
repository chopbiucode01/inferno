offsety = 0
fireArray = [150,250]
let img;
let treeImages = [];

//redraw by clicking anywhere on canvas instead of reloading the page everytime
function mousePressed(){
  redraw()
}

async function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop()
// loading the images
  treeImages = await Promise.all([
    loadImage('tree01.png'),
    loadImage('tree02.png'),
    loadImage('tree03.png'),
    loadImage('tree04.png'),
    loadImage('tree05.png'),
    loadImage('tree06.png'),
    loadImage('tree07.png')
  ]);
  img = treeImages[0];
}

//I used perlin noise for this function(reference code:https://youtu.be/y7sgcFhk6ZM?si=WcAUiyTOwGN03XbJ)
function fire(){
  noStroke()
  fill(154, 6, 6)
  let edge = [];

  beginShape()
  for (x = 0; x<=width; x++){
    offsety+=0.008
    y = noise(offsety)*height/3
    let edgeY = y+random(-5,5);
    edge.push(edgeY);
    vertex(x,edgeY)
  }
  vertex(width,height)
  vertex(0,height)
  endShape(CLOSE)

  drawFireTexture(edge, [
    [140, 5, 5], [155, 9, 8], [170, 17, 11]
  ]);
}

function fire2(){
  noStroke()
  fill(196, 34, 13)
  let edge = [];

  beginShape()
  for (x = 0; x<=width; x++){
    offsety+=0.005
    y = noise(offsety)*height/3 +150
    let edgeY = y+random(-5,5);
    edge.push(edgeY);
    vertex(x,edgeY)
  }
  vertex(width,height)
  vertex(0,height)
  endShape(CLOSE)

  drawFireTexture(edge, [
    [181, 25, 10], [195, 36, 15], [204, 45, 22]
  ]);
}

function fire3(){
  noStroke()
  fill(207, 50, 42)
  let edge = [];

  beginShape()
  for (x = 0; x<=width; x++){
    offsety+=0.005
    y = noise(offsety)*height/3 +450
    let edgeY = y+random(-5,5);
    edge.push(edgeY);
    vertex(x,edgeY)
  }
  vertex(width,height)
  vertex(0,height)
  endShape(CLOSE)

  drawFireTexture(edge, [
    [213, 57, 46], [223, 69, 54], [233, 82, 62]
  ]);
}

// inspirition from Steve's Makerspace:https://youtu.be/_9yK32iUHm0?si=cv8_JbT0gPi5yKbx
// I used AI to help clip these textures into the fire shapes
function drawFireTexture(edge, palette) {
  push();

  beginClip();
  beginShape();
  for (let px = 0; px < edge.length; px++) {
    vertex(px, edge[px]);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  endClip();

  const ribbonCount = 24;
  const spacing = Math.max(8, height * 0.012);
  const ribbonHeight = spacing * 1.4;
  const seed = random(10000);

  for (let band = 0; band < ribbonCount; band++) {
    const shade = palette[Math.floor(random(palette.length))];

    fill(shade[0], shade[1], shade[2], 145);
    stroke(
      shade[0] - 35,
      Math.max(0, shade[1] - 12),
      Math.max(0, shade[2] - 8),
      55
    );
    strokeWeight(1);

    let points = [];
    for (let point = 0; point <= 8; point++) {
      const px = Math.min(
        edge.length - 1,
        Math.round(point * width / 8)
      );
      const wave =
        (noise(seed + point * 0.37, band * 0.27) - 0.5)
        * height * 0.035;

      points.push({
        x: px,
        y: edge[px] + (band + 0.5) * spacing + wave
      });
    }

    beginShape();
    for (let point = 0; point < points.length; point++) {
      splineVertex(points[point].x, points[point].y);
    }
    for (let point = points.length - 1; point >= 0; point--) {
      splineVertex(
        points[point].x,
        points[point].y + ribbonHeight
      );
    }
    endShape(CLOSE);
  }

  pop();
}

function ground(){
  fill(0)
  beginShape()
  for (x = 0; x<=width; x++){
    vertex(x,height-160 + random(-7,3) )
  }
  vertex(width,height)
  vertex(0,height)
  endShape(CLOSE)
}

function drawTrees() {
  const treeSpacing = Math.floor(random(75,85));
  const treeCount = Math.max(
    treeImages.length,
    Math.ceil(width / treeSpacing)
  );

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
    let sx = tree.width * 0.20;
    let sy = tree.height * 0.10;
    let sw = tree.width * 0.60;
    let sh = tree.height * 0.90;
    let treeHeight = random(height * 0.18, height * 0.28);
    let treeWidth = treeHeight * sw / sh;
    let centerX = (i + random(0.15, 0.85)) * width / treeCount;
    let baseY = height - 150 + random(-8, 8);

    for (let pass = -1; pass <= 1; pass++) {
      image(
        tree,
        centerX - treeWidth / 2 + pass * 1.5,
        baseY - treeHeight,
        treeWidth,
        treeHeight,
        sx, sy, sw, sh
      );
    }
  }
}

function draw() {
  background(241, 223, 186);

  noFill()

  fire()
  fire2()
  fire3()
  drawTrees()
  ground()
}
