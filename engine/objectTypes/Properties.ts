import * as Enumerable from "linq"
export class Properties{
    static Production = "production.";
    static Inventory = "inventory.";
    
    public static ProductionPropertyName(resource:string){
        return this.Production + resource;
    }

    public static ProductionResourceName(property:string):string{
        return property.indexOf(this.Production) === 0
            ? property.substring(this.Production.length)
            : null;
    }

    public static IsProduction(property:string):boolean{
        return property.indexOf(this.Production) === 0
    }


    public static InventoryPropertyName(resource:string){
        return this.Inventory + resource;
    }

    
    public static ResourceName(propertyName:string){
        var seperatorIndex = propertyName.indexOf(".");
        return propertyName.substring(seperatorIndex);
    }


}