//@ts-check

class HoveredOnPointEventArgs{
    constructor(toShow, mousePosition, index){
        this.toShow = toShow;
        this.mousePosition = mousePosition;
        this.index = index;
    }
    getToShow(){
        return this.toShow;
    }
    getMousePosition(){
        return this.mousePosition;
    }
    getIndex(){
        return this.index;
    }
}

export default HoveredOnPointEventArgs;