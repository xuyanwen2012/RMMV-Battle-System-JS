//=============================================================================
// Mount Blade Battle System Engine Plugins - Elastically Scroll
// MBBS_ElasticallyScroll.js
//=============================================================================
/*:
 * @plugindesc v1.0 MBBS Plugins: 
    群战系统MV插件系列之 - 弹性镜头移动 【XP移植】
    MBBS_ElasticallyScroll
 * @author Chivalry Studio Plugins / Ivan
*/
var Imported = Imported || {};
Imported.MBBS_ElasticallyScroll = true;

var MBBS_MV = MBBS_MV || {};
MBBS_MV.ElasticallyScroll = MBBS_MV.MBBS_ElasticallyScroll || {};

//=============================================================================
// Game_Player
//=============================================================================
Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
    var x1 = lastScrolledX;
    var y1 = lastScrolledY;
    var x2 = this.scrolledX();
    var y2 = this.scrolledY();

    var halfTileWidth   = $gameMap.tileWidth()/3.0;
    var halfTileHeight   = $gameMap.tileHeight()/3.0;

    var yGrid = this.centerY()*2;
    var xGrid = this.centerX()*2;

    if (y2 > this.centerY()){
      $gameMap.scrollDown(this._realY > $gameMap.height() - this.centerY() ? 
        ($gameMap.height() - yGrid - $gameMap.displayY())/halfTileHeight :
        ((y2 - yGrid + this.centerY())/halfTileHeight))
    }
    if (x2 < this.centerX() ){
      $gameMap.scrollLeft(this._realX < this.centerX() ? $gameMap.displayX()/halfTileWidth :
        (($gameMap.displayX() + this.centerX() - this._realX)/halfTileWidth))
    }
    if (x2 > xGrid - this.centerX() ){
      $gameMap.scrollRight(this._realX > $gameMap.width - this.centerX()  ?
        (($gameMap.width - xGrid) - $gameMap.displayX())/halfTileWidth :
        (x2 - xGrid + this.centerX() )/halfTileWidth)
    }
    if (y2 < this.centerY()){
        $gameMap.scrollUp(this._realY < this.centerY() ?  $gameMap.displayY()/halfTileHeight : 
      (($gameMap.displayY()+this.centerY()-this._realY)/halfTileHeight))
    }

};


if (Imported.MBBS_MV) {
    Game_EFS_Hero.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
      var x1 = lastScrolledX;
      var y1 = lastScrolledY;
      var x2 = this.scrolledX();
      var y2 = this.scrolledY();

      var halfTileWidth   = $gameMap.tileWidth()/2.0;
      var halfTileHeight   = $gameMap.tileHeight()/2.0;

      var yGrid = this.centerY()*2;
      var xGrid = this.centerX()*2;

      if (y2 > this.centerY()){
        $gameMap.scrollDown(this._realY > $gameMap.height() - this.centerY() ? 
          ($gameMap.height() - yGrid - $gameMap.displayY())/halfTileHeight :
          ((y2 - yGrid + this.centerY())/halfTileHeight))
      }
      if (x2 < this.centerX() ){
        $gameMap.scrollLeft(this._realX < this.centerX() ? $gameMap.displayX()/halfTileWidth :
          (($gameMap.displayX() + this.centerX() - this._realX)/halfTileWidth))
      }
      if (x2 > xGrid - this.centerX() ){
        $gameMap.scrollRight(this._realX > $gameMap.width - this.centerX()  ?
          (($gameMap.width - xGrid) - $gameMap.displayX())/halfTileWidth :
          (x2 - xGrid + this.centerX() )/halfTileWidth)
      }
      if (y2 < this.centerY()){
          $gameMap.scrollUp(this._realY < this.centerY() ?  $gameMap.displayY()/halfTileHeight : 
        (($gameMap.displayY()+this.centerY()-this._realY)/halfTileHeight))
      }

  };
}


//=============================================================================
// End of File
//=============================================================================