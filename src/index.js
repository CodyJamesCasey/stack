import Matter from "matter-js";

import CanvasScreen from "screen";

import 'main.scss';

// module aliases
const {
  Engine,
  Render,
  World,
  Body,
  Bodies,
  Composites,
  Common,
  MouseConstraint,
} = Matter;

const canvasModel = {
  height: 1920,
  width: 1080,
};

const canvas = document.getElementById('canvas');
canvas.style.height = CanvasScreen.size.height + "px";
canvas.style.width = CanvasScreen.size.width + "px";

const engine = Engine.create({
  render: {
    element: document.body,
    canvas,
    options: {
      width: canvasModel.width,
      height: canvasModel.height,
      wireframes: false,
      showAngleIndicator: false,
      pixelRatio: 'auto'
    },
    fillStyle: 'red',
  }
});

window.addEventListener('resize', () => {
  CanvasScreen.setNewCanvasScreen();
  canvas.style.height = CanvasScreen.size.height + "px";
  canvas.style.width = CanvasScreen.size.width + "px";
});

canvas.addEventListener('mousemove', (event) => {
  const { offsetX, offsetY } = event;
  const canvasRect = canvas.getBoundingClientRect();

  const xPos = canvasModel.width / (canvasRect.width / offsetX);
  const yPos = 200;

  engine.world.bodies.filter(body => body.label === "next-item").forEach((body) => {
    World.remove(engine.world, body);
  });

  World.add(engine.world, Bodies.circle(xPos, yPos, 50, {
    isStatic: true,
    label: "next-item",
  }));
});

//add walls
World.add(engine.world, Bodies.rectangle(0, 350, 1, 1920, {
  isStatic: true,
  label: "wall",
}));

World.add(engine.world, Bodies.rectangle(1920, 350, 1, 1920, {
  isStatic: true,
  label: "wall",
}));

//add bottom wall
World.add(engine.world, Bodies.rectangle(0, 900, 1080, 1, { isStatic: true, label: "game-shape"}));



window.setInterval(() => {
  // const body = Bodies.rectangle(100, 0, Common.random(20, 50), Common.random(20, 50));
  const body = Bodies.polygon(Common.random(20, 50), 0, 1, 50, {label: "game-shape"});
  // MouseConstraint.create(engine, body);
  World.add(engine.world, body);
}, 1000);


//check for balls to be static and deleted
window.setInterval(() => {
  engine.world.bodies.filter(body => body.label === "game-shape").forEach((body) => {
    if (body.isStatic) {
      Body.setPosition(body, {
        x: body.position.x,
        y: body.position.y + 1,
      });
    }
  });

  engine.world.bodies.filter(body => body.label === "game-shape").forEach((body) => {
    if (body.bounds.min.y > 800) {
      body.isStatic = true;
    }
  });

  engine.world.bodies.filter(body => body.label === "game-shape").forEach((body) => {
    if (body.bounds.min.y > 1000) {
      World.remove(engine.world, body);
    }
  });
}, 50);

Engine.run(engine);
