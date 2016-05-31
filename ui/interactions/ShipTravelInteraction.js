// import ShipDisplay from "../entities/ShipDisplay";
// import ShipTravelCommand from "../../engine/commands/ShipTravelCommand";
// export default class ShipTravelInteraction{
//     private isDragging = false;
//
//
//     constructor(public shipDisplay:ShipDisplay){
//         shipDisplay.interactive = true;
//         shipDisplay.on('mousedown', e=>this.startDrag(e));
//         shipDisplay.on('touchstart', e=>this.startDrag(e));
//
//         shipDisplay.on('mouseup', e=>this.stopDrag(e));
//         shipDisplay.on('touchend', e=>this.stopDrag(e));
//         shipDisplay.on('mouseupoutside', e=>this.stopDrag(e));
//         shipDisplay.on('touchendoutside', e=>this.stopDrag(e));
//
//         shipDisplay.on('mousemove', e=>this.doDrag(e));
//         shipDisplay.on('touchmove', e=>this.doDrag(e));
//     }
//
//     private startDrag(e){
//         e.stopPropagation();
//         this.isDragging = true;
//     }
//
//     private stopDrag(e){
//         e.stopPropagation();
//         this.isDragging = false;
//     }
//
//     private doDrag(e){
//
//         if(this.isDragging){
//             e.stopPropagation();
//             var worldDisplay = this.shipDisplay.worldDisplay;
//             var shipDisplay = this.shipDisplay;
//
//             var worldPoint = worldDisplay.toLocal(e.data.global);
//
//             var closestMarkerDisplay = worldDisplay.markerDisplays.findClosestMarkerDisplay(worldPoint);
//             if(closestMarkerDisplay) {
//
//                 var command = new ShipTravelCommand(shipDisplay.entity.id, closestMarkerDisplay.entity.id)
//                 worldDisplay.world.issueCommand(command)
//             }
//         }
//     }
//
//
// } 
//# sourceMappingURL=ShipTravelInteraction.js.map