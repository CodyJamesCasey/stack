import Matter from "matter-js";
import $ from "jquery";

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

// create an engine
const engine = Engine.create();

// create a renderer
const render = Render.create({
    element: document.body,
    engine,
    options: {
      width: 450,
      height: 700,
    },
});

//add walls
World.add(engine.world, Bodies.rectangle(225, 731, 449, 60, { isStatic: true, label: "game-shape"}));
World.add(engine.world, Bodies.rectangle(-10.6, 350, 20, 700, { isStatic: true, label: "wall"}));
World.add(engine.world, Bodies.rectangle(460.7, 350, 20, 700, { isStatic: true, label: "wall"}));



window.setInterval(() => {
  // const body = Bodies.rectangle(100, 0, Common.random(20, 50), Common.random(20, 50));
  const body = Bodies.polygon(Common.random(20, 50), 0, 1, 50, {label: "game-shape"});
  // MouseConstraint.create(engine, body);
  World.add(engine.world, body);
}, 1000);

const renderOptions = render.options;
renderOptions.wireframes = false;
renderOptions.showAngleIndicator = false;


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
    if (body.bounds.min.y > 350) {
      body.isStatic = true;
    }
  });

  engine.world.bodies.filter(body => body.label === "game-shape").forEach((body) => {
    if (body.bounds.min.y > 600) {
      World.remove(engine.world, body);
    }
  });
}, 50);



        $.get('./src/svg/svg.svg').done(function(data) {
            var vertexSets = [],
                color = Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58']);

            $(data).find('path').each(function(i, path) {
                vertexSets.push(Svg.pathToVertices(path, 30));
            });

            World.add(world, Bodies.fromVertices(400, 80, vertexSets, {
                render: {
                    fillStyle: color,
                    strokeStyle: color
                }
            }, true));
        });


// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
