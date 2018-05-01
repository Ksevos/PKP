//@ts-check

/**
 * Container for HoveredOnPoint arguments
 */
class HoveredOnPointEventArgs{
    constructor(toShow, mousePosition, index){
        this.toShow = toShow;
        this.mousePosition = mousePosition;
        this.index = index;
    }
    /**
     * To show or to hide
     * @returns {boolean}
     */
    getToShow(){
        return this.toShow;
    }
    /**
     * Mouse position
     * @returns {{x:number, y:number}}
     */
    getMousePosition(){
        return this.mousePosition;
    }
    /**
     * Point index in data array
     * @returns {number}
     */
    getIndex(){
        return this.index;
    }
}

export default HoveredOnPointEventArgs;