//ts-check
function Event(sender){
    this.sender = sender;
    this.listeners = [];
}

Event.prototype = {
    subscribe: function(listener) {
        this.listeners.push(listener);
    },
    notify: function(args) {
        for(let i=0; i<this.listeners.length; i++){
            this.listeners[i](this.sender, args);
        }
    }
}

module.exports = {Event};