'use strict';

var utility = require('./utility.js');
var plants = require('./plant.js');
var water = require('./water.js');
var render = require('./render.js');

exports.createTectonicPlates = function(ctx)
{
  heat(ctx);
  stress(ctx);
  fracture(ctx);
  continuity(ctx);
};

exports.advanceTectonics = function (ctx)
{
  heat(ctx);
  stress(ctx);
  fracture(ctx);
  continuity(ctx);

  // movement(ctx);
};

function heatProvince(z, ctx)
{
	ctx.heat[z] = Math.max(0, Math.round(ctx.height[z] - (ctx.depth[z]/2)));//Math.max(0, Math.round(ctx.heat[z] +  ctx.height[z] - (ctx.depth[z]/2)));
};
function giveHeat (z, ctx)
{
	var heat = ctx.heat[z];
  var neighbors = ctx.GetNeighbors(z, false);

  var numberPossibleDonees = 0;
  //  Continually give out heat till you can't
  do
  {
    heat = ctx.heat[z];

    var steepestSlope = 0;
    var steepestSlopeValue = 0;
    numberPossibleDonees = 0;

    //  Find the steepest slope
    for (var n = 0; n < neighbors.length; n++)
    {
      var n_index = neighbors[n];

      var neighborHeat = ctx.heat[n_index];

      var slope = heat - neighborHeat;
      // slope = -slope;  Heat flows to hot spots

      //  Do we have a downward slow too great?
      if (slope > 0)
      {
        numberPossibleDonees++;

        if (slope > steepestSlopeValue)
        {
          steepestSlope = n;
          steepestSlopeValue = slope;
        }
      }
    }

    if (numberPossibleDonees >= 1)
    {
      //  There was at least one downward slope that was too great
      var n_index = neighbors[steepestSlope];

      //  Can we pass half our height difference
      if (ctx.heat[z] > (steepestSlopeValue / 2))
      {
        //  Yes we can
        ctx.heat[z] -= (steepestSlopeValue / 2);
        ctx.heat[n_index] += (steepestSlopeValue / 2);
      }
      else
      {
        //  No we cant give enoguht to level them so we give all instead
        ctx.heat[z] = 0;
        ctx.heat[n_index] += ctx.heat[z];
      }
    }
  }
  //If we had more than one possibility than we can try again
  while (false)//(numberPossibleDonees > 1 && ctx.heat[z] > 0);
};
function heat(ctx)
{
	for(var z = 0 ; z < ctx.area ; z++) {
		heatProvince(z, ctx);
	}
		
	//  Randomizing flow order for fairness
  var tectonicOrder = new Array(ctx.area);
  for (var i = 0; i < ctx.area; ++i) { tectonicOrder[i] = i; }
  tectonicOrder = utility.shuffle(tectonicOrder);

	//  Flow the heat
	for(var t = 0 ; t < ctx.area; t++){
		var z = tectonicOrder[t];

	  giveHeat(z,ctx);
	}
};
function stress(ctx)
{
  for(var z = 0 ; z < ctx.area ; z++) 
  {
    ctx.stress[z] = 0;
  }
	for(var z = 0 ; z < ctx.area ; z++) 
	{
    var heat = ctx.heat[z];
    var plate = ctx.tectonic[z];

		var neighbors = ctx.GetNeighbors(z,false);
    for (var n = 0; n < neighbors.length; n++)
    {
    	if(ctx.tectonic[neighbors[n]] == plate) {
      	ctx.stress[z] += Math.abs(ctx.heat[z] - ctx.heat[neighbors[n]]);
	    }
    }
	}
};

function fracture(ctx)
{
  for(var z = 0 ; z < ctx.area ; z++) 
  {
    ctx.fracture[z] = 0;
  }
  var hottest = 0;
  var hottestIndex = 0;
  for(var z = 0 ; z < ctx.area ; z++)
  {
    if(ctx.heat[z] > hottest && !ctx.fracture[z])
    {
      hottest = ctx.heat[z];
      hottestIndex = z;
    }
  }
  // console.log(hottest);
  var stressIndex = hottestIndex;
  var plate = ctx.tectonic[stressIndex];
  while(true)
  {
    var neighbors = ctx.GetNeighbors(stressIndex,true);
    var mostStressedNeighbor = -1;
    var mostStressedNeighborIndex = -1;
    for (var n = 0; n < neighbors.length; n++)
    {
      if( !ctx.fracture[neighbors[n]] && 
          ctx.stress[neighbors[n]] > mostStressedNeighbor &&
          ctx.tectonic[stressIndex] == plate) 
      {
        mostStressedNeighbor = ctx.stress[neighbors[n]];
        mostStressedNeighborIndex = neighbors[n]; 
      }
    }

    if(mostStressedNeighborIndex==-1)
      break;

    ctx.fracture[stressIndex] = 1;
    stressIndex = mostStressedNeighborIndex;
  }

};
function countPlates(counter, ctx)
{
  for(var z = 0 ; z < ctx.area ; z++)
  {
    if(ctx.fracture[z])
      continue;
  
    if(!counter[ctx.tectonic[z]])
      counter[ctx.tectonic[z]] = 0;
    
    counter[ctx.tectonic[z]]++;
  }
};
function continuity(ctx)
{
  //  Counting the total area of unsplit plates
  var plateCounts = {};
  countPlates(plateCounts, ctx);

  var checkedPlateNumbers = {};
  for(var z = 0 ; z < ctx.area ; z++)
  {
    if(ctx.fracture[z])
      continue;

    if(checkedPlateNumbers[ctx.tectonic[z]] == null)
    {
      //  We havent checked this plate, consider this block its check
      var oldNumber = ctx.tectonic[z];

      var visited = Array.apply(null, { length: ctx.area }).map( function() { return 0; });
      var pieceSize = checkPlateSize(z, oldNumber, visited, ctx);
      // console.log("Plate " + oldNumber + " has a piece of size " + pieceSize +" with a full size of " + plateCounts[oldNumber]);
      
      if(pieceSize == plateCounts[ctx.tectonic[z]] || 
        Math.abs(pieceSize - plateCounts[oldNumber]) < 6)
      {
        //  No dicontinuity
        //console.log("The " + render.describePlateColor(ctx.tectonic[z]) + " plate is contiguous.");
        checkedPlateNumbers[ctx.tectonic[z]] = 1;
        continue;
      }
      

      //  This isnt the whole plate, it must have gotten seperated, relabel!
      var newPlateNumber = oldNumber;

      //  This isnt stopping tkaing over
      while(checkedPlateNumbers[newPlateNumber] != null || newPlateNumber == ctx.tectonic[z] || plateCounts[newPlateNumber] != null){
        newPlateNumber++;
      }
      // console.log("The " + render.describePlateColor(ctx.tectonic[z]) + " plate fractured, the new plate is " + 
      //   render.describePlateColor(newPlateNumber) + " colored.");

      //  Recolor the new plate wiht the new plate number
      var count = renumberPlate(z, oldNumber, newPlateNumber, ctx);
      
      // var cleanupVisited = Array.apply(null, { length: ctx.area }).map( function() { return 0; });
      // cleanupFracture(z,cleanupVisited, oldNumber, newPlateNumber,ctx);

      //  The new plate has the full count, while the original plate loses this breakoff, other way around
      //console.log("Creating Plate " + newPlateNumber + " with size " + count);
      plateCounts[newPlateNumber] = count;

      //console.log(plateCounts);

      //console.log("Subtracting " + count + " from Plate " + oldNumber + " which has a size of " + plateCounts[oldNumber]);
      plateCounts[oldNumber] -= count;

      //console.log(plateCounts);


      //  This new plate is checked, but the plate we started as isnt.
      checkedPlateNumbers[newPlateNumber] = 1;
    }
  }
  //console.log(checkedPlateNumbers);
  //console.log("end of month\n\n");
};
function cleanupFracture(z, visited, oldNumber, newNumber, ctx)
{
  if(visited[z])
    return 0;

  visited[z] = true;

  if(ctx.tectonic[z] == newNumber || (ctx.fracture[z] && ctx.tectonic[z] == oldNumber))
  {
    var count = 0;
    if(ctx.fracture[z] && ctx.tectonic[z] == oldNumber)
    {
      ctx.fracture[z] = false;
      count++;
    }
    ctx.tectonic[z] = newNumber;

    var coord = ctx.ConvertToCoord(z);
    count += cleanupFracture(ctx.ConvertToZ({ f: coord.f+1, s: coord.s }), visited, oldNumber, newNumber, ctx);
    count += cleanupFracture(ctx.ConvertToZ({ f: coord.f-1, s: coord.s }), visited, oldNumber, newNumber, ctx);
    count += cleanupFracture(ctx.ConvertToZ({ f: coord.f, s: coord.s+1 }), visited, oldNumber, newNumber, ctx);
    count += cleanupFracture(ctx.ConvertToZ({ f: coord.f, s: coord.s-1 }), visited, oldNumber, newNumber, ctx);
    return count;
  }
  return 0;
};
function renumberPlate(z, oldNumber, newNumber, ctx)
{
  if(ctx.tectonic[z] != oldNumber || ctx.fracture[z])
    return 0;
  
  var count = 1;
  ctx.tectonic[z] = newNumber;

  var coord = ctx.ConvertToCoord(z);
  count += renumberPlate(ctx.ConvertToZ({ f: coord.f+1, s: coord.s }), oldNumber, newNumber, ctx);
  count += renumberPlate(ctx.ConvertToZ({ f: coord.f-1, s: coord.s }), oldNumber, newNumber, ctx);
  count += renumberPlate(ctx.ConvertToZ({ f: coord.f, s: coord.s+1 }), oldNumber, newNumber, ctx);
  count += renumberPlate(ctx.ConvertToZ({ f: coord.f, s: coord.s-1 }), oldNumber, newNumber, ctx);
  return count;
};
function checkPlateSize(z, plateNumber, visited, ctx)
{
  if(visited[z] || ctx.fracture[z] || ctx.tectonic[z] != plateNumber)
    return 0;
  
  visited[z] = 1;
  var count = 1;

  var coord = ctx.ConvertToCoord(z);
  count += checkPlateSize(ctx.ConvertToZ({ f: coord.f+1, s: coord.s }), plateNumber, visited, ctx);
  count += checkPlateSize(ctx.ConvertToZ({ f: coord.f-1, s: coord.s }), plateNumber, visited, ctx);
  count += checkPlateSize(ctx.ConvertToZ({ f: coord.f, s: coord.s+1 }), plateNumber, visited, ctx);
  count += checkPlateSize(ctx.ConvertToZ({ f: coord.f, s: coord.s-1 }), plateNumber, visited, ctx);
  return count;
};

function movement(ctx)
{
  var plateXVelocities = {};
  var plateYVelocities = {};
  velocity(ctx,plateXVelocities,plateYVelocities);

  if(Object.keys(plateXVelocities).length == 1)
    return; //  We only have one plate, no need to move

  var newPlateLocations = [];

  for(var z = 0 ; z < ctx.area ; z++)
  {
    var plate = ctx.tectonic[z];
    var currentLocationCoord = ctx.ConvertToCoord(z);

    var newLocation = ctx.ConvertToZ(
      { 
          f: currentLocationCoord.f + (plateXVelocities[plate] >= 0 ? 1 : -1)
        , s: currentLocationCoord.s + (plateYVelocities[plate] >= 0 ? 1 : -1)
      });

    if(newPlateLocations[newLocation] == null)
      newPlateLocations[newLocation] = [];
     
    newPlateLocations[newLocation].push({
      plate: plate
      , heat: ctx.heat[z]
      , height: ctx.height[z]
      , oldLocation: z
      , plants: {} 
    });
  }

  stackResolution(newPlateLocations, plateXVelocities, plateYVelocities, ctx);
  water.flushWater(ctx);
};
function velocity(ctx, plateXVelocities, plateYVelocities)
{
  for(var z = 0 ; z < ctx.area ; z++)
  {
    var plate = ctx.tectonic[z];

    if(plateXVelocities[plate] == null)
    {
      plateXVelocities[plate] = 0;
      plateYVelocities[plate] = 0;
    }

    //  Note the coordinates are reversed, tall heat on left pushes you RIGHT.
    var coord = ctx.ConvertToCoord(z);
    var rightLean = ctx.heat[ctx.ConvertToZ({ f: coord.f-1, s: coord.s })];
    var leftLean = ctx.heat[ctx.ConvertToZ({ f: coord.f+1, s: coord.s })];
    var upLean = ctx.heat[ctx.ConvertToZ({ f: coord.f, s: coord.s+1 })];
    var downLean = ctx.heat[ctx.ConvertToZ({ f: coord.f, s: coord.s-1 })];

    plateXVelocities[plate] += Math.round(rightLean - leftLean);
    plateYVelocities[plate] += Math.round(downLean - upLean);
  }
  //console.log(plateXVelocities);
  // console.log(plateYVelocities);
};

function stackResolution(newLocations, plateXVelocities, plateYVelocities, ctx)
{
  for(var z = 0 ; z < ctx.area ; z ++)
  {
    var conflicts = newLocations[z];

    if(conflicts == [] || !conflicts)
    {
      //  This is a rift from where a plate was
      ctx.height[z] += utility.randomNumberBetween(2,2);
      
      var plots = ctx.GetPlotsOfZ(z);
      for( var q = 0 ; q < plots.length ; q ++)
      {
        plants.killPlant(plots[q], z, ctx, "These plants moved", false);
      }
      continue;
    }

    if(conflicts.length == 1) {
      ctx.tectonic[z] = conflicts[0].plate;
    }
    else {
      //  Combine heat and and heihgt to see which plate is on top and the resulting mountain
      var newHeight = 0;
      var tallestPlateIndex = 0;
      var tallestPlate = 0;
      for( var c = 0 ; c < conflicts.length ; c++)
      {
        var conflictHeight = conflicts[c].heat + conflicts[c].height;
        if(conflictHeight > tallestPlate)
        {
          tallestPlate = conflictHeight;
          tallestPlateIndex = c;
        }

      }
      var chosenPlate = conflicts[tallestPlateIndex];

      ctx.tectonic[z] = chosenPlate.plate;
      
      if(z != chosenPlate.oldLocation) 
      {
        ctx.height[z] = chosenPlate.height + chosenPlate.heat - ctx.height[z];
        ctx.height[chosenPlate.oldLocation] -= chosenPlate.height;
      }
      //  Move plants here
      
      //  THIS IS A COLLISION CREATE A MOUNTAIN using veolicty and heat
    }
  }
};

// void TectonicHandler::AdvanceTectonics()
// {
// 	//		ASTHENOSPHERE HEATMAP		//
// 	int hottest_asthenosphere = 0;
// 	Vector2 hottest_asthenosphere_location (0,0);
// 	for (int y = 0; y < context->world_height; y++)
// 	{
// 		for (int x = 0; x < context->world_width; x++)
// 		{
// 			//context->asthenosphere_heat_map[y][x] = 0;
// 			context->asthenosphere_heat_map[y][x] += context->provinces[y][x]->altitude;
// 			context->asthenosphere_heat_map[y][x] -= context->provinces[y][x]->water_depth;

// 			if(context->asthenosphere_heat_map[y][x]>hottest_asthenosphere)
// 			{
// 				hottest_asthenosphere = context->asthenosphere_heat_map[y][x];
// 				hottest_asthenosphere_location.x = x;
// 				hottest_asthenosphere_location.y = y;

// 			}
// 		}
// 	}

// 	//		MOVE EACH PLATE		//
// 	for (int t = 0; t < context->tectonic_plates.size(); t++)
// 	{
// 		//Setting direction of plate depending on the asthenosphere heat map
// 		if((hottest_asthenosphere - CalculateAverageAsthenosphereTemperature(context->tectonic_plates[t])) > (hottest_asthenosphere/2))
// 		{
// 			Vector2 plate_center = CalculatePlateCenter(context->tectonic_plates[t]);
// 			Vector2 difference_in_centers (hottest_asthenosphere_location.x - plate_center.x, hottest_asthenosphere_location.y - plate_center.y);

// 			if(difference_in_centers.x >0)
// 				context->tectonic_plates[t]->x_velocity = -1;
// 			else if(difference_in_centers.x ==0)
// 				context->tectonic_plates[t]->x_velocity = 0;
// 			else
// 				context->tectonic_plates[t]->x_velocity = 1;

// 			if(difference_in_centers.y >0)
// 				context->tectonic_plates[t]->y_velocity = -1;
// 			else if(difference_in_centers.y ==0)
// 				context->tectonic_plates[t]->y_velocity = 0;
// 			else
// 				context->tectonic_plates[t]->y_velocity = 1;
// 		}
// 		else
// 		{
// 			context->tectonic_plates[t]->x_velocity = 0;
// 			context->tectonic_plates[t]->y_velocity = 0;
// 		}

// 		//		PLATE MOVEMENT		//
// 		for (int p = 0; p < context->tectonic_plates[t]->provinces_in_plate.size(); p++)
// 		{
// 			int where_it_was_x = context->tectonic_plates[t]->provinces_in_plate[p]->x;
// 			int where_it_was_y = context->tectonic_plates[t]->provinces_in_plate[p]->y;

// 			int wrapped_x = where_it_was_x + context->tectonic_plates[t]->x_velocity;
// 			int wrapped_y = where_it_was_y + context->tectonic_plates[t]->y_velocity;

// 			context->WrapCoordinates(&wrapped_x,&wrapped_y);

// 			//Checking for redundancies
// 			bool already_have_this_plate = false;
// 			for (int q = 0; q < context->new_plates_on_province[wrapped_y][wrapped_x].size(); q++)
// 				if(context->new_plates_on_province[wrapped_y][wrapped_x][q] == t)
// 					already_have_this_plate = true;

// 			if(!already_have_this_plate)//Don't add it if we already have it
// 				context->new_plates_on_province[wrapped_y][wrapped_x].push_back(t);
// 		}
// 	}

// 	//		CONFLICT RESOLUTION		//
// 	for (int y = 0; y < context->world_height; y++)
// 	{
// 		for (int x = 0; x < context->world_width; x++)
// 		{
// 			if(context->new_plates_on_province[y][x].size()>0)
// 			{
// 				//The plates that are conflicting on this province
// 				std::vector<int> tectonic_plate_conflicts = context->new_plates_on_province[y][x];

// 				int non_subducting_plate = tectonic_plate_conflicts[0];

// 				//Do we still have conflict
// 				if(tectonic_plate_conflicts.size() > 1)
// 				{
// 					int highest_density = INT_MIN;

// 					for (int c = 0; c < tectonic_plate_conflicts.size(); c++)
// 					{
// 						//Determining which plate will not get subducted and destroyed
// 						int plate_density = CalculatePlateDensity(context->tectonic_plates[c]);
// 						if(plate_density >= highest_density)
// 						{
// 							highest_density = plate_density;
// 							non_subducting_plate = tectonic_plate_conflicts[c];
// 						}
// 					}
// 				}

// 				//Subtract from all moved plates but only add if its the winning plate
// 				for (int i = 0; i < tectonic_plate_conflicts.size(); i++)
// 				{
// 					Vector2 old_position(
// 						x - context->tectonic_plates[tectonic_plate_conflicts[i]]->x_velocity,
// 						y - context->tectonic_plates[tectonic_plate_conflicts[i]]->y_velocity);

// 					context->WrapCoordinates(&old_position);

// 					int altitude_move = context->provinces[old_position.y][old_position.x]->altitude;

// 					//Now move the altitude from the chosen plate
// 					if(tectonic_plate_conflicts[i] == non_subducting_plate)
// 					{
// 						pending_altitude_changes[y][x] += altitude_move;
// 					}
// 					else
// 					{
// 						pending_altitude_changes[y][x] += altitude_move/3;
// 					}
// 					pending_altitude_changes[old_position.y][old_position.x] -=  altitude_move;
// 				}
// 			}
// 		}
// 	}
// 	//Apply the height changes
// 	for (int y = 0; y < context->world_height; y++)
// 	{
// 		for (int x = 0; x < context->world_width; x++)
// 		{
// 			if(pending_altitude_changes[y][x]!=0)
// 			{
// 				context->provinces[y][x]->altitude += pending_altitude_changes[y][x];
// 				pending_altitude_changes[y][x] =0;
// 			}
// 		}
// 	}

// 	//		Fill in the gaps!		//
// 	std::vector<Province*> provinces_without_plate_neighbors;//Any provinces that have no nearby plates are put into this list and handled later
// 	for (int y = 0; y < context->world_height; y++)
// 	{
// 		for (int x = 0; x < context->world_width; x++)
// 		{
// 			if(context->new_plates_on_province[y][x].size() == 0)
// 			{
// 				//Perhaps only add altitude if there is water...
// 				if(context->provinces[y][x]->altitude==0)
// 				{
// 					context->provinces[y][x]->altitude+= RandomNumberBetween(5,16);//Magma is melting! add some altitude
// 				}

// 				//The number of times a plate is a neighbor
// 				std::unordered_map<int,int> neighboring_plate_occurences;

// 				//Make it more likely for the old plate to take over the space
// 				neighboring_plate_occurences[context->old_plates_on_province[y][x][0]]++;

// 				bool no_nearby_plates = true;

// 				//Cylcing through neighbors
// 				std::vector<Province*> neighbors = context->GetDiamondOfProvinces(x,y,1,false);
// 				for (int p = 0; p < neighbors.size(); p++)
// 				{
// 					Province* prov = neighbors[p];
// 					if(context->new_plates_on_province[prov->province_y][prov->province_x].size()!=0)
// 					{
// 						neighboring_plate_occurences[context->new_plates_on_province[prov->province_y][prov->province_x][0]]++;
// 						no_nearby_plates = false;
// 					}
// 				}
// 				if(no_nearby_plates == false)
// 				{
// 					int highest_occurence = 0;
// 					int chosen_plate = 0;
// 					//Figuring out which plate occurs the most
// 					for (auto it = neighboring_plate_occurences.begin(); it != neighboring_plate_occurences.end(); ++it) 
// 					{
// 						if(it->second>highest_occurence	)
// 						{
// 							highest_occurence = it->second;
// 							chosen_plate = it->first;
// 						}
// 					}
// 					context->tectonic_plates[chosen_plate]->provinces_in_plate.push_back(new Vector2(x,y));
// 					context->new_plates_on_province[y][x].push_back(chosen_plate);
// 				}
// 				else
// 				{
// 					provinces_without_plate_neighbors.push_back(context->provinces[y][x]);
// 				}
// 			}
// 		}
// 	}

// 	//Clear out what the tectonic plate was
// 	for (int t = 0; t < context->tectonic_plates.size(); t++)
// 	{
// 		for (int i = 0; i < context->tectonic_plates[t]->provinces_in_plate.size(); i++)
// 		{
// 			delete(context->tectonic_plates[t]->provinces_in_plate[i]);
// 		}
// 		context->tectonic_plates[t]->provinces_in_plate.clear();
// 	}

// 	//Now recreate the plates
// 	for (int x = 0; x < context->world_width; x++)
// 	{
// 		for (int y = 0; y < context->world_height; y++)
// 		{
// 			if(context->new_plates_on_province[y][x].size()>0)
// 			{
// 				context->tectonic_plates[context->new_plates_on_province[y][x][0]]->provinces_in_plate.push_back(new Vector2(x,y));//Where it is now
// 			}
// 			if(context->provinces[y][x]->water_depth>0)
// 				TectonicHandler::unresolved_water.push_back(context->provinces[y][x]);

// 		}
// 	}

// 	//Update the new to the old 
// 	for (int y = 0; y < context->world_height; y++)
// 	{
// 		for (int x = 0; x < context->world_width; x++)
// 		{
// 			context->old_plates_on_province[y][x].clear();
// 			context->old_plates_on_province[y][x].push_back(context->new_plates_on_province[y][x][0]);
// 			context->new_plates_on_province[y][x].clear();

// 		}
// 	}

// 	//RESOLVING WATER
// 	for (int i = 0; i < 10; i++)
// 	{
// 		for (int x = 0; x < context->world_width; x++)
// 		{
// 			for (int y = 0; y < context->world_height; y++)
// 			{
// 				if(context->provinces[y][x]->water_depth>0)
// 					TectonicHandler::unresolved_water.push_back(context->provinces[y][x]);
// 			}
// 		}
// 		ResolveAllWater();
// 	}


// 	//Any uncovered land becomes grassland
// 	for (int y= 0; y < context->world_height; y++)
// 	{
// 		for (int x= 0; x < context->world_width; x++)
// 		{
// 			if(context->provinces[y][x]->water_depth==0)
// 			{
// 				context->provinces[y][x]->biome = GRASSLAND;
// 			}
// 		}
// 	}

// 	//Resolve new plates speeds


// };

// int TectonicHandler::CalculatePlateDensity(TectonicPlate* myPlate)
// {
// 	int total_landmass = 0;
// 	int total_water = 0;
// 	int total_distance_from_equator= 0;
// 	for (int p = 0; p < myPlate->provinces_in_plate.size(); p++)
// 	{
// 		//This method compares the all land to the all water provinces and considers water provinces fully cool
// 		if(context->provinces[myPlate->provinces_in_plate[p]->y][myPlate->provinces_in_plate[p]->x]->water_depth==0)
// 		{
// 			total_landmass++;
// 		}
// 		else
// 		{
// 			total_water++;
// 		}
// 		total_distance_from_equator += abs( context->world_height/2 - myPlate->provinces_in_plate[p]->y);

// 		//This method compares teh total amount of land vs the total amount of water for different ranges
// 		//total_landmass+=context->provinces[myPlate->provinces_in_plate[p]->y][myPlate->provinces_in_plate[p]->x]->altitude;
// 		//total_water+=context->provinces[myPlate->provinces_in_plate[p]->y][myPlate->provinces_in_plate[p]->x]->water_depth;
// 	}
// 	total_distance_from_equator/=myPlate->provinces_in_plate.size();
// 	if(total_landmass == 0){return 0 ;}

// 	if(total_water!=0)
// 		return total_landmass/total_water/total_distance_from_equator;
// 	else
// 	{
// 		return total_landmass;
// 	}
// };
// Vector2 TectonicHandler::CalculatePlateCenter(TectonicPlate* myPlate)
// {
// 	Vector2 total (0,0);

// 	for (int i = 0; i < myPlate->provinces_in_plate.size(); i++)
// 	{
// 		total.x += myPlate->provinces_in_plate[i]->x;
// 		total.y += myPlate->provinces_in_plate[i]->y;
// 	}
// 	total.x/=myPlate->provinces_in_plate.size();
// 	total.y/=myPlate->provinces_in_plate.size();

// 	return total;
// };
// int TectonicHandler::CalculateAverageAsthenosphereTemperature(TectonicPlate* myPlate)
// {
// 	if(myPlate->provinces_in_plate.size()>0){
// 		int total_temperature = 0;

// 		for (int i = 0; i < myPlate->provinces_in_plate.size(); i++)
// 		{
// 			total_temperature += context->provinces[myPlate->provinces_in_plate[i]->y][myPlate->provinces_in_plate[i]->x]->altitude;
// 			total_temperature -= context->provinces[myPlate->provinces_in_plate[i]->y][myPlate->provinces_in_plate[i]->x]->water_depth;
// 		}

// 		return total_temperature/ myPlate->provinces_in_plate.size();
// 	}
// 	else
// 	{
// 		return 0;
// 	}
// };