import {Change} from "./Change";
export interface Observable<T>{
    (val?: T): T;
    observe(listener:(change: Change<T>) => void) : Observable<T>
    unobserve(listener:(change: Change<T>) => void) : Observable<T>
}


export function generateObservable<T>(defaultValue?:T): Observable<T> {

    var value: T = defaultValue;
    var listeners:((change: Change<T>) => void)[] = [];

    var obs: any = function (newValue?:T) {

        //check on arguments to allow setting value to undefined
        if (arguments.length === 1 && value !== newValue) {

            var oldValue = value;
            value = newValue;

            if(listeners.length > 0) {
                var change = {
                    oldValue: oldValue,
                    newValue: newValue,
                }
                //notify listeners of the change
                for (var i=0; i < listeners.length; i++){
                    listeners[i](change);
                }
            }

        }

        return value;
    }

    obs.observe = (listener:(change: Change<T>) => void, suppressInit?:boolean)=>{
        listeners.push(listener);

        if(!suppressInit){
            listener({
                oldValue:null,
                newValue:obs()
            })
        }

        return obs;
    }

    obs.unobserve = (listener:(change: Change<T>) => void)=>{
        var index = listeners.indexOf(listener);
        if (index >= 0) {
            listeners.splice(index, 1);
        }
        return obs;
    }


    return obs;
}

