import * as TWEEN from "tween.js";

export default class TweenGroup{
    private _tweens = [];

    getAll () {
        return this._tweens;
    }

    removeAll() {
        this._tweens = [];
    }

    add(tween) {
        //remove it from the global group
        TWEEN.remove(tween);
        
        this._tweens.push(tween);

        return tween;
    }

    remove(tween) {
        var i = this._tweens.indexOf(tween);

        if (i !== -1) {
            this._tweens.splice(i, 1);
        }
    }

    update(time) {

        if (this._tweens.length === 0) {
            return false;
        }

        var i = 0;

        time = time !== undefined ? time : window.performance.now();

        while (i < this._tweens.length) {

            if (this._tweens[i].update(time)) {
                i++;
            } else {
                this._tweens.splice(i, 1);
            }

        }

        return true;
    }
}

