//@ts-check

class Event{
    /**
     * @param {*} sender usually 'this'
     */
    constructor(sender){
        this.sender = sender;
        /** @type {Function[]} */
        this.listeners = [];
    }

    /**
     * Subscribe to be notified when event fires.
     * 
     * Note. Don't forget to bind listener to it's original object like this:  
     * someEvent.subscribe(someObject.callbackFunction.bind(someObject))
     * @param {function} listener
     */
    subscribe(listener) {
        this.listeners.push(listener);
    }

    /**
     * @param {function} listener
     */
    unsubscribe(listener) {
        const index = this.listeners.indexOf(listener);
        if(index > -1)
            this.listeners.splice(index, 1);
    }
    
    /**
     * Calls each function in listener list with specific event arguments
     * @param {*} eventArgs 
     */
    notify(eventArgs) {
        for(let i=0; i<this.listeners.length; i++){
            this.listeners[i](this.sender, eventArgs);
        }
    }
}

export default Event;