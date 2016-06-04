define(["require", "exports", "engine/objectTypes/Player", "../util/Util", "linq", "./commands/CityHarvest", "eventemitter3", "./commands/DataCleanse", "../util/TweenGroup", "../util/Coordinates"], function (require, exports, Player_1, Util_1, Linq, CityHarvest_1, EventEmitter, DataCleanse_1, TweenGroup_1, Coordinates_1) {
    "use strict";
    var World = (function () {
        function World(state) {
            var _this = this;
            this.state = state;
            this.commandIssuingDepth = 0;
            this.tickNumber = 0;
            this.clock = new Clock();
            this.commandEmitter = new EventEmitter();
            this.tweens = new TweenGroup_1.default();
            this.clock.every(2000, function () {
                _this.issueCommand(new CityHarvest_1.default());
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
                pointPath.unshift(start);
                distance += Coordinates_1.XYUtil.distance(pointPath[0], start);
            }
            if (!Coordinates_1.XYUtil.equals(pointPath[pointPath.length - 1], end)) {
                pointPath.push(end);
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
            var _loop_1 = function() {
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
            var this_1 = this;
            var path, source;
            while (open.length > 0) {
                var state_1 = _loop_1();
                if (typeof state_1 === "object") return state_1.value;
                if (state_1 === "continue") continue;
            }
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
        World.prototype.onCommand = function (clazz, callback) {
            var typeName = Util_1.default.FunctionName(clazz);
            this.commandEmitter.on(typeName, callback);
        };
        World.prototype.offCommand = function (clazz, callback) {
            var typeName = Util_1.default.FunctionName(clazz);
            this.commandEmitter.off(typeName, callback);
        };
        World.prototype.onCommands = function (clazzes, callback) {
            var _this = this;
            clazzes.forEach(function (clazz) { return _this.onCommand(clazz, callback); });
        };
        World.prototype.offCommands = function (clazzes, callback) {
            var _this = this;
            clazzes.forEach(function (clazz) { return _this.offCommand(clazz, callback); });
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
});
//# sourceMappingURL=World.js.map