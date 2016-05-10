export default class EventUtil{
    public static addClickEvents(displayObject:PIXI.DisplayObject){

        //
        //
        //
        //displayObject.on('mousedown', e=>displayObject.emit('clickDown',e));
        //displayObject.on('touchstart', e=>displayObject.emit('clickDown',e));
        //
        //displayObject.on('mouseup', e=>displayObject.emit('clickUp',e));
        //displayObject.on('touchend', e=>displayObject.emit('clickUp',e));
        //
        //displayObject.on('mouseupoutside', e=>displayObject.emit('clickUp',e));
        //displayObject.on('touchendoutside', e=>displayObject.emit('clickUp',e));
        //

        var clickDown = (e_down)=>{

            var clickUp = e_up=>{
               displayObject.removeListener('mousemove', clickDrag);
               displayObject.removeListener('touchmove', clickDrag);
            }

            var clickDrag = e_drag=>{
                displayObject.emit('clickDrag',e_drag);
            }

            displayObject.once('mouseup', clickUp);
            displayObject.once('touchend', clickUp);
            displayObject.once('mouseupoutside', clickUp);
            displayObject.once('touchendoutside', clickUp);

            displayObject.on('mousemove', clickDrag);
            displayObject.on('touchmove', clickDrag);
        };

        displayObject.on('mousedown', clickDown);
        displayObject.on('touchstart', clickDown);
    }
}