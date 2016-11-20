const circleYellowAsset = require('svg/yellow.svg');
const circleCyanAsset = require('svg/cyan.svg');
const circleMagentaAsset = require('svg/magenta.svg');
const squareYellowAsset = require('svg/ysquare.svg');
const squareCyanAsset = require('svg/csquare.svg');
const squareMagentaAsset = require('svg/msquare.svg');
const triangleYellowAsset = require('svg/ytri.svg');
const triangleCyanAsset = require('svg/ctri.svg');
const triangleMagentaAsset = require('svg/mtri.svg');

const yellowPowerUpAsset = require('svg/ygrow.svg');
const cyanPowerUpAsset = require('svg/cgrow.svg');
const magentaPowerUpAsset = require('svg/mgrow.svg');

const lineAsset = require('svg/line.svg');
const backgroundAsset = require('svg/background.svg');

const endLossAsset = require('svg/endloss.svg');
const endWinAsset = require('svg/endwin.svg');

const assets = {
  circleYellow: {
    asset: circleYellowAsset,
    type: 'queue-item-circle-yellow',
  },
  circleCyan: {
    asset: circleCyanAsset,
    type: 'queue-item-circle-cyan',
  },
  circleMagenta: {
    asset: circleMagentaAsset,
    type: 'queue-item-circle-magenta',
  },
  squareYellow: {
    asset: squareYellowAsset,
    type: 'queue-item-square-yellow',
  },
  squareCyan: {
    asset: squareCyanAsset,
    type: 'queue-item-square-cyan',
  },
  squareMagenta: {
    asset: squareMagentaAsset,
    type: 'queue-item-square-magenta',
  },
  triangleYellow: {
    asset: triangleYellowAsset,
    type: 'queue-item-triangle-yellow',
  },
  triangleCyan: {
    asset: triangleCyanAsset,
    type: 'queue-item-triangle-cyan',
  },
  triangleMagenta: {
    asset: triangleMagentaAsset,
    type: 'queue-item-triangle-magenta',
  },

  yellowPowerUp: {
    asset: yellowPowerUpAsset,
    type: 'queue-item-power-up-grow-yellow',
  },

  cyanPowerUp: {
    asset: cyanPowerUpAsset,
    type: 'queue-item-power-up-grow-cyan',
  },

  magentaPowerUp: {
    asset: magentaPowerUpAsset,
    type: 'queue-item-power-up-grow-magenta',
  },

  line: {
    asset: lineAsset,
    type: 'scenery',
  },
  background: {
    asset: backgroundAsset,
    type: 'scenery',
  },
  endLoss: {
    asset: endLossAsset,
    type: 'scenery',
  },
  endWin: {
    asset: endWinAsset,
    type: 'scenery',
  }
}

export default assets;
