//=============================================================================
// Mount Blade Battle System Engine Plugins - Instant Message Plugins
// MBBS_InstantMessage.js
//=============================================================================
/*:
 * @plugindesc v1.1 Instant Message Plugins 
   群战系统MV插件系列之 - 即时消息系统 【XP移植】
 * @author Chivalry Studio Plugins / Ivan

 * @param ---Notification---
 * @default 

 * @param MaxLimit
 * @desc 最多显示多少条消息
 * Default: 12
 * @default 12
 * @param Delay
 * @desc 显示多少秒后才消失(单位秒)
 * Default: 3
 * @default 3
 * @param DisappearSpeed
 * @desc 消失速度 (越大越快);
 * Default: 5
 * @default 5
 * @param InitialX
 * @desc 初始位置X坐标(显示区域左上角X坐标)
 * Default: 0
 * @default 0
 * @param InitialY
 * @desc 初始位置Y坐标(显示区域左上角Y坐标)
 * Default: 312
 * @default 312
 * @param Width
 * @desc 显示区域宽度
 * Default: 272
 * @default 272
 * @param Height
 * @desc 显示区域高度
 * Default: 312
 * @default 312

 * @param ---Font Data---
 * @default 
 * @param FontFace
 * @desc 字体名
 * Default: GameFont
 * @default GameFont
 * @param FontSize
 * @desc 字体大小
 * Default: 28
 * @default 28
 * @param TextColor
 * @desc 字体颜色
 * Default: #ffffff
 * @default #ffffff

* @help 
* --------------------------------------------------------------------------------
* Free for non commercial use.
* Version 1.1
* --------------------------------------------------------------------------------
* Mount Blade Battle System Engine Plugins - Instant Message Plugins 
  群战系统MV插件系列之 - 即时消息系统 【移植】
  本系统原为XP即时消息系统脚本 by: 英顺的马甲
  在下觉得这个系统写的很好，于是将这个系统翻译成了MV版本。
  在下并非原作者，在下是编辑者。
    
* --------------------------------------------------------------------------------
* How to use: 使用方法
* --------------------------------------------------------------------------------

    mes (String) the Message.             [Required]
    必填，字符串。想要发送的消息
    color (String) for example: '#ffff00' [Optional]
    选填，字符串，字体颜色。默认为系统颜色
    size (Number) font Size.              [Optional]
    选填，数字，字体大小。默认为系统字体大小
    Notification.post(msg, color, size);
    发一条消息。

    x: (Number) 移动目的地X坐标  [Required]
    y: (Number) 移动目的地Y坐标  [Required]
    width: (Number) 移动后宽度   [Required]
    height:(Number) 移动后高度   [Required]
    Notification.move(x,y,width,height);
    移动消息显示区域到x,y，width, height

    Notification.clear(); 
    清空消息

    Notification.show();
    开启消息显示

    Notification.hide(); 
    关闭消息显示

    Notification.pause(); 
    暂停消息显示

    Notification.restore();
    恢复消息显示

* --------------------------------------------------------------------------------
* Version History
* --------------------------------------------------------------------------------
* 
* 1.1 - [2017-5-26]
*    修复调出菜单后信息栏不再显示的BUG
*    Fixed bug: after calling menu, the notification window will no longer display
*
* 1.0 - [2016-4-6]
*    正式发布
*    Release
*
*/

var Imported = Imported || {};
Imported.MBBS_InstantMessage = true;
var MBBS_MV = MBBS_MV || {};
MBBS_MV.InstantMessage = MBBS_MV.InstantMessage || {};

//=============================================================================
// Parameter Variables
//=============================================================================
MBBS_MV.Parameters = PluginManager.parameters('MBBS_InstantMessage');
MBBS_MV.Param = MBBS_MV.Param || {};
//notification data
MBBS_MV.Param.MaxLimit          = Number(MBBS_MV.Parameters['MaxLimit']);
MBBS_MV.Param.Delay             = Number(MBBS_MV.Parameters['Delay']);
MBBS_MV.Param.DisappearSpeed    = Number(MBBS_MV.Parameters['DisappearSpeed']);
MBBS_MV.Param.InitialX          = Number(MBBS_MV.Parameters['InitialX']);
MBBS_MV.Param.InitialY          = Number(MBBS_MV.Parameters['InitialY']);
MBBS_MV.Param.Width             = Number(MBBS_MV.Parameters['Width']);
MBBS_MV.Param.Height            = Number(MBBS_MV.Parameters['Height']);
//font data
MBBS_MV.Param.FontFace          = String(MBBS_MV.Parameters['FontFace']);
MBBS_MV.Param.FontSize          = Number(MBBS_MV.Parameters['FontSize']);
MBBS_MV.Param.TextColor         = String(MBBS_MV.Parameters['TextColor']);

//=============================================================================
// Plugin commands -- Game_Interpreter
//=============================================================================
// MBBS_MV.InstantMessage.Game_Interpreter_pluginCommand =
// Game_Interpreter.prototype.pluginCommand;
// Game_Interpreter.prototype.pluginCommand = function(command, args) {
//     MBBS_MV.InstantMessage.Game_Interpreter_pluginCommand.call(this, command, args);
//     if (command == "") {}


// };
//=============================================================================
// Notification
//=============================================================================
function Notification() {
    throw new Error('This is a static class');
};

Notification.FRAME_PER_SECOND = 60;

Notification.initMember = function() {
    this._msg = null;
    this._limit          = MBBS_MV.Param.MaxLimit;
    this._delay          = MBBS_MV.Param.Delay;
    this._disappearSpeed = MBBS_MV.Param.DisappearSpeed;
    this._opacity = 0;
    this._pause = false;
    this._count = this._delay * this.FRAME_PER_SECOND;
    this._sprite = new Sprite();
    this._sprite.bitmap = new Bitmap(1,1);
    this._sprite.z = 99999;
    this._hasInitalized = false;
};

Notification.initialize = function() {
    this._hasInitalized = true;
    Notification.move(
        MBBS_MV.Param.InitialX,
        MBBS_MV.Param.InitialY,
        MBBS_MV.Param.Width,
        MBBS_MV.Param.Height
        );
}

Object.defineProperty(Notification, 'opacity', {
    get: function() {
        return this._opacity;
    },
    set: function(opacity) {
        this._opacity = opacity;
        this._sprite.opacity = opacity;
    },
    configurable: true
});

Notification.setFont = function(fontFace,fontSize,textColor) {
    this._sprite.bitmap.fontFace           = fontFace;
    this._sprite.bitmap.fontSize           = fontSize;
    this._sprite.bitmap.textColor          = textColor;
};

Notification.move = function(x,y,width,height) {
    this._sprite.x = x;
    this._sprite.y = y;
    this._sprite.z = 99999;
    this._sprite.bitmap = new Bitmap(width, height);
    this.refresh();
};

Notification.refresh = function () {
    SceneManager._scene.addChild(this._sprite);
    if ($gameSystem != null) {
        this.redraw();
    } 
};

Notification.setLimit = function(max){
    this._limit = max;
};

Notification.post = function(msg, color, size) {
    if (this._pause) {
        return;
    }
    if (!this._hasInitalized) {
        this.initialize();
    }
    // creating message node and push it to $gameSystem.notifications
    var node = new Notification_Message(msg.slice(0), color,size);
    $gameSystem.notifications.push(node);
    // shift when reach max display
    while($gameSystem.notifications.length > this._limit){
        $gameSystem.notifications.shift();
    }
    if ($gameSystem != null) {
        this.redraw();
    }
    //reset counter to and to display the message
    this._count = this._delay * this.FRAME_PER_SECOND;
    this.opacity = 255;

};

Notification.clear = function () {
    $gameSystem.notifications = [];
    this.redraw();
};
/**
*   Draw the nodes stored in the gameSystem Array
*/
Notification.redraw = function () {
    var b = this._sprite.bitmap;
    b.clear();
    var b2 = new Bitmap(b.width,Graphics.boxHeight);
    var y = b.height;
    var self = this;
    $gameSystem.notifications.slice().reverse().slice(0,this._limit).forEach(function(n) {
        var x = 0;
        var y2 = 0;
        var h = n.size; 
        b2.textColor = n.color;
        b2.fontSize = n.size;
       n.msg.split('').forEach(function(char) {
            if (x + b2.measureTextWidth(char) > b2.width) {
                x = 0;
                y2 += h;
            }
            b2.drawText(char,x,y2,b2.width,h,'left');
            x += b2.measureTextWidth(char) + 2;
        });
        y -= (y2+h);
        b.blt(b2, 0, 0, b2.width, y2 + h, 0 , y, b2.width, y2 + h);
        b2.clear();
        y -= 4;
    });
};

Notification.update = function () {
    if (this._count > 0) {
        this._count -= 1;
        return;
    }
    if (this.opacity > 0) {
        this.opacity -= this._disappearSpeed;
    }
};

Notification.show = function () {
    this._sprite.visible = true;
    this.refresh();
};

Notification.hide = function () {
    this._sprite.visible = false;
};

Notification.pause = function () {
    this._pause = true;
};

Notification.restore = function () {
    this._pause = false;
};

Notification.setDelay = function (delay) {
    this._delay = delay;
};
//=============================================================================
// Notification Message
//=============================================================================
function Notification_Message() {
    this.initialize.apply(this, arguments);
}

Notification_Message.prototype.initialize = function(msg, color,size) {
    this._msg = msg == null ? '' : msg;
    this._color = color;
    this._size = size;
    if (color == null) {
        this._color = MBBS_MV.Param.TextColor;
    }
    if (size == null) {
        this._size = MBBS_MV.Param.FontSize;
    }
};

Object.defineProperties(Notification_Message.prototype, {
    msg:        { get: function() { return this._msg;       }, configurable: true},
    color:      { get: function() { return this._color;     }, configurable: true},
    size:       { get: function() { return this._size;      }, configurable: true}, 
});

//=============================================================================
// Game_System
//=============================================================================
MBBS_MV.InstantMessage.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    MBBS_MV.InstantMessage.Game_System_initialize.call(this);
    this._notifications = [];
};

Object.defineProperty(Game_System.prototype, 'notifications', {
    get: function() {
        return this._notifications;
    },
    set: function(arr) {
        this._notifications = [];
    },
    configurable: true
});

//=============================================================================
// Scene_Map
//=============================================================================
MBBS_MV.InstantMessage.Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    MBBS_MV.InstantMessage.Scene_Map_update.call(this);
    Notification.update();
};

MBBS_MV.InstantMessage.Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    MBBS_MV.InstantMessage.Scene_Map_start.call(this);
    Notification.show();
};

MBBS_MV.InstantMessage.Scene_Map_stop = Scene_Map.prototype.stop;
Scene_Map.prototype.stop = function() {
    MBBS_MV.InstantMessage.Scene_Map_stop.call(this);
    Notification.hide();
};
//=============================================================================
// Scene_EFS_Battle
//=============================================================================
if (Imported.MBBS_MV) {

    MBBS_MV.InstantMessage.Scene_EFS_Battle_update = Scene_EFS_Battle.prototype.update;
    Scene_EFS_Battle.prototype.update = function() {
        MBBS_MV.InstantMessage.Scene_EFS_Battle_update.call(this);
        Notification.update();
    };

    MBBS_MV.InstantMessage.Scene_EFS_Battle_start = Scene_EFS_Battle.prototype.start;
    Scene_EFS_Battle.prototype.start = function() {
        MBBS_MV.InstantMessage.Scene_EFS_Battle_start.call(this);
        Notification.show();
    };

    MBBS_MV.InstantMessage.Scene_EFS_Battle_stop = Scene_EFS_Battle.prototype.stop;
    Scene_EFS_Battle.prototype.stop = function() {
        MBBS_MV.InstantMessage.Scene_EFS_Battle_stop.call(this);
        Notification.hide();
    };
}

// ======================================================================
// Game_Temp
// ======================================================================
MBBS_MV.InstantMessage.Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    MBBS_MV.InstantMessage.Game_Temp_initialize.call(this);
    Notification.initMember();
};

//=============================================================================
// End of File
//=============================================================================