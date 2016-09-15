define(["require", "exports", "engine/commands/Command", "tween.js"], function (require, exports, Command_1, TWEEN) {
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
});
//# sourceMappingURL=ShipMove.js.map