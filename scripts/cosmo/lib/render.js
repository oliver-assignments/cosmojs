'use strict';

//exports = module.exports;
var manager = require('./manager.js');
var utility = require('./utility.js');

var shallowestOcean = {c:42,m:21,y:0,k:1};
var deepestOcean = {c:70,m:30,y:0,k:63};

var lowestValley = {c:0,m:11,y:32,k:71};
var tallestMountain = {c:0,m:10,y:30,k:4};

var darkest = {c:0,m:12,y:41,k:16};
var brightest ={c:0,m:1,y:20,k:5};

var drizzle = {c:42,m:21,y:0,k:1};
var monsoon = {c:70,m:30,y:0,k:63};

var weaknc = {c:0,m:0,y:0,k:0};//{c:42,m:21,y:0,k:11};
var strongnc = {c:70,m:35,y:0,k:43};

var weaknt = {c:0,m:0,y:0,k:0};;//{c:0,m:41,y:39,k:16};
var strongnt = {c:0,m:61,y:58,k:34};

var sparseVegetation = {c:0,m:0,y:0,k:0};
var thickVegetation = {c:37,m:0,y:60,k:37};

exports.renderSimulationContextWithMode = function(req,res)
{
  manager.getSimulationContext(req,
    function(err,ctx)
    {
      if(err)
      {
        res(err);
      }
      else
      {
        exports.render(
        {
          ctx: ctx,
          mode: req.mode
        },
        function(error,renderInstructions)
        {
          if(error) {
            res(error);
          }
          else {
            res(null,renderInstructions);
          }
        });
      }
    });             
};

exports.render = function(req,res)
{
  calculateHighestAndLowest(req.ctx);

  var colors = new Array();
  var columns = req.ctx.columns;
  var rows = req.ctx.rows;

  if(req.mode == "Depth")
  {
    for(var z = 0 ; z < req.ctx.area ; z++)
    {
      if(req.ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(req.ctx.depth[z],req.ctx)));
      }
      else
      {
        colors.push(cmykToHex(colorizeEarth(0,req.ctx)));
      }
    }
  }
  else if (req.mode == "Height")
  {
    for(var z = 0 ; z < req.ctx.area ; z++)
    {
      //console.log(req.ctx.height[z]);
      colors.push(cmykToHex(colorizeEarth(req.ctx.height[z],req.ctx)));
    }
  }
  else if (req.mode == "Satellite")
  {
    columns = req.ctx.plantColumns;
    rows = req.ctx.plantRows;

    for(var p = 0 ; p < req.ctx.plantArea ; p++)
    {
      var z = req.ctx.ConvertPToZ(p);

      if(req.ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(req.ctx.depth[z],req.ctx)));
      }
      else
      {
        var plants = 0;
        if(req.ctx.hasPlant[p])
        {
          plants = req.ctx.plantRowsPer * req.ctx.plantColumnsPer;
        }
        colors.push(cmykToHex(
          colorizeVegetationAndHeight(
            plants,
            req.ctx.height[z],
            req.ctx)));
      }
    }
  }
  else if (req.mode == "Elevation")
  {
    for(var z=0; z < req.ctx.area; z++)
    {
      colors.push(cmykToHex(colorizeElevation(req.ctx.height[z] + req.ctx.depth[z],req.ctx)));
    }
  }
  else if (req.mode == "nt")
  {
    for(var z = 0; z < req.ctx.area; z++)
    {
      if(req.ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(req.ctx.depth[z],req.ctx)));
      }
      else
      {
        colors.push(cmykToHex(colorizent(req.ctx.nt[z],req.ctx)));
      }
    }
  }
  else if (req.mode == "nc")
  {
    for(var z = 0; z < req.ctx.area; z++)
    {
      if(req.ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(req.ctx.depth[z],req.ctx)));
      }
      else
      {
        colors.push(cmykToHex(colorizenc(req.ctx.nc[z],req.ctx)));
      }
    }
  }
  else if (req.mode == "Nutrients")
  {
    for(var z = 0; z < req.ctx.area; z++)
    {
      if(req.ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(req.ctx.depth[z],req.ctx)));
      }
      else
      {
        colors.push(cmykToHex(colorizeNutrients(req.ctx.nt[z], req.ctx.nc[z],req.ctx)));
      }
    }
  }
  else if (req.mode == "Sunlight")
  {
    for(var z=0; z < req.ctx.area; z++)
    {
      colors.push(cmykToHex(colorizeSunlightAndHeight(req.ctx.sunlight[z],req.ctx.height[z],req.ctx)));
    }
  }
  else if (req.mode == "Rainfall")
  {
    for(var z=0; z < req.ctx.area; z++)
    {
      colors.push(cmykToHex(colorizeRainfallAndHeight(req.ctx.rainfall[z],req.ctx.height[z],req.ctx)));
    }
  }
  else if (req.mode == "Density")
  {
    for(var z = 0 ; z < req.ctx.area ; z++)
    {
      if(req.ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(req.ctx.depth[z],req.ctx)));
      }
      else
      {
        var plots = req.ctx.GetPlotsOfZ(z);
        var numberPlants = 0;
        for(var p = 0 ; p < plots.length ; p++)
        {
          if(req.ctx.hasPlant[plots[p]] == true)
          {
            numberPlants++;
          }
        }
        colors.push(cmykToHex(
          colorizeVegetation(
            numberPlants,req.ctx)));
      }
    }
  }
  else if (req.mode == "nc Stores")
  {
    columns = req.ctx.plantColumns;
    rows = req.ctx.plantRows;

    for(var p = 0 ; p < req.ctx.plantArea ; p++)
    {
      var z = req.ctx.ConvertPToZ(p);

      if(req.ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(req.ctx.depth[z],req.ctx)));
      }
      else
      {
        colors.push(cmykToHex(
          colorizencStore(
            req.ctx.ncStore[p],
            req.ctx)));
      }
    }
  }
  else if (req.mode == "nt Stores")
  {
    columns = req.ctx.plantColumns;
    rows = req.ctx.plantRows;

    for(var p = 0 ; p < req.ctx.plantArea ; p++)
    {
      var z = req.ctx.ConvertPToZ(p);

      if(req.ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(req.ctx.depth[z],req.ctx)));
      }
      else
      {
        colors.push(cmykToHex(
          colorizentStore(
            req.ctx.ntStore[p],
            req.ctx)));
      }
    }
  }
  else if (req.mode == "Nutrient Stores")
  {
    columns = req.ctx.plantColumns;
    rows = req.ctx.plantRows;

    for(var p = 0 ; p < req.ctx.plantArea ; p++)
    {
      var z = req.ctx.ConvertPToZ(p);

      if(req.ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(req.ctx.depth[z],req.ctx)));
      }
      else
      {
        colors.push(cmykToHex(
          colorizeNutrientStore(
            req.ctx.ntStore[p],
            req.ctx.ncStore[p],
            req.ctx)));
      }
    }
  }
  else {
    res(req.mode + " doesn't exist.");
    return;
  }
  res(null, 
    {
      colors:colors
      ,columns:columns
      ,rows:rows
    });
};
function colorValueBetween (value,minValue,maxValue,bottomColor,topColor) {
  var ratio = (value-minValue)/(maxValue-minValue);

  var deltaColor = {
    c:bottomColor.c-topColor.c,
    m:bottomColor.m-topColor.m,
    y:bottomColor.y-topColor.y,
    k:bottomColor.k-topColor.k
  };

  var cymk = {
    c: Math.round(bottomColor.c - (deltaColor.c*ratio)),
    m: Math.round(bottomColor.m - (deltaColor.m*ratio)),
    y: Math.round(bottomColor.y - (deltaColor.y*ratio)),
    k: Math.round(bottomColor.k - (deltaColor.k*ratio))
  };
  return cymk;
}
function cmykToHex(cmyk){
  
  var c = cmyk.c / 100;
  var m = cmyk.m / 100;
  var y = cmyk.y / 100;
  var k = cmyk.k / 100;
  
  var result = {};
  result.r = 1 - Math.min( 1, c * ( 1 - k ) + k );
  result.g = 1 - Math.min( 1, m * ( 1 - k ) + k );
  result.b = 1 - Math.min( 1, y * ( 1 - k ) + k );

  return rgbToHex(
    Math.round( result.r * 255 ), 
    Math.round( result.g * 255 ), 
    Math.round( result.b * 255 ));
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


function calculateHighestAndLowest(ctx)
{
  ctx.highest = 1;
  ctx.hottest = 1;
  ctx.deepest = 1;
  ctx.brightest = 1;
  ctx.wettest = 1;
  ctx.tallest = 1;

  ctx.richestNutro = 1;
  ctx.richestNucium = 1;

  ctx.richestntStore = 1;
  ctx.richestncStore = 1;
  ctx.richestWaterStore = 1;

  for(var z = 0 ; z < ctx.area ; z++)
  {
    if(ctx.height[z] > ctx.highest)
    {
      ctx.highest = ctx.height[z];
    }
    if(ctx.heat[z] > ctx.hottest)
    {
      ctx.hottest = ctx.heat[z];
    }
    if(ctx.depth[z] > ctx.deepest)
    {
      ctx.deepest = ctx.depth[z];
    }
    if(ctx.sunlight[z] > ctx.brightest)
    {
      ctx.brightest = ctx.sunlight[z];
    }
    if(ctx.rainfall[z] > ctx.wettest)
    {
      ctx.wettest = ctx.rainfall[z];
    }
    if(ctx.height[z] + ctx.depth[z] > ctx.tallest)
    {
      ctx.tallest = ctx.height[z] + ctx.depth[z];
    }

    //  Soil
    if(ctx.nt[z] > ctx.richestnt)
    {
      ctx.richestNutro = ctx.nt[z];
    }
    if(ctx.nc[z] > ctx.richestnc)
    {
      ctx.richestNucium= ctx.nc[z];
    }
  }
  for(var p = 0 ; p < ctx.plantArea ; p++)
  {
    //  Stores
    if(ctx.ntStore[p] > ctx.richestntStore)
    {
      ctx.richestntStore = ctx.ntStore[p];
    }
    if(ctx.ncStore[p] > ctx.richestncStore)
    {
      ctx.richestncStore = ctx.ncStore[p];
    }
    if(ctx.waterStore[p] > ctx.richestWaterStore)
    {
      ctx.richestWaterStore = ctx.waterStore[p];
    }
    
  }
}


function addColors(a,b)
{
  return {c: a.c + b.c,
      m: a.m + b.m,
      y: a.y + b.y,
      k: a.k + b.k};
}


function colorizeRainfall(value,ctx)
{
  return colorValueBetween(value,0,ctx.wettest,drizzle,monsoon);  
}

function colorizeSunlight(value,ctx)
{
  return colorValueBetween(value,1,ctx.brightest,darkest,brightest);  
}

function colorizeSunlightAndHeight(sunlight,height,ctx)
{
  return addColors(colorizeSunlight(sunlight,ctx),colorizeEarth(height,ctx));
}
function colorizeRainfallAndHeight(rainfall,height,ctx)
{
  return addColors(colorizeRainfall(rainfall,ctx),colorizeEarth(height,ctx));
}

function colorizent(value,ctx)
{
  return colorValueBetween(value,0,ctx.richestnt,weaknt,strongnt); 
}
function colorizenc(value,ctx)
{
  return colorValueBetween(value,0,ctx.richestnc,weaknc,strongnc);  
}
function colorizeNutrients(nt,nc,ctx)
{
  return addColors(colorizent(nt,ctx), colorizenc(nc,ctx));
}

function colorizentStore(value,ctx)
{
  return colorValueBetween(value,0,ctx.richestntStore,weaknt,strongnt);  
}
function colorizencStore(value,ctx)
{
  return colorValueBetween(value,0,ctx.richestncStore,weaknc,strongnc); 
}
function colorizeNutrientStore(nt,nc,ctx)
{
  return addColors(colorizentStore(nt,ctx), colorizencStore(nc,ctx));
}

function colorizeVegetation(value,ctx)
{
  return colorValueBetween(value,0,ctx.plantColumnsPer*ctx.plantRowsPer,sparseVegetation,thickVegetation);
}

function colorizeVegetationAndHeight(vegetation,height,ctx)
{
  return addColors(colorizeVegetation(vegetation,ctx), colorizeEarth(height,ctx));
}
function colorizeElevation(value,ctx)
{
  return colorValueBetween(value,0,ctx.tallest,lowestValley,tallestMountain); 
}
function colorizeEarth(value,ctx)
{
  return colorValueBetween(value,0,ctx.highest,lowestValley,tallestMountain);
}
function colorizeWater(value,ctx)
{
  return colorValueBetween(value,0,ctx.deepest,shallowestOcean,deepestOcean);
}
