pc.extend(pc, (() => {
    const log = {
        /**
         * @private
         * @function
         * @name pc.log.write
         * @description Write text to the console
         * @param {String} text The text to log.
         */
        write(text) {
            console.log(text);
        },

        /**
         * @private
         * @function
         * @name pc.log.open
         * @description Starting logging to the console
         */
        open() {
            pc.log.write(`Powered by PlayCanvas ${pc.version} ${pc.revision}`);
        },

        /**
         * @private
         * @function
         * @name pc.log.info
         * @description Write text to the log preceded by 'INFO:'
         * @param {String} text The text to log.
         */
        info(text) {
            console.info(`INFO:    ${text}`);
        },

        /**
         * @private
         * @function
         * @name pc.log.debug
         * @description Write text to the log preceded by 'DEBUG:'
         * @param {String} text The text to log.
         */
        debug(text) {
            console.debug(`DEBUG:   ${text}`);
        },

        /**
         * @private
         * @function
         * @name pc.log.error
         * @description Write text to the log preceded by 'ERROR:'
         * @param {String} text The text to log.
         */
        error(text) {
            console.error(`ERROR:   ${text}`);
        },

        /**
         * @private
         * @function
         * @name pc.log.warning
         * @description Write text to the log preceded by 'WARNING:'
         * @param {String} text The text to log.
         */
        warning(text) {
            console.warn(`WARNING: ${text}`);
        },

        /**
         * @private
         * @function
         * @name pc.log.alert
         * @description Write text to the log preceded by 'ALERT:' and pop up an alert dialog box with the text
         * @param {String} text The text to show in the alert.
         */
        alert(text) {
            pc.log.write(`ALERT:   ${text}`);
            alert(text);
        },

        /**
         * @private
         * @function
         * @name pc.log.assert
         * @description If condition is false, then write text to the log preceded by 'ASSERT:' and pop up a dialog box.
         * @param {Boolean} condition The condition to test.
         * @param {String} text The text to show if the condition is false.
         */
        assert(condition, text) {
            if (condition === false) {
                pc.log.write(`ASSERT:  ${text}`);
                alert(`ASSERT failed: ${text}`);
            }
        }
    };

    return {
        log
    };
})());

// Shortcuts to logging functions
const logINFO = pc.log.info;
const logDEBUG = pc.log.debug;
const logWARNING = pc.log.warning;
const logERROR = pc.log.error;

const logALERT = pc.log.alert;
const logASSERT = pc.log.assert;
