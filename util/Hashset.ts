import {Change} from "./Change";
export default class Hashset<TValue> {
    public computeHashCode:(TValue)=>string
    private data = {};
    private length = 0;
    private listeners:((change: Change<TValue>) => void)[] = [];

    constructor(computeHashCode = (value)=>{return value.toString()}){
        this.computeHashCode = computeHashCode;
    }


    public put(...values:TValue[]){
        for(var i=0;i<values.length;i++){
            var hash = this.computeHashCode(values[i]);

            var change = {
                oldValue:null,
                newValue:values[i]
            }

            if(!this.containsHash(hash)) {
                this.data[hash] = values[i];
                this.length += 1;
            }
            else{
                change.oldValue = this.get(this.data[hash]);
                this.data[hash] = values[i];
            }

            this.fireChangeListeners(change);
        }
    }

    public putRange(values:TValue[]){
        this.put.apply(this, values);
    }

    public remove(...values:TValue[]){
        for(var i=0;i<values.length;i++) {
            var hash = this.computeHashCode(values[i]);

            if (this.containsHash(hash)) {
                var oldValue = this.data[hash];
                delete this.data[hash];
                this.length -= 1;
                this.fireChangeListeners({
                    oldValue:oldValue,
                    newValue:null
                });
            }
        }
    }

    public contains(value:TValue){
        return this.containsHash(this.computeHashCode(value));
    }

    public containsHash(hash:string){
        return Object.prototype.hasOwnProperty.call(this.data, hash);
    }

    public get(hash:string):TValue{
        return <TValue>this.data[hash];
    }

    public size(){
        return this.length;
    }

    public entries():TValue[]{
        var returnResult = [];
        for (var property in this.data) {
            if (Object.prototype.hasOwnProperty.call(this.data, property)) {
                returnResult.push(this.data[property]);
            }
        }
        return returnResult;
    }

    public forEach(fn:(obj:TValue)=>void):void{
        for (var property in this.data) {
            if (Object.prototype.hasOwnProperty.call(this.data, property)) {
                fn(this.data[property]);
            }
        }
    }

    public equals(other:Hashset<TValue>){
        if(this.size() != other.size())
            return false;

        for (var property in this.data) {
            if(this.containsHash(property) !== other.containsHash(property))
                return false;
        }

        return true;
    }

    public observe = (listener:(change: Change<TValue>) => void, suppressInit?:boolean)=>{
        this.listeners.push(listener);

        if(!suppressInit){
            var entries = this.entries();
            for(var i=0;i<entries.length;i++){
                listener({
                    oldValue:null,
                    newValue:entries[i]
                })
            }
        }

        return this;
    }

    public unobserve = (listener:(change: Change<TValue>) => void)=>{
        var index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
        return this;
    }

    private fireChangeListeners(change:Change<TValue>){
        for (var i=0; i < this.listeners.length; i++){
            this.listeners[i](change);
        }
    }


}

