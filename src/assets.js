const yellowAsset = require('svg/yellow.svg');
const cyanAsset = require('svg/cyan.svg');
const magentaAsset = require('svg/magenta.svg');

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
