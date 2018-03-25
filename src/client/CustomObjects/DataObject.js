//@ts-check

/**
 * JSON response data object
 * @typedef {Object} DataObject
 * @property {string[]} valueNames Axes names and additional properties
 * @property {[[]]} values Axis values and class name at the end
 */
var DataObject = (()=>{  
    return {
        valueNames: [],
        values: [[]]
    };
  })();
  
  export default DataObject;