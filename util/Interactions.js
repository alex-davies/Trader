define(["require", "exports"], function (require, exports) {
    "use strict";
    function panable(sprite) {
        function mouseDown(e) {
            start(e, e.data.originalEvent);
        }
        function touchStart(e) {
            start(e, e.data.originalEvent.targetTouches[0]);
        }
        // possibly be called twice or more
        function start(e, t) {
            if (e.target._pan) {
                return;
            }
            e.target._pan = {
                p: {
                    x: t.clientX,
                    y: t.clientY,
                    date: new Date()
                }
            };
            e.target
                .on('mousemove', mouseMove)
                .on('touchmove', touchMove);
        }
        function mouseMove(e) {
            move(e, e.data.originalEvent);
        }
        function touchMove(e) {
            var t = e.data.originalEvent.targetTouches;
            if (!t || t.length > 1) {
                end(e);
                return;
            }
            move(e, t[0]);
        }
        function move(e, t) {
            var now = new Date();
            var interval = now - e.target._pan.p.date;
            if (interval < 12) {
                return;
            }
            var dx = t.clientX - e.target._pan.p.x;
            var dy = t.clientY - e.target._pan.p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (!e.target._pan.pp) {
                var threshold = (t instanceof window.MouseEvent) ? 2 : 7;
                if (distance > threshold) {
                    e.target.emit('panstart');
                    e.target._pan.pp = {};
                }
                return;
            }
            var event = {
                deltaX: dx,
                deltaY: dy,
                velocity: distance / interval,
                data: e.data
            };
            e.target.emit('panmove', event);
            e.target._pan.pp = {
                x: e.target._pan.p.x,
                y: e.target._pan.p.y,
                date: e.target._pan.p.date
            };
            e.target._pan.p = {
                x: t.clientX,
                y: t.clientY,
                date: now
            };
        }
        // TODO: Inertia Mode
        // possibly be called twice or more
        function end(e) {
            if (e.target._pan && e.target._pan.pp) {
                e.target.emit('panend');
            }
            e.target._pan = null;
            e.target
                .removeListener('mousemove', mouseMove)
                .removeListener('touchmove', touchMove);
        }
        sprite.interactive = true;
        sprite
            .on('mousedown', mouseDown)
            .on('touchstart', touchStart)
            .on('mouseup', end)
            .on('mouseupoutside', end)
            .on('touchend', end)
            .on('touchendoutside', end);
    }
    exports.panable = panable;
    function pinchable(sprite) {
        function start(e) {
            e.target.on('touchmove', move);
        }
        function move(e) {
            var t = e.data.originalEvent.targetTouches;
            if (!t || t.length < 2) {
                return;
            }
            var dx = t[0].clientX - t[1].clientX;
            var dy = t[0].clientY - t[1].clientY;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (!e.target._pinch) {
                e.target._pinch = {
                    p: { distance: distance, date: new Date() },
                    pp: {}
                };
                e.target.emit('pinchstart');
                return;
            }
            var center = {
                x: (t[0].clientX + t[1].clientX) / 2,
                y: (t[0].clientY + t[1].clientY) / 2
            };
            var now = new Date();
            var interval = now - e.target._pinch.p.date;
            if (interval < 12) {
                return;
            }
            var event = {
                scale: distance / e.target._pinch.p.distance,
                velocity: distance / interval,
                center: center,
                data: e.data
            };
            e.target.emit('pinchmove', event);
            e.target._pinch.pp = {
                distance: e.target._pinch.p.distance,
                date: e.target._pinch.p.date
            };
            e.target._pinch.p = {
                distance: distance,
                date: now
            };
        }
        // TODO: Inertia Mode
        function end(e) {
            if (e.target._pinch) {
                e.target.emit('pinchend');
            }
            e.target._pinch = null;
            e.target.removeListener('touchmove', move);
        }
        sprite.interactive = true;
        sprite
            .on('touchstart', start)
            .on('touchend', end)
            .on('touchendoutside', end);
    }
    exports.pinchable = pinchable;
});
//# sourceMappingURL=Interactions.js.map