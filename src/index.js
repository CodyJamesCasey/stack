import Matter from 'matter-js';

import Assets from 'assets';
import CanvasScreen from 'screen';

import 'main.scss';
const song = require('audio/13 - Just Out Of Reach.mp3');
const audio = new Audio(song);
audio.loop = true;
audio.play();

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
    if ((bodyA.label === 'line' && bodyB.velocity.y <= 3) ||
      (bodyB.label === 'line' && bodyA.velocity.y <= 3)) {
      return true
    }
  });

  if (found) {
    win = true;
    engine.world.bodies.filter(body => body.label.includes('game-shape')).forEach((body) => {
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
    .filter(key => Assets[key].type.includes('queue-item'))
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

const powerUpGrow = (body) => {
  if (body.doneScaled) { return; }
  body.doneScaled = true;
  Body.scale(body, 2, 2);
  body.render.sprite.xScale = 2;
  body.render.sprite.yScale = 2;
  console.log('reward');
}

const powerUpFail = (color) => {
  const deletedBodies = [];
  engine.world.bodies.filter(body => body.label.includes(color) && body.label.indexOf('game-shape') === -1).forEach((body) => {
    deletedBodies.push(body);
    World.remove(engine.world, body);
    console.log('punish');
  });
}

Events.on(engine, 'collisionStart', (collision) => {
  collision.pairs.forEach((pair) => {
    const { bodyA, bodyB } = pair;
    let powerUpBody = null;
    let colorBody = null;
    if (bodyA.label.includes('power-up')
      && bodyB.label.includes('queue-item')
      && bodyB.label.indexOf('power-up') === -1) {
      powerUpBody = bodyA;
      colorBody = bodyB;
    } else if (bodyB.label.includes('power-up')
      && bodyA.label.includes('queue-item')
      && bodyA.label.indexOf('power-up') === -1) {
      powerUpBody = bodyB;
      colorBody = bodyA;
    }

    if (!powerUpBody || !colorBody) { return; }

    if (powerUpBody.label.includes('magenta') && colorBody.label.includes('magenta')) {
      if (powerUpBody.label.includes('grow')) {
        powerUpGrow(colorBody);
      }
    } else if (powerUpBody.label.includes('cyan') && colorBody.label.includes('cyan')) {
      if (powerUpBody.label.includes('grow')) {
        powerUpGrow(colorBody);
      }
    } else if (powerUpBody.label.includes('yellow') && colorBody.label.includes('yellow')) {
      if (powerUpBody.label.includes('grow')) {
        powerUpGrow(colorBody);
      }
    } else {
      let color = null;
      if (colorBody.label.indexOf('magenta') > -1) { color = 'magenta'; }
      if (colorBody.label.indexOf('cyan') > -1) { color = 'cyan'; }
      if (colorBody.label.indexOf('yellow') > -1) { color = 'yellow'; }
      powerUpFail(color);
    }

    World.remove(engine.world, powerUpBody);
  });
});

const renderQueue = () => {
  const queueItemRender = [];
  let x = 90;
  const y = 90;
  engine.world.bodies.filter(body => body.label.includes('queue-item') && !body.label.includes('game-shape')).forEach((body) => {
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

let clickSuspend = false;
window.addEventListener('mousedown', () => {
  if (win || lose || clickSuspend) { return; }
  clickSuspend = true;
  let x;
  let y;

  engine.world.bodies.filter(body => body.label === 'next-item').forEach((body) => {
    x = body.position.x;
    y = body.position.y;
    World.remove(engine.world, body);
  });

  const queueItem = itemQueue.pop();

  const ball = Bodies.circle(x, y, 90, {
    label: 'game-shape-' + queueItem.type,
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

  window.setTimeout(() => {
    clickSuspend = false;
  }, 500);
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
          texture: Assets.endLoss.asset,
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

  const stillAlive = engine.world.bodies.filter(body => body.label.includes('game-shape')).some((body) => {
    return !body.isStatic;
  });

  if (!stillAlive) {
    lose = true;
    return;
  }

  engine.world.bodies.filter(body => body.label.includes('game-shape') || body.label === 'floor').forEach((body) => {
    if (body.isStatic) {
      Body.setPosition(body, {
        x: body.position.x,
        y: body.position.y + 1,
      });
    }
  });

  engine.world.bodies.filter(body => body.label.includes('game-shape') || body.label === 'floor').forEach((body) => {
    if (body.bounds.min.y > 1920) {
      body.isStatic = true;
    }
  });

  engine.world.bodies.filter(body => body.label.includes('game-shape') || body.label === 'floor').forEach((body) => {
    if (body.bounds.min.y > 2500) {
      World.remove(engine.world, body);
    }
  });
}, 40);

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
