//@ts-check

/**
 * @module DataObject
 * @description JSON response data object
 * @property {string[]} valueNames Axes names and additional properties
 * @property {string[]} classes Class names
 * @property {Array[]} values Axis values. Last column is reserved for class names
 */
let DataObject = (()=>{
    return {
        valueNames: [],
        classes: [],
        values: [[]]
    };
  })();
  
  export default DataObject;