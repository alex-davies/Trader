var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js', "tween.js", "../../../util/Coordinates", "../../../engine/commands/ShipMove"], function (require, exports, PIXI, TWEEN, Coordinates_1, ShipMove_1) {
    "use strict";
    var ShipPathOverlay = (function (_super) {
        __extends(ShipPathOverlay, _super);
        function ShipPathOverlay(resources, ship) {
            _super.call(this);
            this.resources = resources;
            this.ship = ship;
            this.on("added", this.startListening, this);
            this.on("removed", this.stopListening, this);
            this.addChild(new ShipPath(resources, ship));
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
            _super.call(this);
            this.resources = resources;
            this.removing = false;
            this._ship = ship;
            this.moveFromPath = this.addChild(new PIXI.Graphics());
            this.moveFromPath.filters = [ShipPath.Blur, ShipPath.Shadow];
            this.moveFromPathMask = this.addChild(new PIXI.Graphics());
            this.moveFromPath.mask = this.moveFromPathMask;
            this.moveToPath = this.addChild(new PIXI.Graphics());
            this.moveToPath.filters = [ShipPath.Blur, ShipPath.Shadow];
            this.moveToPathMask = this.addChild(new PIXI.Graphics());
            this.moveToPath.mask = this.moveToPathMask;
            this.on("added", this.startListening, this);
            this.on("removed", this.stopListening, this);
            this.refreshPath();
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
        ShipPath.Shadow = (function () {
            var filter = new PIXI.filters.DropShadowFilter();
            filter.distance = 4;
            filter.color = 0x333333;
            return filter;
        })();
        ShipPath.Blur = (function () {
            var filter = new PIXI.filters.BlurFilter();
            filter.blur = 1;
            return filter;
        })();
        return ShipPath;
    }(PIXI.Container));
});
//# sourceMappingURL=ShipPathOverlay.js.map