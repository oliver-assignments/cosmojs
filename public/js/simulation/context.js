function Context (name, columns, rows, myTilt,myRotationDirection) 
{
    this.name = name;
    
    this.columns = columns;
    this.rows = rows;
    this.area = rows * columns;

    this.tilt = myTilt;
    this.rotationDirection = myRotationDirection;

    this.day = 0;
    this.month = 0;
    this.year = 0;

    this.highest = 0;
    this.hottest = 0;
    this.deepest = 0;
    this.brighest = 0;
    this.wettest = 0;

    this.plantColumns = this.columns * 3;
    this.plantRows = this.rows * 3;
    this.plantArea = this.plantColumns * this.plantRows;

    this.tectonic = new Array(this.area);
    this.heat = new Array(this.area);
    this.depth = new Array(this.area);
    this.sunlight = new Array(this.area);
    this.rainfall = new Array(this.area);

    //  PLOT DATA  //
    this.soilNucium = new Array(this.plantArea);
    this.soilNutro = new Array(this.plantArea);

    //  Plant data
    this.deadPlant = new Array(this.plantArea);
    this.nuciumStore = new Array(this.plantArea);
    this.nutroStore = new Array(this.plantArea);
    this.waterStore = new Array(this.plantArea);

    //  Initializing provinces
    for(var z = 0 ; z < this.area; z++)
    {   
        this.tectonic[z] = 0;//-1;
        this.heat[z] = 0;

        this.height[z] = 3;// + RandomNumberBelow(5);
        this.depth[z] = 0;

        this.sunlight[z] = 10;
        this.rainfall[z] = 5;
    }

    //  Initializing plots
    for(var p = 0 ; p < this.plantArea; p++)
    {
        this.soilNutro[p] = 5;
        this.soilNucium[p] = 5;

        this.deadPlant[p] = true;
        this.nuciumStore[p] = 0;
        this.nutroStore[p] = 0;
        this.waterStore[p] = 0;
    }

    this.ConvertToZ = function(coord)
    {
        return WrapZ(coord.f + this.columns * coord.s);
    };
    this.ConvertToCoord = function(z)
    {
        z = WrapZ(z);
        return { f: z % this.columns, s: z / this.columns };
    };

    this.WrapCoordinate = function(coord)
    {
        while (coord.f < 0)
        {
            coord.f += this.columns;
        }
        while (coord.f >= numberColumns)
        {
            coord.f -= this.columns;
        }

        while (coord.s < 0)
        {
            coord.s += this.rows;
        }
        while (coord.s >= numberRows)
        {
            coord.s -= this.columns;
        }

        return coord;
    };
    this.WrapZ = function(z)
    {
        return WrapCoordinate(ConvertToCoord(z));
    };

    this.GetNeighbors = function(z, includeDiagonals)
    {
        var neighbors = new Array();

        neighbors.push(WrapZ(z+1));
        neighbors.push(WrapZ(z-1));
        neighbors.push(WrapZ(z - this.columns));
        neighbors.push(WrapZ(z + this.columns));

        if (includeDiagonals)
        {
            neighbors.push(WrapZ(z+1 - this.columns));
            neighbors.push(WrapZ(z-1 - this.columns));
            neighbors.push(WrapZ(z+1 + this.columns));
            neighbors.push(WrapZ(z-1 + this.columns));   
        }

        return neighbors;
    };


    this.GetRingOfCoordinates = function(z, radius, doGetCenter)
    {
        var ring = new Array();

        //  Handle center
        if (myDoGetCenter)
        {
            ring.push(WrapZ(z));
        }
        //  Spokes
        for (var r = 1; r <= myRadius; r++)
        {
            ring.push(WrapZ(z+r));
            ring.push(WrapZ(z-r));
            ring.push(WrapZ(z+(r*this.columns));
            ring.push(WrapZ(z-(r*this.columns));
        }

        var coord = ConvertToCoord(z);

        //  Pie slices
        for (var r = myRadius; r > 0; r--)
        {
            var x = coord.s + 1;
            var y = coord.f - r + 1;

            while (x > coord.s)
            {
                if (y != myStartingY)
                {
                    ring.push(ConvertToZ({f:x, s:y}));
                }

                if (y < myStartingY)
                {
                    x++;
                }
                else
                {
                    x--;
                }

                y++;
            }
            x--;
            y--;
            while (x < coord.s)
            {
                if (y != coord.s)
                {
                    ring.push(ConvertToZ({f:x, s:y}));
                }

                if (y > myStartingY)
                {
                    x--;
                }
                else
                {
                    x++;
                }

                y--;
            }
        }
        return ring;
    };

}