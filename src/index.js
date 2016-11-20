import Matter from "matter-js";

// module aliases
const {
  Engine,
  Render,
  World,
  Bodies,
  Composites,
  Common,
} = Matter;

// create an engine
const engine = Engine.create();

// create a renderer
const render = Render.create({
    element: document.body,
    engine,
});


var stack = Composites.stack(50, 50, 12, 3, 0, 0, function(x, y) {
  switch (Math.round(Common.random(0, 1))) {

  case 0:
    if (Common.random() < 0.8) {
      return Bodies.rectangle(x, y, Common.random(20, 50), Common.random(20, 50));
    } else {
      return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30));
    }
    break;
  case 1:
    return Bodies.polygon(x, y, Math.round(Common.random(1, 8)), Common.random(20, 50));
  }
});

World.add(engine.world, stack);

const renderOptions = render.options;
renderOptions.wireframes = false;
renderOptions.showAngleIndicator = false;


// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
