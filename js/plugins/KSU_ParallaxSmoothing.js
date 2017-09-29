 /*:
 * @plugindesc Fixes the blurring for parallax backgrounds if a non-power of 2 background is used. 
 * @help Fixes the blurring for parallax backgrounds if a non-power of 2 background is 
 * used. However, there can be still a small loss in quality. To fix that, 
 * it would be probably necessary to change the way how TilingSprite is 
 * created and rendered, but thats not covered by this plugin since 
 * its probably better to update PIXI.js version.
 *
 * You can also just use a parallax where the size is power of 2 
 * like 512x512 or 512x1024.
 *
 * @author Kentou
 *
 * @param Parallax Smoothing
 * @desc Enabled/Disables the parallax smoothing.
 * OFF - false     ON - true
 * Default: OFF
 * @default false
 */ 

var KSU = KSU || {}
KSU.Parameters = PluginManager.parameters('KSU_ParallaxSmoothing');
KSU.SmoothingEnabled = JSON.parse(KSU.Parameters['Parallax Smoothing']);

/*
* KSU: Lets patch this method to enable/disable the canvas image smoothing when the parallax is streched
* into the next power of 2 frame.
*/
TilingSprite.prototype.generateTilingTexture = function(forcePowerOfTwo)
{
    if (!this.texture.baseTexture.hasLoaded) return;
 
    var texture = this.originalTexture || this.texture;
    var frame = texture.frame;
    var targetWidth, targetHeight;
 
    var isFrame = frame.width !== texture.baseTexture.width || frame.height !== texture.baseTexture.height;
 
    var newTextureRequired = false;
 
    if (!forcePowerOfTwo)
    {
        if (isFrame)
        {
            targetWidth = frame.width;
            targetHeight = frame.height;
           
            newTextureRequired = true;
        }
    }
    else
    {
        targetWidth = PIXI.getNextPowerOfTwo(frame.width);
        targetHeight = PIXI.getNextPowerOfTwo(frame.height);
 
        if (frame.width !== targetWidth || frame.height !== targetHeight) newTextureRequired = true;
    }
 
    if (newTextureRequired)
    {
        var canvasBuffer;
 
        if (this.tilingTexture && this.tilingTexture.isTiling)
        {
            canvasBuffer = this.tilingTexture.canvasBuffer;
            canvasBuffer.resize(targetWidth, targetHeight);
            this.tilingTexture.baseTexture.width = targetWidth;
            this.tilingTexture.baseTexture.height = targetHeight;
            this.tilingTexture.needsUpdate = true;

            /*
            * KSU: Lets set the texture filter to NEAREST to avoid that the texture gets
            * blurry if scaled back.
            */
            this.tilingTexture.scaleMode = KSU.SmoothingEnabled ? PIXI.scaleModes.LINEAR : PIXI.scaleModes.NEAREST;
        }
        else
        {
            canvasBuffer = new PIXI.CanvasBuffer(targetWidth, targetHeight);
 
            this.tilingTexture = PIXI.Texture.fromCanvas(canvasBuffer.canvas, KSU.SmoothingEnabled ? PIXI.scaleModes.LINEAR : PIXI.scaleModes.NEAREST);
            this.tilingTexture.canvasBuffer = canvasBuffer;
            this.tilingTexture.isTiling = true;

            /*
            * KSU: Lets set the texture filter to NEAREST to avoid that the texture gets
            * blurry if scaled back.
            */
            this.tilingTexture.scaleMode = KSU.SmoothingEnabled ? PIXI.scaleModes.LINEAR : PIXI.scaleModes.NEAREST;
        }
 
        /*
        * KSU: Ok, lets disable the image smoothing before strechting to avoid blurring.
        */
        canvasBuffer.context.imageSmoothingEnabled = KSU.SmoothingEnabled
        canvasBuffer.context.webkitImageSmoothingEnabled = KSU.SmoothingEnabled
        canvasBuffer.context.mozImageSmoothingEnabled = KSU.SmoothingEnabled
        canvasBuffer.context.drawImage(texture.baseTexture.source,
                               texture.crop.x,
                               texture.crop.y,
                               texture.crop.width,
                               texture.crop.height,
                               0,
                               0,
                               targetWidth,
                               targetHeight);

        this.tileScaleOffset.x = frame.width / targetWidth;
        this.tileScaleOffset.y = frame.height / targetHeight;
    }
    else
    {
        if (this.tilingTexture && this.tilingTexture.isTiling)
        {
            this.tilingTexture.destroy(true);
        }
 
        this.tileScaleOffset.x = 1;
        this.tileScaleOffset.y = 1;
        this.tilingTexture = texture;
    }
 
    this.refreshTexture = false;
    
    this.originalTexture = this.texture;
    this.texture = this.tilingTexture;
    
    this.tilingTexture.baseTexture._powerOf2 = true;
};
