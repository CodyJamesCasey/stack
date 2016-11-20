const yellowAsset = require('svg/yellow.svg');
const cyanAsset = require('svg/cyan.svg');
const magentaAsset = require('svg/magenta.svg');

const lineAsset = require('svg/line.svg');

const assets = {
  yellow: {
    asset: yellowAsset,
    type: 'queue-item',
  },
  cyan: {
    asset: cyanAsset,
    type: 'queue-item',
  },
  magenta: {
    asset: magentaAsset,
    type: 'queue-item',
  },

  line: {
    asset: lineAsset,
    type: 'scenery',
  },
}

export default assets;
