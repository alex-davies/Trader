declare namespace Tiled {
    interface Map {
        /***
         * Number of tile columns
         */
        width:number;

        /***
         * Number of tile rows
         */
        height:number;

        /***
         * Map grid width.
         */
        tilewidth:number;

        /***
         * Map grid height.
         */
        tileheight:number;

        /***
         * Orthogonal, isometric, or staggered
         */
        orientation:string;

        /***
         * Array of Layers
         */
        layers:Array<Layer>

        /***
         * Array of Tilesets
         */
        tilesets:Array<TileSet>

        /***
         * Hex-formatted color (#RRGGBB) (Optional)
         */
        backgroundcolor:string;

        /***
         * Rendering direction (orthogonal maps only)
         */
        renderorder:string

        /***
         * String key-value pairs
         */
        properties:{ [key:string]:any; };

        /***
         * Auto-increments for each placed object
         */
        nextobjectid:number;
    }

    interface Layer {

        /***
         * Column count. Same as map width in Tiled Qt.
         */
        width:number;

        /***
         * Row count. Same as map height in Tiled Qt.
         */
        height:number;

        /***
         * Name assigned to this layer
         */
        name:string;

        /***
         * "tilelayer", "objectgroup", or "imagelayer"
         */
            type:"tilelayer" | "objectgroup" | "imagelayer";

        /***
         * Whether layer is shown or hidden in editor
         */
        visible:boolean;

        /***
         * Horizontal layer offset. Always 0 in Tiled Qt.
         */
        x:number;

        /***
         * Vertical layer offset. Always 0 in Tiled Qt.
         */
        y:number;

        /***
         * Array of GIDs. tilelayer only.
         */
        data:Array<number>

        /***
         * Array of Objects. objectgroup only.
         */
        objects:Array<LayerObject>;

        /***
         * string key-value pairs.
         */
        properties:any

        /***
         * Value between 0 and 1
         */
        opacity:number

        /***
         * "topdown" (default) or "index". objectgroup only.
         */
        draworder:string
    }

    interface LayerObject {
        /***
         * Incremental id - unique across all objects
         */
        id:number;


        /***
         * Width in pixels. Ignored if using a gid.
         */
        width:number;


        /***
         * Height in pixels. Ignored if using a gid.
         */
        height:number;


        /***
         * String assigned to name field in editor
         */
        name:string;


        /***
         * String assigned to type field in editor
         */
         type:string;


        /***
         * String key-value pairs
         */
        properties:{ [key:string]:any; };


        /***
         * Whether object is shown in editor.
         */
        visible:boolean;


        /***
         * x coordinate in pixels
         */
        x:number;


        /***
         * y coordinate in pixels
         */
        y:number;


        /***
         * Angle in degrees clockwise
         */
        rotation:number;


        /***
         * GID, only if object comes from a Tilemap
         */
        gid:number;

    }

    interface TileSet {
        /***
         * GID corresponding to the first tile in the set
         */
        firstgid:number;


        /***
         * Image used for tiles in this set
         */
        image:string;


        /***
         * Name given to this tileset
         */
        name:string;


        /***
         * Maximum width of tiles in this set
         */
        tilewidth:number;


        /***
         * Maximum height of tiles in this set
         */
        tileheight:number;


        /***
         * Width of source image in pixels
         */
        imagewidth:number;


        /***
         * Height of source image in pixels
         */
        imageheight:number;


        /***
         * String key-value pairs
         */
        properties:{ [key:string]:any; };


        /***
         * Buffer between image edge and first tile (pixels)
         */
        margin:number;


        /***
         * Spacing between adjacent tiles in image (pixels)
         */
        spacing:number;


        /***
         * Per-tile properties, indexed by gid as string
         */
        tileproperties:{ [gid:string]:{ [key:string]:any; } };


        /***
         * Array of Terrains (optional)
         */
        terrains:{ [gid:string]:Terrain; };


        /***
         * Gid-indexed Tiles (optional)
         */
        tiles:{ [gid:string]:Tiles; };
    }

    interface Tiles {
        /***
         * index of terrain for each corner of tile
         */
        terrain:Array<number>;
    }

    interface Terrain {
        /***
         * Name of terrain
         */
        name:string;


        /***
         * Local ID of tile representing terrain
         */
        tile:number;
    }
}