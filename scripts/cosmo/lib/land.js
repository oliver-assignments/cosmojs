'use strict';

var utility = require('./utility.js');

exports.CreateBlobbyLandmass = function(ctx)
{
  var continentMap = new Array(ctx.area);
  for(var z = 0 ; z < ctx.area; z++) { 
    continentMap[z]=0;
  }

  for(var b = 0 ; b < 3 ; b++) {
    var startingCoord = {
      f: (ctx.columns/2) + utility.randomNumberBetween(-ctx.columns/10,-ctx.columns/10)
      ,s: (ctx.rows/2) + utility.randomNumberBetween(-ctx.rows/10,-ctx.rows/10)
    }

    var continent = CreateBlob(ctx, startingCoord, ctx.columns/10, 6);
    for (var p = 0; p < continent.length; p++)
    {
       if(!ctx.continent[continent[p]])
       {
        ctx.height[continent[p]] += utility.randomNumberBetween(2,5);
        ctx.continent[continent[p]] = true;
      }
    }
  }
}
exports.CreateLandmass = function(ctx)
{
  for(var z = 0 ; z < ctx.area; z++) { 
    continentMap[z]=0;
  }
  
  for (var c = 0; c < 3; c++)
  {
    //  Create continent height
    var centerContinentX = -1;
    var centerContinentY = -1;

    while (centerContinentX == -1 || centerContinentY == -1)
    {
      var attemptedX = (ctx.columns / 2) + utility.randomNumberBetween(-ctx.columns / 4, ctx.columns / 4);
      var attemptedY = (ctx.rows / 2) + utility.randomNumberBetween(-ctx.rows / 4, ctx.rows / 4);
           
      if (continentMap[ctx.ConvertToZ({f:attemptedX, s: attemptedY})] == 0)
      {
        centerContinentX = attemptedX;
        centerContinentY = attemptedY;
      }
    }

    //How far we venture from the continent to place a blob
    var radius = ((ctx.columns + ctx.rows) / 2) / 6;

    for (var i = 0; i < 5; i++)
    {
      var blobCenter = {
        f:centerContinentX + utility.randomNumberBetween(-radius,radius),
        s:centerContinentY + utility.randomNumberBetween(-radius,radius)};
      
      ctx.WrapCoordinate(blobCenter);
      
      var blob_radius = utility.randomNumberBetween(2,8);
      
      var blobResults = ctx.GetRingOfCoordinates(ctx.ConvertToZ(blobCenter), blob_radius, true);

      for (var p = 0; p < blobResults.length; p++)
      {
         if(!ctx.continent[blobResults[p]])
         {
          ctx.height[blobResults[p]] += utility.randomNumberBetween(2,5);
          ctx.continent[blobResults[p]] = true;
        }
      }
    }
  }
};

function GetMagnitude(coord)
{
  return Math.sqrt(Math.pow(coord.f,2) + Math.pow(coord.s,2));
}

function ShouldPaint(ctx, coord, goo, threshold, balls)
{
  var sum = 0;
  for(var b = 0 ; b < balls.length; b++) {

    //  Can we get to ball by wrapping aroudn the torus?
    var distanceX = Math.abs(balls[b].coord.f - coord.f);
    if(distanceX > ctx.columns/2) 
    {
      distanceX = ctx.columns - distanceX;
    }
    var distanceY = Math.abs(balls[b].coord.s - coord.s);
    if(distanceY > ctx.rows/2) 
    {
      distanceY = ctx.rows - distanceY;
    }

    sum += balls[b].radius / Math.max(0.0001, Math.pow(GetMagnitude({f:distanceX,s:distanceY}),goo));
  }
  //console.log(sum);
  return sum > threshold;
}

function CreateBlob(ctx,startingCoord,radius,numberNodes)
{
  var balls = new Array();

  //  Creating the balls
  for(var n = 0 ; n < numberNodes ; n++) {
    balls.push(
      {
        coord : {
          f: startingCoord.f + utility.randomNumberBetween(-radius*2,radius*2)
          ,s: startingCoord.s + utility.randomNumberBetween(-radius*2,radius*2)
        }
        ,radius : radius / numberNodes
      });
  }

  //  Tralling throuhg all provinces seeing if they are the blob.
  var blob = new Array();
  for(var z = 0 ; z < ctx.area ; z ++)
  {
    if(ShouldPaint(ctx, ctx.ConvertToCoord(z),1,0.8,balls))
    {
      blob.push(z);
    }
  }
  return blob;
};