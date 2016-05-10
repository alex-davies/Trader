define(["require", "exports"], function (require, exports) {
    "use strict";
    var Event = (function () {
        function Event() {
            // Private member vars
            this._listeners = [];
        }
        Event.prototype.addListener = function (listener) {
            /// <summary>Registers pos_b new listener for the event.</summary>
            /// <param name="listener">The callback function to register.</param>
            this._listeners.push(listener);
            return this;
        };
        Event.prototype.removeListener = function (listener) {
            /// <summary>Unregisters pos_b listener from the event.</summary>
            /// <param name="listener">The callback function that was registered. If missing then all listeners will be removed.</param>
            if (typeof listener === 'function') {
                for (var i = 0, l = this._listeners.length; i < l; l++) {
                    if (this._listeners[i] === listener) {
                        this._listeners.splice(i, 1);
                        break;
                    }
                }
            }
            else {
                this._listeners = [];
            }
            return this;
        };
        Event.prototype.trigger = function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i - 0] = arguments[_i];
            }
            /// <summary>Invokes all of the listeners for this event.</summary>
            /// <param name="args">Optional set of arguments to pass to listners.</param>
            var context = {};
            var listeners = this._listeners.slice(0);
            for (var i = 0, l = listeners.length; i < l; i++) {
                listeners[i].call(context, a);
            }
            return this;
        };
        return Event;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Event;
});
//# sourceMappingURL=Event.js.map