//@ts-check

/**
 * Helper for server logging
 */
var Logger = (()=>{
    let _loggerOn = false;

    return {
        log: message => {
            if(_loggerOn) 
                console.log(message);
        },
        /**
         * Asserts errors for callbacks
         * @param error
         * @param {string} actionDescription
         */
        assertError: (error, actionDescription) => {
            if(!_loggerOn)
                return;
            if(error)
                console.log(`${actionDescription} - failed. ${error.message}`);
            else
                console.log(`${actionDescription} - successful`);
        },
        turnOn: () =>{_loggerOn = true}
    };
})();

export default Logger;