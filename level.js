


//var jsonURL = levels/gree-map.json;
//var jsonString = JSON.stringify("levels/gree-map.json");
//var jsonObj = JSON.parse(jsonString);

var CurrentLevel = level1_green;

var LAYER_COUNT = CurrentLevel.layers.length;

var LAYER_BACKGROUND = 0;  
var LAYER_GROUND =     1;   
var LAYER_DOORS =      2;
var LAYER_KEYS =       3;
var LAYER_PORTAL =     4;




var TILESET_PADDING = CurrentLevel.tilesets[0].margin;

var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;

var TILE = CurrentLevel.tilewidth;
var TILESET_TILE = CurrentLevel.tilesets[0].tilewidth;
var TILESET_SPACING = CurrentLevel.tilesets[0].spacing;

var tileset = document.createElement("img");
tileset.src = CurrentLevel.tilesets[0].image;





var cells = [];                 //array that holds our simplified collision data
function initialize(_level){





    for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++){      //initialise the collision map
        cells[layerIdx] = [];
        var idx = 0;

        for(var y = 0; y < _level.layers[layerIdx].height; y++){
            cells[layerIdx][y] = [];

            for(var x = 0; x < _level.layers[layerIdx].width; x++){
                if(_level.layers[layerIdx].data[idx] !=  0){

                        //for each tile we find in the layer data, we nbeed to creat 4 collisions
                        //because our collision quares are 35x35 but the tile in the level are 70x70
                    if ( y == 0 ){
                        cells[layerIdx][y][x+1] = 1;
                        cells[layerIdx][y][x] = 1;
                    }

                    else{
                        cells[layerIdx][y][x] = 1;
                        cells[layerIdx][y-1][x] = 1;
                        cells[layerIdx][y-1][x+1] = 1;
                        cells[layerIdx][y][x+1] = 1;
                    }

                }

                else if (cells[layerIdx][y][x] != 1){
                    cells[layerIdx][y][x] = 0;               //this cell doesnt have a value so we set it now
                }

                idx++;
            }
        }
    }
};




function cellAtPixelCoord(layer, x, y){
    if ( x < 0 || x > SCREEN_WIDTH || y < 0){
        return 1;

    }  
    if (y > SCREEN_HEIGHT){
        return 0;
        player.dead = true;
    }



    return cellAtTileCoord(layer, pixel2Tile(x), pixel2Tile(y));
    

};

function cellAtTileCoord(layer, tx, ty){
    if (tx < 0 || tx >= MAP.tw || ty < 0){
        return 1;
    }

    if(ty >= MAP.th){
        return 0;
    }

    return cells[layer][ty][tx];




};

var MAP = {

    tw: CurrentLevel.layers[0].width,
    th: CurrentLevel.layers[0].height

};

function tile2Pixel(tile){

    return tile * TILE;
};

function pixel2Tile(pixel){
    return Math.floor(pixel / TILE);

};

function bound (value, min, max){

    if (value < min ){
        return min;
    }

    if (value > max){
        return max;
    }

    return value;
}



function drawMap(_cam_x, _cam_y){
    for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++){
        var idx = 0

        for (var y = 0; y < CurrentLevel.layers[layerIdx].height; y++){

            for ( var x = 0; x < CurrentLevel.layers[layerIdx].width; x++){

                if( CurrentLevel.layers[layerIdx].data[idx] != 0){


                    //the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile), so subtract one form the tilset id to get the
                    //correct tile
                    var tileIndex = CurrentLevel.layers[layerIdx].data[idx]-1;
                    var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
                    var sy = TILESET_PADDING + (Math.floor(tileIndex/TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
                    
                    context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE - Math.floor(_cam_x), (y-1)*TILE - Math.floor(_cam_y), TILESET_TILE, TILESET_TILE);
                }
                idx++;
            }
        }
    }
};
