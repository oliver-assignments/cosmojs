var utility = require('./utility.js');

function killPlant(p,z,ctx, cause, doLogDeath)
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

exports.simulateDay = function(ctx,res)
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
      killPlant(p,z,ctx)// No plant here
      continue;
    }

    if(ctx.numberSeeds[p] < 1){
      killPlant(p,z,ctx,"Number seeds less than 1: " + ctx.numberSeeds[p], false);
      continue;
    }
    if(ctx.ntEndowment[p] < 0){
      killPlant(p,z,ctx,"ctx.ntEndowment[p] is less than 0 : "+ ctx.ntEndowment[p], false);
      continue;
    }
    if(ctx.ncEndowment[p] < 0){
      killPlant(p,z,ctx,"ctx.ncEndowment[p] is less than 0 : " + ctx.ncEndowment[p], false);
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
      ctx.waterStore[p] += ctx.rainfall[z];
      ctx.waterStore[p] -= waterMetabolism;
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
        killPlant(p,z,ctx, "Roots with " + numberNeighbors + " neighbors.")
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
      killPlant(p,z,ctx, "Starvation: nt " + ctx.ntStore[p] + " nc " + ctx.ncStore[p]);//, "Starvation with nt: " + ctx.ntStore[p] + ", nc: "+ ctx.ncStore[p]);
      continue;
    }

    //  Maturing
    while(  ctx.growth[p] < ctx.requiredGrowth[p] &&
            ctx.ntStore[p] > ctx.ntEndowment[p] && 
            ctx.ncStore[p] > ctx.ncEndowment[p]) 
    {
      ctx.growth[p]++;
      ctx.ntStore[p] -= ctx.ntEndowment[p];
      ctx.ncStore[p] -= ctx.ncEndowment[p];
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

            , numberSeeds: ctx.numberSeeds[p] //+ MutateDNA(ctx.rules.mutation)
            , seedSpread: ctx.seedSpread[p] //+ MutateDNA(ctx.rules.mutation)
            , requiredGrowth: ctx.requiredGrowth[p] + MutateDNA(ctx.rules.mutation)

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

      ctx.ntStore[s] = seeds[s].ntStore;
      ctx.ncStore[s] = seeds[s].ncStore;
      ctx.hasPlant[s] = true;
    }
  }

  res(null);
};
exports.calculateHighest=function(ctx)
{
  ctx.highest = 1;
  ctx.hottest = 1;
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

  for(var z = 0 ; z < ctx.area ; z++)
  {
    ctx.highest = Math.max(ctx.highest, ctx.height[z]);
    ctx.hottest = Math.max(ctx.hottest, ctx.heat[z]);
    ctx.deepest = Math.max(ctx.deepest, ctx.depth[z]);
    ctx.brightest = Math.max(ctx.brightest, ctx.sunlight[z]);
    ctx.wettest = Math.max(ctx.wettest, ctx.rainfall[z]);
    ctx.tallest = Math.max(ctx.tallest, ctx.height[z] + ctx.depth[z]);

    //  Soil
    ctx.richestNutro = Math.max(ctx.nt[z]);
    ctx.richestNucium= Math.max(ctx.nc[z]);
    
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
    }
  }
}
exports.onMonth = function(ctx,res)
{
  //console.log("A month! " + ctx.month);
  res(null);
};
exports.onYear = function(ctx,res)
{
  //console.log("A year! " + ctx.year);
  res(null);
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
