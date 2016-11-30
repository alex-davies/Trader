import {LatLng, XY} from 'util/Coordinates';

interface Rect<T>{
    topLeft:T,
    bottomRight:T
}

export default class MercatorProjection {
    private static RadiusOfEarth = 1;//6371 * 1000;

    constructor(private latlngWindow:Rect<LatLng>, private xyWindow:Rect<XY>) {
    }


    public toXY(latlng: LatLng): XY {

        var rlat = this.toRadians(latlng.lat);
        var rlng = this.toRadians(latlng.lng);

        var mercN = Math.log(Math.tan((Math.PI / 4) + (rlat / 2)));

        return this.scale({
            x: (latlng.lng + 180) / 360,
            y: 0.5 - (mercN / (2 * Math.PI))
        });
    }

    public toLatLng(xy: XY): LatLng {
        var width = this.xyWindow.bottomRight.x - this.xyWindow.topLeft.x
        var height = this.xyWindow.bottomRight.y - this.xyWindow.topLeft.y

        var normalizeXY = {
            x: ((xy.x - this.xyWindow.topLeft.x) % width) / width,
            y: ((xy.y - this.xyWindow.topLeft.y) % height) / height
        }

        var mercN = Math.log(Math.tan((Math.PI / 4) + (rlat / 2)));

        var rlat = 2 * (Math.atan(Math.exp((0.5 - normalizeXY.y) * (2 * Math.PI))) - (Math.PI / 4));

        return {
            lng:normalizeXY.x*360 - 180,
            lat:this.toDegrees(rlat)
        }

    }

    private scale(pos: XY): XY {
        var width = this.xyWindow.bottomRight.x - this.xyWindow.topLeft.x
        var height = this.xyWindow.bottomRight.y - this.xyWindow.topLeft.y

        return {
            x: this.xyWindow.topLeft.x + (width * pos.x),
            y: this.xyWindow.topLeft.y + (height * pos.y)
        }
    }

    private toRadians(degree: number) {
        return degree * Math.PI / 180;
    }

    private toDegrees(radians: number) {
        return radians * 180 / Math.PI;
    }
}