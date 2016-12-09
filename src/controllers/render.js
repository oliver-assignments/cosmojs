// const manager = require('./manager.js');
// const randomColor = require('randomcolor');

// const white = { c: 0, m: 0, y: 0, k: 0 };
// const shallowestOcean = { c: 42, m: 21, y: 0, k: 1 };
// const deepestOcean = { c: 70, m: 30, y: 0, k: 63 };

// const lowestValley = { c: 0, m: 11, y: 32, k: 71 };
// const tallestMountain = { c: 0, m: 10, y: 30, k: 4 };

// const darkest = { c: 0, m: 12, y: 41, k: 16 };
// const brightest = { c: 0, m: 1, y: 20, k: 5 };

// const drizzle = { c: 42, m: 21, y: 0, k: 1 };
// const monsoon = { c: 70, m: 30, y: 0, k: 63 };

// const weakNucium = white;
// const strongNucium = { c: 70, m: 35, y: 0, k: 43 };

// const weakNutro = white;
// const strongNutro = { c: 0, m: 61, y: 58, k: 34 };

// const sparseVegetation = white;
// const thickVegetation = { c: 37, m: 0, y: 60, k: 37 };

// const shortestPlant = sparseVegetation;
// const tallestPlant = thickVegetation;

// const hottest = { c: 0, m: 88, y: 79, k: 1 };
// const coolest = { c: 20, m: 20, y: 20, k: 1 };

// const tectonicColors = randomColor.randomColor({ count: 1000, hue: 'red' });// luminosity:'light'

// function colorValueBetween(value, minValue, maxValue, bottomColor, topColor) {
//   const ratio = (value - minValue) / (maxValue - minValue);

//   const deltaColor = {
//     c: bottomColor.c - topColor.c,
//     m: bottomColor.m - topColor.m,
//     y: bottomColor.y - topColor.y,
//     k: bottomColor.k - topColor.k,
//   };

//   const cymk = {
//     c: Math.round(bottomColor.c - (deltaColor.c * ratio)),
//     m: Math.round(bottomColor.m - (deltaColor.m * ratio)),
//     y: Math.round(bottomColor.y - (deltaColor.y * ratio)),
//     k: Math.round(bottomColor.k - (deltaColor.k * ratio)),
//   };
//   return cymk;
// }

// function componentToHex(c) {
//   const hex = c.toString(16);
//   return hex.length === 1 ? `0${hex}` : hex;
// }

// function rgbToHex(r, g, b) {
//   return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
// }

// function cmykToHex(cmyk) {
//   const c = cmyk.c / 100;
//   const m = cmyk.m / 100;
//   const y = cmyk.y / 100;
//   const k = cmyk.k / 100;

//   const result = {};
//   result.r = 1 - Math.min(1, (c * (1 - k)) + k);
//   result.g = 1 - Math.min(1, (m * (1 - k)) + k);
//   result.b = 1 - Math.min(1, (y * (1 - k)) + k);

//   return rgbToHex(
//     Math.round(result.r * 255),
//     Math.round(result.g * 255),
//     Math.round(result.b * 255));
// }


// function addColors(a, b) {
//   return { c: a.c + b.c,
//     m: a.m + b.m,
//     y: a.y + b.y,
//     k: a.k + b.k };
// }

// function colorizeEarth(value, ctx) {
//   return colorValueBetween(value, 0, ctx.highest, lowestValley, tallestMountain);
// }
// function colorizeWater(value, ctx) {
//   return colorValueBetween(value, 0, ctx.deepest, shallowestOcean, deepestOcean);
// }

// function colorizeRainfall(value, ctx) {
//   return colorValueBetween(value, 0, ctx.wettest, drizzle, monsoon);
// }

// function colorizeSunlight(value, ctx) {
//   return colorValueBetween(value, 1, ctx.brightest, darkest, brightest);
// }

// function colorizeNutro(value, ctx) {
//   return colorValueBetween(value, 0, ctx.richestNutro, weakNutro, strongNutro);
// }

// function colorizeNucium(value, ctx) {
//   return colorValueBetween(value, 0, ctx.richestNucium, weakNucium, strongNucium);
// }

// function colorizeNutroStore(value, ctx) {
//   return colorValueBetween(value, 0, ctx.richestNutroStore, weakNutro, strongNutro);
// }
// function colorizeNuciumStore(value, ctx) {
//   return colorValueBetween(value, 0, ctx.richestNuciumStore, weakNucium, strongNucium);
// }

// function colorizeVegetation(value, ctx) {
//   return colorValueBetween(value, 0,
//     ctx.plantColumnsPer * ctx.plantRowsPer,
//     sparseVegetation, thickVegetation);
// }

// module.exports.renderSimulationContextWithMode = (req, res) => {
//   Snapshot.SnapshotModel.findById(req.params.id, (err, snapshot) => {
//     if (err) {
//       return res.status(400).json(err);
//     }
//     const mode = req.params.mode;

//     module.exports.mapModes[mode](snapshot, res);
//   });
// };

// // const mapModes = {};
// // mapModes.Depth = (ctx, columns, rows, colors) => {
// //   for (let z = 0; z < ctx.area; z += 1) {
// //     if (ctx.depth[z] > 0) {
// //       colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
// //     } else {
// //       colors.push(cmykToHex(colorizeEarth(ctx.height[z], ctx)));
// //     }
// //   }
// // };

// const mapModes = new Array();

// mapModes.Depth = [
//   {
//     datasets: [
//       'depth',
//       'height',
//     ],
//     expressions: [
//       {
//         value: 'depth',
//         is: '>',
//         other: 0,
//       },
//     ],
//     render: [
//       {
//         plots: false,
//         value: 'depth',
//         minColor: shallowestOcean,
//         maxColor: deepestOcean,
//       },
//     ],
//   },
//   {
//     expressions: [
//       {
//         value: 'depth',
//         is: '==',
//         other: 0,
//       },
//     ],
//     render: [
//       {
//         plots: false,
//         value: 'height',
//         minColor: lowestValley,
//         maxColor: tallestMountain,
//       },
//     ],
//   },
// ];

// function getDataset(datasets, datasetName) {
//   for (let d = 0; d < datasets.length; d++) {
//     if (datasets[d].name == datasetName)     {
//       return datasets[d];
//     }
//   }
//   return null;
// }


// module.exports.render = (snapshot, world, mode, res) => {
//  // const renderInstructions = mapModes[mode];
//  // if(!renderInstructions) return res.status(400).json("No mode named " + mode + ".");

//  // //  Find the data within the snapshot
//  // const data = getDataset(snapshot.datasets, mode);
//  // if(!data) return res.status(400).json("No dataset named " + mode + ".");


//   const renderInstructions = {
//     colors: [],
//     columns: mapModes[mode].plots ? world.columns * plotsPer : world.columns,
//     rows: mapModes[mode].plots ? world.rows * plotsPer : world.rows,
//   };
//   const data = getDataset(snapshot.datasets, 'depth');


//   if (req.mode === 'Depth') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       if (world.datasets.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         colors.push(cmykToHex(colorizeEarth(ctx.height[z], ctx)));
//       }
//     }
//   }


//   // let columns = ctx.columns;
//   // let rows = ctx.rows;

//   // mapModes[req.mode](ctx, columns, rows, colors);

//   if (req.mode === 'Depth') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         colors.push(cmykToHex(colorizeEarth(ctx.height[z], ctx)));
//       }
//     }
//   } else if (req.mode === 'Height') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       colors.push(cmykToHex(colorizeEarth(ctx.height[z], ctx)));
//     }
//   } else if (req.mode === 'Tectonic') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       colors.push(tectonicColors[ctx.tectonic[z] % tectonicColors.length]);
//     }
//   } else if (req.mode === 'Asthenosphere') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       colors.push(cmykToHex(
//         colorValueBetween(ctx.heat[z], 0, ctx.hottest, coolest, hottest)));
//     }
//   } else if (req.mode === 'Fractures') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       colors.push(cmykToHex(
//         colorValueBetween(ctx.fracture[z], 0, 1, coolest, hottest)));
//     }
//   } else if (req.mode === 'Stress') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       colors.push(cmykToHex(
//         colorValueBetween(ctx.stress[z], 0, ctx.highestStress, coolest, hottest)));
//     }
//   } else if (req.mode === 'Satellite') {
//     columns = ctx.plantColumns;
//     rows = ctx.plantRows;

//     for (let p = 0; p < ctx.plantArea; p += 1) {
//       const z = ctx.convertPToZ(p);

//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         let plants = 0;
//         if (ctx.hasPlant[p]) {
//           plants = ctx.plantRowsPer * ctx.plantColumnsPer;
//         }
//         colors.push(cmykToHex(
//           addColors(colorizeVegetation(plants, ctx),
//                     colorizeEarth(ctx.height[z], ctx))));
//       }
//     }
//   } else if (req.mode === 'Elevation') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       colors.push(cmykToHex(
//         colorValueBetween(ctx.height[z] + ctx.depth[z],
//           0, ctx.tallest,
//           lowestValley, tallestMountain)));
//     }
//   } else if (req.mode === 'Nutro') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         colors.push(cmykToHex(colorizeNutro(ctx.nt[z], ctx)));
//       }
//     }
//   } else if (req.mode === 'Nucium') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         colors.push(cmykToHex(colorizeNucium(ctx.nc[z], ctx)));
//       }
//     }
//   } else if (req.mode === 'Nutrients') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         colors.push(cmykToHex(
//           addColors(colorizeNutro(ctx.nt[z], ctx),
//                     colorizeNucium(ctx.nc[z], ctx))));
//       }
//     }
//   } else if (req.mode === 'Sunlight') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       colors.push(cmykToHex(
//         addColors(colorizeSunlight(ctx.sunlight[z], ctx),
//                   colorizeEarth(ctx.height[z], ctx))));
//     }
//   } else if (req.mode === 'Rainfall') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       colors.push(cmykToHex(
//         addColors(colorizeRainfall(ctx.rainfall[z], ctx),
//                   colorizeEarth(ctx.height[z], ctx))));
//     }
//   } else if (req.mode === 'Density') {
//     for (let z = 0; z < ctx.area; z += 1) {
//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         const plots = ctx.getPlotsOfZ(z);
//         let numberPlants = 0;

//         for (let p = 0; p < plots.length; p += 1) {
//           if (ctx.hasPlant[plots[p]] === true) {
//             numberPlants += 1;
//           }
//         }

//         colors.push(cmykToHex(
//           colorizeVegetation(
//             numberPlants, ctx)));
//       }
//     }
//   } else if (req.mode === 'Nutro Stores') {
//     columns = ctx.plantColumns;
//     rows = ctx.plantRows;

//     for (let p = 0; p < ctx.plantArea; p += 1) {
//       const z = ctx.convertPToZ(p);

//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         colors.push(cmykToHex(
//           colorizeNuciumStore(
//             (ctx.hasPlant[p] ? ctx.ntStore[p] : 0),
//             ctx)));
//       }
//     }
//   } else if (req.mode === 'Nucium Stores') {
//     columns = ctx.plantColumns;
//     rows = ctx.plantRows;

//     for (let p = 0; p < ctx.plantArea; p += 1) {
//       const z = ctx.convertPToZ(p);

//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         colors.push(cmykToHex(
//           colorizeNutroStore(
//             (ctx.hasPlant[p] ? ctx.ncStore[p] : 0),
//             ctx)));
//       }
//     }
//   } else if (req.mode === 'Nutrient Stores') {
//     columns = ctx.plantColumns;
//     rows = ctx.plantRows;

//     for (let p = 0; p < ctx.plantArea; p += 1) {
//       const z = ctx.convertPToZ(p);

//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         colors.push(cmykToHex(
//           addColors(colorizeNutroStore((ctx.hasPlant[p] ? ctx.ntStore[p] : 0), ctx),
//                     colorizeNuciumStore((ctx.hasPlant[p] ? ctx.ncStore[p] : 0), ctx))));
//       }
//     }
//   } else if (req.mode === 'Generation') {
//     columns = ctx.plantColumns;
//     rows = ctx.plantRows;

//     for (let p = 0; p < ctx.plantArea; p += 1) {
//       const z = ctx.convertPToZ(p);

//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         if (!ctx.youngest) {
//           ctx.youngest = 1;
//         }

//         if (ctx.hasPlant[p]) {
//           colors.push(cmykToHex(
//             colorValueBetween(ctx.generation[p], 0, ctx.youngest, tallestPlant, shortestPlant)));
//         } else {
//           colors.push(cmykToHex(white));
//         }
//       }
//     }
//   } else if (req.mode === 'Growth') {
//     columns = ctx.plantColumns;
//     rows = ctx.plantRows;

//     for (let p = 0; p < ctx.plantArea; p += 1) {
//       const z = ctx.convertPToZ(p);

//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         colors.push(cmykToHex(
//           colorValueBetween(
//             (ctx.hasPlant[p] ? ctx.growth[p] : 0),
//             0, ctx.tallestTree, shortestPlant, tallestPlant)));
//       }
//     }
//   } else if (req.mode === 'Thirst') {
//     columns = ctx.plantColumns;
//     rows = ctx.plantRows;

//     for (let p = 0; p < ctx.plantArea; p += 1) {
//       const z = ctx.convertPToZ(p);

//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         colors.push(
//           cmykToHex(
//             colorValueBetween(
//                 (ctx.hasPlant[p] ? ctx.thirst[p] : 0),
//                 0, ctx.thirstiest, drizzle, monsoon)));
//       }
//     }
//   } else if (req.mode === 'Heliophilia') {
//     columns = ctx.plantColumns;
//     rows = ctx.plantRows;

//     for (let p = 0; p < ctx.plantArea; p += 1) {
//       const z = ctx.convertPToZ(p);

//       if (ctx.depth[z] > 0) {
//         colors.push(cmykToHex(colorizeWater(ctx.depth[z], ctx)));
//       } else {
//         colors.push(
//           cmykToHex(
//             colorValueBetween(
//               (ctx.hasPlant[p] ? ctx.heliophilia[p] : 0),
//               0, ctx.heliest, lowestValley, brightest)));
//       }
//     }
//   } else {
//     res(`${req.mode} doesn't exist.`);
//     return;
//   }
//   res(null,
//     {
//       colors,
//       columns,
//       rows,
//     });
// };
