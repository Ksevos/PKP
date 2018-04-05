//@ts-check

/**
 * JSON response data object
 * @typedef {Object} DataObject
 * @property {string[]} valueNames Axes names and additional properties
 * @property {string[]} classes Class names
 * @property {[[]]} values Axis values and class name at the end
 */
var DataObject = (()=>{  
    return {
        valueNames: [],
        classes: [],
        values: [[]]
    };
  })();
  
  export default DataObject;