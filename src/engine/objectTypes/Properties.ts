import * as Enumerable from "linq"
export class Properties{
    private static ProductionPrefix = "production.";
    private static InventoryPrefix = "inventory.";

    public static ProductionPropertyName(resource:string){
        return this.ProductionPrefix + resource;
    }

    public static ProductionResourceName(property:string):string{
        return property.indexOf(this.ProductionPrefix) === 0
            ? property.substring(this.ProductionPrefix.length)
            : null;
    }

    public static IsProduction(property:string):boolean{
        return property.indexOf(this.ProductionPrefix) === 0
    }


    public static InventoryPropertyName(resource:string){
        return this.InventoryPrefix + resource;
    }

    public static InventoryResourceName(property:string):string{
        return property.indexOf(this.InventoryPrefix) === 0
            ? property.substring(this.InventoryPrefix.length)
            : null;
    }

    public static IsInventory(property:string):boolean{
        return property.indexOf(this.InventoryPrefix) === 0
    }
}

