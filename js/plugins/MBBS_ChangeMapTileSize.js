//=============================================================================
// Mount Blade Battle System Engine Plugins - Change Map Tile Size
// MBBS_ChangeMapTileSize.js
//=============================================================================
/*:
 * @plugindesc v1.0 MBBS 辅助插件：自定义图块大小
 使用前请复制一份MV原版默认的原大小的图块文件 (img/tilesets)，将新的文件夹改名比如tilesetsXXX，这里用来存储修改大小后的图块素材。
 * @author Chivalry Studio Plugins / Ivan

 * @param tileSize 
 * @desc 修改地图图块的大小，RMXP为32
 * Default: 48 
 * @default 48
  
 * @param tilesetsFolder
 * @desc 修改过的图块素材文件夹路径，不能为默认的
 * Default: img/tilesets/
 * @default img/tilesets/

 * @param parallaxesFolder
 * @desc 修改过的图块素材文件夹路径，不能为默认的
 * Default: img/parallaxes/
 * @default img/parallaxes/
  
*/
var Imported = Imported || {};
Imported.MBBS_ChangeMapTileSize = true;

var MBBS_MV = MBBS_MV || {};
MBBS_MV.ChangeMapTileSize = MBBS_MV.ChangeMapTileSize || {};

//=============================================================================
// Parameter Variables
//=============================================================================
MBBS_MV.Parameters = PluginManager.parameters('MBBS_ChangeMapTileSize');
MBBS_MV.Param = MBBS_MV.Param || {};

MBBS_MV.Param.tileSize = Number(MBBS_MV.Parameters['tileSize']);
MBBS_MV.Param.tilesetsFolder = String(MBBS_MV.Parameters['tilesetsFolder']);
MBBS_MV.Param.parallaxesFolder  = String(MBBS_MV.Parameters['parallaxesFolder']);
//=============================================================================
// ImageManager
//=============================================================================
ImageManager.loadTileset = function(filename, hue) {
    return this.loadBitmap(MBBS_MV.Param.tilesetsFolder, filename, hue, false);
};
ImageManager.loadParallax = function(filename, hue) {
    return this.loadBitmap(MBBS_MV.Param.parallaxesFolder, filename, hue, true);
};
//=============================================================================
// Game_Map
//=============================================================================
Game_Map.prototype.tileWidth = function() {
    return MBBS_MV.Param.tileSize;
};
Game_Map.prototype.tileHeight = function() {
    return MBBS_MV.Param.tileSize;
};
//=============================================================================
// Game_Vehicle
//=============================================================================
Game_Vehicle.prototype.maxAltitude = function() {
    return MBBS_MV.Param.tileSize;
};
