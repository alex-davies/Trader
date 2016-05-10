define(["require", "exports"], function (require, exports) {
    "use strict";
    var EventUtil = (function () {
        function EventUtil() {
        }
        EventUtil.addClickEvents = function (displayObject) {
            //
            //
            //
            //displayObject.on('mousedown', e=>displayObject.emit('clickDown',e));
            //displayObject.on('touchstart', e=>displayObject.emit('clickDown',e));
            //
            //displayObject.on('mouseup', e=>displayObject.emit('clickUp',e));
            //displayObject.on('touchend', e=>displayObject.emit('clickUp',e));
            //
            //displayObject.on('mouseupoutside', e=>displayObject.emit('clickUp',e));
            //displayObject.on('touchendoutside', e=>displayObject.emit('clickUp',e));
            //
            var clickDown = function (e_down) {
                var clickUp = function (e_up) {
                    displayObject.removeListener('mousemove', clickDrag);
                    displayObject.removeListener('touchmove', clickDrag);
                };
                var clickDrag = function (e_drag) {
                    displayObject.emit('clickDrag', e_drag);
                };
                displayObject.once('mouseup', clickUp);
                displayObject.once('touchend', clickUp);
                displayObject.once('mouseupoutside', clickUp);
                displayObject.once('touchendoutside', clickUp);
                displayObject.on('mousemove', clickDrag);
                displayObject.on('touchmove', clickDrag);
            };
            displayObject.on('mousedown', clickDown);
            displayObject.on('touchstart', clickDown);
        };
        return EventUtil;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventUtil;
});
//# sourceMappingURL=EventUtil.js.map