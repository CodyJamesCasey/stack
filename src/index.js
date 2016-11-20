import Matter from 'matter-js';

import Assets from 'assets';
import CanvasScreen from 'screen';

import 'main.scss';

// module aliases
const {
  Engine,
  Events,
  World,
  Body,
  Bodies,
} = Matter;

let win = false;
let lose = false;
let startSink = false;

const canvasModel = {
  height: 1920,
  width: 1080,
};

const canvas = document.getElementById('canvas');
canvas.style.height = CanvasScreen.size.height + 'px';
canvas.style.width = CanvasScreen.size.width + 'px';

function resizeCanvasDisplay() {
  CanvasScreen.setNewCanvasScreen();
  canvas.style.height = CanvasScreen.size.height + 'px';
  canvas.style.width = CanvasScreen.size.width + 'px';
}

window.addEventListener('resize', resizeCanvasDisplay);

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
  }
});

Events.on(engine, 'collisionActive', (collision) => {
  if (win || lose) { return; }

  const found = collision.pairs.some((pair) => {
    const { bodyA, bodyB } = pair;
    if (bodyA.label === 'line' && bodyB.velocity.y <= 1 ||
      bodyB.label === 'line' && bodyA.velocity.y <= 1) {
      return true
    }
  });
  if (found) {
    win = true;
    engine.world.bodies.filter(body => body.label === 'game-shape').forEach((body) => {
      World.remove(engine.world, body);
    });
  }
});

const wallCategory = 0x0001;
const ballCategory = 0x0002;
const nextItemCategory = 0x0004;
const sceneryCategory = 0x0008;
const goalCategory = 0x0010;

const generateRandomItem = () => {
  const queueItems = Object.keys(Assets)
    .filter(key => Assets[key].type.indexOf('queue-item') === 0)
    .map((key) => {
      return Assets[key];
    });
  return queueItems[Math.floor(Math.random() * queueItems.length)];
}

const itemQueue = [
  generateRandomItem(),
  generateRandomItem(),
  generateRandomItem(),
  generateRandomItem(),
];

const renderQueue = () => {
  const queueItemRender = [];
  let x = 90;
  const y = 90;
  engine.world.bodies.filter(body => body.label.indexOf('queue-item') === 0).forEach((body) => {
    World.remove(engine.world, body);
  });

  itemQueue.forEach((item, index) => {
    if (index === itemQueue.length - 1) { return; }

    const body = Bodies.circle(x, y, 90, {
      isStatic: true,
      label: item.type,
      collisionFilter: {
        category: sceneryCategory,
      },
      render: {
        sprite: {
          texture: item.asset,
        }
      }
    });
    Body.scale(body, 0.5, 0.5);
    body.render.sprite.xScale = 0.5;
    body.render.sprite.yScale = 0.5;

    queueItemRender.push(body);

    x += 90;
  });

  World.add(engine.world, queueItemRender);
}

canvas.addEventListener('mousemove', (event) => {
  if (win || lose) { return; }
  const { offsetX } = event;
  const canvasRect = canvas.getBoundingClientRect();

  const xPos = canvasModel.width / (canvasRect.width / offsetX);
  if (xPos <= 135 || xPos >= 945) { return; }

  const yPos = 200;

  engine.world.bodies.filter(body => body.label === 'next-item').forEach((body) => {
    World.remove(engine.world, body);
  });

  const nextQueueItem = itemQueue[itemQueue.length - 1];
  const newNextItem = Bodies.circle(xPos, yPos, 90, {
    isStatic: true,
    label: 'next-item',
    collisionFilter: {
      category: nextItemCategory,
      mask: wallCategory | nextItemCategory,
    },
    render: {
      sprite: {
        texture: nextQueueItem.asset,
        xScale: 1.19,
        yScale: 1.19,
      }
    }
  });

  World.add(engine.world, newNextItem);
});

canvas.addEventListener('mousedown', () => {
  let x;
  let y;

  engine.world.bodies.filter(body => body.label === 'next-item').forEach((body) => {
    x = body.position.x;
    y = body.position.y;
    World.remove(engine.world, body);
  });

  const queueItem = itemQueue.pop();

  const ball = Bodies.circle(x, y, 90, {
    label: 'game-shape',
    collisionFilter: {
      category: ballCategory,
      mask: wallCategory | ballCategory | goalCategory,
    },
    render: {
      sprite: {
        texture: queueItem.asset,
        xScale: 1.19,
        yScale: 1.19,
      }
    }
  });

  const nextQueueItem = itemQueue[itemQueue.length - 1];
  const newNextItem = Bodies.circle(x, y, 90, {
    isStatic: true,
    label: 'next-item',
    collisionFilter: {
      category: nextItemCategory,
      mask: wallCategory | nextItemCategory,
    },
    render: {
      sprite: {
        texture: nextQueueItem.asset,
        xScale: 1.19,
        yScale: 1.19,
      }
    }
  });

  World.add(engine.world, [ball, newNextItem]);

  itemQueue.unshift(generateRandomItem());
  renderQueue();
});

//add walls and scenery

World.add(engine.world, Bodies.rectangle(540, 960, 1080, 1920, {
  isStatic: true,
  label: 'background',
  collisionFilter: {
    category: sceneryCategory,
  },
  render: {
    sprite: {
      texture: Assets.background.asset,
      xScale: 13,
      yScale: 13,
    }
  }
}));

World.add(engine.world, Bodies.rectangle(540, 400, 1080, 10, {
  isStatic: true,
  label: 'line',
  collisionFilter: {
    category: goalCategory,
  },
  isSensor: true,
  render: {
    sprite: {
      texture: Assets.line.asset,
      xScale: 4,
      yScale: 4,
    }
  }
}));

World.add(engine.world, Bodies.rectangle(0, 960, 1, 1920, {
  isStatic: true,
  label: 'wall',
  collisionFilter: {
    category: wallCategory,
  },
}));

World.add(engine.world, Bodies.rectangle(1080, 960, 1, 1920, {
  isStatic: true,
  label: 'wall',
  collisionFilter: {
    category: wallCategory,
  },
}));

//add floor
World.add(engine.world, Bodies.rectangle(540, 1920, 1080, 1, {
  isStatic: true,
  label: 'floor',
  collisionFilter: {
    category: wallCategory,
  },
}));

Events.on(engine, 'collisionStart', (collision) => {
  if (startSink) { return; }

  const found = collision.pairs.some((pair) => {
    const { bodyA, bodyB } = pair;
    if (bodyA.label === 'floor' || bodyB.label === 'floor') {
      return true
    }
  });
  if (found) {
    startSink = true;
  }
});

window.setInterval(() => {
  if (win) {
    engine.world.bodies.filter(body => body.label === 'end-win').forEach((body) => {
      World.remove(engine.world, body);
    });
    World.add(engine.world, Bodies.rectangle(540, 960, 1080, 1920, {
      isStatic: true,
      label: 'end-win',
      collisionFilter: {
        category: sceneryCategory,
      },
      render: {
        sprite: {
          texture: Assets.endWin.asset,
          xScale: 13,
          yScale: 13,
        }
      }
    }));
    return;
  } else if (lose) {
    engine.world.bodies.filter(body => body.label === 'end-lose').forEach((body) => {
      World.remove(engine.world, body);
    });
    World.add(engine.world, Bodies.rectangle(540, 960, 1080, 1920, {
      isStatic: true,
      label: 'end-lose',
      collisionFilter: {
        category: sceneryCategory,
      },
      render: {
        sprite: {
          texture: Assets.endLose.asset,
          xScale: 13,
          yScale: 13,
        }
      }
    }));
    return;
  }

  if (!startSink) {
    return;
  }
  engine.world.bodies.filter(body => body.label === 'game-shape' || body.label === 'floor').forEach((body) => {
    if (body.isStatic) {
      Body.setPosition(body, {
        x: body.position.x,
        y: body.position.y + 1,
      });
    }
  });

  engine.world.bodies.filter(body => body.label === 'game-shape' || body.label === 'floor').forEach((body) => {
    if (body.bounds.min.y > 1920) {
      body.isStatic = true;
    }
  });

  engine.world.bodies.filter(body => body.label === 'game-shape' || body.label === 'floor').forEach((body) => {
    if (body.bounds.min.y > 2500) {
      World.remove(engine.world, body);
    }
  });
}, 60);

Engine.run(engine);
resizeCanvasDisplay();
const newNextItem = Bodies.circle(540, 200, 90, {
  isStatic: true,
  label: 'next-item',
  collisionFilter: {
    category: nextItemCategory,
    mask: wallCategory | nextItemCategory,
  },
  render: {
    sprite: {
      texture: itemQueue[itemQueue.length - 1].asset,
    }
  }
});

World.add(engine.world, newNextItem);
renderQueue();
