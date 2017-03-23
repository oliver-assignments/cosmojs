const randomColor = require('randomcolor');

const white = [ 0, 0, 0, 0 ];
const shallowestOcean = [ 42, 21, 0, 1 ];
const deepestOcean = [ 70, 30, 0, 63 ];

const lowestValley = [ 0, 11, 32, 71 ];
const tallestMountain = [ 0, 10, 30, 4 ];

const darkest = [ 0, 12, 41, 16 ];
const brightest = [ 0, 1, 20, 5 ];

const drizzle = [ 42, 21, 0, 1 ];
const monsoon = [ 70, 30, 0, 63 ];

const weakNucium = white;
const strongNucium = [ 70, 35, 0, 43 ];

const weakNutro = white;
const strongNutro = [ 0, 61, 58, 34 ];

const sparseVegetation = white;
const thickVegetation = [ 37, 0, 60, 37 ];

const shortestPlant = sparseVegetation;
const tallestPlant = thickVegetation;

const hottest = [ 0, 88, 79, 1 ];
const coolest = [ 20, 20, 20, 1 ];

const tectonicColors = randomColor.randomColor({ count: 1000, hue: 'red' });// luminosity:'light'

function colarValueBetween(value, minValue, maxValue, bottomColor, topColor) {
  const ratio = (value - minValue) / (maxValue - minValue);

  const deltaColor = [
    bottomColor[0] - topColor[0],
    bottomColor[1] - topColor[1],
    bottomColor[2] - topColor[2],
    bottomColor[3] - topColor[3],
  ];

  return cymk = [
    Math.round(bottomColor[0] - (deltaColor[0] * ratio)),
    Math.round(bottomColor[1] - (deltaColor[1] * ratio)),
    Math.round(bottomColor[2] - (deltaColor[2] * ratio)),
    Math.round(bottomColor[3] - (deltaColor[3] * ratio)),
  ];
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex(r, g, b) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function cmykToHex(cmyk) {
  const c = cmyk[0] / 100;
  const m = cmyk[1] / 100;
  const y = cmyk[2] / 100;
  const k = cmyk[3] / 100;

  const result = {};
  result.r = 1 - Math.min(1, (c * (1 - k)) + k);
  result.g = 1 - Math.min(1, (m * (1 - k)) + k);
  result.b = 1 - Math.min(1, (y * (1 - k)) + k);

  return rgbToHex(
    Math.round(result.r * 255),
    Math.round(result.g * 255),
    Math.round(result.b * 255));
}


function addColors(a, b) {
  return [ 
  	a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2],
    a[3] + b[3]];
}

const types = {
  earth: [lowestValley, tallestMountain],
  depth: [shallowestOcean, deepestOcean],
  rainfall: [drizzle, monsoon],
  sunlight: [darkest, brightest],
  nutro: [weakNutro, strongNutro],
  nutroStore: [weakNutro, strongNutro],
  nucium: [weakNucium, strongNucium],
  nuciumStore: [weakNucium, strongNucium],
  vegetation: [sparseVegetation, thickVegetation],
}

colorize = (value, lowest, highest, type) => {
  const cmyk = colorValueBetween(value, lowest, highest, types[type][0], types[type][1]);
  return cmykToHex(cmyk);
}

module.exports = (snapshot, world, mode) => {
  for (let q = 0; q < __AREA__; q++) {
    colors.push(mode(ctx, q));
  }
}
shouldDepth = (ctx, z) => {
  return ctx.depth[z] > 0;
}
colorizeDepth = (ctx, z) => {
  return colorize(ctx.depth[z], 0, ctx.deepest, "depth");
}

depth = (ctx, q) => {
  return shouldDepth(ctx,q) ? 
    colorizeDepth(ctx,q) : 
    colorize(ctx.height[q], 0, ctx.highest, "earth");
}

// if (req.mode === 'Depth') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       colors.push(cmykToHex(colorizeEarth(ctx.height[z], ctx)));
  //     }
  //   }
  // } else if (req.mode === 'Height') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     colors.push(cmykToHex(colorizeEarth(ctx.height[z], ctx)));
  //   }
  // } else if (req.mode === 'Tectonic') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     colors.push(tectonicColors[ctx.tectonic[z] % tectonicColors.length]);
  //   }
  // } else if (req.mode === 'Asthenosphere') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     colors.push(cmykToHex(
  //       colorValueBetween(ctx.heat[z], 0, ctx.hottest, coolest, hottest)));
  //   }
  // } else if (req.mode === 'Fractures') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     colors.push(cmykToHex(
  //       colorValueBetween(ctx.fracture[z], 0, 1, coolest, hottest)));
  //   }
  // } else if (req.mode === 'Stress') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     colors.push(cmykToHex(
  //       colorValueBetween(ctx.stress[z], 0, ctx.highestStress, coolest, hottest)));
  //   }
  // } else if (req.mode === 'Satellite') {
  //   columns = ctx.plantColumns;
  //   rows = ctx.plantRows;

  //   for (let p = 0; p < ctx.plantArea; p += 1) {
  //     const z = ctx.convertPToZ(p);

  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       let plants = 0;
  //       if (ctx.hasPlant[p]) {
  //         plants = ctx.plantRowsPer * ctx.plantColumnsPer;
  //       }
  //       colors.push(cmykToHex(
  //         addColors(colorizeVegetation(plants, ctx),
  //                   colorizeEarth(ctx.height[z], ctx))));
  //     }
  //   }
  // } else if (req.mode === 'Elevation') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     colors.push(cmykToHex(
  //       colorValueBetween(ctx.height[z] + ctx.depth[z],
  //         0, ctx.tallest,
  //         lowestValley, tallestMountain)));
  //   }
  // } else if (req.mode === 'Nutro') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       colors.push(cmykToHex(colorizeNutro(ctx.nt[z], ctx)));
  //     }
  //   }
  // } else if (req.mode === 'Nucium') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       colors.push(cmykToHex(colorizeNucium(ctx.nc[z], ctx)));
  //     }
  //   }
  // } else if (req.mode === 'Nutrients') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       colors.push(cmykToHex(
  //         addColors(colorizeNutro(ctx.nt[z], ctx),
  //                   colorizeNucium(ctx.nc[z], ctx))));
  //     }
  //   }
  // } else if (req.mode === 'Sunlight') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     colors.push(cmykToHex(
  //       addColors(colorizeSunlight(ctx.sunlight[z], ctx),
  //                 colorizeEarth(ctx.height[z], ctx))));
  //   }
  // } else if (req.mode === 'Rainfall') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     colors.push(cmykToHex(
  //       addColors(colorizeRainfall(ctx.rainfall[z], ctx),
  //                 colorizeEarth(ctx.height[z], ctx))));
  //   }
  // } else if (req.mode === 'Density') {
  //   for (let z = 0; z < ctx.area; z += 1) {
  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       const plots = ctx.getPlotsOfZ(z);
  //       let numberPlants = 0;

  //       for (let p = 0; p < plots.length; p += 1) {
  //         if (ctx.hasPlant[plots[p]] === true) {
  //           numberPlants += 1;
  //         }
  //       }

  //       colors.push(cmykToHex(
  //         colorizeVegetation(
  //           numberPlants, ctx)));
  //     }
  //   }
  // } else if (req.mode === 'Nutro Stores') {
  //   columns = ctx.plantColumns;
  //   rows = ctx.plantRows;

  //   for (let p = 0; p < ctx.plantArea; p += 1) {
  //     const z = ctx.convertPToZ(p);

  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       colors.push(cmykToHex(
  //         colorizeNuciumStore(
  //           (ctx.hasPlant[p] ? ctx.ntStore[p] : 0),
  //           ctx)));
  //     }
  //   }
  // } else if (req.mode === 'Nucium Stores') {
  //   columns = ctx.plantColumns;
  //   rows = ctx.plantRows;

  //   for (let p = 0; p < ctx.plantArea; p += 1) {
  //     const z = ctx.convertPToZ(p);

  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       colors.push(cmykToHex(
  //         colorizeNutroStore(
  //           (ctx.hasPlant[p] ? ctx.ncStore[p] : 0),
  //           ctx)));
  //     }
  //   }
  // } else if (req.mode === 'Nutrient Stores') {
  //   columns = ctx.plantColumns;
  //   rows = ctx.plantRows;

  //   for (let p = 0; p < ctx.plantArea; p += 1) {
  //     const z = ctx.convertPToZ(p);

  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       colors.push(cmykToHex(
  //         addColors(colorizeNutroStore((ctx.hasPlant[p] ? ctx.ntStore[p] : 0), ctx),
  //                   colorizeNuciumStore((ctx.hasPlant[p] ? ctx.ncStore[p] : 0), ctx))));
  //     }
  //   }
  // } else if (req.mode === 'Generation') {
  //   columns = ctx.plantColumns;
  //   rows = ctx.plantRows;

  //   for (let p = 0; p < ctx.plantArea; p += 1) {
  //     const z = ctx.convertPToZ(p);

  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       if (!ctx.youngest) {
  //         ctx.youngest = 1;
  //       }

  //       if (ctx.hasPlant[p]) {
  //         colors.push(cmykToHex(
  //           colorValueBetween(ctx.generation[p], 0, ctx.youngest, tallestPlant, shortestPlant)));
  //       } else {
  //         colors.push(cmykToHex(white));
  //       }
  //     }
  //   }
  // } else if (req.mode === 'Growth') {
  //   columns = ctx.plantColumns;
  //   rows = ctx.plantRows;

  //   for (let p = 0; p < ctx.plantArea; p += 1) {
  //     const z = ctx.convertPToZ(p);

  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       colors.push(cmykToHex(
  //         colorValueBetween(
  //           (ctx.hasPlant[p] ? ctx.growth[p] : 0),
  //           0, ctx.tallestTree, shortestPlant, tallestPlant)));
  //     }
  //   }
  // } else if (req.mode === 'Thirst') {
  //   columns = ctx.plantColumns;
  //   rows = ctx.plantRows;

  //   for (let p = 0; p < ctx.plantArea; p += 1) {
  //     const z = ctx.convertPToZ(p);

  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       colors.push(
  //         cmykToHex(
  //           colorValueBetween(
  //               (ctx.hasPlant[p] ? ctx.thirst[p] : 0),
  //               0, ctx.thirstiest, drizzle, monsoon)));
  //     }
  //   }
  // } else if (req.mode === 'Heliophilia') {
  //   columns = ctx.plantColumns;
  //   rows = ctx.plantRows;

  //   for (let p = 0; p < ctx.plantArea; p += 1) {
  //     const z = ctx.convertPToZ(p);

  //     if (ctx.depth[z] > 0) {
  //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
  //     } else {
  //       colors.push(
  //         cmykToHex(
  //           colorValueBetween(
  //             (ctx.hasPlant[p] ? ctx.heliophilia[p] : 0),
  //             0, ctx.heliest, lowestValley, brightest)));
  //     }
  //   }
  // } else {
  //   res(`${req.mode} doesn't exist.`);
  //   return;
  // }


/*
function colorizeEarth(value, ctx) {
  return color.colarValueBetween(value, 0, ctx.highest, lowestValley, tallestMountain);
}
function colorizeWater(value, ctx) {
  return color.colarValueBetween(value, 0, ctx.deepest, shallowestOcean, deepestOcean);
}

function colorizeRainfall(value, ctx) {
  return color.colarValueBetween(value, 0, ctx.wettest, drizzle, monsoon);
}

function colorizeSunlight(value, ctx) {
  return color.colarValueBetween(value, 1, ctx.brightest, darkest, brightest);
}

function colorizeNutro(value, ctx) {
  return color.colarValueBetween(value, 0, ctx.richestNutro, weakNutro, strongNutro);
}

function colorizeNucium(value, ctx) {
  return color.colarValueBetween(value, 0, ctx.richestNucium, weakNucium, strongNucium);
}

function colorizeNutroStore(value, ctx) {
  return color.colarValueBetween(value, 0, ctx.richestNutroStore, weakNutro, strongNutro);
}
function colorizeNuciumStore(value, ctx) {
  return color.colarValueBetween(value, 0, ctx.richestNuciumStore, weakNucium, strongNucium);
}

function colorizeVegetation(value, ctx) {
  return color.colarValueBetween(value, 0,
    ctx.plantColumnsPer * ctx.plantRowsPer,
    sparseVegetation, thickVegetation);
}
*/