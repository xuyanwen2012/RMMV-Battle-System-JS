//=============================================================================
// InputExtra.js
//=============================================================================

/*:
 * @plugindesc Extend Input with the full keyboard.
 * @author taroxd
 *
 * @help
 *
 * API:
 *   InputExtra.isPressed(keyCode)
 *   InputExtra.isTriggered(keyCode)
 *   InputExtra.isRepeated(keyCode)
 *   InputExtra.isLongPressed(keyCode)
 *
 *   `InputExtra' is basically the same as `Input'
 *   except that it accepts the keyCode as a parameter.
 */

window.InputExtra = function() {

    var states = {};

    function appendToInput(name, func) {
        var old = Input[name];
        Input[name] = function() {
            old.apply(Input, arguments);
            func.apply(null, arguments);
        }
    }

    function onKeyDown(event) {
        var keyCode = event.keyCode;
        if(!states[keyCode]) {
            states[keyCode] = 0;
        }
    }

    function onKeyUp(event) {
        var keyCode = event.keyCode;
        if (keyCode) {
            delete states[keyCode];
        }
    }

    function clear() {
        states = {};
    }

    function update() {
        for (var code in states) {
            ++states[code];
        }
    }

    appendToInput('_onKeyDown', onKeyDown);
    appendToInput('_onKeyUp', onKeyUp);
    appendToInput('_onLostFocus', clear);

    appendToInput('update', update);
    appendToInput('clear', clear);

    return {
        isPressed: function(keyCode) {
            return states[keyCode] != null;
        },

        isTriggered: function(keyCode) {
            return states[keyCode] === 1;
        },

        isRepeated: function(keyCode) {
            var state = states[keyCode];
            return (state === 1 ||
                (state >= Input.keyRepeatWait &&
                state % Input.keyRepeatInterval === 0));
        },

        isLongPressed: function(keyCode) {
            return states[keyCode] >= Input.keyRepeatWait;
        }
    };

}();