webpackJsonp([0,2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(182), __webpack_require__(194)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, SceneManager_1, LoadScene_1, PlayScene_1) {
	    "use strict";
	    var container = document.createElement("section");
	    container.style.width = "100%";
	    container.style.height = "100%";
	    document.body.appendChild(container);
	    var sceneManager = new SceneManager_1.SceneManager(container);
	    //sceneManager.setScene(new StackContainerDebugScene());
	    sceneManager.setScene(new LoadScene_1.default(function (resources) {
	        sceneManager.setScene(new PlayScene_1.default(resources));
	    }));
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(179), __webpack_require__(181)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, PIXI, DebugDraw_1, TWEEN) {
	    "use strict";
	    var SceneManager = (function () {
	        function SceneManager(htmlContainer) {
	            var _this = this;
	            this.htmlContainer = htmlContainer;
	            this.renderer = PIXI.autoDetectRenderer(htmlContainer.clientWidth, htmlContainer.clientHeight, { antialias: true });
	            this.renderer.backgroundColor = 0xFF0000;
	            htmlContainer.appendChild(this.renderer.view);
	            //Hack: interaction data objects are reused making it difficult to store info on them
	            //this is a hack to remove the "selection" property on every click so it can be used
	            //by the rest of hte system to bubble what has been clicked in
	            // let plugins = ((<any>this.renderer).plugins);
	            // let interactionManager = (<InteractionManager>plugins.interaction);
	            // let clearData = function(displayObject, eventString, eventData){
	            //     debugger;
	            //     delete (<any>interactionManager.eventData.data).selection;
	            // }
	            // this.interceptBefore(interactionManager, "onMouseUp",clearData)
	            // this.interceptBefore(interactionManager, "onMouseDown",clearData)
	            // interactionManager.setTargetElement(interactionManager.interactionDOMElement, interactionManager.resolution);
	            this.container = new PIXI.Container();
	            this.container.addChild(DebugDraw_1.default.Global);
	            this.animate();
	            window.addEventListener('resize', function () {
	                if (htmlContainer.clientWidth != _this.renderer.width
	                    || htmlContainer.clientHeight != _this.renderer.height) {
	                    _this.renderer.resize(htmlContainer.clientWidth, htmlContainer.clientHeight);
	                    _this.setScene(_this.currentScene);
	                }
	            });
	        }
	        SceneManager.prototype.setScene = function (scene) {
	            this.container.removeChild(this.currentScene);
	            this.currentScene = this.container.addChildAt(scene, 0);
	            scene.width = this.renderer.width;
	            scene.height = this.renderer.height;
	            //Util.TrySetRenderRect(scene, {x:0,y:0,width:this.renderer.width, height:this.renderer.height});
	        };
	        SceneManager.prototype.animate = function () {
	            var _this = this;
	            TWEEN.update();
	            this.renderer.render(this.container);
	            window.requestAnimationFrame(function () { return _this.animate(); });
	        };
	        SceneManager.prototype.interceptBefore = function (target, method, intercept) {
	            var originalMethod = target[method];
	            target[method] = function () {
	                intercept.apply(this, arguments);
	                originalMethod.apply(this, arguments);
	            };
	        };
	        return SceneManager;
	    }());
	    exports.SceneManager = SceneManager;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 179:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(180)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Util_1) {
	    "use strict";
	    var DebugDraw = (function (_super) {
	        __extends(DebugDraw, _super);
	        function DebugDraw() {
	            var _this = _super.call(this) || this;
	            _this.debugObjects = [];
	            _this.graphics = _this.addChild(new PIXI.Graphics());
	            PIXI.ticker.shared.add(_this.redraw.bind(_this));
	            return _this;
	        }
	        // getLocalBounds(){
	        //
	        //     return new PIXI.Rectangle(0,0,0,0);
	        // }
	        DebugDraw.prototype.redraw = function () {
	            var _this = this;
	            this.graphics.clear();
	            this.debugObjects.forEach(function (obj, i) {
	                if (!_this.isRelatedToDebugDraw(obj.displayObject)) {
	                    _this.debugObjects.slice(i, 1);
	                    return;
	                }
	                var bounds = obj.displayObject.getBounds();
	                var p1 = _this.toLocal(new PIXI.Point(bounds.x, bounds.y), obj.displayObject);
	                var p2 = _this.toLocal(new PIXI.Point(bounds.x + bounds.width, bounds.y + bounds.height), obj.displayObject);
	                _this.graphics.lineStyle(2, obj.color, 1);
	                _this.graphics.drawRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
	            });
	        };
	        DebugDraw.prototype.drawBounds = function (displayObject, color) {
	            if (color === void 0) { color = this.defaultColor(displayObject); }
	            var debugObj = {
	                displayObject: displayObject,
	                color: color
	            };
	            this.debugObjects.push(debugObj);
	        };
	        DebugDraw.prototype.isRelatedToDebugDraw = function (item) {
	            var thisAncestors = DebugDraw.getAncestors(this);
	            var itemAncestors = DebugDraw.getAncestors(item);
	            for (var i = 0; i < thisAncestors.length; i++) {
	                if (itemAncestors.indexOf(thisAncestors[i]) >= 0)
	                    return true;
	            }
	            return false;
	        };
	        DebugDraw.getAncestors = function (item) {
	            var ancestors = [];
	            var currentItem = item;
	            while (currentItem = currentItem.parent) {
	                ancestors.push(currentItem);
	            }
	            return ancestors;
	        };
	        DebugDraw.DrawBounds = function (displayObject, color) {
	            DebugDraw.Global.drawBounds(displayObject, color);
	        };
	        DebugDraw.prototype.defaultColor = function (obj) {
	            var constructorName = Util_1.default.FunctionName(obj.constructor) || "";
	            var hashedName = Util_1.default.HashCodeString(constructorName);
	            var color = Math.abs(hashedName % 16777216);
	            return color;
	        };
	        return DebugDraw;
	    }(PIXI.Container));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = DebugDraw;
	    DebugDraw.Global = new DebugDraw();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 180:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var Util = (function () {
	        function Util() {
	        }
	        Util.constrain = function (input, min, max) {
	            return Math.max(Math.min(input, max), min);
	        };
	        Util.DegToRad = function (degrees) {
	            return degrees / 180 * Math.PI;
	        };
	        Util.RadToDeg = function (radians) {
	            return radians / Math.PI * 180;
	        };
	        // static TryResize(target:any, width:number, height:number){
	        //     Util.TryCall(target, "resize", width, height);
	        // }
	        Util.TrySetRenderRect = function (target, rect) {
	            Util.TryCall(target, "setRenderRect", rect);
	        };
	        Util.TryCall = function (target, method) {
	            var args = [];
	            for (var _i = 2; _i < arguments.length; _i++) {
	                args[_i - 2] = arguments[_i];
	            }
	            if (!target)
	                return;
	            var fn = target[method];
	            if (typeof fn === "function") {
	                return fn.apply(target, args);
	            }
	        };
	        Util.FunctionName = function (fn) {
	            if (fn.name)
	                return fn.name;
	            //fallback for older JS which doesnt have a name proeprty
	            var funcNameRegex = /function (.{1,})\(/;
	            var results = (funcNameRegex).exec(fn.toString());
	            if (results && results.length > 1)
	                return results[1];
	            throw new Error("function does not have a name");
	        };
	        Util.HashCodeString = function (str) {
	            var hash = 0, i, chr, len;
	            if (str.length == 0)
	                return hash;
	            for (i = 0, len = str.length; i < len; i++) {
	                chr = str.charCodeAt(i);
	                hash = ((hash << 5) - hash) + chr;
	                hash |= 0; // Convert to 32bit integer
	            }
	            return hash;
	        };
	        ;
	        return Util;
	    }());
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = Util;
	    Util.EmptyObject = {};
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 182:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(183), __webpack_require__(184), __webpack_require__(183), __webpack_require__(183)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, PIXI, Resources_1, World_1, Resources_2, Resources_3) {
	    "use strict";
	    var LoadScene = (function (_super) {
	        __extends(LoadScene, _super);
	        function LoadScene(loaded) {
	            var _this = _super.call(this) || this;
	            _this.minimumLoadingPageShown = 1000;
	            _this.skipLoadingPageTimeout = 200;
	            //some quick loading to show a nice loading screen
	            PIXI.loader.add('loadingImage', '/assets/loading.png').load(function (loader, loadedResources) {
	                //we will show the page soon, we dont show it immediatly as our loading might
	                //be very quick, and we dont want to show the loading page unless we have to
	                var pageIsShown = false;
	                var showPageTimeout = setTimeout(function () {
	                    _this.loadingSprite = new PIXI.Sprite(loadedResources.loadingImage.texture);
	                    _this.loadingSprite.anchor.set(0.5, 0.5);
	                    _this.addChild(_this.loadingSprite);
	                    _this.setRenderRect(_this.renderRect); //resize to position our sprite
	                    pageIsShown = true;
	                }, _this.skipLoadingPageTimeout);
	                var startTime = new Date().getTime();
	                //now we start loading the real content
	                PIXI.loader
	                    .add('gameState', '/assets/maps/demo.json')
	                    .add('menuBackground', '/assets/images/backgrounds/parchment.png')
	                    .add('menuBorder', '/assets/images/backgrounds/shadow.png')
	                    .add('squareButtonUp', '/assets/images/ui/square-buySellButton.9.png')
	                    .add('squareButtonDown', '/assets/images/ui/square-buySellButton-down.9.png')
	                    .add('moveButtonUp', '/assets/images/ui/move-button-up.png')
	                    .add('moveButtonDown', '/assets/images/ui/move-button-down.png')
	                    .load(function (loader, loadedResources) {
	                    var resources = new Resources_1.default();
	                    resources.world = new World_1.default(loadedResources.gameState.data);
	                    resources.menuBackground = loadedResources.menuBackground.texture;
	                    resources.menuBorder = loadedResources.menuBorder.texture;
	                    resources.buySellButton = new Resources_2.NinePatchButton(loadedResources.squareButtonUp.texture, loadedResources.squareButtonDown.texture);
	                    resources.moveButton = new Resources_3.ImageButton(loadedResources.moveButtonUp.texture, loadedResources.moveButtonDown.texture);
	                    //we now know the tilests, so we will load each of hte tilesets
	                    var baseDirectory = '/assets/maps/';
	                    resources.world.state.tilesets.forEach(function (tileset) {
	                        PIXI.loader.add(tileset.name, baseDirectory + tileset.image);
	                    });
	                    PIXI.loader.load(function (loader, loadedResources) {
	                        resources.world.state.tilesets.forEach(function (tileset) {
	                            resources.tileSets[tileset.name] = loadedResources[tileset.name].texture;
	                        });
	                        resources.tileTextures = _this.generateTileMap(resources);
	                        resources.cityIcon = resources.tileTextures[21];
	                        var endTime = new Date().getTime();
	                        var elapsedTime = endTime - startTime;
	                        console.debug('Loaded resources in ' + elapsedTime + 'ms', loadedResources);
	                        clearTimeout(showPageTimeout);
	                        if (pageIsShown) {
	                            //if we have started showing the page we have to show it for the minimum time
	                            var additionalWait = Math.max(0, _this.minimumLoadingPageShown - elapsedTime);
	                            setTimeout(function () {
	                                loaded(resources);
	                            }, additionalWait);
	                        }
	                        else {
	                            console.debug('resources loaded fast, will not show the loading page');
	                            loaded(resources);
	                        }
	                    });
	                });
	            });
	            return _this;
	        }
	        LoadScene.prototype.setRenderRect = function (rect) {
	            this.renderRect = rect;
	            if (this.loadingSprite != null) {
	                this.loadingSprite.x = rect.width / 2;
	                this.loadingSprite.y = rect.height / 2;
	            }
	        };
	        LoadScene.prototype.generateTileMap = function (resources) {
	            var tileMap = {};
	            resources.world.state.tilesets.forEach(function (tileset) {
	                var baseTexture = resources.tileSets[tileset.name];
	                PIXI.Texture;
	                baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
	                var subImageIndex = 0;
	                for (var y = tileset.margin; y + tileset.tileheight <= tileset.imageheight; y += tileset.tileheight + tileset.spacing) {
	                    for (var x = tileset.margin; x + tileset.tilewidth <= tileset.imagewidth; x += tileset.tilewidth + tileset.spacing) {
	                        var subImageRectangle = new PIXI.Rectangle(x, y, tileset.tilewidth, tileset.tileheight);
	                        tileMap[tileset.firstgid + subImageIndex] = new PIXI.Texture(baseTexture, subImageRectangle);
	                        subImageIndex++;
	                    }
	                }
	            });
	            return tileMap;
	        };
	        return LoadScene;
	    }(PIXI.Container));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = LoadScene;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 183:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var NinePatchButton = (function () {
	        function NinePatchButton(up, down, hover) {
	            if (down === void 0) { down = up; }
	            if (hover === void 0) { hover = up; }
	            this.up = up;
	            this.down = down;
	            this.hover = hover;
	        }
	        return NinePatchButton;
	    }());
	    exports.NinePatchButton = NinePatchButton;
	    var ImageButton = (function () {
	        function ImageButton(up, down, hover) {
	            if (down === void 0) { down = up; }
	            if (hover === void 0) { hover = up; }
	            this.up = up;
	            this.down = down;
	            this.hover = hover;
	        }
	        return ImageButton;
	    }());
	    exports.ImageButton = ImageButton;
	    var Resources = (function () {
	        function Resources() {
	            this.tileSets = {};
	        }
	        return Resources;
	    }());
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = Resources;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 184:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(185), __webpack_require__(180), __webpack_require__(186), __webpack_require__(34), __webpack_require__(188), __webpack_require__(192), __webpack_require__(193)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Player_1, Util_1, Linq, EventEmitter, DataCleanse_1, TweenGroup_1, Coordinates_1) {
	    "use strict";
	    var World = (function () {
	        function World(state) {
	            this.state = state;
	            this.commandIssuingDepth = 0;
	            this.tickNumber = 0;
	            this.clock = new Clock();
	            this.commandEmitter = new EventEmitter();
	            this.tweens = new TweenGroup_1.default();
	            this.clock.every(2000, function () {
	                //this.issueCommand(new CityHarvest());
	            });
	            // this.clock.every(50, ()=>{
	            //     this.objectsOfType<Ship>(ShipUtil.TypeName).forEach(ship=>{
	            //         let targetPoint = this.getTilePoint(ship.properties.moveToTileIndex);
	            //
	            //         ship.x += Math.max(-1,Math.min(1, targetPoint.x - ship.x));
	            //         ship.y += Math.max(-1,Math.min(1, targetPoint.y - ship.y));
	            //
	            //         if(targetPoint.x === ship.x && targetPoint.y === ship.y)
	            //             ship.properties.moveToTileIndex = null;
	            //     });
	            // })
	            this.issueCommand(new DataCleanse_1.default());
	        }
	        World.prototype.player = function () {
	            var existingPlayer = this.objectOfType(Player_1.PlayerType);
	            if (existingPlayer) {
	                return existingPlayer;
	            }
	        };
	        World.prototype.objectWithId = function (id) {
	            return Linq.from(this.state.layers)
	                .where(function (layer) { return layer.type === "objectgroup"; })
	                .selectMany(function (layer) { return layer.objects; })
	                .firstOrDefault(function (obj) { return obj.id === id; });
	        };
	        World.prototype.objectsOfType = function (type) {
	            return Linq.from(this.state.layers)
	                .where(function (layer) { return layer.type === "objectgroup"; })
	                .selectMany(function (layer) { return layer.objects; })
	                .where(function (obj) { return obj.type === type; });
	        };
	        World.prototype.objectOfType = function (type) {
	            return this.objectsOfType(type).firstOrDefault();
	        };
	        World.prototype.tileLayers = function () {
	            return Linq.from(this.state.layers).where(function (layer) { return layer.type === "tilelayer"; });
	        };
	        World.prototype.getNeighbourIndexes = function (tileIndex) {
	            var neighbours = [];
	            var currentRow = Math.floor(tileIndex / this.state.width);
	            var currentCol = tileIndex % this.state.width;
	            var fromRow = Math.max(currentRow - 1, 0);
	            var toRow = Math.min(currentRow + 1, this.state.height - 1);
	            var fromCol = Math.max(currentCol - 1, 0);
	            var toCol = Math.min(currentCol + 1, this.state.width - 1);
	            for (var row = fromRow; row <= toRow; row++) {
	                for (var col = fromCol; col <= toCol; col++) {
	                    if (!(row == currentRow && col == currentCol))
	                        neighbours.push(this.state.width * row + col);
	                }
	            }
	            return neighbours;
	        };
	        World.prototype.getExtendedNeighbours = function (startTileIndex, segmentPredicate) {
	            var processedIndexes = {};
	            var toProcessIndexes = [startTileIndex];
	            var partOfSegment = [];
	            while (toProcessIndexes.length > 0) {
	                var toProcessIndex = toProcessIndexes.pop();
	                if (processedIndexes[toProcessIndex])
	                    continue;
	                processedIndexes[toProcessIndex] = true;
	                if (!segmentPredicate(toProcessIndex))
	                    continue;
	                partOfSegment.push(toProcessIndex);
	                toProcessIndexes.push.apply(toProcessIndexes, this.getNeighbourIndexes(toProcessIndex));
	            }
	            return Linq.from(partOfSegment);
	        };
	        World.prototype.getTileIndex = function (point) {
	            point = {
	                x: point.x + (point.width || 0) / 2,
	                y: point.y - (point.height || 0) / 2
	            };
	            var row = Math.floor(point.y / this.state.tileheight);
	            var col = Math.floor(point.x / this.state.tilewidth);
	            return this.state.width * row + col;
	        };
	        World.prototype.getTilePoint = function (tileIndex) {
	            var row = Math.floor(tileIndex / this.state.width);
	            var col = tileIndex % this.state.width;
	            return {
	                x: col * this.state.tilewidth + this.state.tilewidth / 2,
	                y: row * this.state.tileheight + this.state.tileheight / 2
	            };
	        };
	        World.prototype.getTileIndexesInRect = function (rect) {
	            var startTilePosition = {
	                x: Math.round(rect.x / this.state.tilewidth),
	                y: Math.round(rect.y / this.state.tileheight)
	            };
	            var endTilePosition = {
	                x: Math.round((rect.x + rect.width) / this.state.tilewidth),
	                y: Math.round((rect.y + rect.height) / this.state.tileheight)
	            };
	            var result = [];
	            for (var row = startTilePosition.y; row < endTilePosition.y; row++) {
	                for (var col = startTilePosition.x; col < endTilePosition.x; col++) {
	                    result.push(this.state.width * row + col);
	                }
	            }
	            return Linq.from(result);
	        };
	        World.prototype.getTilePropertiesFromIndex = function (layer, tileIndex) {
	            return this.getTilePropertiesFromGid(layer.data[tileIndex]);
	        };
	        World.prototype.getTilePropertiesFromGid = function (gid) {
	            //TODO: this gets called a lot, should cache gid->properties
	            var tilesetsWithGid = Linq.from(this.state.tilesets).where(function (tileset) { return tileset.tileproperties && tileset.tileproperties.hasOwnProperty(gid - tileset.firstgid + ""); });
	            return Linq.from(this.state.tilesets)
	                .where(function (tileset) { return tileset.tileproperties && tileset.tileproperties.hasOwnProperty(gid - tileset.firstgid + ""); })
	                .select(function (tileset) { return tileset.tileproperties[gid - tileset.firstgid + ""]; })
	                .firstOrDefault() || {};
	        };
	        World.prototype.getGidStack = function (tileIndex) {
	            return this.tileLayers().select(function (layer) {
	                return layer.data[tileIndex];
	            }).where(function (gid) { return gid !== 0; });
	        };
	        World.prototype.findPointRoute = function (start, end, canTravelOnTileIndex) {
	            var _this = this;
	            var startTile = this.getTileIndex(start);
	            var endTile = this.getTileIndex(end);
	            var tileRoute = this.findTileRoute(startTile, endTile, canTravelOnTileIndex);
	            var tilePath = tileRoute.path;
	            var distance = tileRoute.distance;
	            //no path can be found
	            if (tilePath.length == 0) {
	                return { path: [], distance: 0 };
	            }
	            //we will do some smart adjustment we do not need to go to the first tile if it is not on the way
	            if (tilePath.length >= 2) {
	                //if its shorter to move from start to second tile than move to first then second we will do the shorter
	                var firstTilePoint = this.getTilePoint(tilePath[0]);
	                var secondTilePoint = this.getTilePoint(tilePath[1]);
	                var distStartToFirstTile = Coordinates_1.XYUtil.distance(start, firstTilePoint);
	                var distStartToSecondTile = Coordinates_1.XYUtil.distance(start, secondTilePoint);
	                var distFirstTileToSecondTile = Coordinates_1.XYUtil.distance(firstTilePoint, secondTilePoint);
	                if (distStartToSecondTile < distStartToFirstTile + distFirstTileToSecondTile) {
	                    tilePath.shift();
	                    distance -= distFirstTileToSecondTile;
	                }
	                //if its shorter to go from second last tile to end, we will do that rather than go through last tile
	                var lastTilePoint = this.getTilePoint(tilePath[tilePath.length - 1]);
	                var secondLastTilePoint = this.getTilePoint(tilePath[tilePath.length - 2]);
	                var distEndToLastTile = Coordinates_1.XYUtil.distance(end, lastTilePoint);
	                var distEndToSecondLastTile = Coordinates_1.XYUtil.distance(end, secondLastTilePoint);
	                var distLastTileToSecondLastTile = Coordinates_1.XYUtil.distance(lastTilePoint, secondLastTilePoint);
	                if (distEndToSecondLastTile < distEndToLastTile + distLastTileToSecondLastTile) {
	                    tilePath.pop();
	                    distance -= distLastTileToSecondLastTile;
	                }
	            }
	            var pointPath = tilePath.map(function (ti) { return _this.getTilePoint(ti); });
	            //make sure our start and end points are part of the path
	            if (!Coordinates_1.XYUtil.equals(pointPath[0], start)) {
	                pointPath.unshift({ x: start.x, y: start.y });
	                distance += Coordinates_1.XYUtil.distance(pointPath[0], start);
	            }
	            if (!Coordinates_1.XYUtil.equals(pointPath[pointPath.length - 1], end)) {
	                pointPath.push({ x: end.x, y: end.y });
	                distance += Coordinates_1.XYUtil.distance(pointPath[pointPath.length - 1], end);
	            }
	            return {
	                path: pointPath,
	                distance: distance
	            };
	        };
	        World.prototype.findTileRoute = function (startTileIndex, endTileIndex, canTravelOnTileIndex) {
	            var _this = this;
	            var distance = function (tileIndex1, tileIndex2) {
	                var p1 = _this.getTilePoint(tileIndex1);
	                var p2 = _this.getTilePoint(tileIndex2);
	                return Coordinates_1.XYUtil.distance(p1, p2);
	            };
	            var open = [startTileIndex];
	            var closed = [];
	            //g_score is actual distance from start to that tile
	            var g_score = {};
	            g_score[startTileIndex] = 0;
	            //f_score is the estimated liklihood this is on the correct path. its made from
	            //the distance from start to that tile plus estimation of that tile to the end
	            var f_score = {};
	            f_score[startTileIndex] = g_score[startTileIndex] + distance(startTileIndex, endTileIndex);
	            var came_from = {};
	            var _loop_1 = function () {
	                //find the node that has the lowest f-score, i.e. will
	                //be the most likely to lead to the shortest part
	                var lowest_index = 0;
	                var lowest_node = open[lowest_index];
	                var lowest_f_score = f_score[lowest_node];
	                for (var i = 1; i < open.length; i++) {
	                    var current_node_1 = open[i];
	                    var current_f_score = f_score[current_node_1];
	                    if (lowest_f_score > current_f_score) {
	                        lowest_index = i;
	                        lowest_f_score = current_f_score;
	                        lowest_node = current_node_1;
	                    }
	                }
	                var current_node = lowest_node;
	                //close our node
	                open.splice(lowest_index, 1);
	                closed.push(lowest_node);
	                //if we cant travel on this node, forget about it
	                if (!canTravelOnTileIndex(lowest_node))
	                    return "continue";
	                //if we have reached the end node, we are done, we just need
	                //to rebuild the path
	                if (current_node === endTileIndex) {
	                    path = [lowest_node];
	                    source = came_from[lowest_node];
	                    while (source) {
	                        path.push(source);
	                        source = came_from[source];
	                    }
	                    path.reverse();
	                    return { value: {
	                            path: path,
	                            distance: g_score[current_node]
	                        } };
	                }
	                this_1.getNeighbourIndexes(current_node).forEach(function (neighbour) {
	                    //don't touch nodes we have processed before
	                    if (closed.indexOf(neighbour) != -1)
	                        return;
	                    var tentative_g_score = g_score[current_node] + distance(current_node, neighbour);
	                    if (open.indexOf(neighbour) === -1) {
	                        open.push(neighbour);
	                    }
	                    else if (tentative_g_score >= g_score[neighbour]) {
	                        return; //this is not a better path
	                    }
	                    came_from[neighbour] = current_node;
	                    g_score[neighbour] = tentative_g_score;
	                    f_score[neighbour] = tentative_g_score + distance(current_node, neighbour);
	                });
	            };
	            var this_1 = this, path, source;
	            while (open.length > 0) {
	                var state_1 = _loop_1();
	                if (typeof state_1 === "object")
	                    return state_1.value;
	            }
	            return {
	                path: [],
	                distance: 0
	            };
	        };
	        // findPath(sourceMarkerIds:string[], targetMarkerId:string):string[]{
	        //
	        //     var open = sourceMarkerIds;
	        //
	        //     var came_from = {};
	        //
	        //     var g_score = {};
	        //     for(var i=0;i<sourceMarkerIds.length;i++){
	        //         g_score[sourceMarkerIds[i]] = 0;
	        //     }
	        //
	        //     var f_score = {};
	        //     for(var i=0;i<sourceMarkerIds.length;i++) {
	        //         f_score[sourceMarkerIds[i]]= g_score[sourceMarkerIds[i]] + this.distance(sourceMarkerIds[i], targetMarkerId);
	        //     }
	        //
	        //
	        //     var closedSet = [];
	        //
	        //     while(open.length > 0){
	        //
	        //         var lowest_index = 0;
	        //         var lowest_node = open[lowest_index];
	        //         var lowest_f_score = f_score[lowest_node];
	        //
	        //         for(var i=1;i<open.length;i++) {
	        //             var current_node = open[i];
	        //             var current_f_score = f_score[current_node];
	        //             if(lowest_f_score > current_f_score){
	        //                 lowest_index = i;
	        //                 lowest_f_score = current_f_score;
	        //                 lowest_node = current_node;
	        //             }
	        //         }
	        //
	        //         if(lowest_node == targetMarkerId){
	        //             var path = [lowest_node];
	        //             var source = came_from[lowest_node];
	        //             while(source){
	        //                 path.push(source);
	        //                 source = came_from[source];
	        //             }
	        //             path.reverse();
	        //             return path;
	        //         }
	        //
	        //         open.splice(lowest_index, 1);
	        //         closedSet.push(lowest_node);
	        //
	        //         var neighbours = this.neighbours(lowest_node)
	        //         for(var i=0;i<neighbours.length;i++){
	        //             var neighbour = neighbours[i];
	        //
	        //             //dont touch nodes we have processed before
	        //             if(closedSet.indexOf(neighbour) != -1)
	        //                 continue;
	        //
	        //             var tentative_g_score = g_score[current_node] + this.distance(lowest_node, neighbour);
	        //
	        //             if(open.indexOf(neighbour) === -1){
	        //                 open.push(neighbour)
	        //             }
	        //             else if(tentative_g_score >= g_score[neighbour]){
	        //                 continue; //this is not a better path
	        //             }
	        //
	        //             came_from[neighbour] = lowest_node;
	        //             g_score[neighbour] = tentative_g_score;
	        //             f_score[neighbour] = tentative_g_score + this.distance(lowest_node, neighbour);
	        //         }
	        //     }
	        // }
	        World.prototype.isIndexPartOfCity = function (tileIndex) {
	            var _this = this;
	            return this.getGidStack(tileIndex)
	                .select(function (gid) { return _this.getTilePropertiesFromGid(gid); })
	                .any(function (prop) { return prop.isPartOfCity; });
	        };
	        World.prototype.isMovementAllowed = function (tileIndex) {
	            var _this = this;
	            return this.getGidStack(tileIndex)
	                .select(function (gid) { return _this.getTilePropertiesFromGid(gid); })
	                .all(function (prop) { return prop.allowMovement; });
	        };
	        World.prototype.onCommand = function (clazz, callback, context) {
	            var typeName = Util_1.default.FunctionName(clazz);
	            this.commandEmitter.on(typeName, callback, context);
	        };
	        World.prototype.offCommand = function (clazz, callback, context) {
	            var typeName = Util_1.default.FunctionName(clazz);
	            this.commandEmitter.off(typeName, callback, context);
	        };
	        World.prototype.onCommands = function (clazzes, callback, context) {
	            var _this = this;
	            clazzes.forEach(function (clazz) { return _this.onCommand(clazz, callback, context); });
	        };
	        World.prototype.offCommands = function (clazzes, callback, context) {
	            var _this = this;
	            clazzes.forEach(function (clazz) { return _this.offCommand(clazz, callback, context); });
	        };
	        World.prototype.issueCommand = function () {
	            var _this = this;
	            var commands = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                commands[_i - 0] = arguments[_i];
	            }
	            for (var i = 0; i < commands.length; i++) {
	                var command = commands[i];
	                console.debug(Array(this.commandIssuingDepth).join(">") + 'executing command', command);
	                this.commandIssuingDepth++;
	                var result = command.execute(this);
	                this.commandIssuingDepth--;
	                if (!result.isSuccessful)
	                    console.debug(Array(this.commandIssuingDepth).join(">") + 'unable to execute command', command, result);
	            }
	            commands.forEach(function (command) {
	                var typeName = Util_1.default.FunctionName(command.constructor);
	                _this.commandEmitter.emit(typeName, command);
	            });
	        };
	        World.prototype.tick = function (elapsedMilliseconds) {
	            this.clock.tick(elapsedMilliseconds);
	            this.tweens.update(this.clock.time);
	        };
	        return World;
	    }());
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = World;
	    var Clock = (function () {
	        function Clock() {
	            this.time = 0;
	            this._listeners = [];
	        }
	        Clock.prototype.tick = function (elapsedMilliseconds) {
	            this.time += elapsedMilliseconds;
	            var listeners = this._listeners.slice(0);
	            for (var i = 0, l = listeners.length; i < l; i++) {
	                listeners[i].call(this, elapsedMilliseconds);
	            }
	        };
	        Clock.prototype.every = function (everyMillisecons, fn) {
	            var _this = this;
	            this._listeners.push(function (elapsed) {
	                var previousTime = _this.time - elapsed;
	                var currentTime = _this.time;
	                var numberOfOccurances = Math.floor(currentTime / everyMillisecons) - Math.floor(previousTime / everyMillisecons);
	                for (var i = 0; i < numberOfOccurances; i++) {
	                    fn();
	                }
	            });
	        };
	        return Clock;
	    }());
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 185:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.PlayerType = "Player";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 188:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(189), __webpack_require__(186), __webpack_require__(190)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Command_1, Linq, Ship_1) {
	    "use strict";
	    var DataCleanse = (function () {
	        function DataCleanse() {
	        }
	        DataCleanse.prototype.execute = function (world) {
	            Linq.from(world.state.layers)
	                .where(function (layer) { return layer.type === "objectgroup"; })
	                .selectMany(function (layer) { return layer.objects; })
	                .forEach(function (obj) {
	                obj.properties = obj.properties || {};
	            });
	            world.objectsOfType(Ship_1.ShipUtil.TypeName).forEach(function (ship) {
	                ship.properties._moveFromPoints = ship.properties._moveFromPoints || [];
	                ship.properties._moveToPoints = ship.properties._moveToPoints || [];
	            });
	            return Command_1.SuccessResult;
	        };
	        DataCleanse.prototype.canExecute = function (world) {
	            return Command_1.SuccessResult;
	        };
	        return DataCleanse;
	    }());
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = DataCleanse;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 189:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var CommandResult = (function () {
	        function CommandResult(isSuccessful, failureReason) {
	            this.isSuccessful = isSuccessful;
	            this.failureReason = failureReason;
	        }
	        return CommandResult;
	    }());
	    exports.CommandResult = CommandResult;
	    exports.SuccessResult = new CommandResult(true);
	    var CityDoesNotHaveRequiredResource = (function (_super) {
	        __extends(CityDoesNotHaveRequiredResource, _super);
	        function CityDoesNotHaveRequiredResource(city, resourceName) {
	            var _this = _super.call(this, false, "City '" + city.name + "' does not have enough " + resourceName) || this;
	            _this.city = city;
	            _this.resourceName = resourceName;
	            return _this;
	        }
	        return CityDoesNotHaveRequiredResource;
	    }(CommandResult));
	    exports.CityDoesNotHaveRequiredResource = CityDoesNotHaveRequiredResource;
	    var ShipDoesNotHaveRequiredResource = (function (_super) {
	        __extends(ShipDoesNotHaveRequiredResource, _super);
	        function ShipDoesNotHaveRequiredResource(ship, resourceName) {
	            var _this = _super.call(this, false, "Ship '" + ship.name + "' does not have enough " + resourceName) || this;
	            _this.ship = ship;
	            _this.resourceName = resourceName;
	            return _this;
	        }
	        return ShipDoesNotHaveRequiredResource;
	    }(CommandResult));
	    exports.ShipDoesNotHaveRequiredResource = ShipDoesNotHaveRequiredResource;
	    var ShipDoesNotHaveCapacity = (function (_super) {
	        __extends(ShipDoesNotHaveCapacity, _super);
	        function ShipDoesNotHaveCapacity(ship) {
	            var _this = _super.call(this, false, "Ship '" + ship.name + "' has not more capacity") || this;
	            _this.ship = ship;
	            return _this;
	        }
	        return ShipDoesNotHaveCapacity;
	    }(CommandResult));
	    exports.ShipDoesNotHaveCapacity = ShipDoesNotHaveCapacity;
	    var ShipIdNotFoundResult = (function (_super) {
	        __extends(ShipIdNotFoundResult, _super);
	        function ShipIdNotFoundResult(shipId) {
	            return _super.call(this, false, "Ship with id '" + shipId + "' not found") || this;
	        }
	        return ShipIdNotFoundResult;
	    }(CommandResult));
	    exports.ShipIdNotFoundResult = ShipIdNotFoundResult;
	    var PortIdNotFoundResult = (function (_super) {
	        __extends(PortIdNotFoundResult, _super);
	        function PortIdNotFoundResult(portId) {
	            return _super.call(this, false, "Port with id '" + portId + "' not found") || this;
	        }
	        return PortIdNotFoundResult;
	    }(CommandResult));
	    exports.PortIdNotFoundResult = PortIdNotFoundResult;
	    var ResourceIdNotFoundResult = (function (_super) {
	        __extends(ResourceIdNotFoundResult, _super);
	        function ResourceIdNotFoundResult(resourceId) {
	            return _super.call(this, false, "Resource with id '" + resourceId + "' not found") || this;
	        }
	        return ResourceIdNotFoundResult;
	    }(CommandResult));
	    exports.ResourceIdNotFoundResult = ResourceIdNotFoundResult;
	    var MarkerIdNotFoundResult = (function (_super) {
	        __extends(MarkerIdNotFoundResult, _super);
	        function MarkerIdNotFoundResult(markerId) {
	            return _super.call(this, false, "Marker with id '" + markerId + "' not found") || this;
	        }
	        return MarkerIdNotFoundResult;
	    }(CommandResult));
	    exports.MarkerIdNotFoundResult = MarkerIdNotFoundResult;
	    var BalanceTooLowResult = (function (_super) {
	        __extends(BalanceTooLowResult, _super);
	        function BalanceTooLowResult() {
	            return _super.call(this, false, "Balance too low") || this;
	        }
	        return BalanceTooLowResult;
	    }(CommandResult));
	    exports.BalanceTooLowResult = BalanceTooLowResult;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 190:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(186), __webpack_require__(191)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Linq, Properties_1) {
	    "use strict";
	    var ShipUtil = (function () {
	        function ShipUtil() {
	        }
	        ShipUtil.IsShip = function (layerObj) {
	            return layerObj && layerObj.type === this.TypeName;
	        };
	        ShipUtil.TotalResources = function (ship) {
	            return Linq.from(ship.properties).where(function (kvp) { return Properties_1.Properties.IsInventory(kvp.key); }).sum(function (kvp) { return kvp.value; });
	        };
	        return ShipUtil;
	    }());
	    exports.ShipUtil = ShipUtil;
	    ShipUtil.TypeName = "Ship";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 191:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var Properties = (function () {
	        function Properties() {
	        }
	        Properties.ProductionPropertyName = function (resource) {
	            return this.ProductionPrefix + resource;
	        };
	        Properties.ProductionResourceName = function (property) {
	            return property.indexOf(this.ProductionPrefix) === 0
	                ? property.substring(this.ProductionPrefix.length)
	                : null;
	        };
	        Properties.IsProduction = function (property) {
	            return property.indexOf(this.ProductionPrefix) === 0;
	        };
	        Properties.InventoryPropertyName = function (resource) {
	            return this.InventoryPrefix + resource;
	        };
	        Properties.InventoryResourceName = function (property) {
	            return property.indexOf(this.InventoryPrefix) === 0
	                ? property.substring(this.InventoryPrefix.length)
	                : null;
	        };
	        Properties.IsInventory = function (property) {
	            return property.indexOf(this.InventoryPrefix) === 0;
	        };
	        return Properties;
	    }());
	    exports.Properties = Properties;
	    Properties.ProductionPrefix = "production.";
	    Properties.InventoryPrefix = "inventory.";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 192:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(181)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, TWEEN) {
	    "use strict";
	    var TweenGroup = (function () {
	        function TweenGroup() {
	            this._tweens = [];
	        }
	        TweenGroup.prototype.getAll = function () {
	            return this._tweens;
	        };
	        TweenGroup.prototype.removeAll = function () {
	            this._tweens = [];
	        };
	        TweenGroup.prototype.add = function (tween) {
	            //remove it from the global group
	            TWEEN.remove(tween);
	            this._tweens.push(tween);
	            return tween;
	        };
	        TweenGroup.prototype.remove = function (tween) {
	            var i = this._tweens.indexOf(tween);
	            if (i !== -1) {
	                this._tweens.splice(i, 1);
	            }
	        };
	        TweenGroup.prototype.update = function (time) {
	            if (this._tweens.length === 0) {
	                return false;
	            }
	            var i = 0;
	            time = time !== undefined ? time : window.performance.now();
	            while (i < this._tweens.length) {
	                if (this._tweens[i].update(time)) {
	                    i++;
	                }
	                else {
	                    this._tweens.splice(i, 1);
	                }
	            }
	            return true;
	        };
	        return TweenGroup;
	    }());
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = TweenGroup;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 193:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var LatLngUtil = (function () {
	        function LatLngUtil() {
	        }
	        LatLngUtil.distance = function (latlng1, latlng2) {
	            var dlat = latlng2.lat - latlng1.lat;
	            var dlng = latlng2.lng - latlng1.lng;
	            return Math.sqrt(dlat * dlat + dlng * dlng);
	        };
	        return LatLngUtil;
	    }());
	    exports.LatLngUtil = LatLngUtil;
	    var XYUtil = (function () {
	        function XYUtil() {
	        }
	        XYUtil.distance = function (xy1, xy2) {
	            var dx = xy2.x - xy1.x;
	            var dy = xy2.y - xy1.y;
	            return Math.sqrt(dx * dx + dy * dy);
	        };
	        XYUtil.angleOfLine = function (xy1, xy2) {
	            var startRadians = Math.atan((xy2.y - xy1.y) / (xy2.x - xy1.x));
	            startRadians += ((xy2.x >= xy1.x) ? -90 : 90) * Math.PI / 180;
	            return startRadians;
	        };
	        XYUtil.rotate = function (rad, center, xys) {
	            var translated = [];
	            xys.forEach(function (xy) {
	                var x = xy.x - center.x;
	                var y = xy.y - center.y;
	                var tx = x * Math.cos(rad) - y * Math.sin(rad);
	                var ty = y * Math.cos(rad) + x * Math.sin(rad);
	                tx = tx + center.x;
	                ty = ty + center.y;
	                translated.push({
	                    x: tx,
	                    y: ty
	                });
	            });
	            return translated;
	        };
	        XYUtil.equals = function (xy1, xy2) {
	            return xy1 && xy2 && xy1.x === xy2.x && xy1.y === xy2.y;
	        };
	        XYUtil.scaleRect = function (rect, scale, pivot) {
	            if (pivot === void 0) { pivot = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }; }
	            var xyScale = typeof scale === "number"
	                ? { x: scale, y: scale }
	                : scale;
	            var p1 = { x: rect.x, y: rect.y };
	            var p2 = { x: rect.x + rect.width, y: rect.y + rect.height };
	            var scaled_p1 = {
	                x: ((p1.x - pivot.x) * xyScale.x) + pivot.x,
	                y: ((p1.y - pivot.y) * xyScale.y) + pivot.y
	            };
	            var scaled_p2 = {
	                x: ((p2.x - pivot.x) * xyScale.x) + pivot.x,
	                y: ((p2.y - pivot.y) * xyScale.y) + pivot.y
	            };
	            return {
	                x: scaled_p1.x,
	                y: scaled_p1.y,
	                width: scaled_p2.x - scaled_p1.x,
	                height: scaled_p2.y - scaled_p1.y
	            };
	        };
	        return XYUtil;
	    }());
	    exports.XYUtil = XYUtil;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 194:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(186), __webpack_require__(2), __webpack_require__(197), __webpack_require__(203), __webpack_require__(195), __webpack_require__(206), __webpack_require__(190), __webpack_require__(217), __webpack_require__(219)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Linq, PIXI, MapDisplay_1, Camera_1, StackContainer_1, MenuContainer_1, Ship_1, ShipPathOverlay_1, ShipTravelPointsOverlay_1) {
	    "use strict";
	    var PlayScene = (function (_super) {
	        __extends(PlayScene, _super);
	        function PlayScene(resources) {
	            var _this = _super.call(this, -resources.menuBorder.width) || this;
	            PIXI.ticker.shared.add(function () {
	                //we will prevent hte world from skipping ahead if tab not in focus
	                var elapsedTime = Math.min(200, PIXI.ticker.shared.elapsedMS * PIXI.ticker.shared.speed);
	                resources.world.tick(elapsedTime);
	            });
	            _this.mapDisplay = new MapDisplay_1.default(resources);
	            _this.camera = new Camera_1.default(resources, _this.mapDisplay);
	            _this.menuContainer = new MenuContainer_1.default(resources);
	            _this.addChild(_this.menuContainer, { pixels: 300, z: 1 });
	            _this.addChild(_this.camera, { weight: 1 });
	            //for now we will treat the players ship as always selected
	            var player = resources.world.player();
	            var playerShip = resources.world.objectsOfType(Ship_1.ShipUtil.TypeName).firstOrDefault(function (s) { return s.properties.playerId === player.id; });
	            if (playerShip) {
	                _this.mapDisplay.underObjectsOverlay.addChild(new ShipPathOverlay_1.default(resources, playerShip)).animateIn();
	                _this.mapDisplay.underObjectsOverlay.addChild(new ShipTravelPointsOverlay_1.default(resources, playerShip)).animateIn();
	            }
	            _this.mapDisplay.on("selection", function (selectedItems) {
	                selectedItems = selectedItems.push(playerShip);
	                var items = Linq.from(selectedItems);
	            });
	            return _this;
	        }
	        return PlayScene;
	    }(StackContainer_1.HContainer));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = PlayScene;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 195:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(196)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, PIXI, UIContainer_1) {
	    "use strict";
	    var DisplayObject = PIXI.DisplayObject;
	    var StackContainer = (function (_super) {
	        __extends(StackContainer, _super);
	        function StackContainer(orientation, spacing) {
	            if (spacing === void 0) { spacing = 0; }
	            var _this = _super.call(this) || this;
	            _this.orientation = orientation;
	            _this.spacing = spacing;
	            _this.nextCellOrder = 1;
	            // this.renderRect = {x:0,y:0,width:this.width,height:this.height}
	            _this.onChildrenChange = function () {
	                //sort the children so the z layer is followed
	                _this.children.sort(function (c1, c2) { return (_this.getChildCellSize(c1).z || 0) - (_this.getChildCellSize(c2).z || 0); });
	            };
	            return _this;
	        }
	        Object.defineProperty(StackContainer.prototype, "primaryDimension", {
	            get: function () {
	                return this.orientation === "horizontal" ? "width" : "height";
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(StackContainer.prototype, "secondaryDimension", {
	            get: function () {
	                return this.orientation === "horizontal" ? "height" : "width";
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(StackContainer.prototype, "primaryAxis", {
	            get: function () {
	                return this.orientation === "horizontal" ? "x" : "y";
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(StackContainer.prototype, "secondaryAxis", {
	            get: function () {
	                return this.orientation === "horizontal" ? "y" : "x";
	            },
	            enumerable: true,
	            configurable: true
	        });
	        StackContainer.prototype.isPixelSize = function (size) {
	            return !!size.pixels;
	        };
	        StackContainer.prototype.isWeightSize = function (size) {
	            return !!size.weight;
	        };
	        StackContainer.prototype.isFlexibleSize = function (size) {
	            return size.flexible;
	        };
	        StackContainer.prototype.getChildCellSize = function (child) {
	            var size = child._cellSize;
	            size = size || { flexible: true };
	            return size;
	        };
	        StackContainer.prototype.setChildCellSize = function (child, cellSize) {
	            child._cellSize = cellSize;
	        };
	        StackContainer.prototype.relayout = function () {
	            var _this = this;
	            var childrenInCellOrder = this.children.slice().sort(function (c1, c2) {
	                return (_this.getChildCellSize(c1).order || _this.nextCellOrder) - (_this.getChildCellSize(c2).order || _this.nextCellOrder);
	            });
	            //we will run through all the children and gather some data about the sizing
	            var totalPixelSize = 0;
	            var totalFlexSize = 0;
	            var totalWeight = 0;
	            childrenInCellOrder.forEach(function (child) {
	                var cellSize = _this.getChildCellSize(child);
	                if (_this.isPixelSize(cellSize)) {
	                    totalPixelSize += cellSize.pixels;
	                }
	                else if (_this.isFlexibleSize(cellSize)) {
	                    totalFlexSize += child[_this.primaryDimension];
	                }
	                else if (_this.isWeightSize(cellSize)) {
	                    totalWeight += cellSize.weight;
	                }
	            });
	            //now we will do the real run through setting everyones x/y and sizes
	            var runningOffset = 0;
	            childrenInCellOrder.forEach(function (child) {
	                var cellSize = _this.getChildCellSize(child);
	                child[_this.primaryAxis] = runningOffset;
	                if (_this.isPixelSize(cellSize)) {
	                    var actualSize = Math.max(0, Math.min(cellSize.pixels, _this[_this.primaryDimension] - runningOffset));
	                    child[_this.primaryDimension] = actualSize;
	                    child[_this.secondaryDimension] = _this[_this.secondaryDimension];
	                    runningOffset += actualSize;
	                }
	                else if (_this.isFlexibleSize(cellSize)) {
	                    child[_this.secondaryDimension] = _this[_this.secondaryDimension];
	                    runningOffset += child[_this.primaryDimension];
	                }
	                else if (_this.isWeightSize(cellSize)) {
	                    var totalWeightSize = Math.max(0, _this[_this.primaryDimension] - totalPixelSize - totalFlexSize);
	                    var actualSize_1 = Math.round(cellSize.weight / totalWeight * totalWeightSize);
	                    child[_this.primaryDimension] = actualSize_1;
	                    child[_this.secondaryDimension] = _this[_this.secondaryDimension];
	                    runningOffset += actualSize_1;
	                }
	                runningOffset += _this.spacing;
	            });
	        };
	        StackContainer.prototype.cells = function (children) {
	            var _this = this;
	            children.forEach(function (child) {
	                _this.addChildWithoutRelayout(child[1], child[0]);
	            });
	            this.relayout();
	            return this;
	        };
	        StackContainer.prototype.cell = function (size, child) {
	            this.addChild(child, size);
	            return this;
	        };
	        StackContainer.prototype.addChildWithoutRelayout = function (child, size) {
	            size = size || { flexible: true };
	            size.order = size.order || this.nextCellOrder;
	            this.nextCellOrder = size.order + 1;
	            this.setChildCellSize(child, size);
	            var returnValue = _super.prototype.addChild.call(this, child);
	            return returnValue;
	        };
	        StackContainer.prototype.addChild = function (child, size) {
	            if (size === void 0) { size = { flexible: true }; }
	            var returnValue = this.addChildWithoutRelayout(child, size);
	            this.relayout();
	            return returnValue;
	        };
	        StackContainer.prototype.addChildAt = function (child, index) {
	            var result = _super.prototype.addChildAt.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        StackContainer.prototype.swapChildren = function (child, child2) {
	            var result = _super.prototype.swapChildren.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        StackContainer.prototype.getChildIndex = function (child) {
	            var result = _super.prototype.getChildIndex.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        StackContainer.prototype.setChildIndex = function (child, index) {
	            var result = _super.prototype.setChildIndex.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        StackContainer.prototype.getChildAt = function (index) {
	            var result = _super.prototype.getChildAt.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        StackContainer.prototype.removeChild = function (child) {
	            var result = _super.prototype.removeChild.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        StackContainer.prototype.removeChildAt = function (index) {
	            var result = _super.prototype.removeChildAt.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        StackContainer.prototype.removeChildren = function (beginIndex, endIndex) {
	            var result = _super.prototype.removeChildren.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        return StackContainer;
	    }(UIContainer_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = StackContainer;
	    var VContainer = (function (_super) {
	        __extends(VContainer, _super);
	        function VContainer(spacing) {
	            if (spacing === void 0) { spacing = 0; }
	            return _super.call(this, "vertical", spacing) || this;
	        }
	        return VContainer;
	    }(StackContainer));
	    exports.VContainer = VContainer;
	    var HContainer = (function (_super) {
	        __extends(HContainer, _super);
	        function HContainer(spacing) {
	            if (spacing === void 0) { spacing = 0; }
	            return _super.call(this, "horizontal", spacing) || this;
	        }
	        return HContainer;
	    }(StackContainer));
	    exports.HContainer = HContainer;
	    var Spacer = (function (_super) {
	        __extends(Spacer, _super);
	        function Spacer(width, height) {
	            if (width === void 0) { width = 0; }
	            if (height === void 0) { height = 0; }
	            var _this = _super.call(this) || this;
	            _this.width = width;
	            _this.height = height;
	            //dont try and render this
	            _this.visible = false;
	            _this.renderable = false;
	            return _this;
	        }
	        Spacer.prototype.getLocalBounds = function () {
	            return new PIXI.Rectangle(0, 0, this.width, this.height);
	        };
	        return Spacer;
	    }(DisplayObject));
	    exports.Spacer = Spacer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 196:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, PIXI) {
	    "use strict";
	    var UIContainer = (function (_super) {
	        __extends(UIContainer, _super);
	        function UIContainer() {
	            return _super.call(this) || this;
	            //
	            // let oldChildrenChange = this.onChildrenChange;
	            // this.onChildrenChange = ()=>{
	            //     oldChildrenChange();
	            //     this.relayout();
	            // }
	            //DebugDraw.DrawBounds(this);
	        }
	        Object.defineProperty(UIContainer.prototype, "width", {
	            get: function () {
	                return this.getBounds().width;
	            },
	            set: function (value) {
	                if (value !== this._width) {
	                    this._width = value;
	                    this.relayout();
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(UIContainer.prototype, "height", {
	            get: function () {
	                return this.getBounds().height;
	            },
	            set: function (value) {
	                if (value !== this._height) {
	                    this._height = value;
	                    this.relayout();
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });
	        UIContainer.prototype.relayout = function () {
	        };
	        UIContainer.prototype.getBounds = function () {
	            var bounds = _super.prototype.getBounds.call(this).clone();
	            bounds.x = this.pivot.x;
	            bounds.y = this.pivot.y;
	            if (this._width != null) {
	                bounds.width = this._width;
	            }
	            if (this._height != null) {
	                bounds.height = this._height;
	            }
	            return bounds;
	        };
	        UIContainer.prototype.getChildrenBounds = function () {
	            //little hack, getLocalBounds updates all the transforms on the children,
	            //then calls getBounds. Issue is we have overridden get bound so it calls the
	            //wrong get bounds. Our solution is to call the super class twice, super.getLocalBounds to
	            //update the transforms and super.getBounds to get the childrens bounds.
	            var ignore = _super.prototype.getLocalBounds.call(this);
	            return _super.prototype.getBounds.call(this);
	        };
	        UIContainer.prototype.withChild = function (child) {
	            this.addChild(child);
	            return this;
	        };
	        UIContainer.prototype.addChildWithoutRelayout = function (child) {
	            var result = _super.prototype.addChild.apply(this, arguments);
	            return result;
	        };
	        UIContainer.prototype.addChild = function (child) {
	            var result = _super.prototype.addChild.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        UIContainer.prototype.addChildAt = function (child, index) {
	            var result = _super.prototype.addChildAt.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        UIContainer.prototype.swapChildren = function (child, child2) {
	            var result = _super.prototype.swapChildren.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        UIContainer.prototype.getChildIndex = function (child) {
	            var result = _super.prototype.getChildIndex.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        UIContainer.prototype.setChildIndex = function (child, index) {
	            var result = _super.prototype.setChildIndex.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        UIContainer.prototype.getChildAt = function (index) {
	            var result = _super.prototype.getChildAt.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        UIContainer.prototype.removeChild = function (child) {
	            var result = _super.prototype.removeChild.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        UIContainer.prototype.removeChildAt = function (index) {
	            var result = _super.prototype.removeChildAt.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        UIContainer.prototype.removeChildren = function (beginIndex, endIndex) {
	            var result = _super.prototype.removeChildren.apply(this, arguments);
	            this.relayout();
	            return result;
	        };
	        return UIContainer;
	    }(PIXI.Container));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = UIContainer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 197:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(198), __webpack_require__(199), __webpack_require__(200), __webpack_require__(190), __webpack_require__(202), __webpack_require__(186)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, TileLayerDisplay_1, City_1, CityDisplay_1, Ship_1, ShipDisplay_1, Linq) {
	    "use strict";
	    var Container = PIXI.Container;
	    var MapDisplay = (function (_super) {
	        __extends(MapDisplay, _super);
	        function MapDisplay(resources) {
	            var _this = _super.call(this) || this;
	            _this.resources = resources;
	            //we dont support other render orders for now
	            var renderOrder = resources.world.state.renderorder;
	            if (renderOrder != "right-down") {
	                throw Error("render order '${renderOrder}' is not supported. right-down is hte only supported render order");
	            }
	            var map = resources.world.state;
	            //1. background
	            _this.background = _this.addChild(new PIXI.extras.TilingSprite(resources.tileTextures[1], _this.width, _this.height));
	            //2. tiles
	            _this.tileContainer = _this.addChild(new Container());
	            resources.world.tileLayers().forEach(function (layer) {
	                var layerDisplay = new TileLayerDisplay_1.default(map, layer, resources.tileTextures);
	                _this.tileContainer.addChild(layerDisplay);
	            });
	            //3. under object overlay
	            _this.underObjectsOverlay = _this.addChild(new PIXI.Container());
	            //4. objects
	            resources.world.objectsOfType(City_1.CityUtil.TypeName).forEach(function (city) {
	                var cityDisplay = new CityDisplay_1.default(city, resources.tileTextures);
	                _this.addChild(cityDisplay);
	            });
	            _this.shipContainer = _this.addChild(new PIXI.Container());
	            resources.world.objectsOfType(Ship_1.ShipUtil.TypeName).forEach(function (ship) {
	                var cityDisplay = new ShipDisplay_1.default(ship, resources.tileTextures);
	                _this.shipContainer.addChild(cityDisplay);
	            });
	            //4. over object overlay
	            _this.overObjectsOverlay = _this.addChild(new PIXI.Container());
	            //5. grid
	            // let grid = this.addChild(new PIXI.Graphics());
	            // grid.lineStyle(1,0xFFFFFF, 0.5);
	            // for(let row = 0 ; row <= resources.world.state.height; row++){
	            //     grid.moveTo(row*resources.world.state.tileheight,0);
	            //     grid.lineTo(row*resources.world.state.tileheight, resources.world.state.width * resources.world.state.tilewidth);
	            //
	            // }
	            // for(let col=0;col<resources.world.state.width;col++){
	            //     grid.moveTo(0,col*resources.world.state.tilewidth);
	            //     grid.lineTo( resources.world.state.height * resources.world.state.tileheight,col*resources.world.state.tilewidth);
	            // }
	            _this.interactive = true;
	            _this.on("click", _this.onClick, _this);
	            return _this;
	        }
	        MapDisplay.prototype.onClick = function (e) {
	            var selectedItems = [];
	            var city = this.findSelectedCity(e);
	            if (city)
	                selectedItems.push(city);
	            var ship = this.findSelectedShip(e);
	            if (ship)
	                selectedItems.push(ship);
	            this.emit("selection", selectedItems);
	        };
	        MapDisplay.prototype.findSelectedCity = function (e) {
	            var world = this.resources.world;
	            var localPoint = this.toLocal(e.data.global);
	            var tileIndex = this.resources.world.getTileIndex(localPoint);
	            var partOfCityIndexes = world.getExtendedNeighbours(tileIndex, function (index) { return world.isIndexPartOfCity(index); });
	            if (!partOfCityIndexes.any()) {
	                return null;
	            }
	            var city = world.objectsOfType(City_1.CityUtil.TypeName).firstOrDefault(function (city) {
	                return world.getTileIndexesInRect(city).intersect(partOfCityIndexes).any();
	            });
	            return city;
	        };
	        MapDisplay.prototype.findSelectedShip = function (e) {
	            var world = this.resources.world;
	            var localPoint = this.shipContainer.toLocal(e.data.global);
	            var selectedShipDisplay = Linq.from(this.shipContainer.children)
	                .where(function (x) {
	                var localPoint = e.data.getLocalPosition(x);
	                return x.getLocalBounds().contains(localPoint.x, localPoint.y);
	            })
	                .cast()
	                .firstOrDefault();
	            if (selectedShipDisplay)
	                return selectedShipDisplay.ship;
	            return null;
	        };
	        MapDisplay.prototype.setRenderRect = function (rect) {
	            //we will adjust our background in such a way that the tilings aligns wiht our drawn tiles
	            //we will also need to modify the width/height to ensure we still cover the full render area
	            var xTileAligned = Math.floor(rect.x / this.background.texture.width) * this.background.texture.width;
	            var xAdjustment = rect.x - xTileAligned;
	            var yTileAligned = Math.floor(rect.y / this.background.texture.height) * this.background.texture.height;
	            var yAdjustment = rect.y - yTileAligned;
	            this.background.x = xTileAligned;
	            this.background.y = yTileAligned;
	            this.background.width = rect.width + xAdjustment;
	            this.background.height = rect.height + yAdjustment;
	        };
	        MapDisplay.prototype.getBounds = function () {
	            var worldState = this.resources.world.state;
	            return new PIXI.Rectangle(0, 0, worldState.width * worldState.tilewidth, worldState.height * worldState.tileheight);
	        };
	        return MapDisplay;
	    }(PIXI.Container));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = MapDisplay;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 198:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, PIXI) {
	    "use strict";
	    var TileLayerDisplay = (function (_super) {
	        __extends(TileLayerDisplay, _super);
	        function TileLayerDisplay(map, layer, tileMap) {
	            var _this = _super.call(this) || this;
	            for (var i = 0; i < layer.data.length; i++) {
	                var gid = layer.data[i];
	                var texture = tileMap[gid];
	                //let properties = 
	                //only draw the item if we actuall yhave a texture
	                if (texture) {
	                    var tileCol = i % layer.width;
	                    var tileRow = Math.floor(i / layer.height);
	                    var sprite = new PIXI.Sprite(texture);
	                    //we will position based on the bottom right tile when the tileset is multiple tiles high
	                    sprite.pivot.y = texture.height - map.tileheight;
	                    sprite.x = map.tilewidth * tileCol;
	                    sprite.y = map.tileheight * tileRow;
	                    _this.addChild(sprite);
	                }
	            }
	            return _this;
	        }
	        return TileLayerDisplay;
	    }(PIXI.Container));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = TileLayerDisplay;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 199:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.CityType = "City";
	    var CityUtil = (function () {
	        function CityUtil() {
	        }
	        CityUtil.IsCity = function (layerObj) {
	            return layerObj && layerObj.type === this.TypeName;
	        };
	        return CityUtil;
	    }());
	    exports.CityUtil = CityUtil;
	    CityUtil.TypeName = "City";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 200:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(201)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, LayerObjectDisplay_1) {
	    "use strict";
	    var CityDisplay = (function (_super) {
	        __extends(CityDisplay, _super);
	        function CityDisplay(city, tileMap) {
	            var _this = _super.call(this, city, tileMap) || this;
	            _this.city = city;
	            _this.tileMap = tileMap;
	            _this.interactive = true;
	            return _this;
	        }
	        return CityDisplay;
	    }(LayerObjectDisplay_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = CityDisplay;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 201:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, PIXI) {
	    "use strict";
	    var LayerObjectDisplay = (function (_super) {
	        __extends(LayerObjectDisplay, _super);
	        function LayerObjectDisplay(layerObject, tileMap) {
	            var _this = _super.call(this) || this;
	            _this.layerObject = layerObject;
	            _this.tileMap = tileMap;
	            _this.pivot.y = layerObject.height;
	            _this.x = layerObject.x;
	            _this.y = layerObject.y;
	            if (layerObject.gid) {
	                var texture = tileMap[layerObject.gid];
	                var sprite = new PIXI.Sprite(texture);
	                sprite.scale.x = layerObject.width / texture.width;
	                sprite.scale.y = layerObject.height / texture.height;
	                _this.addChild(sprite);
	            }
	            return _this;
	        }
	        return LayerObjectDisplay;
	    }(PIXI.Container));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = LayerObjectDisplay;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 202:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, PIXI) {
	    "use strict";
	    var ShipDisplay = (function (_super) {
	        __extends(ShipDisplay, _super);
	        function ShipDisplay(ship, tileMap) {
	            var _this = _super.call(this, tileMap[37]) || this;
	            _this.ship = ship;
	            _this.tileMap = tileMap;
	            _this.pivot.x = _this.texture.width / 2;
	            _this.pivot.y = _this.texture.height / 2;
	            _this.x = ship.x;
	            _this.y = ship.y;
	            PIXI.ticker.shared.add(function () {
	                var newx = ship.x;
	                var newy = ship.y;
	                if (_this.x > newx)
	                    _this.scale.x = 1;
	                else if (_this.x < newy)
	                    _this.scale.x = -1;
	                _this.x = newx;
	                _this.y = newy;
	            });
	            return _this;
	            // this.interactive = true;
	            // this.on("click", (e)=>{
	            //     e.data.selection = (e.data.selection || [])
	            //     e.data.selection.push(this.ship);
	            // })
	        }
	        return ShipDisplay;
	    }(PIXI.Sprite));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = ShipDisplay;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 203:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(180), __webpack_require__(204), __webpack_require__(205), __webpack_require__(196)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Util_1, Interactions_1, PlayerLookAt_1, UIContainer_1) {
	    "use strict";
	    var Camera = (function (_super) {
	        __extends(Camera, _super);
	        function Camera(resources, target, minZoom, maxZoom) {
	            if (minZoom === void 0) { minZoom = 1; }
	            if (maxZoom === void 0) { maxZoom = 1; }
	            var _this = _super.call(this) || this;
	            _this.resources = resources;
	            _this.target = target;
	            _this.minZoom = minZoom;
	            _this.maxZoom = maxZoom;
	            _this.addChild(target);
	            _this.resources.world.onCommand(PlayerLookAt_1.default, function () { return _this.lookAtPlayer(); });
	            //setup the panning
	            Interactions_1.panable(_this);
	            _this.on('panmove', function (event) {
	                var newLookAt = _this.constrainLookAt({
	                    x: _this.target.pivot.x - event.deltaX,
	                    y: _this.target.pivot.y - event.deltaY
	                });
	                _this.resources.world.issueCommand(new PlayerLookAt_1.default(newLookAt));
	            });
	            return _this;
	        }
	        Camera.prototype.relayout = function () {
	            this.lookAtPlayer();
	            this.setChildRenderRect();
	        };
	        Camera.prototype.lookAtPlayer = function () {
	            //center our screen on the player
	            var player = this.resources.world.player();
	            this.lookAt({
	                x: player.x + player.width / 2,
	                y: player.y + player.height / 2
	            });
	        };
	        Camera.prototype.lookAt = function (point) {
	            //console.log(point);
	            point = this.constrainLookAt(point);
	            this.target.pivot.x = Math.floor(point.x);
	            this.target.pivot.y = Math.floor(point.y);
	            this.target.x = Math.floor(this.width / 2);
	            this.target.y = Math.floor(this.height / 2);
	            this.setChildRenderRect();
	        };
	        Camera.prototype.constrainLookAt = function (point) {
	            var viewRect = {
	                x: point.x - this.width / 2,
	                y: point.y - this.height / 2,
	                width: this.width,
	                height: this.height
	            };
	            var worldRect = {
	                x: 0,
	                y: 0,
	                width: this.target.width,
	                height: this.target.height
	            };
	            viewRect = this.constrainRect(viewRect, worldRect);
	            return {
	                x: viewRect.x + viewRect.width / 2,
	                y: viewRect.y + viewRect.height / 2
	            };
	        };
	        Camera.prototype.constrainRect = function (rect, constraint) {
	            if (rect.width < constraint.width) {
	                //view rect is within the constraint
	                if (rect.x < constraint.x)
	                    rect.x = constraint.x;
	                if (rect.x + rect.width > constraint.x + constraint.width)
	                    rect.x = constraint.x + constraint.width - rect.width;
	            }
	            else if (rect.width >= constraint.width) {
	                //view rect contains the constract
	                if (rect.x > constraint.x)
	                    rect.x = constraint.x;
	                if (rect.x + rect.width < constraint.x + constraint.width)
	                    rect.x = constraint.x + constraint.width - rect.width;
	            }
	            if (rect.height < constraint.height) {
	                //view rect is within the constraint
	                if (rect.y < constraint.y)
	                    rect.y = constraint.y;
	                if (rect.y + rect.height > constraint.y + constraint.height)
	                    rect.y = constraint.y + constraint.height - rect.height;
	            }
	            else if (rect.height >= constraint.height) {
	                //view rect contains the constraint
	                if (rect.y > constraint.y)
	                    rect.y = constraint.y;
	                if (rect.y + rect.height < constraint.y + constraint.height)
	                    rect.y = constraint.y + constraint.height - rect.height;
	            }
	            return rect;
	        };
	        Camera.prototype.setChildRenderRect = function () {
	            Util_1.default.TrySetRenderRect(this.target, {
	                x: this.target.pivot.x - this.target.x,
	                y: this.target.pivot.y - this.target.y,
	                width: this.width, height: this.height
	            });
	        };
	        return Camera;
	    }(UIContainer_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = Camera;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 204:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    function panable(sprite) {
	        function mouseDown(e) {
	            start(e, e.data.originalEvent);
	        }
	        function touchStart(e) {
	            start(e, e.data.originalEvent.targetTouches[0]);
	        }
	        // possibly be called twice or more
	        function start(e, t) {
	            if (e.target._pan) {
	                return;
	            }
	            e.target._pan = {
	                p: {
	                    x: t.clientX,
	                    y: t.clientY,
	                    date: new Date()
	                }
	            };
	            e.target
	                .on('mousemove', mouseMove)
	                .on('touchmove', touchMove);
	        }
	        function mouseMove(e) {
	            move(e, e.data.originalEvent);
	        }
	        function touchMove(e) {
	            var t = e.data.originalEvent.targetTouches;
	            if (!t || t.length > 1) {
	                end(e);
	                return;
	            }
	            move(e, t[0]);
	        }
	        function move(e, t) {
	            var now = new Date();
	            var interval = now - e.target._pan.p.date;
	            if (interval < 12) {
	                return;
	            }
	            var dx = t.clientX - e.target._pan.p.x;
	            var dy = t.clientY - e.target._pan.p.y;
	            var distance = Math.sqrt(dx * dx + dy * dy);
	            if (!e.target._pan.pp) {
	                var threshold = (t instanceof window.MouseEvent) ? 2 : 7;
	                if (distance > threshold) {
	                    e.target.emit('panstart');
	                    e.target._pan.pp = {};
	                }
	                return;
	            }
	            var event = {
	                deltaX: dx,
	                deltaY: dy,
	                velocity: distance / interval,
	                data: e.data
	            };
	            e.target.emit('panmove', event);
	            e.target._pan.pp = {
	                x: e.target._pan.p.x,
	                y: e.target._pan.p.y,
	                date: e.target._pan.p.date
	            };
	            e.target._pan.p = {
	                x: t.clientX,
	                y: t.clientY,
	                date: now
	            };
	        }
	        // TODO: Inertia Mode
	        // possibly be called twice or more
	        function end(e) {
	            if (e.target._pan && e.target._pan.pp) {
	                e.target.emit('panend');
	            }
	            e.target._pan = null;
	            e.target
	                .removeListener('mousemove', mouseMove)
	                .removeListener('touchmove', touchMove);
	        }
	        sprite.interactive = true;
	        sprite
	            .on('mousedown', mouseDown)
	            .on('touchstart', touchStart)
	            .on('mouseup', end)
	            .on('mouseupoutside', end)
	            .on('touchend', end)
	            .on('touchendoutside', end);
	    }
	    exports.panable = panable;
	    function pinchable(sprite) {
	        function start(e) {
	            e.target.on('touchmove', move);
	        }
	        function move(e) {
	            var t = e.data.originalEvent.targetTouches;
	            if (!t || t.length < 2) {
	                return;
	            }
	            var dx = t[0].clientX - t[1].clientX;
	            var dy = t[0].clientY - t[1].clientY;
	            var distance = Math.sqrt(dx * dx + dy * dy);
	            if (!e.target._pinch) {
	                e.target._pinch = {
	                    p: { distance: distance, date: new Date() },
	                    pp: {}
	                };
	                e.target.emit('pinchstart');
	                return;
	            }
	            var center = {
	                x: (t[0].clientX + t[1].clientX) / 2,
	                y: (t[0].clientY + t[1].clientY) / 2
	            };
	            var now = new Date();
	            var interval = now - e.target._pinch.p.date;
	            if (interval < 12) {
	                return;
	            }
	            var event = {
	                scale: distance / e.target._pinch.p.distance,
	                velocity: distance / interval,
	                center: center,
	                data: e.data
	            };
	            e.target.emit('pinchmove', event);
	            e.target._pinch.pp = {
	                distance: e.target._pinch.p.distance,
	                date: e.target._pinch.p.date
	            };
	            e.target._pinch.p = {
	                distance: distance,
	                date: now
	            };
	        }
	        // TODO: Inertia Mode
	        function end(e) {
	            if (e.target._pinch) {
	                e.target.emit('pinchend');
	            }
	            e.target._pinch = null;
	            e.target.removeListener('touchmove', move);
	        }
	        sprite.interactive = true;
	        sprite
	            .on('touchstart', start)
	            .on('touchend', end)
	            .on('touchendoutside', end);
	    }
	    exports.pinchable = pinchable;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 205:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(189)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Command_1) {
	    "use strict";
	    var PlayerLookAt = (function () {
	        function PlayerLookAt(point, zoom) {
	            if (zoom === void 0) { zoom = 1; }
	            this.point = point;
	            this.zoom = zoom;
	            point.x = Math.floor(point.x);
	            point.y = Math.floor(point.y);
	        }
	        PlayerLookAt.prototype.execute = function (world) {
	            var player = world.player();
	            player.x = this.point.x - player.width / 2;
	            player.y = this.point.y - player.height / 2;
	            return Command_1.SuccessResult;
	        };
	        PlayerLookAt.prototype.canExecute = function (world) {
	            return Command_1.SuccessResult;
	        };
	        return PlayerLookAt;
	    }());
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = PlayerLookAt;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 206:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(207), __webpack_require__(2), __webpack_require__(216), __webpack_require__(196)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, CityMenu_1, PIXI, PaddedContainer_1, UIContainer_1) {
	    "use strict";
	    var MenuContainer = (function (_super) {
	        __extends(MenuContainer, _super);
	        function MenuContainer(resources) {
	            var _this = _super.call(this) || this;
	            _this.resources = resources;
	            _this.background = new PIXI.extras.TilingSprite(resources.menuBackground, _this.width, _this.height);
	            _this.backgroundEdge = new PIXI.extras.TilingSprite(resources.menuBorder, resources.menuBorder.width, _this.height);
	            _this.content = new PaddedContainer_1.default(10, 10, 10, 10);
	            _this.addChild(_this.background);
	            _this.addChild(_this.backgroundEdge);
	            _this.addChild(_this.content);
	            return _this;
	        }
	        MenuContainer.prototype.relayout = function () {
	            this.content.width = this.width;
	            this.content.height = this.height;
	            //we will add some padding to the right to make room for hte shadow line
	            var edgeWidth = this.backgroundEdge.texture.width;
	            this.background.width = this.width - edgeWidth;
	            this.background.height = this.height;
	            this.backgroundEdge.height = this.height;
	            this.backgroundEdge.width = edgeWidth;
	            this.backgroundEdge.x = this.background.width;
	        };
	        MenuContainer.prototype.showMenu = function (newMenu) {
	            this.content.removeChildren();
	            this.content.addChild(newMenu);
	        };
	        MenuContainer.prototype.showCityMenu = function (city) {
	            this.showMenu(new CityMenu_1.default(this.resources, city));
	        };
	        return MenuContainer;
	    }(UIContainer_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = MenuContainer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 207:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(191), __webpack_require__(186), __webpack_require__(195), __webpack_require__(208), __webpack_require__(209), __webpack_require__(195), __webpack_require__(195), __webpack_require__(190), __webpack_require__(210), __webpack_require__(212), __webpack_require__(213), __webpack_require__(215)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Properties_1, Linq, StackContainer_1, CityHarvest_1, Resource_1, StackContainer_2, StackContainer_3, Ship_1, UIText_1, UISprite_1, UINinePatchButton_1, ShipBuyResource_1) {
	    "use strict";
	    var CityMenu = (function (_super) {
	        __extends(CityMenu, _super);
	        function CityMenu(resources, city) {
	            var _this = _super.call(this, 20) || this;
	            _this.resources = resources;
	            _this.city = city;
	            _this.rowCache = {};
	            var updateFn = _this.refreshDataBindings.bind(_this);
	            _this.on("added", function () {
	                _this.refreshDataBindings();
	                _this.resources.world.onCommands([CityHarvest_1.default, ShipBuyResource_1.default], updateFn);
	            });
	            _this.on("removed", function () {
	                _this.resources.world.offCommands([CityHarvest_1.default, ShipBuyResource_1.default], updateFn);
	            });
	            _this.refreshDataBindings();
	            return _this;
	        }
	        CityMenu.prototype.buildDataBoundResourceRow = function (ship, resourceMeta) {
	            var _this = this;
	            var cityAmountText;
	            var shipAmountText;
	            var buyButton = new UINinePatchButton_1.default(this.resources.buySellButton, new UIText_1.default("Buy"), function () {
	                _this.resources.world.issueCommand(new ShipBuyResource_1.default(ship, _this.city, resourceMeta));
	            });
	            var sellButton = new UINinePatchButton_1.default(this.resources.buySellButton, new UIText_1.default("Sell"), function () {
	                _this.resources.world.issueCommand(new ShipBuyResource_1.default(ship, _this.city, resourceMeta));
	            });
	            ;
	            var row = new StackContainer_2.HContainer().cells([
	                [{ flexible: true }, this.buildIcon(resourceMeta, 1.8)],
	                [{ pixels: 20 }, new StackContainer_3.Spacer()],
	                [{ weight: 1 }, new StackContainer_1.VContainer().cells([
	                        [{ weight: 1 }, new StackContainer_2.HContainer().cells([
	                                [{ flexible: true }, this.buildIconFromTexture(this.resources.cityIcon)],
	                                [{ weight: 1 }, cityAmountText = new UIText_1.default("")],
	                                [{ weight: 2 }, sellButton]
	                            ])],
	                        [{ weight: 1 }, new StackContainer_2.HContainer().cells([
	                                [{ flexible: true }, this.buildIcon(ship)],
	                                [{ weight: 1 }, shipAmountText = new UIText_1.default("")],
	                                [{ weight: 2 }, buyButton]
	                            ])]
	                    ])]
	            ]);
	            row.refreshDataBindings = function () {
	                var inventoryName = Properties_1.Properties.InventoryPropertyName(resourceMeta.name);
	                cityAmountText.text.text = _this.city.properties[inventoryName] || 0 + "";
	                shipAmountText.text.text = ship.properties[inventoryName] || 0 + "";
	                cityAmountText.relayout();
	                shipAmountText.relayout();
	            };
	            return row;
	        };
	        CityMenu.prototype.refreshDataBindings = function () {
	            var _this = this;
	            var resourceMetas = this.resources.world.objectsOfType(Resource_1.ResourceUtil.TypeName).toDictionary(function (r) { return r.name; });
	            var ship = this.resources.world.objectOfType(Ship_1.ShipUtil.TypeName);
	            this.removeChildren();
	            this.addChild(new UIText_1.default(Ship_1.ShipUtil.TotalResources(ship) + " / " + ship.properties.resourceLimit));
	            Linq.from(this.city.properties).where(function (kvp) { return Properties_1.Properties.IsInventory(kvp.key); }).forEach(function (kvp) {
	                var resourceName = Properties_1.Properties.InventoryResourceName(kvp.key);
	                var resourceAmount = kvp.value;
	                var resourceMeta = resourceMetas.get(resourceName);
	                _this.rowCache[resourceName] = _this.rowCache[resourceName] || _this.buildDataBoundResourceRow(ship, resourceMeta);
	                var rowItem = _this.rowCache[resourceName];
	                rowItem.refreshDataBindings();
	                _this.cell({ pixels: 70 }, rowItem);
	            });
	        };
	        CityMenu.prototype.buildSellButton = function () {
	            var button = new UINinePatchButton_1.default(this.resources.buySellButton, new UIText_1.default("Sell"), function () {
	                console.log("sell");
	            });
	            return button;
	        };
	        CityMenu.prototype.buildIcon = function (obj, scale) {
	            if (scale === void 0) { scale = 1; }
	            if (obj.gid) {
	                return this.buildIconFromTexture(this.resources.tileTextures[obj.gid]);
	            }
	            else {
	                return new PIXI.Text(obj.gid + "");
	            }
	        };
	        CityMenu.prototype.buildIconFromTexture = function (texture, scale) {
	            if (scale === void 0) { scale = 1; }
	            var sprite = new UISprite_1.default(texture);
	            sprite.sprite.scale.set(scale, scale);
	            sprite.relayout();
	            return sprite;
	        };
	        return CityMenu;
	    }(StackContainer_1.VContainer));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = CityMenu;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 208:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(189), __webpack_require__(199), __webpack_require__(186), __webpack_require__(191)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Command_1, City_1, Enumerable, Properties_1) {
	    "use strict";
	    var CityHarvest = (function () {
	        function CityHarvest() {
	        }
	        CityHarvest.TryApplyProduction = function (productionProps, targetProperties) {
	            var productionPropertyEnumerable = Enumerable.from(productionProps)
	                .where(function (kvp) { return Properties_1.Properties.IsProduction(kvp.key); });
	            //if our production requires consumption we will not create anything
	            //unless we have the inventory to do so
	            var canApply = productionPropertyEnumerable
	                .where(function (kvp) { return kvp.value < 0; })
	                .all(function (kvp) {
	                var resource = Properties_1.Properties.ProductionResourceName(kvp.key);
	                return targetProperties[Properties_1.Properties.InventoryPropertyName(resource)] + kvp.value > 0;
	            });
	            if (!canApply) {
	                return false;
	            }
	            //add all the production values to hte inventory
	            productionPropertyEnumerable.forEach(function (kvp) {
	                var resource = Properties_1.Properties.ProductionResourceName(kvp.key);
	                return targetProperties[Properties_1.Properties.InventoryPropertyName(resource)] = (targetProperties[Properties_1.Properties.InventoryPropertyName(resource)] || 0) + kvp.value;
	            });
	            return true;
	        };
	        CityHarvest.prototype.executeXXX = function (world) {
	            // world.objectsOfType(CityType).forEach(city=>{
	            //     Enumerable.from(world.tileLayers())
	            //         .selectMany(layer=>world.tileGidsInRect(layer,city))
	            //         .select(gid=>world.tileProperties(gid))
	            //         .forEach(prop=>{
	            //             city.properties = city.properties || {};
	            //             CityHarvest.TryApplyProduction(prop, city.properties);
	            //         });
	            // });
	            return Command_1.SuccessResult;
	        };
	        CityHarvest.prototype.execute = function (world) {
	            world.objectsOfType(City_1.CityType).forEach(function (city) {
	                var cityCenter = {
	                    x: city.x + city.width / 2,
	                    y: city.y - city.height / 2
	                };
	                var cityTileIndex = world.getTileIndex(cityCenter);
	                world.getExtendedNeighbours(cityTileIndex, function () { return true; }).toArray();
	                Enumerable.from(world.tileLayers())
	                    .selectMany(function (layer) { return world
	                    .getExtendedNeighbours(cityTileIndex, function (tileIndex) {
	                    return tileIndex === cityTileIndex || world.getTilePropertiesFromIndex(layer, tileIndex).isPartOfCity;
	                })
	                    .select(function (tileIndex) { return world.getTilePropertiesFromIndex(layer, tileIndex); }); })
	                    .forEach(function (prop) {
	                    city.properties = city.properties || {};
	                    CityHarvest.TryApplyProduction(prop, city.properties);
	                });
	            });
	            return Command_1.SuccessResult;
	        };
	        CityHarvest.prototype.canExecute = function (world) {
	            return Command_1.SuccessResult;
	        };
	        return CityHarvest;
	    }());
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = CityHarvest;
	    CityHarvest.TypeName = "CityHarvest";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 209:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var ResourceUtil = (function () {
	        function ResourceUtil() {
	        }
	        ResourceUtil.IsResource = function (layerObj) {
	            return layerObj && layerObj.type === this.TypeName;
	        };
	        return ResourceUtil;
	    }());
	    exports.ResourceUtil = ResourceUtil;
	    ResourceUtil.TypeName = "Resource";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 210:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(211)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, PIXI, AlignContainer_1) {
	    "use strict";
	    var UIText = (function (_super) {
	        __extends(UIText, _super);
	        function UIText(text, style) {
	            if (style === void 0) { style = UIText.DefaultTextStyle; }
	            var _this = _super.call(this) || this;
	            _this.text = new PIXI.Text(text, style);
	            return _this;
	        }
	        Object.defineProperty(UIText.prototype, "text", {
	            get: function () {
	                return this._text;
	            },
	            set: function (text) {
	                this.removeChild(this._text);
	                this._text = this.addChild(text);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return UIText;
	    }(AlignContainer_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = UIText;
	    UIText.DefaultTextStyle = { font: "bold 20px Tahoma, Geneva, sans-serif", fill: "#333", align: "center" };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 211:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(196)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, UIContainer_1) {
	    "use strict";
	    var AlignContainer = (function (_super) {
	        __extends(AlignContainer, _super);
	        function AlignContainer(options) {
	            if (options === void 0) { options = {}; }
	            var _this = _super.call(this) || this;
	            _this.options = options;
	            _this.options = options;
	            return _this;
	        }
	        AlignContainer.prototype.relayout = function () {
	            var childrenBounds = this.getChildrenBounds();
	            var thisBounds = this.getBounds();
	            switch (this.options.horizontalAlign) {
	                case "left":
	                    this.pivot.x = 0;
	                    break;
	                case "right":
	                    this.pivot.x = -(thisBounds.width - childrenBounds.width);
	                    break;
	                case "center":
	                default:
	                    this.pivot.x = -Math.floor((thisBounds.width - childrenBounds.width) / 2);
	                    break;
	            }
	            switch (this.options.verticalAlign) {
	                case "top":
	                    this.pivot.y = 0;
	                    break;
	                case "bottom":
	                    this.pivot.y = -(thisBounds.height - childrenBounds.height);
	                    break;
	                case "middle":
	                default:
	                    this.pivot.y = -Math.floor((thisBounds.height - childrenBounds.height) / 2);
	                    break;
	            }
	        };
	        return AlignContainer;
	    }(UIContainer_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = AlignContainer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 212:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(211)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, PIXI, AlignContainer_1) {
	    "use strict";
	    var UISprite = (function (_super) {
	        __extends(UISprite, _super);
	        function UISprite(texture) {
	            var _this = _super.call(this) || this;
	            _this.sprite = new PIXI.Sprite(texture);
	            return _this;
	        }
	        Object.defineProperty(UISprite.prototype, "sprite", {
	            get: function () {
	                return this._sprite;
	            },
	            set: function (sprite) {
	                this.removeChild(this._sprite);
	                this._sprite = this.addChild(sprite);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return UISprite;
	    }(AlignContainer_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = UISprite;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 213:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(214), __webpack_require__(196), __webpack_require__(181)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, NinePatch_1, UIContainer_1, TWEEN) {
	    "use strict";
	    var UINinePatchButton = (function (_super) {
	        __extends(UINinePatchButton, _super);
	        function UINinePatchButton(textures, text, clickAction) {
	            var _this = _super.call(this) || this;
	            _this.textures = textures;
	            _this.text = text;
	            _this.buttonMode = true;
	            _this.interactive = true;
	            _this.upNinePatch = _this.addChildWithoutRelayout(new NinePatch_1.default(new UIContainer_1.default()).loadFromAndroidImage(textures.up));
	            _this.downNinePatch = _this.addChildWithoutRelayout(new NinePatch_1.default(new UIContainer_1.default()).loadFromAndroidImage(textures.down));
	            _this.content = _this.addChildWithoutRelayout(text);
	            _this.downNinePatch.alpha = 1;
	            if (clickAction != null)
	                _this.on("fire", clickAction, _this);
	            _this.on("mousedown", _this.fire, _this);
	            _this.relayout();
	            return _this;
	        }
	        UINinePatchButton.prototype.fire = function () {
	            this.downNinePatch.alpha = 0;
	            this.emit("fire");
	            new TWEEN.Tween(this.downNinePatch)
	                .to({ alpha: 1 }, 300)
	                .start();
	        };
	        UINinePatchButton.prototype.relayout = function () {
	            this.upNinePatch.width = this.width;
	            this.upNinePatch.height = this.height;
	            this.downNinePatch.width = this.width;
	            this.downNinePatch.height = this.height;
	            this.content.width = this.upNinePatch.content.width;
	            this.content.height = this.upNinePatch.content.height;
	            this.content.x = this.upNinePatch.content.x;
	            this.content.y = this.upNinePatch.content.y;
	        };
	        return UINinePatchButton;
	    }(UIContainer_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = UINinePatchButton;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 214:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, PIXI) {
	    "use strict";
	    var Sprite = PIXI.Sprite;
	    var NinePatch = (function (_super) {
	        __extends(NinePatch, _super);
	        function NinePatch(content) {
	            if (content === void 0) { content = new PIXI.Container(); }
	            var _this = _super.call(this) || this;
	            _this.patchSprites = [];
	            _this.totalStretchableWidth = 0;
	            _this.totalFixedWidth = 0;
	            _this.totalStretchableHeight = 0;
	            _this.totalFixedHeight = 10;
	            _this._paddingTop = 0;
	            _this._paddingRight = 0;
	            _this._paddingBottom = 0;
	            _this._paddingLeft = 0;
	            //add our content, this should always be the last child
	            //we will also listen to new children on our content and
	            //relayout, new children usually mean the size will change
	            _this.content = _super.prototype.addChild.call(_this, content);
	            _this.content.onChildrenChange = function () {
	                _this.relayout();
	            };
	            return _this;
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
	        Object.defineProperty(NinePatch.prototype, "width", {
	            get: function () { return this.content.width + this.paddingLeft + this.paddingRight; },
	            set: function (value) {
	                this.content.width = Math.max(0, value - this.paddingLeft - this.paddingRight);
	                this.relayout();
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(NinePatch.prototype, "height", {
	            get: function () { return this.content.height + this.paddingTop + this.paddingBottom; },
	            set: function (value) {
	                this.content.height = Math.max(0, value - this.paddingTop - this.paddingBottom);
	                this.relayout();
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
	        NinePatch.prototype.getBounds = function () {
	            return new PIXI.Rectangle(0, 0, this.content.width + this.paddingLeft + this.paddingRight, this.content.height + this.paddingTop + this.paddingBottom);
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
	            var ctx = canvasRenderer.rootContext;
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
	                    textures[vMarkerIndex][hMarkerIndex] = new PIXI.Texture(android9PatchImage.baseTexture, rect);
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
	        return NinePatch;
	    }(PIXI.Container));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = NinePatch;
	    NinePatch.AndroidNinePatchDataCache = {};
	    ;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 215:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(189), __webpack_require__(190), __webpack_require__(191)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Command_1, Ship_1, Properties_1) {
	    "use strict";
	    var ShipBuyResource = (function () {
	        function ShipBuyResource(ship, city, resource) {
	            this.ship = ship;
	            this.city = city;
	            this.resource = resource;
	        }
	        ShipBuyResource.prototype.execute = function (world) {
	            var canExecute = this.canExecute(world);
	            if (!canExecute.isSuccessful)
	                return canExecute;
	            var inventoryName = Properties_1.Properties.InventoryPropertyName(this.resource.name);
	            var shipInventory = this.ship.properties[inventoryName] || 0;
	            var cityInventory = this.city.properties[inventoryName] || 0;
	            this.city.properties[inventoryName] = cityInventory - 1;
	            this.ship.properties[inventoryName] = shipInventory + 1;
	            return Command_1.SuccessResult;
	        };
	        ShipBuyResource.prototype.canExecute = function (world) {
	            var inventoryName = Properties_1.Properties.InventoryPropertyName(this.resource.name);
	            var cityInventory = this.city.properties[inventoryName] || 0;
	            if (cityInventory <= 0)
	                return new Command_1.CityDoesNotHaveRequiredResource(this.city, this.resource.name);
	            var shipTotalResources = Ship_1.ShipUtil.TotalResources(this.ship);
	            if (shipTotalResources >= this.ship.properties.resourceLimit)
	                return new Command_1.ShipDoesNotHaveCapacity(this.ship);
	            return Command_1.SuccessResult;
	        };
	        return ShipBuyResource;
	    }());
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = ShipBuyResource;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 216:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(196)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, UIContainer_1) {
	    "use strict";
	    var PaddedContainer = (function (_super) {
	        __extends(PaddedContainer, _super);
	        function PaddedContainer(paddingTop, paddingRight, paddingBottom, paddingLeft) {
	            if (paddingTop === void 0) { paddingTop = 0; }
	            if (paddingRight === void 0) { paddingRight = 0; }
	            if (paddingBottom === void 0) { paddingBottom = 0; }
	            if (paddingLeft === void 0) { paddingLeft = 0; }
	            var _this = _super.call(this) || this;
	            _this.pivot.y = -paddingTop;
	            _this._paddingRight = paddingRight;
	            _this._paddingBottom = paddingBottom;
	            _this.pivot.x = -paddingLeft;
	            return _this;
	        }
	        Object.defineProperty(PaddedContainer.prototype, "paddingTop", {
	            get: function () {
	                return -this.pivot.y;
	            },
	            set: function (value) {
	                this.pivot.y = -value;
	                this.relayout();
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(PaddedContainer.prototype, "paddingLeft", {
	            get: function () {
	                return -this.pivot.x;
	            },
	            set: function (value) {
	                this.pivot.x = -value;
	                this.relayout();
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(PaddedContainer.prototype, "paddingRight", {
	            get: function () {
	                return this._paddingRight;
	            },
	            set: function (value) {
	                this._paddingRight = value;
	                this.relayout();
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(PaddedContainer.prototype, "paddingBottom", {
	            get: function () {
	                return this._paddingBottom;
	            },
	            set: function (value) {
	                this._paddingBottom = value;
	                this.relayout();
	            },
	            enumerable: true,
	            configurable: true
	        });
	        PaddedContainer.prototype.relayout = function () {
	            var _this = this;
	            this.children.forEach(function (child) {
	                var anyChild = child;
	                if (anyChild.width != null)
	                    anyChild.width = _this.width - _this.paddingLeft - _this.paddingRight;
	                if (anyChild.height != null)
	                    anyChild.height = _this.height - _this.paddingTop - _this.paddingBottom;
	            });
	        };
	        return PaddedContainer;
	    }(UIContainer_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = PaddedContainer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 217:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(181), __webpack_require__(193), __webpack_require__(218)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, PIXI, TWEEN, Coordinates_1, ShipMove_1) {
	    "use strict";
	    var ShipPathOverlay = (function (_super) {
	        __extends(ShipPathOverlay, _super);
	        function ShipPathOverlay(resources, ship) {
	            var _this = _super.call(this) || this;
	            _this.resources = resources;
	            _this.ship = ship;
	            _this.on("added", _this.startListening, _this);
	            _this.on("removed", _this.stopListening, _this);
	            _this.addChild(new ShipPath(resources, ship));
	            return _this;
	        }
	        ShipPathOverlay.prototype.startListening = function () {
	            this.resources.world.onCommand(ShipMove_1.default, this.recreatePathIfShipMoveIsThisShip, this);
	        };
	        ShipPathOverlay.prototype.stopListening = function () {
	            this.resources.world.offCommand(ShipMove_1.default, this.recreatePathIfShipMoveIsThisShip, this);
	        };
	        ShipPathOverlay.prototype.recreatePathIfShipMoveIsThisShip = function (shipMove) {
	            if (shipMove.ship === this.ship) {
	                this.children.forEach(function (child) { return child.animateOut(); });
	                this.addChild(new ShipPath(this.resources, this.ship)).animateIn();
	            }
	        };
	        ShipPathOverlay.prototype.animateIn = function () {
	            var _this = this;
	            this.alpha = 0;
	            var alpha = { alpha: 0 };
	            new TWEEN.Tween(alpha).to({ alpha: 1 }, 100)
	                .onUpdate(function (k) { return _this.alpha = alpha.alpha; })
	                .start();
	            return this;
	        };
	        ShipPathOverlay.prototype.animateOut = function (complete) {
	            var _this = this;
	            var alpha = { alpha: 1 };
	            new TWEEN.Tween(alpha).to({ alpha: 0 }, 100)
	                .onUpdate(function (k) { return _this.alpha = alpha.alpha; })
	                .onComplete(function () {
	                _this.parent.removeChild(_this);
	                if (complete)
	                    complete();
	            })
	                .start();
	            return this;
	        };
	        return ShipPathOverlay;
	    }(PIXI.Container));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = ShipPathOverlay;
	    var ShipPath = (function (_super) {
	        __extends(ShipPath, _super);
	        function ShipPath(resources, ship) {
	            var _this = _super.call(this) || this;
	            _this.resources = resources;
	            _this.removing = false;
	            _this._ship = ship;
	            _this.moveFromPath = _this.addChild(new PIXI.Graphics());
	            _this.moveFromPath.filters = [ShipPath.Blur];
	            _this.moveFromPathMask = _this.addChild(new PIXI.Graphics());
	            _this.moveFromPath.mask = _this.moveFromPathMask;
	            _this.moveToPath = _this.addChild(new PIXI.Graphics());
	            _this.moveToPath.filters = [ShipPath.Blur];
	            _this.moveToPathMask = _this.addChild(new PIXI.Graphics());
	            _this.moveToPath.mask = _this.moveToPathMask;
	            _this.on("added", _this.startListening, _this);
	            _this.on("removed", _this.stopListening, _this);
	            _this.refreshPath();
	            return _this;
	        }
	        Object.defineProperty(ShipPath.prototype, "ship", {
	            get: function () {
	                return this._ship;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        ShipPath.prototype.startListening = function () {
	            PIXI.ticker.shared.add(this.refreshPathProgress, this);
	        };
	        ShipPath.prototype.stopListening = function () {
	            PIXI.ticker.shared.remove(this.refreshPathProgress, this);
	        };
	        ShipPath.prototype.refreshPathIfShipMoveIsThisShip = function (shipMove) {
	            if (shipMove.ship === this.ship)
	                this.refreshPath();
	        };
	        ShipPath.prototype.animateIn = function () {
	            var _this = this;
	            this.alpha = 0;
	            var alpha = { alpha: 0 };
	            new TWEEN.Tween(alpha).to({ alpha: 1 }, 200)
	                .onUpdate(function (k) { return _this.alpha = alpha.alpha; })
	                .start();
	            return this;
	        };
	        ShipPath.prototype.animateOut = function (complete) {
	            var _this = this;
	            var alpha = { alpha: this.alpha };
	            this.removing = true;
	            new TWEEN.Tween(alpha).to({ alpha: 0 }, 200)
	                .onUpdate(function (k) { return _this.alpha = alpha.alpha; })
	                .onComplete(function () {
	                _this.parent.removeChild(_this);
	                if (complete)
	                    complete();
	            })
	                .start();
	            return this;
	        };
	        ShipPath.prototype.refreshPath = function () {
	            var fullPath = this.ship.properties._moveFromPoints.concat(this.ship.properties._moveToPoints);
	            //we will draw the line back ward so the end can always hav a dot and a space
	            fullPath.reverse();
	            this.moveToPath.clear();
	            this.moveToPath.lineStyle(12, 0x00FF00, 1);
	            this.drawDashedSpline(this.moveToPath, fullPath);
	            if (fullPath.length > 0) {
	                var lastPoint = fullPath[0];
	                this.moveToPath.beginFill(0x00FF00);
	                this.moveToPath.drawCircle(lastPoint.x, lastPoint.y, 4);
	                this.moveToPath.endFill();
	            }
	            this.moveFromPath.clear();
	            this.moveFromPath.lineStyle(12, 0x00FF00, 0.3);
	            this.drawDashedSpline(this.moveFromPath, fullPath);
	            this.refreshPathProgress();
	        };
	        ShipPath.prototype.refreshPathProgress = function () {
	            //if there is no path to draw we will remove ourselves
	            if (this.ship.properties._moveToPoints.length === 0 && this.ship.properties._moveFromPoints.length === 0) {
	                if (!this.removing)
	                    this.animateOut();
	                return;
	            }
	            this.moveFromPathMask.clear();
	            this.moveFromPathMask.lineStyle(24, 0xFFFFFF, 1);
	            this.drawSolidLine(this.moveFromPathMask, this.ship.properties._moveFromPoints, null, this.ship);
	            this.moveToPathMask.clear();
	            this.moveToPathMask.lineStyle(24, 0xFFFFFF, 1);
	            this.drawSolidLine(this.moveToPathMask, this.ship.properties._moveToPoints, this.ship, null);
	            if (this.ship.properties._moveToPoints.length > 0) {
	                var lastPoint = this.ship.properties._moveToPoints[this.ship.properties._moveToPoints.length - 1];
	                this.moveToPathMask.beginFill(0xFFFFFF);
	                this.moveToPathMask.drawCircle(lastPoint.x, lastPoint.y, 4);
	                this.moveToPathMask.endFill();
	            }
	        };
	        ShipPath.prototype.drawSolidLine = function (graphics, path, firstPoint, lastPoint) {
	            //its a bit odd to have first and last point arguments. This was done prevent having to build a new
	            //array when calling this method. this method is called on every animation frame
	            if (path.length === 0)
	                return;
	            var iStart = 0;
	            if (firstPoint != null) {
	                graphics.moveTo(firstPoint.x, firstPoint.y);
	                iStart = 0;
	            }
	            else {
	                graphics.moveTo(path[0].x, path[0].y);
	                iStart = 1;
	            }
	            for (var i = iStart; i < path.length; i++) {
	                graphics.lineTo(path[i].x, path[i].y);
	            }
	            if (lastPoint != null)
	                graphics.lineTo(lastPoint.x, lastPoint.y);
	        };
	        ShipPath.prototype.drawDashedSpline = function (graphics, path) {
	            if (path.length === 0)
	                return;
	            //high resolution will give nicer turns in the line and make the line
	            //segments more equal in length, but slows down processing
	            var resolution = 4;
	            var dashLineSize = 20;
	            var gapLineSize = 10;
	            //we are abusing a tween to do all the interpolation here for us
	            //we set up the tween and manually update its time and draw the lines
	            var point = { x: path[0].x, y: path[0].y };
	            var totalProgress = path.length * resolution;
	            var abusedTween = new TWEEN.Tween(point)
	                .to({ x: path.map(function (p) { return p.x; }), y: path.map(function (p) { return p.y; }) }, totalProgress)
	                .interpolation(TWEEN.Interpolation.CatmullRom);
	            TWEEN.remove(abusedTween);
	            graphics.moveTo(point.x, point.y);
	            var isLineDrawing = false;
	            var drawingLength = 0;
	            var previousPoint = { x: point.x, y: point.y };
	            for (var progress = 1; progress < totalProgress; progress++) {
	                abusedTween.update(progress);
	                if (isLineDrawing) {
	                    graphics.lineTo(point.x, point.y);
	                }
	                else {
	                    graphics.moveTo(point.x, point.y);
	                }
	                drawingLength += Coordinates_1.XYUtil.distance(previousPoint, point);
	                if (drawingLength > (isLineDrawing ? dashLineSize : gapLineSize)) {
	                    isLineDrawing = !isLineDrawing;
	                    drawingLength = 0;
	                }
	                previousPoint.x = point.x;
	                previousPoint.y = point.y;
	            }
	        };
	        return ShipPath;
	    }(PIXI.Container));
	    ShipPath.Shadow = (function () {
	        // let filter = new PIXI.filters.DropShadowFilter();
	        // filter.distance = 4;
	        // filter.color = 0x333333;
	        // return filter;
	        return null;
	    })();
	    ShipPath.Blur = (function () {
	        var filter = new PIXI.filters.BlurFilter();
	        filter.blur = 0.2;
	        return filter;
	    })();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 218:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(189), __webpack_require__(181)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Command_1, TWEEN) {
	    "use strict";
	    var ShipMove = (function () {
	        function ShipMove(ship, destinationPoint) {
	            this.ship = ship;
	            this.destinationPoint = destinationPoint;
	        }
	        ShipMove.prototype.execute = function (world) {
	            var _this = this;
	            var canExecute = this.canExecute(world);
	            if (!canExecute.isSuccessful)
	                return canExecute;
	            if (this.ship.properties._moveTween) {
	                world.tweens.remove(this.ship.properties._moveTween);
	            }
	            var pointRoute = world.findPointRoute(this.ship, this.destinationPoint, function (tileIndex) { return world.isMovementAllowed(tileIndex); });
	            if (pointRoute.path.length > 0 && pointRoute.path[0].x === this.ship.x && pointRoute.path[0].y === this.ship.y)
	                pointRoute.path.shift();
	            this.ship.properties._moveToPoints = pointRoute.path;
	            this.ship.properties._moveFromPoints = this.ship.properties._moveFromPoints || [];
	            var xPoints = pointRoute.path.map(function (p) { return p.x; });
	            var yPoints = pointRoute.path.map(function (p) { return p.y; });
	            var pointsTravelled = 0;
	            var tween = world.tweens.add(new TWEEN.Tween(this.ship).to({ x: xPoints, y: yPoints }, pointRoute.distance * 30)
	                .easing(TWEEN.Easing.Linear.None)
	                .interpolation(TWEEN.Interpolation.CatmullRom)
	                .onUpdate(function (progress) {
	                var pointsTravelledOnUpdate = Math.floor(progress * xPoints.length);
	                var newPointsTravelled = pointsTravelledOnUpdate - pointsTravelled;
	                var travelledPoints = _this.ship.properties._moveToPoints.splice(0, newPointsTravelled);
	                _this.ship.properties._moveFromPoints.push.apply(_this.ship.properties._moveFromPoints, travelledPoints);
	                pointsTravelled = pointsTravelledOnUpdate;
	            })
	                .onComplete(function (progress) {
	                _this.ship.properties._moveFromPoints = [];
	                _this.ship.properties._moveFromPoints = [];
	            })
	                .start(world.clock.time));
	            this.ship.properties._moveTween = tween;
	            //
	            // let points = tileIndexPath.map(tileIndex=>world.getTilePoint(tileIndex));
	            // this.ship.properties._movePointPath = points;
	            // //our ship is anchored at bottom left, so we need to move our x/y points away from center tile
	            // let xPoints = points.map(p=>p.x-this.ship.width/2);
	            // let yPoints = points.map(p=>p.y+this.ship.width/2);
	            //
	            //
	            //
	            // let tween = world.tweens.add(new TWEEN.Tween(this.ship).to({x:xPoints,y:yPoints},points.length * 1000)
	            //     .easing(TWEEN.Easing.Linear.None)
	            //     .interpolation(TWEEN.Interpolation.CatmullRom)
	            //     .onUpdate(progress=>this.ship.properties._moveProgress = progress)
	            //     .start(world.clock.time));
	            //
	            //
	            // let tileIndexes = [100,1];
	            //
	            // let firstTween;
	            // let previousTween;
	            // for(let i=0;i<tileIndexes.length;i++){
	            //     let destinationTileIndex = tileIndexes[i];
	            //     let targetPoint = world.getTilePoint(destinationTileIndex);
	            //
	            //     let tween = new TWEEN.Tween(this.ship).to(targetPoint,10000);
	            //     if(firstTween == null){
	            //         tween = tween.easing(TWEEN.Easing.Quadratic.In);
	            //         firstTween = tween;
	            //     }
	            //     if(previousTween != null){
	            //         previousTween.chain(tween);
	            //     }
	            //
	            //     previousTween = tween;
	            //
	            // }
	            //
	            // world.tweens.add(firstTween.start(world.clock.time));
	            return Command_1.SuccessResult;
	        };
	        ShipMove.prototype.canExecute = function (world) {
	            return Command_1.SuccessResult;
	        };
	        return ShipMove;
	    }());
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = ShipMove;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 219:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(181), __webpack_require__(199), __webpack_require__(218), __webpack_require__(186)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, PIXI, TWEEN, City_1, ShipMove_1, Linq) {
	    "use strict";
	    var ShipTravelPointsOverlay = (function (_super) {
	        __extends(ShipTravelPointsOverlay, _super);
	        function ShipTravelPointsOverlay(resources, ship) {
	            var _this = _super.call(this) || this;
	            _this.resources = resources;
	            _this._ship = ship;
	            _this.on("added", _this.startListening, _this);
	            _this.on("removed", _this.stopListening, _this);
	            return _this;
	        }
	        Object.defineProperty(ShipTravelPointsOverlay.prototype, "ship", {
	            get: function () {
	                return this._ship;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        ShipTravelPointsOverlay.prototype.startListening = function () {
	            this.resources.world.onCommand(ShipMove_1.default, this.refreshIfShipMoveIsThisShip, this);
	            PIXI.ticker.shared.add(this.refresh, this);
	        };
	        ShipTravelPointsOverlay.prototype.stopListening = function () {
	            this.resources.world.offCommand(ShipMove_1.default, this.refreshIfShipMoveIsThisShip, this);
	            PIXI.ticker.shared.remove(this.refresh, this);
	        };
	        ShipTravelPointsOverlay.prototype.refreshIfShipMoveIsThisShip = function (shipMove) {
	            if (shipMove.ship === this.ship)
	                this.refresh();
	        };
	        ShipTravelPointsOverlay.prototype.animateIn = function () {
	            this.refresh();
	            return this;
	        };
	        ShipTravelPointsOverlay.prototype.animateOut = function (complete) {
	            var _this = this;
	            var childCount = this.children.length;
	            var onChildRemove = function () {
	                if (--childCount === 0) {
	                    _this.parent.removeChild(_this);
	                    if (complete)
	                        complete();
	                }
	            };
	            this.children.forEach(function (child) {
	                var anyChild = child;
	                if (anyChild.animateOut) {
	                    anyChild.animateOut(onChildRemove);
	                }
	                else {
	                    _this.removeChild(child);
	                    onChildRemove();
	                }
	            });
	            return this;
	        };
	        ShipTravelPointsOverlay.prototype.refresh = function () {
	            var _this = this;
	            var world = this.resources.world;
	            world.objectsOfType(City_1.CityUtil.TypeName).forEach(function (city) {
	                var cityTileIndex = world.getTileIndex(city);
	                var shouldBeHidden = false;
	                //we wont draw travel items to places where the ship already is
	                shouldBeHidden = shouldBeHidden || world.getTileIndex(_this.ship) === cityTileIndex;
	                //if the boat is already travelling to the location we will also not show the button
	                var destinationPoint = _this.ship.properties._moveToPoints[_this.ship.properties._moveToPoints.length - 1];
	                shouldBeHidden = shouldBeHidden || (destinationPoint && world.getTileIndex(destinationPoint) === cityTileIndex);
	                var children = Linq.from(_this.children).cast();
	                //remove children that are there but shouldnt be
	                children.where(function (child) { return child.x === city.x && child.y === city.y && shouldBeHidden && !child.removing; }).forEach(function (child) {
	                    child.animateOut();
	                });
	                //add children that are not there but should be
	                if (!children.any(function (child) { return child.x === city.x && child.y === city.y && !child.removing; }) && !shouldBeHidden) {
	                    var travelButton = _this.addChild(new TravelToButton(_this.resources.moveButton, function () {
	                        world.issueCommand(new ShipMove_1.default(_this.ship, city));
	                    })).animateIn();
	                    travelButton.x = city.x;
	                    travelButton.y = city.y;
	                }
	            });
	        };
	        return ShipTravelPointsOverlay;
	    }(PIXI.Container));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = ShipTravelPointsOverlay;
	    ShipTravelPointsOverlay.Shadow = (function () {
	        // let filter = new PIXI.filters.DropShadowFilter();
	        // filter.distance = 4;
	        // filter.color = 0x333333;
	        // return filter
	        return null;
	    })();
	    ShipTravelPointsOverlay.Blur = (function () {
	        var filter = new PIXI.filters.BlurFilter();
	        filter.blur = 0;
	        return filter;
	    })();
	    var TravelToButton = (function (_super) {
	        __extends(TravelToButton, _super);
	        function TravelToButton(textures, clickAction) {
	            var _this = _super.call(this, textures.up) || this;
	            _this.textures = textures;
	            _this.removing = false;
	            _this.buttonMode = true;
	            _this.interactive = true;
	            _this.anchor.x = 0.5;
	            _this.anchor.y = 0.5;
	            if (clickAction != null)
	                _this.on("fire", clickAction, _this);
	            var preventDefault = function (e) { e.stopPropagation(); };
	            _this.on("mousedown", preventDefault);
	            _this.on("mouseup", preventDefault);
	            _this.on("click", preventDefault);
	            _this.on("mouseup", _this.fire, _this);
	            return _this;
	        }
	        TravelToButton.prototype.fire = function (e) {
	            this.emit("fire");
	            this.texture = this.textures.down;
	        };
	        TravelToButton.prototype.animateIn = function () {
	            var _this = this;
	            this.alpha = 0;
	            var alpha = { alpha: 0 };
	            new TWEEN.Tween(alpha).to({ alpha: 1 }, 150)
	                .onUpdate(function (k) { return _this.alpha = alpha.alpha; })
	                .start();
	            return this;
	        };
	        TravelToButton.prototype.animateOut = function (complete) {
	            var _this = this;
	            this.removing = true;
	            var alpha = { alpha: 1 };
	            new TWEEN.Tween(alpha).to({ alpha: 0 }, 150)
	                .onUpdate(function (k) { return _this.alpha = alpha.alpha; })
	                .onComplete(function () {
	                _this.parent.removeChild(_this);
	                if (complete)
	                    complete.call(_this);
	            })
	                .start();
	            return this;
	        };
	        return TravelToButton;
	    }(PIXI.Sprite));
	    exports.TravelToButton = TravelToButton;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }

});
//# sourceMappingURL=app.js.map