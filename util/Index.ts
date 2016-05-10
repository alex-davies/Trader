export default class Index<TKey, TValue>{
    lookup = {};
    dataSource : TValue[] | (()=>TValue[]);
    keyFetch : (item:TValue)=>TKey;
    keyIdGenerator:(TKey)=>string;

    constructor(dataSource :TValue[] | (()=>TValue[]), keyFetch:(item:TValue)=>TKey, keyIdGenerator:(TKey)=>string){
        this.dataSource = dataSource;
        this.keyFetch = keyFetch;
        this.keyIdGenerator = keyIdGenerator;

        this.reindex();
    }

    reindex(){
        var data = (this.dataSource instanceof Function)
            ? (<any>this).dataSource()
            : this.dataSource;

        this.lookup = {};
        for(var i=0;i<data.length;i++){
            var dataItem = data[i];
            var dataKey = this.keyFetch(dataItem);
            if(dataKey !== undefined){
                var dataKeyId = this.keyIdGenerator(dataKey);
                this.lookup[dataKeyId] = dataItem;
            }

        }
    }

    get(key:TKey):TValue{
        var keyId = this.keyIdGenerator(key);
        if(!Object.prototype.hasOwnProperty.call(this.lookup, keyId))
            return undefined;
        return this.lookup[keyId];
    }
}

