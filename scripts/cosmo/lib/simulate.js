var utility = require('./utility.js');

function killPlant(p,z,ctx, cause, doLogDeath)
{
  if(cause && doLogDeath)
  {
    console.log("Plant Death: " + cause);
  }
  ctx.hasPlant[p] = false;
  ctx.nutroStore[p] = null;
  ctx.nuciumStore[p] = null;
};

exports.simulateDay = function(ctx,res)
{
  for( var z = 0 ; z < ctx.area ; z++)
  {
    if(ctx.nutro[z] < 1)
      ctx.nutro[z] = 1;
    if(ctx.nucium[z] < 1)
      ctx.nucium[z] = 1;
  }

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
      killPlant(p,z,ctx,"Number seeds less than 1: " + ctx.numberSeeds[p]);
      continue;
    }
    if(ctx.nutroEndowment[p] < 1){
      killPlant(p,z,ctx,"ctx.nutroEndowment[p] is less than 1 : "+ ctx.nutroEndowment[p]);
      continue;
    }
    if(ctx.nuciumEndowment[p] < 1){
      killPlant(p,z,ctx,"ctx.nuciumEndowment[p] is less than 1 : " + ctx.nuciumEndowment[p]);
      continue;
    }

    //  Nutro Consumption
    if(ctx.nutro[z] > 0)
    {
      if(ctx.nutro[z] - ctx.nutroConsumption[p] >= 0)
      {
        ctx.nutroStore[p] += ctx.nutroConsumption[p];
        ctx.nutro[z] -= ctx.nutroConsumption[p];
      }
      else 
      {
        ctx.nutroStore[p] += ctx.nutro[z];
        ctx.nutro[z] = 0;
      }
    }
    ctx.nutroStore[p] -= ctx.nutroMetabolism[p];
    
    //  Nucium Consumption
    if(ctx.nucium[z] > 0)
    {
      if(ctx.nucium[z] - ctx.nuciumConsumption[p] >= 0)
      {
        ctx.nuciumStore[p] += ctx.nuciumConsumption[p];
        ctx.nucium[z] -= ctx.nuciumConsumption[p];
      }
      else 
      {
        ctx.nuciumStore[p] += ctx.nucium[z];
        ctx.nucium[z] = 0;
      }
    }
    ctx.nuciumStore[p] -= ctx.nuciumMetabolism[p];

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
      if(ctx.nutroStore[p] < 0 && ctx.nuciumStore[p] > -ctx.nutroStore[p] * conversionRate)
      {
        //  We have nucium to convert to nutro
        ctx.nutroStore[p] += ctx.nuciumStore[p] * conversionRate;
        ctx.nuciumStore[p] -= -ctx.nutroStore[p];
      }
      else if(ctx.nuciumStore[p] < 0 && ctx.nutroStore[p] > -ctx.nuciumStore[p] *conversionRate)
      {
        //  We have nucium to convert to nutro
        ctx.nuciumStore[p] += ctx.nutroStore[p] * conversionRate;
        ctx.nutroStore[p] -= -ctx.nuciumStore[p];
      }
    }

    //  Starvation
    if(ctx.nutroStore[p] < 0 || ctx.nuciumStore[p] < 0)
    {
      killPlant(p,z,ctx, "Starvation: nt " + ctx.nutroStore[p] + " nc " + ctx.nuciumStore[p]);//, "Starvation with nutro: " + ctx.nutroStore[p] + ", nucium: "+ ctx.nuciumStore[p]);
      continue;
    }

    //  Seed sowing
    if (ctx.nutroStore[p]  > ctx.nutroEndowment[p]  * ctx.numberSeeds[p] && 
        ctx.nuciumStore[p] > ctx.nuciumEndowment[p] *  ctx.numberSeeds[p]) 
    {
      console.log("try")
      //if(ctx.newGen[p])
            //console.log( ctx.numberSeeds[p]);

      var neighbors = ctx.GetRingOfPlantCoordinates(p, ctx.seedSpread[p], false);
      for(var s = 0 ; s <  ctx.numberSeeds[p]; s++)
      {
        var neighbor = neighbors[utility.randomNumberBetween(0,neighbors.length)];
 
        if(!ctx.hasPlant[neighbor] && //  If it doens't already have a plant
            ctx.depth[ctx.ConvertPToZ(neighbor)] == 0) // And isn't water
        {

          if(seeds[neighbor]) //  If it already have a seed
          {  
            if (ctx.nutroEndowment[p] < seeds[neighbor].nutroStore ||
                ctx.nuciumEndowment[p] < seeds[neighbor].nuciumStore)
            {
              //  The seed here has more of an endowment than us
              continue; //  Don't sow
            }
          }
          
          //  Sow the seed
          seeds[neighbor] = {
            dna: ctx.dna[p]//MutateDNA(ctx.dna[p], ctx.rules.mutation)
            , nutroStore: ctx.nutroEndowment[p]
            , nuciumStore: ctx.nuciumEndowment[p]
          }

          //  Plants only lose nutrients if the seed happens
          ctx.nutroStore[p] -= ctx.nutroEndowment[p];
          ctx.nuciumStore[p] -= ctx.nuciumEndowment[p];
        }
      }
    }
  }

  //  Seeds taking root
  for(var s = 0 ; s < ctx.plantArea ; s++)
  {
    if(seeds[s] != null)
    {
      ctx.newGen[s] = true;
      //console.log(seeds[s].dna);
      ctx.dna[s] = seeds[s].dna;
      ctx.nutroStore[s] = seeds[s].nutroStore;
      ctx.nuciumStore[s] = seeds[s].nuciumStore;
      ctx.hasPlant[s] = true;
    }
  }

  res(null);
};
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

function MutateDNA(dna,mutationRate)
{
  var newDna = "";
  var hasChanged = false;
  for(var d = 0 ; d < dna.length ; d++)
  {
    var valueAtDna = dna.charCodeAt(d)-97;
    if(Math.random() > mutationRate)
    {
      hasChanged = true;
      //  Mutate
      if(Math.random() > 0.5)
      {  
        valueAtDna ++;
      }
      else
      {
        valueAtDna--;
        if(valueAtDna <1) valueAtDna++;
      }
    }
    newDna += String.fromCharCode(97 + valueAtDna);
  }
  return newDna;
}
