var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js', "tween.js", "../../../engine/objectTypes/City", "../../../engine/commands/ShipMove", "linq"], function (require, exports, PIXI, TWEEN, City_1, ShipMove_1, Linq) {
    "use strict";
    var ShipTravelPointsOverlay = (function (_super) {
        __extends(ShipTravelPointsOverlay, _super);
        function ShipTravelPointsOverlay(resources, ship) {
            _super.call(this);
            this.resources = resources;
            this._ship = ship;
            this.on("added", this.startListening, this);
            this.on("removed", this.stopListening, this);
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
        ShipTravelPointsOverlay.Shadow = (function () {
            var filter = new PIXI.filters.DropShadowFilter();
            filter.distance = 4;
            filter.color = 0x333333;
            return filter;
        })();
        ShipTravelPointsOverlay.Blur = (function () {
            var filter = new PIXI.filters.BlurFilter();
            filter.blur = 1;
            return filter;
        })();
        return ShipTravelPointsOverlay;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipTravelPointsOverlay;
    var TravelToButton = (function (_super) {
        __extends(TravelToButton, _super);
        function TravelToButton(textures, clickAction) {
            _super.call(this, textures.up);
            this.textures = textures;
            this.removing = false;
            this.buttonMode = true;
            this.interactive = true;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            if (clickAction != null)
                this.on("fire", clickAction, this);
            var preventDefault = function (e) { e.stopPropagation(); };
            this.on("mousedown", preventDefault);
            this.on("mouseup", preventDefault);
            this.on("click", preventDefault);
            this.on("mouseup", this.fire, this);
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
});
//# sourceMappingURL=ShipTravelPointsOverlay.js.map