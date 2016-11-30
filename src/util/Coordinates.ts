export interface LatLng{
    lat: number;
    lng: number;
}

export interface XY{
    x: number;
    y: number;
}

export interface Dimension{
    width: number;
    height: number;
}

export interface Rect{
    x: number;
    y: number;
    width:number;
    height:number;
}

export class LatLngUtil {
    static distance(latlng1:LatLng, latlng2:LatLng):number{
        var dlat = latlng2.lat - latlng1.lat;
        var dlng = latlng2.lng -latlng1.lng;
        return Math.sqrt(dlat*dlat+dlng*dlng);
    }
}

export class XYUtil{
    static distance(xy1:XY, xy2:XY):number{
        var dx = xy2.x - xy1.x;
        var dy = xy2.y -xy1.y;
        return Math.sqrt(dx*dx+dy*dy);
    }

    static angleOfLine(xy1:XY, xy2:XY){
        var startRadians=Math.atan((xy2.y-xy1.y)/(xy2.x-xy1.x));
        startRadians+=((xy2.x>=xy1.x)?-90:90)*Math.PI/180;

        return startRadians;
    }

    static rotate(rad:number, center:XY, xys:XY[]):XY[]{
        var translated = []
        xys.forEach(xy=>{
            var x = xy.x - center.x;
            var y = xy.y - center.y;

            var tx = x * Math.cos(rad) - y * Math.sin(rad);
            var ty = y * Math.cos(rad) + x * Math.sin(rad);

            tx = tx + center.x;
            ty = ty + center.y;

            translated.push({
                x : tx,
                y : ty
            })
        })

        return translated;
    }


    static equals(xy1:XY, xy2:XY):boolean{
        return xy1 && xy2 && xy1.x === xy2.x && xy1.y === xy2.y
    }

    static scaleRect(rect:Rect, scale:XY | number, pivot:XY={x:rect.x+rect.width/2,y:rect.y+rect.height/2})
    {
        var xyScale = typeof scale === "number"
            ? {x:scale,y:scale}
            : scale;

        let p1 = {x:rect.x, y:rect.y};
        let p2 = {x:rect.x+rect.width, y:rect.y+rect.height};



        let scaled_p1 = {
            x:((p1.x - pivot.x) * xyScale.x) + pivot.x,
            y:((p1.y - pivot.y) * xyScale.y) + pivot.y
        };
        let scaled_p2 = {
            x:((p2.x - pivot.x) * xyScale.x) + pivot.x,
            y:((p2.y - pivot.y) * xyScale.y) + pivot.y
        };

        return {
            x:scaled_p1.x,
            y:scaled_p1.y,
            width:scaled_p2.x - scaled_p1.x,
            height:scaled_p2.y - scaled_p1.y
        };
    }
    
    
}