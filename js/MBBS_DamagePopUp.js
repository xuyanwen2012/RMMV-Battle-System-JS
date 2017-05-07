//=============================================================================
// Mount Blade Battle System Engine Plugins - Damage Pop Up
// MBBS_DamagePopUp.js
//=============================================================================
/*:
 * @plugindesc v1.0 MBBS Plugins: 
   群战系统MV插件系列之 - 群战伤害显示
   MBBS_DamagePopUp
 * @author Chivalry Studio Plugins / Ivan


*/
var Imported = Imported || {};
Imported.MBBS_DamagePopUp = true;

var MBBS_MV = MBBS_MV || {};
MBBS_MV.DamagePopUp = MBBS_MV.MBBS_DamagePopUp || {};


//=============================================================================
// Sprite Character
//=============================================================================
MBBS_MV.DamagePopUp.Sprite_Character_initialize = Sprite_Character.prototype.initialize;
Sprite_Character.prototype.initialize = function(character) {
   MBBS_MV.DamagePopUp.Sprite_Character_initialize.call(this,character);
   this.initDamagePopUp(character);
};
Sprite_Character.prototype.initDamagePopUp = function(character) {
  this._damages = [];
};
Sprite_Character.prototype.updateDamagePopup = function() {
  this.setupDamagePopup();
  if (this._damages.length > 0) {
      for (var i = 0; i < this._damages.length; i++) {
          this._damages[i].update();
      }
      if (!this._damages[0].isPlaying()) {
          this.parent.removeChild(this._damages[0]);
          this._damages.shift();
      }
  }
};
Sprite_Character.prototype.setupDamagePopup = function() {
  if (this._character.isDamagePopupRequested()) {
      if (this._character.isSpriteVisible()) {
          var sprite = new Sprite_EFS_Damage();
          sprite.x = this.x + this.damageOffsetX();
          sprite.y = this.y + this.damageOffsetY();

          sprite.setup(this._character.getDamageValue(), this._character.getDamageCritical());

          this._damages.push(sprite);
          this.parent.addChild(sprite);
      }
      this._character.clearDamagePopup();
  }
};
Sprite_Character.prototype.damageOffsetX = function() {
    return 0;
};

Sprite_Character.prototype.damageOffsetY = function() {
    return 0;
};

MBBS_MV.DamagePopUp.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
  MBBS_MV.DamagePopUp.Sprite_Character_update.call(this);
  this.updateDamagePopup();
};

//-----------------------------------------------------------------------------
// Sprite_EFS_Damage
//
// The sprite for displaying a popup damage.

function Sprite_EFS_Damage() {
    this.initialize.apply(this, arguments);
}

Sprite_EFS_Damage.prototype = Object.create(Sprite.prototype);
Sprite_EFS_Damage.prototype.constructor = Sprite_EFS_Damage;

Sprite_EFS_Damage.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._duration = 90;
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
    this._damageBitmap = ImageManager.loadSystem('Damage');
};

Sprite_EFS_Damage.prototype.setup = function(hpDamage, critical) {
    if (false) {
        this.createMiss();
    } else if (hpDamage > 0) {
        this.createDigits(0, hpDamage);
    } 
    if (critical) {
        this.setupCriticalEffect();
    }
};

Sprite_EFS_Damage.prototype.setupCriticalEffect = function() {
    this._flashColor = [255, 0, 0, 160];
    this._flashDuration = 60;
};

Sprite_EFS_Damage.prototype.digitWidth = function() {
    return this._damageBitmap ? this._damageBitmap.width / 10 : 0;
};

Sprite_EFS_Damage.prototype.digitHeight = function() {
    return this._damageBitmap ? this._damageBitmap.height / 5 : 0;
};

Sprite_EFS_Damage.prototype.createMiss = function() {
    var w = this.digitWidth();
    var h = this.digitHeight();
    var z = 20;
    var sprite = this.createChildSprite();
    sprite.setFrame(0, 4 * h, 4 * w, h);
    sprite.dy = 0;
    sprite.z = z;
};

Sprite_EFS_Damage.prototype.createDigits = function(baseRow, value) {
    var string = Math.abs(value).toString();
    var row = baseRow + (value < 0 ? 1 : 0);
    var w = this.digitWidth();
    var h = this.digitHeight();
    var z = 20;
    for (var i = 0; i < string.length; i++) {
        var sprite = this.createChildSprite();
        var n = Number(string[i]);
        sprite.setFrame(n * w, row * h, w, h);
        sprite.x = (i - (string.length - 1) / 2) * w;
        sprite.dy = -i;
        sprite.z = z;
    }
};

Sprite_EFS_Damage.prototype.createChildSprite = function() {
    var sprite = new Sprite();
    sprite.bitmap = this._damageBitmap;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    sprite.y = -80;
    sprite.ry = sprite.y;
    this.addChild(sprite);
    return sprite;
};

Sprite_EFS_Damage.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._duration > 0) {
        this._duration--;
        for (var i = 0; i < this.children.length; i++) {
            this.updateChild(this.children[i]);
        }
    }
    this.updateFlash();
    this.updateOpacity();
};

Sprite_EFS_Damage.prototype.updateChild = function(sprite) {
    sprite.dy += 0.5;
    sprite.ry += sprite.dy;
    if (sprite.ry >= 0) {
        sprite.ry = 0;
        sprite.dy *= -0.6;
    }
    sprite.y = Math.round(sprite.ry);
    sprite.setBlendColor(this._flashColor);
};

Sprite_EFS_Damage.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        var d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
    }
};

Sprite_EFS_Damage.prototype.updateOpacity = function() {
    if (this._duration < 10) {
        this.opacity = 255 * this._duration / 10;
    }
};

Sprite_EFS_Damage.prototype.isPlaying = function() {
    return this._duration > 0;
};
//=============================================================================
// Game Character
//=============================================================================
Game_Character.prototype.isDamagePopupRequested = function() {
    return this._damagePopup;
};
Game_Character.prototype.startDamagePopup = function(value,critical) {
    this._damagePopup = true;
    this._damageValue = value;
    this._damageCritical = critical;
};
MBBS_MV.DamagePopUp.Game_Character_initMembers = Game_Character.prototype.initMembers;
Game_Character.prototype.initMembers = function() {
    MBBS_MV.DamagePopUp.Game_Character_initMembers.call(this);
    this._damageValue = 0;
    this._damageCritical = false;
    this._damagePopup = false;
};
Game_Character.prototype.clearDamagePopup = function() {
    this._damagePopup = false;
    this._damageValue = 0;
    this._damageCritical = false;
};
Game_Character.prototype.isSpriteVisible = function() {
    return true;
};

Game_Character.prototype.getDamageValue = function() {
    return this._damageValue;
};

Game_Character.prototype.getDamageCritical = function() {
    return this._damageCritical;
};

//=============================================================================
// End of File
//=============================================================================