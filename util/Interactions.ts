export function panable (sprite:PIXI.DisplayObject) {
    function mouseDown (e) {
        start(e, e.data.originalEvent)
    }

    function touchStart (e) {
        start(e, e.data.originalEvent.targetTouches[0])
    }

    // possibly be called twice or more
    function start (e, t) {
        if (e.target._pan) {
            return
        }
        e.target._pan = {
            p: {
                x: t.clientX,
                y: t.clientY,
                date: new Date()
            }
        }
        e.target
            .on('mousemove', mouseMove)
            .on('touchmove', touchMove)
    }

    function mouseMove (e) {
        move(e, e.data.originalEvent)
    }

    function touchMove (e) {
        let t = e.data.originalEvent.targetTouches
        if (!t || t.length > 1) {
            end(e)
            return
        }
        move(e, t[0])
    }

    function move (e, t) {
        let now:any = new Date()
        let interval = now - e.target._pan.p.date
        if (interval < 12) {
            return
        }
        let dx = t.clientX - e.target._pan.p.x
        let dy = t.clientY - e.target._pan.p.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        if (!e.target._pan.pp) {
            let threshold = (t instanceof (<any>window).MouseEvent) ? 2 : 7
            if (distance > threshold) {
                e.target.emit('panstart')
                e.target._pan.pp = {}
            }
            return
        }
        let event = {
            deltaX: dx,
            deltaY: dy,
            velocity: distance / interval,
            data: e.data
        }
        e.target.emit('panmove', event)
        e.target._pan.pp = {
            x: e.target._pan.p.x,
            y: e.target._pan.p.y,
            date: e.target._pan.p.date
        }
        e.target._pan.p = {
            x: t.clientX,
            y: t.clientY,
            date: now
        }
    }

    // TODO: Inertia Mode
    // possibly be called twice or more
    function end (e) {
        if (e.target._pan && e.target._pan.pp) {
            e.target.emit('panend')
        }
        e.target._pan = null
        e.target
            .removeListener('mousemove', mouseMove)
            .removeListener('touchmove', touchMove)
    }

    sprite.interactive = true
    sprite
        .on('mousedown', mouseDown)
        .on('touchstart', touchStart)
        .on('mouseup', end)
        .on('mouseupoutside', end)
        .on('touchend', end)
        .on('touchendoutside', end)
}




export function pinchable (sprite) {
    function start (e) {
        e.target.on('touchmove', move)
    }

    function move (e) {
        let t = e.data.originalEvent.targetTouches
        if (!t || t.length < 2) {
            return
        }
        let dx = t[0].clientX - t[1].clientX
        let dy = t[0].clientY - t[1].clientY
        let distance = Math.sqrt(dx * dx + dy * dy)
        if (!e.target._pinch) {
            e.target._pinch = {
                p: { distance: distance, date: new Date() },
                pp: {}
            }
            e.target.emit('pinchstart')
            return
        }
        let center = {
            x: (t[0].clientX + t[1].clientX) / 2,
            y: (t[0].clientY + t[1].clientY) / 2
        }
        let now:any = new Date()
        let interval = now - e.target._pinch.p.date
        if (interval < 12) {
            return
        }
        let event = {
            scale: distance / e.target._pinch.p.distance,
            velocity: distance / interval,
            center: center,
            data: e.data
        }
        e.target.emit('pinchmove', event)
        e.target._pinch.pp = {
            distance: e.target._pinch.p.distance,
            date: e.target._pinch.p.date
        }
        e.target._pinch.p = {
            distance: distance,
            date: now
        }
    }

    // TODO: Inertia Mode
    function end (e) {
        if (e.target._pinch) {
            e.target.emit('pinchend')
        }
        e.target._pinch = null
        e.target.removeListener('touchmove', move)
    }

    sprite.interactive = true
    sprite
        .on('touchstart', start)
        .on('touchend', end)
        .on('touchendoutside', end)
}
