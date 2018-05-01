//@ts-check

/**
 * @module Logger
 * @description Helper for server logging
 */
let Logger = (() => {
    let _loggerOn = false;

    return {

        /**
         * Prints out log message to console
         * @param {String} message Log message
         */
        log: message => {
            if (_loggerOn)
                console.log(message);
        },

        /**
         * Asserts errors for callbacks
         * @param {Error} error Error object
         * @param {string} actionDescription Error description
         */
        assertError: (error, actionDescription) => {
            if (!_loggerOn)
                return;
            if (error)
                console.log(`${actionDescription} - failed. ${error.message}`);
            else
                console.log(`${actionDescription} - successful`);
        },

        /**
         * Turns the logger on
         */
        turnOn: () => {
            _loggerOn = true
        }
    };
})();

export default Logger;