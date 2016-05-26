define(["require", "exports", "engine/objectTypes/Player", "../util/Util", "linq", "./commands/CityHarvest", "eventemitter3"], function (require, exports, Player_1, Util_1, Linq, CityHarvest_1, EventEmitter) {
    "use strict";
    var World = (function () {
        function World(state) {
            var _this = this;
            this.state = state;
            this.commandIssuingDepth = 0;
            this.tickNumber = 0;
            this.clock = new Clock();
            this.commandEmitter = new EventEmitter();
            this.clock.every(2000, function () {
                _this.IssueCommand(new CityHarvest_1.default());
            });
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
            var row = Math.floor(point.y / this.state.tileheight);
            var col = Math.floor(point.x / this.state.tilewidth);
            return this.state.width * row + col;
        };
        World.prototype.tileGidsInRect = function (tileLayer, rect) {
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
                    result.push(tileLayer.data[this.state.width * row + col]);
                }
            }
            return Linq.from(result);
        };
        World.prototype.getTilePropertiesFromIndex = function (layer, tileIndex) {
            return this.getTilePropertiesFromGid(layer.data[tileIndex]);
        };
        World.prototype.getTilePropertiesFromGid = function (gid) {
            var tilesetsWithGid = Linq.from(this.state.tilesets).where(function (tileset) { return tileset.tileproperties && tileset.tileproperties.hasOwnProperty(gid - tileset.firstgid + ""); });
            return Linq.from(this.state.tilesets)
                .where(function (tileset) { return tileset.tileproperties && tileset.tileproperties.hasOwnProperty(gid - tileset.firstgid + ""); })
                .select(function (tileset) { return tileset.tileproperties[gid - tileset.firstgid + ""]; })
                .firstOrDefault() || {};
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
        World.prototype.IssueCommand = function () {
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