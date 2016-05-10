export default class Hashtable<TKey,TValue> {
    public computeHashCode:(TKey)=>string
    private data = {};

    constructor(computeHashCode:(TKey)=>string = (key)=>{return key.toString()}){
        this.computeHashCode = computeHashCode;
    }



    public get(key:TKey):TValue{
        var hash = this.computeHashCode(key);
        return this.data[hash];
    }

    public put(key:TKey, value:TValue){
        var hash = this.computeHashCode(key);
        this.data[hash] = value;
    }

    public entries():{key:TKey; value:TValue}[]{
        var returnResult = [];
        for (var property in this.data) {
            if (this.data.hasOwnProperty(property)) {
                returnResult.push({key:property, value:this.data[property]});
            }
        }
        return returnResult;
    }


}
