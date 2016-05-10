define(["require", "exports", "util/Event", "engine/objectTypes/Player", "linq"], function (require, exports, Event_1, Player_1, Linq) {
    "use strict";
    var World = (function () {
        function World(state) {
            this.state = state;
            this.commandIssuingDepth = 0;
            this.tickNumber = 0;
            this.clock = new Event_1.default();
        }
        World.prototype.player = function () {
            var existingPlayer = this.objectOfType(Player_1.PlayerType);
            if (existingPlayer) {
                return existingPlayer;
            }
        };
        World.prototype.objectsOfType = function (type) {
            return this.state.layers
                .filter(function (layer) { return layer.type === "objectgroup"; })
                .map(function (layer) { return layer.objects.filter(function (obj) { return obj.type === type; }); })
                .reduce(function (a1, a2) { return a1.concat(a2); }, []);
        };
        World.prototype.objectOfType = function (type) {
            return this.objectsOfType(type)[0];
        };
        World.prototype.tileLayers = function () {
            return Linq.from(this.state.layers).where(function (layer) { return layer.type === "tilelayer"; });
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
        World.prototype.tileProperties = function (gid) {
            return Linq.from(this.state.tilesets)
                .where(function (tileset) { return tileset.tileproperties && tileset.tileproperties.hasOwnProperty(gid + tileset.firstgid + ""); })
                .select(function (tileset) { return tileset.tileproperties[gid + tileset.firstgid + ""]; })
                .firstOrDefault();
        };
        World.prototype.IssueCommand = function () {
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
        };
        World.prototype.tick = function () {
            this.clock.trigger(this.tickNumber++);
        };
        return World;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = World;
});
//# sourceMappingURL=World.js.map