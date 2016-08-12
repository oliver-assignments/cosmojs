var utility = require('./utility');

function heatProvince(z, ctx)
{
	ctx.heat[z] = Math.max(0, Math.round(ctx.heat[z] +  ctx.height[z] - (ctx.depth[z]/2)));
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
  var stress = 0;
  var stressIndex = 0;
  for(var z = 0 ; z < ctx.area ; z++)
  {
    if(ctx.stress[z] > stress && !ctx.fracture[z])
    {
      stress = ctx.stress[z];
      stressIndex = z;
    }
  }

  while(true)
  {
    var neighbors = ctx.GetNeighbors(stressIndex,false);

    var mostStressedNeighbor = -1;
    var mostStressedNeighborIndex = -1;
    for (var n = 0; n < neighbors.length; n++)
    {
      if(!ctx.fracture[neighbors[n]]) 
      {
        if(ctx.stress[neighbors[n]] > mostStressedNeighbor)
        {
          mostStressedNeighbor = ctx.stress[neighbors[n]];
          mostStressedNeighborIndex = neighbors[n];
        }
      }
    }

    if(mostStressedNeighborIndex==-1)
      break;

    ctx.fracture[mostStressedNeighborIndex] = 1;
    stressIndex = mostStressedNeighborIndex;
  }
};

function continuity(ctx)
{
  //  Counting the total area of unsplit plates
  var plateCounts = {};
  for(var z = 0 ; z < ctx.area ; z++)
  {
    if(ctx.fracture[z])
      continue;
  
    if(!plateCounts[ctx.tectonic[z]])
      plateCounts[ctx.tectonic[z]] = 0;
    
    plateCounts[ctx.tectonic[z]]++;
  }

  var checkedPlateNumbers = {};

  for(var z = 0 ; z < ctx.area ; z++)
  {
    if(ctx.fracture[z])
      continue;

    if(checkedPlateNumbers[ctx.tectonic[z]] == null)
    {
      //  We havent checked this plate, consider this block its check
      var visited = Array.apply(null, { length: ctx.area }).map( function() { return 0; });
      var piece = checkPlateSize(z, visited, ctx);
      
      console.log("Our piece was " + piece + " and the whole was " + plateCounts[ctx.tectonic[z]]);
      if(piece != plateCounts[ctx.tectonic[z]])
      {
        //  This isnt the whole plate, it must have gotten seperated, relabel!
        var newPlateNumber = 0;
        while(checkedPlateNumbers[newPlateNumber] != null || newPlateNumber == ctx.tectonic[z]){
          newPlateNumber++;        
        }

        //  Recolor the new plate wiht the new plate number
        // var originalPlate = Array.apply(null, { length: ctx.area }).map( function() { return 0; });
        // markOriginalPlate(z, originalPlate, ctx.tectonic[z], ctx);
        // var count = renumberShard(originalPlate, ctx.tectonic[z], newPlateNumber, ctx);

        var count = renumberPlate(z, ctx.tectonic[z], newPlateNumber, ctx);
        
        //  The new plate has the full count, while the original plate loses this breakoff
        plateCounts[newPlateNumber] = count;
        plateCounts[ctx.tectonic[z]] -= count;

        //  This new plate is checked, but the plate we started as isnt.
        checkedPlateNumbers[newPlateNumber] = 1;
      }
      else {
        //  We did not alter the plate, it is complete and uncut, checked.
        checkedPlateNumbers[ctx.tectonic[z]] = 1;
      }
    }
  }
};
function markOriginalPlate(z, visited, oldNumber, ctx)
{
  if(ctx.tectonic[z] != oldNumber || visited[z])
    return;
  
  visited[z] = true;

  var coord = ctx.ConvertToCoord(z);
  markOriginalPlate(ctx.ConvertToZ({ f: coord.f+1, s: coord.s }), visited, oldNumber, ctx);
  markOriginalPlate(ctx.ConvertToZ({ f: coord.f-1, s: coord.s }), visited, oldNumber, ctx);
  markOriginalPlate(ctx.ConvertToZ({ f: coord.f, s: coord.s+1 }), visited, oldNumber, ctx);
  markOriginalPlate(ctx.ConvertToZ({ f: coord.f, s: coord.s-1 }), visited, oldNumber, ctx);
};
function renumberShard(visited, oldNumber, newNumber, ctx)
{
  for(var z = 0 ; z < ctx.area ; z++)
  {
    if(ctx.tectonic[z] != oldNumber || visited[z])
      continue;

    return renumberPlate(z, oldNumber, newNumber, ctx);
  }
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
function checkPlateSize(z, visited, ctx)
{
  if(visited[z] || ctx.fracture[z])
    return 0;
  
  visited[z] = 1;
  var count = 1;

  var coord = ctx.ConvertToCoord(z);
  count += checkPlateSize(ctx.ConvertToZ({ f: coord.f+1, s: coord.s }), visited, ctx);
  count += checkPlateSize(ctx.ConvertToZ({ f: coord.f-1, s: coord.s }), visited, ctx);
  count += checkPlateSize(ctx.ConvertToZ({ f: coord.f, s: coord.s+1 }), visited, ctx);
  count += checkPlateSize(ctx.ConvertToZ({ f: coord.f, s: coord.s-1 }), visited, ctx);
  return count;
};

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
}

// void TectonicHandler::CreateTectonicPlates()
// {
// 	int provinces_without_plate = context->world_height * context->world_width;

// 	int plate_count = 0;
// 	int reject_count=0;

// 	//Initializing the grid for tectonic plates
// 	for (int y = 0; y < context->world_height; y++)
// 	{
// 		std::vector<bool> row_of_taken_provinces;
// 		has_plate.push_back(row_of_taken_provinces);

// 		std::vector<int> row_of_altitude_changes;
// 		pending_altitude_changes.push_back(row_of_altitude_changes);

// 		std::vector<int> row_of_astehnosphere_heat;
// 		context->asthenosphere_heat_map.push_back(row_of_astehnosphere_heat);

// 		std::vector<std::vector<int>> row_of_list_of_new_plates_on_province;
// 		context->new_plates_on_province.push_back(row_of_list_of_new_plates_on_province);

// 		std::vector<std::vector<int>> row_of_list_of_old_plates_on_province;
// 		context->old_plates_on_province.push_back(row_of_list_of_old_plates_on_province);

// 		for (int x = 0; x < context->world_width; x++)
// 		{
// 			has_plate[y].push_back(false);
// 			pending_altitude_changes[y].push_back(0);
// 			context->asthenosphere_heat_map[y].push_back(0);
// 			context->new_plates_on_province[y].push_back(*new std::vector<int>);
// 			context->old_plates_on_province[y].push_back(*new std::vector<int>);
// 		}
// 	}

// 	//CREATING ALL THE PLATES
// 	while(provinces_without_plate>0)
// 	{
// 		if(reject_count<1000)
// 		{
// 			int radius = (context->world_width+context->world_height)/15;

// 			TectonicPlate* tectonic_plate = new TectonicPlate();
// 			tectonic_plate->plate_number = plate_count;
// 			plate_count++;

// 			//Finding a good blob origin that isnt already taken
// 			int cluster_origin_province_x=-1;
// 			int cluster_origin_province_y=-1;

// 			//Finding a starting location
// 			while(cluster_origin_province_x==-1 && cluster_origin_province_y==-1)
// 			{
// 				int attempted_x = RandomNumberBelow(context->world_width);
// 				int attempted_y = RandomNumberBelow(context->world_height);

// 				//This hasnt been taken, go ahead and use it as your center
// 				if(has_plate[attempted_y][attempted_x] == false)
// 				{
// 					cluster_origin_province_x = attempted_x;
// 					cluster_origin_province_y = attempted_y;
// 				}
// 				tectonic_plate->provinces_in_plate.push_back(new Vector2(cluster_origin_province_x,cluster_origin_province_y = attempted_y));
// 			}

// 			//Creating # of smaller diamonds near our center
// 			for (int q = 0; q < 60; q++)
// 			{
// 				//Wrap the x
// 				int piece_origin_x = cluster_origin_province_x + RandomNumberBetween(-radius,radius);
// 				if(piece_origin_x<0)
// 					piece_origin_x+=context->world_width;
// 				if(piece_origin_x>=context->world_width)
// 					piece_origin_x-=context->world_width;

// 				//But not the y
// 				int piece_origin_y = cluster_origin_province_y + RandomNumberBetween(-radius,radius);
// 				if(piece_origin_y<0)
// 					continue;
// 				if(piece_origin_y>=context->world_height)
// 					continue;

// 				//A mildy random piece size
// 				//radius =(context->world_width+context->world_height)/RandomNumberBetween(6,15);
// 				int piece_radius = radius/2;

// 				//The coordinates of the piece
// 				std::vector<Province*> piece = context->GetDiamondOfProvinces(piece_origin_x,piece_origin_y,piece_radius,true);

// 				//Making sure this province is not taken by another plate or itself
// 				for (int m = 0; m < piece.size(); m++)
// 				{
// 					if(has_plate[piece[m]->province_y][piece[m]->province_x] == false)
// 					{
// 						//Add it to our plate!
// 						tectonic_plate->provinces_in_plate.push_back(new Vector2(piece[m]->province_x,piece[m]->province_y));
// 					}
// 				}
// 			}

// 			//	DUPLICATE CLEANING	//
// 			int duplicate_count = 0;
// 			vector<Vector2*> nonduplicated_provinces;
// 			for (int w = 0; w < tectonic_plate->provinces_in_plate.size(); w++)
// 			{
// 				bool duplicate = false;
// 				for (int a = 0; a < nonduplicated_provinces.size(); a++)
// 				{
// 					if(tectonic_plate->provinces_in_plate[w]->x==nonduplicated_provinces[a]->x && tectonic_plate->provinces_in_plate[w]->y==nonduplicated_provinces[a]->y)
// 					{
// 						duplicate = true;
// 						duplicate_count++;
// 						break;
// 					}
// 				}
// 				if(!duplicate)
// 				{
// 					nonduplicated_provinces.push_back(tectonic_plate->provinces_in_plate[w]);
// 				}
// 			}
// 			//Replacing tectonic plate province list with nonduplicate version
// 			tectonic_plate->provinces_in_plate.clear();
// 			for (int l = 0; l < nonduplicated_provinces.size(); l++)
// 			{
// 				tectonic_plate->provinces_in_plate.push_back(nonduplicated_provinces[l]);
// 			}

// 			//If its not a super tiny plate
// 			if(tectonic_plate->provinces_in_plate.size()>5)
// 			{
// 				//Depth first search to see if its contiguous
// 				std::vector<Vector2> confirmed_contiguous_provinces;

// 				Vector2 starting (tectonic_plate->provinces_in_plate[0]->x,tectonic_plate->provinces_in_plate[0]->y);

// 				TectonicHandler::PlateContiguitySearch(
// 					starting,
// 					&tectonic_plate->provinces_in_plate,
// 					&confirmed_contiguous_provinces);

// 				//If this tectonic plate checks out
// 				if(confirmed_contiguous_provinces.size() == tectonic_plate->provinces_in_plate.size())
// 				{
// 					//std::cout<<"Plate	CREATED		; it was size "<<tectonic_plate->provinces_in_plate.size()<<"."<<endl;
// 					//std::cout<<provinces_without_plate<<" provinces left to fill."<<endl;

// 					context->tectonic_plates.push_back(tectonic_plate);
// 					provinces_without_plate -= tectonic_plate->provinces_in_plate.size();

// 					for (int p = 0; p < tectonic_plate->provinces_in_plate.size(); p++)
// 					{
// 						context->old_plates_on_province[tectonic_plate->provinces_in_plate[p]->y][tectonic_plate->provinces_in_plate[p]->x].push_back(tectonic_plate->plate_number);
// 						has_plate[tectonic_plate->provinces_in_plate[p]->y][tectonic_plate->provinces_in_plate[p]->x] = true;
// 					}
// 				}
// 				else
// 				{
// 					//Not contiguous
// 					plate_count--;
// 					reject_count++;
// 				}
// 			}
// 			else
// 			{
// 				//To small
// 				plate_count--;
// 				reject_count++;
// 			}
// 		}
// 		else
// 		{
// 			std::cout<<"Reject max achieved."<<endl;
// 			break;
// 		}
// 	}

// 	//Meshing together the remaining spots
// 	std::vector<Province*> provinces_without_plate_neighbors;//Any provinces that have no nearby plates are put into this list and handled later
// 	for (int y = 0; y < context->world_height; y++)
// 	{
// 		for (int x = 0; x < context->world_width; x++)
// 		{
// 			if(context->old_plates_on_province[y][x].size() == 0)
// 			{
// 				//The number of times a plate is a neighbor
// 				std::unordered_map<int,int> neighboring_plate_occurences;
// 				bool no_nearby_plates = true;

// 				//Cylcing through neighbors
// 				std::vector<Province*> neighbors = context->GetDiamondOfProvinces(x,y,1,false);
// 				for (int p = 0; p < neighbors.size(); p++)
// 				{
// 					Province* prov = neighbors[p];
// 					if(context->old_plates_on_province[prov->province_y][prov->province_x].size()!=0)
// 					{
// 						neighboring_plate_occurences[context->old_plates_on_province[prov->province_y][prov->province_x][0]]++;
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
// 					context->old_plates_on_province[y][x].push_back(chosen_plate);
// 					provinces_without_plate--;
// 				}
// 				else
// 				{
// 					provinces_without_plate_neighbors.push_back(context->provinces[y][x]);
// 				}
// 			}
// 		}
// 	}
// 	for (int y = 0; y < context->world_height; y++)
// 	{
// 		for (int x = 0; x < context->world_width; x++)
// 		{
// 			context->asthenosphere_heat_map[y][x] += context->provinces[y][x]->altitude;
// 			context->asthenosphere_heat_map[y][x] += context->provinces[y][x]->water_depth;
// 		}
// 	}

// 	std::cout<<"Tectonic plates created."<<endl;
// };

// void TectonicHandler::PlateContiguitySearch(Vector2 myCoordinate, std::vector<Vector2*>* plate_coordinates, std::vector<Vector2>* myConnected)
// {
// 	vector<Vector2>& connected_reference = *myConnected;
// 	vector<Vector2*>& plate_reference = *plate_coordinates;

// 	Vector2 north (myCoordinate.x,myCoordinate.y-1);

// 	Vector2 east (myCoordinate.x+1,myCoordinate.y);
// 	TectonicHandler::context->WrapCoordinates(&east);

// 	Vector2 south (myCoordinate.x,  myCoordinate.y+1);

// 	Vector2 west (myCoordinate.x-1,myCoordinate.y);
// 	TectonicHandler::context->WrapCoordinates(&west);

// 	//Go through every province in the plate and see if its a neihgbor of this province
// 	for (int i = plate_reference.size()-1; i >= 0; i--)
// 	{
// 		if(plate_reference[i]->x == north.x && plate_reference[i]->y == north.y)
// 		{
// 			//Check if we already ahve it
// 			bool already_have_it = false;
// 			for (int c = 0; c < myConnected->size(); c++)
// 			{
// 				if(north.x == connected_reference[c].x && north.y == connected_reference[c].y)
// 				{
// 					already_have_it=true;
// 				}
// 			}
// 			if(!already_have_it)
// 			{
// 				myConnected->push_back((Vector2)(north));
// 				PlateContiguitySearch(north,&plate_reference,myConnected);
// 			}
// 		}
// 		if(plate_reference[i]->x == east.x && plate_reference[i]->y == east.y)
// 		{
// 			//Check if we already ahve it
// 			bool already_have_it = false;
// 			for (int c = 0; c < myConnected->size(); c++)
// 			{
// 				if(east.x == connected_reference[c].x && east.y == connected_reference[c].y)
// 				{
// 					already_have_it=true;
// 				}
// 			}
// 			if(!already_have_it)
// 			{
// 				myConnected->push_back((Vector2)(east));
// 				PlateContiguitySearch(east,&plate_reference,myConnected);
// 			}
// 		}
// 		if(plate_reference[i]->x == south.x && plate_reference[i]->y == south.y)
// 		{
// 			//Check if we already ahve it
// 			bool already_have_it = false;
// 			for (int c = 0; c < myConnected->size(); c++)
// 			{
// 				if(south.x == connected_reference[c].x && south.y == connected_reference[c].y)
// 				{
// 					already_have_it=true;
// 				}
// 			}
// 			if(!already_have_it)
// 			{
// 				myConnected->push_back((Vector2)(south));
// 				PlateContiguitySearch(south,&plate_reference,myConnected);
// 			}
// 		}
// 		if(plate_reference[i]->x == west.x && plate_reference[i]->y == west.y)
// 		{
// 			//Check if we already ahve it
// 			bool already_have_it = false;
// 			for (int c = 0; c < myConnected->size(); c++)
// 			{
// 				if(west.x == connected_reference[c].x && west.y == connected_reference[c].y)
// 				{
// 					already_have_it=true;
// 				}
// 			}
// 			if(!already_have_it)
// 			{
// 				myConnected->push_back((Vector2)(west));
// 				PlateContiguitySearch(west,&plate_reference,myConnected);
// 			}
// 		}
// 	}

// };


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