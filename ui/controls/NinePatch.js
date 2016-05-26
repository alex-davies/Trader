var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "pixi.js", "../../util/Util"], function (require, exports, PIXI, Util_1) {
    "use strict";
    var Sprite = PIXI.Sprite;
    var NinePatch = (function (_super) {
        __extends(NinePatch, _super);
        function NinePatch() {
            var _this = this;
            _super.call(this);
            this.patchSprites = [];
            this.totalStretchableWidth = 0;
            this.totalFixedWidth = 0;
            this.totalStretchableHeight = 0;
            this.totalFixedHeight = 0;
            this._paddingTop = 0;
            this._paddingRight = 0;
            this._paddingBottom = 0;
            this._paddingLeft = 0;
            //add our content, this should always be the last child
            //we will also listen to new children on our content and
            //relayout, new children usually mean the size will change
            this.content = _super.prototype.addChild.call(this, new PIXI.Container());
            this.content.onChildrenChange = function () {
                _this.relayout();
            };
        }
        Object.defineProperty(NinePatch.prototype, "paddingTop", {
            get: function () { return this._paddingTop; },
            set: function (value) {
                this.setPadding(value, this._paddingRight, this._paddingBottom, this._paddingLeft);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NinePatch.prototype, "paddingRight", {
            get: function () { return this._paddingRight; },
            set: function (value) {
                this.setPadding(this._paddingTop, value, this._paddingBottom, this._paddingLeft);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NinePatch.prototype, "paddingBottom", {
            get: function () { return this._paddingBottom; },
            set: function (value) {
                this.setPadding(this._paddingTop, this._paddingRight, value, this._paddingLeft);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NinePatch.prototype, "paddingLeft", {
            get: function () { return this._paddingLeft; },
            set: function (value) {
                this.setPadding(this._paddingTop, this._paddingRight, this._paddingBottom, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NinePatch.prototype, "patches", {
            get: function () { return this._patches; },
            set: function (patches) {
                this.loadFromPatchArray(patches);
            },
            enumerable: true,
            configurable: true
        });
        NinePatch.prototype.setPadding = function (paddingTop, paddingRight, paddingBottom, paddingLeft) {
            this._paddingTop = paddingTop;
            this._paddingRight = paddingRight;
            this._paddingBottom = paddingBottom;
            this._paddingLeft = paddingLeft;
            this.relayout();
            return this;
        };
        NinePatch.prototype.loadFromPatchArray = function (patches) {
            var _this = this;
            this._patches = patches;
            //textures changed so remove all sprites except our content
            if (this.children.length > 1)
                _super.prototype.removeChildren.call(this, 0, this.children.length - 1);
            this.patchSprites = [];
            this.patchRowCount = patches.length;
            this.patchColCount = patches.length === 0 ? 0 : patches[0].length;
            //All rows must have same number of pathces
            for (var row = 0; row < this.patchRowCount; row++) {
                var colsInRow = patches[row].length;
                if (colsInRow != this.patchColCount)
                    throw Error("All rows must have the same number of patches");
            }
            //to continue our processing we need to wait till all the textures are loaded.
            //if any one texture errors, or is not loading we will not show any border
            var patchesToLoad = this.patchRowCount * this.patchColCount;
            var markOnePatchLoaded = function () {
                if (--patchesToLoad <= 0)
                    _this.processLoadedTextures(patches);
            };
            var forgetAboutLoadingImages = function () {
                console.error("Failed to load NinePatch texture, keeping all images hidden", this);
                for (var row = 0; row < this.patchRowCount; row++) {
                    for (var col = 0; col < this.patchColCount; col++) {
                        var patch = patches[row][col];
                        patch.baseTexture.off("loaded", markOnePatchLoaded);
                        patch.baseTexture.off("error", forgetAboutLoadingImages);
                    }
                }
            };
            for (var row = 0; row < this.patchRowCount; row++) {
                for (var col = 0; col < this.patchColCount; col++) {
                    var patch = patches[row][col];
                    var baseTexture = patch.baseTexture;
                    if (baseTexture.hasLoaded) {
                        markOnePatchLoaded();
                    }
                    else if (baseTexture.isLoading) {
                        baseTexture.once("loaded", markOnePatchLoaded);
                        baseTexture.once("error", forgetAboutLoadingImages);
                    }
                    else {
                        //not loaded and not going to, will clean up
                        //and forgot about showing any image
                        forgetAboutLoadingImages();
                        //Hacky double break;
                        row = this.patchRowCount;
                        col = this.patchColCount;
                    }
                }
            }
            return this;
        };
        NinePatch.prototype.loadFromAndroidImage = function (android9PatchImage) {
            var _this = this;
            var baseTexture = android9PatchImage.baseTexture;
            if (baseTexture.hasLoaded) {
                var data = NinePatch.ExtractDataFromAndroidImageFormatWithLoadedTexture(android9PatchImage);
                this.loadFromPatchArray(data.textures);
                this.setPadding(data.paddingTop, data.paddingRight, data.paddingBottom, data.paddingLeft);
            }
            else if (baseTexture.isLoading) {
                baseTexture.once("loaded", function () {
                    var data = NinePatch.ExtractDataFromAndroidImageFormatWithLoadedTexture(android9PatchImage);
                    _this.loadFromPatchArray(data.textures);
                    _this.setPadding(data.paddingTop, data.paddingRight, data.paddingBottom, data.paddingLeft);
                });
            }
            return this;
        };
        NinePatch.prototype.processLoadedTextures = function (patches) {
            //All patches in a row should have the same height
            for (var row = 0; row < this.patchRowCount; row++) {
                var rowHeight = this.patchColCount > 0 ? patches[row][0].height : 0;
                for (var col = 0; col < this.patchColCount; col++) {
                    if (rowHeight !== patches[row][col].height)
                        throw Error("All patches in a row must have the same height");
                }
            }
            //All patches in a column must have the same width
            for (var col = 0; col < this.patchColCount; col++) {
                var colWidth = this.patchRowCount > 0 ? patches[0][col].width : 0;
                for (var row = 0; row < this.patchRowCount; row++) {
                    if (colWidth !== patches[row][col].width)
                        throw Error("All patches in a column must have the same width");
                }
            }
            //we need to determine how much of the width is stretchable and how much is fixed
            this.totalStretchableWidth = 0;
            this.totalFixedWidth = 0;
            if (this.patchRowCount > 0) {
                for (var col = 0; col < this.patchColCount; col++) {
                    var width = patches[0][col].width;
                    var stretchX = col % 2 == 1;
                    if (stretchX)
                        this.totalStretchableWidth += width;
                    else
                        this.totalFixedWidth += width;
                }
            }
            //we need to determine how much of the height is stretchable and how much is fixed
            this.totalStretchableHeight = 0;
            this.totalFixedHeight = 0;
            if (this.patchColCount > 0) {
                for (var row = 0; row < this.patchRowCount; row++) {
                    var height = patches[row][0].height;
                    var stretchY = row % 2 == 1;
                    if (stretchY)
                        this.totalStretchableHeight += height;
                    else
                        this.totalFixedHeight += height;
                }
            }
            //Convert our textures into sprites, removing everything but the content
            if (this.children.length > 1)
                _super.prototype.removeChildren.call(this, 0, this.children.length - 1);
            this.patchSprites = new Array(this.patchRowCount);
            for (var row = 0; row < this.patchRowCount; row++) {
                this.patchSprites[row] = new Array(this.patchColCount);
                for (var col = 0; col < this.patchColCount; col++) {
                    var sprite = _super.prototype.addChildAt.call(this, new Sprite(patches[row][col]), 0); //insert the sprite before the content
                    this.patchSprites[row][col] = sprite;
                    sprite.anchor.set(0, 0);
                }
            }
            this.relayout();
        };
        NinePatch.prototype.relayout = function () {
            this.content.x = this.paddingLeft;
            this.content.y = this.paddingTop;
            if (this.renderRect != null) {
                var childRenderRect_1 = this.childRenderRect();
                this.content.children.forEach(function (child) {
                    Util_1.default.TrySetRenderRect(child, childRenderRect_1);
                });
            }
            var targetWidth = this.content.width + this.paddingLeft + this.paddingRight;
            var targetHeight = this.content.height + this.paddingTop + this.paddingBottom;
            //we wont let the target height be smaller than the original 9patches
            targetWidth = Math.max(targetWidth, this.totalFixedWidth + this.totalStretchableWidth);
            targetHeight = Math.max(targetHeight, this.totalFixedHeight + this.totalStretchableHeight);
            var runningYOffset = 0;
            for (var row = 0; row < this.patchSprites.length; row++) {
                var stretchY = row % 2 === 1;
                var runningXOffset = 0;
                for (var col = 0; col < this.patchSprites[row].length; col++) {
                    var stretchX = col % 2 === 1;
                    //stretch our image appropriatly
                    var sprite = this.patchSprites[row][col];
                    if (stretchX) {
                        sprite.width = sprite.texture.width / this.totalStretchableWidth * (targetWidth - this.totalFixedWidth);
                    }
                    if (stretchY) {
                        sprite.height = sprite.texture.height / this.totalStretchableHeight * (targetHeight - this.totalFixedHeight);
                    }
                    //position our sprite
                    sprite.x = runningXOffset;
                    sprite.y = runningYOffset;
                    runningXOffset += sprite.width;
                }
                runningYOffset += this.patchColCount > 0 ? this.patchSprites[row][0].height : 0;
            }
        };
        NinePatch.prototype.setRenderRect = function (rect) {
            this.renderRect = rect;
            this.relayout();
        };
        NinePatch.prototype.childRenderRect = function () {
            return {
                x: 0,
                y: 0,
                width: this.renderRect.width - this.paddingLeft - this.paddingRight,
                height: this.renderRect.height - this.paddingTop - this.paddingBottom
            };
        };
        Object.defineProperty(NinePatch.prototype, "contentChildren", {
            get: function () {
                //the children array is the only thing I cant forward requests as PIXI uses it internally
                //so when dealing with a NinePatch you should not access children array, instad access
                //the contentChildren array
                return this.content.children;
            },
            set: function (children) {
                this.content.children = children;
            },
            enumerable: true,
            configurable: true
        });
        NinePatch.prototype.addChild = function (child) {
            return this.content.addChild.apply(this.content, arguments);
        };
        NinePatch.prototype.addChildAt = function (child, index) {
            return this.content.addChildAt.apply(this.content, arguments);
        };
        NinePatch.prototype.swapChildren = function (child, child2) {
            return this.content.swapChildren.apply(this.content, arguments);
        };
        NinePatch.prototype.getChildIndex = function (child) {
            return this.content.getChildIndex.apply(this.content, arguments);
        };
        NinePatch.prototype.setChildIndex = function (child, index) {
            return this.content.setChildIndex.apply(this.content, arguments);
        };
        NinePatch.prototype.getChildAt = function (index) {
            return this.content.getChildAt.apply(this.content, arguments);
        };
        NinePatch.prototype.removeChild = function (child) {
            return this.content.removeChild.apply(this.content, arguments);
        };
        NinePatch.prototype.removeChildAt = function (index) {
            return this.content.removeChildAt.apply(this.content, arguments);
        };
        NinePatch.prototype.removeChildren = function (beginIndex, endIndex) {
            return this.content.removeChildren.apply(this.content, arguments);
        };
        NinePatch.ExtractDataFromAndroidImageFormatWithLoadedTexture = function (android9PatchImage) {
            //try and get hte data out of a cache first, processing these images is not cheap
            var cacheKey = android9PatchImage.baseTexture.imageUrl + "?" + [
                "x=" + android9PatchImage.frame.x,
                "y=" + android9PatchImage.frame.y,
                "width=" + android9PatchImage.frame.width,
                "heigh=" + android9PatchImage.frame.height
            ].join("&");
            var cacheValue = this.AndroidNinePatchDataCache[cacheKey];
            if (cacheValue)
                return cacheValue;
            //we cant access Texture pixel data directly, but we can draw it out to a canvas
            //and access it there
            var canvasRenderer = new PIXI.CanvasRenderer(android9PatchImage.width, android9PatchImage.height, { transparent: true });
            canvasRenderer.render(new PIXI.Sprite(android9PatchImage));
            var ctx = canvasRenderer.context;
            var horizontalPixelData = ctx.getImageData(0, 0, android9PatchImage.width, 1).data;
            var horizontalMarkers = this.CalculateMarkers(horizontalPixelData, 1, 1);
            var verticalPixelData = ctx.getImageData(0, 0, 1, android9PatchImage.height).data;
            var verticalMarkers = this.CalculateMarkers(horizontalPixelData, 1, 1);
            var horizontalPaddingPixelData = ctx.getImageData(0, android9PatchImage.height - 1, android9PatchImage.width, 1).data;
            var horizontalPaddingMarkers = this.CalculateMarkers(horizontalPaddingPixelData, 1, 1);
            if (horizontalPaddingMarkers.length < 4)
                horizontalPaddingMarkers = horizontalMarkers;
            var verticalPaddingPixelData = ctx.getImageData(android9PatchImage.width - 1, 0, 1, android9PatchImage.height).data;
            var verticalPaddingMarkers = this.CalculateMarkers(verticalPaddingPixelData, 1, 1);
            if (verticalPaddingMarkers.length < 4)
                verticalPaddingMarkers = verticalMarkers;
            //we can now turn our horizontal and vertical markers into rectangle frames
            //on the orignal base image
            var textures = new Array(verticalMarkers.length - 1);
            for (var vMarkerIndex = 0; vMarkerIndex < verticalMarkers.length - 1; vMarkerIndex++) {
                textures[vMarkerIndex] = new Array(horizontalMarkers.length - 1);
                for (var hMarkerIndex = 0; hMarkerIndex < horizontalMarkers.length - 1; hMarkerIndex++) {
                    var rect = new PIXI.Rectangle(horizontalMarkers[hMarkerIndex], verticalMarkers[vMarkerIndex], horizontalMarkers[hMarkerIndex + 1] - horizontalMarkers[hMarkerIndex], verticalMarkers[vMarkerIndex + 1] - verticalMarkers[vMarkerIndex]);
                    textures[vMarkerIndex][hMarkerIndex] = new PIXI.Texture(android9PatchImage, rect);
                }
            }
            //now we turn our padding markers into padding values
            var paddingTop = 0;
            var paddingRight = 0;
            var paddingBottom = 0;
            var paddingLeft = 0;
            if (horizontalPaddingMarkers.length >= 4) {
                paddingLeft = horizontalPaddingMarkers[1] - horizontalPaddingMarkers[0];
                paddingRight = horizontalPaddingMarkers[horizontalPaddingMarkers.length - 1] - horizontalPaddingMarkers[horizontalPaddingMarkers.length - 2];
            }
            if (verticalPaddingMarkers.length >= 4) {
                paddingTop = verticalPaddingMarkers[1] - verticalPaddingMarkers[0];
                paddingBottom = verticalPaddingMarkers[verticalPaddingMarkers.length - 1] - verticalPaddingMarkers[verticalPaddingMarkers.length - 2];
            }
            var data = {
                textures: textures,
                paddingTop: paddingTop,
                paddingRight: paddingRight,
                paddingBottom: paddingBottom,
                paddingLeft: paddingLeft
            };
            this.AndroidNinePatchDataCache[cacheKey] = data;
            return data;
        };
        NinePatch.CalculateMarkers = function (imageData, pixelStartOffset, pixelEndOffset) {
            //markers are just positions when the image starts or stops a black line
            //we also add one at the beggining and one at the end
            var markers = [pixelStartOffset];
            var previousActive = false;
            for (var i = pixelStartOffset * 4; i < imageData.length - pixelEndOffset * 4; i += 4) {
                var isActive = imageData[i] === 0 && imageData[i + 1] === 0 && imageData[i + 2] === 0 && imageData[i + 3] === 255;
                if (isActive != previousActive)
                    markers.push(i / 4);
                previousActive = isActive;
            }
            markers.push((imageData.length / 4) - pixelEndOffset);
            return markers;
        };
        NinePatch.AndroidNinePatchDataCache = {};
        return NinePatch;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NinePatch;
    ;
});
//# sourceMappingURL=NinePatch.js.map