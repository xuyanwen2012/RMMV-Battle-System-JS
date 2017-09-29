//=============================================================================
// Mount Blade Battle System Engine Plugins - Core Engine
// MBBS_MV.js
//=============================================================================
/*:
 * @plugindesc v1.0 Basic EFS Core Engine
 * @author Chivalry Studio Plugins / Ivan
 * @param ---Game---
 * @default 
 * @param Maxium Armies 
 * @desc Maxium Armies(not soldiers) allowed in each EFS battle. 
 * Default: 4 
 * @default 4 
 * @param Maxium Command Unites 
 * @desc Maxium Command Unites per Army, groups. 
 * Default: 5 
 * @default 5 
 * @param Spawn Area RegionIDs 
 * @desc The Region Id start with n..n + Maxium Armies 
 * Default: 5 (5...9)
 * @default 5 
 * @param Maxium Units allowed in EFS battle. 
 * @desc Total number of soldiers deployed on the map per battle
 * Default: 50
 * @default 50 
 * @param Maxium Battler in Infantry Command Units
 * @desc don't set this more than 20 unless you modified the Game_CommandUnits Formations.
 * Default: 20
 * @default 20
 * @param Maxium Battler in Calvary Command Units
 * @desc don't set this more than 15 unless you modified the Game_CommandUnits Formations.
 * Default: 15
 * @default 15
 * @param Maxium Battler in Missle Command Units
 * @desc don't set this more than 18 unless you modified the Game_CommandUnits Formations.
 * Default: 18
 * @default 18

*/
var Imported = Imported || {};
Imported.MBBS_MV = true;
var MBBS_MV = MBBS_MV || {};
MBBS_MV.Core = MBBS_MV.Core || {};
//=============================================================================
// Parameter Variables
//=============================================================================
MBBS_MV.Parameters = PluginManager.parameters('MBBS_MV');
MBBS_MV.Param = MBBS_MV.Param || {};
MBBS_MV.Param.maxiumArmies = Number(MBBS_MV.Parameters['Maxium Armies:']);
MBBS_MV.Param.maxiumCommandUnites = Number(MBBS_MV.Parameters['Maxium Command Unites']);
MBBS_MV.Param.spawnAreaRegionID = Number(MBBS_MV.Parameters['Spawn Area RegionIDs']);
MBBS_MV.Param.maxiumUnitsPerBattle = Number(MBBS_MV.Parameters['Maxium Units allowed']);
//MBBS_MV.Param.patternStyle = String(MBBS_MV.Parameters['Character Pattern Style']);
MBBS_MV.Param.maxiumInfantry = Number(MBBS_MV.Parameters['Maxium Battler in Infantry Command Units']);
MBBS_MV.Param.maxiumCalvary = Number(MBBS_MV.Parameters['Maxium Battler in Calvary Command Units']);
MBBS_MV.Param.maxiumMissle = Number(MBBS_MV.Parameters['Maxium Battler in Missle Command Units']);
MBBS_MV.Param.maxiumBattlerOfType = [
MBBS_MV.Param.maxiumInfantry,
MBBS_MV.Param.maxiumCalvary,
MBBS_MV.Param.maxiumMissle,
];
//=============================================================================
// Plugin commands -- Game_Interpreter
//=============================================================================
MBBS_MV.Core.Game_Interpreter_pluginCommand =
Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    MBBS_MV.Core.Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'StartEFSBttale') {
        $gamePlayer.startEFSBattle(false);
    }
    if (command === 'StartInstantEFSBttale') {
        $gamePlayer.startEFSBattle(true); 
    }
};
//=============================================================================
// EFSBattleManager Constant
//=============================================================================
EFSBattleManager.T_K_E_COLOR = '#00FFFF';
EFSBattleManager.E_K_T_COLOR = '#FF5050';
EFSBattleManager.T_B_E_COLOR = '#87FF00';
EFSBattleManager.E_B_T_COLOR = '#FF8700';
EFSBattleManager.H_K_E_COLOR = '#FFFF00';
EFSBattleManager.H_B_E_COLOR = '#FFFF00';
EFSBattleManager.NORMAL_COLOR = '#FFFFFF';
EFSBattleManager.DEFAULT_BODY_DISAPPEAR_TIME = 1200;
EFSBattleManager.FRAME_PER_SECOND = 60;
EFSBattleManager.MISSILES_DISAPPEAR_TIME = 720;
EFSBattleManager.BLOOD_DISAPPEAR_TIME = 1200;
EFSBattleManager.ENABLE_ANIMATIONS = true;
EFSBattleManager.PLAYER_ATK_ANIMATION = 5;

EFSBattleManager.SE_MELEE_HIT = 0;
EFSBattleManager.SE_BLOCK = 1;
EFSBattleManager.SE_RANGE_HIT = 2;
EFSBattleManager.SE_RANGE_LAUNCH = 3;
EFSBattleManager.SE_RANGE_PASSBY = 4;
EFSBattleManager.SE_RANGE_DROP = 5;

EFSBattleManager.PLAYER_ATK_TARGET_ANIMATIONS = [15,16,17];
//=============================================================================
// DataManager
//=============================================================================
var $dataSoldier        = null;
var $dataArmy           = null;
DataManager._databaseFiles.push({ name: '$dataSoldier',             src: 'EFS_Soldier.json'          },
                                { name: '$dataSounds',              src: 'EFS_Sound.json'            },
                                { name: '$dataArmy',                src: 'EFS_DefaultArmies.json'    }
                                );
MBBS_MV.Core.DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    MBBS_MV.Core.DataManager_createGameObjects.call(this);
    $gameEFSPlayer = null;
};

//=============================================================================
// Game_Map
//=============================================================================
  ImageManager.loadTileset = function(filename, hue) {
    return this.loadBitmap('img/tilesets32/', filename, hue, false);
  };
//=============================================================================
// Input
//=============================================================================
Input.EFS_Keys = {
    'A':    65,
};
//=============================================================================
// RPG_EFS_Battler
// the data class, not the Actuall fighting object
//=============================================================================
function RPG_EFS_Battler() {
    this.initialize.apply(this, arguments);
}
RPG_EFS_Battler.prototype.initialize = function(soldierId, cuId) {
    this.initMembers(soldierId, cuId);
    //temp test
    
    //calculate states
    
};
Object.defineProperties(RPG_EFS_Battler.prototype, {
    initalX:        { get: function() { return this._initalX;       }, configurable: true},
    initalY:        { get: function() { return this._initalY;       }, configurable: true},
    initalD:        { get: function() { return this._initalD;       }, configurable: true},

    soldierId:      { get: function() { return this._soldierId;     }, configurable: true},
    cuId:           { get: function() { return this._cuId;          }, configurable: true},
    name:           { get: function() { return this._name;          }, configurable: true},
    characterName:  { get: function() { return this._characterName; }, configurable: true },
    engageRange:    { get: function() { return this._engageRange;   }, configurable: true },
    moveSpeed:      { get: function() { return this._moveSpeed;     }, configurable: true },

    hp:             { get: function() { return this._hp;            }, configurable: true },
    hpMax:          { get: function() { return this._hpMax;         }, configurable: true },
    mp:             { get: function() { return this._mp;            }, configurable: true },
    mpMax:          { get: function() { return this._mpMax;         }, configurable: true },

    baseAtk:        { get: function() { 
        return this._baseAtk[this._weaponLevel];
    }, configurable: true },

    sBaseAtk:        { get: function() { 
        return this._sBaseAtk[this._weaponLevel];
    }, configurable: true },

    piercingAtk:        { get: function() { 
        return this._piercingAtk[this._weaponLevel];
    }, configurable: true },

    sPiercingAtk:        { get: function() { 
        return this._sPiercingAtk[this._weaponLevel];
    }, configurable: true },

    armor:        { get: function() { 
        return this._armor[this._armorLevel];
    }, configurable: true },

    shield:        { get: function() { 
        return this._shield[this._shieldLevel];
    }, configurable: true },
    
    ammoMax:        { get: function() { 
        return this._ammoMax[this._weaponLevel];
    }, configurable: true },

});
RPG_EFS_Battler.prototype.initMembers = function(soldierId, cuId) {
    //id data
    this._soldierId               = soldierId; 
    this._cuId                    = cuId;

    //modole data
    this._name                    = $dataSoldier[soldierId].name; 
    this._characterName           = $dataSoldier[soldierId].characterName;
    this._baseCharacterName       = this._characterName;   
    //[击中SE,格挡SE,远程击中SE,远程发射SE,弹药经过SE,弹药落地SE]
    this._seList                  = $dataSoldier[soldierId].seList;

    //attributes data
    this._hpMax                   = $dataSoldier[soldierId].hpMax;
    this._hp                      = this._hpMax;
    this._mpMax                   = $dataSoldier[soldierId].mpMax;
    this._mp                      = this._mpMax;

    this._attackSkill             = $dataSoldier[soldierId].attackSkill;
    this._defenceSkill            = $dataSoldier[soldierId].defenceSkill;
    this._antiCalvaryAttackBouns  = $dataSoldier[soldierId].antiCalvaryAttackBouns;
    this._antiCalvaryDefenceBouns = $dataSoldier[soldierId].antiCalvaryDefenceBouns;
    
    this._chargeBouns             = $dataSoldier[soldierId].chargeBouns;
    this._criticalHit             = $dataSoldier[soldierId].criticalHit;
    this._morale                  = $dataSoldier[soldierId].morale;

    this._atkFrequency            = $dataSoldier[soldierId].atkFrequency;
    this._atkRange                = $dataSoldier[soldierId].atkRange;
    this._engageRange             = $dataSoldier[soldierId].engageRange;
    this._moveSpeed               = $dataSoldier[soldierId].moveSpeed;
    this._accuracy                = $dataSoldier[soldierId].accuracy;

    this._liveChance              = $dataSoldier[soldierId].liveChance;
    this._isKilled                = false
    //traits
    this._isHeavy                 = $dataSoldier[soldierId].isHeavy;
    this._isCalvary               = $dataSoldier[soldierId].isCalvary;
    this._isArcher                = $dataSoldier[soldierId].isArcher;
    this._isPlayer                = $dataSoldier[soldierId].isPlayer;
    //equipments, states
    this._weaponLevel             = 0; 
    this._armorLevel              = 0;
    this._shieldLevel             = 0;
    this._baseAtk                 = $dataSoldier[soldierId].baseAtk;     // [] array
    this._piercingAtk             = $dataSoldier[soldierId].piercingAtk; // [] array
    this._sBaseAtk                = $dataSoldier[soldierId].sBaseAtk;    // [] array
    this._sPiercingAtk            = $dataSoldier[soldierId].sPiercingAtk;// [] array
    this._armor                   = $dataSoldier[soldierId].armor;       // [] array
    this._shield                  = $dataSoldier[soldierId].shield;      // [] array
    this._ammoMax                 = $dataSoldier[soldierId].ammoMax;     // [] array
    this._weaponLevelMax          = this._baseAtk.length; 
    this._armorLevelMax           = this._armor.length;
    this._shieldLevelMax          = this._shield.length;
    // inital
    this._initalX                 = 0; 
    this._initalY                 = 0; 
    this._initalD                 = 0; 
    //sprites setting
    this._needDisplayBar = true;
    this._displayDamage = 0;
};
//----------------------------------------------------------------------------
//---------------------------Accessors Related---------------------------------
RPG_EFS_Battler.prototype.isPlayer = function() {
    return this._isPlayer;
};
RPG_EFS_Battler.prototype.getDefenceSkillPoints = function() {
    return this._defenceSkill;
};
RPG_EFS_Battler.prototype.isHeavy = function() {
    return this._isHeavy;
};
RPG_EFS_Battler.prototype.getSEList = function() {
    return this._seList;
};
RPG_EFS_Battler.prototype.setInitialPosition = function(x,y,d) {
    this._initalX = x;
    this._initalY = y;
    this._initalD = d;
};
RPG_EFS_Battler.prototype.isDead = function() {
    return this._hp <= 0;
};
RPG_EFS_Battler.prototype.isKilled = function() {
    return this._isKilled;
};
RPG_EFS_Battler.prototype.isWounded = function() {
    return this.isDead() && !this.isKilled();
};
RPG_EFS_Battler.prototype.generateKilled = function() {
    if (Math.randomInt(100)+1 <= this._liveChance) {
        this._isKilled = false;
    }else{
        this._isKilled = true;
    }
};
//----------------------------------------------------------------------------
//---------------------------Damage Related----------------------------------
RPG_EFS_Battler.prototype.receiveDamage = function(damage,shieldReduce) {
    var flowing  = Math.randomInt(15)-5;
    var shieldHP = Math.floor(this.shield*shieldReduce);
    damage -= shieldHP;
    damage -= this.armor;
    damage += flowing;
    //console.log();
    if (damage <= 0) {
        damage = Math.randomInt(5);
    }
    this._hp -= damage;
    this._displayDamage += damage;

    if (this._hp<= 0) {
        this.generateKilled();
    }
};
RPG_EFS_Battler.prototype.receiveDamagePiercing = function(damage) {
    this._hp -= damage;
    this._displayDamage += damage;
    if (this._hp<= 0) {
        this.generateKilled();
    }    
};
RPG_EFS_Battler.prototype.getDisplayDamage = function() {
    return this._displayDamage;
};
RPG_EFS_Battler.prototype.clearDisplayDamage = function() {
    this._displayDamage = 0;
};
//=============================================================================
// Game_EFS_Battler
// the fighting class
//=============================================================================
function Game_EFS_Battler() {
    this.initialize.apply(this, arguments);
}
Game_EFS_Battler.prototype = Object.create(Game_Character.prototype);
Game_EFS_Battler.prototype.constructor = Game_EFS_Battler;
Object.defineProperties(Game_EFS_Battler.prototype, {
    goalX:        { get: function() { return this._goalX + this._captain.x;   }, configurable: true},
    goalY:        { get: function() { return this._goalY + this._captain.y;   }, configurable: true},
});
//battler is RPG_EFS_Battler object
Game_EFS_Battler.prototype.initialize = function(rpg_battler,x,y) {
    Game_Character.prototype.initialize.call(this);
    this._core = rpg_battler;
    this._moveSpeed = rpg_battler.moveSpeed;
    this._characterName = rpg_battler.characterName;
    this._ammoMax = rpg_battler.ammoMax;
    this._ammo = this._ammoMax;
    this._bloodDroped = false; 
    this.locate(x,y);
    this._seList = rpg_battler.getSEList();
};
Game_EFS_Battler.prototype.initMembers = function() {   
    Game_Character.prototype.initMembers.call(this);
    //important
    this._soldierID = 0;
    this._team = 0;

    this._captain = null;
    this._goalX = 0;
    this._goalY = 0;
    this._closetTarget = null;
    this._archerTargets = [];
    this._group = 0;
    //this._x
    this._availableTargets = [];
    //1 坚守， 2 跟随， 3 冲锋
    this._moveType = 3;
    //1 攻击， 2 防御
    this._actionMode = 0;

    this._target = null;
    this._isCorpse = false;
    this._deathProcessOver = false;
    this._deathRemoveCounter = 0; //EFSBattleManager.DEFAULT_BODY_DISAPPEAR_TIME
    this._deletable = false;

    this._shootCounter = 0;
    this._missleLaunched = false;

    this._commandUnit = null;

};
//----------------------------------------------------------------------------
//---------------------------Accessors Related---------------------------------
Game_EFS_Battler.prototype.core = function() {
    return this._core;
};
Game_EFS_Battler.prototype.refresh = function() {
    this._characterName = this._core.characterName;
};
Game_EFS_Battler.prototype.setCaptain = function(c) {
    this._captain = c;
};
Game_EFS_Battler.prototype.hasCaptain = function() {
    return this._captain != null;
};
Game_EFS_Battler.prototype.isDeletable = function() {
    return this._deletable;
};
Game_EFS_Battler.prototype.setEssential = function(teamID) {
    this._soldierID = this.core().soldierId;
    this._team = teamID;
    this._group = this._core.cuId;

    this._isCalvary               = this._core._isCalvary;
    this._isArcher                = this._core._isArcher;
};
Game_EFS_Battler.prototype.setCommandUnit = function(game_cu) {
    this._commandUnit = game_cu;
};
Game_EFS_Battler.prototype.getCommandUnit = function() {
    return this._commandUnit;
};
Game_EFS_Battler.prototype.setAvailableTargets = function(targets) {
    this._availableTargets = targets;
};
Game_EFS_Battler.prototype.attachAvailableTargets = function(arg) {
    this._availableTargets = this._availableTargets.concat(arg);

};
Game_EFS_Battler.prototype.realMoveSpeed = function() {
    if (this._hittingBackward) {
        return this._moveSpeed + 1;
    }
    return Game_CharacterBase.prototype.realMoveSpeed.call(this);
};
Game_EFS_Battler.prototype.requestAnimation = function(animationId) {
    if (EFSBattleManager.ENABLE_ANIMATIONS)
        this._animationId = animationId;
};
Game_EFS_Battler.prototype.setMoveType = function(type) {
    this._moveType = type;
};
Game_EFS_Battler.prototype.isAttacking = function() {
    return this._actionMode === 1;
};
Game_EFS_Battler.prototype.isDefending = function() {
    return this._actionMode === 2;
};
Game_EFS_Battler.prototype.isDead = function() {
    return this._core.isDead();
};
Game_EFS_Battler.prototype.canShoot = function() {
    return this._ammo > 0;
};
Game_EFS_Battler.prototype.isWaitting = function() {
    return !(this.isMoving()||this.isAttacking()||this.isDefending()||this.isDead());
};
Game_EFS_Battler.prototype.cancelAction = function() {
    this._actionMode = 0;
    if (this.isDead()) {
        return;
    }
    this._characterIndex = 0;
};
Game_EFS_Battler.prototype.resetAnimation = function(pattern) {
    this._animationCount = 0;
    this._pattern = pattern;
};
Game_EFS_Battler.prototype.assignGoalXY = function(x,y) {
    this._goalX = x;
    this._goalY = y;
};

Game_EFS_Battler.prototype.availableTargets = function() {
    return this._availableTargets;
};
Game_EFS_Battler.prototype.animationWait = function() {
    return (9 - this.realMoveSpeed()) * 3;
};
Game_EFS_Battler.prototype.pattern = function() {
    if (this._isCorpse) {
        return this._pattern;
    }
    return this._pattern < 3 ? this._pattern : 1;
};
Game_EFS_Battler.prototype.bloodDroped = function() {
    return this._bloodDroped;
};
//----------------------------------------------------------------------------
//---------------------------Updates Related----------------------------------
Game_EFS_Battler.prototype.updateAsCaptain = function() {
    this.update();
};
Game_EFS_Battler.prototype.update = function() {
    if (this.isJumping()) {
        this.updateJump();
    } else if (this.isMoving()) {
        this.updateMove();
    } else{
        if (this.isAttacking()) {
            this.updateAttack();
        }else if(this.isDefending()){
            this.updateDefend();
        }else if(this._isCorpse){
            this.updateDie();
        }else{
            this.updateStop();
        }  
    }
    this.updateAnimation();
    //--------------------------
    if (this.isDead()) return;
    //--------------------------
    if (this._isArcher) {
        this.updateAsArcher();
    }else{
        //this.updateAsInfantry();
    }
};
Game_EFS_Battler.prototype.updateAsArcher = function() {
    this._shootCounter --;
};
Game_EFS_Battler.prototype.updateAnimation = function() {
    this.updateAnimationCount();
    if (this._animationCount >= this.animationWait()) {

        if (this._isCorpse) {
            this.updateDeathPattern();
        }else if(this.isAttacking()||this.isDefending()){
            this.updateActionPattern();
        }else{
            this.updatePattern();
        }
        this._animationCount = 0;
    }
};
Game_EFS_Battler.prototype.updateActionPattern = function() {
        if (this._pattern >= this.maxPattern() - 2) {
            if (this.isAttacking()) {
                this.onAttackOver();
                this.cancelAction();
                this.resetAnimation(0);
            }else if (this.isDefending()){
                this.cancelAction();
                this.resetAnimation(0);
            }else{
                this._pattern = 0;
            }
            this._pattern = 0;
            
        }else{
            this._pattern++;
        }
};
Game_EFS_Battler.prototype.updateDeathPattern = function() {
    if(this._deathProcessOver){
        this._pattern = this.maxPattern() - 2;
    }else{
        this._pattern = (this._pattern + 1);
        if (this._pattern === this.maxPattern() - 2){
            this._deathProcessOver = true;
        }
    }
};
Game_EFS_Battler.prototype.updateStop = function() {
    Game_Character.prototype.updateStop.call(this);
    if (!this.isMoveRouteForcing()) {
        this.updateSelfMovement();
    }
};
Game_EFS_Battler.prototype.updateAttack = function() {
    this._animationCount += 1;
};
Game_EFS_Battler.prototype.updateDefend = function() {
    this._animationCount += 1;
};
Game_EFS_Battler.prototype.updateDie = function() {
    if (this._deathRemoveCounter > EFSBattleManager.DEFAULT_BODY_DISAPPEAR_TIME) {
        this._deletable = true;
        return;
    }else if (this._deathRemoveCounter > 
        EFSBattleManager.DEFAULT_BODY_DISAPPEAR_TIME - EFSBattleManager.FRAME_PER_SECOND) {
        this._opacity -= 175/EFSBattleManager.FRAME_PER_SECOND;
    }
    this._animationCount += 1;
    this._deathRemoveCounter++; 
};
Game_EFS_Battler.prototype.updateArcherSelfMovement = function() {
    this.archerSeekTarget();
    this.archerCheckEncounter();
};
Game_EFS_Battler.prototype.updateSelfMovement = function() {
    if (!this._locked  && !this.isMoving()  &&//&& this.isNearTheScreen()
            this.checkStop(this.stopCountThreshold())) {
        //每移动一次时
        this._hittingBackward = false;
        if (this._isArcher && this.canShoot()) {
            this.updateArcherSelfMovement();
            if (this.isAttacking()||this.isDefending()||this._shootCounter>0) return;
        }else{
            this.searchTargets();
        }

        switch (this._moveType) {
        case 1:
            //this.moveTypeRandom();
            break;
        case 2: 
            this.moveTypeTowardCharacter(this._closetTarget);
            break;
        case 3:
            this.moveTypeAccompanyWithCaptain();
            break;
        case 4:
            this.moveTypeVictory();
            break;
        }
    }
};
//----------------------------------------------------------------------------
//-------------------------Encounter Related----------------------------------
Game_EFS_Battler.prototype.archerSeekTarget = function() {
    var self = this;
    var least = 9999999;
    this._archerTargets = [];
    this._availableTargets.forEach(function(f) {
        if (f.isDead()) {
            return;
        };
        var distance = f.distanceFrom(self);
        if (distance <= self._core._engageRange) {
            self._archerTargets.push (f);
        }
        if (distance < least) {
            least = distance;
            self._closetTarget = f;
        };
        
    });
};
Game_EFS_Battler.prototype.archerCheckEncounter = function() {
     var distance = this.distanceFrom(this._closetTarget);

     if (this.enermyNear(this._closetTarget)){
        this.onEncounter(this._closetTarget);
     }else if (distance <= 3) {
      //do no thing
     }else if (this._archerTargets.length>0) {
        if (this._shootCounter<=0) {
            this.shootAt(this._archerTargets[Math.randomInt(this._archerTargets.length)]);
          this._shootCounter = this._core._atkFrequency;
        }
     }
};
Game_EFS_Battler.prototype.enermyNear = function(enermy) {
    return this.realDistanceFrom(enermy) <= 1;
};
Game_EFS_Battler.prototype.searchTargets = function() {
    var self = this;
    var least = 9999999;
    this._availableTargets.forEach(function(f) {
        if (f.isDead()) {
            return;
        };
        var distance = f.distanceFrom(self);
        if (distance < least) {
            least = distance;
            self._closetTarget = f;
        };
        
    });
};
Game_EFS_Battler.prototype.onEncounter = function(battler) {
    if (battler.isDead()) return;

    var attackSkill = this.core()._attackSkill;
    var targetDefenceSkill = battler.core().getDefenceSkillPoints();
    attackSkill += battler._isCalvary ? this._core._antiCalvaryAttackBouns : 0;
    targetDefenceSkill += this._isCalvary ? battler.core()._antiCalvaryDefenceBouns : 0;
    if (Math.randomInt(attackSkill + targetDefenceSkill) 
        <= attackSkill) 
    {
        this.attack(battler);
        if (!battler.isAttacking() && !battler.core().isPlayer()) {
            battler.defend(this);
        }
    }else{
        this.defend(battler);
    }
};
Game_EFS_Battler.prototype.onAttackOver = function() {
    if (this._missleLaunched) {
        this._missleLaunched = false;
        this.cancelAction();
        this._target = null;
        return;
    }


    if (this._target === null || this._target.isDead()) {
        this.cancelAction();
        return;
    };
    
    if (this.realDistanceFrom(this._target)> 1.5) { //如果敌人撤出
        return;
    }
    this.turnTowardCharacter(this._target);
    this.damageProcess(this._target);

    this.cancelAction();

    this._target = null;

};

//----------------------------------------------------------------------------
//------------------------------Actions Related-------------------------------

Game_EFS_Battler.prototype.attack = function(target) {
    this.cancelAction();
    this._target = target;
    this.turnTowardCharacter(target);
    this.resetAnimation(0);
    this._actionMode = 1;
    
    if (this._isArcher) {
        this._characterIndex = 1;
    }else{
        this._characterIndex =  1+Math.randomInt(3);
    }

};
Game_EFS_Battler.prototype.shootAt = function(target) {
    this.setDisplayBar(true);
    this.cancelAction();
    this._target = target;
    this.turnTowardCharacter(target);
    this.resetAnimation(0);
    this._actionMode = 1;
    this._characterIndex = 6;
    this._missleLaunched = true;
    this._ammo --;
    var game_missile = new Game_Missile(this,target.x,target.y,this.core()._accuracy,target);
    $gameMap.getMissiles().push(game_missile);
    SceneManager._scene._spriteset.createMissileSprite(game_missile);

};
Game_EFS_Battler.prototype.dropBlood = function() {
    this._bloodDroped = true;
};

Game_EFS_Battler.prototype.defend = function(target) {
    this.cancelAction();
    this._target = target;
    this.turnTowardCharacter(target);
    this.resetAnimation(0);
    //this.setPattern(-1);
    this._actionMode = 2;
    this._characterIndex = 4;

};

//----------------------------------------------------------------------------
//---------------------------Damage Process Related---------------------------

Game_EFS_Battler.prototype.damageProcess = function(target,missile) {
    target.setDisplayBar(true);
    //temptest
    target.requestAnimation(1);
    this.playSe(target,EFSBattleManager.SE_MELEE_HIT);

    if (missile)
        this.dealMissileDamage(target,missile);
    else{    
        this.dealDamage(target);
        }
    if (target.isDead()) {
        target.processDie();
        EFSBattleManager.displayKillingInfo(target,this);
    }    
};
Game_EFS_Battler.prototype.calculateDamageReduce = function(d) {
    switch(this.direction()){
        case 2:  return d == 8 ? 0.5 : d == 4 ? 0.75 : d == 6 ? 0.75 : 1; 
        case 4:  return d == 6 ? 0.5 : d == 2 ? 0.75 : d == 8 ? 0.75 : 1; 
        case 6:  return d == 4 ? 0.5 : d == 2 ? 0.75 : d == 8 ? 0.75 : 1; 
        case 8:  return d == 2 ? 0.5 : d == 4 ? 0.75 : d == 6 ? 0.75 : 1; 
    };
};
Game_EFS_Battler.prototype.calculateShieldReduce = function(d) {
    switch(this.direction()){
        case 2:  return d == 8 ? 1 : d == 4 ? 0.5 : d == 6 ? 0.5 : 0; 
        case 4:  return d == 6 ? 1 : d == 2 ? 0.5 : d == 8 ? 0.5 : 0; 
        case 6:  return d == 4 ? 1 : d == 2 ? 0.5 : d == 8 ? 0.5 : 0; 
        case 8:  return d == 2 ? 1 : d == 4 ? 0.5 : d == 6 ? 0.5 : 0; 
    };
};
Game_EFS_Battler.prototype.dealDamage = function(target) {
    var critical = Math.randomInt(100)<this._criticalHit;
    var d = target.direction();
    var damageReduce = 1;
    var shieldReduce = 0;
    if (target.isDefending()) {
        target.playSe(target,EFSBattleManager.SE_BLOCK);
        shieldReduce = target.calculateShieldReduce(this.direction());
    }
    if (target.core().isPlayer()) {
        $gameScreen.startShake(5,6,3);
        $gameScreen.startFlashForDamage();
    }

    if (critical){
        target.resetAnimation(0);
    }else{
        damageReduce = this.calculateDamageReduce(d);
    }
    if (!target.core().isHeavy()) {
        target.moveBackward();
        //target.hitBackward();
    }
    var finalPiercingAtk = Math.floor(this.core().piercingAtk*damageReduce);
    var finalAtk = Math.floor(this.core().baseAtk*damageReduce);

    target.core().receiveDamagePiercing(finalPiercingAtk);
    target.core().receiveDamage(finalAtk,shieldReduce);

    target.core().clearDisplayDamage();
    
};
Game_EFS_Battler.prototype.dealMissileDamage = function(target, missile) {
    var d = missile.direction();
    var damageReduce;
    var shieldReduce = 0;
    if (target.isDefending()) {
        target.playSe(target,EFSBattleManager.SE_BLOCK);
        shieldReduce = target.calculateShieldReduce(this.direction());
    }
    if (Math.randomInt(100)<this._criticalHit) 
        damageReduce = 1;
    else{
        damageReduce = target.calculateDamageReduce(d);
    }
    target.core().receiveDamagePiercing(Math.floor(this.core().sPiercingAtk*damageReduce));
    target.core().receiveDamage(Math.floor(this.core().sBaseAtk*damageReduce),shieldReduce);
};


Game_EFS_Battler.prototype.setDisplayBar = function(bool) {
   this._needDisplayBar = bool;
};
Game_EFS_Battler.prototype.needDisplayBar = function() {
   return this._needDisplayBar || EFSBattleManager.isShowingHPMPBar();
};
Game_EFS_Battler.prototype.processDie = function() {
    if (!this._isCorpse) {
        //temp test
        this._isCorpse = true;
        this._moveSpeed = 5;
        //generate_killed
        //this.core().generateKilled();
        this.cancelAction();
        this.resetAnimation(-1);
        this._characterIndex = 5;
        //set dead body
        this.setPriorityType(0);
        this.setThrough(true);
        this.setOpacity(175);

        this._stopCount = 0;
        EFSBattleManager.onBattlerDie();
        this._commandUnit.onBattlerDie();

        if (this.core().isKilled()) {
            this.requestAnimation(2);
            this.dropBlood();
        }


    }
};

//----------------------------------------------------------------------------
//------------------------------Movements Related-----------------------------

Game_EFS_Battler.prototype.moveTypeTowardCharacter = function(character) {
        this.moveTowardCharacter(character);
        if (! this._isCalvary && !this.isMovementSucceeded()) {
            if (this.distanceFrom(character)!==1) {
                this.moveRandom();
            }
        };
};
Game_EFS_Battler.prototype.moveTypeAccompanyWithCaptain = function() {
    if (!this.hasCaptain()) return;
    var sx = Math.abs(this._captain.deltaXFrom(this._closetTarget.x));
    var sy = Math.abs(this._captain.deltaYFrom(this._closetTarget.y));
    var distance = sx + sy;
    if (distance <= 3){
        this.moveTypeTowardCharacter(this._closetTarget);
    }else { 
        this.moveTowardGoalXY();
    }
    
};
Game_EFS_Battler.prototype.moveTowardGoalXY = function() {
    var sx = this.deltaXFrom(this.goalX);
    var sy = this.deltaYFrom(this.goalY);
    if (Math.abs(sx) > Math.abs(sy)) {
        this.moveStraight(sx > 0 ? 4 : 6);
        if (!this.isMovementSucceeded() && sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
        }
    } else if (sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
        if (!this.isMovementSucceeded() && sx !== 0) {
            this.moveStraight(sx > 0 ? 4 : 6);
        }
    }
};
Game_EFS_Battler.prototype.hitBackward = function(d) {
    this._hittingBackward = true;
    var lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.moveStraight(d);
    this.setDirectionFix(lastDirectionFix);    
};
Game_EFS_Battler.prototype.stopCountThreshold = function() {
    return 30 * (5 - this.moveFrequency());
};
Game_EFS_Battler.prototype.moveTypeVictory = function() {
    this.setMoveFrequency(2);
    switch (Math.randomInt(6)) {
    case 0: case 1:
        this.jump(0,0);
        break;
    case 2: case 3: case 4:
        this.moveRandom();
        break;
    case 5:
        this.moveForward();
        break;
    }
};
Game_EFS_Battler.prototype.checkEventTriggerTouch = function(x,y) {
    if (this.isWaitting() && !this.isJumping()) {
        var targets = this._availableTargets.filter(function(battler) {
           return battler.posNt(x, y);
        });
        if (targets[0]) {
            this.onEncounter(targets[0]);
        }
    }

};
Game_EFS_Battler.prototype.realDistanceFrom = function(game_battler) {
    var sx = Math.abs(game_battler._realX - this._realX);
    var sy = Math.abs(game_battler._realY - this._realY);
    return sx + sy;
};
Game_EFS_Battler.prototype.distanceFrom = function(game_battler) {
    var sx = Math.abs(this.deltaXFrom(game_battler.x));
    var sy = Math.abs(this.deltaYFrom(game_battler.y));
    return sx + sy;
};
Game_EFS_Battler.prototype.isNearThePlayer = function() {
    return distanceFrom($gamePlayer) < 20;
};
Game_EFS_Battler.prototype.isCollidedWithCharacters = function(x, y) {
    return this.isCollidedWithEvents(x, y) || this.isCollidedWithBattlers(x, y);
};

Game_EFS_Battler.prototype.isCollidedWithBattlers = function(x, y) {
    var self = this;
    var battlers = $gameMap.battlerXyNt(x, y);
    if (this._captain == this) {
        return battlers.some(function(game_battler) {
            return game_battler.isNormalPriority() && game_battler._team != self._team;
        });
    }

    return battlers.some(function(game_battler) {
        return game_battler.isNormalPriority();
    });
    return false;

};
// Game_EFS_Battler.prototype.moveTowardCharacter = function(character) {
//     if (!this._isCalvary)
//         Game_Character.prototype.moveTowardCharacter.call(this,character);
//     else{ //骑兵移动方式
//         var sx = this.deltaXFrom(character.x);
//         var sy = this.deltaYFrom(character.y);
//         if (Math.abs(sx) > Math.abs(sy)) {
//             this.moveStraight(sx > 0 ? 4 : 6);
//             if (!this.isMovementSucceeded() && sy !== 0) {
//                 this.moveStraight(sy > 0 ? 8 : 2);
//             }
//         } else if (sy !== 0) {
//             this.moveStraight(sy > 0 ? 8 : 2);
//             if (!this.isMovementSucceeded() && sx !== 0) {
//                 this.moveStraight(sx > 0 ? 4 : 6);
//             }
//         }
//     }
// };


Game_EFS_Battler.prototype.playSe = function(target,type) {
    if (!this._seList[type]) {
        return;
    }

    var list = $dataSounds[this._seList[type]].se;
    var se = list[Math.randomInt(list.length)];
    se.volume = this.seVolume(target);
    if (target) {
        AudioManager.playSe(se);
    }
};

Game_EFS_Battler.prototype.seVolume = function(target) {
    if (target === null) {
        return 0;
    };
    //if sound is not allowed
    
    //if player controll
    var d = target.realDistanceFrom($gamePlayer);
    return (100-d*4).clamp(0,100);
};

//=============================================================================
// Game_EFS_Hero
//=============================================================================
function Game_EFS_Hero() {
    this.initialize.apply(this, arguments);
}
Game_EFS_Hero.ATTACK_RIGHT_XY   = [[1,0],[2,0],[1,1],[1,-1]];
Game_EFS_Hero.ATTACK_LEFT_XY    = [[-1,0],[-2,0],[-1,-1],[-1,1]];
Game_EFS_Hero.ATTACK_UP_XY      = [[0,-1],[0,-2],[-1,-1],[1,-1]];
Game_EFS_Hero.ATTACK_DOWN_XY    = [[0,1],[0,2],[1,1],[-1,1]];

Game_EFS_Hero.prototype = Object.create(Game_EFS_Battler.prototype);
Game_EFS_Hero.prototype.constructor = Game_EFS_Hero;
//battler is RPG_EFS_Battler object
Game_EFS_Hero.prototype.initialize = function(rpg_battler,x,y) {
    Game_EFS_Battler.prototype.initialize.call(this,rpg_battler,x,y);
    this._dashing = false;

};
Game_EFS_Hero.prototype.originUpdate = function() {
    if (this.isJumping()) {
        this.updateJump();
    } else if (this.isMoving()) {
        this.updateMove();
    } 
    if (this.isAttacking()) {
        this.updateAttack();
    }else if(this.isDefending()){
        this.updateDefend();
    }else if(this._isCorpse){
        this.updateDie();
    }
    this.updateAnimation();
    //--------------------------
    if (this.isDead()) return;
    //--------------------------
    if (this._isArcher) {
        this.updateAsArcher();
    }else{
        
    }
};
Game_EFS_Hero.prototype.checkEventTriggerTouch = function(x,y) {
    // if (this.isWaitting() && !this.isJumping()) {
    //     var targets = this._availableTargets.filter(function(battler) {
    //        return battler.posNt(x, y);
    //     });
    //     if (targets[0]) {
    //         this.onEncounter(targets[0]);
    //     }
    // }
};
Game_EFS_Hero.prototype.updateDashing = function() {
    if (this.isMoving()) {
        return;
    }
    if (this.canMove() && !$gameMap.isDashDisabled()) {
        this._dashing = Input.isPressed('shift');//|| $gameTemp.isDestinationValid();
    } else {
        this._dashing = false;
    }
};
Game_EFS_Hero.prototype.realMoveSpeed = function() {
    return this._moveSpeed + (this.isDashing() ? 1 : 0) + (this.isAttacking() ? -1 : 0) ;
};
Game_EFS_Hero.prototype.isDashing = function() {
    return this._dashing;
};
Game_EFS_Hero.prototype.update = function() {
    var lastScrolledX = this.scrolledX();
    var lastScrolledY = this.scrolledY();
    //------------------
    this.originUpdate();
    if (this.isDead())return;
    //------------------
    this.updateDashing();
    this.moveByInput();
    this.updateScroll(lastScrolledX, lastScrolledY);
    this.actionByInput();


};
Game_EFS_Hero.prototype.centerX = function() {
    return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0;
};

Game_EFS_Hero.prototype.centerY = function() {
    return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0;
};

Game_EFS_Hero.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
    if (!Imported.MBBS_ElasticallyScroll) {
        var x1 = lastScrolledX;
        var y1 = lastScrolledY;
        var x2 = this.scrolledX();
        var y2 = this.scrolledY();
        if (y2 > y1 && y2 > this.centerY()) {
            $gameMap.scrollDown(y2 - y1);
        }
        if (x2 < x1 && x2 < this.centerX()) {
            $gameMap.scrollLeft(x1 - x2);
        }
        if (x2 > x1 && x2 > this.centerX()) {
            $gameMap.scrollRight(x2 - x1);
        }
        if (y2 < y1 && y2 < this.centerY()) {
            $gameMap.scrollUp(y1 - y2);
        }
    }
};
Game_EFS_Hero.prototype.getInputDirection = function() {
    return Input.dir8;
};
Game_EFS_Hero.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove()) {
        switch(this.getInputDirection()){
            case 2: 
                this.moveStraight(2);
                break;
            case 4: 
                this.moveStraight(4);
                break;
            case 6: 
                this.moveStraight(6);
                break;
            case 8: 
                this.moveStraight(8);
                break;
            case 1: 
                this.moveDiagonally(4,2);
                break;
            case 3: 
                this.moveDiagonally(6,2);
                break;
            case 7: 
                this.moveDiagonally(4,8);
                break;
            case 9: 
                this.moveDiagonally(6,8);
                break;
        }
    }
};
Game_EFS_Hero.prototype.actionByInput = function() {
    //attack
    if (!this.isAttacking() && !this.isJumping()) {
        if (Input.isTriggered('ok')) {
            this.attack();
        }
    }
    if (!this.isJumping()) {
        if (InputExtra.isTriggered(65)) {
            // this.cancelAction();
            // this.resetAnimation();
            var lastDirectionFix = this.isDirectionFixed();
            this.setDirectionFix(true);    
            var d = this.direction();
            switch(d){
                case 2:
                    this.jump(0,2);
                    break;
                case 4:
                    this.jump(-2,0);
                    break;
                case 6:
                    this.jump(2,0);
                    break;
                case 8:
                    this.jump(0,-2);
            }
            this.setDirectionFix(lastDirectionFix);
            
        }
    }
    if (Input.isTriggered("pageup")) {
        EFSBattleManager.spawnNewBattler(0,1,1);

    }

};
Game_EFS_Hero.prototype.playPlayerAttackAnimation = function() {
     var shifter = 0;
     if (Math.randomInt(2)===1)
        shifter = 5;
    this.requestAnimation(EFSBattleManager.PLAYER_ATK_ANIMATION + this.direction()/2 - 1 + shifter);
};
Game_EFS_Hero.prototype.attack = function() {
    this.cancelAction();
    this.playPlayerAttackAnimation();
    this.setDirectionFix(true);
    this.resetAnimation(0);
    this._actionMode = 1;
    
    if (this._isArcher) {
        this._characterIndex = 1;
    }else{
        this._characterIndex =  1+Math.randomInt(3);
    }
    //main core of damaging
    this.findTargesThenDamage();

};
Game_EFS_Hero.prototype.onAttackOver = function() {
    
    if (this._missleLaunched) {
        this._missleLaunched = false;
        this.cancelAction();
        this._target = null;
        return;
    }
    this.setDirectionFix(false);
    this.cancelAction();

};
Game_EFS_Hero.prototype.findTargesThenDamage = function() {
    var listFighters = [];
    this._availableTargets.forEach(function(target) {
        if(target.isDead())return;
        var sx = target._realX - this._realX;
        var sy = target._realY - this._realY;
        
        if (Math.abs(sx)+Math.abs(sy) <= 2.5) {
            switch(this.direction()){
                case 2:     
                    if (sy>=1)
                    listFighters.push(target);
                    break;
                case 4:     
                    if (sx<=-1){
                    listFighters.push(target);
                    }
                    break;
                case 6:     
                    if (sx>=1)
                    listFighters.push(target);
                    break;
                case 8:     
                    if (sy<=-1)
                    listFighters.push(target);
                    break;
            }   
        }
    },this);
    
    listFighters.forEach(function(f) {
        this.damageProcess(f);
        var list = EFSBattleManager.PLAYER_ATK_TARGET_ANIMATIONS;
        f.requestAnimation(list[Math.randomInt(list.length)]);
    },this);
    if (listFighters.length > 0) {
        $gameScreen.startShake(4,4,3);
    }

};
Game_EFS_Hero.prototype.dealDamage = function(target) {
    var critical = Math.randomInt(100)<this._criticalHit;
    var d = target.direction();
    var damageReduce;
    var shieldReduce = 0;
    if (target.isDefending()) {
        shieldReduce = target.calculateShieldReduce(this.direction());
    }
    if (critical){
        target.resetAnimation(0);
        damageReduce = 1;
        if (!target.core().isHeavy()) {
            target.hitBackward(this.direction());
        }
    }else{
        damageReduce = this.calculateDamageReduce(d);
    }
    if (this._dashing && !target.core().isHeavy()) {
            target.hitBackward(this.direction());
    }

    var finalPiercingAtk = Math.floor(this.core().piercingAtk*damageReduce);
    var finalAtk = Math.floor(this.core().baseAtk*damageReduce);

    target.core().receiveDamagePiercing(finalPiercingAtk);
    target.core().receiveDamage(finalAtk,shieldReduce);
    target.startDamagePopup(target.core().getDisplayDamage(),critical);
    target.core().clearDisplayDamage();
};

Game_EFS_Hero.prototype.canMove = function() {
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
        return false;
    }
    return true;
};

//=============================================================================
// Game_EFS_CommandUnits
//=============================================================================
function Game_EFS_CommandUnits() {
    this.initialize.apply(this, arguments);
};
Object.defineProperties(Game_EFS_CommandUnits.prototype, {
    id:      { get: function() { return this._rpgCommandUnit.id;     }, configurable: false},
    teamId:  { get: function() { return this._teamId;           }, configurable: false},
});
//--------------------------------------------
// Rectangle Formation A type
// Max: 20 person
//--------------------------------------------
Game_EFS_CommandUnits.FORMATION_RECTANGLE_A_UP = [
new Point(0,0), new Point(-1,0),new Point(1,0),new Point(-2,0),new Point(2,0),
new Point(0,1), new Point(-1,1),new Point(1,1),new Point(-2,1),new Point(2,1),
new Point(0,2), new Point(-1,2),new Point(1,2),new Point(-2,2),new Point(2,2),
new Point(0,3), new Point(-1,3),new Point(1,3),new Point(-2,3),new Point(2,3),
];
Game_EFS_CommandUnits.FORMATION_RECTANGLE_A_DOWN = [
new Point(0,0), new Point(-1,0),new Point(1,0),new Point(-2,0),new Point(2,0),
new Point(0,-1), new Point(-1,-1),new Point(1,-1),new Point(-2,-1),new Point(2,-1),
new Point(0,-2), new Point(-1,-2),new Point(1,-2),new Point(-2,-2),new Point(2,-2),
new Point(0,-3), new Point(-1,-3),new Point(1,-3),new Point(-2,-3),new Point(2,-3),
];
Game_EFS_CommandUnits.FORMATION_RECTANGLE_A_LEFT = [
new Point(0,0), new Point(0,-1),new Point(0,1),new Point(0,-2),new Point(0,2),
new Point(1,0), new Point(1,-1),new Point(1,1),new Point(1,-2),new Point(1,2),
new Point(2,0), new Point(2,-1),new Point(2,1),new Point(2,-2),new Point(2,2),
new Point(3,0), new Point(3,-1),new Point(3,1),new Point(3,-2),new Point(3,2),
];
Game_EFS_CommandUnits.FORMATION_RECTANGLE_A_RIGHT = [
new Point(0,0), new Point(0,-1),new Point(0,1),new Point(0,-2),new Point(0,2),
new Point(-1,0), new Point(-1,-1),new Point(-1,1),new Point(-1,-2),new Point(-1,2),
new Point(-2,0), new Point(-2,-1),new Point(-2,1),new Point(-2,-2),new Point(-2,2),
new Point(-3,0), new Point(-3,-1),new Point(-3,1),new Point(-3,-2),new Point(-3,2),
];
Game_EFS_CommandUnits.FORMATION_RECTANGLE_A = [
Game_EFS_CommandUnits.FORMATION_RECTANGLE_A_DOWN,
Game_EFS_CommandUnits.FORMATION_RECTANGLE_A_LEFT,
Game_EFS_CommandUnits.FORMATION_RECTANGLE_A_RIGHT,
Game_EFS_CommandUnits.FORMATION_RECTANGLE_A_UP,
];
//--------------------------------------------
// Loose Formation 
// Max: 18 person
//--------------------------------------------
Game_EFS_CommandUnits.FORMATION_LOOSE_UP = [
new Point(0,0), new Point(-2,0),new Point(2,0),new Point(-4,0),new Point(4,0),
new Point(1,1), new Point(-1,1),new Point(3,1),new Point(-3,1),
new Point(0,2), new Point(-2,2),new Point(2,2),new Point(-4,2),new Point(4,2),
new Point(1,3), new Point(-1,3),new Point(3,3),new Point(-3,3),
];
Game_EFS_CommandUnits.FORMATION_LOOSE_DOWN = [
new Point(0,0), new Point(-2,0),new Point(2,0),new Point(-4,0),new Point(4,0),
new Point(1,-1), new Point(-1,-1),new Point(3,-1),new Point(-3,-1),
new Point(0,-2), new Point(-2,-2),new Point(2,-2),new Point(-4,-2),new Point(4,-2),
new Point(1,-3), new Point(-1,-3),new Point(3,-3),new Point(-3,-3),
];
Game_EFS_CommandUnits.FORMATION_LOOSE_LEFT = [
new Point(0,0), new Point(0,-2),new Point(0,2),new Point(0,-4),new Point(0,4),
new Point(1,1), new Point(1,-1),new Point(1,3),new Point(1,-3),
new Point(2,0), new Point(2,-2),new Point(2,2),new Point(2,-4),new Point(2,4),
new Point(3,1), new Point(3,-1),new Point(3,3),new Point(3,-3),
];
Game_EFS_CommandUnits.FORMATION_LOOSE_RIGHT = [
new Point(0,0), new Point(0,-2),new Point(0,2),new Point(0,-4),new Point(0,4),
new Point(-1,1), new Point(-1,-1),new Point(-1,3),new Point(-1,-3),
new Point(-2,0), new Point(-2,-2),new Point(-2,2),new Point(-2,-4),new Point(-2,4),
new Point(-3,1), new Point(-3,-1),new Point(-3,3),new Point(-3,-3),
];
Game_EFS_CommandUnits.FORMATION_LOOSE = [
Game_EFS_CommandUnits.FORMATION_LOOSE_DOWN,
Game_EFS_CommandUnits.FORMATION_LOOSE_LEFT,
Game_EFS_CommandUnits.FORMATION_LOOSE_RIGHT,
Game_EFS_CommandUnits.FORMATION_LOOSE_UP,
];
//--------------------------------------------
// Triangle Formation 
// Max: 15 person
//--------------------------------------------
Game_EFS_CommandUnits.FORMATION_TRIANGLE_UP = [
new Point(0,0),
new Point(0,1),new Point(-1,1),new Point(1,1),
new Point(0,2),new Point(-1,2),new Point(1,2),
new Point(0,3),new Point(-1,3),new Point(1,3),new Point(-2,3),new Point(2,3),
new Point(0,4),new Point(-1,4),new Point(1,4),
];
Game_EFS_CommandUnits.FORMATION_TRIANGLE_DOWN = [
new Point(0,0),
new Point(0,-1),new Point(-1,-1),new Point(1,-1),
new Point(0,-2),new Point(-1,-2),new Point(1,-2),
new Point(0,-3),new Point(-1,-3),new Point(1,-3),new Point(-2,-3),new Point(2,-3),
new Point(0,-4),new Point(-1,-4),new Point(1,-4),
];
Game_EFS_CommandUnits.FORMATION_TRIANGLE_LEFT = [
new Point(0,0),
new Point(1,0),new Point(1,1),new Point(1,-1),
new Point(2,0),new Point(2,1),new Point(2,-1),
new Point(3,0),new Point(3,1),new Point(3,-1),new Point(3,2),new Point(3,-2),
new Point(4,0),new Point(4,1),new Point(4,-1),
];
Game_EFS_CommandUnits.FORMATION_TRIANGLE_RIGHT = [
new Point(0,0),
new Point(-1,0),new Point(-1,1),new Point(-1,-1),
new Point(-2,0),new Point(-2,1),new Point(-2,-1),
new Point(-3,0),new Point(-3,1),new Point(-3,-1),new Point(-3,2),new Point(-3,-2),
new Point(-4,0),new Point(-4,1),new Point(-4,-1),
];
Game_EFS_CommandUnits.FORMATION_TRIANGLE = [
Game_EFS_CommandUnits.FORMATION_TRIANGLE_DOWN,
Game_EFS_CommandUnits.FORMATION_TRIANGLE_LEFT,
Game_EFS_CommandUnits.FORMATION_TRIANGLE_RIGHT,
Game_EFS_CommandUnits.FORMATION_TRIANGLE_UP,
];
//--------------------------------------------
// Pike Formation A type
// Max: 21 person
//--------------------------------------------
Game_EFS_CommandUnits.FORMATION_PIKE_A_UP = [
new Point(0,0), new Point(-1,0),new Point(1,0),new Point(-2,0),new Point(2,0),new Point(-3,0),new Point(3,0),
new Point(0,1), new Point(-1,1),new Point(1,1),new Point(-2,1),new Point(2,1),new Point(-3,1),new Point(3,1),
new Point(0,2), new Point(-1,2),new Point(1,2),new Point(-2,2),new Point(2,2),new Point(-3,2),new Point(3,2),
];
Game_EFS_CommandUnits.FORMATION_PIKE_A_DOWN = [
new Point(0,0), new Point(-1,0),new Point(1,0),new Point(-2,0),new Point(2,0),new Point(-3,0),new Point(3,0),
new Point(0,-1), new Point(-1,-1),new Point(1,-1),new Point(-2,-1),new Point(2,-1),new Point(-3,-1),new Point(3,-1),
new Point(0,-2), new Point(-1,-2),new Point(1,-2),new Point(-2,-2),new Point(2,-2),new Point(-3,-2),new Point(3,-2),
];
Game_EFS_CommandUnits.FORMATION_PIKE_A_LEFT = [
new Point(0,0), new Point(0,-1),new Point(0,1),new Point(0,-2),new Point(0,2),new Point(0,-3),new Point(0,3),
new Point(1,0), new Point(1,-1),new Point(1,1),new Point(1,-2),new Point(1,2),new Point(1,-3),new Point(1,3),
new Point(2,0), new Point(2,-1),new Point(2,1),new Point(2,-2),new Point(2,2),new Point(2,-3),new Point(2,3),
];
Game_EFS_CommandUnits.FORMATION_PIKE_A_RIGHT = [
new Point(0,0), new Point(0,-1),new Point(0,1),new Point(0,-2),new Point(0,2),new Point(0,-3),new Point(0,3),
new Point(-1,0), new Point(-1,-1),new Point(-1,1),new Point(-1,-2),new Point(-1,2),new Point(-1,-3),new Point(-1,3),
new Point(-2,0), new Point(-2,-1),new Point(-2,1),new Point(-2,-2),new Point(-2,2),new Point(-2,-3),new Point(-2,3),
];
Game_EFS_CommandUnits.FORMATION_PIKE_A = [
Game_EFS_CommandUnits.FORMATION_PIKE_A_DOWN,
Game_EFS_CommandUnits.FORMATION_PIKE_A_LEFT,
Game_EFS_CommandUnits.FORMATION_PIKE_A_RIGHT,
Game_EFS_CommandUnits.FORMATION_PIKE_A_UP,
];
Game_EFS_CommandUnits.FORMATIONS_LIST = [
Game_EFS_CommandUnits.FORMATION_RECTANGLE_A,
Game_EFS_CommandUnits.FORMATION_LOOSE,
Game_EFS_CommandUnits.FORMATION_TRIANGLE,
Game_EFS_CommandUnits.FORMATION_PIKE_A,
];


Game_EFS_CommandUnits.prototype.initialize = function(rpg_commandunit,x,y,d) {
    this.initMembers(rpg_commandunit);
    if (!x && !y && !d) {
        this.instantSetup(rpg_commandunit);
    }else{
        this.setup(rpg_commandunit,x,y,d);
    };
    this.arrangeCaptainMembers();
    //this.assignSlotFormation();
};
Game_EFS_CommandUnits.prototype.initMembers = function(rpg_commandunit) {
    this._rpgCommandUnit = rpg_commandunit;
    this._fighters = [];
    this._captain = null;
    this._id = 0;
    this._teamId = 0;
    this._availableTargets = [];
    this._availableBattlerTargets = [];
    //this._formation = Game_EFS_CommandUnits.FORMATIONS_LIST[0];
    this.setFormation(0);
};
/*
    return all the members(no captain) that is not dead or ran away
*/
Game_EFS_CommandUnits.prototype.findAvailableMembers = function() {
    var result = this._fighters.filter(function(f) {return !f.isDead();});
    if (result.length>1){
        result.shift();
    }
    return result;
};
Game_EFS_CommandUnits.prototype.availableMembers = function() {
    return this._availableMembers;
};
Game_EFS_CommandUnits.prototype.setFormation = function(id) {
    if (id>=Game_EFS_CommandUnits.FORMATIONS_LIST.length) {
        console.log("Formation does not exist: "+id);
        this._formation = Game_EFS_CommandUnits.FORMATIONS_LIST[0]
        return;
    };
    this._formation = Game_EFS_CommandUnits.FORMATIONS_LIST[id];
};
Game_EFS_CommandUnits.prototype.onBattlerDie = function() {
    this.arrangeCaptainMembers();
    this.assignSlotFormation();
};
Game_EFS_CommandUnits.prototype.arrangeCaptainMembers = function() {
    this._captain = this.captain();
    this._availableMembers = this.findAvailableMembers();
    this._fighters.forEach(function(f) {
        f.setCaptain(this._captain);
    },this);
    if (this._captain)
    this._captain.setMoveType(2);
};

Game_EFS_CommandUnits.prototype.assignSlotFormation = function() {
    //temp test
    if (!this._captain){
        return;
    }
    var t = this.findClosetCommandUnit();
    if (t){
        var d = this.directionToward(t);
    }
    else{
        var d = this._captain.direction();
    }    
    var formation = this._formation[d/2-1];
    var i = 1;
    this._availableMembers.forEach(function(battler) {
        if (formation[i]) {
            battler.assignGoalXY(formation[i].x,formation[i].y);
        }else{
            battler.assignGoalXY(0,0);
        }        
        i++;
    });
};
Game_EFS_CommandUnits.prototype.findClosetCommandUnit = function() {
    var least = 9999999;
    var result = null;
    this._availableTargets.forEach(function(target) {
        if (target._captain) {
            var distance = this._captain.distanceFrom(target._captain);
            if (distance < least) {
                least = distance;
                result = target;
            }
        }
    },this);
    return result;
};
Game_EFS_CommandUnits.prototype.directionToward = function(gameCu) {
    var sx = this._captain.deltaXFrom(gameCu._captain.x);
    var sy = this._captain.deltaYFrom(gameCu._captain.y);
    if (Math.abs(sx) > Math.abs(sy)) {
        return sx > 0 ? 4 : 6;
    } else if (sy !== 0) {
        return sy > 0 ? 8 : 2;
    }
};
Game_EFS_CommandUnits.prototype.availableTargets = function() {
    return this._availableTargets;
};
Game_EFS_CommandUnits.prototype.setup = function(rpg_commandunits,x,y,d) {
    this._id = rpg_commandunits.id;
    //temp test
    var x = x + Math.floor((Math.random() * 10));
    var y = y + Math.floor((Math.random() * 10));
    var d = 2;
    var i = 0;
    // base on total number allowed on battle field(I think I should use percentage of people allowed per units)
    // and base on total alive
    
    //generate format
    var size = rpg_commandunits.getFighters().length;
    for (var i = 0; i < size; i++) {
        var rpg_battler = rpg_commandunits.getFighters()[i];
        var gb;
        if (rpg_battler.isPlayer()) {
            gb = new Game_EFS_Hero(rpg_battler,x+i,y);
        }else{
            gb = new Game_EFS_Battler(rpg_battler,x+i,y);
        } 
        this.createFighterSprit(gb);
        this._fighters.push(gb);
        $gameMap.getBattlerObjects().push(gb);
    }

    //this._captain();

};
Game_EFS_CommandUnits.prototype.instantSetup = function(rpg_commandunits) {
    this._id = rpg_commandunits.id;

    var size = rpg_commandunits.getFighters().length;

    for (var i = 0; i < size; i++) {
        var f = rpg_commandunits.getFighters()[i];
        var gb;
        if (f.isPlayer()) {
            gb = new Game_EFS_Hero(f,f.initalX,f.initalY);
        }else{
            gb = new Game_EFS_Battler(f,f.initalX,f.initalY);
        }
        this.createFighterSprit(gb);
        this._fighters.push(gb);
        $gameMap.getBattlerObjects().push(gb);
    }


};
Game_EFS_CommandUnits.prototype.insertBattler = function(soldierId) {
    if (typeof soldierId === 'number') {
        var rpg_battler = this._rpgCommandUnit.createFighters(soldierId);
    }else{
        var rpg_battler = soldierId;
    };
    if (this._captain !== null){
        var x = this._captain.x;
        var y = this._captain.y;
    }else{
        console.log("no captain that can be spawn");
    };
    var gb;
    if (rpg_battler.isPlayer()) {
        gb = new Game_EFS_Hero(rpg_battler,x,y);
    }else{
        gb = new Game_EFS_Battler(rpg_battler,x,y);
    };
    this.createFighterSprit(gb);
    gb.setAvailableTargets(this._availableBattlerTargets);
    
    gb.requestAnimation(3);

    gb.setEssential(this._teamId);
    gb.setCommandUnit(this);

    gb.setMoveType(3);
    $gameMap.getBattlerObjects().push(gb);

    this._fighters.push(gb);

    this.onBattlerDie();
    EFSBattleManager.onBattlerInserted(gb, this);
    //alert(gb._availableTargets.length);
};
Game_EFS_CommandUnits.prototype.captain = function() {
    for (var i = 0; i < this._fighters.length; i++) {
        if (this._fighters[i].isDead()) continue;
            this._captain = this._fighters[i];
            return this._fighters[i];
    }
    this._captain = null;
    return null;
};
//设置战斗队伍
Game_EFS_CommandUnits.prototype.setTeam = function(team) {
    var self = this;
    this._teamId = team;
    this._fighters.forEach(function(f){
        f.setEssential(team);
        f.setCommandUnit(self);
    });
};
// main updating methods -----------------------------
Game_EFS_CommandUnits.prototype.update = function() {
    this._fighters.forEach(function(f) {
        f.update();
    });
};
// --------------------------------------------------
Game_EFS_CommandUnits.prototype.setMoveType = function(type) {
    this.getFighters().forEach(function(f) {
        f.setMoveType(type); //G_B
    });
};
Game_EFS_CommandUnits.prototype.setBattlersTargets = function() {
    var temp = this._availableTargets; //G_U
    var targets = [];//G_B
    temp.forEach(function(cu) {
        cu.getFighters().forEach(function(f) {
            targets.push(f); //G_B
        });
    });
    this._fighters.forEach(function(f) {
        f.setAvailableTargets(targets); //G_B
        //f._availableTargets = targets; 
    });
    this._availableBattlerTargets = targets;
};


Game_EFS_CommandUnits.prototype.attachBattlersTarget = function(target) {
    this._fighters.forEach(function(f) {
        f.attachAvailableTargets([target]);
    });
};

Game_EFS_CommandUnits.prototype.createFighterSprit = function(game_battler) {
   SceneManager._scene._spriteset.createBattlerSprite(game_battler);
};
Game_EFS_CommandUnits.prototype.getFighters = function() {
    return this._fighters;
};
Game_EFS_CommandUnits.prototype.isAllDead = function() {
    return this._fighters.every(function(f) {
        return f.isDead();
    });
};
Game_EFS_CommandUnits.prototype.isEmpty = function() {
    return this._fighters.isEmpty();
};
//=============================================================================
// RPG Command Units
//=============================================================================
RPG_EFS_CommandUnits.TEMP_TEST_FIGHTERS = [1,1,1,1,1,1];
Object.defineProperties(RPG_EFS_CommandUnits.prototype, {
    id:      { get: function() { return this._id;     }, configurable: false},
});
function RPG_EFS_CommandUnits() {
    this.initialize.apply(this, arguments);
}
RPG_EFS_CommandUnits.prototype.initialize = function(id, type) {
    this.initMembers();
    //temp
    this._fighters = [];
    this._id = id;
    this._type =  type || 0; //'Infantry';;;'calvary';;;'missile'
};
RPG_EFS_CommandUnits.prototype.setType = function(type) {
    this._type = type;
};
RPG_EFS_CommandUnits.prototype.initMembers = function() {
    this._fighters = [];
    this._captain = null;
    this._id = 0;
    this._battleStrategyAI = null;
};
RPG_EFS_CommandUnits.prototype.setBatlleStrategyAI = function(ai) {
    this._battleStrategyAI = ai;
};
RPG_EFS_CommandUnits.prototype.getBatlleStrategyAI = function() {
    return this._battleStrategyAI;
};
RPG_EFS_CommandUnits.prototype.clearFighters = function() {
    this._fighters = [];
};
RPG_EFS_CommandUnits.prototype.getFighters = function() {
    return this._fighters;
};
RPG_EFS_CommandUnits.prototype.isEmpty = function() {
    return this._fighters.isEmpty();
};
RPG_EFS_CommandUnits.prototype.attachFighters = function(arg) {
    this._fighters = this._fighters.concat(arg);
};
RPG_EFS_CommandUnits.prototype.addFigher = function(fighterId) {
    var max = EFSBattleManager.maxiumBattlerOfType[this.type]; 
    if(this._fighters.length >= max){
        console.log("CommandUnit has reach Maxium capacity");
        return;
    };
    this._fighters.push(this.createFighters(fighterId));
};
RPG_EFS_CommandUnits.prototype.canAddFighter = function(fighterId) {
    switch(this._type){
        case 0:  
            if ($dataSoldier[fighterId].isCalvary || $dataSoldier[fighterId].isArcher){
            console.log("Error type of battler");
            return false;
            }
        case 1:  
            if (!$dataSoldier[fighterId].isArcher){
            console.log("Error type of battler");    
            return false;
            }
        case 2:  
            if (!$dataSoldier[fighterId].isCalvary){
            console.log("Error type of battler");    
            return false;
            }
    };
    return true;
};

RPG_EFS_CommandUnits.prototype.loadPresetArmy = function(armyId) {
    this.loadTestArmy();
    //temp
};
RPG_EFS_CommandUnits.prototype.loadTestArmy = function() {
    for (var i = 0; i < RPG_EFS_CommandUnits.TEMP_TEST_FIGHTERS.length; i++) {
        this._fighters.push(this.createFighters(RPG_EFS_CommandUnits.TEMP_TEST_FIGHTERS[i]));
    }
};
RPG_EFS_CommandUnits.prototype.createFighters = function(soldierId) {
    return new RPG_EFS_Battler(soldierId,this._id);
};
//=============================================================================
// Command_Unit_AI 
//=============================================================================
/*
    Game_EFS_CommandUnits.prototype.setMoveType
    Game_EFS_CommandUnits.prototype.directionToward
    Game_EFS_CommandUnits.prototype.findClosetCommandUnit
    this._availableTargets
    Game_EFS_CommandUnits.prototype.findAvailableMembers
    Game_EFS_CommandUnits.prototype.setFormation
*/

Object.defineProperties(Command_Unit_AI.prototype, {
    //id:      { get: function() { return this._id;     }, configurable: false},
});
function Command_Unit_AI() {
    this.initialize.apply(this, arguments);
}
Command_Unit_AI.prototype.initialize = function(type) {
    this.initMembers();
    this._type = type || 0;
    /*
        0: defualt - 
    */
    
};
Command_Unit_AI.prototype.initMembers = function() {
    this._type = 0;
    this._gameCU = null;

};
Command_Unit_AI.prototype.setGameCU = function(gu) {
    this._gameCU = gu;
};
Command_Unit_AI.prototype.update = function() {
    switch(this._type){
        case 0:  

            break;
        case 1:  

            break;
        case 2:  

            break;
    };
};
//=============================================================================
// Game_Actor 
//=============================================================================
MBBS_MV.Core.Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
    MBBS_MV.Core.Game_Actor_setup.call(this,actorId);
    this._commandUnits = [];
    this.setupArmy(actorId);
};
Game_Actor.prototype.setupArmy = function(actorId) {
    //temp
    this.loadTestArmy();

};
Game_Actor.prototype.loadTestArmy = function() {
    var rpg_commandunits = new RPG_EFS_CommandUnits(1);
    rpg_commandunits.loadPresetArmy();
    this._commandUnits.push(rpg_commandunits);
    var rpg_commandunits = new RPG_EFS_CommandUnits(2);
    rpg_commandunits.loadPresetArmy();
    this._commandUnits.push(rpg_commandunits);
    var rpg_commandunits = new RPG_EFS_CommandUnits(3);
    rpg_commandunits.loadPresetArmy();
    this._commandUnits.push(rpg_commandunits);

};
Game_Actor.prototype.getCommandUnits = function() {
    return this._commandUnits;
};

//=============================================================================
// 主程序 - 群战核心战斗管理器
// EFSBattleManager
//=============================================================================
function EFSBattleManager() {
    throw new Error('This is a static class');
}
// 创建
// attackers, defenders 都是RPG_CommandUnits的数组 //attackers, defenders
// rpg_commandunits 是一个包含所有参加者 的 2d array
EFSBattleManager.setup = function(rpg_commandunits, canEscape, canLose, callBackEvent) {
    this.initMembers();
    this._rpgArmies = rpg_commandunits;
    if (rpg_commandunits.length <= 1) {
        throw new Error('Attackers or defenders data invild');
    }
    //即刻战斗模式?
    this._isInstantBattle = false;
    this._keepEvents = false;

    this._canEscape = canEscape;
    this._canLose   = canLose;  
    this._eventCallback = callBackEvent;
    $gameScreen.onBattleStart();
    this._setupSuccess = true;
    //this.makeEscapeRatio();

};
//即刻开始战斗
EFSBattleManager.instantSetup = function(canEscape, canLose, keepEvents , callBackEvent) {
    this.initMembers();

    this._keepEvents = keepEvents || false;
    this._isInstantBattle = true;
    //scan map
    var teams = $gameMap.scanMapBattlers();
    this._setupSuccess = true;
    if (!teams || ! teams[0] || ! teams[1] || teams[0].length === 0 || teams[1].length === 0) {
        console.log("Unable to start a battle (maybe there are no armies on current map)");
        this._setupSuccess = false;
    }
    
    this._scannedBattlers = teams;

    this._canEscape = canEscape;
    this._canLose   = canLose;  
    this._eventCallback = callBackEvent;
    $gameScreen.onBattleStart();

};



EFSBattleManager.initMembers = function() {
    this._rpgArmies = [];
    this._armies = [];

    this._inEFSBattle = false;

    this._OtherTeamsAllDead = false;
    this._playerTeamAllDead = false;


    this._canEscape = false;
    this._canLose = false;
    this._keepEvents = false;

    this._eventCallback = null;

    this._mapBgm = null;
    this._mapBgs = null;

    this._escapeRatio = 0;
    this._escaped = false;
    this._rewards = {};
    //============ EFS 
    this._spawns = [];

    //inputs
    this._isShowingHPMPBar = false;


};
//inputs
EFSBattleManager.isShowingHPMPBar = function() {
    return this._isShowingHPMPBar;
}
//开始战斗
EFSBattleManager.startBattle = function() {
    console.log("Staring the battle");
    this._phase = 'start';
    $gameSystem.onBattleStart();
    //$gameParty.onBattleStart();
    //$gameTroop.onBattleStart();
    //this.displayStartMessages();


    if (this._isInstantBattle) {
        this.spawnScannedTeams();
    }else{
        this.createSpawnAreas();
        this.spawnCommandUnits();
    };
    this.clearEmptyCommandUnits();
    this.setBattlersTargets();

    this._armies.forEach(function(armies) {
        armies.forEach(function(cu) {
            cu.assignSlotFormation();
        });
    });

    this._inEFSBattle = true;
    this._phase = 'main';
};
EFSBattleManager.isInstantBattle = function() {
    return this._isInstantBattle;
};
EFSBattleManager.inEFSBattle = function() {
    return this._inEFSBattle;
};
EFSBattleManager.keepEvents = function() {
    return this._keepEvents;
};


EFSBattleManager.createSpawnAreas = function() {
    var regionIdBase = MBBS_MV.Param.spawnAreaRegionID;
    var numSpawns = MBBS_MV.Param.maxiumArmies;
    var spawnAreas = [];
    for (var i = 0; i < numSpawns; i++) {
        spawnAreas.push($gameMap.getCoordinatesRegion(regionIdBase + i));
    }
    this._spawns = spawnAreas;
};
EFSBattleManager.spawnCommandUnits = function(){
    var self = this;
    var i = 0;
    this._rpgArmies.forEach(function(array) { //for every army
        array.forEach(function(cu) { // for every command unit
            var x = Math.floor((Math.random() * 20) + 5);
            var y = Math.floor((Math.random() * 20) + 5);
            var d = 2;
            var gameCu = new Game_EFS_CommandUnits(cu,x,y,d);
            gameCu.setTeam(i); 
            if (!self._armies[i]) self._armies[i] = [];
            self._armies[i].push(gameCu);
        });
        i++;
    });

    console.log("done Spawn commandUnits");
};
EFSBattleManager.spawnScannedTeams = function() {
    for (var i = 0; i < this._scannedBattlers.length; i++) { //army num
        this._rpgArmies[i] = [];
        for (var j = 1; j <= MBBS_MV.Param.maxiumCommandUnites; j++) {
             this._rpgArmies[i].push(new RPG_EFS_CommandUnits(j));
        };
    }
    //addFigher
    var self = this;
    var index = 0;
    this._scannedBattlers.forEach(function(army) {
        for (var i = 0; i < army.length; i++) {
            self._rpgArmies[index][army[i].cuId-1].attachFighters([army[i]]);
        };
        index++;
    });
    index = 0;
    this._rpgArmies.forEach(function(army) {
        army.forEach(function(cu) {
            var gameCu = new Game_EFS_CommandUnits(cu);
            gameCu.setTeam(index);
            if (!self._armies[index]) self._armies[index] = [];
            self._armies[index].push(gameCu);
        }); 
        index++;
    });
};
EFSBattleManager.spawnNewCommanUnit = function(team, rpg_commandunit) {
    if (team === 0) { //


    }




};
EFSBattleManager.spawnNewBattler = function(team, cuId, soldierId) {
    for (var i = 0; i < this._armies[team].length; i++) {
        var army = this._armies[team];
        if (army[i].id === cuId){
            army[i].insertBattler(soldierId);
            break;
        }
        
    }

    
};
EFSBattleManager.onBattlerInserted = function(game_battler, game_cu) {
    this._armies.forEach(function(amry) {
        amry.forEach(function(cu) {
            if (cu.teamId === game_cu.teamId)
                return;
            cu.attachBattlersTarget(game_battler);
        });
    });
};

EFSBattleManager.setBattlersTargets = function(){
    var allCus = [];
    this._armies.forEach(function(amry) {
        amry.forEach(function(cu) {
            allCus.push(cu);
        });
    });
    //console.log("all cus : "+allCus.length);
    this._armies.forEach(function(amry) {
        //console.log("------- amry ");
        amry.forEach(function(cu) {
            //console.log("---- cu: "+cu.id);
            allCus.forEach(function(target) {
                if (target === cu || cu.teamId == target.teamId) {
                    //console.log("has same");
                    return;
                };
                cu._availableTargets.push(target);

                //console.log("pushed "+target.teamId+", now :"+cu._availableTargets.length);
            });

        });
    });
    this._armies.forEach(function(amry) {
        amry.forEach(function(cu) {
            cu.setBattlersTargets();
        });
    });

};


EFSBattleManager.clearEmptyCommandUnits = function() {
    for (var i = 0; i < this._armies.length; i++) {
        if (this._armies[i])
        this._armies[i] = this._armies[i].filter(function(cu) {
            return cu.getFighters().length !== 0;
        });
    };
};
EFSBattleManager.saveBgmAndBgs = function() {
    this._mapBgm = AudioManager.saveBgm();
    this._mapBgs = AudioManager.saveBgs();
};
EFSBattleManager.playBattleBgm = function() {
    AudioManager.playBgm($gameSystem.battleBgm());
    AudioManager.stopBgs();
};
EFSBattleManager.playVictoryMe = function() {
    AudioManager.playMe($gameSystem.victoryMe());
};
EFSBattleManager.playDefeatMe = function() {
    AudioManager.playMe($gameSystem.defeatMe());
};
EFSBattleManager.replayBgmAndBgs = function() {
    if (this._mapBgm) {
        AudioManager.replayBgm(this._mapBgm);
    } else {
        AudioManager.stopBgm();
    }
    if (this._mapBgs) {
        AudioManager.replayBgs(this._mapBgs);
    }
};
//当遇到敌人时

//更新
EFSBattleManager.update = function() {
    //console.log("updating...");
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
        case 'start':
            
            //break;
        case 'main':
            
            this.updateCoreBattle();

            break;
        case 'battleEnd':
            this.updateBattleEnd();
            break;
        }
    }   
};
//更新
EFSBattleManager.updateCoreBattle = function() {
    this.updateCoreBattleInputs();
    this._armies.forEach(function(army) {
        army.forEach(function(commandUnit) {
            commandUnit.update();
        });
    });

};


EFSBattleManager.updateCoreBattleInputs = function() {
    this._isShowingHPMPBar = false;
    if (Input.isPressed('control')) {
        this._isShowingHPMPBar = true;
    };


};

EFSBattleManager.updateBattlersAfterBattle = function() { 
    this._armies.forEach(function(army) {
        army.forEach(function(commandUnit) {
            commandUnit.update();
        });
    });
};
EFSBattleManager.updateEvent = function() {
    switch (this._phase) {
    case 'main':
     return this.updateEventMain();
    }
    return this.checkAbort();
};
EFSBattleManager.updateEventMain = function() {
    if (this.checkBattleEnd()) {
        return true;
    }
    if (SceneManager.isSceneChanging()) {
        return true;
    }
    return false;
};
EFSBattleManager.isBusy = function() {
    return false;
};
EFSBattleManager.isInMain = function() {
    return this._phase === 'main';
};
EFSBattleManager.isAborting = function() {
    return this._phase === 'aborting';
};
EFSBattleManager.isBattleEnd = function() {
    return this._phase === 'battleEnd';
};
EFSBattleManager.canEscape = function() {
    return this._canEscape;
};
EFSBattleManager.canLose = function() {
    return this._canLose;
};
EFSBattleManager.isEscaped = function() {
    return this._escaped;
};
EFSBattleManager.abort = function() {
    this._phase = 'aborting';
};
EFSBattleManager.checkBattleEnd = function() {
    if (this._phase) {
        if (this.checkAbort()) {
            return true;
        } else if (this._playerTeamAllDead) {
            this.processDefeat();
            return true;
        } else if (this._OtherTeamsAllDead) {
            this.processVictory();
            return true;
        }
    }
    return false;
};
EFSBattleManager.onBattlerDie = function() {
    this._playerTeamAllDead = this.checkArmyAllDead(this._armies[0]);
    var temp = true;
    for (var i = this._armies.length - 1; i >= 1; i--) {
        if (!this.checkArmyAllDead(this._armies[i])) temp = false;;
    }
    this._OtherTeamsAllDead = temp;

};

EFSBattleManager.checkArmyAllDead = function(army) {
    return army.every(function(gameCu) {
        return gameCu.isAllDead();
    });
};

EFSBattleManager.checkAbort = function() {
    if (this.isAborting()) {
        this.processAbort();
        return true;
    }
    return false;
};

EFSBattleManager.processVictory = function() {
    //$gameParty.removeBattleStates();
    //$gameParty.performVictory();
    this.playVictoryMe();
    this.replayBgmAndBgs();
    //this.makeRewards();
    //this.displayVictoryMessage();
    //this.displayRewards();
    //this.gainRewards();
    this.endBattle(0);
};
EFSBattleManager.processAbort = function() {

    this.replayBgmAndBgs();
    this.endBattle(1);
};
EFSBattleManager.processDefeat = function() {
    //this.displayDefeatMessage();
    this.playDefeatMe();
    if (this._canLose) {
        this.replayBgmAndBgs();
    } else {
        AudioManager.stopBgm();
    }
    this.endBattle(2);
};
EFSBattleManager.endBattle = function(result) {
    //$gameSystem.onBattleEnd();
    this._phase = 'battleEnd';
    if (result === 0) {
        $gameSystem.onBattleWin();
    } else if (this._escaped) {
        $gameSystem.onBattleEscape();
    }
    this._armies.forEach(function(army) {
        army.forEach(function(commandUnit) {
            commandUnit.setMoveType(4);
        });
    })
};
EFSBattleManager.updateBattleEnd = function() {
    //console.log("updating battle end");
    this.updateBattlersAfterBattle();
    if (!Input.isPressed('escape')) {

        return;
    }

    if (this.isInstantBattle()) { // 即可战斗中
            if (this._canLose) {
               SceneManager.goto(Scene_Map);
               console.log("down");
            } else {
                SceneManager.goto(Scene_Gameover);
            }
    }else{
        if (false) { //$gameParty.AllDead()
            if (this._canLose) {
                SceneManager.pop();
            } else {
                SceneManager.goto(Scene_Gameover);
            }
        } else {
            SceneManager.pop();
        }

    }

    this._inEFSBattle = false;
    this._isInstantBattle = false;
    this._phase = null;
    $gameMap.clearBattlerObjects();

};
EFSBattleManager.displayKillingInfo = function(target, attacker) {
    if (attacker==null) { //自然伤害
        if (target._team==0) { // 我军
            if (target.core().isKilled()) 
                Notification.post(target.core().name+"被杀了",EFSBattleManager.E_K_T_COLOR);
            else
                Notification.post(target.core().name+"被击昏了",EFSBattleManager.E_B_T_COLOR);
        }else{   //敌军
            if (target.core().isKilled()) 
                Notification.post(target.core().name+"被杀了",EFSBattleManager.T_K_E_COLOR);
            else
                Notification.post(target.core().name+"被击昏了",EFSBattleManager.T_B_E_COLOR);
        };
    }else{ //被人击杀
        if (attacker._team == 0) { 
            if (target._team == 0) { // 我军
                if (target.core().isKilled())
                    Notification.post(attacker.core().name+"误杀了"+target.core().name,EFSBattleManager.E_K_T_COLOR);
                else
                    Notification.post(attacker.core().name+"误击昏了"+target.core().name,EFSBattleManager.E_B_T_COLOR);
            }else{ //敌军
                if (target.core().isKilled())
                    Notification.post(attacker.core().name+"杀死了"+target.core().name,EFSBattleManager.T_K_E_COLOR);
                else
                    Notification.post(attacker.core().name+"击昏了"+target.core().name,EFSBattleManager.T_B_E_COLOR);
            };
        }else{
            if (target._team == 0) { // 我军
                if (target.core().isKilled())
                    Notification.post(target.core().name+"被"+attacker.core().name+"杀死了",EFSBattleManager.E_K_T_COLOR);
                else
                    Notification.post(target.core().name+"被"+attacker.core().name+"击昏了",EFSBattleManager.E_B_T_COLOR);
            }else{ //敌军
                if (target.core().isKilled())
                    Notification.post(target.core().name+"被"+attacker.core().name+"误杀死了",EFSBattleManager.T_K_E_COLOR);
                else
                    Notification.post(target.core().name+"被"+attacker.core().name+"误击昏了",EFSBattleManager.T_B_E_COLOR);
            };
        };
    };
};

//=============================================================================
// Scene_EFS_Battle
//=============================================================================

function Scene_EFS_Battle() {
    this.initialize.apply(this, arguments);
}

Scene_EFS_Battle.prototype = Object.create(Scene_Map.prototype);
Scene_EFS_Battle.prototype.constructor = Scene_EFS_Battle;

Scene_EFS_Battle.prototype.initialize = function() {
    Scene_Map.prototype.initialize.call(this);

    //now initialize some data
    console.log("successfully initialized Scene_EFS_Battle");
};

    

Scene_EFS_Battle.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this._transfer = $gamePlayer.isTransferring();
    var mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();

    DataManager.loadMapData(mapId);
    // get like new battle map id

   // createDisplayObjects();
     console.log("successfully created Scene_EFS_Battle");
};


Scene_EFS_Battle.prototype.onMapLoaded = function() {
    if (this._transfer) {
        $gamePlayer.performTransfer();
    }
    this.createDisplayObjects();
    //display soldier....
    console.log("onMapLoaded...");

};

Scene_EFS_Battle.prototype.start = function() {
    old_SceneManager_stack = SceneManager._stack;
    Scene_Map.prototype.start.call(this);
    SceneManager._stack = old_SceneManager_stack;
    this.startFadeIn(this.fadeSpeed(), false);
    EFSBattleManager.playBattleBgm();
    EFSBattleManager.startBattle();
     console.log("started...");

};



Scene_EFS_Battle.prototype.update = function() {
    //this.updateDestination();
    this.updateMainMultiply();
    if (this.isSceneChangeOk()) {
        this.updateScene();
    } else if (SceneManager.isNextScene(Scene_Map)) {
        this.updateEncounterEffect();
    }
    this.updateWaitCount();
    Scene_Base.prototype.update.call(this);
    //
};


Scene_EFS_Battle.prototype.updateMainMultiply = function() {
    this.updateMain();
    if (this.isFastForward()) {
        this.updateMain();
    }
};

Scene_EFS_Battle.prototype.updateMain = function() {
    var active = this.isActive();
    $gameMap.update(active);
    $gamePlayer.update(active);
    //battle mannager update
    //EFSBattleManager.update();

    //update troops?

    //update missles?

    //update cursers?

    //update bloodbar?
    if (active && !this.isBusy()) {
        EFSBattleManager.update();
    }
    $gameTimer.update(active);
    $gameScreen.update();
};

Scene_EFS_Battle.prototype.updateBattleProcess = function() {
    
};

Scene_EFS_Battle.prototype.stop = function() {
    Scene_Base.prototype.stop.call(this);
    $gamePlayer.straighten();
    this._mapNameWindow.close();
    // the very end of the battle
    this.startFadeOut(this.slowFadeSpeed(), false);
    $gamePlayer.backToMapAfterBattle();
};

Scene_EFS_Battle.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    $gameScreen.clearZoom();
    //$gameSystem.onBattleEnd();
    //$gameParty.onBattleEnd();
    //$gameTroop.onBattleEnd();
    //AudioManager.stopMe();



};

Scene_EFS_Battle.prototype.needsFadeIn = function() {
    return (SceneManager.isPreviousScene(Scene_Battle) ||
            SceneManager.isPreviousScene(Scene_Load) ||
            SceneManager.isPreviousScene(Scene_Map));
};



Scene_EFS_Battle.prototype.updateScene = function() {
    this.checkGameover();
    if (!SceneManager.isSceneChanging()) {
        this.updateTransferPlayer();
    }
    //if (!SceneManager.isSceneChanging()) {
    //    this.updateEncounter();
    //}
    //if (!SceneManager.isSceneChanging()) {
    //    this.updateCallMenu();
    //}
    //if (!SceneManager.isSceneChanging()) {
    //    this.updateCallDebug();
    //}
};

Scene_EFS_Battle.prototype.createDisplayObjects = function() {

    this.createSpriteset();
    this.createMapNameWindow();
    this.createWindowLayer();
    this.createAllWindows();
    // create 

};

Scene_EFS_Battle.prototype.createSpriteset = function() {
    // 
    this._spriteset = new Spriteset_Map();
    this.addChild(this._spriteset);


};
//=============================================================================
// Scene_Map
//=============================================================================
MBBS_MV.Core.Scene_Map_stop = Scene_Map.prototype.stop;
Scene_Map.prototype.stop = function() {
    MBBS_MV.Core.Scene_Map_stop.call(this);
    if (! this.needsSlowFadeOut() && SceneManager.isNextScene(Scene_EFS_Battle)) {
        this.launchEFSBattle();
    }
    console.log("Scene_Map stoped");
};

MBBS_MV.Core.Scene_Map_updateMain = Scene_Map.prototype.updateMain;
Scene_Map.prototype.updateMain = function() {

    if (EFSBattleManager.isInstantBattle()) {
        var active = this.isActive();
        EFSBattleManager.update();
        $gameMap.update(active);
        $gamePlayer.update(active);
        $gameTimer.update(active);
        $gameScreen.update();
    }else{
        MBBS_MV.Core.Scene_Map_updateMain.call(this);
    }

};
Scene_Map.prototype.update = function() {
    //this.updateDestination();
    this.updateMainMultiply();
    if (this.isSceneChangeOk()) {
        this.updateScene();
    } else if (SceneManager.isNextScene(Scene_Battle)) {
        this.updateEncounterEffect();
    } else if (SceneManager.isNextScene(Scene_EFS_Battle)) {
        this.updateEncounterEffect();
    } 
    this.updateWaitCount();
    Scene_Base.prototype.update.call(this);
};

Scene_Map.prototype.needsFadeIn = function() {
    return (SceneManager.isPreviousScene(Scene_Battle) ||
            SceneManager.isPreviousScene(Scene_EFS_Battle) ||
            SceneManager.isPreviousScene(Scene_Load));
};

Scene_Map.prototype.launchEFSBattle = function() {
    BattleManager.saveBgmAndBgs();
    this.stopAudioOnBattleStart();
    SoundManager.playBattleStart();
    this.startEncounterEffect();
    this._mapNameWindow.hide();
    console.log("ok");

};
//=============================================================================
// Game_Map
//=============================================================================

Game_Map.MEMORIZED_POS = 1;
Game_Map.MAPS_NEED_MEMORIZE = [1];
MBBS_MV.Core.Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    MBBS_MV.Core.Game_Map_initialize.call(this);
    this._EFSBattlersObjects = [];
}    
Game_Map.prototype.getBattlerObjects = function() {
    return this._EFSBattlersObjects;
};
Game_Map.prototype.clearBattlerObjects = function() {
    this._EFSBattlersObjects = [];
};
Game_Map.prototype.battlerXyNt = function(x, y) {
    return this._EFSBattlersObjects.filter(function(game_battler) {
        return game_battler.posNt(x, y);
    });
};

MBBS_MV.Core.Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {

    // if (typeof $gameVariables.value(Game_Map.MEMORIZED_POS) === 'number'){
    //   $gameVariables.setValue(Game_Map.MEMORIZED_POS,[]);
    //   console.log("Created varible for map spot");
    // }

    // //alert(mapId+" "+this._mapId);
    // if (Game_Map.MAPS_NEED_MEMORIZE.indexOf(this._mapId)!==-1){
    //     console.log("operating the data.");
    //     var temp = $gameVariables.value(Game_Map.MEMORIZED_POS);
    //     //var bill = (JSON.parse(JSON.stringify(bob)));
    //     temp[this._mapId] = (JSON.parse(JSON.stringify($gameMap)));
    //     $gameVariables.setValue(Game_Map.MEMORIZED_POS,temp);
    // }
    // //console.log("$gameVariables.value(Game_Map.MEMORIZED_POS)[mapId]: "+$gameVariables.value(Game_Map.MEMORIZED_POS)[mapId]);
    // if ($gameVariables.value(Game_Map.MEMORIZED_POS)[mapId]){
    //     console.log("data over loaded: mapId: " +  mapId);
    //   $game_map = $gameVariables.value(Game_Map.MEMORIZED_POS)[mapId];
    //   return;
    // }
    // $gameMap.requestRefresh();

    // this.setupEFSBattlers();

    this._missiles = [];
    // this._bloods = [];

    MBBS_MV.Core.Game_Map_setup.call(this,mapId);
};
Game_Map.prototype.getMissiles = function() {
    return this._missiles;
};
// Game_Map.prototype.getBloods = function() {
//     return this._bloods;
// };
Game_Map.prototype.getCoordinatesRegion = function(regionId) {
    var area = [];
    for (var x = 0; x < this.width(); x++) 
        for (var y = 0; y < this.height(); y++) 
            if(this.regionId(x,y)===regionId)
                area.push({x:x,y:y});
    return area;
};
Game_Map.prototype.scanMapBattlers = function() {
    var teams = [];
    this.events().forEach(function(event) {
        event.refresh();
        if (!event.page()) {
            return;
        }
        if (event.list()[0].code !== 108) {
            return;
        } 
        if (event.list()[0].parameters[0] === "EFS_Battler") {
            for (var i = 1; i <= 3; i++) {
                if (event.list()[i].code !== 408) {
                    return;
                }
            }
        }
        var pattern = /\d+/;
        var teamID =    Number(event.list()[1].parameters[0].match(pattern));
        var cuID =      Number(event.list()[2].parameters[0].match(pattern));
        var soldierID = Number(event.list()[3].parameters[0].match(pattern));


        if (!teams[teamID]) { 
            teams[teamID] = [];
        }
        
        var rpg_battler = new RPG_EFS_Battler(soldierID,cuID);
        teams[teamID].push(rpg_battler);
        rpg_battler.setInitialPosition(event.x,event.y,event.direction());
        
        // if (EFSBattleManager._keepEvents) {
        //     event.hide();
        // }else{
            event.erase();
        // }

    });
    return teams;

};
MBBS_MV.Core.Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function(sceneActive) {
    MBBS_MV.Core.Game_Map_update.call(this,sceneActive);
    this.updateMissiles();
};
Game_Map.prototype.updateMissiles = function() {
    this._missiles.forEach(function(arrow) {
        arrow.update();
    });
};
//=============================================================================
// Game_Player
//=============================================================================

Game_Player.prototype.startEFSBattle = function(instant){
    
    //attackers, defenders, canEscape, canLose, callBackEvent
    var teamOne = $gameParty.allMembers()[0].getCommandUnits();
    var teamTwo = $gameParty.allMembers()[1].getCommandUnits();
    var teamThree = $gameParty.allMembers()[2].getCommandUnits();

    if (instant) {
        EFSBattleManager.instantSetup(true, true, true, null);
        if (EFSBattleManager._setupSuccess) {
            EFSBattleManager.startBattle();
            console.log("started...");
        }
    }else{
        var armies = [];
        armies.push(teamOne);
        armies.push(teamTwo);
        //armies.push(teamThree);
        EFSBattleManager.setup(armies, true, true, null);
        if (EFSBattleManager._setupSuccess) {
            this.saveOldMapDataEFS();
            this.reserveTransfer(2,2,2,2,0);
            SceneManager.push(Scene_EFS_Battle);
            console.log("started...");
        }
    }

};

MBBS_MV.Core.Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
    MBBS_MV.Core.Game_Player_initMembers.call(this);
    this._efsOldMapId = 0;
    this._efsOldX = 0;
    this._efsOldY = 0;
    this._efsOldDirection = 0;
};

Game_Player.prototype.clearOldTransferInfo = function() {
    this._efsOldMapId = 0;
    this._efsOldX = 0;
    this._efsOldY = 0;
    this._efsOldDirection = 0;
};

Game_Player.prototype.saveOldMapDataEFS = function() {
    this._efsOldMapId = $gameMap.mapId();
    this._efsOldX = this._x;
    this._efsOldY = this._y;
    this._efsOldDirection = this._direction;
};

Game_Player.prototype.backToMapAfterBattle = function() {
    this._transferring = true;
    this._newMapId = this._efsOldMapId;
    this._newX = this._efsOldX;
    this._newY = this._efsOldY;
    this._newDirection = this._efsOldDirection;
    this._fadeType = 0;
    this.clearOldTransferInfo();
};

MBBS_MV.Core.Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function(arg) {
    if (EFSBattleManager.inEFSBattle()) {

    }else
        MBBS_MV.Core.Game_Player_update.call(this,arg);

};
//=============================================================================
// Game Missile
//=============================================================================
function Game_Missile() {
    this.initialize.apply(this, arguments);
}

Object.defineProperties(Game_Missile.prototype, {
    x:          { get: function() { return this._x; },           configurable: true },
    y:          { get: function() { return this._y; },           configurable: true },
    name:       { get: function() { return this._name; },        configurable: true },
    removed:    { get: function() { return this._removed; },     configurable: true },
    opacity:    { get: function() { return this._opacity; },     configurable: true },
    angle:      { get: function() 
        { 
            return this._angle + this._baseAngle ; }, 
      configurable: true },


});
Game_Missile.prototype.initialize = function(launcher,goalX,goalY,accuracy,target) {
    this.initMembers(launcher,goalX,goalY,accuracy,target);
};
Game_Missile.prototype.initMembers = function(launcher,goalX,goalY,accuracy,target) {
    this._launcher = launcher;
    this._x = launcher.x;
    this._y = launcher.y;
    this._goalX = goalX;
    this._goalY = goalY;
    this._accuracy = accuracy;

    this._target = target;
    this._realX = launcher._realX;
    this._realY = launcher._realY;
    this._moveSpeed = 3;

    this._opacity = 255;

    this._direction = launcher.direction();
    this._angle=0;
    this._baseAngle;
    switch(this._direction){
        case 2: this._baseAngle  =  Math.PI;    break;
        case 4: this._baseAngle  =  3*Math.PI/2;    break;
        case 6: this._baseAngle  =  Math.PI/2;    break;
        case 8: this._baseAngle  =  0;    break;
    }

    this._deltaAngle = 0;
    
    //temp
    this._name = "LongArrow";
    this._jumpCount = 0;
    this._jumpPeak = 0;
    this._stopCount = 0;
    this._arrived = false;
    this._removed = false;
    this._droped = false;
    this.jump(goalX-this._x,goalY-this._y);

};
Game_Missile.prototype.direction = function() {
    return this._direction;
};
Game_Missile.prototype.arrived = function() {
    return this._arrived;
};
Game_Missile.prototype.droped = function() {
    return this._droped;
};
Game_Missile.prototype.isMoving = function() {
    return this._realX !== this._x || this._realY !== this._y;
};
Game_Missile.prototype.isJumping = function() {
    return this._jumpCount > 0;
};
Game_Missile.prototype.jumpHeight = function() {
    return (this._jumpPeak * this._jumpPeak -
            Math.pow(Math.abs(this._jumpCount - this._jumpPeak), 2)) / 2;
};
Game_Missile.prototype.update = function() {
    if (!this._arrived) {
        if (this.isJumping()) {
            this.updateJump();
        }else{
            if (this.calculateHitChance(this._target)) {
                if (!this._target.isDead()) {
                    //temp
                    this._launcher.damageProcess(this._target,this);
                }
                this._arrived = true;
                //console.log("射中了");
            }else{
                this.drop();
                //console.log("落地了");
            }
        }
    }else {
        if(!this._removed) this.updateStop();
    }
    
};
Game_Missile.prototype.drop = function() {
    this._arrived = true;
    this._droped = true;
};
Game_Missile.prototype.jump = function(xPlus, yPlus) {
    if (Math.abs(xPlus) > Math.abs(yPlus)) {
        if (xPlus !== 0) {
            this.setDirection(xPlus < 0 ? 4 : 6);
        }
    } else {
        if (yPlus !== 0) {
            this.setDirection(yPlus < 0 ? 8 : 2);
        }
    }
    this._x += xPlus;
    this._y += yPlus;
    var distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
    this._jumpPeak = 10 + distance - this._moveSpeed;
    this._jumpCount = this._jumpPeak * 2;
    var ang = 0;

    switch(this.direction()){
        case 2:     
            this._deltaAngle = 0;
            break; 
        case 4:      
            ang = Math.atan2(this._jumpPeak,distance/2.0);
            this._deltaAngle = 2.0*ang/this._jumpCount;
            break; 
        case 6:     
            ang = -Math.atan2(this._jumpPeak,distance/2.0);
            this._deltaAngle = 2.0*ang/this._jumpCount;
            break; 
        case 8:      
            this._deltaAngle = 0;
            break; 
    };
    this._angle = ang;

};
Game_Missile.prototype.setDirection = function(d) {
    this._direction = d;
};
Game_Missile.prototype.updateStop = function() {
    this._stopCount++;
    if (this._stopCount >= EFSBattleManager.MISSILES_DISAPPEAR_TIME) {
        this._removed = true;
    }else if(this._stopCount > EFSBattleManager.MISSILES_DISAPPEAR_TIME-EFSBattleManager.FRAME_PER_SECOND){
        this._opacity -= 255/EFSBattleManager.FRAME_PER_SECOND;
    }

};
Game_Missile.prototype.updateJump = function() {
    this._angle -= this._deltaAngle;
    this._jumpCount--;
    this._realX = (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
    this._realY = (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);

    

    if (this._jumpCount === 0) {
        this._realX = this._x = $gameMap.roundX(this._x);
        this._realY = this._y = $gameMap.roundY(this._y);
    }
};
Game_Missile.prototype.scrolledX = function() {
    return $gameMap.adjustX(this._realX);
};
Game_Missile.prototype.scrolledY = function() {
    return $gameMap.adjustY(this._realY);
};
Game_Missile.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    return Math.round(this.scrolledX() * tw + tw / 2);
};
Game_Missile.prototype.screenY = function() {
    var th = $gameMap.tileHeight();
    return Math.round(this.scrolledY() * th + th -
                      6 - this.jumpHeight());
};
Game_Missile.prototype.screenZ = function() {
    return 6;
};
Game_Missile.prototype.calculateHitChance = function(target) {
    var sx = Math.abs(target._realX - this._goalX);
    var sy = Math.abs(target._realY - this._goalY);

    if (sx + sy >= 1.75) return false;
    if (target.direction() != this.direction &&
    10 - target.direction() != this.direction &&
      target.isMoving()) 
        this._accuracy /= 2;
   
    return Math.randomInt(100) < this._accuracy;


};
//=============================================================================
// Sprite Missile
//=============================================================================
function Sprite_Missile() {
    this.initialize.apply(this, arguments);
}

Sprite_Missile.prototype = Object.create(Sprite.prototype);
Sprite_Missile.prototype.constructor = Sprite_Missile;

Sprite_Missile.prototype.initialize = function(game_arrow) {
    Sprite.prototype.initialize.call(this);
    this._arrow = game_arrow;
    this.bitmap = ImageManager.loadCharacter("Missile_"+game_arrow.name);
    this._deletable = false;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._sx = Math.randomInt(4) * 100;
    this._sy = Math.randomInt(4) * 100;
    this._bitMapWidth  = 100;
    this._bitMapHeight = 100;
};

Sprite_Missile.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (!this._arrow.arrived()) {
        this.x = this._arrow.screenX();
        this.y = this._arrow.screenY();
        this.z = this._arrow.screenZ();
        this.opacity = this._arrow.opacity;


        this.rotation = this._arrow.angle;
        //alert(this.rotation);
        //angle
    }else if(this._arrow.droped() && !this._arrow.removed){
        this.drop();
        this.setFrame(this._sx, this._sy, this._bitMapWidth, this._bitMapHeight);
        this.x = this._arrow.screenX();
        this.y = this._arrow.screenY() - 48;
        this.opacity = this._arrow.opacity;
    }else{
        this._deletable = true;
        this.bitmap = null;
    }
};
Sprite_Missile.prototype.drop = function() {
    if (!this._droped) {
        this.bitmap = ImageManager.loadCharacter("DROP_"+this._arrow.name);
        this._droped = true;
        this.rotation = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.z = 1;
    }
};

//=============================================================================
// Sprite Blood
//=============================================================================
function Sprite_Blood() {
    this.initialize.apply(this, arguments);
}
Sprite_Blood.prototype = Object.create(Sprite.prototype);
Sprite_Blood.prototype.constructor = Sprite_Blood;

Sprite_Blood.prototype.initialize = function(fighter) {
    Sprite.prototype.initialize.call(this);
    this._realX = fighter._realX;
    this._realY = fighter._realY;

    this.bitmap = ImageManager.loadCharacter("DROP_Blood");
    this._deletable = false;
    this.anchor.x = 0.5;
    this.anchor.y = 0.75;
    this._sx = Math.randomInt(4) * 100;
    this._sy = Math.randomInt(4) * 100;
    this._bitMapWidth  = 100;
    this._bitMapHeight = 100;
    this.opacity = 145;
    this.setFrame(this._sx, this._sy, this._bitMapWidth, this._bitMapHeight);
    this._stopCount = 0;
    this.scale.x = 0;
    this.scale.y = 0;
    //this.blendMode = 5;
};
Sprite_Blood.prototype.isDeletable = function() {
    return this._deletable;
};

Sprite_Blood.prototype.update = function() {
    Sprite.prototype.update.call(this);
        // this.x = this.screenX();
        this.y = - 32;
        this.z = 1;
        if (this.scale.x >= 1) {
            this._stopCount++;
            if (this._stopCount > EFSBattleManager.BLOOD_DISAPPEAR_TIME) {
                this._deletable = true;
            }else if (this._stopCount > EFSBattleManager.BLOOD_DISAPPEAR_TIME-EFSBattleManager.FRAME_PER_SECOND) {
                this.opacity -= 145/EFSBattleManager.FRAME_PER_SECOND;
            }
            return;
        }
        this.scale.x += 0.01;
        this.scale.y += 0.01;
        //this.opacity = this.opacity;
};

//=============================================================================
// Spriteset_Map
//=============================================================================
 MBBS_MV.Core.Sprite_Character_initialize = Sprite_Character.prototype.initialize;
 Sprite_Character.prototype.initialize = function(character) {
    MBBS_MV.Core.Sprite_Character_initialize.call(this,character);
    this._bloodSprite = null;
 };

MBBS_MV.Core.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
  MBBS_MV.Core.Sprite_Character_update.call(this);
  this.updateBlood();
};
Sprite_Character.prototype.updateBlood = function() {
    if (this._battler && !this._finishiedBlood) {
        if (!this._bloodSpriteCreated && this._battler.bloodDroped()) {
            this._bloodSprite = new Sprite_Blood(this);
            this.addChild(this._bloodSprite);
            this._bloodSpriteCreated = true;
        }else if(this._bloodSpriteCreated){
            this._bloodSprite.update();
            if (this._bloodSprite.isDeletable()) {
                this.removeChild(this._bloodSprite);
                this._bloodSprite = null;
                this._finishiedBlood = true;
            }

        }
    }
};
//=============================================================================
// Spriteset_Map
//=============================================================================
MBBS_MV.Core.Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function() {
    MBBS_MV.Core.Spriteset_Map_createCharacters.call(this);

    if (EFSBattleManager.inEFSBattle()) {
        for (var k = 0; k < EFSBattleManager._armies.length; k++) {
            for (var i = 0; i < EFSBattleManager._armies[k].length; i++) {
                var cu = EFSBattleManager._armies[k][i]
                for (var j = 0; j < cu.getFighters().length; j++)
                    this.createBattlerSprite(cu.getFighters()[j]);
            }
        }
    }

    this._missiles = [];
    // this._bloods = [];

    $gameMap.getMissiles().forEach(function(game_arrow) {
        this.createMissileSprite(game_arrow);
    },this);

};
Spriteset_Map.prototype.createMissileSprite = function(game_arrow) {
    var sprite = new Sprite_Missile(game_arrow);
    this._missiles.push (sprite);
    this._tilemap.addChild(sprite);
};
Spriteset_Map.prototype.createBattlerSprite = function(game_battler) {
    var sb = new Sprite_Character(game_battler);
    this._characterSprites.push(sb);
    this._tilemap.addChild(sb);
};

MBBS_MV.Core.Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
    MBBS_MV.Core.Spriteset_Map_update.call(this);
    this.updateMissiles();
};

Spriteset_Map.prototype.updateMissiles = function() {
    var self = this;
    this._missiles.forEach(function(sprite_missile) {
        sprite_missile.update;
        if (sprite_missile._deletable) {
            self.removeMissile(sprite_missile);
        }
    });
};
Spriteset_Map.prototype.removeMissile = function(sprite_missile) {
    //console.log(this._missiles.length);
    this._missiles.splice(this._missiles.indexOf(sprite_missile),1);
    //console.log("\n"+this._missiles.length);
};
// Spriteset_Map.prototype.battlerSpritesRemoving = function() {
//     var self = this;
//     this._characterSprites.forEach(function(sb) {
//         if (sb._character._deletable) {
//             console.log("boom");
//             self.removeBattlersSprite(sb);
//             self._tilemap.removeChild(sb);
//         }
//     });
// };
// Spriteset_Map.prototype.removeBattlersSprite = function(sb) {
//     this._characterSprites.splice(this._characterSprites.indexOf(sb),1);
// };


//=============================================================================
// End of File
//=============================================================================