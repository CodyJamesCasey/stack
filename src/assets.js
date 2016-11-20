const circleYellowAsset = require('svg/yellow.svg');
const circleCyanAsset = require('svg/cyan.svg');
const circleMagentaAsset = require('svg/magenta.svg');
const squareYellowAsset = require('svg/ysquare.svg');
const squareCyanAsset = require('svg/csquare.svg');
const squareMagentaAsset = require('svg/msquare.svg');
const triangleYellowAsset = require('svg/ytri.svg');
const triangleCyanAsset = require('svg/ctri.svg');
const triangleMagentaAsset = require('svg/mtri.svg');

const yellowPowerUpAsset = require('svg/ygrow');
const cyanPowerUpAsset = require('svg/cgrow');
const magentaPowerUpAsset = require('svg/mgrow');

const lineAsset = require('svg/line.svg');
const backgroundAsset = require('svg/background.svg');

const assets = {
  circleYellow: {
    asset: circleYellowAsset,
    type: 'queue-item-circle',
  },
  circleCyan: {
    asset: circleCyanAsset,
    type: 'queue-item-circle',
  },
  circleMagenta: {
    asset: circleMagentaAsset,
    type: 'queue-item-circle',
  },
  squareYellow: {
    asset: squareYellowAsset,
    type: 'queue-item-square',
  },
  squareCyan: {
    asset: squareCyanAsset,
    type: 'queue-item-square',
  },
  squareMagenta: {
    asset: squareMagentaAsset,
    type: 'queue-item-square',
  },
    triangleYellow: {
    asset: triangleYellowAsset,
    type: 'queue-item-triangle',
  },
  triangleCyan: {
    asset: triangleCyanAsset,
    type: 'queue-item-triangle',
  },
  triangleMagenta: {
    asset: triangleMagentaAsset,
    type: 'queue-item-triangle',
  },

  yellowPowerUp: {
    asset: yellowPowerUpAsset,
    type: 'queue-item-yellow-power-up-grow',
  },

  cyanPowerUp: {
    asset: cyanPowerUpAsset,
    type: 'queue-item-cyan-power-up-grow',
  },

  magentaPowerUp: {
    asset: magentaPowerUpAsset,
    type: 'queue-item-magenta-power-up-grow',
  },

  line: {
    asset: lineAsset,
    type: 'scenery',
  },
  background: {
    asset: backgroundAsset,
    type: 'scenery',
  }
}

export default assets;
