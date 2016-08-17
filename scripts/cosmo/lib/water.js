'use strict';
var utility = require('./utility');

exports.CreateOcean = function(ctx,totalWaterRequired)
{
  var numberPillars = ctx.area;
  
  var startFlat = true;
  if(startFlat)
  {   
    for (var p = 0; p < ctx.area; p++)
    {
      if(!ctx.continent[p]) {
        CreatePillarOfWaterAtZ(ctx, 
          p, 
          totalWaterRequired / numberPillars);
      }
      else {
        var pillarZ = -1;
        while(pillarZ == -1)
        {
          var attempt = utility.randomNumberBetween(0, ctx.area);
          if(!ctx.continent[attempt])
          {
            pillarZ = attempt;
          }
        }
        
        CreatePillarOfWaterAtZ(ctx, 
          pillarZ, 
          totalWaterRequired / numberPillars);
        }
    }
  }
  else
  {
    for (var p = 0; p < numberPillars; p++)
    {
      var pillarZ = -1;
      while(pillarZ == -1)
      {
        var attempt = utility.randomNumberBetween(0, ctx.area);
        if(!ctx.continent[attempt])
        {
          pillarZ = attempt;
        }
      }
      
      CreatePillarOfWaterAtZ(ctx, 
        pillarZ, 
        totalWaterRequired / numberPillars);
    }
  }
  ResolveWater(ctx);
};
function CreatePillarOfWaterAtZ(ctx, z, unitsOfWater)
{
  ctx.depth[z] += unitsOfWater;
  ctx.unresolvedWater[z] = true;
}
exports.flushWater = function(ctx)
{
  for(var z = 0 ; z < ctx.area ; z++)
  {
    if(ctx.depth[z] > 0)
      ctx.unresolvedWater[z] = true;
  }
  ResolveWater(ctx);
};

function ResolveWater (ctx)
{
  var accuracy = 0.05;//0.005;
  var next = 0;
  while((next = GiveWater(next,accuracy,ctx)) < ctx.area)
  {
    if(next == -1)
    {
      next = 0;
      
      do 
      {
        next++;
        if(next >= ctx.area)
        {
          return;
        }
      }while(!ctx.unresolvedWater[next]);
    }
  }
}

function GiveWater(z, accuracy, ctx){
  var lastIndex = -1;

  var depth = ctx.depth[z];

  if (depth == 0)
  {
    ctx.unresolvedWater[z] = false;
    return lastIndex;
  }

  var height = ctx.height[z];
  var elevation = depth + height;

  var neighbors = ctx.GetNeighbors(z, false);

  var numberPossibleDonees = 0;
  //  Continually give out water till you can't
  do
  {
    depth = ctx.depth[z];
    elevation = depth + height;

    var steepestSlope = 0;
    var steepestSlopeValue = 0;
    numberPossibleDonees = 0;

    //  Find the steepest slope
    for (var n = 0; n < neighbors.length; n++)
    {
      var n_index = neighbors[n];

      var neighborDepth = ctx.depth[n_index];
      var neighborHeight = ctx.height[n_index];
      var neighborElevation = neighborDepth + neighborHeight;

      var slope = elevation - neighborElevation;

      //  Do we have a downward slow too great?
      if (slope > accuracy)
      {
        numberPossibleDonees++;

        if (slope > steepestSlopeValue)
        {
          steepestSlope = n;
          steepestSlopeValue = slope;
        }
      }

      //  Do we have an upward slope that is too great?
      if (slope < -accuracy)
      {
        //  If that plot has water then it needs to queue up for it
        if (neighborDepth > 0)
        {
          ctx.unresolvedWater[n_index] = true;
          lastIndex = n_index;
        }
      }
    }

    if (numberPossibleDonees >= 1)
    {
      //  There was at least one downward slope that was too great

      var n_index = neighbors[steepestSlope];
      ctx.unresolvedWater[n_index] = true;

      //  Can we pass half our height difference
      if (ctx.depth[z] > (steepestSlopeValue / 2))
      {
        //  Yes we can
        ctx.depth[z] -= (steepestSlopeValue / 2);
        ctx.depth[n_index] += (steepestSlopeValue / 2);
      }
      else
      {
        //  No we cant give enoguht to level them so we give all instead
        ctx.depth[z] = 0;
        ctx.depth[n_index] += ctx.depth[z];
      }
    }
    else
    {
      //  There was nothing to put out so 
      ctx.unresolvedWater[z] = false;
    }
  }
  //If we had more than one possibility than we can try again
  while (numberPossibleDonees > 1 && ctx.depth[z] > 0);

  return lastIndex;
}