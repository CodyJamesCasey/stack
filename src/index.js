import Matter from 'matter-js';

import Assets from 'assets';
import CanvasScreen from 'screen';

import 'main.scss';

// module aliases
const {
  Engine,
  World,
  Body,
  Bodies,
} = Matter;

const canvasModel = {
  height: 1920,
  width: 1080,
};

const canvas = document.getElementById('canvas');
canvas.style.height = CanvasScreen.size.height + 'px';
canvas.style.width = CanvasScreen.size.width + 'px';

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

window.addEventListener('resize', () => {
  CanvasScreen.setNewCanvasScreen();
  canvas.style.height = CanvasScreen.size.height + 'px';
  canvas.style.width = CanvasScreen.size.width + 'px';
});

const defaultCategory = 0x0001;
const ballCategory = 0x0002;
const nextItemCategory = 0x0004;

const generateRandomItem = () => {
  const queueItems = Object.keys(Assets)
    .filter(key => Assets[key].type === 'queue-item')
    .map((key) => {
      return Assets[key];
    });
  return queueItems[Math.floor(Math.random() * queueItems.length)];
}

const itemQueue = [
  generateRandomItem(),
  generateRandomItem(),
  generateRandomItem(),
];

canvas.addEventListener('mousemove', (event) => {
  const { offsetX } = event;
  const canvasRect = canvas.getBoundingClientRect();

  const xPos = canvasModel.width / (canvasRect.width / offsetX);
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
      mask: defaultCategory | nextItemCategory,
    },
    render: {
      sprite: {
        texture: nextQueueItem.asset,
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
      mask: defaultCategory | ballCategory,
    },
    render: {
      sprite: {
        texture: queueItem.asset,
      }
    }
  });

  const nextQueueItem = itemQueue[itemQueue.length - 1];
  const newNextItem = Bodies.circle(x, y, 90, {
    isStatic: true,
    label: 'next-item',
    collisionFilter: {
      category: nextItemCategory,
      mask: defaultCategory | nextItemCategory,
    },
    render: {
      sprite: {
        texture: nextQueueItem.asset,
      }
    }
  });

  World.add(engine.world, [ball, newNextItem]);

  itemQueue.unshift(generateRandomItem());
});

//add walls
World.add(engine.world, Bodies.rectangle(0, 960, 1, 1920, {
  isStatic: true,
  label: 'wall',
  collisionFilter: {
    category: defaultCategory,
  },
}));

World.add(engine.world, Bodies.rectangle(1080, 960, 1, 1920, {
  isStatic: true,
  label: 'wall',
  collisionFilter: {
    category: defaultCategory,
  },
}));

//add bottom wall
World.add(engine.world, Bodies.rectangle(0, 1920, 1080, 1, {
  isStatic: true,
  label: 'game-shape',
  collisionFilter: {
    category: defaultCategory,
  },
}));

window.setInterval(() => {
  engine.world.bodies.filter(body => body.label === 'game-shape').forEach((body) => {
    if (body.isStatic) {
      Body.setPosition(body, {
        x: body.position.x,
        y: body.position.y + 1,
      });
    }
  });

  engine.world.bodies.filter(body => body.label === 'game-shape').forEach((body) => {
    if (body.bounds.min.y > 1920) {
      body.isStatic = true;
    }
  });

  engine.world.bodies.filter(body => body.label === 'game-shape').forEach((body) => {
    if (body.bounds.min.y > 2200) {
      World.remove(engine.world, body);
    }
  });
}, 50);

Engine.run(engine);
