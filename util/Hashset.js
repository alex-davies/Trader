define(["require", "exports"], function (require, exports) {
    "use strict";
    var Hashset = (function () {
        function Hashset(computeHashCode) {
            var _this = this;
            if (computeHashCode === void 0) { computeHashCode = function (value) { return value.toString(); }; }
            this.data = {};
            this.length = 0;
            this.listeners = [];
            this.observe = function (listener, suppressInit) {
                _this.listeners.push(listener);
                if (!suppressInit) {
                    var entries = _this.entries();
                    for (var i = 0; i < entries.length; i++) {
                        listener({
                            oldValue: null,
                            newValue: entries[i]
                        });
                    }
                }
                return _this;
            };
            this.unobserve = function (listener) {
                var index = _this.listeners.indexOf(listener);
                if (index >= 0) {
                    _this.listeners.splice(index, 1);
                }
                return _this;
            };
            this.computeHashCode = computeHashCode;
        }
        Hashset.prototype.put = function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i - 0] = arguments[_i];
            }
            for (var i = 0; i < values.length; i++) {
                var hash = this.computeHashCode(values[i]);
                var change = {
                    oldValue: null,
                    newValue: values[i]
                };
                if (!this.containsHash(hash)) {
                    this.data[hash] = values[i];
                    this.length += 1;
                }
                else {
                    change.oldValue = this.get(this.data[hash]);
                    this.data[hash] = values[i];
                }
                this.fireChangeListeners(change);
            }
        };
        Hashset.prototype.putRange = function (values) {
            this.put.apply(this, values);
        };
        Hashset.prototype.remove = function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i - 0] = arguments[_i];
            }
            for (var i = 0; i < values.length; i++) {
                var hash = this.computeHashCode(values[i]);
                if (this.containsHash(hash)) {
                    var oldValue = this.data[hash];
                    delete this.data[hash];
                    this.length -= 1;
                    this.fireChangeListeners({
                        oldValue: oldValue,
                        newValue: null
                    });
                }
            }
        };
        Hashset.prototype.contains = function (value) {
            return this.containsHash(this.computeHashCode(value));
        };
        Hashset.prototype.containsHash = function (hash) {
            return Object.prototype.hasOwnProperty.call(this.data, hash);
        };
        Hashset.prototype.get = function (hash) {
            return this.data[hash];
        };
        Hashset.prototype.size = function () {
            return this.length;
        };
        Hashset.prototype.entries = function () {
            var returnResult = [];
            for (var property in this.data) {
                if (Object.prototype.hasOwnProperty.call(this.data, property)) {
                    returnResult.push(this.data[property]);
                }
            }
            return returnResult;
        };
        Hashset.prototype.forEach = function (fn) {
            for (var property in this.data) {
                if (Object.prototype.hasOwnProperty.call(this.data, property)) {
                    fn(this.data[property]);
                }
            }
        };
        Hashset.prototype.equals = function (other) {
            if (this.size() != other.size())
                return false;
            for (var property in this.data) {
                if (this.containsHash(property) !== other.containsHash(property))
                    return false;
            }
            return true;
        };
        Hashset.prototype.fireChangeListeners = function (change) {
            for (var i = 0; i < this.listeners.length; i++) {
                this.listeners[i](change);
            }
        };
        return Hashset;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Hashset;
});
//# sourceMappingURL=Hashset.js.map