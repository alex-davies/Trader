define(["require", "exports"], function (require, exports) {
    "use strict";
    function generateObservable(defaultValue) {
        var value = defaultValue;
        var listeners = [];
        var obs = function (newValue) {
            //check on arguments to allow setting value to undefined
            if (arguments.length === 1 && value !== newValue) {
                var oldValue = value;
                value = newValue;
                if (listeners.length > 0) {
                    var change = {
                        oldValue: oldValue,
                        newValue: newValue,
                    };
                    //notify listeners of the change
                    for (var i = 0; i < listeners.length; i++) {
                        listeners[i](change);
                    }
                }
            }
            return value;
        };
        obs.observe = function (listener, suppressInit) {
            listeners.push(listener);
            if (!suppressInit) {
                listener({
                    oldValue: null,
                    newValue: obs()
                });
            }
            return obs;
        };
        obs.unobserve = function (listener) {
            var index = listeners.indexOf(listener);
            if (index >= 0) {
                listeners.splice(index, 1);
            }
            return obs;
        };
        return obs;
    }
    exports.generateObservable = generateObservable;
});
//# sourceMappingURL=Observable.js.map