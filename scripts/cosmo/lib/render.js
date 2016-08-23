'use strict';

//exports = module.exports;
var manager = require('./manager.js');
var utility = require('./utility.js');
var randomColor = require('randomcolor');
var nameColor = require('./name-that-color.js');

var white = {c: 0, m: 0, y: 0, k: 0};
var shallowestOcean = {c: 42, m: 21, y: 0, k: 1};
var deepestOcean = {c: 70, m: 30, y: 0, k: 63};

var lowestValley = {c: 0, m: 11, y: 32, k: 71};
var tallestMountain = {c: 0, m: 10, y: 30, k: 4};

var darkest = {c: 0, m: 12, y: 41, k: 16};
var brightest = {c: 0, m: 1, y: 20, k: 5};

var drizzle = {c: 42, m: 21, y: 0, k: 1};
var monsoon = {c: 70, m: 30, y: 0, k: 63};

var weakNucium = white;
var strongNucium = {c: 70, m: 35, y: 0, k: 43};

var weakNutro = white;
var strongNutro = {c: 0, m: 61, y: 58, k: 34};

var sparseVegetation = white;
var thickVegetation = {c: 37, m: 0, y: 60, k: 37};

var shortestPlant = sparseVegetation;//  aaa
var tallestPlant = thickVegetation;//  aaa

var hottest = {c: 0, m: 88, y: 79, k: 1};
var coolest = {c: 20, m: 20, y: 20, k: 1};

var tectonicColors = randomColor.randomColor({count:1000, hue: 'red'});//luminosity:'light'

exports.describePlateColor = function(plateNumber)
{
  return nameColor.ntc.name(tectonicColors[plateNumber%1000])[1];
};

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
  var ctx = req.ctx;

  var colors = new Array();
  var columns = ctx.columns;
  var rows = ctx.rows;

  if(req.mode == "Depth")
  {
    for(var z = 0 ; z < ctx.area ; z++)
    {
      if(ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        colors.push(cmykToHex(colorizeEarth(ctx.height[z],ctx)));
      }
    }
  }
  else if (req.mode == "Height")
  {
    for(var z = 0 ; z < ctx.area ; z++)
    {
      colors.push(cmykToHex(colorizeEarth(ctx.height[z],ctx)));
    }
  }
  else if (req.mode == "Tectonic")
  {
    for(var z = 0 ; z < ctx.area ; z++)
    {
      colors.push(tectonicColors[ctx.tectonic[z] % tectonicColors.length]);
    }
  }
  else if (req.mode == "Asthenosphere")
  {
    for(var z = 0 ; z < ctx.area ; z++)
    {
      colors.push(cmykToHex(
        colorValueBetween(ctx.heat[z],0,ctx.hottest,coolest,hottest)));
    }
  }
  else if (req.mode == "Fractures")
  {
    for(var z = 0 ; z < ctx.area ; z++)
    {
      colors.push(cmykToHex(
        colorValueBetween(ctx.fracture[z],0,1,coolest,hottest)));
    }
  }
  else if (req.mode == "Stress")
  {
    for(var z = 0 ; z < ctx.area ; z++)
    {
      colors.push(cmykToHex(
        colorValueBetween(ctx.stress[z], 0, ctx.highestStress, coolest, hottest)));
    }
  }
  else if (req.mode == "Satellite")
  {
    columns = ctx.plantColumns;
    rows = ctx.plantRows;

    for(var p = 0 ; p < ctx.plantArea ; p++)
    {
      var z = ctx.ConvertPToZ(p);

      if(ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        var plants = 0;
        if(ctx.hasPlant[p])
        {
          plants = ctx.plantRowsPer * ctx.plantColumnsPer;
        }
        colors.push(cmykToHex(
          addColors(colorizeVegetation(plants,ctx), 
                    colorizeEarth(ctx.height[z],ctx))));
      }
    }
  }
  else if (req.mode == "Elevation")
  {
    for(var z=0; z < ctx.area; z++)
    {
      colors.push(cmykToHex(
        colorValueBetween(ctx.height[z] + ctx.depth[z],0,ctx.tallest,lowestValley,tallestMountain)));
    }
  }
  else if (req.mode == "Nutro")
  {
    for(var z = 0; z < ctx.area; z++)
    {
      if(ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        colors.push(cmykToHex(colorizeNutro(ctx.nt[z],ctx)));
      }
    }
  }
  else if (req.mode == "Nucium")
  {
    for(var z = 0; z < ctx.area; z++)
    {
      if(ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        colors.push(cmykToHex(colorizeNucium(ctx.nc[z],ctx)));
      }
    }
  }
  else if (req.mode == "Nutrients")
  {
    for(var z = 0; z < ctx.area; z++)
    {
      if(ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        colors.push(cmykToHex(
          addColors(colorizeNutro(ctx.nt[z],ctx), 
                    colorizeNucium(ctx.nc[z],ctx))));
      }
    }
  }
  else if (req.mode == "Sunlight")
  {
    for(var z=0; z < ctx.area; z++)
    {
      colors.push(cmykToHex(
        addColors(colorizeSunlight(ctx.sunlight[z],ctx),
                  colorizeEarth(ctx.height[z],ctx))));
    }
  }
  else if (req.mode == "Rainfall")
  {
    for(var z=0; z < ctx.area; z++)
    {
      colors.push(cmykToHex(
        addColors(colorizeRainfall(ctx.rainfall[z],ctx),
                  colorizeEarth(ctx.height[z],ctx))));
    }
  }
  else if (req.mode == "Density")
  {
    for(var z = 0 ; z < ctx.area ; z++)
    {
      if(ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        var plots = ctx.GetPlotsOfZ(z);
        var numberPlants = 0;
        for(var p = 0 ; p < plots.length ; p++)
        {
          if(ctx.hasPlant[plots[p]] == true)
          {
            numberPlants++;
          }
        }
        colors.push(cmykToHex(
          colorizeVegetation(
            numberPlants,ctx)));
      }
    }
  }
  else if (req.mode == "Nutro Stores")
  {
    columns = ctx.plantColumns;
    rows = ctx.plantRows;

    for(var p = 0 ; p < ctx.plantArea ; p++)
    {
      var z = ctx.ConvertPToZ(p);

      if(ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        colors.push(cmykToHex(
          colorizeNuciumStore(
            (ctx.hasPlant[p] ? ctx.ntStore[p] : 0),
            ctx)));
      }
    }
  }
  else if (req.mode == "Nucium Stores")
  {
    columns = ctx.plantColumns;
    rows = ctx.plantRows;

    for(var p = 0 ; p < ctx.plantArea ; p++)
    {
      var z = ctx.ConvertPToZ(p);

      if(ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        colors.push(cmykToHex(
          colorizeNutroStore(
            (ctx.hasPlant[p] ? ctx.ncStore[p] : 0),
            ctx)));
      }
    }
  }
  else if (req.mode == "Nutrient Stores")
  {
    columns = ctx.plantColumns;
    rows = ctx.plantRows;

    for(var p = 0 ; p < ctx.plantArea ; p++)
    {
      var z = ctx.ConvertPToZ(p);

      if(ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        colors.push(cmykToHex(
          addColors(colorizeNutroStore((ctx.hasPlant[p] ? ctx.ntStore[p] : 0),ctx), 
                    colorizeNuciumStore((ctx.hasPlant[p] ? ctx.ncStore[p] : 0),ctx))));
            
      }
    }
  }
  else if (req.mode == "Generation")
  {
    columns = ctx.plantColumns;
    rows = ctx.plantRows;

    for(var p = 0 ; p < ctx.plantArea ; p++)
    {
      var z = ctx.ConvertPToZ(p);

      if(ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        if(!ctx.youngest)
          ctx.youngest = 1;
        
        if(ctx.hasPlant[p]) {
          colors.push(cmykToHex(
            colorValueBetween(ctx.generation[p], 0, ctx.youngest, tallestPlant, shortestPlant)));
        }
        else
          colors.push(cmykToHex(white));
      }
    }
  }
  else if (req.mode == "Growth")
  {
    columns = ctx.plantColumns;
    rows = ctx.plantRows;

    for(var p = 0 ; p < ctx.plantArea ; p++)
    {
      var z = ctx.ConvertPToZ(p);

      if(ctx.depth[z]>0)
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        colors.push(cmykToHex(
          colorValueBetween(
            (ctx.hasPlant[p] ? ctx.growth[p] : 0),
            0, ctx.tallestTree, shortestPlant, tallestPlant)));
      }
    }
  }
  else if (req.mode == "Thirst")
  {
    columns = ctx.plantColumns;
    rows = ctx.plantRows;

    for(var p = 0 ; p < ctx.plantArea ; p++)
    {
      var z = ctx.ConvertPToZ(p);

      if(ctx.depth[z]>0 )
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        colors.push(
          cmykToHex(
            colorValueBetween(
                (ctx.hasPlant[p] ? ctx.thirst[p] : 0), 
                0, ctx.thirstiest, drizzle, monsoon)));
      }
    }
  }
  else if (req.mode == "Heliophilia")
  {
    columns = ctx.plantColumns;
    rows = ctx.plantRows;

    for(var p = 0 ; p < ctx.plantArea ; p++)
    {
      var z = ctx.ConvertPToZ(p);

      if(ctx.depth[z]>0 )
      {
        colors.push(cmykToHex(colorizeWater(ctx.depth[z],ctx)));
      }
      else
      {
        colors.push(
          cmykToHex(
            colorValueBetween(
                (ctx.hasPlant[p] ? ctx.heliophilia[p] : 0), 
                0, ctx.heliest, lowestValley, brightest)));
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

  var cymk=  {
    c: Math.round(bottomColor.c - (deltaColor.c*ratio)),
    m: Math.round(bottomColor.m - (deltaColor.m*ratio)),
    y: Math.round(bottomColor.y - (deltaColor.y*ratio)),
    k: Math.round(bottomColor.k - (deltaColor.k*ratio))
  };
  return cymk;
}
function cmykToHex(cmyk){
  
  var c =  cmyk.c / 100;
  var m =  cmyk.m / 100;
  var y = cmyk.y / 100;
  var k =  cmyk.k / 100;
  
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

function colorizeNutro(value,ctx)
{
  return colorValueBetween(value,0,ctx.richestNutro,weakNutro,strongNutro); 
}

function colorizeNucium(value,ctx)
{
  return colorValueBetween(value,0,ctx.richestNucium,weakNucium,strongNucium);  
}

function colorizeNutroStore(value,ctx)
{
  return colorValueBetween(value,0,ctx.richestNutroStore,weakNutro,strongNutro);  
}
function colorizeNuciumStore(value,ctx)
{
  return colorValueBetween(value,0,ctx.richestNuciumStore,weakNucium,strongNucium); 
}

function colorizeVegetation(value,ctx)
{
  return colorValueBetween(value,0,ctx.plantColumnsPer*ctx.plantRowsPer,sparseVegetation,thickVegetation);
}

function colorizeEarth(value,ctx)
{
  return colorValueBetween(value,0,ctx.highest,lowestValley,tallestMountain);
}
function colorizeWater(value,ctx)
{
  return colorValueBetween(value,0,ctx.deepest,shallowestOcean,deepestOcean);
}
