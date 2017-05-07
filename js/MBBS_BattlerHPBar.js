//=============================================================================
// Mount Blade Battle System Engine Plugins - Battler HP Bar
// MBBS_BattlerHPBar.js
//=============================================================================
/*:
 * @plugindesc v1.0 MBBS Plugins: 
    群战系统MV插件系列之 - 群战士兵显示血条 【XP移植】
    MBBS_BattlerHPBar
 * @author Chivalry Studio Plugins / Ivan
  
  
*/
var Imported = Imported || {};
Imported.MBBS_BattlerHPBar = true;

var MBBS_MV = MBBS_MV || {};
MBBS_MV.BattlerHPBar = MBBS_MV.BattlerHPBar || {};
//=============================================================================
// Temp Test
//=============================================================================
 MBBS_MV.BattlerHPBar.HPBarFileName = 'HPBar';
 MBBS_MV.BattlerHPBar.HPBarEnermyFileName = 'HPBar-E';
 MBBS_MV.BattlerHPBar.HPBarBackFileName = 'HPBarBack';
 MBBS_MV.BattlerHPBar.MPBarFileName = 'MPBar';
 MBBS_MV.BattlerHPBar.MPBarBackFileName = 'MPBarBack';
 MBBS_MV.BattlerHPBar.HPbarTimeDisplay = 120;

 MBBS_MV.BattlerHPBar.Sprite_Character_initialize = Sprite_Character.prototype.initialize;
 Sprite_Character.prototype.initialize = function(character) {
    MBBS_MV.BattlerHPBar.Sprite_Character_initialize.call(this,character);
    this.initHPMPBar(character);
};
Sprite_Character.prototype.initHPMPBar = function(character) {
    if (character instanceof Game_EFS_Battler) {
       this._battler = character;
    }else{
       return;
    }
    this._hpSprite = new Sprite();
    this._hpBackSprite = new Sprite();
    this._mpSprite = new Sprite();
    this._mpBackSprite = new Sprite();
    this._paramSprites = [];
    this._paramSprites.push(this._hpSprite);
    this._paramSprites.push(this._hpBackSprite);
    this._paramSprites.push(this._mpSprite);
    this._paramSprites.push(this._mpBackSprite);

    var barName = this._battler._team == 0 ? 
      MBBS_MV.BattlerHPBar.HPBarFileName : MBBS_MV.BattlerHPBar.HPBarEnermyFileName;
    this._hpSprite.bitmap     = ImageManager.loadSystem(barName);

    this._hpBackSprite.bitmap = ImageManager.loadSystem(MBBS_MV.BattlerHPBar.HPBarBackFileName);
    this._mpSprite.bitmap     = ImageManager.loadSystem(MBBS_MV.BattlerHPBar.MPBarFileName);
    this._mpBackSprite.bitmap = ImageManager.loadSystem(MBBS_MV.BattlerHPBar.MPBarBackFileName);
    var parent = this;
    this._paramSprites.reverse().forEach(function(sprite) {
      sprite.anchor.y = 0.5;
      parent.addChild(sprite);
    });
    this._originBarWidth = 26;
    this._shifterY = character.core()._isCalvary ? 76 : 48;

    this._hpCounter = MBBS_MV.BattlerHPBar.HPbarTimeDisplay;
};

Sprite_Character.prototype.battlerHP = function() {
   return this._battler == null ? 0 : this._battler.core().hp;
};
Sprite_Character.prototype.battlerMaxHP = function() {
   return this._battler == null ? 0 : this._battler.core().hpMax;
};
Sprite_Character.prototype.battlerMP = function() {
   return this._battler == null ? 0 : this._battler._ammo;
};
Sprite_Character.prototype.battlerMaxMP = function() {
   return this._battler == null ? 0 : this._battler.core().ammoMax;
};
Sprite_Character.prototype.showHPBar = function() {
  if (this.battlerHP() > 0) {
    return this._hpCounter > 0;
  }else{
    return false;
  }
};
Sprite_Character.prototype.showMPBar = function() {
  if (this.battlerMP() > 0) {
    return this._hpCounter > 0;
  }else{
    return false;
  }
};
//----------------------------------------
MBBS_MV.BattlerHPBar.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
  MBBS_MV.BattlerHPBar.Sprite_Character_update.call(this);
  this.updateHPMPBar();
};
//------------------------------------------
Sprite_Character.prototype.needChangeBarColor = function() {
  if (this._barHasChanged) {
    return;
  };
    var barName = this._battler._team == 0 ? 
    MBBS_MV.BattlerHPBar.HPBarFileName : MBBS_MV.BattlerHPBar.HPBarEnermyFileName;
    this._hpSprite.bitmap     = ImageManager.loadSystem(barName);
    this._barHasChanged = true;
};
Sprite_Character.prototype.updateHPMPBar = function() {
  if (this._battler==null) {
    return;
  };
    if (this._battler.needDisplayBar()) {
      this._hpCounter = MBBS_MV.BattlerHPBar.HPbarTimeDisplay;
      this._battler.setDisplayBar(false);
    };
  if (this.showHPBar()) {
    if (!EFSBattleManager.isShowingHPMPBar()) { // not pressed alt
      if (this._hpCounter == MBBS_MV.BattlerHPBar.HPbarTimeDisplay) {
        this._paramSprites.forEach(function(sprite) {
          sprite.opacity = 255;
        });
      }else if (this._hpCounter <= MBBS_MV.BattlerHPBar.HPbarTimeDisplay/3) {
        this._paramSprites.forEach(function(sprite) {
          sprite.opacity -= 255/(MBBS_MV.BattlerHPBar.HPbarTimeDisplay/3);
        });
      }
      this._hpCounter -= 1;

    }else{ // pressed alt
      this._hpCounter = MBBS_MV.BattlerHPBar.HPbarTimeDisplay;
      this._paramSprites.forEach(function(sprite) {
        sprite.opacity = 255;
        sprite.visible = true;
      });
    }
    this.needChangeBarColor();
    var self = this;
    this._paramSprites.forEach(function(sprite) {
      sprite.visible = true;
      sprite.move(-self._originBarWidth/2 - 4,-(sprite.height + self._shifterY));
      sprite.z = self.z + 15; 
    });
    var hpw = Math.floor(this._hpSprite.bitmap.width * 1.0 * this.battlerHP() / this.battlerMaxHP());
    hpw = Math.max(Math.min(hpw, this._hpSprite.bitmap.width), 0);
    var hph = this._hpSprite.bitmap.height;
    this._hpSprite.setFrame(0,0,hpw,hph);

    //this._hpSprite.y + 50

    // MP 可见的情况
    if (this.showMPBar() && this.battlerMaxMP() > 0) {
      this._hpSprite.y -= (1+this._mpSprite.bitmap.height);
      this._hpBackSprite.y = this._hpSprite.y;
      var hpw = Math.floor(this._mpSprite.bitmap.width * 1.0 * this.battlerMP() / this.battlerMaxMP());
      hpw = Math.max(Math.min(hpw, this._mpSprite.bitmap.width), 0);
      var hph = this._mpSprite.bitmap.height;
      this._mpSprite.setFrame(0,0,hpw,hph);
    }
  }else{
    this._paramSprites.forEach(function(sprite) {
      sprite.visible = false;
    });
  }
};



//=============================================================================
// End of File
//=============================================================================