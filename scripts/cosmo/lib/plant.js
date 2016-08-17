'use strict';
var utility = require('./utility.js');

exports.SprayPlants = function(ctx)
{
  var plantOrder = new Array(ctx.plantArea);
  for (var i = 0; i < ctx.plantArea; ++i) { plantOrder[i] = i; }
  plantOrder = utility.shuffle(plantOrder);

  //  Simulations
  for(var q = 0 ; q < ctx.plantArea ; q++)
  {
    var p = plantOrder[q];
    var z = ctx.ConvertPToZ(p);

    if(Math.random()>0.95)
    {
      ctx.ntConsumption[p] = utility.randomNumberBetween(6,10);
      ctx.ntMetabolism[p] = utility.randomNumberBetween(1,3);
      ctx.ntEndowment[p] = utility.randomNumberBetween(1,3);

      ctx.ncConsumption[p] = utility.randomNumberBetween(6,10);
      ctx.ncMetabolism[p] = utility.randomNumberBetween(1,3);
      ctx.ncEndowment[p] = utility.randomNumberBetween(1,3);

      ctx.numberSeeds[p] = utility.randomNumberBetween(1,3);
      ctx.requiredGrowth[p] = utility.randomNumberBetween(5,10);
      ctx.seedSpread[p] = utility.randomNumberBetween(1,3);

      ctx.thirst[p] = utility.randomNumberBetween(1,99);
      ctx.heliophilia[p] = utility.randomNumberBetween(1,99);

      ctx.ntStore[p] = 1;
      ctx.ncStore[p] = 1;
      ctx.waterStore[p] = 1;
      ctx.growth[p] = 0;
      ctx.hasPlant[p] = true;
      ctx.generation[p] = 0;
    }    
  }
};

exports.simulatePlants = function(ctx)
{
  //  Seeds
  var seeds = new Array(ctx.plantArea);
  for (var i = 0; i < ctx.plantArea; ++i) { seeds[i] = null; }

  //  Randomizing plant order for fairness
  var plantOrder = new Array(ctx.plantArea);
  for (var i = 0; i < ctx.plantArea; ++i) { plantOrder[i] = i; }
  plantOrder = utility.shuffle(plantOrder);

  //  Simulations
  for(var q = 0 ; q < ctx.plantArea ; q++)
  {
  var p = plantOrder[q];
  var z = ctx.ConvertPToZ(p);

  if( ctx.depth[z] > 0 || !ctx.hasPlant[p] )
  {
    exports.killPlant(p,z,ctx)// No plant here
    continue;
  }

  if(ctx.numberSeeds[p] < 1){
    exports.killPlant(p,z,ctx,"Number seeds less than 1: " + ctx.numberSeeds[p], false);
    continue;
  }
  if(ctx.ntEndowment[p] < 0){
    exports.killPlant(p,z,ctx,"ctx.ntEndowment[p] is less than 0 : "+ ctx.ntEndowment[p], false);
    continue;
  }
  if(ctx.ncEndowment[p] < 0){
    exports.killPlant(p,z,ctx,"ctx.ncEndowment[p] is less than 0 : " + ctx.ncEndowment[p], false);
    continue;
  }

  //  nt Consumption
  if(ctx.nt[z] > 0)
  {
    if(ctx.nt[z] - ctx.ntConsumption[p] >= 0)
    {
    ctx.ntStore[p] += ctx.ntConsumption[p];
    ctx.nt[z] -= ctx.ntConsumption[p];
    }
    else 
    {
    ctx.ntStore[p] += ctx.nt[z];
    ctx.nt[z] = 0;
    }
  }
  ctx.ntStore[p] -= ctx.ntMetabolism[p];
  
  //  nc Consumption
  if(ctx.nc[z] > 0)
  {
    if(ctx.nc[z] - ctx.ncConsumption[p] >= 0)
    {
    ctx.ncStore[p] += ctx.ncConsumption[p];
    ctx.nc[z] -= ctx.ncConsumption[p];
    }
    else 
    {
    ctx.ncStore[p] += ctx.nc[z];
    ctx.nc[z] = 0;
    }
  }
  ctx.ncStore[p] -= ctx.ncMetabolism[p];

  //  Water
  if(ctx.rules.water)
  {
    if(ctx.rainfall[z] - ctx.thirst[p] < 0 || ctx.rainfall[z] - ctx.thirst[p] > 50)
    {
      exports.killPlant(p,z,ctx, "So thirst..." + (ctx.rainfall[z] - ctx.thirst[p]), false);
    }
  }
  if(ctx.rules.heliophilia)
  {
    if(ctx.sunlight[z] - ctx.heliophilia[p] < 0 || ctx.sunlight[z] - ctx.heliophilia[p] > 50)
    {
      exports.killPlant(p,z,ctx, "So cold..." + (ctx.sunlight[z] - ctx.heliophilia[p]), false);
    }
  }

  //  Root competition
  if(ctx.rules.roots && Number(ctx.rules.roots > 0) && Number(ctx.rules.roots < 9)) {
    var numberNeighbors = 0;
    var neighbors = ctx.GetPlantNeighbors(p,true);
    for(var n = 0 ; n < neighbors.length ; n++)
    {
    if(ctx.hasPlant[neighbors[n]])
      numberNeighbors++;
    }
    if(numberNeighbors >= Number(ctx.rules.roots))
    {
    exports.killPlant(p,z,ctx, "Roots with " + numberNeighbors + " neighbors.")
    continue;
    }
  }

  if(true)//ctx.rules.nutrientConversion)
  {
    var conversionRate = 1;
    if(ctx.ntStore[p] < 0 && ctx.ncStore[p] > -ctx.ntStore[p] * conversionRate)
    {
    //  We have nc to convert to nt
    ctx.ntStore[p] += ctx.ncStore[p] * conversionRate;
    ctx.ncStore[p] -= -ctx.ntStore[p];
    }
    else if(ctx.ncStore[p] < 0 && ctx.ntStore[p] > -ctx.ncStore[p] *conversionRate)
    {
    //  We have nc to convert to nt
    ctx.ncStore[p] += ctx.ntStore[p] * conversionRate;
    ctx.ntStore[p] -= -ctx.ncStore[p];
    }
  }

  //  Starvation
  if(ctx.ntStore[p] < 0 || ctx.ncStore[p] < 0)
  {
    exports.killPlant(p,z,ctx, "Starvation: nt " + ctx.ntStore[p] + " nc " + ctx.ncStore[p]);//, "Starvation with nt: " + ctx.ntStore[p] + ", nc: "+ ctx.ncStore[p]);
    continue;
  }

  //  Maturing
  if(ctx.rules.maturity) 
  {
    while(  ctx.growth[p] < ctx.requiredGrowth[p] &&
        ctx.ntStore[p] > ctx.ntEndowment[p] && 
        ctx.ncStore[p] > ctx.ncEndowment[p]) 
    {
      ctx.growth[p]++;
      ctx.ntStore[p] -= ctx.ntEndowment[p];
      ctx.ncStore[p] -= ctx.ncEndowment[p];
    }
  }

  //  Seed sowing
  if (ctx.ntStore[p] > ctx.ntEndowment[p]  * ctx.numberSeeds[p] && 
    ctx.ncStore[p] > ctx.ncEndowment[p] *  ctx.numberSeeds[p]) 
  {

    var neighbors = ctx.GetRingOfPlantCoordinates(p, ctx.seedSpread[p], false);
    for(var s = 0 ; s <  ctx.numberSeeds[p]; s++)
    {
    var neighbor = neighbors[utility.randomNumberBetween(0,neighbors.length)];
 
    if(!ctx.hasPlant[neighbor] && //  If it doens't already have a plant
      ctx.depth[ctx.ConvertPToZ(neighbor)] == 0) // And isn't water
    {

      if(seeds[neighbor]) //  If it already have a seed
      {  
        if (ctx.ntEndowment[p] < seeds[neighbor].ntStore ||
          ctx.ncEndowment[p] < seeds[neighbor].ncStore)
        {
          //  The seed here has more of an endowment than us
          ctx.nt[z]+= ctx.ntEndowment[p];
          ctx.nc[z]+= ctx.ncEndowment[p];
          continue; //  Don't sow
        }
      }
      //  Sow the seed
      seeds[neighbor] = {
        ntConsumption: ctx.ntConsumption[p] + MutateDNA(ctx.rules.mutation)
      , ntMetabolism: ctx.ntMetabolism[p] + MutateDNA(ctx.rules.mutation)
      , ntEndowment: ctx.ntEndowment[p] + MutateDNA(ctx.rules.mutation)

      , ncConsumption: ctx.ncConsumption[p] + MutateDNA(ctx.rules.mutation)
      , ncMetabolism: ctx.ncMetabolism[p] + MutateDNA(ctx.rules.mutation)
      , ncEndowment: ctx.ncEndowment[p] + MutateDNA(ctx.rules.mutation)

      , numberSeeds: ctx.numberSeeds[p] + MutateDNA(ctx.rules.mutation)
      , seedSpread: ctx.seedSpread[p] + MutateDNA(ctx.rules.mutation)
      , requiredGrowth: ctx.requiredGrowth[p] + MutateDNA(ctx.rules.mutation)

      , generation: ctx.generation[p] + 1

      , thirst: ctx.thirst[p] + MutateDNA(ctx.rules.mutation)
      , heliophilia: ctx.heliophilia[p] + MutateDNA(ctx.rules.mutation)

      , ntStore: ctx.ntEndowment[p]
      , ncStore: ctx.ncEndowment[p]
      }

      //  Plants only lose nutrients if the seed happens
      ctx.ntStore[p] -= ctx.ntEndowment[p];
      ctx.ncStore[p] -= ctx.ncEndowment[p];
    }
    }
  }
  }

  //  Seeds taking root
  for(var s = 0 ; s < ctx.plantArea ; s++)
  {
    if(seeds[s] != null)
    {
      ctx.ntConsumption[s] = seeds[s].ntConsumption;
      ctx.ntMetabolism[s] = seeds[s].ntMetabolism;
      ctx.ntEndowment[s] = seeds[s].ntEndowment;

      ctx.ncConsumption[s] = seeds[s].ncConsumption;
      ctx.ncMetabolism[s] = seeds[s].ncMetabolism;
      ctx.ncEndowment[s] = seeds[s].ncEndowment;

      ctx.numberSeeds[s] = seeds[s].numberSeeds;
      ctx.seedSpread[s] = seeds[s].seedSpread;
      ctx.requiredGrowth[s] = seeds[s].requiredGrowth;

      ctx.thirst[s] = seeds[s].thirst;
      ctx.heliophilia[s] = seeds[s].heliophilia;

      ctx.generation[s] = seeds[s].generation; 

      ctx.ntStore[s] = seeds[s].ntStore;
      ctx.ncStore[s] = seeds[s].ncStore;
      ctx.hasPlant[s] = true;
    }
  }
};
function MutateDNA(mutationRate)
{
  if(Math.random() > mutationRate)
  {
  //  Mutate
  if(Math.random() > 0.5)
  {  
    return 1;
  }
  else
  {
    return -1;
  }
  }
  return 0;
}
exports.killPlant = function(p,z, ctx, cause, doLogDeath)
{
  if(cause && doLogDeath)
  {
  console.log("Plant Death: " + cause);
  }
  ctx.hasPlant[p] = false;
  
  ctx.nt[z] += ctx.ntEndowment[p];// * ctx.growth[p];
  ctx.nc[z] += ctx.ncEndowment[p];// * ctx.growth[p];
  
  ctx.ntStore[p] = null;
  ctx.ncStore[p] = null;
};