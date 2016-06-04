var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js', "tween.js", "../../../util/Coordinates"], function (require, exports, PIXI, TWEEN, Coordinates_1) {
    "use strict";
    var ShipPathOverlay = (function (_super) {
        __extends(ShipPathOverlay, _super);
        function ShipPathOverlay(ship) {
            var _this = this;
            _super.call(this);
            this._ship = ship;
            this.on("added", function () {
                _this.setUp();
                _this.alpha = 0;
                var alpha = { alpha: 0 };
                new TWEEN.Tween(alpha).to({ alpha: 1 }, 100)
                    .onUpdate(function (k) { return _this.alpha = alpha.alpha; })
                    .start();
            }, this);
            this.on("requestRemove", function () {
                var alpha = { alpha: 1 };
                new TWEEN.Tween(alpha).to({ alpha: 0 }, 100)
                    .onUpdate(function (k) { return _this.alpha = alpha.alpha; })
                    .onComplete(function () { return _this.parent.removeChild(_this); })
                    .start();
            });
            this.on("removed", this.tearDown, this);
        }
        Object.defineProperty(ShipPathOverlay.prototype, "ship", {
            get: function () {
                return this._ship;
            },
            enumerable: true,
            configurable: true
        });
        ShipPathOverlay.prototype.setUp = function () {
            this.removeChildren();
            this.moveFromPath = this.addChild(new PIXI.Graphics());
            this.moveToPath = this.addChild(new PIXI.Graphics());
            this.moveToPath.filters = [ShipPathOverlay.Blur, ShipPathOverlay.Shadow];
            this.moveFromPath.filters = [ShipPathOverlay.Blur, ShipPathOverlay.Shadow];
            var fullPath = this.ship.properties._moveFromPoints.concat(this.ship.properties._moveToPoints);
            this.moveToPath.clear();
            this.moveToPath.lineStyle(16, 0x00FF00, 1);
            this.drawDashedSpline(this.moveToPath, fullPath);
            var movePathToTravelMask = new PIXI.Graphics();
            this.moveToPath.mask = this.addChild(movePathToTravelMask);
            this.moveFromPath.clear();
            this.moveFromPath.lineStyle(16, 0x00FF00, 0.3);
            this.drawDashedSpline(this.moveFromPath, fullPath);
            var movePathTravelledMask = this.addChild(new PIXI.Graphics());
            this.moveFromPath.mask = this.addChild(movePathTravelledMask);
            PIXI.ticker.shared.add(this.refreshTravelMasks, this);
        };
        ShipPathOverlay.prototype.tearDown = function () {
            PIXI.ticker.shared.remove(this.refreshTravelMasks, this);
        };
        ShipPathOverlay.prototype.refreshTravelMasks = function () {
            var moveFromPathMask = this.moveFromPath.mask;
            moveFromPathMask.clear();
            moveFromPathMask.lineStyle(24, 0xFFFFFF, 1);
            this.drawSolidLine(moveFromPathMask, this.ship.properties._moveFromPoints, null, this.ship);
            var moveToPathMask = this.moveToPath.mask;
            moveToPathMask.clear();
            moveToPathMask.lineStyle(24, 0xFFFFFF, 1);
            this.drawSolidLine(moveToPathMask, this.ship.properties._moveToPoints, this.ship, null);
        };
        ShipPathOverlay.prototype.drawSolidLine = function (graphics, path, firstPoint, lastPoint) {
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
        ShipPathOverlay.prototype.drawDashedSpline = function (graphics, path) {
            if (path.length === 0)
                return;
            //high resolution will give nicer turns in the line and make the line
            //segments more equal in length, but slows down processing
            var resolution = 4;
            var dashLineSize = 30;
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
            var isLineDrawing = true;
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
        ShipPathOverlay.Shadow = (function () {
            var filter = new PIXI.filters.DropShadowFilter();
            filter.distance = 4;
            filter.color = 0x333333;
            return filter;
        })();
        ShipPathOverlay.Blur = (function () {
            var filter = new PIXI.filters.BlurFilter();
            filter.blur = 1;
            return filter;
        })();
        return ShipPathOverlay;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipPathOverlay;
});
//# sourceMappingURL=ShipPathOverlay.js.map