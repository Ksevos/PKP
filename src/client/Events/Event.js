//@ts-check

class Event{
    /**
     * 
     * @param {object} sender 
     */
    constructor(sender){
        this.sender = sender;
        this.listeners = [];
    }

    /**
     * 
     * @param {function} listener 
     */
    subscribe(listener) {
        this.listeners.push(listener);
    }
    unsubscribe(listener) {
        const index = this.listeners.indexOf(listener);
        if(index > -1)
            this.listeners.splice(index, 1);
    }
    notify(eventArgs) {
        for(let i=0; i<this.listeners.length; i++){
            this.listeners[i](this.sender, eventArgs);
        }
    }
}

export default Event;