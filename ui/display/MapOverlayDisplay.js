var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../engine/objectTypes/City", "../controls/UIImageButton", "tween.js", "../../util/Coordinates"], function (require, exports, City_1, UIImageButton_1, TWEEN, Coordinates_1) {
    "use strict";
    var MapOverlayDisplay = (function (_super) {
        __extends(MapOverlayDisplay, _super);
        function MapOverlayDisplay(resources, map) {
            _super.call(this);
            this.resources = resources;
            this.map = map;
            this.addChild(map);
            this.moveFromPath = this.addChild(new PIXI.Graphics());
            this.moveToPath = this.addChild(new PIXI.Graphics());
            var shadow = new PIXI.filters.DropShadowFilter();
            shadow.distance = 4;
            shadow.color = 0x333333;
            var blur = new PIXI.filters.BlurFilter();
            blur.blur = 1;
            //blur.passes = 100;
            this.moveToPath.filters = [blur, shadow];
            this.moveFromPath.filters = [shadow];
        }
        MapOverlayDisplay.prototype.setRenderRect = function (rect) {
            this.map.setRenderRect(rect);
        };
        MapOverlayDisplay.prototype.getBounds = function () {
            return this.map.getBounds();
        };
        MapOverlayDisplay.prototype.showMoveButtons = function () {
            var _this = this;
            this.resources.world.objectsOfType(City_1.CityUtil.TypeName).forEach(function (city) {
                var moveButton = _this.addChild(new UIImageButton_1.default(_this.resources.moveButton, function () {
                    var intermediate = { alpha: moveButton.alpha };
                    new TWEEN.Tween(intermediate).to({ alpha: 0 }, 200).onUpdate(function () {
                        moveButton.alpha = intermediate.alpha;
                    }).start();
                }));
                moveButton.alpha = 0.9;
                moveButton.x = city.x + city.width / 2;
                moveButton.y = city.y + city.height / 2;
            });
        };
        MapOverlayDisplay.prototype.showMovePath = function (ship) {
            var _this = this;
            var fullPath = ship.properties._moveFromPoints.concat(ship.properties._moveToPoints);
            this.moveToPath.clear();
            this.moveToPath.lineStyle(16, 0x00FF00, 1);
            this.drawDashedSpline(this.moveToPath, fullPath);
            var movePathToTravelMask = new PIXI.Graphics();
            this.moveToPath.mask = this.addChild(movePathToTravelMask);
            this.moveFromPath.clear();
            this.moveFromPath.lineStyle(16, 0x00FF00, 0.3);
            this.drawDashedSpline(this.moveFromPath, fullPath);
            var movePathTravelledMask = this.addChild(new PIXI.Graphics());
            this.moveFromPath.mask = movePathTravelledMask;
            //
            PIXI.ticker.shared.add(function () {
                movePathTravelledMask.clear();
                movePathTravelledMask.lineStyle(24, 0xFFFFFF, 1);
                _this.drawSolidLine(movePathTravelledMask, ship.properties._moveFromPoints, null, ship);
                //
                movePathToTravelMask.clear();
                movePathToTravelMask.lineStyle(24, 0xFFFFFF, 1);
                _this.drawSolidLine(movePathToTravelMask, ship.properties._moveToPoints, ship, null);
            });
        };
        MapOverlayDisplay.prototype.isBoundedByPoint = function (testPoint, p1, p2) {
            return testPoint.x <= Math.max(p1.x, p2.x) && testPoint.x >= Math.min(p1.x, p2.x) &&
                testPoint.y <= Math.max(p1.y, p2.y) && testPoint.y >= Math.min(p1.y, p2.y);
        };
        MapOverlayDisplay.prototype.drawSolidLine = function (graphics, path, firstPoint, lastPoint) {
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
        MapOverlayDisplay.prototype.drawDashedSpline = function (graphics, path) {
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
        return MapOverlayDisplay;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MapOverlayDisplay;
});
//# sourceMappingURL=MapOverlayDisplay.js.map