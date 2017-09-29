//=============================================================================
// Game Map Main Game - Main Game Core Engine
// Game_CoreSystem.js
//=============================================================================

var Imported = Imported || {};
Imported.Game_CoreSystem = true;
var Game_CoreSystem = Game_CoreSystem || {};
Game_CoreSystem.Core = Game_CoreSystem.Core || {};
//=============================================================================
// Core Game Global Constants
//=============================================================================
Game_CoreSystem.OBEJECT_ID_TREES = [1, 2, 3, 4, 5, 6, 7];
Game_CoreSystem.OBEJECT_ID_CONSTRUCTIONS = [9, 10, 11, 12, 13];

//=============================================================================
//DataManager
//=============================================================================
var $dataObjectTiles = null;
DataManager._databaseFiles.push({
    name: '$dataObjectTiles',
    src: 'Game_ObjectTilesets.json'
});
//=============================================================================
//ImageManager
//=============================================================================
ImageManager.loadObject = function(filename, hue) {
    return this.loadBitmap('img/object/', filename, hue, false);
};
//-----------------------------------------------------------------------------
// Game_Player
//---------------------------------------------------------------------------- 
Game_CoreSystem.Core.Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function(sceneActive) {
    if (!$gameMap._isPausingCharacters) {
        Game_CoreSystem.Core.Game_Player_update.call(this, sceneActive);
    }
};
Game_Player.prototype.tempCreateObject = function(objectId) {
    $gameMap.makeObject(objectId);
};
//=============================================================================
// Game_Object
//=============================================================================
function Game_Object() {
    this.initialize.apply(this, arguments);
}
Game_Object.prototype.initialize = function(objectId, x, y) {
    this.initMembers(objectId, x, y);
    this.createSubObjects();
};
Game_Object.prototype.initMembers = function(objectId, x, y) {
    var data = $dataObjectTiles[objectId];
    console.log(data.name);
    this._characterName = data.characterName;
    this._showCharacterPassing = true;
    this._opacity = 255;
    this._foundationGrids = data.foundationGrids;
    this._passableGrids = data.passableGrids; //1111 1010 
    this._center = new Point(data.center[0], data.center[1]);
    this._isSubObject = false;
    this._subObjectsData = data.subObjects;
    this._subObjects = [];
    this._width = data.width;
    this._height = data.height;
    this._canDelete = false;
    this._deploying = false;
    if (x && y) {
        var ox = x - this._center.x;
        var oy = y - this._center.y;
        this._x = x;
        this._y = y;
        this._areaRect = new Rectangle(ox, oy, this._width - 1, this._height * 2 / 3);
    } else {
        this._deploying = true;
        this._x = $gamePlayer.x;
        this._y = $gamePlayer.y - 1;
        this._areaRect = null;
    };
    this._movementCounter = 0;
};
Game_Object.prototype.characterName = function() {
    return this._characterName;
};
Game_Object.prototype.xyToIndex = function(x, y) {
    return x + y * this._width;
};
Game_Object.prototype.hasSubObjects = function() {
    return this._subObjectsData.length > 0;
};
Game_Object.prototype.getSubObjects = function() {
    return this._subObjects;
};
Game_Object.prototype.isSubObject = function() {
    return this._isSubObject;
};
Game_Object.prototype.setSubObject = function(bool) {
    this._isSubObject = bool || false;
};
Game_Object.prototype.createSubObjects = function() {
    if (this.hasSubObjects()) {
        for (var i = 0; i < this._subObjectsData.length; i++) {
            var data = this._subObjectsData[i];
            var ox = this._x - this._center.x;
            var oy = this._y - this._center.y;

            var obj = $gameMap.newObject(data[2], ox + data[0], oy + data[1]);
            obj._deploying = this._deploying;
            obj.setSubObject(true);
            this._subObjects.push(obj);
        }
    }
};
Game_Object.prototype.indexToMapIndex = function(index) {
    var ox = this._x - this._center.x;
    var oy = this._y - this._center.y;
    var x = ox + index % this._width;
    var y = oy + index / this._width;
    y = ~~y;
    return x + y * $dataMap.width;
};

Game_Object.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    return Math.round(this.scrolledX() * tw + tw / 2);
};

Game_Object.prototype.screenY = function() {
    var th = $gameMap.tileHeight();;
    return Math.round(this.scrolledY() * th + th - 9);
};

Game_Object.prototype.opacity = function() {
    return this._opacity;
};
/*
 * Z coordinate:
 *
 * 0 : Lower tiles
 * 1 : Lower characters
 * 3 : Normal characters
 * 4 : Upper tiles
 * 5 : Upper characters
 * 6 : Airship shadow
 * 7 : Balloon
 * 8 : Animation
 * 9 : Destination
 */
Game_Object.prototype.scrolledX = function() {
    //var shifter = this._width % 2 === 0 ? 0.5 : 0;
    return $gameMap.adjustX(this._x);
};

Game_Object.prototype.scrolledY = function() {
    return $gameMap.adjustY(this._y);
};

Game_Object.prototype.update = function() {
    //main update
    this.updateOpcaity();
    this.updateDeployment();
    this.updateSubObjects();
};
Game_Object.prototype.updateSubObjects = function() {
    this._subObjects.forEach(function(object) {
        object.update();
    }, this);
};
Game_Object.prototype.updateOpcaity = function() {
    if (this._showCharacterPassing && this._areaRect && 
        this._areaRect.contains($gamePlayer.x, $gamePlayer.y)) {
        this._opacity = 155;
    } else {
        this._opacity = 255;
    }
};
Game_Object.prototype.updateDeployment = function() {
    if (this._deploying) {
        $gameMap.pauseCharacters();
        this.moveByInput();
    }
};
Game_Object.prototype.moveByInput = function() {
    this._movementCounter--;
    if (this._movementCounter <= 0) {
        this._movementCounter = 5;
        switch (this.getInputDirection()) {
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
        }
    }

    if (this.isSubObject()) {
        return;
    }

    if (Input.isTriggered('ok')) {
        if (this.canDeploy()) {
            SoundManager.playOk();
            this.deployAt();
        } else {
            SoundManager.playBuzzer();
            console.log("cannot");
        }
    }

};
Game_Object.prototype.moveStraight = function(d) {
    this._x = $gameMap.roundXWithDirection(this._x, d);
    this._y = $gameMap.roundYWithDirection(this._y, d);
};
Game_Object.prototype.getInputDirection = function() {
    return Input.dir4;
};
Game_Object.prototype.canDeploy = function() {
    var x = 0,
        y = 0,
        mapIndex = 0;
    var ox = this._x - this._center.x;
    var oy = this._y - this._center.y;
    for (var i = this._foundationGrids.length - 1; i >= 0; i--) {
        if (this._foundationGrids[i] === 0) {
            continue;
        }
        x = ox + i % this._width;
        y = oy + i / this._width;
        y = ~~y;
        mapIndex = x + y * $dataMap.width;
        //check layer grid
        if ($gameMap._objectsFoundations[mapIndex] != 0) {
            return false;
        }
    }
    for (var i = this._passableGrids.length - 1; i >= 0; i--) {
        if (this._passableGrids[i] === 0x0f) {
            continue;
        }
        x = ox + i % this._width;
        y = oy + i / this._width;
        y = ~~y;
        if (!$gameMap.checkPassage(x, y, 0x0f)) {
            return false;
        }
    }
    var result = this._subObjects.every(function(subObj) {
        return subObj.canDeploy();
    });
    return result;
};

Game_Object.prototype.deployAt = function() {
    var ox = this._x - this._center.x;
    var oy = this._y - this._center.y;
    this._deploying = false;
    $gameMap.restoreCharacters();
    $gameMap.deployObject(this);
    this._areaRect = new Rectangle(ox, oy, this._width - 1, this._height * 2 / 3);
    //deploy subobjects
    this._subObjects.forEach(function(obj) {
        obj.deployAt();
    });
    //call observer
    this.onObjectDeployed();
};

Game_Object.prototype.setTagDelete = function() {
    this._canDelete = true;
    this.getSubObjects().forEach(function(obj) {
        obj.setTagDelete();
    });
};
Game_Object.prototype.canDelete = function() {
    return this._canDelete;
};

// observers
Game_Object.prototype.onObjectDeployed = function() {

};
Game_Object.prototype.onObjectDestoryed = function() {

};

//=============================================================================
// Game_Construction
//=============================================================================
function Game_Construction() {
    this.initialize.apply(this, arguments);
}

Game_Construction.prototype = Object.create(Game_Object.prototype);
Game_Construction.prototype.constructor = Game_Construction;

Game_Construction.prototype.initialize = function(objectId, x, y) {
    Game_Object.prototype.initialize.call(this, objectId, x, y);

};

Game_Construction.prototype.initMembers = function(objectId, x, y) {
        Game_Object.prototype.initMembers.call(this, objectId, x, y);
        this._maxDurability = 0;
        this._requiredResources = [];
        this._requiredResourcesAmoundt = [];
        this._pointsRecieveMaterial = null;

    }
//=============================================================================
// Game_Resource
//=============================================================================
function Game_Resource() {
    this.initialize.apply(this, arguments);
}

Game_Resource.prototype = Object.create(Game_Object.prototype);
Game_Resource.prototype.constructor = Game_Resource;

Game_Resource.prototype.initialize = function(objectId, x, y) {
    Game_Object.prototype.initialize.call(this, objectId, x, y);

};

Game_Resource.prototype.initMembers = function(objectId, x, y) {
    Game_Object.prototype.initMembers.call(this, objectId, x, y);

}

Game_Resource.prototype.harvest = function() {

};
//=============================================================================
// Game_Map

// data array:
// this._objects
// this._objectsLayer
// this._objectsFoundations

// trigger:
// _isPausingCharacters

//=============================================================================
Game_CoreSystem.Core.Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    this._objects = [];
    this._isPausingCharacters = false;
    Game_CoreSystem.Core.Game_Map_initialize.call(this);

}

Game_CoreSystem.Core.Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    Game_CoreSystem.Core.Game_Map_setup.call(this, mapId);

    this.setupObjects();
    this.setupObjectsLayer();
};

Game_Map.prototype.pauseCharacters = function() {
    this._isPausingCharacters = true;
};

Game_Map.prototype.restoreCharacters = function() {
    this._isPausingCharacters = false;
};

Game_Map.prototype.objects = function() {
    return this._objects.filter(function(obj) {
        return !!obj;
    });
};

Game_Map.prototype.setupObjects = function() {
    this._objects = [];
    this.events().forEach(function(event) {
        event.refresh();
        if (!event.page()) {
            return;
        }
        if (event.list()[0].code !== 108) {
            return;
        }
        if (event.list()[0].parameters[0] === "Object") {
            if (event.list()[1].code !== 408) {
                return;
            }
            var pattern = /\d+/;
            var objID = Number(event.list()[1].parameters[0].match(pattern));
            this._objects.push($gameMap.newObject(objID, event.x, event.y));
            event.erase();
        };

    }, this);
};

Game_Map.prototype.setupObjectsLayer = function() {
    this._objectsLayer = new Array(this.width() * this.height());
    this._objectsFoundations = new Array(this.width() * this.height());
    for (var i = this._objectsLayer.length - 1; i >= 0; i--) {
        this._objectsLayer[i] = 15;
        this._objectsFoundations[i] = 0;
    }
    this._objects.forEach(function(object) {
        var index;
        var tempArray = [object];
        tempArray = tempArray.concat(object.getSubObjects());
        for (var j = 0; j < tempArray.length; j++) {
            for (var i = 0; i < tempArray[j]._passableGrids.length; i++) {
                index = tempArray[j].indexToMapIndex(i);
                this._objectsLayer[index] &= tempArray[j]._passableGrids[i];
                this._objectsFoundations[index] |= tempArray[j]._foundationGrids[i];
            }
        }
    }, this);

};

Game_Map.prototype.newObject = function(objectId, x, y) {
    if (Game_CoreSystem.OBEJECT_ID_TREES.contains(objectId)) {
        return new Game_Resource(objectId, x, y);
    } else if (Game_CoreSystem.OBEJECT_ID_CONSTRUCTIONS.contains(objectId)) {
        return new Game_Construction(objectId, x, y);
    } else {
        throw new Error('No such Object #' + objectId);
    }
};

Game_Map.prototype.makeObject = function(objectId, x, y) {
    var obj = $gameMap.newObject(objectId, x, y);
    this._objects.push(obj);
    SceneManager._scene._spriteset.addObjectSprite(obj);
    return obj;
};

Game_Map.prototype.spawnTreeObject = function(x,y) {
    
};

Game_Map.prototype.deployObject = function(object) {
    var index = 0;
    for (var i = 0; i < object._passableGrids.length; i++) {
        index = object.indexToMapIndex(i);
        this._objectsLayer[index] &= object._passableGrids[i];
        this._objectsFoundations[index] |= object._foundationGrids[i];
    }
};

Game_Map.prototype.eraseObject = function(object) {
    if (typeof(object) === "number") {
        if (!this._objects[object]) {
            return;
        }
        this._objects[object].onObjectDestoryed();
        this._objects[object].setTagDelete();
        this._objects.splice(object, 1);
    } else {
        var index = this._objects.indexOf(object);
        if (index === -1) {
            return;
        }
        object.onObjectDestoryed();
        this._objects[index].setTagDelete();
        this._objects.splice(index, 1);
    }
    SceneManager._scene._spriteset.removeObjectSprites();
    object = null;
};

Game_CoreSystem.Core.Game_Map_isPassable = Game_Map.prototype.isPassable;
Game_Map.prototype.isPassable = function(x, y, d) {
    var width = $dataMap.width;
    return this.checkObjectPassage(x, y, d) &&
        Game_CoreSystem.Core.Game_Map_isPassable.call(this, x, y, d);
};

Game_Map.prototype.checkObjectPassage = function(x, y, d) {
    var width = $dataMap.width;
    return this._objectsLayer[x + width * y] & (1 << (d / 2 - 1));
};

Game_CoreSystem.Core.Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function(sceneActive) {
    Game_CoreSystem.Core.Game_Map_update.call(this, sceneActive);
    this.updateObjects();
};
Game_CoreSystem.Core.Game_Map_updateEvents = Game_Map.prototype.updateEvents;
Game_Map.prototype.updateEvents = function() {
    if (!this._isPausingCharacters) {
        Game_CoreSystem.Core.Game_Map_updateEvents.call(this);
    }
};

Game_Map.prototype.updateObjects = function() {
    this.objects().forEach(function(obj) {
        obj.update();
    });
};
//-----------------------------------------------------------------------------
// Sprite_Object
//---------------------------------------------------------------------------- 
function Sprite_Object() {
    this.initialize.apply(this, arguments);
}

Sprite_Object.prototype = Object.create(Sprite_Base.prototype);
Sprite_Object.prototype.constructor = Sprite_Object;

Sprite_Object.prototype.initialize = function(object, isUpperLayer) {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers(isUpperLayer);
    this.setObject(object);
    //this.createSubSprites(object);
};
Sprite_Object.prototype.initMembers = function(isUpperLayer) {
    this._isUpperLayer = isUpperLayer;
    this._object = null;
    this._subSprites = [];
    //this.tint = Math.random() * 0xFFFFFF;
    //this.blendMode = 7;
};
Sprite_Object.prototype.setObject = function(object) {
    this._object = object;
    var th = $gameMap.tileHeight();
    var tw = $gameMap.tileWidth();
    //set anchor
    this.anchor.x = (object._center.x * tw + tw / 2) / (object._width * tw);
    this.anchor.y = (object._center.y * th + th / 2) / (object._height * th);
};
Sprite_Object.prototype.createSubSprites = function(object) {
    if (this._object.hasSubObjects) {
        var subObj = object.getSubObjects();
        subObj.forEach(function(obj) {
            this.addChild(new Sprite_Object(obj, this._isUpperLayer));
        }, this);
    }
};
Sprite_Object.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updateBitmap();
    this.updateFrame();
    this.updatePosition();
    this.updateOpcaity();

};
Sprite_Object.prototype.updateBitmap = function() {
    if (this.isImageChanged()) {
        this._characterName = this._object.characterName();
        this.setCharacterBitmap();
    }
};
Sprite_Object.prototype.isImageChanged = function() {
    return (this._characterName !== this._object.characterName());
};
Sprite_Object.prototype.setCharacterBitmap = function() {
    this.bitmap = ImageManager.loadObject(this._characterName);
};
Sprite_Object.prototype.updateFrame = function() {
    this.updateCharacterFrame();
};
Sprite_Object.prototype.updateCharacterFrame = function() {
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sy = this._isUpperLayer ? ph : 0;
    this.setFrame(0, sy, pw, ph);
};
Sprite_Object.prototype.patternWidth = function() {
    return this.bitmap.width;
};
Sprite_Object.prototype.patternHeight = function() {
    return this.bitmap.height / 2;
};
Sprite_Object.prototype.updatePosition = function() {
    this.x = this._object.screenX();
    this.y = this._object.screenY();
    this.z = this._isUpperLayer ? 3 : 1;
};
Sprite_Object.prototype.updateOpcaity = function() {
    if (this._isUpperLayer) {
        this.opacity = this._object.opacity();
    }
};
//=============================================================================
// Spriteset_Map
// sprites array:
// this._objectLowerLayerSprites
// this._objectUpperLayerSprites
//=============================================================================
Game_CoreSystem.Core.Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
    Game_CoreSystem.Core.Spriteset_Map_createLowerLayer.call(this);
    this.createObjects();
};
Spriteset_Map.prototype.createObjects = function() {
    this._objectLowerLayerSprites = [];
    this._objectUpperLayerSprites = [];

    $gameMap.objects().forEach(function(obj) {
        this.addObjectSprite(obj);
    }, this);

};
//SceneManager._scene._spriteset.addObjectSprite
Spriteset_Map.prototype.addObjectSprite = function(object) {
    var sprite1 = new Sprite_Object(object, false);
    var sprite2 = new Sprite_Object(object, true);
    this._objectLowerLayerSprites.push(sprite1);
    this._objectUpperLayerSprites.push(sprite2);
    this._tilemap.addChild(sprite1);
    this._tilemap.addChild(sprite2);

    object.getSubObjects().forEach(function(obj) {
        var sprite1 = new Sprite_Object(obj, false);
        var sprite2 = new Sprite_Object(obj, true);
        this._objectLowerLayerSprites.push(sprite1);
        this._objectUpperLayerSprites.push(sprite2);
        this._tilemap.addChild(sprite1);
        this._tilemap.addChild(sprite2);
    }, this)
};
Spriteset_Map.prototype.removeObjectSprites = function() {
    this._objectLowerLayerSprites.forEach(function(sprite) {
        if (sprite._object.canDelete()) {
            this._tilemap.removeChild(sprite);
            sprite = null;
        }
    },this);
    this._objectUpperLayerSprites.forEach(function(sprite) {
        if (sprite._object.canDelete()) {
            this._tilemap.removeChild(sprite);
            sprite = null;
        }
    },this);
    this._objectLowerLayerSprites = this._objectLowerLayerSprites.filter(function(sprite) {
        return !sprite._object.canDelete();
    });
    this._objectUpperLayerSprites = this._objectUpperLayerSprites.filter(function(sprite) {
        return !sprite._object.canDelete();
    });

};

//=============================================================================
// End of File
//=============================================================================