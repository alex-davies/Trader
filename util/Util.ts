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
    
    


}