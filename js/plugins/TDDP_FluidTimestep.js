//=============================================================================
// TDDP_FluidTimestep
// Version: 1.0.2
//=============================================================================
var Imported = Imported || {};
Imported.TDDP_FluidTimestep = "1.0.2";
/*:
 * @plugindesc 1.0.2 Fixes MV's framerate dependent timestepping. Makes the gamespeed the same regardless of framerate.
 * @author Tor Damian Design / Galenmereth
 *
 * @help =~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~
 * Information
 * =~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~
 * For updates and easy to use documentation, please go to the plugin's website:
 * http://mvplugins.tordamian.com/?p=437
 *
 * This plugin replaces MV's update loop with a semi-fixed timestep solution based
 * on http://gafferongames.com/game-physics/fix-your-timestep/
 *
 * This makes the game run at normal speed (animation, movement, and anything else)
 * regardless of framerate. By default, MV run on a 144hz monitor would run at
 * 144fps and everything would move at 2,4 times normal speed. Likewise, if
 * someone ran the game and only managed 30fps, everything would move at half
 * normal speed.
 *
 * This solution decouples visual updates from logic updates so that the latter
 * always occur at 60 times per second, while frames get updated as fast as the
 * user's computer can display it.
 *
 * There you can also download a PDF of the documentation for offline use, and
 * having the documentation in one cleanly presented place means you can always
 * be sure it's the most recent available.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Terms & Conditions
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * This plugin is free for both non-commercial and commercial use. Please see
 * http://mvplugins.tordamian.com/terms-of-use for the full terms of use.
 */

(function(){
    /**
    * Get current world time in ms
    *
    * @method getTimeInMs()
    */
    SceneManager.getTimeInMs = function() {
        return performance.now();
    };

    /**
    * This is the passed logic update time, useful for other plugins
    *
    * @var _t
    */
    SceneManager._t = 0.0;

    /**
    * The delta time for logic updates, set to 1/60th of a second. Since MV bases all
    * its logic on a 60fps frame update, this is the best solution.
    *
    * @var _dt
    */
    SceneManager._dt = 1.0 / 60.0;

    /**
    * The current time in milliseconds
    *
    * @var _currentTime
    */
    SceneManager._currentTime = SceneManager.getTimeInMs();

    /**
    * The frame accumulator, for when the framerate is faster than the logic should update
    *
    * @var _accumulator
    */
    SceneManager._accumulator = 0.0;

    /**
    * CHANGED The frame update
    */
    SceneManager.update = function() {
        try {
            this.tickStart();
            // this.updateInputData(); REMOVED - We need to fetch input on scene update instead, in the new rewritten updateMain()
            this.updateMain();
            this.tickEnd();
        } catch (e) {
            this.catchException(e);
        }
    };

    /**
    * CHANGED The main update function
    */
    SceneManager.updateMain = function() {

        var newTime = this.getTimeInMs();
        var frameTime = (newTime - this._currentTime) / 1000;
        if (frameTime > 0.25) frameTime = 0.25;
        this._currentTime = newTime;

        this._accumulator += frameTime;

        while (this._accumulator >= this._dt) {
            this.updateInputData(); // While the frame accumulator is greater than the logic update delta, we keep updating the game's logic and catching input
            this.changeScene();
            this.updateScene();
            this._accumulator -= this._dt;
            this._t += this._dt;
        }

        this.renderScene();
        this.requestUpdate();
    }
})();
