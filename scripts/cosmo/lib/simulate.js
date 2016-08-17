var plant = require('./plant.js');
var tectonic = require('./tectonic.js');

exports.simulateDay = function(ctx,res)
{
  plant.simulatePlants(ctx);

  res(null);
};
exports.onMonth = function(ctx,res)
{
  tectonic.advanceTectonics(ctx);
  res(null);
};
exports.onYear = function(ctx,res)
{
  res(null);
};
exports.calculateHighest=function(ctx)
{
  ctx.highest = 1;
  ctx.hottest = 0;
  ctx.highestStress = 0;
  ctx.deepest = 1;
  ctx.brightest = 1;
  ctx.wettest = 1;
  ctx.tallest = 1;

  ctx.richestNutro = 1;
  ctx.richestNucium = 1;

  ctx.richestNutroStore = 1;
  ctx.richestNuciumStore = 1;
  ctx.richestWaterStore = 1;
  ctx.tallestTree = 1;
  ctx.thirstiest = 0;;
  ctx.heliest = 0;
  ctx.youngest = 0;

  for(var z = 0 ; z < ctx.area ; z++)
  {
    ctx.highest = Math.max(ctx.highest, ctx.height[z]);
    ctx.hottest = Math.max(ctx.hottest, ctx.heat[z]);
    ctx.highestStress = Math.max(ctx.highestStress, ctx.stress[z]);
    ctx.deepest = Math.max(ctx.deepest, ctx.depth[z]);
    ctx.brightest = Math.max(ctx.brightest, ctx.sunlight[z]);
    ctx.wettest = Math.max(ctx.wettest, ctx.rainfall[z]);
    ctx.tallest = Math.max(ctx.tallest, ctx.height[z] + ctx.depth[z]);

    //  Soil
    ctx.richestNutro = Math.max(ctx.richestNutro, ctx.nt[z]);
    ctx.richestNucium= Math.max( ctx.richestNucium, ctx.nc[z]);
  }
  for(var p = 0 ; p < ctx.plantArea ; p++)
  {
    //  Stores
    if(ctx.hasPlant[p])
    {
      ctx.richestNutroStore = Math.max(ctx.richestNutroStore, ctx.ntStore[p]);  
      ctx.richestNuciumStore = Math.max(ctx.richestNuciumStore, ctx.ncStore[p]);
      ctx.richestWaterStore = Math.max(ctx.richestWaterStore, ctx.waterStore[p]);
      
      ctx.tallestTree = Math.max(ctx.tallestTree, ctx.growth[p]);
      ctx.thirstiest = Math.max(ctx.thirstiest, ctx.thirst[p]);
      ctx.heliest = Math.max(ctx.heliest, ctx.heliophilia[p]);
      ctx.youngest = Math.max(ctx.youngest, ctx.generation[p]);
    }
  }
}