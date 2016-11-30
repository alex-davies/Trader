export interface XY{
    x: number;
    y: number;
}

export interface Dimension{
    width:number;
    height:number;
}

export interface Rect{
    x: number;
    y: number;
    width:number;
    height:number;
}




export default class Util{

    static EmptyObject = {};

    static constrain(input:number, min:number, max:number){
        return Math.max(Math.min(input, max), min);
    }

    static DegToRad(degrees:number){
        return degrees / 180 * Math.PI;
    }

    static RadToDeg(radians:number){
        return radians / Math.PI * 180;
    }
    
    // static TryResize(target:any, width:number, height:number){
    //     Util.TryCall(target, "resize", width, height);
    // }

    static TrySetRenderRect(target:any, rect:{x:number, y:number, width:number, height:number}){
        Util.TryCall(target, "setRenderRect", rect);
    }

    static TryCall(target:any, method:string, ...args:any[]):any{
        if(!target)
            return;
        let fn = target[method];
        if(typeof fn === "function"){
            return fn.apply(target, args);
        }
    }


    static FunctionName(fn: Function){
        if((<any>fn).name)
            return (<any>fn).name;

        //fallback for older JS which doesnt have a name proeprty
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec(fn.toString());
        if(results && results.length>1)
            return results[1];
        throw new Error("function does not have a name")
    }

    static HashCodeString(str:string) {
        var hash = 0, i, chr, len;
        if (str.length == 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };


}