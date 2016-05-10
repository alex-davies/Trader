export default class IdGenerator{
    countTracker = {};

    public getNext(prefix:string){
        var count = this.countTracker[prefix];
        if(!count) {
            count = 1;
        }
        this. countTracker[prefix] = count+1;
        return prefix+"-"+this.zeroPad(count,3);
    }

    private zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }
}